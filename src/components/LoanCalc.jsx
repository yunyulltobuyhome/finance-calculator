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
      const monthlyRate = rate
      const monthlyPayment = rate === 0 
        ? principal / term 
        : principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)

      let balance = principal
      let totalInterest = 0
      let months = 0
      const schedule = []

      while (balance > 0 && months < term) {
        const interestPayment = balance * monthlyRate
        let principalPayment = monthlyPayment - interestPayment
        const extraPay = extraPayment || 0

        if (principalPayment + extraPay >= balance) {
          principalPayment = balance
          balance = 0
        } else {
          balance -= principalPayment + extraPay
        }

        totalInterest += interestPayment
        months++

        if (months % Math.ceil(term / 12) === 0 || balance <= 0) {
          schedule.push({
            month: months,
            payment: Math.round(monthlyPayment + extraPay),
            principal: Math.round(principalPayment),
            interest: Math.round(interestPayment),
            balance: Math.max(0, Math.round(balance)),
          })
        }
      }

      setResult({
        monthlyPayment: Math.round(monthlyPayment),
        totalInterest: Math.round(totalInterest),
        totalPayment: Math.round(principal + totalInterest),
        payoffMonths: months,
        payoffYears: Math.round(months / 12 * 10) / 10,
        schedule,
        method: 'Fixed-Rate',
      })
    } else if (repaymentMethod === 'Interest-Only') {
      const monthlyInterest = principal * rate
      const balloonAmount = (principal * balloonPercent) / 100
      const remainingPrincipal = principal - balloonAmount

      setResult({
        monthlyPayment: Math.round(monthlyInterest),
        monthlyInterestOnly: Math.round(monthlyInterest),
        balloonAmount: Math.round(balloonAmount),
        totalPaid: Math.round(monthlyInterest * term + balloonAmount),
        term: term,
        payoffYears: Math.round(term / 12),
        method: 'Interest-Only',
      })
    }
  }

  const countryList = Object.entries(LOAN_DATA).map(([key, val]) => ({
    key,
    name: val.name,
  }))

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Global Loan Calculator</h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Country</label>
          <select
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setLoanType(0)
              setRepaymentMethod(LOAN_DATA[e.target.value].repaymentMethods[0])
            }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {countryList.map(({ key, name }) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Type</label>
          <select
            value={loanType}
            onChange={(e) => setLoanType(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {countryData.types.map((type, i) => (
              <option key={i} value={i}>{type.name} ({(type.rate * 100).toFixed(2)}%)</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Repayment Method</label>
          <select
            value={repaymentMethod}
            onChange={(e) => setRepaymentMethod(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {countryData.repaymentMethods.map((method) => (
              <option key={method}>{method}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Amount</label>
          <input
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Interest Rate (%) - Leave blank to use default</label>
          <input
            type="number"
            step="0.1"
            value={customRate || ''}
            onChange={(e) => setCustomRate(e.target.value ? +e.target.value : null)}
            placeholder={`Default: ${(selectedLoan.rate * 100).toFixed(2)}%`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 block mb-1">Loan Term (years) - Leave blank to use default</label>
          <input
            type="number"
            value={customTerm || ''}
            onChange={(e) => setCustomTerm(e.target.value ? +e.target.value : null)}
            placeholder={`Default: ${selectedLoan.term} years`}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {repaymentMethod === 'Fixed-Rate' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Extra Monthly Payment ($)</label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      )}

      {repaymentMethod === 'Interest-Only' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Balloon Payment (% of loan amount)</label>
          <input
            type="number"
            min="0"
            max="100"
            value={balloonPercent}
            onChange={(e) => setBalloonPercent(+e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      )}

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Calculate
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
                <div className="flex items-center gap-2">
                  <span className="w-16 text-gray-400">Principal</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full flex items-center pl-2 text-white" style={{width: '100%'}}>
                      {fmt(principal)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16 text-gray-400">Interest</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full flex items-center pl-2 text-white" style={{width: `${(result.totalInterest / result.totalPayment) * 100}%`}}>
                      {fmt(result.totalInterest)}
                    </div>
                  </div>
                </div>
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
                💡 You pay only interest for {result.payoffYears} years, then {fmt(result.balloonAmount)} in balloon payment at the end.
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}