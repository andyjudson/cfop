import json
import re
import zipfile
from datetime import datetime, timezone
from pathlib import Path

import requests

WCA_EXPORT_URL = "https://www.worldcubeassociation.org/export/results/v2/tsv"


def download_wca_export(dest_path: Path) -> dict:
    """Download and extract the WCA TSV export into dest_path. Returns metadata dict."""
    dest_path.mkdir(parents=True, exist_ok=True)

    with requests.get(WCA_EXPORT_URL, stream=True) as r:
        r.raise_for_status()
        filename = Path(r.url).name
        tmp_path = dest_path / (filename + ".tmp")
        zip_path = dest_path / filename

        with open(tmp_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    f.write(chunk)

        tmp_path.rename(zip_path)

    with zipfile.ZipFile(zip_path, "r") as z:
        z.extractall(dest_path)

    metadata_path = dest_path / "metadata.json"
    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    zip_path.unlink(missing_ok=True)
    return metadata


def check_freshness(cache_dir: Path) -> tuple[bool, str | None]:
    """
    Check whether the local cache already holds the latest WCA export.

    Returns (is_fresh, remote_ts):
      - is_fresh=True  → cache is up to date, skip download
      - is_fresh=False → cache is stale or absent, download needed
      - remote_ts is the timestamp string from the Location header (or None on failure)
    """
    resp = requests.head(WCA_EXPORT_URL, allow_redirects=False)
    location = resp.headers.get("Location", "")
    match = re.search(r"_(\d{8}T\d{6}Z)\.tsv\.zip", location)
    remote_ts = match.group(1) if match else None

    metadata_path = cache_dir / "metadata.json"
    if not metadata_path.exists():
        return False, remote_ts

    with open(metadata_path, "r", encoding="utf-8") as f:
        metadata = json.load(f)

    export_date = metadata.get("export_date", "")
    if remote_ts and export_date:
        try:
            remote_dt = datetime.strptime(remote_ts, "%Y%m%dT%H%M%SZ").replace(tzinfo=timezone.utc)
            # metadata may be "2026-03-15 00:00:29 UTC" or "2026-03-15T00:00:29Z"
            normalized = export_date.replace(" UTC", "Z").replace(" ", "T")
            local_dt = datetime.strptime(normalized, "%Y-%m-%dT%H:%M:%SZ").replace(tzinfo=timezone.utc)
            is_fresh = remote_dt == local_dt
        except ValueError:
            is_fresh = False
    else:
        is_fresh = False

    return is_fresh, remote_ts
