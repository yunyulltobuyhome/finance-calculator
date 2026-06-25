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
    const monthlyPayment = monthlyRate === 0
      ? loanAmount / (loanTerm * 12)
      : (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, loanTerm * 12))) / (Math.pow(1 + monthlyRate, loanTerm * 12) - 1)

    const schedule = []

    for (let year = 1; year <= years; year++) {
      const yearlyMortgage = monthlyPayment * 12 * Math.min(year, loanTerm)
      const yearlyPropertyTax = homePrice * (propertyTax / 100) * year
      const yearlyMaintenance = homePrice * (maintenance / 100) * year
      const yearlyInsurance = insurance * 12 * year
      const homeValue = homePrice * Math.pow(1 + homeAppreciation / 100, year)
      const remainingLoan = loanAmount * Math.max(0, 1 - year / loanTerm)
      const buyCumCost = downPayment + yearlyMortgage + yearlyPropertyTax + yearlyMaintenance + yearlyInsurance
      const buyNetWorth = homeValue - remainingLoan - buyCumCost
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
    setResult({ schedule, buyWins: finalBuy.netWorth > finalBuy.rentCost, difference: finalBuy.difference, buyNetWorth: finalBuy.netWorth, rentCost: finalBuy.rentCost })
  }

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-2">Buy vs Rent Calculator</h2>
      <p className="text-xs text-gray-500 mb-4">Compare the financial impact of buying a home vs renting over time.</p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {Object.entries(currencies).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Home Price</label>
          <input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Down Payment</label>
          <input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Interest Rate (%)</label>
          <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Term (years)</label>
          <input type="number" value={loanTerm} onChange={(e) => setLoanTerm(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Rent</label>
          <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Annual Rent Increase (%)</label>
          <input type="number" step="0.1" value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Home Appreciation (%/year)</label>
          <input type="number" step="0.1" value={homeAppreciation} onChange={(e) => setHomeAppreciation(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Property Tax (% of value/year)</label>
          <input type="number" step="0.1" value={propertyTax} onChange={(e) => setPropertyTax(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Maintenance (% of value/year)</label>
          <input type="number" step="0.1" value={maintenance} onChange={(e) => setMaintenance(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Monthly Insurance</label>
          <input type="number" value={insurance} onChange={(e) => setInsurance(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Time Horizon (years)</label>
          <input type="number" value={years} onChange={(e) => setYears(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Buy vs Rent
      </button>

      {result && (
        <div className="mt-5">
          <div className={`rounded-xl p-4 mb-4 text-center ${result.buyWins ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs mb-2 ${result.buyWins ? 'text-green-600' : 'text-blue-600'}`}>
              {result.buyWins ? '🏠 Buying is Better' : '🏢 Renting is Better'}
            </p>
            <p className={`text-2xl font-bold ${result.buyWins ? 'text-green-700' : 'text-blue-700'}`}>
              {fmt(Math.abs(result.difference))}
            </p>
            <p className={`text-xs mt-1 ${result.buyWins ? 'text-green-600' : 'text-blue-600'}`}>
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
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {result.schedule.map((s) => (
                <div key={s.year} className="flex justify-between text-xs text-gray-600">
                  <span>Year {s.year}</span>
                  <span>Buy: {fmt(s.netWorth)} | Rent: {fmt(s.rentCost)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
            <strong>Note:</strong> This calculator compares cumulative costs and home equity. Buying builds equity while renting is an expense. Consider lifestyle, flexibility, and local market conditions.
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Should You Buy or Rent a Home?</h2>
          <p className="leading-relaxed">
            The buy vs rent decision is one of the most important financial choices you'll make.
            Buying builds equity over time and provides stability, but comes with higher upfront costs
            and ongoing expenses like maintenance and property tax. Renting offers flexibility and
            lower initial costs, but you don't build wealth through the property.
            The right answer depends on how long you plan to stay, local property prices, and your financial situation.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Key Factors in the Buy vs Rent Decision</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Factor</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🏠 Buying</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🏢 Renting</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Upfront cost',     'High (down payment, closing costs)', 'Low (deposit + first month)'],
                  ['Monthly cost',     'Fixed mortgage + tax + maintenance', 'Predictable rent'],
                  ['Wealth building',  '✅ Builds equity over time',         '❌ No equity'],
                  ['Flexibility',      '❌ Hard to move quickly',            '✅ Easy to relocate'],
                  ['Maintenance',      'Your responsibility (1–2% /yr)',     'Landlord responsibility'],
                  ['Best for',         'Long-term stay (5+ years)',          'Short-term or uncertain plans'],
                ].map(([factor, buy, rent], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{factor}</td>
                    <td className="p-2 border border-gray-200">{buy}</td>
                    <td className="p-2 border border-gray-200">{rent}</td>
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
              { q: 'How long do you need to stay to make buying worth it?', a: 'Most financial experts suggest you need to stay at least 5 years for buying to be financially better than renting. This is because buying involves significant upfront costs (down payment, closing costs, stamp duty) that take years to recoup through equity building and appreciation.' },
              { q: 'Is it better to buy or rent in 2026?', a: 'In most major cities in 2026, high mortgage rates (6.5% in the US, 4.5–5.5% in the UK) and elevated property prices make renting more cost-effective in the short term. However, if you plan to stay 7+ years and can afford the down payment, buying typically wins long-term due to equity building and inflation protection.' },
              { q: 'What is the price-to-rent ratio?', a: 'The price-to-rent ratio divides the home price by annual rent. A ratio above 20 generally favours renting; below 15 generally favours buying. In most major US and UK cities in 2026, ratios are above 20, suggesting renting has short-term financial advantages.' },
              { q: 'Does renting mean throwing money away?', a: 'Not exactly. While rent doesn\'t build equity, it also frees you from maintenance costs, property taxes, and market risk. The money saved on these costs (and the down payment not tied up in property) could potentially be invested for similar or better returns than property appreciation.' },
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