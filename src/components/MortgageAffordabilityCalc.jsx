import { useState } from 'react'

export default function MortgageAffordabilityCalc() {
  const [country, setCountry] = useState('us')
  const [annualIncome, setAnnualIncome] = useState('')
  const [monthlyDebts, setMonthlyDebts] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('6.52')
  const [loanTerm, setLoanTerm] = useState('30')
  const [partnerIncome, setPartnerIncome] = useState('')
  const [result, setResult] = useState(null)

  const fmt = (n) => (country === 'uk' ? '£' : '$') + Math.round(n).toLocaleString()

  const calcMonthlyPayment = (principal, annualRate, years) => {
    const r = annualRate / 100 / 12
    const n = years * 12
    if (r === 0) return principal / n
    return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
  }

  const calculateUS = () => {
    const income = parseFloat(annualIncome) || 0
    const debts = parseFloat(monthlyDebts) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 6.52
    const term = parseInt(loanTerm) || 30
    const monthlyIncome = income / 12

    const calcMaxLoan = (maxPayment) => {
      const r = rate / 100 / 12
      const n = term * 12
      if (r === 0) return maxPayment * n
      return maxPayment * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n))
    }

    const scenarios = [
      {
        label: 'Conservative',
        desc: '28/36 Rule — Comfortable budget',
        color: 'green',
        maxPayment: Math.max(0, Math.min(monthlyIncome * 0.28, monthlyIncome * 0.36 - debts)),
      },
      {
        label: 'Standard',
        desc: '36/43 Rule — Most lenders approve',
        color: 'blue',
        maxPayment: Math.max(0, Math.min(monthlyIncome * 0.36, monthlyIncome * 0.43 - debts)),
      },
      {
        label: 'Maximum (FHA)',
        desc: '31/50 Rule — Stretched budget',
        color: 'orange',
        maxPayment: Math.max(0, Math.min(monthlyIncome * 0.31, monthlyIncome * 0.50 - debts)),
      },
    ].map(s => ({
      ...s,
      maxLoan: Math.max(0, calcMaxLoan(s.maxPayment)),
      maxHome: Math.max(0, calcMaxLoan(s.maxPayment)) + down,
    }))

    const dti = monthlyIncome > 0
      ? (((debts + scenarios[1].maxPayment) / monthlyIncome) * 100).toFixed(1)
      : null

    setResult({ country: 'us', scenarios, monthlyIncome, debts, down, dti, rate, term })
  }

  const calculateUK = () => {
    const income = parseFloat(annualIncome) || 0
    const partner = parseFloat(partnerIncome) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 5.0
    const term = parseInt(loanTerm) || 25
    const combined = income + partner

    const scenarios = [
      { label: 'Conservative (4x)',  desc: 'Comfortable — stress test safe', multiple: 4.0 },
      { label: 'Standard (4.5x)',    desc: 'Most high-street lenders',        multiple: 4.5 },
      { label: 'Enhanced (5.5x)',    desc: 'Higher earners (£75k+)',          multiple: 5.5 },
    ].map(s => {
      const maxLoan = combined * s.multiple
      return {
        ...s,
        maxLoan,
        maxHome: maxLoan + down,
        monthly: calcMonthlyPayment(maxLoan, rate, term),
        stressMonthly: calcMonthlyPayment(maxLoan, rate + 3, term),
      }
    })

    setResult({ country: 'uk', scenarios, income, partner, combined, down, rate, term })
  }

  const calculate = () => {
    if (country === 'us') calculateUS()
    else calculateUK()
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Mortgage Affordability Calculator 2026</h2>
        <p className="text-sm text-gray-500">Find out how much you can borrow — US DTI method or UK income multiple.</p>
        <p className="text-xs text-gray-400 mt-1">US rates: 30yr avg 6.52% (Jun 2026) | UK multiples: 4x–5.5x</p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
        <div className="grid grid-cols-2 gap-2">
          {[{ value: 'us', label: '🇺🇸 United States' }, { value: 'uk', label: '🇬🇧 United Kingdom' }].map(opt => (
            <button key={opt.value} onClick={() => { setCountry(opt.value); setResult(null) }}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${country === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {country === 'uk' ? 'Your Annual Income (gross)' : 'Annual Household Income'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)}
              placeholder={country === 'uk' ? '50,000' : '85,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {country === 'uk' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Partner's Annual Income (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={partnerIncome} onChange={e => setPartnerIncome(e.target.value)} placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        )}

        {country === 'us' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Debt Payments</label>
            <p className="text-xs text-gray-400 mb-1">Car loans, student loans, credit card minimums (exclude rent)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)} placeholder="500"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Down Payment / Deposit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)}
              placeholder={country === 'uk' ? '50,000' : '60,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Interest Rate (%)</label>
            <input type="number" step="0.01" value={interestRate} onChange={e => setInterestRate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Term (years)</label>
            <select value={loanTerm} onChange={e => setLoanTerm(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              {(country === 'us' ? ['10','15','20','25','30'] : ['10','15','20','25','30','35']).map(y => (
                <option key={y} value={y}>{y} years</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Affordability
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-bold text-gray-600">
            {result.country === 'us' ? '3 Scenarios (Conservative → Stretched)' : '3 Lender Scenarios'}
          </p>

          {result.scenarios.map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 ${
              i === 0 ? 'border-green-200 bg-green-50' :
              i === 1 ? 'border-blue-200 bg-blue-50' :
                        'border-orange-200 bg-orange-50'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className={`text-sm font-bold ${i === 0 ? 'text-green-700' : i === 1 ? 'text-blue-700' : 'text-orange-700'}`}>
                    {s.label}
                  </p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Max Home Price</p>
                  <p className={`text-xl font-black ${i === 0 ? 'text-green-700' : i === 1 ? 'text-blue-700' : 'text-orange-700'}`}>
                    {fmt(s.maxHome)}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                <div>Max Loan: <span className="font-semibold">{fmt(s.maxLoan)}</span></div>
                <div>Monthly: <span className="font-semibold">
                  {fmt(result.country === 'us' ? s.maxPayment : s.monthly)}
                </span></div>
                {result.country === 'uk' && (
                  <div className="col-span-2">
                    Stress Test (+3%): <span className="font-semibold text-orange-600">{fmt(s.stressMonthly)}/mo</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {result.country === 'us' && result.dti && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
              <p className="font-semibold text-gray-700">Your DTI Summary</p>
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly Income</span>
                <span className="font-semibold">{fmt(result.monthlyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Existing Debts</span>
                <span className="font-semibold">{fmt(result.debts)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Back-end DTI (standard)</span>
                <span className="font-semibold">{result.dti}%</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            {result.country === 'us' ? (
              <>
                <p className="font-bold">ℹ️ US Mortgage Affordability 2026</p>
                <p>• Conservative: 28/36 DTI — recommended for financial safety</p>
                <p>• Standard: 36/43 DTI — most conventional lenders approve</p>
                <p>• Maximum: 31/50 DTI — FHA loans with compensating factors</p>
                <p>• Current 30yr avg rate: ~6.52% (Freddie Mac, Jun 2026)</p>
                <p>• Property taxes, insurance, PMI not included</p>
              </>
            ) : (
              <>
                <p className="font-bold">ℹ️ UK Mortgage Affordability 2026</p>
                <p>• Standard: 4x–4.5x income (most high-street lenders)</p>
                <p>• Enhanced: up to 5.5x for higher earners (£75k+)</p>
                <p>• All lenders stress test at rate +3% (FCA MCOB 11.6)</p>
                <p>• BoE caps &gt;4.5x lending at 15% of each lender's flow</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Much Mortgage Can I Afford?</h2>
          <p className="leading-relaxed">
            Mortgage affordability depends on your income, existing debts, and the lender's criteria.
            In the US, lenders use the debt-to-income (DTI) ratio — most conventional lenders allow a back-end DTI of up to 43%.
            In the UK, lenders typically offer 4 to 4.5 times your annual salary, with some offering up to 5.5x for higher earners.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">US vs UK Mortgage Rules 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rule</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇺🇸 United States</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇬🇧 United Kingdom</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Method',        'DTI Ratio',              'Income Multiple'],
                  ['Conservative',  '28/36 DTI',              '4x salary'],
                  ['Standard',      '36/43 DTI',              '4.5x salary'],
                  ['Maximum',       '31/50 DTI (FHA)',         '5.5x (higher earners)'],
                  ['Stress Test',   'Rate + affordability',   'Rate + 3% (FCA rule)'],
                  ['Current Rate',  '~6.52% (30yr, Jun 2026)','~4.5–5.5% (2yr fix)'],
                ].map(([rule, us, uk], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{rule}</td>
                    <td className="p-2 border border-gray-200">{us}</td>
                    <td className="p-2 border border-gray-200">{uk}</td>
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
              { q: 'How much mortgage can I get on a $80,000 salary?', a: 'Using the standard 36/43 DTI rule with no existing debts and a 6.52% rate on a 30-year loan, you could borrow approximately $280,000–$320,000. With a 20% down payment, that means a home price of around $350,000–$400,000.' },
              { q: 'How much can I borrow on a £50,000 salary in the UK?', a: 'Most UK lenders will offer 4x to 4.5x your salary, so between £200,000 and £225,000. Some lenders offer up to 5.5x (£275,000) for higher earners. Add your deposit to get your maximum property price.' },
              { q: 'What is a DTI ratio?', a: 'Debt-to-income (DTI) is your total monthly debt payments divided by gross monthly income. A back-end DTI below 36% is considered strong. Most US lenders accept up to 43%, and FHA loans may allow up to 50%.' },
              { q: 'What is the UK mortgage stress test?', a: 'UK lenders must verify you can still afford repayments if interest rates rise by 3%. Required by the FCA under MCOB 11.6. This means the amount you can borrow may be lower than the simple income multiple suggests.' },
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