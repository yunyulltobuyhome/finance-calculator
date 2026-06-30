import { useState } from 'react'

export function monthlyPayment(principal, ratePct, years) {
  const r = ratePct / 100 / 12
  const n = years * 12
  if (n <= 0) return 0
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const fmt = (n) => '$' + Math.round(n).toLocaleString()

export default function RefinanceCalc() {
  const [form, setForm] = useState({ balance: 300000, currentRate: 7, remainingYears: 25, newRate: 5.5, newYears: 30, closingCosts: 4000 })
  const [result, setResult] = useState(null)

  const calc = () => {
    const { balance, currentRate, remainingYears, newRate, newYears, closingCosts } = Object.fromEntries(
      Object.entries(form).map(([k, v]) => [k, +v])
    )
    if (!balance || balance <= 0) return
    const curPay = monthlyPayment(balance, currentRate, remainingYears)
    const newPay = monthlyPayment(balance, newRate, newYears)
    const monthlySavings = curPay - newPay
    const breakEven = monthlySavings > 0 ? closingCosts / monthlySavings : null
    const interestCurrent = curPay * remainingYears * 12 - balance
    const interestNew = newPay * newYears * 12 - balance + closingCosts
    setResult({ curPay, newPay, monthlySavings, breakEven, interestCurrent, interestNew })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Mortgage Refinance Calculator 2026</h1>
        <p className="text-sm text-gray-500">See your new monthly payment, how much you'd save, and how long it takes to break even on the closing costs.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Current loan balance ($)', key: 'balance' },
          { label: 'Current interest rate (%)', key: 'currentRate' },
          { label: 'Years remaining', key: 'remainingYears' },
          { label: 'New interest rate (%)', key: 'newRate' },
          { label: 'New loan term (years)', key: 'newYears' },
          { label: 'Closing costs ($)', key: 'closingCosts' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Refinance Savings
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <div className={`rounded-xl p-5 border ${result.monthlySavings > 0 ? 'bg-indigo-50 border-indigo-200' : 'bg-amber-50 border-amber-200'}`}>
            <p className="text-sm font-semibold mb-1" style={{ color: result.monthlySavings > 0 ? '#4f46e5' : '#b45309' }}>
              {result.monthlySavings > 0 ? 'Monthly savings' : 'Higher monthly payment'}
            </p>
            <p className="text-3xl font-black" style={{ color: result.monthlySavings > 0 ? '#4338ca' : '#92400e' }}>
              {fmt(Math.abs(result.monthlySavings))}<span className="text-lg text-gray-400 font-normal">/mo</span>
            </p>
            {result.breakEven != null && (
              <p className="text-xs text-gray-500 mt-1">Break-even on closing costs in <strong>{Math.ceil(result.breakEven)} months</strong> ({(result.breakEven / 12).toFixed(1)} years)</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Current payment</p><p className="font-bold text-gray-800">{fmt(result.curPay)}/mo</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">New payment</p><p className="font-bold text-gray-800">{fmt(result.newPay)}/mo</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Interest left (current)</p><p className="font-bold text-gray-800">{fmt(result.interestCurrent)}</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-xs text-gray-400">Interest + costs (new)</p><p className="font-bold text-gray-800">{fmt(result.interestNew)}</p></div>
          </div>
          <p className="text-xs text-gray-400">
            A longer new term can lower the monthly payment but raise total interest. Compare the two interest figures
            above (the new one already includes closing costs) to see the lifetime impact.
          </p>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Mortgage Refinancing Works</h2>
          <p className="leading-relaxed">
            Refinancing replaces your existing mortgage with a new one — ideally at a lower interest rate, a shorter
            term, or both. You pay closing costs (typically 2–5% of the loan) to do it, so the key question is whether
            the monthly savings outweigh those costs. The <strong>break-even point</strong> is how many months it takes
            for your savings to cover the closing costs; refinance only makes sense if you'll keep the home past it.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">When Is Refinancing Worth It?</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li>Your new rate is meaningfully lower than your current rate (often cited as ~0.5–1%+).</li>
            <li>You'll stay in the home longer than the break-even period.</li>
            <li>You want to shorten the term (e.g. 30 → 15 years) to pay far less interest overall.</li>
            <li>You're switching from an adjustable-rate to a fixed-rate loan for stability.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How much does it cost to refinance?', a: 'Closing costs are typically 2–5% of the loan amount — covering appraisal, origination, title and other fees. On a $300,000 loan that\'s roughly $6,000–$15,000, though some lenders offer "no-closing-cost" refinances in exchange for a higher rate.' },
              { q: 'What is a refinance break-even point?', a: 'It\'s the number of months it takes for your monthly savings to repay the closing costs. If costs are $4,000 and you save $400/month, you break even in 10 months. Refinancing pays off only if you keep the loan beyond that.' },
              { q: 'Does refinancing hurt my credit?', a: 'There\'s a small temporary dip from the hard inquiry and the new account, but it typically recovers within a few months. Rate-shopping within a short window usually counts as a single inquiry.' },
              { q: 'Should I refinance to a longer term?', a: 'A longer term lowers your monthly payment but can increase total interest, even at a lower rate. Compare the lifetime interest of both loans (including closing costs) before deciding.' },
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
