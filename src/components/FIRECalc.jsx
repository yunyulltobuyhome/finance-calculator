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
    const fireNumber = annualExpense * 25 // 4% rule
    const monthlyReturn = returnRate / 100 / 12
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
      projectedBalance30: Math.round(schedule[schedule.length - 1]?.balance || balance),
      schedule,
    })
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-2">FIRE Calculator</h2>
      <p className="text-xs text-gray-500 mb-4">Find out when you can retire by calculating your FIRE number using the 4% rule.</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {Object.entries(FIRE_DATA).map(([key, val]) => (
              <option key={key} value={key}>{key} ({val.symbol})</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Current Age</label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Income</label>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Expenses</label>
          <input
            type="number"
            value={monthlyExpense}
            onChange={(e) => setMonthlyExpense(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Current Savings</label>
          <input
            type="number"
            value={currentSavings}
            onChange={(e) => setCurrentSavings(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Expected Annual Return (%)</label>
          <input
            type="number"
            step="0.1"
            value={returnRate}
            onChange={(e) => setReturnRate(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
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
                      <div
                        className={`h-full rounded-full flex items-center px-1 text-white text-xs font-medium ${
                          pct >= 100 ? 'bg-green-500' : 'bg-indigo-400'
                        }`}
                        style={{ width: `${Math.max(5, pct)}%` }}
                      >
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
            <p>
              <strong>FIRE Number Formula:</strong> Annual Expenses × 25 (based on 4% withdrawal rule). This assumes you'll withdraw 4% 
              of your portfolio annually, which historically lasts 30+ years.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}