import { useState } from 'react'

const BENCHMARKS = [
  { name: 'S&P 500 (historical avg)', rate: 10.5 },
  { name: 'Global Index (MSCI World)', rate: 9.2 },
  { name: 'Conservative Bond Mix', rate: 5.0 },
  { name: 'High-Yield Savings (US)', rate: 4.5 },
  { name: 'Euro Savings Account', rate: 2.5 },
  { name: 'Custom', rate: null },
]

export default function CompoundCalc() {
  const [benchmark, setBenchmark] = useState(BENCHMARKS[0])
  const [form, setForm] = useState({ principal: 5000, rate: 10.5, monthly: 200, years: 30 })
  const [result, setResult] = useState(null)

  const handleBenchmark = (b) => {
    setBenchmark(b)
    if (b.rate !== null) setForm(f => ({ ...f, rate: b.rate }))
  }

  const calc = () => {
    const p = +form.principal
    const r = +form.rate / 100 / 12
    const m = +form.monthly
    const yrs = +form.years
    const n = yrs * 12
    let total = p
    const data = []
    const totalInvested = p + m * n

    for (let i = 1; i <= n; i++) {
      total = total * (1 + r) + m
      if (i % Math.ceil(n / 5) === 0 || i === n) {
        data.push({ yr: Math.round(i / 12), val: Math.round(total) })
      }
    }
    setResult({
      total: Math.round(total),
      totalInvested: Math.round(totalInvested),
      profit: Math.round(total - totalInvested),
      multiplier: Math.round((total / totalInvested) * 10) / 10,
      data,
    })
  }

  const fmt = (n) => '$' + n.toLocaleString()

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Compound Interest Calculator</h2>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Benchmark / Preset Rate</label>
        <div className="grid grid-cols-2 gap-1.5">
          {BENCHMARKS.map(b => (
            <button
              key={b.name}
              onClick={() => handleBenchmark(b)}
              className={`text-left px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                benchmark.name === b.name
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {b.name}{b.rate !== null ? ` (${b.rate}%)` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Initial Investment ($)', key: 'principal' },
          { label: 'Annual Return (%)', key: 'rate' },
          { label: 'Monthly Contribution ($)', key: 'monthly' },
          { label: 'Investment Period (years)', key: 'years' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              type="number"
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Final Portfolio Value', val: fmt(result.total) },
              { label: 'Total Invested', val: fmt(result.totalInvested) },
              { label: 'Investment Profit', val: fmt(result.profit) },
              { label: 'Money Multiplier', val: `${result.multiplier}x` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-2 font-medium">Portfolio growth over time</p>
          <div className="space-y-2">
            {result.data.map(({ yr, val }) => {
              const pct = Math.round((val / result.total) * 100)
              return (
                <div key={yr} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-gray-400 text-right">{yr}yr</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-orange-400 rounded-full flex items-center pl-2 text-white"
                      style={{ width: `${pct}%` }}
                    >
                      {fmt(val)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            * Returns are hypothetical and based on a fixed annual rate. Past performance does not guarantee future results. Inflation not accounted for.
          </p>
        </div>
      )}
    </div>
  )
}