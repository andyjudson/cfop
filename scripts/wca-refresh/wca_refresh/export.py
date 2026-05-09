from pathlib import Path

import pandas as pd

from wca_refresh.transforms import (
    prepare_beat_the_champion,
    prepare_wr_evolution,
    prepare_wr_legends,
)


def diff_summary(output_path: Path, new_count: int) -> str:
    if output_path.exists():
        with open(output_path, "r", encoding="utf-8") as f:
            old_count = sum(1 for line in f if line.strip())
    else:
        old_count = 0
    delta = new_count - old_count
    if delta == 0:
        return "no change"
    sign = "+" if delta > 0 else ""
    return f"{sign}{delta} new"


def _write_atomic(df: pd.DataFrame, output_path: Path) -> None:
    tmp = output_path.with_suffix(".tmp")
    df.to_json(tmp, orient="records", lines=True)
    tmp.rename(output_path)


def export_wr_evolution(dest_path: Path) -> tuple[int, str]:
    output_path = dest_path / "wca-wr-evolution.json"
    df = prepare_wr_evolution()
    df = df.sort_values("competition_date", ascending=False).reset_index(drop=True)
    count = len(df)
    diff = diff_summary(output_path, count)
    _write_atomic(df, output_path)
    return count, diff


def export_wr_legends(dest_path: Path) -> tuple[int, str]:
    output_path = dest_path / "wca-wr-legends.json"
    df = prepare_wr_legends()
    count = len(df)
    diff = diff_summary(output_path, count)
    _write_atomic(df, output_path)
    return count, diff


def export_beat_the_champion(dest_path: Path, year: int = 2015) -> tuple[int, str]:
    output_path = dest_path / "wca-beat-the-champion.json"
    df = prepare_beat_the_champion(year=year)
    count = len(df)
    diff = diff_summary(output_path, count)
    _write_atomic(df, output_path)
    return count, diff
