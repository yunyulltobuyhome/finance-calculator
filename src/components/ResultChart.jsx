import { useId } from 'react'

// Dependency-free SVG charts. No chart library, no external requests, no data
// leaves the browser — the whole thing is derived from numbers the user typed.
// Rendered with a fixed viewBox and w-full so they scale on mobile without
// distorting the label text.

const AXIS = '#9ca3af'   // gray-400
const GRID = '#f1f2f6'

// Downsample a month-by-month trace (loan balance, portfolio value...) to ~40
// points so it can be charted without emitting a 1,200-node path.
export function toSeries(monthly) {
  if (!Array.isArray(monthly) || monthly.length < 2) return []
  const totalMonths = monthly.length - 1
  const label = (i) => (totalMonths >= 24 ? `${Math.round(i / 12)}y` : `${i}m`)
  const step = Math.max(1, Math.ceil(monthly.length / 40))
  const out = []
  for (let i = 0; i < monthly.length; i += step) {
    out.push({ label: label(i), value: Math.round(monthly[i]) })
  }
  // Always land on the final point — that's the moment the balance hits zero.
  if (out.length && out[out.length - 1].value !== Math.round(monthly[totalMonths])) {
    out.push({ label: label(totalMonths), value: Math.round(monthly[totalMonths]) })
  }
  return out
}

// Area + line chart of a single series over time (portfolio growth, loan
// balance running down, debt payoff curve...).
export function GrowthChart({ data, format = (v) => v, caption, color = '#4f46e5', ariaLabel }) {
  const gradId = useId()
  if (!Array.isArray(data) || data.length < 2) return null

  const W = 600, H = 210
  const PAD_L = 10, PAD_R = 10, PAD_T = 14, PAD_B = 30
  const innerW = W - PAD_L - PAD_R
  const innerH = H - PAD_T - PAD_B

  const values = data.map(d => d.value)
  const max = Math.max(...values)
  const min = Math.min(0, ...values)
  const span = max - min || 1

  const x = (i) => PAD_L + (innerW * i) / (data.length - 1)
  const y = (v) => PAD_T + innerH - (innerH * (v - min)) / span

  const line = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`)
    .join(' ')
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(PAD_T + innerH).toFixed(1)} L${x(0).toFixed(1)},${(PAD_T + innerH).toFixed(1)} Z`

  // Label the first, middle and last point only — more than that collides on mobile.
  const tickIdx = [0, Math.floor((data.length - 1) / 2), data.length - 1]
  const last = data[data.length - 1]

  return (
    <div className="mb-3">
      {caption && <p className="text-xs text-gray-400 mb-2 font-medium">{caption}</p>}
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img"
        aria-label={ariaLabel || caption || 'Chart'}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* horizontal gridlines at 0 / 50% / 100% of the range */}
        {[0, 0.5, 1].map((t) => {
          const gy = PAD_T + innerH * t
          return <line key={t} x1={PAD_L} y1={gy} x2={W - PAD_R} y2={gy} stroke={GRID} strokeWidth="1" />
        })}

        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2.5"
          strokeLinejoin="round" strokeLinecap="round" />

        {/* emphasise where the series ends — that's the number people care about */}
        <circle cx={x(data.length - 1)} cy={y(last.value)} r="4" fill={color} />
        <circle cx={x(data.length - 1)} cy={y(last.value)} r="7.5" fill={color} fillOpacity="0.18" />

        {tickIdx.map((i) => (
          <text key={i} x={x(i)} y={H - 9} fontSize="12" fill={AXIS}
            textAnchor={i === 0 ? 'start' : i === data.length - 1 ? 'end' : 'middle'}>
            {data[i].label}
          </text>
        ))}
      </svg>
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>{format(data[0].value)}</span>
        <span className="font-semibold text-gray-700">{format(last.value)}</span>
      </div>
    </div>
  )
}

// Stacked proportion bar — "how much of this total is the thing you actually
// borrowed vs the thing the lender charged you".
export function SplitBar({ segments, format = (v) => v, caption }) {
  const clean = (segments || []).filter(s => s && s.value > 0)
  if (!clean.length) return null
  const total = clean.reduce((sum, s) => sum + s.value, 0)
  if (total <= 0) return null

  return (
    <div className="mb-3">
      {caption && <p className="text-xs text-gray-400 mb-2 font-medium">{caption}</p>}
      <div className="flex w-full h-7 rounded-lg overflow-hidden bg-gray-100">
        {clean.map((s) => {
          const pct = (s.value / total) * 100
          return (
            <div key={s.label} style={{ width: `${pct}%`, backgroundColor: s.color }}
              className="h-full" title={`${s.label}: ${format(s.value)}`} />
          )
        })}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {clean.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-500">{s.label}</span>
            <span className="font-semibold text-gray-700">{format(s.value)}</span>
            <span className="text-gray-400">({Math.round((s.value / total) * 100)}%)</span>
          </div>
        ))}
      </div>
    </div>
  )
}
