import { useState } from 'react'

// 2026 Social Security rates
const SS_2026 = {
  fullRetirementAge: 67, // born 1960 or later
  earlyClaimAge: 62,
  maxDelayAge: 70,
  // Max monthly benefit at FRA 2026
  maxMonthlyFRA: 4018,
  // COLA 2026 estimate
  cola: 0.025,
  // Reduction for early claiming (per month before FRA)
  earlyReductionPerMonth: 0.00556, // 5/9 of 1% for first 36 months
  earlyReductionPerMonthExtra: 0.00417, // 5/12 of 1% beyond 36 months
  // Delayed credit per year past FRA
  delayedCreditPerYear: 0.08,
}

function calcBenefit(estimatedFRABenefit, claimAge, fra = 67) {
  const monthsDiff = (claimAge - fra) * 12
  let adjustmentFactor = 1

  if (monthsDiff < 0) {
    // Early claiming reduction
    const earlyMonths = Math.abs(monthsDiff)
    const firstTier = Math.min(earlyMonths, 36)
    const secondTier = Math.max(0, earlyMonths - 36)
    adjustmentFactor = 1
      - (firstTier * SS_2026.earlyReductionPerMonth)
      - (secondTier * SS_2026.earlyReductionPerMonthExtra)
  } else if (monthsDiff > 0) {
    // Delayed retirement credit
    const delayYears = monthsDiff / 12
    adjustmentFactor = 1 + (delayYears * SS_2026.delayedCreditPerYear)
  }

  return Math.round(estimatedFRABenefit * adjustmentFactor)
}

