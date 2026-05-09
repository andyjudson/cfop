import re
from pathlib import Path

import pandas as pd

WCA_EXPORT_URL = "https://www.worldcubeassociation.org/export/results/v2/tsv"
WR_FILTER = "(regional_single_record == 'WR') | (regional_average_record == 'WR')"

CACHE_DIR = Path(__file__).parent.parent / ".cache"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def clean_name(name: str) -> str:
    return re.sub(r"\s*\([^)]+\)", "", str(name)).strip()


def load_wca_table(path: Path, filter_expr: str | None = None) -> pd.DataFrame:
    df = pd.read_csv(path, sep="\t", low_memory=False)
    if filter_expr:
        df = df[df.eval(filter_expr)]
    return df


# ---------------------------------------------------------------------------
# Raw loaders
# ---------------------------------------------------------------------------

def load_raw_results() -> pd.DataFrame:
    return load_wca_table(CACHE_DIR / "WCA_export_results.tsv", "event_id == '333'")


def load_raw_competitions() -> pd.DataFrame:
    return load_wca_table(CACHE_DIR / "WCA_export_competitions.tsv")


def load_raw_scrambles() -> pd.DataFrame:
    return load_wca_table(CACHE_DIR / "WCA_export_scrambles.tsv", "event_id == '333'")


def load_raw_championships() -> pd.DataFrame:
    return load_wca_table(CACHE_DIR / "WCA_export_championships.tsv")


# ---------------------------------------------------------------------------
# Parsed / joined views
# ---------------------------------------------------------------------------

def parse_results(filter_condition: str) -> pd.DataFrame:
    """Join 3x3x3 results with competition metadata and apply a filter."""
    df_comps = load_raw_competitions()[["id", "name", "country_id", "city_name", "year", "month", "day"]].copy()
    df_comps = df_comps.rename(columns={
        "id": "competition_id",
        "name": "competition_name",
        "country_id": "country",
        "city_name": "city",
    })
    df_comps["competition_date"] = pd.to_datetime(
        df_comps["year"].astype(str).str.zfill(4) + "-" +
        df_comps["month"].astype(str).str.zfill(2) + "-" +
        df_comps["day"].astype(str).str.zfill(2)
    )
    df_comps = df_comps.drop(columns=["year", "month", "day"])

    df_results = load_raw_results()
    df_results = df_results[df_results.eval(filter_condition)].copy()

    df = df_results.merge(df_comps, on="competition_id", how="left")
    df["single_seconds"] = df["best"] / 100.0
    df["average_seconds"] = df["average"] / 100.0
    df = df.rename(columns={"person_country_id": "person_country"})

    df = df[
        (df["single_seconds"] > 0) & (df["average_seconds"] > 0)
    ].copy()

    return df[[
        "person_id", "person_name", "person_country",
        "competition_id", "competition_name", "competition_date",
        "country", "city",
        "single_seconds", "average_seconds",
        "round_type_id", "regional_single_record", "regional_average_record",
    ]]


# ---------------------------------------------------------------------------
# WR progression
# ---------------------------------------------------------------------------

def compute_wr_progression(df: pd.DataFrame, record_type: str) -> pd.DataFrame:
    """
    Sort by competition_date, collapse to best time per day, compute cumulative
    minimum, keep only rows where a new WR was set.
    """
    if record_type == "single":
        time_col = "single_seconds"
        type_label = "Single WR"
    elif record_type == "average":
        time_col = "average_seconds"
        type_label = "Average WR"
    else:
        raise ValueError("record_type must be 'single' or 'average'")

    df = df.copy()
    df["time"] = df[time_col]

    # Best time per (date, person, competition)
    df = (
        df.groupby(["competition_date", "person_id", "competition_id", "competition_name", "person_name", "person_country"], as_index=False)
        .agg(time=("time", "min"))
    )

    df = df.sort_values("competition_date").reset_index(drop=True)

    # Cumulative minimum across all history
    df["cum_min"] = df["time"].cummin()

    # Previous cumulative minimum (lag)
    df["prev_cum_min"] = df["cum_min"].shift(1)

    # New WR = cumulative min changed
    df = df[df["cum_min"] != df["prev_cum_min"]].copy()

    df["time"] = df["cum_min"]
    df["type"] = type_label

    return df[["competition_date", "competition_id", "competition_name",
               "person_id", "person_name", "person_country", "time", "type"]]


def prepare_wr_evolution() -> pd.DataFrame:
    df_results = parse_results(WR_FILTER)

    singles = compute_wr_progression(
        df_results[df_results["regional_single_record"] == "WR"], "single"
    )
    averages = compute_wr_progression(
        df_results[df_results["regional_average_record"] == "WR"], "average"
    )

    df = pd.concat([singles, averages], ignore_index=True)
    # competition_date → Unix ms (datetime64[ms] → int64 is reliable across pandas versions)
    df["competition_date"] = (
        pd.to_datetime(df["competition_date"]).values.astype("datetime64[ms]").astype("int64")
    )
    return df


