import { useState } from 'react'
import { Link } from 'react-router-dom'

export function autoLoanPayment(loan, apr, months) {
  const r = apr / 100 / 12
  if (months <= 0) return 0
  if (r === 0) return loan / months
  return loan * (r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1)
}

const fmt = (n) => '$' + Math.round(n).toLocaleString()

export default function AutoLoanCalc() {
  const [form, setForm] = useState({ price: 35000, down: 5000, trade: 0, tax: 0, apr: 7, months: 60 })
  const [result, setResult] = useState(null)

  const calc = () => {
    const price = +form.price, down = +form.down, trade = +form.trade
    const tax = price * (+form.tax / 100)
    const loan = Math.max(0, price + tax - down - trade)
    const monthly = autoLoanPayment(loan, +form.apr, +form.months)
    const totalPaid = monthly * +form.months
    const totalInterest = totalPaid - loan
    setResult({ loan, monthly, totalInterest, totalPaid, tax })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Auto Loan Calculator 2026</h1>
        <p className="text-sm text-gray-500">Estimate your monthly car payment, total interest, and the true cost of your auto loan.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Vehicle price ($)', key: 'price' },
          { label: 'Down payment ($)', key: 'down' },
          { label: 'Trade-in value ($)', key: 'trade' },
          { label: 'Sales tax (%)', key: 'tax' },
          { label: 'APR / interest rate (%)', key: 'apr' },
          { label: 'Loan term (months)', key: 'months' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Car Payment
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-indigo-600 font-semibold mb-1">Estimated monthly payment</p>
            <p className="text-3xl font-black text-indigo-700">{fmt(result.monthly)}<span className="text-lg text-gray-400 font-normal">/mo</span></p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Loan amount', val: fmt(result.loan) },
              { label: 'Total interest', val: fmt(result.totalInterest) },
              { label: 'Total cost', val: fmt(result.totalPaid) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Auto Loan Payments Are Calculated</h2>
          <p className="leading-relaxed">
            Your monthly payment depends on the amount you borrow (vehicle price plus tax, minus your down payment and
            trade-in), your APR, and the loan term. A longer term lowers the monthly payment but increases the total
            interest you pay. A bigger down payment reduces both the payment and the interest, and can help you avoid
            being "upside down" (owing more than the car is worth).
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Monthly Payment by Term — $30,000 Loan</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">APR</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">48 months</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">60 months</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">72 months</th>
              </tr></thead>
              <tbody>
                {[4, 6, 8, 10].map((apr, i) => (
                  <tr key={apr} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{apr}%</td>
                    {[48, 60, 72].map(m => (
                      <td key={m} className="p-2 border border-gray-200 text-indigo-600 font-semibold">{fmt(autoLoanPayment(30000, apr, m))}/mo</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">$30,000 financed, excluding tax and fees.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">The True Cost of a Car Loan</h2>
          <p className="leading-relaxed">
            The sticker price is only part of the story. On a $30,000 loan at 8% APR, choosing a 72-month term
            instead of 48 months drops the monthly payment by around $200 — but you pay roughly $2,700 more in
            total interest and spend two extra years in debt. Add sales tax, registration, insurance, fuel and
            maintenance, and the real cost of ownership is far higher than the monthly payment suggests. Always
            look at the total repaid, not just what fits your monthly budget.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Tips to Pay Less for Your Car</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Get pre-approved first.</strong> Walking in with a bank or credit-union rate turns the dealer&apos;s financing into a negotiation you can win.</li>
            <li><strong>Negotiate the price, not the payment.</strong> Dealers can hit any monthly payment by stretching the term — agree the out-the-door price first.</li>
            <li><strong>Put more down.</strong> A larger down payment cuts interest and protects you from negative equity if the car depreciates faster than you repay.</li>
            <li><strong>Keep the term short.</strong> 48–60 months is a sensible ceiling; 72–84-month loans are where buyers most often end up "underwater".</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What credit score do I need for a good car loan rate?', a: 'Borrowers with scores above 720 usually get the lowest APRs. Below 660, rates rise sharply, so improving your score before applying — or getting pre-approved by a bank or credit union — can save thousands.' },
              { q: 'Is a longer loan term a good idea?', a: 'A 72- or 84-month term lowers the monthly payment but costs much more interest and keeps you in negative equity longer. Most experts suggest keeping car loans to 60 months or less.' },
              { q: 'How much should I put down on a car?', a: 'A common guideline is 20% down on a new car and 10% on a used one. A larger down payment lowers your payment, interest, and the risk of owing more than the car is worth.' },
              { q: 'Should I finance through the dealer or a bank?', a: 'Get pre-approved by a bank or credit union first, then let the dealer try to beat it. Dealer financing can be convenient but is not always the cheapest option.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Car Payment by Loan Amount</h2>
          <div className="flex flex-wrap gap-2">
            {[15000, 20000, 25000, 30000, 35000, 40000, 50000].map(a => (
              <Link key={a} to={`/auto-loan/${a}`} className="text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                ${a.toLocaleString()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
