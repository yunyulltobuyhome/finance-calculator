import { useState } from 'react'

const FIRE_DATA = {
  US: { currency: 'USD', symbol: '$', inflation: 0.03, avgReturn: 0.07 },
  UK: { currency: 'GBP', symbol: '£', inflation: 0.03, avgReturn: 0.07 },
  CA: { currency: 'CAD', symbol: 'C$', inflation: 0.02, avgReturn: 0.07 },
  AU: { currency: 'AUD', symbol: 'A$', inflation: 0.025, avgReturn: 0.07 },
}

export default function FIRECalc() {
  const [country, setCountry] = useState('US')
  const [currentAge, setCurrentAge] = useState(30)
  const [monthlyIncome, setMonthlyIncome] = useState(5000)
  const [monthlyExpense, setMonthlyExpense] = useState(2500)
  const [currentSavings, setCurrentSavings] = useState(50000)
  const [returnRate, setReturnRate] = useState(7)
  const [result, setResult] = useState(null)

  const data = FIRE_DATA[country]
  const symbol = data.symbol
  const fmt = (n) => symbol + Math.round(n).toLocaleString()

  const calc = () => {
    const monthlySavings = monthlyIncome - monthlyExpense
    const annualExpense = monthlyExpense * 12
    const fireNumber = annualExpense * 25
    const annualReturn = returnRate / 100

    let balance = currentSavings
    let age = currentAge
    let fireAgeReached = null
    const schedule = []

    for (let year = 0; year < 60; year++) {
      const yearEndBalance = (balance + monthlySavings * 12) * (1 + annualReturn)
      balance = yearEndBalance

      if (balance >= fireNumber && !fireAgeReached) {
        fireAgeReached = age + year
      }

      if (year % 5 === 0 || year < 3) {
        schedule.push({
          age: age + year,
          year: year,
          balance: Math.round(balance),
          monthlyIncome: Math.round(monthlySavings),
        })
      }

      if (balance >= fireNumber * 1.5) break
    }

    const leanFireNumber = annualExpense * 0.75 * 25
    const fatFireNumber = annualExpense * 1.5 * 25

    setResult({
      fireNumber: Math.round(fireNumber),
      leanFireNumber: Math.round(leanFireNumber),
      fatFireNumber: Math.round(fatFireNumber),
      fireAge: fireAgeReached || 'N/A',
      yearsToFire: fireAgeReached ? fireAgeReached - currentAge : 'N/A',
      monthlySavings: Math.round(monthlySavings),
      savingsRate: monthlySavings > 0 ? Math.round((monthlySavings / monthlyIncome) * 100) : 0,
      currentSavings: Math.round(currentSavings),
      schedule,
    })
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-gray-700 mb-2">FIRE Calculator</h1>
      <p className="text-xs text-gray-500 mb-4">Find out when you can retire by calculating your FIRE number using the 4% rule.</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {Object.entries(FIRE_DATA).map(([key, val]) => (
              <option key={key} value={key}>{key} ({val.symbol})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Current Age</label>
          <input type="number" value={currentAge} onChange={(e) => setCurrentAge(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Income</label>
          <input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Expenses</label>
          <input type="number" value={monthlyExpense} onChange={(e) => setMonthlyExpense(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Current Savings</label>
          <input type="number" value={currentSavings} onChange={(e) => setCurrentSavings(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Expected Annual Return (%)</label>
          <input type="number" step="0.1" value={returnRate} onChange={(e) => setReturnRate(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate My FIRE Number
      </button>

      {result && (
        <div className="mt-5">
          <div className="bg-indigo-50 rounded-xl p-4 mb-4">
            {typeof result.fireAge === 'number' ? (
              <div className="text-center">
                <p className="text-xs text-indigo-600 mb-2">You can achieve FIRE at age</p>
                <p className="text-3xl font-bold text-indigo-700">{result.fireAge}</p>
                <p className="text-xs text-indigo-600 mt-1">In {result.yearsToFire} years</p>
              </div>
            ) : (
              <p className="text-center text-sm text-indigo-700">
                💡 Increase savings or lower expenses to reach FIRE sooner
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Lean FIRE', val: fmt(result.leanFireNumber), desc: 'Frugal lifestyle' },
              { label: 'FIRE', val: fmt(result.fireNumber), desc: 'Current lifestyle' },
              { label: 'Fat FIRE', val: fmt(result.fatFireNumber), desc: 'Luxurious lifestyle' },
              { label: 'Monthly Savings', val: fmt(result.monthlySavings), desc: result.savingsRate + '% savings rate' },
            ].map(({ label, val, desc }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
                <p className="text-xs text-gray-400 mt-1">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 font-medium mb-3">Projected Portfolio Growth</p>
            <div className="space-y-2">
              {result.schedule.map((s, i) => {
                const pct = Math.min(100, (s.balance / result.fireNumber) * 100)
                return (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs w-12 text-gray-400">{s.age > 100 ? '100+' : s.age}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div className={`h-full rounded-full flex items-center px-1 text-white text-xs font-medium ${pct >= 100 ? 'bg-green-500' : 'bg-indigo-400'}`}
                        style={{ width: `${Math.max(5, pct)}%` }}>
                        {pct >= 100 ? '✓' : ''}
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 w-24 text-right">{fmt(s.balance)}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            <strong>FIRE Number Formula:</strong> Annual Expenses × 25 (based on 4% withdrawal rule). Assumes 4% annual withdrawal, which historically lasts 30+ years.
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">What is the FIRE Number?</h2>
          <p className="leading-relaxed">
            Your FIRE number is the amount of money you need invested to retire early and live off your portfolio indefinitely.
            It's calculated using the 4% rule: multiply your annual expenses by 25.
            If you spend $40,000 per year, your FIRE number is $1,000,000.
            At that point, you can withdraw 4% annually and your portfolio should last 30+ years based on historical market returns.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Types of FIRE</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Type</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Multiplier</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Lifestyle</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Example ($40k/yr spend)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Lean FIRE', '18.75x', 'Very frugal, minimal spending', '$750,000'],
                  ['FIRE', '25x', 'Current lifestyle maintained', '$1,000,000'],
                  ['Fat FIRE', '37.5x', 'Comfortable, flexible spending', '$1,500,000'],
                  ['Barista FIRE', '12.5x', 'Part-time work supplements income', '$500,000'],
                ].map(([type, mult, lifestyle, example], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{type}</td>
                    <td className="p-2 border border-gray-200">{mult}</td>
                    <td className="p-2 border border-gray-200">{lifestyle}</td>
                    <td className="p-2 border border-gray-200 font-semibold text-indigo-600">{example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is the 4% rule?', a: 'The 4% rule (also called the Safe Withdrawal Rate) states that you can withdraw 4% of your portfolio in year one of retirement, then adjust for inflation each year. Based on historical data, this strategy has a high probability of lasting 30+ years without running out of money.' },
              { q: 'What savings rate do I need to retire early?', a: 'Your savings rate is the key driver of FIRE. A 50% savings rate means you can retire in about 17 years. A 75% savings rate cuts that to just 7 years. Even going from a 10% to a 20% savings rate can shave 10+ years off your working life.' },
              { q: 'Does the FIRE calculator account for inflation?', a: 'The 4% rule already incorporates a historical inflation adjustment. However, if you want to be more conservative in the current environment, you can increase your target multiple to 30x (3.3% withdrawal rate) or 33x (3% withdrawal rate).' },
              { q: 'Can I achieve FIRE in the UK?', a: 'Yes — FIRE is very achievable in the UK. Key tools include ISAs (£20,000/year tax-free), SIPPs (pension with tax relief), and low-cost index funds. The UK State Pension (£11,973/yr from 2026) also reduces how much you need to save.' },
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