# ---------------------------------------------------------------------------
# WR legends
# ---------------------------------------------------------------------------

def prepare_wr_legends(df_wr: pd.DataFrame | None = None) -> pd.DataFrame:
    if df_wr is None:
        df_wr = prepare_wr_evolution()

    # competition_date in df_wr is already Unix ms; convert back to datetime for sorting
    df = df_wr.copy()
    df["_date"] = pd.to_datetime(df["competition_date"], unit="ms")

    df_sorted = df.sort_values("_date", ascending=False)

    current_single_id = df_sorted[df_sorted["type"] == "Single WR"].iloc[0]["person_id"]
    current_avg_id = df_sorted[df_sorted["type"] == "Average WR"].iloc[0]["person_id"]

    singles = df[df["type"] == "Single WR"]
    averages = df[df["type"] == "Average WR"]

    single_agg = singles.groupby("person_id").agg(
        single_wr_count=("time", "count"),
        best_single=("time", "min"),
    )
    avg_agg = averages.groupby("person_id").agg(
        average_wr_count=("time", "count"),
        best_average=("time", "min"),
    )
    meta = df.groupby("person_id").agg(
        person_name=("person_name", "first"),
        person_country=("person_country", "first"),
        last_wr_date=("competition_date", "max"),
    )

    summary = meta.join(single_agg, how="left").join(avg_agg, how="left")
    summary["single_wr_count"] = summary["single_wr_count"].fillna(0).astype(int)
    summary["average_wr_count"] = summary["average_wr_count"].fillna(0).astype(int)
    summary["total_wr_count"] = summary["single_wr_count"] + summary["average_wr_count"]
    summary["best_single"] = summary["best_single"].where(summary["best_single"].notna(), None)
    summary["best_average"] = summary["best_average"].where(summary["best_average"].notna(), None)
    summary["is_current_single"] = summary.index == current_single_id
    summary["is_current_avg"] = summary.index == current_avg_id
    summary["person_name"] = summary["person_name"].apply(clean_name)

    return (
        summary.reset_index(drop=True)
        .sort_values(["total_wr_count", "last_wr_date"], ascending=[False, False])
        [["person_name", "person_country", "last_wr_date",
          "single_wr_count", "average_wr_count", "total_wr_count",
          "best_single", "best_average", "is_current_single", "is_current_avg"]]
    )


# ---------------------------------------------------------------------------
# Beat the champion
# ---------------------------------------------------------------------------

_CHAMPIONSHIP_TYPES = [
    "world", "_Africa", "_Asia", "_Europe",
    "_North America", "_Oceania", "_South America",
]


