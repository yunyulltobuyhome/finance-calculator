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
      <h1 className="text-base font-semibold text-gray-700 mb-4">Compound Interest Calculator</h1>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Benchmark / Preset Rate</label>
        <div className="grid grid-cols-2 gap-1.5">
          {BENCHMARKS.map(b => (
            <button key={b.name} onClick={() => handleBenchmark(b)}
              className={`text-left px-2.5 py-1.5 rounded-lg text-xs border transition-all ${
                benchmark.name === b.name ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
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
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
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
                    <div className="h-full bg-orange-400 rounded-full flex items-center pl-2 text-white" style={{ width: `${pct}%` }}>
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

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Does Compound Interest Work?</h2>
          <p className="leading-relaxed">
            Compound interest means you earn interest on your interest — not just on your original investment.
            Over time, this creates an exponential growth effect often called the "snowball effect."
            The longer you invest, the more powerful compounding becomes.
            Albert Einstein reportedly called compound interest "the eighth wonder of the world."
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Historical Investment Returns 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Investment</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Avg Annual Return</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Risk Level</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">$10k grows to (30yr)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['S&P 500 Index',        '~10.5%',  'Medium-High', '~$202,000'],
                  ['MSCI World Index',     '~9.2%',   'Medium',      '~$143,000'],
                  ['60/40 Stock/Bond Mix', '~7.5%',   'Medium',      '~$87,000'],
                  ['Conservative Bonds',   '~5.0%',   'Low',         '~$43,000'],
                  ['High-Yield Savings',   '~4.5%',   'Very Low',    '~$37,000'],
                  ['Cash/Savings Account', '~1–2%',   'None',        '~$13,500'],
                ].map(([inv, ret, risk, growth], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{inv}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{ret}</td>
                    <td className="p-2 border border-gray-200">{risk}</td>
                    <td className="p-2 border border-gray-200 font-semibold">{growth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Past performance does not guarantee future results. For illustrative purposes only.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Why Starting Early Beats Investing More</h2>
          <p className="leading-relaxed">
            Compound interest rewards time more than it rewards the amount you invest. Consider two people who each
            earn a 7% annual return. Anna invests $200 a month from age 25 to 35 (just 10 years, $24,000 total) and
            then stops. Ben invests the same $200 a month from age 35 all the way to 65 (30 years, $72,000 total).
            At 65, Anna — despite investing a third as much — often ends up with a larger pot, because her early
            money had an extra decade to compound. The lesson: the best day to start was years ago; the second best
            day is today.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Slows Compounding Down</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Fees.</strong> A 1% annual fee sounds small but can eat 25%+ of your final pot over 40 years — favour low-cost index funds.</li>
            <li><strong>Inflation.</strong> Growth is only "real" above the inflation rate. A 7% return with 3% inflation is really about 4% in spending power.</li>
            <li><strong>Cashing out early.</strong> Interrupting compounding — or panic-selling in a downturn — resets the snowball and locks in losses.</li>
            <li><strong>Taxes on gains.</strong> Using tax-sheltered accounts (ISA, 401(k), IRA) lets more of each year&apos;s growth stay invested.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is the Rule of 72?', a: 'The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by your annual return rate. At 10% return, your money doubles in 7.2 years. At 6%, it takes 12 years. At 4%, it takes 18 years. This shows why higher returns have such a dramatic impact over time.' },
              { q: 'How much should I invest monthly to become a millionaire?', a: 'At a 10% annual return (S&P 500 historical average): investing $200/month for 40 years grows to ~$1.2 million. Investing $500/month for 30 years grows to ~$1.1 million. Starting earlier is far more powerful than investing more — time is your greatest asset.' },
              { q: 'What is the difference between simple and compound interest?', a: 'Simple interest is calculated only on your original principal. Compound interest is calculated on your principal plus all previously earned interest. On a $10,000 investment at 10% for 30 years: simple interest gives you $40,000. Compound interest gives you $174,000 — more than 4x more.' },
              { q: 'How often is interest compounded?', a: 'Interest can compound daily, monthly, quarterly, or annually. More frequent compounding means faster growth. Most investment accounts and index funds effectively compound continuously. This calculator uses monthly compounding, which is standard for most investment and savings accounts.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}