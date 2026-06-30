import { useState } from 'react'

// 2026 IRS limits
const ROTH_LIMITS = {
  under50: 7000,
  over50: 8000,
}
const INCOME_LIMITS = {
  single: { phaseOutStart: 150000, phaseOutEnd: 165000 },
  mfj: { phaseOutStart: 236000, phaseOutEnd: 246000 },
  mfs: { phaseOutStart: 0, phaseOutEnd: 10000 },
}
const TRADITIONAL_DEDUCTIBILITY = {
  // Covered by workplace plan
  single_covered: { phaseOutStart: 79000, phaseOutEnd: 89000 },
  mfj_covered: { phaseOutStart: 126000, phaseOutEnd: 146000 },
  // Spouse covered but not you
  mfj_spouse_covered: { phaseOutStart: 236000, phaseOutEnd: 246000 },
}

function calcRothEligibility(income, filingStatus) {
  const limits = INCOME_LIMITS[filingStatus]
  if (!limits) return { eligible: true, reduced: false, maxContrib: ROTH_LIMITS.under50 }
  if (income <= limits.phaseOutStart) return { eligible: true, reduced: false }
  if (income >= limits.phaseOutEnd) return { eligible: false, reduced: false }
  const reduction = (income - limits.phaseOutStart) / (limits.phaseOutEnd - limits.phaseOutStart)
  return { eligible: true, reduced: true, reductionPct: Math.round(reduction * 100) }
}

function projectGrowth(annualContrib, years, returnRate, taxRate, isRoth, currentAge) {
  const r = returnRate / 100
  let balance = 0
  for (let y = 0; y < years; y++) {
    balance = (balance + annualContrib) * (1 + r)
  }
  // Roth: tax-free withdrawal
  // Traditional: taxed on withdrawal
  const afterTaxValue = isRoth ? balance : balance * (1 - taxRate / 100)
  const taxSavingNow = isRoth ? 0 : annualContrib * years * (taxRate / 100)
  return { balance: Math.round(balance), afterTaxValue: Math.round(afterTaxValue), taxSavingNow: Math.round(taxSavingNow) }
}

