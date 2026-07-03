import { useState } from 'react'
import { Link } from 'react-router-dom'

// UK take-home (2026/27) — matches SalaryLanding/SalaryCalc logic so a pay rise
// can be shown net of income tax + National Insurance.
function ukNet(salary) {
  let pa = 12570
  if (salary > 100000) pa = Math.max(0, pa - Math.floor((salary - 100000) / 2))
  const taxable = Math.max(0, salary - pa)
  const basicBand = 50270, higherBand = 125140
  let tax = 0
  tax += Math.min(taxable, Math.max(0, basicBand - pa)) * 0.20
  if (taxable > basicBand - pa) tax += Math.min(taxable - (basicBand - pa), higherBand - basicBand) * 0.40
  if (taxable > higherBand - pa) tax += (taxable - (higherBand - pa)) * 0.45
  let ni = 0
  if (salary > 12570) {
    ni += (Math.min(salary, 50270) - 12570) * 0.08
    if (salary > 50270) ni += (salary - 50270) * 0.02
  }
  return salary - tax - ni
}

const fmt = (n) => '£' + Math.round(n).toLocaleString()

export default function PayRiseCalc() {
  const [current, setCurrent] = useState('')
  const [riseType, setRiseType] = useState('percent')
  const [riseValue, setRiseValue] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const cur = parseFloat(current)
    const rv = parseFloat(riseValue)
    if (!cur || cur <= 0 || isNaN(rv)) return
    const newSalary = riseType === 'percent' ? cur * (1 + rv / 100) : cur + rv
    const increase = newSalary - cur
    const pct = (increase / cur) * 100
    const netCur = ukNet(cur)
    const netNew = ukNet(newSalary)
    const netIncrease = netNew - netCur
    setResult({
      newSalary, increase, pct,
      grossMonthly: increase / 12,
      netIncrease, netMonthly: netIncrease / 12,
      keepPct: increase > 0 ? (netIncrease / increase) * 100 : 0,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Pay Rise Calculator UK 2026</h1>
        <p className="text-sm text-gray-500">See your new salary and how much of a pay rise you actually keep after tax and National Insurance.</p>
        <p className="text-xs text-gray-400 mt-1">✓ 2026/27 income tax &amp; NI</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current annual salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={current} onChange={e => setCurrent(e.target.value)} placeholder="e.g. 35,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Pay rise</label>
          <div className="grid grid-cols-2 gap-2 mb-2">
            {[
              { key: 'percent', label: 'Percentage (%)' },
              { key: 'amount', label: 'Fixed amount (£)' },
            ].map(o => (
              <button key={o.key} onClick={() => setRiseType(o.key)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  riseType === o.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{riseType === 'percent' ? '%' : '£'}</span>
            <input type="number" value={riseValue} onChange={e => setRiseValue(e.target.value)}
              placeholder={riseType === 'percent' ? 'e.g. 5' : 'e.g. 2,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Pay Rise
      </button>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-indigo-600 font-semibold mb-1">New annual salary</p>
            <p className="text-3xl font-black text-indigo-700">{fmt(result.newSalary)}</p>
            <p className="text-xs text-gray-500 mt-1">+{fmt(result.increase)} ({result.pct.toFixed(1)}% rise)</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Gross increase / month', val: fmt(result.grossMonthly) },
              { label: 'After-tax increase / month', val: fmt(result.netMonthly) },
              { label: 'After-tax increase / year', val: fmt(result.netIncrease) },
              { label: 'You keep', val: `${Math.round(result.keepPct)}% of the rise` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            Based on 2026/27 UK income tax and National Insurance, standard tax code, no pension or student loan.
            A rise can push part of your income into a higher tax band, which is why you keep less than 100%.
          </p>
          <Link to="/salary" className="block text-center text-sm text-indigo-600 font-semibold hover:underline">
            See full take-home breakdown →
          </Link>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Much of a Pay Rise Do You Actually Keep?</h2>
          <p className="leading-relaxed">
            A pay rise is taxed at your <strong>marginal rate</strong> — the rate on your top slice of income — plus
            National Insurance, so you never take home the full amount. A basic-rate taxpayer keeps 72% of a rise
            (after 20% tax and 8% NI), while a higher-rate taxpayer keeps 58% (40% tax and 2% NI). Crossing a
            threshold, such as £50,270, means part of the rise is taxed at the higher rate.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">What You Keep From a Pay Rise (2026/27)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Your tax band</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax + NI on the rise</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">You keep</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Basic rate (£12,570–£50,270)', '20% + 8%', '72%'],
                  ['Higher rate (£50,270–£100,000)', '40% + 2%', '58%'],
                  ['£100k–£125,140 (allowance taper)', 'up to ~62% effective', '~38%'],
                  ['Additional rate (£125,140+)', '45% + 2%', '53%'],
                ].map(([band, ded, keep], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{band}</td>
                    <td className="p-2 border border-gray-200">{ded}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{keep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">The £100k–£125,140 band loses the personal allowance at £1 for every £2, creating a ~60% effective rate.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Watch Out for Hidden Thresholds</h2>
          <p className="leading-relaxed">
            A pay rise can quietly push you past a threshold that costs far more than the higher tax band alone.
            The biggest is the <strong>£100,000</strong> mark: for every £2 earned above it, you lose £1 of your
            personal allowance, creating an effective tax rate of around 60% between £100,000 and £125,140. Crossing
            it can also cost you tax-free childcare and 30 free childcare hours. Similarly, a rise can trigger the
            <strong> High Income Child Benefit Charge</strong> or, in the US, move part of your income into a higher
            bracket. Knowing these cliffs helps you decide whether to divert a rise into a pension instead.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Keep More of a Pay Rise</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Salary sacrifice into your pension.</strong> Redirecting some or all of a rise into a pension can keep you below a threshold and get tax relief at your marginal rate.</li>
            <li><strong>Use tax-efficient benefits.</strong> Cycle-to-work, EV schemes and additional pension contributions are taken before tax.</li>
            <li><strong>Check your tax code.</strong> After a rise, make sure HMRC has updated your code so you are not over- or under-taxed.</li>
            <li><strong>Remember the rise compounds.</strong> Even after tax, a higher base salary raises every future rise, bonus and pension contribution.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How much is a 5% pay rise on £35,000?', a: 'A 5% rise on £35,000 is £1,750, taking you to £36,750. After 20% tax and 8% NI you keep about 72% — roughly £1,260 a year, or £105 a month extra in take-home pay.' },
              { q: 'Why do I keep so little of my pay rise?', a: 'Pay rises are taxed at your marginal rate plus National Insurance. If the rise pushes income past £50,270, part is taxed at 40%. Between £100,000 and £125,140 the personal allowance tapers away, creating an effective rate of around 60%.' },
              { q: 'Does a pay rise affect my student loan or pension?', a: 'Yes. If you repay a student loan, you pay 9% (6% for postgraduate) on the extra income above the threshold, reducing what you keep further. Pension contributions taken as a percentage of salary will also rise.' },
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
