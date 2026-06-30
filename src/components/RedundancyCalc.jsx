import { useState } from 'react'

const WEEKLY_CAP_GB = 751
const WEEKLY_CAP_NI = 749
const MAX_YEARS = 20
const TAX_FREE_LIMIT = 30000

function calcRedundancy(age, years, weeklyPay, region) {
  const cap = region === 'ni' ? WEEKLY_CAP_NI : WEEKLY_CAP_GB
  const effectivePay = Math.min(weeklyPay, cap)
  const effectiveYears = Math.min(years, MAX_YEARS)

  let weeks = 0
  for (let y = 1; y <= effectiveYears; y++) {
    const ageAtYear = age - effectiveYears + y
    if (ageAtYear < 22) weeks += 0.5
    else if (ageAtYear < 41) weeks += 1
    else weeks += 1.5
  }

  const gross = Math.round(weeks * effectivePay)
  const taxable = Math.max(0, gross - TAX_FREE_LIMIT)
  return { gross, weeks: Math.round(weeks * 10) / 10, effectivePay, taxable }
}

export default function RedundancyCalc() {
  const [age, setAge] = useState('')
  const [years, setYears] = useState('')
  const [weeklyPay, setWeeklyPay] = useState('')
  const [region, setRegion] = useState('gb')
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()

  const calculate = () => {
    const a = parseInt(age)
    const y = parseInt(years)
    const w = parseFloat(weeklyPay)
    if (!a || !y || !w || a < 17 || y < 2) return
    const res = calcRedundancy(a, y, w, region)
    setResult(res)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          UK Statutory Redundancy Pay Calculator 2026
        </h1>
        <p className="text-sm text-gray-500">
          Estimate your statutory redundancy entitlement based on age, service length, and weekly pay.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ Rates updated April 2026 — GB cap £751/wk | NI cap £749/wk
        </p>
      </div>

      <div className="space-y-4">
        {/* Region */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Region</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'gb', label: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 England, Scotland & Wales' },
              { value: 'ni', label: '🇬🇧 Northern Ireland' },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setRegion(opt.value); setResult(null) }}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  region === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Your Age at Last Day of Employment
          </label>
          <input type="number" value={age} onChange={e => setAge(e.target.value)}
            placeholder="e.g. 35"
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        {/* Years of service */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Complete Years of Continuous Service
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Minimum 2 years required. Maximum 20 years used in calculation.
          </p>
          <input type="number" value={years} onChange={e => setYears(e.target.value)}
            placeholder="e.g. 8"
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>

        {/* Weekly pay */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Average Weekly Pay (gross, before tax)
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Average of your 12 weeks' pay before notice. Capped at £{region === 'ni' ? '749' : '751'}/week.
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={weeklyPay} onChange={e => setWeeklyPay(e.target.value)}
              placeholder="e.g. 600"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Redundancy Pay
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Main result */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Estimated Statutory Redundancy Pay
                </p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.gross)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Based on {result.weeks} weeks × {fmt(result.effectivePay)}/week
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Tax-Free Portion</p>
                <p className="text-xl font-bold text-green-600">
                  {fmt(Math.min(result.gross, TAX_FREE_LIMIT))}
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Calculation Breakdown</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Weekly pay used</span>
              <span className="font-semibold">{fmt(result.effectivePay)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Weeks entitlement</span>
              <span className="font-semibold">{result.weeks} weeks</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
              <span>Estimated total</span>
              <span>{fmt(result.gross)}</span>
            </div>
            {result.gross > TAX_FREE_LIMIT && (
              <div className="flex justify-between text-orange-600">
                <span>Potentially taxable portion</span>
                <span className="font-semibold">{fmt(result.taxable)}</span>
              </div>
            )}
          </div>

          {/* Age multiplier info */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-2">How weeks are calculated by age</p>
            {[
              ['Under 22', '½ week per year of service'],
              ['Age 22–40', '1 week per year of service'],
              ['Age 41 and over', '1½ weeks per year of service'],
            ].map(([age, mult], i) => (
              <div key={i} className="flex justify-between py-1 border-b border-gray-100 last:border-0">
                <span>{age}</span>
                <span className="font-medium">{mult}</span>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ Key Facts — UK Statutory Redundancy 2026</p>
            <p>• Minimum 2 years' continuous service required to qualify</p>
            <p>• Maximum 20 years of service used in the calculation</p>
            <p>• Weekly pay capped at £{region === 'ni' ? '749 (Northern Ireland)' : '751 (England, Scotland & Wales)'}</p>
            <p>• First £30,000 of redundancy pay is generally tax-free</p>
            <p>• Your employer may offer more than the statutory minimum</p>
            <p>• Notice pay and holiday pay are taxed as normal income</p>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How is Statutory Redundancy Pay Calculated?
          </h2>
          <p className="leading-relaxed">
            Statutory redundancy pay in the UK is calculated using three factors: your age, your length
            of continuous service (up to a maximum of 20 years), and your average weekly gross pay
            (capped at £751 per week in England, Scotland and Wales from April 2026).
            The amount of pay per year of service depends on your age during each year worked.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">
            UK Redundancy Pay Rates 2026
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Age During Service</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Weeks Per Year</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Max (20 yrs, £751/wk)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Under 22', '½ week', '£7,510'],
                  ['Age 22–40', '1 week', '£15,020'],
                  ['Age 41+', '1½ weeks', '£22,530'],
                ].map(([age, weeks, max], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{age}</td>
                    <td className="p-2 border border-gray-200">{weeks}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Rates effective 6 April 2026. Northern Ireland cap is £749/week (max £22,470).
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Am I eligible for statutory redundancy pay?',
                a: 'To be eligible, you generally need to be an employee (not self-employed or a worker), have at least 2 years of continuous service with your employer, and have been made redundant — meaning your role no longer exists. Some categories of worker may not qualify. Verify your eligibility at gov.uk or with ACAS.',
              },
              {
                q: 'Is redundancy pay taxable?',
                a: 'The first £30,000 of a genuine redundancy payment is generally tax-free. Amounts above £30,000 are taxed as income at your marginal rate. However, notice pay, holiday pay, and bonuses within a redundancy package are taxed as normal earnings. Your specific tax position may vary — an accountant or HMRC can advise on your situation.',
              },
              {
                q: 'Can my employer pay more than the statutory amount?',
                a: 'Yes. Statutory redundancy pay is the legal minimum. Many employers offer enhanced or contractual redundancy pay, which may be specified in your employment contract or staff handbook. This calculator shows the statutory minimum only — check your contract for any enhanced entitlement.',
              },
              {
                q: 'What if I think my redundancy was unfair?',
                a: 'If you believe your redundancy was unfair or discriminatory, you generally have 3 months less one day from your dismissal date to begin the ACAS early conciliation process before bringing a claim. Contact ACAS on 0300 123 1100 or visit acas.org.uk for free, impartial advice.',
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
          <a href="https://www.gov.uk/calculate-your-redundancy-pay" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Calculate your statutory redundancy pay</a>
          <a href="https://www.acas.org.uk/redundancy-pay" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ ACAS — Redundancy pay guidance</a>
        </div>
      </div>
    </div>
  )
}