import { useState } from 'react'
import { LOAN_DATA } from '../data/loanRates'

export default function LoanCalc() {
  const [country, setCountry] = useState('US')
  const [loanType, setLoanType] = useState(0)
  const [repaymentMethod, setRepaymentMethod] = useState('Fixed-Rate')
  const [principal, setPrincipal] = useState(300000)
  const [customRate, setCustomRate] = useState(null)
  const [customTerm, setCustomTerm] = useState(null)
  const [extraPayment, setExtraPayment] = useState(0)
  const [balloonPercent, setBalloonPercent] = useState(20)
  const [result, setResult] = useState(null)

  const countryData = LOAN_DATA[country]
  const selectedLoan = countryData.types[loanType]
  const rate = (customRate !== null ? customRate : selectedLoan.rate) / 100 / 12
  const term = (customTerm !== null ? customTerm : selectedLoan.term) * 12
  const currency = countryData.currency
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'CAD' ? 'C$' : 'A$'
  const fmt = (n) => symbol + Math.round(n).toLocaleString()

  const calc = () => {
    if (repaymentMethod === 'Fixed-Rate') {
      const monthlyPayment = rate === 0
        ? principal / term
        : principal * (rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)

      let balance = principal
      let totalInterest = 0
      let months = 0
      const schedule = []

      while (balance > 0 && months < term) {
        const interestPayment = balance * rate
        let principalPayment = monthlyPayment - interestPayment
        const extraPay = extraPayment || 0
        if (principalPayment + extraPay >= balance) { principalPayment = balance; balance = 0 }
        else balance -= principalPayment + extraPay
        totalInterest += interestPayment
        months++
        if (months % Math.ceil(term / 12) === 0 || balance <= 0) {
          schedule.push({ month: months, payment: Math.round(monthlyPayment + extraPay), principal: Math.round(principalPayment), interest: Math.round(interestPayment), balance: Math.max(0, Math.round(balance)) })
        }
      }

      setResult({ monthlyPayment: Math.round(monthlyPayment), totalInterest: Math.round(totalInterest), totalPayment: Math.round(principal + totalInterest), payoffMonths: months, payoffYears: Math.round(months / 12 * 10) / 10, schedule, method: 'Fixed-Rate' })
    } else if (repaymentMethod === 'Interest-Only') {
      const monthlyInterest = principal * rate
      const balloonAmount = (principal * balloonPercent) / 100
      setResult({ monthlyPayment: Math.round(monthlyInterest), monthlyInterestOnly: Math.round(monthlyInterest), balloonAmount: Math.round(balloonAmount), totalPaid: Math.round(monthlyInterest * term + balloonAmount), payoffYears: Math.round(term / 12), method: 'Interest-Only' })
    }
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-gray-700 mb-4">Global Loan Calculator</h1>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select value={country} onChange={(e) => { setCountry(e.target.value); setLoanType(0); setRepaymentMethod(LOAN_DATA[e.target.value].repaymentMethods[0]) }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {Object.entries(LOAN_DATA).map(([key, val]) => <option key={key} value={key}>{val.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Type</label>
          <select value={loanType} onChange={(e) => setLoanType(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {countryData.types.map((type, i) => <option key={i} value={i}>{type.name} ({(type.rate * 100).toFixed(2)}%)</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Repayment Method</label>
          <select value={repaymentMethod} onChange={(e) => setRepaymentMethod(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {countryData.repaymentMethods.map((method) => <option key={method}>{method}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Amount</label>
          <input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Interest Rate (%) — optional</label>
          <input type="number" step="0.1" value={customRate || ''} onChange={(e) => setCustomRate(e.target.value ? +e.target.value : null)}
            placeholder={`Default: ${(selectedLoan.rate * 100).toFixed(2)}%`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Term (years) — optional</label>
          <input type="number" value={customTerm || ''} onChange={(e) => setCustomTerm(e.target.value ? +e.target.value : null)}
            placeholder={`Default: ${selectedLoan.term} years`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      {repaymentMethod === 'Fixed-Rate' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Extra Monthly Payment</label>
          <input type="number" value={extraPayment} onChange={(e) => setExtraPayment(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      )}

      {repaymentMethod === 'Interest-Only' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Balloon Payment (% of loan amount)</label>
          <input type="number" min="0" max="100" value={balloonPercent} onChange={(e) => setBalloonPercent(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      )}

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Loan
      </button>

      {result && (
        <div className="mt-5">
          {result.method === 'Fixed-Rate' ? (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'Monthly Payment', val: fmt(result.monthlyPayment) },
                  { label: 'Total Interest', val: fmt(result.totalInterest) },
                  { label: 'Total Payment', val: fmt(result.totalPayment) },
                  { label: 'Payoff Time', val: `${result.payoffYears} years` },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-base font-semibold text-gray-800">{val}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-xs mb-3">
                {[
                  { label: 'Principal', val: principal, pct: 100, color: 'bg-indigo-400' },
                  { label: 'Interest', val: result.totalInterest, pct: (result.totalInterest / result.totalPayment) * 100, color: 'bg-orange-400' },
                ].map(({ label, val, pct, color }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="w-16 text-gray-400">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                      <div className={`h-full ${color} rounded-full flex items-center pl-2 text-white`} style={{ width: `${pct}%` }}>{fmt(val)}</div>
                    </div>
                  </div>
                ))}
              </div>
              {result.schedule.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-600 font-medium mb-2">Payment Schedule (Yearly)</p>
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {result.schedule.map((s) => (
                      <div key={s.month} className="flex justify-between text-xs text-gray-600">
                        <span>Month {s.month}</span>
                        <span>{fmt(s.payment)}</span>
                        <span className="text-gray-400">Balance: {fmt(s.balance)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {[
                  { label: 'Monthly Payment (Interest)', val: fmt(result.monthlyPayment) },
                  { label: 'Balloon Payment', val: fmt(result.balloonAmount) },
                  { label: 'Term', val: `${result.payoffYears} years` },
                  { label: 'Total Paid', val: fmt(result.totalPaid) },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">{label}</p>
                    <p className="text-base font-semibold text-gray-800">{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-orange-50 rounded-xl p-3 text-xs text-orange-700">
                💡 You pay only interest for {result.payoffYears} years, then {fmt(result.balloonAmount)} balloon payment at the end.
              </div>
            </>
          )}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How to Calculate Loan Payments</h2>
          <p className="leading-relaxed">
            Monthly loan payments are calculated using the amortization formula, which splits each payment into
            interest and principal. Early payments are mostly interest; later payments are mostly principal.
            Making extra payments reduces your balance faster and saves significant interest over the loan term.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Typical Loan Rates 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Loan Type</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇺🇸 US Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇬🇧 UK Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Typical Term</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['30yr Fixed Mortgage', '~6.5%', '~4.5–5.5%', '25–30 years'],
                  ['15yr Fixed Mortgage', '~6.0%', '~4.0–5.0%', '15 years'],
                  ['Auto Loan',          '~7–9%',  '~8–12%',    '3–7 years'],
                  ['Personal Loan',      '~10–15%','~6–15%',    '1–7 years'],
                  ['Student Loan (US)',  '~6.5%',  'Plan 2: RPI+3%', '10–25 years'],
                ].map(([type, us, uk, term], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{type}</td>
                    <td className="p-2 border border-gray-200">{us}</td>
                    <td className="p-2 border border-gray-200">{uk}</td>
                    <td className="p-2 border border-gray-200">{term}</td>
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
              { q: 'How much does an extra $100/month save on a mortgage?', a: 'On a $300,000 mortgage at 6.5% over 30 years, paying an extra $100/month saves approximately $42,000 in interest and cuts 4 years off the loan. The savings grow significantly with larger extra payments.' },
              { q: 'What is an interest-only mortgage?', a: 'With an interest-only mortgage, you only pay the interest each month — not the principal. Your monthly payment is lower, but your balance doesn\'t decrease. At the end of the term, you pay the full principal as a balloon payment or refinance.' },
              { q: 'Should I choose a 15-year or 30-year mortgage?', a: 'A 15-year mortgage has higher monthly payments but saves a huge amount in interest — typically 50–60% less total interest paid. A 30-year mortgage gives lower monthly payments and more flexibility. Choose 15 years if you can comfortably afford the higher payment.' },
              { q: 'What is APR vs interest rate?', a: 'The interest rate is the base cost of borrowing. APR (Annual Percentage Rate) includes the interest rate plus fees (origination fees, points, etc.), giving a more complete picture of the true cost of the loan. Always compare APRs when shopping for loans.' },
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