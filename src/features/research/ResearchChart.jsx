import { useId } from 'react';

export default function ResearchChart({ points, series, compact = false, title }) {
  const titleId = useId();
  const width = compact ? 320 : 880;
  const height = compact ? 130 : 315;
  const left = compact ? 34 : 55;
  const right = width - 17;
  const top = compact ? 12 : 27;
  const bottom = height - (compact ? 26 : 45);
  const max = points.reduce((largest, row) => Math.max(largest, ...series.map(item => row[item.id])), 0);
  const step = Math.max(1, Math.ceil(max / 4));
  const y = value => bottom - value / (4 * step) * (bottom - top);
  const x = i => points.length === 1 ? (left + right) / 2 : left + i * (right - left) / (points.length - 1);
  const labelStep = Math.max(1, Math.ceil((points.length - 1) / 7));

  return <svg className={compact ? 'research-sparkline' : 'research-line-chart'} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={titleId}>
    <title id={titleId}>{title}</title>
    {(compact ? [0, 4 * step] : [0, step, step * 2, step * 3, step * 4]).map(value => <g key={value}>
      <line x1={left} y1={y(value)} x2={right} y2={y(value)} stroke="#dfe4f0" />
      <text x={left - 7} y={y(value) + 4} textAnchor="end">{value}</text>
    </g>)}
    {!compact && <><text x={left} y="15">Jumlah entri</text><text x={right} y={height - 3} textAnchor="end">Tahun</text></>}
    {points.map(({ year }, i) => (compact ? i === 0 || i === points.length - 1 : i === points.length - 1 || (i % labelStep === 0 && i < points.length - labelStep / 2)) &&
      <text key={year} x={x(i)} y={bottom + 17} textAnchor={i === points.length - 1 ? 'end' : i === 0 ? 'start' : 'middle'}>{year}</text>)}
    {series.map(item => <g key={item.id}>
      {compact && points.length > 1 && <polygon fill={item.color} fillOpacity=".12" points={`${x(0)},${bottom} ${points.map((row, i) => `${x(i)},${y(row[item.id])}`).join(' ')} ${x(points.length - 1)},${bottom}`} />}
      <polyline fill="none" stroke={item.color} strokeWidth={compact ? 2.5 : 3} strokeDasharray={compact ? undefined : item.dash}
        strokeLinejoin="round" strokeLinecap="round" points={points.map((row, i) => `${x(i)},${y(row[item.id])}`).join(' ')} />
      {points.map((row, i) => <circle key={row.year} cx={x(i)} cy={y(row[item.id])} r={compact ? (i === points.length - 1 ? 3 : 1.5) : 3} fill={item.color}>
        <title>{item.label} · {row.year} · {row[item.id]} entri</title>
      </circle>)}
    </g>)}
  </svg>;
}
