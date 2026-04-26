export type PracticeMode = 'standard' | 'competitive';

export interface Competition {
  competition_id: string;
  competition_name: string;
  year: number;
  country: string;
  winner_name: string;
  winner_single: number;
  winner_average: number | null;
  wr_single_at_time: number | null;
  wr_average_at_time: number | null;
  scramble_groups: Record<string, string[]>;
}

export interface CompetitiveSession {
  competition: Competition;
  groupId: string;
  scrambles: string[];
  currentIndex: number;
  solveTimesMs: number[];
}

export interface ComparisonOutcome {
  userBestSingleMs: number;
  userAverageMs: number | null;
  winnerSingleS: number;
  winnerAverageS: number | null;
  beatSingle: boolean;
  beatAverage: boolean | null;
  competitionName: string;
  competitionYear: number;
  winnerName: string;
}
