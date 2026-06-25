import { useState } from 'react'

export default function RetirementCalc() {
  const [country, setCountry] = useState('us')
  const [currentAge, setCurrentAge] = useState('')
  const [retirementAge, setRetirementAge] = useState('65')
  const [currentSavings, setCurrentSavings] = useState('')
  const [annualIncome, setAnnualIncome] = useState('')
  const [employeeContrib, setEmployeeContrib] = useState('')
  const [employerMatch, setEmployerMatch] = useState('')
  const [matchUpTo, setMatchUpTo] = useState('')
  const [returnRate, setReturnRate] = useState('7')
  const [inflationRate, setInflationRate] = useState('2.5')
  const [result, setResult] = useState(null)

  // 2026 한도
  const US_LIMIT_UNDER50 = 24500
  const US_LIMIT_50PLUS = 32500
  const US_LIMIT_60TO63 = 35750
  const UK_ANNUAL_ALLOWANCE = 60000
  const UK_STATE_PENSION_WEEKLY = 230.25

  const fmt = (n, cur = country) => {
    const sym = cur === 'uk' ? '£' : '$'
    return sym + Math.round(n).toLocaleString()
  }

  const calculate = () => {
    const age = parseInt(currentAge) || 30
    const retAge = parseInt(retirementAge) || 65
    const savings = parseFloat(currentSavings) || 0
    const income = parseFloat(annualIncome) || 0
    const empPct = parseFloat(employeeContrib) || 0
    const matchPct = parseFloat(employerMatch) || 0
    const matchCap = parseFloat(matchUpTo) || 0
    const growth = parseFloat(returnRate) / 100
    const inflation = parseFloat(inflationRate) / 100
    const years = Math.max(0, retAge - age)
    const realReturn = (1 + growth) / (1 + inflation) - 1

    // 연간 기여금
    const employeeAnnual = income * (empPct / 100)
    const employerAnnual = income * Math.min(empPct / 100, matchCap / 100) * (matchPct / 100)
    const totalAnnual = employeeAnnual + employerAnnual

    // 2026 한도 확인
    let limit = US_LIMIT_UNDER50
    if (country === 'us') {
      if (age >= 60 && age <= 63) limit = US_LIMIT_60TO63
      else if (age >= 50) limit = US_LIMIT_50PLUS
    } else {
      limit = Math.min(UK_ANNUAL_ALLOWANCE, income)
    }
    const isOverLimit = employeeAnnual > limit

    // 복리 성장 계산
    let pot = savings
    const yearlyData = []
    for (let y = 0; y < years; y++) {
      pot = pot * (1 + growth) + totalAnnual
      if (y % 5 === 4 || y === years - 1) {
        yearlyData.push({ age: age + y + 1, pot: Math.round(pot) })
      }
    }
    const finalPot = pot

    // 4% rule 인출
    const annualIncome4pct = finalPot * 0.04
    const monthlyIncome4pct = annualIncome4pct / 12

    // UK State Pension
    const statePensionAnnual = UK_STATE_PENSION_WEEKLY * 52
    const totalUKIncome = country === 'uk' ? annualIncome4pct + statePensionAnnual : null

    // 실질가치 (인플레이션 반영)
    const realPot = finalPot / Math.pow(1 + inflation, years)

    // 세금 혜택 절감액 (US: 22% 세율 가정, UK: 20%)
    const taxRate = country === 'us' ? 0.22 : 0.20
    const taxSaving = employeeAnnual * taxRate * years

    setResult({
      finalPot,
      realPot,
      annualIncome4pct,
      monthlyIncome4pct,
      totalUKIncome,
      statePensionAnnual,
      employeeAnnual,
      employerAnnual,
      totalAnnual,
      years,
      yearlyData,
      isOverLimit,
      limit,
      taxSaving,
      income,
      empPct,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {country === 'us' ? '401(k) Calculator 2026' : 'UK Pension Calculator 2026/27'}
        </h2>
        <p className="text-sm text-gray-500">
          Project your retirement pot with employer match, compound growth, and tax relief.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {country === 'us'
            ? `2026 limits: $${US_LIMIT_UNDER50.toLocaleString()} (under 50) | $${US_LIMIT_50PLUS.toLocaleString()} (50+) | $${US_LIMIT_60TO63.toLocaleString()} (60–63)`
            : `2026/27 annual allowance: £${UK_ANNUAL_ALLOWANCE.toLocaleString()} | State Pension: £${Math.round(statePensionAnnual = UK_STATE_PENSION_WEEKLY * 52).toLocaleString()}/yr`
          }
        </p>
      </div>

      {/* 국가 선택 */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { value: 'us', label: '🇺🇸 US 401(k)' },
            { value: 'uk', label: '🇬🇧 UK Pension' },
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
        {/* 나이 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Age</label>
            <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)}
              placeholder="30"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Retirement Age</label>
            <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* 현재 저축 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current Retirement Savings</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)}
              placeholder="0"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* 연봉 */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)}
              placeholder={country === 'uk' ? '45,000' : '75,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* 기여율 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {country === 'us' ? 'Your Contribution (%)' : 'Employee Contribution (%)'}
            </label>
            <input type="number" step="0.5" value={employeeContrib} onChange={e => setEmployeeContrib(e.target.value)}
              placeholder={country === 'uk' ? '5' : '6'}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {country === 'us' ? 'Employer Match (%)' : 'Employer Contribution (%)'}
            </label>
            <input type="number" step="0.5" value={employerMatch} onChange={e => setEmployerMatch(e.target.value)}
              placeholder={country === 'uk' ? '3' : '100'}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {country === 'us' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Employer Matches Up To (% of salary)</label>
            <p className="text-xs text-gray-400 mb-1">e.g. "100% match up to 6% of salary" → enter 6</p>
            <input type="number" step="0.5" value={matchUpTo} onChange={e => setMatchUpTo(e.target.value)}
              placeholder="6"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

        {/* 수익률 & 인플레이션 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Expected Return (%/yr)</label>
            <input type="number" step="0.5" value={returnRate} onChange={e => setReturnRate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Inflation (%/yr)</label>
            <input type="number" step="0.5" value={inflationRate} onChange={e => setInflationRate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Retirement Pot
      </button>

      {/* 결과 */}
      {result && (
        <div className="mt-6 space-y-4">
          {/* 한도 경고 */}
          {result.isOverLimit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              ⚠️ Your contribution ({fmt(result.employeeAnnual)}/yr) exceeds the 2026 {country === 'us' ? 'IRS' : 'HMRC'} limit of {fmt(result.limit)}. Adjust your contribution %.
            </div>
          )}

          {/* 최종 결과 */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Projected Pot at {retirementAge}
                </p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.finalPot)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Real value (today's money): {fmt(result.realPot)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Monthly Income (4% rule)</p>
                <p className="text-2xl font-bold text-gray-700">{fmt(result.monthlyIncome4pct)}</p>
                {country === 'uk' && (
                  <p className="text-xs text-green-600 mt-1">
                    + State Pension: {fmt(result.statePensionAnnual)}/yr
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* 기여금 상세 */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Annual Contributions</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Your contribution</span>
              <span className="font-semibold">{fmt(result.employeeAnnual)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Employer contribution</span>
              <span className="font-semibold text-green-600">{fmt(result.employerAnnual)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span>Total Annual</span>
              <span>{fmt(result.totalAnnual)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Estimated tax savings ({result.years} yrs)</span>
              <span className="font-semibold">{fmt(result.taxSaving)}</span>
            </div>
          </div>

          {/* 성장 마일스톤 */}
          {result.yearlyData.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Growth Milestones</p>
              <div className="space-y-2">
                {result.yearlyData.map((d, i) => {
                  const pct = Math.min(100, (d.pot / result.finalPot) * 100)
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-14">Age {d.age}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-24 text-right">{fmt(d.pot)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 안내 */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            {country === 'us' ? (
              <>
                <p className="font-bold">ℹ️ US 401(k) 2026 Limits</p>
                <p>• Under 50: ${US_LIMIT_UNDER50.toLocaleString()}/yr employee max</p>
                <p>• Age 50+: ${US_LIMIT_50PLUS.toLocaleString()}/yr (catch-up +$8,000)</p>
                <p>• Age 60–63: ${US_LIMIT_60TO63.toLocaleString()}/yr (super catch-up)</p>
                <p>• Total incl. employer: $72,000/yr max</p>
                <p>• Always contribute at least enough to get full employer match — it's free money</p>
              </>
            ) : (
              <>
                <p className="font-bold">ℹ️ UK Pension 2026/27</p>
                <p>• Annual allowance: £60,000 (employee + employer + tax relief)</p>
                <p>• Auto-enrolment minimum: 8% total (5% employee + 3% employer)</p>
                <p>• Basic rate tax relief: 20% added automatically</p>
                <p>• State Pension: £230.25/week (£11,973/yr) from April 2026</p>
                <p>• Access from age 55 (rising to 57 from April 2028)</p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}