export default function RothIRACalc() {
  const [filingStatus, setFilingStatus] = useState('single')
  const [age, setAge] = useState('')
  const [income, setIncome] = useState('')
  const [contribution, setContribution] = useState('')
  const [currentTaxRate, setCurrentTaxRate] = useState('22')
  const [retirementTaxRate, setRetirementTaxRate] = useState('15')
  const [returnRate, setReturnRate] = useState('7')
  const [retirementAge, setRetirementAge] = useState('65')
  const [coveredByPlan, setCoveredByPlan] = useState(true)
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Math.round(n).toLocaleString()

  const calculate = () => {
    const a = parseInt(age) || 30
    const inc = parseFloat(income) || 0
    const contrib = parseFloat(contribution) || (a >= 50 ? ROTH_LIMITS.over50 : ROTH_LIMITS.under50)
    const currTax = parseFloat(currentTaxRate) || 22
    const retTax = parseFloat(retirementTaxRate) || 15
    const ret = parseFloat(returnRate) || 7
    const retAge = parseInt(retirementAge) || 65
    const years = Math.max(0, retAge - a)
    const limit = a >= 50 ? ROTH_LIMITS.over50 : ROTH_LIMITS.under50
    const effectiveContrib = Math.min(contrib, limit)

    // Roth eligibility
    const rothEligibility = calcRothEligibility(inc, filingStatus)

    // Traditional deductibility
    let traditionalDeductible = true
    if (coveredByPlan) {
      const trad = filingStatus === 'single'
        ? TRADITIONAL_DEDUCTIBILITY.single_covered
        : TRADITIONAL_DEDUCTIBILITY.mfj_covered
      if (inc > trad.phaseOutEnd) traditionalDeductible = false
      else if (inc > trad.phaseOutStart) traditionalDeductible = 'partial'
    }

    // Projections
    const roth = projectGrowth(effectiveContrib, years, ret, retTax, true, a)
    const trad = projectGrowth(effectiveContrib, years, ret, retTax, false, a)

    // Tax saved now with Traditional (if deductible)
    const annualTaxSaving = traditionalDeductible === true ? effectiveContrib * (currTax / 100) : 0

    // Which is better
    const rothBetter = roth.afterTaxValue > trad.afterTaxValue
    const difference = Math.abs(roth.afterTaxValue - trad.afterTaxValue)

    // Break-even tax rate in retirement
    // Roth after-tax = Traditional after-tax when: balance × (1 - retirementRate) = balance
    // So breakEvenRate = 1 - (roth.balance / trad.balance) -- simplified
    const breakEvenRate = Math.round((1 - trad.afterTaxValue / roth.balance) * 100)

    setResult({
      roth,
      trad,
      rothBetter,
      difference,
      rothEligibility,
      traditionalDeductible,
      annualTaxSaving,
      limit,
      effectiveContrib,
      years,
      currTax,
      retTax,
      breakEvenRate,
      inc,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Roth vs Traditional IRA Calculator 2026
        </h1>
        <p className="text-sm text-gray-500">
          Compare Roth and Traditional IRA projected values based on your tax situation and timeline.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ 2026 IRS limits — $7,000 (under 50) | $8,000 (age 50+)
        </p>
      </div>

      <div className="space-y-4">
        {/* Filing status */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Filing Status</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'single', label: '👤 Single' },
              { value: 'mfj', label: '👫 Married Filing Jointly' },
              { value: 'mfs', label: '💔 Married Filing Separately' },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setFilingStatus(opt.value); setResult(null) }}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  filingStatus === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age & Retirement Age */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Current Age</label>
            <input type="number" value={age} onChange={e => setAge(e.target.value)}
              placeholder="e.g. 35"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Retirement Age</label>
            <input type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)}
              placeholder="65"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Income */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Income (MAGI)
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Modified Adjusted Gross Income — affects Roth eligibility and Traditional deductibility
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={income} onChange={e => setIncome(e.target.value)}
              placeholder="e.g. 75,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Annual contribution */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual IRA Contribution
          </label>
          <p className="text-xs text-gray-400 mb-1">
            2026 max: ${(age >= 50 ? ROTH_LIMITS.over50 : ROTH_LIMITS.under50).toLocaleString()} ({age >= 50 ? 'age 50+' : 'under 50'})
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={contribution} onChange={e => setContribution(e.target.value)}
              placeholder={`e.g. ${age >= 50 ? '8,000' : '7,000'}`}
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Tax rates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Current Tax Rate (%)
            </label>
            <p className="text-xs text-gray-400 mb-1">Your marginal federal rate today</p>
            <input type="number" value={currentTaxRate} onChange={e => setCurrentTaxRate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Retirement Tax Rate (%)
            </label>
            <p className="text-xs text-gray-400 mb-1">Expected rate when withdrawing</p>
            <input type="number" value={retirementTaxRate} onChange={e => setRetirementTaxRate(e.target.value)}
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Return rate */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Expected Annual Return (%)
          </label>
          <input type="number" step="0.5" value={returnRate} onChange={e => setReturnRate(e.target.value)}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        {/* Covered by workplace plan */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={coveredByPlan}
              onChange={e => setCoveredByPlan(e.target.checked)}
              className="w-4 h-4 accent-indigo-600" />
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Covered by workplace retirement plan (401k, 403b etc.)
              </p>
              <p className="text-xs text-gray-400">Affects Traditional IRA deductibility</p>
            </div>
          </label>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Compare Roth vs Traditional
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Eligibility alerts */}
          {!result.rothEligibility.eligible && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
              ⚠️ Your income of {fmt(result.inc)} exceeds the 2026 Roth IRA limit for {filingStatus === 'single' ? 'single filers' : 'your filing status'}.
              You may not be able to contribute directly to a Roth IRA — consider a backdoor Roth conversion (consult a tax adviser).
            </div>
          )}
          {result.rothEligibility.reduced && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-700">
              ⚠️ Your Roth IRA contribution limit may be reduced due to your income level (~{result.rothEligibility.reductionPct}% phase-out applied).
              Consult a tax adviser for your exact reduced limit.
            </div>
          )}
          {result.traditionalDeductible === false && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
              ℹ️ At your income level, Traditional IRA contributions may not be tax-deductible (covered by workplace plan).
              A non-deductible Traditional IRA or Roth IRA may be more appropriate — consult a tax adviser.
            </div>
          )}

          {/* Winner banner */}
          <div className={`rounded-xl p-5 border ${result.rothBetter ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
            <p className={`text-sm font-bold mb-1 ${result.rothBetter ? 'text-blue-700' : 'text-green-700'}`}>
              📊 Based on your inputs, {result.rothBetter ? 'Roth IRA' : 'Traditional IRA'} projects a higher after-tax value
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Estimated difference: {fmt(result.difference)} at retirement (illustrative — see disclaimer below)
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className={`rounded-lg p-3 border ${result.rothBetter ? 'bg-blue-100 border-blue-300' : 'bg-white border-gray-200'}`}>
                <p className="text-xs font-bold text-blue-700 mb-1">🔵 Roth IRA</p>
                <p className="text-xl font-black text-blue-800">{fmt(result.roth.afterTaxValue)}</p>
                <p className="text-xs text-gray-500">After-tax at retirement</p>
                <p className="text-xs text-gray-400 mt-1">Pre-tax: {fmt(result.roth.balance)}</p>
              </div>
              <div className={`rounded-lg p-3 border ${!result.rothBetter ? 'bg-green-100 border-green-300' : 'bg-white border-gray-200'}`}>
                <p className="text-xs font-bold text-green-700 mb-1">🟢 Traditional IRA</p>
                <p className="text-xl font-black text-green-800">{fmt(result.trad.afterTaxValue)}</p>
                <p className="text-xs text-gray-500">After-tax at retirement</p>
                <p className="text-xs text-gray-400 mt-1">Pre-tax: {fmt(result.trad.balance)}</p>
              </div>
            </div>
          </div>

          {/* Key comparison */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Key Differences</p>
            {[
              ['Annual contribution', fmt(result.effectiveContrib), fmt(result.effectiveContrib)],
              ['Tax treatment now', 'After-tax (no deduction)', result.traditionalDeductible === true ? 'Pre-tax (deductible)' : 'After-tax (not deductible)'],
              ['Tax on growth', 'Tax-free', 'Tax-deferred'],
              ['Tax on withdrawal', 'None (qualified)', `~${result.retTax}% (ordinary income)`],
              ['Annual tax saving now', '$0', result.annualTaxSaving > 0 ? fmt(result.annualTaxSaving) : 'None (not deductible)'],
              ['RMDs at 73', 'None required', 'Required'],
            ].map(([label, roth, trad], i) => (
              <div key={i} className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100 last:border-0 text-xs">
                <span className="text-gray-500 font-medium">{label}</span>
                <span className="text-blue-600">{roth}</span>
                <span className="text-green-600">{trad}</span>
              </div>
            ))}
          </div>

          {/* Break-even */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-700">
            <p className="font-bold mb-1">💡 Break-Even Tax Rate</p>
            <p>
              Based on these projections, if your retirement tax rate is above approximately{' '}
              <strong>{result.breakEvenRate}%</strong>, Roth IRA may produce a higher after-tax outcome.
              If it is below that rate, Traditional IRA may be more favourable.
              This is a simplified estimate — actual outcomes depend on many variables.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ 2026 IRA Limits & Key Facts</p>
            <p>• Annual contribution limit: $7,000 (under 50) | $8,000 (age 50+)</p>
            <p>• Roth income phase-out (single): $150,000 – $165,000</p>
            <p>• Roth income phase-out (MFJ): $236,000 – $246,000</p>
            <p>• Roth withdrawals: tax-free after age 59½ (5-year rule applies)</p>
            <p>• Traditional: RMDs required from age 73</p>
            <p>• You can contribute to both IRA types — total cannot exceed annual limit</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ⚠️ <strong>Important Disclaimer:</strong> These projections are illustrative estimates only
            and do not constitute financial, tax, or investment advice. Actual outcomes depend on
            investment returns, future tax law changes, your full tax situation, and many personal factors.
            The comparison assumes consistent contributions and a fixed return rate.
            Consult a qualified financial adviser or CPA before making IRA contribution decisions.
            Source: <a href="https://www.irs.gov/retirement-plans/ira-contribution-limits" target="_blank"
              rel="noopener noreferrer" className="underline text-amber-700">IRS IRA Contribution Limits</a>.
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            Roth IRA vs Traditional IRA: What's the Difference?
          </h2>
          <p className="leading-relaxed">
            The key difference between a Roth IRA and a Traditional IRA is when you pay tax.
            With a Traditional IRA, contributions may be tax-deductible now, but withdrawals in
            retirement are taxed as ordinary income. With a Roth IRA, contributions are made with
            after-tax dollars, but qualified withdrawals in retirement are completely tax-free.
            Which is better depends primarily on whether your tax rate is higher now or in retirement.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">2026 IRA Comparison at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Feature</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-blue-600">🔵 Roth IRA</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold text-green-600">🟢 Traditional IRA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['2026 Limit (under 50)', '$7,000', '$7,000'],
                  ['2026 Limit (age 50+)', '$8,000', '$8,000'],
                  ['Tax on contributions', 'After-tax (no deduction)', 'May be deductible'],
                  ['Tax on growth', 'Tax-free', 'Tax-deferred'],
                  ['Tax on withdrawal', 'None (qualified)', 'Ordinary income tax'],
                  ['Income limit', 'Yes (phase-out applies)', 'No limit to contribute'],
                  ['Required Minimum Distributions', 'None', 'From age 73'],
                  ['Early withdrawal penalty', '10% (before 59½)', '10% (before 59½)'],
                ].map(([feature, roth, trad], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{feature}</td>
                    <td className="p-2 border border-gray-200 text-blue-600">{roth}</td>
                    <td className="p-2 border border-gray-200 text-green-600">{trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Source: IRS Publication 590-A (2026). Rules are complex — verify with a tax professional.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Should I choose Roth or Traditional IRA?',
                a: 'A common rule of thumb: if you expect to be in a higher tax bracket in retirement than you are now, Roth may be more advantageous. If you expect to be in a lower bracket, Traditional may save more overall. Young earners early in their careers often favour Roth; higher earners approaching peak salary may lean Traditional. This is a personal decision with many variables — a financial adviser can help model your specific situation.',
              },
              {
                q: 'What is the 2026 Roth IRA income limit?',
                a: 'For 2026, single filers can contribute to a Roth IRA if their MAGI is below $150,000 (phase-out begins). The ability to contribute phases out completely at $165,000. For married filing jointly, the phase-out range is $236,000 to $246,000. If your income exceeds these limits, a backdoor Roth IRA conversion may be an option — consult a tax adviser.',
              },
              {
                q: 'Can I contribute to both a Roth and Traditional IRA?',
                a: 'Yes, you can contribute to both in the same year, but your total combined contributions cannot exceed the annual limit ($7,000 under 50 / $8,000 age 50+ in 2026). For example, you could contribute $3,500 to each.',
              },
              {
                q: 'What is a backdoor Roth IRA?',
                a: 'A backdoor Roth IRA is a strategy used by high earners who exceed the Roth income limits. It involves making a non-deductible Traditional IRA contribution and then converting it to a Roth IRA. This is legal but involves tax complexities, particularly if you have other Traditional IRA balances (the pro-rata rule). Always consult a CPA or tax adviser before attempting this strategy.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600">Official Sources</p>
          <a href="https://www.irs.gov/retirement-plans/ira-contribution-limits" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ IRS — IRA Contribution Limits 2026</a>
          <a href="https://www.irs.gov/retirement-plans/roth-iras" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ IRS — Roth IRAs</a>
          <a href="https://www.irs.gov/retirement-plans/traditional-iras" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ IRS — Traditional IRAs</a>
        </div>
      </div>
    </div>
  )
}