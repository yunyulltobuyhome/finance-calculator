import { useState } from 'react'

// 2026/27 Pension Credit rates
const PC_RATES = {
  // Guarantee Credit
  singleStandardMinimum: 227.10,
  coupleStandardMinimum: 346.60,
  // Savings Credit (transitional — for those who reached state pension age before 6 April 2016)
  savingsCreditSingleThreshold: 174.49,
  savingsCreditCoupleThreshold: 277.12,
  savingsCreditMaxSingle: 17.29,
  savingsCreditMaxCouple: 19.36,
  // Additional amounts
  severeDisabilitySingle: 76.40,
  severeDisabilityCouple: 76.40, // per qualifying person
  carerAddition: 46.00,
}

export default function PensionCreditCalc() {
  const [situation, setSituation] = useState('single')
  const [weeklyIncome, setWeeklyIncome] = useState('')
  const [hasSevereDisability, setHasSevereDisability] = useState(false)
  const [isCarer, setIsCarer] = useState(false)
  const [reachedPensionAgePre2016, setReachedPensionAgePre2016] = useState(false)
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Number(n).toFixed(2)
  const fmtAnnual = (n) => '£' + Math.round(n * 52).toLocaleString()

  const calculate = () => {
    const income = parseFloat(weeklyIncome) || 0
    const isCouple = situation === 'couple'

    let standardMinimum = isCouple
      ? PC_RATES.coupleStandardMinimum
      : PC_RATES.singleStandardMinimum

    // Add severe disability
    if (hasSevereDisability) {
      standardMinimum += isCouple
        ? PC_RATES.severeDisabilityCouple * 2
        : PC_RATES.severeDisabilitySingle
    }

    // Add carer addition
    if (isCarer) standardMinimum += PC_RATES.carerAddition

    // Guarantee Credit
    const guaranteeCredit = Math.max(0, standardMinimum - income)
    const qualifiesGuarantee = income < standardMinimum

    // Savings Credit (only for those who reached state pension age before 6 April 2016)
    let savingsCredit = 0
    let qualifiesSavings = false
    if (reachedPensionAgePre2016) {
      const threshold = isCouple
        ? PC_RATES.savingsCreditCoupleThreshold
        : PC_RATES.savingsCreditSingleThreshold
      const maxSavings = isCouple
        ? PC_RATES.savingsCreditMaxCouple
        : PC_RATES.savingsCreditMaxSingle

      if (income > threshold) {
        qualifiesSavings = true
        const savingsEarned = Math.min((income - threshold) * 0.60, maxSavings)
        const savingsReduction = Math.max(0, income - standardMinimum) * 0.40
        savingsCredit = Math.max(0, savingsEarned - savingsReduction)
      }
    }

    const totalWeekly = guaranteeCredit + savingsCredit

    setResult({
      income,
      standardMinimum,
      guaranteeCredit,
      savingsCredit,
      totalWeekly,
      qualifiesGuarantee,
      qualifiesSavings,
      isCouple,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          UK Pension Credit Calculator 2026/27
        </h1>
        <p className="text-sm text-gray-500">
          Estimate your Pension Credit entitlement — Guarantee Credit and Savings Credit.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ 2026/27 rates — Single £227.10/wk | Couple £346.60/wk standard minimum
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Situation</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'single', label: '👤 Single' },
              { value: 'couple', label: '👫 Couple' },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setSituation(opt.value); setResult(null) }}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  situation === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Weekly Income (before Pension Credit)
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Include State Pension, private pensions, earnings, and most benefits
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" step="0.01" value={weeklyIncome} onChange={e => setWeeklyIncome(e.target.value)}
              placeholder="e.g. 180.00"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-700">Additional Circumstances</p>
          {[
            { key: 'severeDisability', label: 'Severe Disability Premium', desc: 'You or your partner receives certain disability benefits and no one gets Carer\'s Allowance for looking after you', value: hasSevereDisability, setter: setHasSevereDisability },
            { key: 'carer', label: 'Carer Addition', desc: 'You receive Carer\'s Allowance or have underlying entitlement to it', value: isCarer, setter: setIsCarer },
            { key: 'pre2016', label: 'Reached State Pension Age before 6 April 2016', desc: 'Required to qualify for Savings Credit', value: reachedPensionAgePre2016, setter: setReachedPensionAgePre2016 },
          ].map(({ key, label, desc, value, setter }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer bg-gray-50 rounded-xl p-3">
              <input type="checkbox" checked={value} onChange={e => setter(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-indigo-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Pension Credit
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {result.totalWeekly <= 0 && !result.qualifiesSavings ? (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <p className="text-gray-600 font-bold text-lg mb-1">
                ℹ️ You may not qualify for Pension Credit
              </p>
              <p className="text-sm text-gray-500">
                Your weekly income of {fmt(result.income)} is above the standard minimum
                of {fmt(result.standardMinimum)}/week. However, circumstances can vary —
                always check directly with the Pension Credit claim line.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold mb-1">
                      Estimated Weekly Pension Credit
                    </p>
                    <p className="text-4xl font-black text-indigo-700">{fmt(result.totalWeekly)}</p>
                    <p className="text-xs text-gray-400 mt-1">per week</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Estimated Annual</p>
                    <p className="text-xl font-bold text-green-600">
                      {fmtAnnual(result.totalWeekly)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <p className="font-semibold text-gray-700 mb-2">Breakdown</p>
                <div className="flex justify-between">
                  <span className="text-gray-500">Standard minimum</span>
                  <span className="font-semibold">{fmt(result.standardMinimum)}/wk</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Your weekly income</span>
                  <span className="font-semibold">{fmt(result.income)}/wk</span>
                </div>
                {result.guaranteeCredit > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Guarantee Credit</span>
                    <span className="font-semibold">+ {fmt(result.guaranteeCredit)}/wk</span>
                  </div>
                )}
                {result.savingsCredit > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Savings Credit</span>
                    <span className="font-semibold">+ {fmt(result.savingsCredit)}/wk</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Total Pension Credit</span>
                  <span className="text-indigo-600">{fmt(result.totalWeekly)}/wk</span>
                </div>
              </div>
            </>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ Pension Credit 2026/27 Key Facts</p>
            <p>• You must have reached State Pension age (currently 66) to claim</p>
            <p>• Single standard minimum: £227.10/week | Couple: £346.60/week</p>
            <p>• Savings Credit: only available if you reached State Pension age before 6 April 2016</p>
            <p>• Claiming Pension Credit may also entitle you to free TV licence, Council Tax Reduction, and Housing Benefit</p>
            <p>• You can backdate claims up to 3 months</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-xs text-green-700">
            <p className="font-bold mb-1">📞 How to Claim</p>
            <p>Call the Pension Credit claim line: <strong>0800 99 1234</strong> (free, Mon–Fri 8am–6pm)</p>
            <p className="mt-1">Or apply online at <a href="https://www.gov.uk/pension-credit/how-to-claim" target="_blank" rel="noopener noreferrer" className="underline">gov.uk/pension-credit</a></p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">What is Pension Credit?</h2>
          <p className="leading-relaxed">
            Pension Credit is a means-tested benefit for people over State Pension age (currently 66)
            on a low income. It tops up your weekly income to a guaranteed minimum level and can also
            unlock other benefits including free NHS dental treatment, Housing Benefit, and Council
            Tax Reduction. It is estimated that around 800,000 eligible households do not claim
            Pension Credit — always check your entitlement.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Guarantee Credit vs Savings Credit</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Feature</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Guarantee Credit</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Savings Credit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Who can get it', 'Anyone over State Pension age', 'Must have reached pension age before 6 April 2016'],
                  ['Purpose', 'Top up income to minimum level', 'Reward for saving toward retirement'],
                  ['2026/27 (single)', 'Up to £227.10/wk', 'Up to £17.29/wk'],
                  ['2026/27 (couple)', 'Up to £346.60/wk', 'Up to £19.36/wk'],
                  ['Income threshold', 'Below standard minimum', 'Above savings threshold'],
                ].map(([feat, gc, sc], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{feat}</td>
                    <td className="p-2 border border-gray-200">{gc}</td>
                    <td className="p-2 border border-gray-200">{sc}</td>
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
              {
                q: 'Does Pension Credit affect my other benefits?',
                a: 'Claiming Pension Credit can unlock additional help. If you receive Guarantee Credit, you may automatically qualify for maximum Housing Benefit, Council Tax Reduction, free NHS dental treatment, and Cold Weather Payments. From 2024, Winter Fuel Payment is also linked to Pension Credit eligibility.',
              },
              {
                q: 'What income counts toward Pension Credit?',
                a: 'Most income counts, including State Pension, private and occupational pensions, most earnings, and some benefits. However, certain payments are disregarded — including Attendance Allowance, Disability Living Allowance, and Personal Independence Payment. Savings above £10,000 are assumed to generate a notional income of £1/week per £500 above that threshold.',
              },
              {
                q: 'Can I claim if I have savings or own my home?',
                a: 'Yes. Owning your home does not affect Pension Credit. Savings are counted as notional income above £10,000 (£1/week per £500 over £10,000), but you can still qualify even with significant savings if your income is low enough. There is no upper savings limit for Pension Credit.',
              },
              {
                q: 'How far back can I backdate a claim?',
                a: 'Pension Credit can be backdated for up to 3 months before the date you apply, as long as you were eligible during that period. This means you could receive a lump sum of up to 13 weeks of arrears when you first claim.',
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
          <a href="https://www.gov.uk/pension-credit" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Pension Credit</a>
          <a href="https://www.gov.uk/pension-credit/eligibility" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Pension Credit eligibility</a>
        </div>
      </div>
    </div>
  )
}