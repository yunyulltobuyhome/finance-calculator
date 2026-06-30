import { useState } from 'react'

const US_LIMIT_UNDER50 = 24500
const US_LIMIT_50PLUS = 32500
const US_LIMIT_60TO63 = 35750
const UK_ANNUAL_ALLOWANCE = 60000
const UK_STATE_PENSION_WEEKLY = 230.25
const UK_STATE_PENSION_ANNUAL = UK_STATE_PENSION_WEEKLY * 52

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

  const fmt = (n) => (country === 'uk' ? '£' : '$') + Math.round(n).toLocaleString()

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

    const employeeAnnual = income * (empPct / 100)
    const employerAnnual = country === 'us'
      ? income * Math.min(empPct / 100, matchCap / 100) * (matchPct / 100)
      : income * (matchPct / 100)
    const totalAnnual = employeeAnnual + employerAnnual

    let limit = country === 'us'
      ? (age >= 60 && age <= 63 ? US_LIMIT_60TO63 : age >= 50 ? US_LIMIT_50PLUS : US_LIMIT_UNDER50)
      : Math.min(UK_ANNUAL_ALLOWANCE, income)
    const isOverLimit = employeeAnnual > limit

    let pot = savings
    const yearlyData = []
    for (let y = 0; y < years; y++) {
      pot = pot * (1 + growth) + totalAnnual
      if (y % 5 === 4 || y === years - 1) {
        yearlyData.push({ age: age + y + 1, pot: Math.round(pot) })
      }
    }
    const finalPot = pot
    const annualIncome4pct = finalPot * 0.04
    const monthlyIncome4pct = annualIncome4pct / 12
    const realPot = finalPot / Math.pow(1 + inflation, years)
    const taxRate = country === 'us' ? 0.22 : 0.20
    const taxSaving = employeeAnnual * taxRate * years

    setResult({
      finalPot, realPot, annualIncome4pct, monthlyIncome4pct,
      employeeAnnual, employerAnnual, totalAnnual,
      years, yearlyData, isOverLimit, limit, taxSaving,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          {country === 'us' ? '401(k) Calculator 2026' : 'UK Pension Calculator 2026/27'}
        </h1>
        <p className="text-sm text-gray-500">Project your retirement pot with employer match, compound growth, and tax relief.</p>
        <p className="text-xs text-gray-400 mt-1">
          {country === 'us'
            ? `2026 limits: $${US_LIMIT_UNDER50.toLocaleString()} (under 50) | $${US_LIMIT_50PLUS.toLocaleString()} (50+) | $${US_LIMIT_60TO63.toLocaleString()} (60–63)`
            : `2026/27: £${UK_ANNUAL_ALLOWANCE.toLocaleString()} annual allowance | State Pension £${Math.round(UK_STATE_PENSION_ANNUAL).toLocaleString()}/yr`}
        </p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Plan Type</label>
        <div className="grid grid-cols-2 gap-2">
          {[{ value: 'us', label: '🇺🇸 US 401(k)' }, { value: 'uk', label: '🇬🇧 UK Pension' }].map(opt => (
            <button key={opt.value} onClick={() => { setCountry(opt.value); setResult(null) }}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${country === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Age</label>
            <input type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} placeholder="30"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Retirement Age</label>
            <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} placeholder="65"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Current Retirement Savings</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={currentSavings} onChange={e => setCurrentSavings(e.target.value)} placeholder="0"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={annualIncome} onChange={e => setAnnualIncome(e.target.value)}
              placeholder={country === 'uk' ? '45,000' : '75,000'}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Contribution (%)</label>
            <input type="number" step="0.5" value={employeeContrib} onChange={e => setEmployeeContrib(e.target.value)}
              placeholder={country === 'uk' ? '5' : '6'}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Employer Contribution (%)</label>
            <input type="number" step="0.5" value={employerMatch} onChange={e => setEmployerMatch(e.target.value)}
              placeholder={country === 'uk' ? '3' : '100'}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {country === 'us' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Employer Matches Up To (% of salary)</label>
            <p className="text-xs text-gray-400 mb-1">e.g. "100% match up to 6%" → enter 6</p>
            <input type="number" step="0.5" value={matchUpTo} onChange={e => setMatchUpTo(e.target.value)} placeholder="6"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

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

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Retirement Pot
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {result.isOverLimit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              ⚠️ Your contribution ({fmt(result.employeeAnnual)}/yr) exceeds the 2026 {country === 'us' ? 'IRS' : 'HMRC'} limit of {fmt(result.limit)}.
            </div>
          )}

          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">Projected Pot at {retirementAge}</p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.finalPot)}</p>
                <p className="text-xs text-gray-400 mt-1">Real value (today's money): {fmt(result.realPot)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Monthly Income (4% rule)</p>
                <p className="text-2xl font-bold text-gray-700">{fmt(result.monthlyIncome4pct)}</p>
                {country === 'uk' && (
                  <p className="text-xs text-green-600 mt-1">+ State Pension: {fmt(UK_STATE_PENSION_ANNUAL)}/yr</p>
                )}
              </div>
            </div>
          </div>

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
              <span>Est. tax savings ({result.years} yrs)</span>
              <span className="font-semibold">{fmt(result.taxSaving)}</span>
            </div>
          </div>

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
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 w-24 text-right">{fmt(d.pot)}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            {country === 'us' ? (
              <>
                <p className="font-bold">ℹ️ US 401(k) 2026 Limits</p>
                <p>• Under 50: ${US_LIMIT_UNDER50.toLocaleString()}/yr employee max</p>
                <p>• Age 50+: ${US_LIMIT_50PLUS.toLocaleString()}/yr (catch-up +$8,000)</p>
                <p>• Age 60–63: ${US_LIMIT_60TO63.toLocaleString()}/yr (super catch-up)</p>
                <p>• Total incl. employer: $72,000/yr max</p>
              </>
            ) : (
              <>
                <p className="font-bold">ℹ️ UK Pension 2026/27</p>
                <p>• Annual allowance: £60,000 (employee + employer + tax relief)</p>
                <p>• Auto-enrolment minimum: 8% total (5% employee + 3% employer)</p>
                <p>• State Pension: £230.25/week (£{Math.round(UK_STATE_PENSION_ANNUAL).toLocaleString()}/yr) from April 2026</p>
                <p>• Access from age 55 (rising to 57 from April 2028)</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">401(k) & Pension Planning in 2026</h2>
          <p className="leading-relaxed">
            Saving into a 401(k) or workplace pension is one of the most tax-efficient ways to build retirement wealth.
            In the US, contributions reduce your taxable income and grow tax-deferred.
            In the UK, basic-rate tax relief is added automatically, and employer contributions are essentially free money you should never leave on the table.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">2026 Contribution Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Plan</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Limit</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['🇺🇸 401(k) under 50',     '$24,500/yr',                  'Employee contributions only'],
                  ['🇺🇸 401(k) age 50+',      '$32,500/yr',                  '+$8,000 catch-up contribution'],
                  ['🇺🇸 401(k) age 60–63',    '$35,750/yr',                  'Super catch-up (SECURE 2.0)'],
                  ['🇺🇸 Total incl. employer', '$72,000/yr',                  'Employee + employer combined'],
                  ['🇬🇧 UK Annual Allowance',  '£60,000/yr',                  'Employee + employer + tax relief'],
                  ['🇬🇧 Auto-enrolment min.',  '8% of qualifying earnings',   '5% employee + 3% employer'],
                  ['🇬🇧 State Pension (2026)', '£230.25/week',                '35 qualifying NI years needed'],
                ].map(([plan, limit, notes], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{plan}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{limit}</td>
                    <td className="p-2 border border-gray-200 text-gray-500">{notes}</td>
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
              { q: 'How much should I contribute to my 401(k)?', a: "At minimum, contribute enough to get your full employer match — that's an instant 50–100% return on your money. Beyond that, aim for 15% of your income including employer contributions. The 2026 IRS limit is $24,500 (under 50) or $32,500 (50+)." },
              { q: 'What is the UK pension annual allowance for 2026?', a: 'The annual allowance for 2026/27 is £60,000, covering all contributions from you, your employer, and tax relief. If your adjusted income exceeds £260,000, the allowance tapers down to a minimum of £10,000.' },
              { q: 'How much do I need to retire comfortably?', a: "A common rule is to multiply your desired annual retirement income by 25 (the 4% rule). To spend £30,000/year in the UK, you'd need a pot of £750,000. The UK State Pension (£11,973/yr in 2026) reduces how much you need to save." },
              { q: 'When can I access my 401(k) or pension?', a: 'In the US, you can access 401(k) funds without penalty from age 59½. In the UK, the minimum pension access age is currently 55, rising to 57 in April 2028.' },
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