export default function SocialSecurityCalc() {
  const [fraEstimate, setFraEstimate] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [claimAge, setClaimAge] = useState('67')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Math.round(n).toLocaleString()

  const getFRA = (year) => {
    const y = parseInt(year)
    if (!y) return 67
    if (y <= 1937) return 65
    if (y <= 1942) return 65 + (y - 1937) * 2 / 12
    if (y <= 1954) return 66
    if (y <= 1959) return 66 + (y - 1954) * 2 / 12
    return 67
  }

  const calculate = () => {
    const estimate = parseFloat(fraEstimate) || 0
    const age = parseFloat(claimAge) || 67
    if (estimate <= 0) return

    const fra = getFRA(birthYear)
    const monthly = calcBenefit(estimate, age, fra)
    const annual = monthly * 12

    // Compare all ages 62–70
    const comparison = []
    for (let a = 62; a <= 70; a++) {
      const m = calcBenefit(estimate, a, fra)
      comparison.push({ age: a, monthly: m, annual: m * 12 })
    }

    const reduction = age < fra ? Math.round((1 - monthly / estimate) * 100) : 0
    const increase = age > fra ? Math.round((monthly / estimate - 1) * 100) : 0

    setResult({
      monthly,
      annual,
      estimate,
      age,
      fra,
      reduction,
      increase,
      comparison,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          US Social Security Benefits Calculator 2026
        </h2>
        <p className="text-sm text-gray-500">
          Estimate your monthly Social Security retirement benefit based on your Full Retirement Age benefit and claim age.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ 2026 rates — FRA age 67 for those born 1960+ | Delayed credits 8%/year
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Estimated Monthly Benefit at Full Retirement Age (FRA)
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Find this on your Social Security Statement at ssa.gov/myaccount
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={fraEstimate} onChange={e => setFraEstimate(e.target.value)}
              placeholder="e.g. 2,400"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Birth Year <span className="text-gray-400 font-normal">(to determine your FRA)</span>
          </label>
          <input type="number" value={birthYear} onChange={e => setBirthYear(e.target.value)}
            placeholder="e.g. 1965"
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          {birthYear && (
            <p className="text-xs text-indigo-500 mt-1">
              Your Full Retirement Age: {getFRA(birthYear) % 1 === 0 ? getFRA(birthYear) : getFRA(birthYear).toFixed(1)} years old
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Age You Plan to Claim
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: '62', label: '62 (Earliest)' },
              { value: '65', label: '65' },
              { value: '67', label: '67 (FRA*)' },
              { value: '68', label: '68' },
              { value: '69', label: '69' },
              { value: '70', label: '70 (Max)' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setClaimAge(opt.value)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  claimAge === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-1">*FRA = 67 for those born in 1960 or later</p>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Social Security Benefit
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Estimated Monthly Benefit at Age {result.age}
                </p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.monthly)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {fmt(result.annual)}/year
                </p>
              </div>
              <div className="text-right">
                {result.reduction > 0 && (
                  <>
                    <p className="text-xs text-gray-500">vs FRA benefit</p>
                    <p className="text-xl font-bold text-red-500">-{result.reduction}%</p>
                    <p className="text-xs text-gray-400">permanent reduction</p>
                  </>
                )}
                {result.increase > 0 && (
                  <>
                    <p className="text-xs text-gray-500">vs FRA benefit</p>
                    <p className="text-xl font-bold text-green-600">+{result.increase}%</p>
                    <p className="text-xs text-gray-400">delayed credit</p>
                  </>
                )}
                {result.reduction === 0 && result.increase === 0 && (
                  <>
                    <p className="text-xs text-gray-500">Claiming at FRA</p>
                    <p className="text-xl font-bold text-blue-600">100%</p>
                    <p className="text-xs text-gray-400">full benefit</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Comparison table */}
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-3 text-sm">Benefit by Claim Age (illustrative)</p>
            <div className="space-y-1">
              {result.comparison.map(({ age, monthly, annual }) => (
                <div key={age} className={`flex justify-between items-center py-1.5 px-2 rounded-lg text-xs ${
                  age === result.age ? 'bg-indigo-100 font-bold' : ''
                }`}>
                  <span className={`w-16 ${age === result.age ? 'text-indigo-700' : 'text-gray-500'}`}>
                    Age {age}{age === result.fra ? ' (FRA)' : ''}
                  </span>
                  <div className="flex-1 mx-2">
                    <div className="bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${age === result.age ? 'bg-indigo-500' : 'bg-gray-400'}`}
                        style={{ width: `${(monthly / result.comparison[8].monthly) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className={`w-20 text-right ${age === result.age ? 'text-indigo-700' : 'text-gray-600'}`}>
                    {fmt(monthly)}/mo
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ Social Security 2026 Key Facts</p>
            <p>• FRA is 67 for anyone born in 1960 or later</p>
            <p>• Claiming at 62: permanently reduced by up to 30%</p>
            <p>• Delaying past FRA: benefit grows 8% per year until age 70</p>
            <p>• Maximum monthly benefit at FRA in 2026: $4,018</p>
            <p>• COLA (Cost of Living Adjustment) applied each January</p>
            <p>• Benefits may be taxable if combined income exceeds $25,000 (single) / $32,000 (married)</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ⚠️ <strong>Important:</strong> These are simplified estimates for illustrative purposes only.
            Your actual Social Security benefit is calculated by the SSA based on your 35 highest
            earning years. For your personal benefit estimate, log in to{' '}
            <a href="https://www.ssa.gov/myaccount" target="_blank" rel="noopener noreferrer"
              className="underline text-amber-700">ssa.gov/myaccount</a>.
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            When Should You Claim Social Security?
          </h2>
          <p className="leading-relaxed">
            The decision of when to claim Social Security is one of the most significant retirement
            decisions you can make. Claiming early at 62 permanently reduces your benefit, while
            delaying past your Full Retirement Age (FRA) increases it by 8% per year up to age 70.
            The right answer depends on your health, other income sources, and whether you are married.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Full Retirement Age by Birth Year</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Birth Year</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Full Retirement Age</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['1943–1954', '66 years'],
                  ['1955', '66 years, 2 months'],
                  ['1956', '66 years, 4 months'],
                  ['1957', '66 years, 6 months'],
                  ['1958', '66 years, 8 months'],
                  ['1959', '66 years, 10 months'],
                  ['1960 or later', '67 years'],
                ].map(([year, fra], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{year}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{fra}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Source: Social Security Administration (SSA)</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Is Social Security taxable?',
                a: 'Up to 85% of your Social Security benefits may be taxable depending on your "combined income" (adjusted gross income + non-taxable interest + 50% of Social Security). Single filers with combined income above $25,000 and married filers above $32,000 may owe tax on their benefits. The exact amount depends on your total income.',
              },
              {
                q: 'Can I work and collect Social Security at the same time?',
                a: 'Yes, but if you claim before your Full Retirement Age and continue working, your benefits may be temporarily reduced. In 2026, if you earn more than $22,320 before FRA, $1 is withheld for every $2 earned above that limit. In the year you reach FRA, the limit is higher. Once you reach FRA, there is no earnings limit.',
              },
              {
                q: 'What happens to my benefit if I delay past 70?',
                a: 'Delaying past age 70 provides no additional increase. The maximum delayed retirement credit is 32% above your FRA benefit (8% per year × 4 years from 67 to 70). There is no financial benefit to waiting beyond age 70.',
              },
              {
                q: 'How does Social Security affect married couples?',
                a: 'Married couples have additional claiming strategies available. A spouse can claim a spousal benefit of up to 50% of the higher earner\'s FRA benefit. Survivor benefits allow a widow or widower to receive up to 100% of the deceased spouse\'s benefit. Coordination of claiming ages between spouses can significantly affect lifetime benefits.',
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
          <a href="https://www.ssa.gov/myaccount" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ SSA — My Social Security Account (personal estimate)</a>
          <a href="https://www.ssa.gov/benefits/retirement/planner/agereduction.html" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ SSA — Effect of early or delayed retirement</a>
        </div>
      </div>
    </div>
  )
}