export type PracticeMode = 'standard' | 'competitive';

export interface Competition {
  competition_id: string;
  competition_name: string;
  year: number;
  country: string;
  tier: 'wr' | 'championship';
  winner_name: string;
  winner_single: number;
  winner_average: number | null;
  wr_single: number | null;
  wr_average: number | null;
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
  wrSingleS: number | null;
  wrAverageS: number | null;
  beatSingle: boolean;
  beatAverage: boolean | null;
  competitionName: string;
  winnerName: string;
}
