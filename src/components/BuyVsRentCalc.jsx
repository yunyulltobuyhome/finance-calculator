import { useState } from 'react'

export default function BuyVsRentCalc() {
  const [country, setCountry] = useState('US')
  const [homePrice, setHomePrice] = useState(400000)
  const [downPayment, setDownPayment] = useState(80000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [loanTerm, setLoanTerm] = useState(30)
  const [monthlyRent, setMonthlyRent] = useState(2000)
  const [rentIncrease, setRentIncrease] = useState(3)
  const [homeAppreciation, setHomeAppreciation] = useState(3)
  const [propertyTax, setPropertyTax] = useState(1.2)
  const [maintenance, setMaintenance] = useState(1)
  const [insurance, setInsurance] = useState(100)
  const [years, setYears] = useState(30)
  const [result, setResult] = useState(null)

  const currencies = {
    US: { symbol: '$', name: '🇺🇸 United States' },
    UK: { symbol: '£', name: '🇬🇧 United Kingdom' },
    CA: { symbol: 'C$', name: '🇨🇦 Canada' },
    AU: { symbol: 'A$', name: '🇦🇺 Australia' },
  }

  const curr = currencies[country]
  const fmt = (n) => curr.symbol + Math.round(n).toLocaleString()

  const calc = () => {
    const loanAmount = homePrice - downPayment
    const monthlyRate = interestRate / 100 / 12
    const monthlyPayment =
      monthlyRate === 0
        ? loanAmount / (loanTerm * 12)
        : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12))) /
          (Math.pow(1 + monthlyRate, loanTerm * 12) - 1)

    let buyBalance = homePrice
    let buyCost = downPayment
    let rentBalance = 0
    let rentCost = 0
    const schedule = []

    for (let year = 1; year <= years; year++) {
      // BUY SIDE
      const yearlyMortgage = monthlyPayment * 12 * Math.min(year, loanTerm)
      const yearlyPropertyTax = (homePrice * (propertyTax / 100) * year)
      const yearlyMaintenance = (homePrice * (maintenance / 100) * year)
      const yearlyInsurance = insurance * 12 * year
      const homeValue = homePrice * Math.pow(1 + homeAppreciation / 100, year)
      const remainingLoan = loanAmount * Math.max(0, 1 - year / loanTerm)

      const buyCumCost =
        downPayment +
        yearlyMortgage +
        yearlyPropertyTax +
        yearlyMaintenance +
        yearlyInsurance

      const buyNetWorth = homeValue - remainingLoan - buyCumCost

      // RENT SIDE
      const yearlyRent = monthlyRent * 12 * Math.pow(1 + rentIncrease / 100, year - 1)
      const rentCumCost = monthlyRent * 12 * ((Math.pow(1 + rentIncrease / 100, year) - 1) / (rentIncrease / 100))

      if (year % Math.max(1, Math.floor(years / 10)) === 0 || year <= 3) {
        schedule.push({
          year,
          homeValue: Math.round(homeValue),
          totalCost: Math.round(buyCumCost),
          netWorth: Math.round(buyNetWorth),
          rentCost: Math.round(rentCumCost),
          difference: Math.round(buyNetWorth - rentCumCost),
        })
      }
    }

    const finalBuy = schedule[schedule.length - 1]
    const finalRent = rentCost

    setResult({
      schedule,
      buyWins: finalBuy.netWorth > finalBuy.rentCost,
      difference: finalBuy.difference,
      buyNetWorth: finalBuy.netWorth,
      rentCost: finalBuy.rentCost,
    })
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-2">Buy vs Rent Calculator</h2>
      <p className="text-xs text-gray-500 mb-4">Compare the financial impact of buying a home vs renting over time.</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {Object.entries(currencies).map(([key, val]) => (
              <option key={key} value={key}>{val.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Home Price</label>
          <input
            type="number"
            value={homePrice}
            onChange={(e) => setHomePrice(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Down Payment</label>
          <input
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Interest Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Term (years)</label>
          <input
            type="number"
            value={loanTerm}
            onChange={(e) => setLoanTerm(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Rent</label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Annual Rent Increase (%)</label>
          <input
            type="number"
            step="0.1"
            value={rentIncrease}
            onChange={(e) => setRentIncrease(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Home Appreciation (%/year)</label>
          <input
            type="number"
            step="0.1"
            value={homeAppreciation}
            onChange={(e) => setHomeAppreciation(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Property Tax (% of value/year)</label>
          <input
            type="number"
            step="0.1"
            value={propertyTax}
            onChange={(e) => setPropertyTax(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Maintenance (% of value/year)</label>
          <input
            type="number"
            step="0.1"
            value={maintenance}
            onChange={(e) => setMaintenance(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Insurance</label>
          <input
            type="number"
            value={insurance}
            onChange={(e) => setInsurance(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Time Horizon (years)</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Calculate Buy vs Rent
      </button>

      {result && (
        <div className="mt-5">
          <div
            className={`rounded-xl p-4 mb-4 text-center ${
              result.buyWins
                ? 'bg-green-50 border border-green-200'
                : 'bg-blue-50 border border-blue-200'
            }`}
          >
            <p className={`text-xs ${result.buyWins ? 'text-green-600' : 'text-blue-600'} mb-2`}>
              {result.buyWins ? '🏠 Buying is Better' : '🏢 Renting is Better'}
            </p>
            <p className={`text-2xl font-bold ${result.buyWins ? 'text-green-700' : 'text-blue-700'}`}>
              {fmt(Math.abs(result.difference))}
            </p>
            <p className={`text-xs ${result.buyWins ? 'text-green-600' : 'text-blue-600'} mt-1`}>
              {result.buyWins
                ? `Buying saves you ${fmt(result.difference)} over ${years} years`
                : `Renting saves you ${fmt(Math.abs(result.difference))} over ${years} years`}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Buy: Net Worth', val: fmt(result.buyNetWorth) },
              { label: 'Rent: Total Cost', val: fmt(result.rentCost) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 font-medium mb-3">Financial Comparison Over Time</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.schedule.map((s) => (
                <div key={s.year} className="flex justify-between text-xs text-gray-600">
                  <span>Year {s.year}</span>
                  <span className="text-right">
                    Buy: {fmt(s.netWorth)} | Rent: {fmt(s.rentCost)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            <p>
              <strong>Note:</strong> This calculator compares cumulative costs and home equity. Buying builds equity while 
              renting is an expense. Consider your lifestyle, flexibility, and local market conditions.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}