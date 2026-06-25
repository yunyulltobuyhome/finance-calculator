import { useState } from 'react'

export default function MortgageAffordabilityCalc() {
  const [country, setCountry] = useState('us')

  // US 공통
  const [annualIncome, setAnnualIncome] = useState('')
  const [monthlyDebts, setMonthlyDebts] = useState('')
  const [downPayment, setDownPayment] = useState('')
  const [interestRate, setInterestRate] = useState('6.52')
  const [loanTerm, setLoanTerm] = useState('30')

  // UK 전용
  const [partnerIncome, setPartnerIncome] = useState('')
  const [incomeMultiple, setIncomeMultiple] = useState('4.5')

  const [result, setResult] = useState(null)

  const fmt = (n, cur = country) => (cur === 'uk' ? '£' : '$') + Math.round(n).toLocaleString()

  // 월 모기지 계산 (원리금 균등상환)
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

    // 28/36 rule (conventional)
    const maxHousingPayment_conservative = monthlyIncome * 0.28
    const maxTotalDebt_conservative = monthlyIncome * 0.36
    const maxHousingPayment_con = Math.min(maxHousingPayment_conservative, maxTotalDebt_conservative - debts)

    // 36/43 rule (standard)
    const maxHousingPayment_standard = monthlyIncome * 0.36
    const maxTotalDebt_standard = monthlyIncome * 0.43
    const maxHousingPayment_std = Math.min(maxHousingPayment_standard, maxTotalDebt_standard - debts)

    // 43/50 FHA
    const maxHousingPayment_fha_front = monthlyIncome * 0.31
    const maxTotalDebt_fha = monthlyIncome * 0.50
    const maxHousingPayment_fha = Math.min(maxHousingPayment_fha_front, maxTotalDebt_fha - debts)

    // 대출 한도 계산 (역산)
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
        maxLoan: Math.max(0, calcMaxLoan(maxHousingPayment_con)),
        maxPayment: Math.max(0, maxHousingPayment_con),
        color: 'green',
      },
      {
        label: 'Standard',
        desc: '36/43 Rule — Most lenders approve',
        maxLoan: Math.max(0, calcMaxLoan(maxHousingPayment_std)),
        maxPayment: Math.max(0, maxHousingPayment_std),
        color: 'blue',
      },
      {
        label: 'Maximum (FHA)',
        desc: '31/50 Rule — Stretched budget',
        maxLoan: Math.max(0, calcMaxLoan(maxHousingPayment_fha)),
        maxPayment: Math.max(0, maxHousingPayment_fha),
        color: 'orange',
      },
    ]

    const dti = debts > 0 ? ((debts + scenarios[1].maxPayment) / monthlyIncome * 100).toFixed(1) : null

    setResult({
      country: 'us',
      scenarios: scenarios.map(s => ({ ...s, maxHome: s.maxLoan + down })),
      monthlyIncome,
      debts,
      down,
      dti,
      rate,
      term,
    })
  }

  const calculateUK = () => {
    const income = parseFloat(annualIncome) || 0
    const partner = parseFloat(partnerIncome) || 0
    const down = parseFloat(downPayment) || 0
    const rate = parseFloat(interestRate) || 5.0
    const term = parseInt(loanTerm) || 25
    const multiple = parseFloat(incomeMultiple) || 4.5
    const combined = income + partner

    const scenarios = [
      { label: 'Conservative (4x)', desc: 'Comfortable — stress test safe', multiple: 4.0 },
      { label: 'Standard (4.5x)',   desc: 'Most high-street lenders',       multiple: 4.5 },
      { label: 'Enhanced (5.5x)',   desc: 'Higher earners (£75k+)',         multiple: 5.5 },
    ]

    const results = scenarios.map(s => {
      const maxLoan = combined * s.multiple
      const maxHome = maxLoan + down
      const monthly = calcMonthlyPayment(maxLoan, rate, term)
      // 스트레스 테스트 (rate + 3%)
      const stressMonthly = calcMonthlyPayment(maxLoan, rate + 3, term)
      return { ...s, maxLoan, maxHome, monthly, stressMonthly }
    })

    setResult({ country: 'uk', scenarios: results, income, partner, combined, down, rate, term })
  }

  const calculate = () => {
    if (country === 'us') calculateUS()
    else calculateUK()
  }

  const colorMap = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Mortgage Affordability Calculator 2026</h2>
        <p className="text-sm text-gray-500">Find out how much you can borrow — US DTI method or UK income multiple.</p>
        <p className="text-xs text-gray-400 mt-1">US rates: 30yr avg 6.52% (Jun 2026) | UK multiples: 4x–5.5x</p>
      </div>

      {/* 국가 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'us', label: '🇺🇸 United States' },
            { value: 'uk', label: '🇬🇧 United Kingdom' },
          ].map(opt => (
            <button key={opt.value} onClick={() => { setCountry(opt.value); setResult(null) }}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                country === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {/* 소득 */}
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

        {/* UK 파트너 소득 */}
        {country === 'uk' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Partner's Annual Income (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
              <input type="number" value={partnerIncome} onChange={e => setPartnerIncome(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        )}

        {/* US: 월 부채 */}
        {country === 'us' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Monthly Debt Payments</label>
            <p className="text-xs text-gray-400 mb-1">Car loans, student loans, credit card minimums (exclude rent)</p>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={monthlyDebts} onChange={e => setMonthlyDebts(e.target.value)}
                placeholder="500"
                className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            </div>
          </div>
        )}

        {/* 다운페이 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Down Payment / Deposit</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={downPayment} onChange={e => setDownPayment(e.target.value)}
              placeholder={country === 'uk' ? '50,000' : '60,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* 금리 & 기간 */}
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
              {country === 'us'
                ? ['10','15','20','25','30'].map(y => <option key={y} value={y}>{y} years</option>)
                : ['10','15','20','25','30','35'].map(y => <option key={y} value={y}>{y} years</option>)
              }
            </select>
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Affordability
      </button>

      {/* 결과 */}
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
                    {fmt(s.maxHome || s.maxLoan + (parseFloat(downPayment) || 0))}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                <div>Max Loan: <span className="font-semibold">{fmt(s.maxLoan)}</span></div>
                <div>
                  Monthly Payment:{' '}
                  <span className="font-semibold">
                    {fmt(result.country === 'us'
                      ? s.maxPayment
                      : s.monthly
                    )}
                  </span>
                </div>
                {result.country === 'uk' && (
                  <div className="col-span-2">
                    Stress Test (+3%): <span className="font-semibold text-orange-600">{fmt(s.stressMonthly)}/mo</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* DTI 요약 (US) */}
          {result.country === 'us' && result.dti && (
            <div className="bg-gray-50 rounded-xl p-4 text-sm">
              <p className="font-semibold text-gray-700 mb-2">Your DTI Summary</p>
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

          {/* 안내 */}
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
                <p>• Actual offer depends on credit score & outgoings</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}