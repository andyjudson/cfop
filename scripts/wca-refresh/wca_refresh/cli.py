import json
from pathlib import Path
from typing import Annotated

import typer
from rich.console import Console
from rich.table import Table

from wca_refresh.download import WCA_EXPORT_URL, check_freshness, download_wca_export
from wca_refresh.export import (
    export_beat_the_champion,
    export_wr_evolution,
    export_wr_legends,
)

app = typer.Typer(help="Refresh WCA data for cfop-app.", add_completion=False)
console = Console()

CACHE_DIR = Path(__file__).parent.parent / ".cache"
DATA_DIR = Path(__file__).parents[3] / "cfop-app" / "public" / "data"


@app.command()
def main(
    force: Annotated[bool, typer.Option("--force/--no-force", help="Force download even if cache is fresh.")] = False,
    no_download: Annotated[bool, typer.Option("--no-download", help="Skip download, use existing cache.")] = False,
    dry_run: Annotated[bool, typer.Option("--dry-run", help="Run transforms but do not write output files.")] = False,
    year: Annotated[int, typer.Option(help="Earliest year for championship competitions.")] = 2015,
) -> None:
    if force and no_download:
        raise typer.BadParameter("--force and --no-download are mutually exclusive.")

    # --- Freshness check / download ---
    if no_download:
        console.print("[dim]Skipping download (--no-download).[/dim]")
    else:
        is_fresh, remote_ts = check_freshness(CACHE_DIR)
        if is_fresh and not force:
            console.print(f"[green]Cache is up to date[/green] (export {remote_ts}). Skipping download.")
        else:
            reason = "forced" if force else f"remote export {remote_ts} is newer"
            console.print(f"[yellow]Downloading WCA export[/yellow] ({reason})…")
            metadata = download_wca_export(CACHE_DIR)
            console.print(f"[green]Downloaded.[/green] Export date: [bold]{metadata.get('export_date', 'unknown')}[/bold]")

    _print_cache_status()

    # --- Run exports ---
    if dry_run:
        console.print("\n[dim]Dry run — computing transforms only, no files written.[/dim]")
        _run_exports(DATA_DIR, year, dry_run=True)
        console.print("\n[yellow]Dry run — no files written.[/yellow]")
    else:
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        _run_exports(DATA_DIR, year, dry_run=False)
        console.print(f"\n[green]Done.[/green] Files written to [bold]{DATA_DIR}[/bold]")


def _print_cache_status() -> None:
    metadata_path = CACHE_DIR / "metadata.json"
    if metadata_path.exists():
        with open(metadata_path, "r", encoding="utf-8") as f:
            metadata = json.load(f)
        console.print(f"Cache export date: [bold]{metadata.get('export_date', 'unknown')}[/bold]")
    else:
        console.print("[dim]No cache found.[/dim]")


def _run_exports(dest_path: Path, year: int, dry_run: bool) -> None:
    table = Table(title="Export results", show_header=True)
    table.add_column("File")
    table.add_column("Records", justify="right")
    table.add_column("Diff")

    results = [
        ("wca-wr-evolution.json", lambda: export_wr_evolution(dest_path)),
        ("wca-wr-legends.json", lambda: export_wr_legends(dest_path)),
        ("wca-beat-the-champion.json", lambda: export_beat_the_champion(dest_path, year=year)),
    ]

    for filename, export_fn in results:
        if dry_run:
            table.add_row(filename, "—", "dry run")
        else:
            count, diff = export_fn()
            table.add_row(filename, str(count), diff)

    console.print()
    console.print(table)