def prepare_beat_the_champion(year: int = 2015) -> pd.DataFrame:
    df_results_raw = load_raw_results()
    df_competitions_raw = load_raw_competitions()
    df_championships_raw = load_raw_championships()
    df_scrambles_raw = load_raw_scrambles()

    # --- WR competition IDs ---
    wr_comp_ids = (
        df_results_raw[
            (df_results_raw["regional_single_record"] == "WR") |
            (df_results_raw["regional_average_record"] == "WR")
        ][["competition_id"]].drop_duplicates()
    )

    # --- Championship competition IDs from year onwards ---
    champ_ids = df_championships_raw[
        df_championships_raw["championship_type"].isin(_CHAMPIONSHIP_TYPES)
    ][["competition_id"]]
    year_comps = df_competitions_raw[df_competitions_raw["year"] >= year][["id"]].rename(
        columns={"id": "competition_id"}
    )
    champ_comp_ids = champ_ids.merge(year_comps, on="competition_id")[["competition_id"]].drop_duplicates()

    # --- Union qualifying competition IDs ---
    all_qualifying_ids = pd.concat([wr_comp_ids, champ_comp_ids]).drop_duplicates()

    # --- Competition dates as sortable integer YYYYMMDD ---
    comp_dates = df_competitions_raw[["id", "year", "month", "day"]].copy()
    comp_dates = comp_dates.rename(columns={"id": "competition_id"})
    comp_dates["comp_date"] = (
        comp_dates["year"] * 10000 +
        comp_dates["month"] * 100 +
        comp_dates["day"]
    )
    comp_dates = comp_dates[["competition_id", "comp_date"]]

    # --- All historical WR times with their competition date ---
    wr_history = df_results_raw[
        (df_results_raw["regional_single_record"] == "WR") |
        (df_results_raw["regional_average_record"] == "WR")
    ].merge(comp_dates.rename(columns={"competition_id": "wr_comp_id", "comp_date": "wr_date"}),
            left_on="competition_id", right_on="wr_comp_id")
    wr_history = wr_history[["wr_date", "regional_single_record", "regional_average_record", "best", "average"]].copy()
    wr_history["wr_single_val"] = wr_history.apply(
        lambda r: r["best"] / 100.0 if r["regional_single_record"] == "WR" else None, axis=1
    )
    wr_history["wr_avg_val"] = wr_history.apply(
        lambda r: r["average"] / 100.0 if r["regional_average_record"] == "WR" else None, axis=1
    )

    # --- Finals results for qualifying competitions (valid times only) ---
    df_finals = df_results_raw[
        (df_results_raw["round_type_id"] == "f") & (df_results_raw["best"] > 0)
    ].merge(all_qualifying_ids, on="competition_id")

    # --- Winner per competition: lowest single time, row_number breaks ties ---
    df_finals_sorted = df_finals.sort_values("best").copy()
    df_winners = df_finals_sorted.groupby("competition_id", as_index=False).first()

    # --- Enrich winners with competition metadata ---
    comp_meta = df_competitions_raw[["id", "name", "country_id", "year", "month", "day"]].rename(
        columns={"id": "competition_id", "name": "competition_name", "country_id": "country"}
    )
    df_winners = df_winners.merge(comp_meta, on="competition_id").merge(comp_dates, on="competition_id")
    df_winners["winner_single"] = df_winners["best"] / 100.0
    df_winners["winner_average"] = df_winners["average"].apply(
        lambda v: v / 100.0 if pd.notna(v) and v > 0 else None
    )
    df_winners = df_winners.rename(columns={"person_name": "winner_name"})

    # --- WR at time of each competition ---
    wr_single_hist = wr_history[wr_history["wr_single_val"].notna()][["wr_date", "wr_single_val"]]
    wr_avg_hist = wr_history[wr_history["wr_avg_val"].notna()][["wr_date", "wr_avg_val"]]

    single_at_time = (
        df_winners[["competition_id", "comp_date"]]
        .merge(wr_single_hist, how="cross")
        .query("comp_date >= wr_date")
        .groupby("competition_id", as_index=False)["wr_single_val"].min()
        .rename(columns={"wr_single_val": "wr_single_at_time"})
    )
    avg_at_time = (
        df_winners[["competition_id", "comp_date"]]
        .merge(wr_avg_hist, how="cross")
        .query("comp_date >= wr_date")
        .groupby("competition_id", as_index=False)["wr_avg_val"].min()
        .rename(columns={"wr_avg_val": "wr_average_at_time"})
    )

    df_winners = (
        df_winners
        .merge(single_at_time, on="competition_id", how="left")
        .merge(avg_at_time, on="competition_id", how="left")
    )

    # --- Scrambles for qualifying competitions ---
    df_scrambles = (
        df_scrambles_raw[
            (df_scrambles_raw["round_type_id"] == "f") &
            (df_scrambles_raw["is_extra"].astype(str) == "0")
        ].merge(all_qualifying_ids, on="competition_id")
        .sort_values(["competition_id", "group_id", "scramble_num"])
    )

    scrambles_index: dict = {}
    for _, row in df_scrambles.iterrows():
        cid, gid, scr = row["competition_id"], row["group_id"], row["scramble"]
        scrambles_index.setdefault(cid, {}).setdefault(gid, []).append(scr)

    # --- Filter winners to competitions with scramble data ---
    df_winners = df_winners[df_winners["competition_id"].isin(scrambles_index)].copy()
    df_winners["winner_name"] = df_winners["winner_name"].apply(clean_name)
    df_winners["scramble_groups"] = df_winners["competition_id"].map(scrambles_index)

    # competition_date as Unix ms (same unit as wca-wr-evolution.json)
    df_winners["competition_date"] = (
        pd.to_datetime(
            df_winners["year"].astype(str).str.zfill(4) + "-" +
            df_winners["month"].astype(str).str.zfill(2) + "-" +
            df_winners["day"].astype(str).str.zfill(2)
        ).values.astype("datetime64[ms]").astype("int64")
    )

    return (
        df_winners[["competition_date", "competition_id", "competition_name",
                     "year", "month", "day", "country",
                     "winner_name", "winner_single", "winner_average",
                     "wr_single_at_time", "wr_average_at_time", "scramble_groups"]]
        .sort_values("competition_date", ascending=False)
        .reset_index(drop=True)
    )


def parse_scrambles() -> pd.DataFrame:
    df = load_raw_scrambles()
    df = df[
        (df["round_type_id"] == "f") & (df["is_extra"].astype(str) == "0")
    ][["id", "competition_id", "scramble", "group_id", "scramble_num"]].copy()
    return df
