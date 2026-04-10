import { useState, useMemo } from 'react';
import { MdStar } from 'react-icons/md';
import './WrLegendsTable.css';

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

// Matches wca-wr-legends.json output schema from export_wr_legends()
export interface WrLegend {
  person_id: string;
  person_name: string;
  person_country: string;
  total_wr_count: number;
  single_wr_count: number;
  average_wr_count: number;
  best_single: number | null;
  best_average: number | null;
  last_wr_date: number;
  is_current_single: boolean;
  is_current_avg: boolean;
}

type SortKey = 'name' | 'total_wr_count' | 'best_single' | 'best_average' | 'last_wr_date';
type SortDir = 'asc' | 'desc';

interface WrLegendsTableProps {
  legends: WrLegend[];
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className="wr-sort-indicator wr-sort-inactive">⇅</span>;
  return <span className="wr-sort-indicator">{dir === 'asc' ? '▲' : '▼'}</span>;
}

export function WrLegendsTable({ legends }: WrLegendsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('total_wr_count');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  }

  const sorted = useMemo(() => {
    const since2015 = new Date('2015-01-01').getTime();
    return [...legends].filter(l => l.last_wr_date >= since2015).sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') {
        return dir * a.person_name.localeCompare(b.person_name);
      }
      if (sortKey === 'total_wr_count') {
        const diff = a.total_wr_count - b.total_wr_count;
        return diff !== 0 ? dir * diff : dir * (a.last_wr_date - b.last_wr_date);
      }
      if (sortKey === 'best_single') {
        if (a.best_single === null && b.best_single === null) return 0;
        if (a.best_single === null) return 1;
        if (b.best_single === null) return -1;
        return dir * (a.best_single - b.best_single);
      }
      if (sortKey === 'best_average') {
        if (a.best_average === null && b.best_average === null) return 0;
        if (a.best_average === null) return 1;
        if (b.best_average === null) return -1;
        return dir * (a.best_average - b.best_average);
      }
      if (sortKey === 'last_wr_date') {
        return dir * (a.last_wr_date - b.last_wr_date);
      }
      return 0;
    });
  }, [legends, sortKey, sortDir]);

  function th(key: SortKey, label: string) {
    return (
      <th
        className={`wr-th-sortable${sortKey === key ? ' wr-th-active' : ''}`}
        onClick={() => handleSort(key)}
      >
        {label} <SortIndicator active={sortKey === key} dir={sortDir} />
      </th>
    );
  }

  return (
    <div className="wr-legends-table-wrap">
      <table className="wr-legends-table">
        <thead>
          <tr>
            {th('name', 'Name')}
            <th>Country</th>
            {th('total_wr_count', 'WRs')}
            {th('best_single', 'Single')}
            {th('best_average', 'Average')}
            {th('last_wr_date', 'Last WR')}
          </tr>
        </thead>
        <tbody>
          {sorted.slice(0, 20).map(leg => (
            <tr key={leg.person_id}>
              <td className="wr-td-name">{leg.person_name}</td>
              <td className="wr-td-country">
                {COUNTRY_FLAGS[leg.person_country] ?? ''} {leg.person_country}
              </td>
              <td className="wr-td-num">{leg.total_wr_count}</td>
              <td className={`wr-td-num${leg.is_current_single ? ' wr-td-current' : ''}`}>
                {leg.best_single !== null ? (
                  <span className="wr-td-cell">{leg.best_single.toFixed(2)}{leg.is_current_single && <MdStar className="wr-star" />}</span>
                ) : '—'}
              </td>
              <td className={`wr-td-num${leg.is_current_avg ? ' wr-td-current' : ''}`}>
                {leg.best_average !== null ? (
                  <span className="wr-td-cell">{leg.best_average.toFixed(2)}{leg.is_current_avg && <MdStar className="wr-star" />}</span>
                ) : '—'}
              </td>
              <td className="wr-td-num wr-td-date">
                {new Date(leg.last_wr_date).getFullYear()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
