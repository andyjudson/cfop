import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import './WrEvolutionChart.css';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface WrRawRecord {
  competition_date: number;
  competition_id: string;
  competition_name: string;
  person_id: string;
  person_name: string;
  person_country: string;
  time: number;
  type: 'Single WR' | 'Average WR';
}

interface WrRecord {
  date: number;
  time: number;
  personName: string;
  personCountry: string;
  competitionId: string;
  competitionName: string;
  formattedDate: string;
  flagEmoji: string;
}

// Unified chart data point — both series share one sorted array on <LineChart>
interface ChartPoint {
  date: number;
  singleTime?: number;
  averageTime?: number;
  singleRecord?: WrRecord;  // only present at actual Single WR record dates
  averageRecord?: WrRecord; // only present at actual Average WR record dates
}


// ── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const COUNTRY_FLAGS: Record<string, string> = {
  Japan: '🇯🇵',
  France: '🇫🇷',
  USA: '🇺🇸',
  Finland: '🇫🇮',
  Netherlands: '🇳🇱',
  Australia: '🇦🇺',
  Poland: '🇵🇱',
  Korea: '🇰🇷',
  China: '🇨🇳',
};

// ── Utilities ─────────────────────────────────────────────────────────────────

export function parseNdjson(text: string): WrRawRecord[] {
  return text
    .split('\n')
    .filter(line => line.trim().length > 0)
    .flatMap(line => {
      try {
        return [JSON.parse(line) as WrRawRecord];
      } catch {
        return [];
      }
    });
}

function normaliseRecord(raw: WrRawRecord): WrRecord {
  const d = new Date(raw.competition_date);
  return {
    date: raw.competition_date,
    time: raw.time,
    personName: raw.person_name.replace(/\s*\([^)]+\)/, '').trim(),
    personCountry: raw.person_country,
    competitionId: raw.competition_id,
    competitionName: raw.competition_name,
    formattedDate: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
    flagEmoji: COUNTRY_FLAGS[raw.person_country] ?? '',
  };
}

function resolveTokenColour(token: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim();
}

/**
 * Merge two WrRecord series into a single date-sorted ChartPoint array.
 * Each series is forward-filled at every date from the other series so that
 * stepAfter lines hold their value horizontally across gaps instead of
 * interpolating diagonally (which connectNulls would otherwise produce).
 */
function buildChartData(singleData: WrRecord[], averageData: WrRecord[]): ChartPoint[] {
  const map = new Map<number, ChartPoint>();

  for (const r of singleData) {
    const pt = map.get(r.date) ?? { date: r.date };
    pt.singleTime = r.time;
    pt.singleRecord = r;
    map.set(r.date, pt);
  }

  for (const r of averageData) {
    const pt = map.get(r.date) ?? { date: r.date };
    pt.averageTime = r.time;
    pt.averageRecord = r;
    map.set(r.date, pt);
  }

  const sorted = Array.from(map.values()).sort((a, b) => a.date - b.date);

  // Forward-fill: propagate the last known value for each series at every point
  // so stepAfter lines stay flat across gaps rather than interpolating diagonally.
  let lastSingle: number | undefined;
  let lastAverage: number | undefined;
  for (const pt of sorted) {
    if (pt.singleTime !== undefined) lastSingle = pt.singleTime;
    else if (lastSingle !== undefined) pt.singleTime = lastSingle;

    if (pt.averageTime !== undefined) lastAverage = pt.averageTime;
    else if (lastAverage !== undefined) pt.averageTime = lastAverage;
  }

  return sorted;
}

// ── Tooltip ───────────────────────────────────────────────────────────────────

function WrTooltipContent({ active, payload }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  const activeEntries = payload.filter((e) => e.value != null);
  if (!activeEntries.length) return null;

  return (
    <div className="wr-tooltip">
      {activeEntries.map((entry, i) => {
        const pt = entry.payload as ChartPoint;
        const record = (entry.dataKey as string) === 'singleTime' ? pt.singleRecord : pt.averageRecord;
        const val = entry.value;
        const time = typeof val === 'number' ? val.toFixed(2) : String(val ?? '');
        return (
          <div key={i} className="wr-tooltip-entry">
            <div className="wr-tooltip-series" style={{ color: entry.color }}>{String(entry.name ?? '')}</div>
            <div className="wr-tooltip-time">{time}s</div>
            {record && (
              <>
                <div className="wr-tooltip-person">
                  {record.flagEmoji} {record.personName} · {record.personCountry}
                </div>
                <div className="wr-tooltip-meta">{record.competitionName}</div>
                <div className="wr-tooltip-meta">{record.formattedDate}</div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface WrEvolutionChartProps {
  records: WrRawRecord[];
}

export function WrEvolutionChart({ records }: WrEvolutionChartProps) {
  const singleData = useMemo(
    () => records.filter(r => r.type === 'Single WR').map(normaliseRecord),
    [records],
  );
  const averageData = useMemo(
    () => records.filter(r => r.type === 'Average WR').map(normaliseRecord),
    [records],
  );

  const colours = useMemo(() => ({
    single: resolveTokenColour('--color-accent-primary'),
    average: resolveTokenColour('--color-accent-warm'),
    grid: resolveTokenColour('--color-border-light'),
  }), []);

  const chartData = useMemo(
    () => buildChartData(singleData, averageData),
    [singleData, averageData],
  );

  // Explicit Y max across both series — 'dataMax + 1' only scans the first dataKey in v3
  const yMax = useMemo(() => {
    if (!chartData.length) return 20;
    let max = 0;
    for (const pt of chartData) {
      if ((pt.singleTime ?? 0) > max) max = pt.singleTime!;
      if ((pt.averageTime ?? 0) > max) max = pt.averageTime!;
    }
    return Math.ceil(max) + 1;
  }, [chartData]);

  // One tick per 2 years, aligned to even years, avoids duplicate year labels
  const xTicks = useMemo(() => {
    if (!chartData.length) return [];
    const minYear = new Date(chartData[0].date).getFullYear();
    const maxYear = new Date(chartData[chartData.length - 1].date).getFullYear();
    const ticks: number[] = [];
    const start = Math.ceil(minYear / 2) * 2;
    for (let y = start; y <= maxYear; y += 2) {
      ticks.push(Date.UTC(y, 0, 1));
    }
    return ticks;
  }, [chartData]);

  return (
    <div className="wr-chart-container">
      <ResponsiveContainer width="100%" aspect={2.2}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={colours.grid} />
          <XAxis
            dataKey="date"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            ticks={xTicks}
            tickFormatter={(v: number) => new Date(v).getFullYear().toString()}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: colours.grid }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => `${v}s`}
            domain={[0, yMax]}
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
            axisLine={{ stroke: colours.grid }}
            tickLine={false}
            width={36}
          />
          <Tooltip content={WrTooltipContent} />
          <Legend wrapperStyle={{ fontSize: '13px', color: 'var(--color-text-secondary)' }} />
          <Line
            type="stepAfter"
            dataKey="singleTime"
            name="Single WR"
            stroke={colours.single}
            strokeWidth={2}
            dot={{ r: 3, fill: colours.single, strokeWidth: 0 }}
            activeDot={{ r: 5 }}

          />
          <Line
            type="stepAfter"
            dataKey="averageTime"
            name="Average WR"
            stroke={colours.average}
            strokeWidth={2}
            dot={{ r: 3, fill: colours.average, strokeWidth: 0 }}
            activeDot={{ r: 5 }}

          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
