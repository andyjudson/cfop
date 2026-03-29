import type { Competition } from '../types/competition';

let cache: Competition[] | null = null;

function parseNdjson(text: string): unknown[] {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function isValidCompetition(record: unknown): record is Competition {
  if (typeof record !== 'object' || record === null) return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.competition_id === 'string' &&
    typeof r.competition_name === 'string' &&
    typeof r.year === 'number' &&
    typeof r.country === 'string' &&
    typeof r.winner_name === 'string' &&
    typeof r.winner_single === 'number' &&
    (r.winner_average === null || typeof r.winner_average === 'number') &&
    (r.wr_single_at_time === null || typeof r.wr_single_at_time === 'number') &&
    (r.wr_average_at_time === null || typeof r.wr_average_at_time === 'number') &&
    typeof r.scramble_groups === 'object' &&
    r.scramble_groups !== null
  );
}

export async function loadCompetitions(): Promise<Competition[]> {
  if (cache !== null) return cache;

  const url = import.meta.env.BASE_URL + 'data/wca-beat-the-champion.json';
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load competition data: ${res.status}`);

  const text = await res.text();
  if (text.trimStart().startsWith('<')) throw new Error('Competition data file not found');

  const records = parseNdjson(text);
  const competitions = records.filter(isValidCompetition);

  if (competitions.length === 0) throw new Error('No valid competition data parsed');

  cache = competitions;
  return cache;
}

export function pickRandomGroup(competition: Competition): { groupId: string; scrambles: string[] } {
  const groupIds = Object.keys(competition.scramble_groups);
  const groupId = groupIds[Math.floor(Math.random() * groupIds.length)];
  return { groupId, scrambles: competition.scramble_groups[groupId] };
}
