import { useState } from 'react'

// 2026/27 rates
const RATES = {
  personalAllowance: 12570,
  basicRateLimit: 50270,
  higherRateLimit: 125140,
  basicRate: 0.20,
  higherRate: 0.40,
  additionalRate: 0.45,
  // Class 4 NI
  class4Lower: 12570,
  class4Upper: 50270,
  class4MainRate: 0.06,
  class4HigherRate: 0.02,
  // Class 2 abolished April 2024
  // Small Profits Threshold (for NI credits only)
  smallProfitsThreshold: 6725,
}

function calcIncomeTax(profit) {
  // Personal allowance taper above £100,000
  let pa = RATES.personalAllowance
  if (profit > 100000) {
    pa = Math.max(0, pa - Math.floor((profit - 100000) / 2))
  }
  const taxable = Math.max(0, profit - pa)
  let tax = 0
  if (taxable > 0) {
    tax += Math.min(taxable, RATES.basicRateLimit - pa) * RATES.basicRate
    if (taxable > RATES.basicRateLimit - pa) {
      tax += Math.min(taxable - (RATES.basicRateLimit - pa), RATES.higherRateLimit - RATES.basicRateLimit) * RATES.higherRate
    }
    if (taxable > RATES.higherRateLimit - pa) {
      tax += (taxable - (RATES.higherRateLimit - pa)) * RATES.additionalRate
    }
  }
  return Math.max(0, Math.round(tax))
}

function calcClass4NI(profit) {
  if (profit <= RATES.class4Lower) return 0
  const main = Math.min(profit, RATES.class4Upper) - RATES.class4Lower
  const higher = profit > RATES.class4Upper ? profit - RATES.class4Upper : 0
  return Math.round(main * RATES.class4MainRate + higher * RATES.class4HigherRate)
}

export default function SelfEmployedCalc() {
  const [profit, setProfit] = useState('')
  const [pension, setPension] = useState('')
  const [giftAid, setGiftAid] = useState('')
  const [studentLoan, setStudentLoan] = useState('none')
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()
  const fmtPct = (n, total) => total > 0 ? ((n / total) * 100).toFixed(1) + '%' : '0%'

  const calculate = () => {
    const p = parseFloat(profit) || 0
    const pensionContrib = parseFloat(pension) || 0
    const giftAidContrib = parseFloat(giftAid) || 0

    // Adjusted net income
    const adjustedNetIncome = Math.max(0, p - pensionContrib - giftAidContrib)

    // Income Tax
    const incomeTax = calcIncomeTax(adjustedNetIncome)

    // Class 4 NI
    const class4NI = calcClass4NI(adjustedNetIncome)

    // Student Loan
    let studentLoanRepayment = 0
    if (studentLoan === 'plan1') {
      studentLoanRepayment = adjustedNetIncome > 24990 ? Math.round((adjustedNetIncome - 24990) * 0.09) : 0
    } else if (studentLoan === 'plan2') {
      studentLoanRepayment = adjustedNetIncome > 29385 ? Math.round((adjustedNetIncome - 29385) * 0.09) : 0
    } else if (studentLoan === 'plan4') {
      studentLoanRepayment = adjustedNetIncome > 32745 ? Math.round((adjustedNetIncome - 32745) * 0.09) : 0
    } else if (studentLoan === 'plan5') {
      studentLoanRepayment = adjustedNetIncome > 25000 ? Math.round((adjustedNetIncome - 25000) * 0.09) : 0
    }

    const totalDeductions = incomeTax + class4NI + studentLoanRepayment
    const takeHome = Math.max(0, p - totalDeductions - pensionContrib)
    const effectiveRate = p > 0 ? ((totalDeductions / p) * 100).toFixed(1) : '0.0'

    // Tax bracket
    let bracket = '0% (below Personal Allowance)'
    const taxable = Math.max(0, adjustedNetIncome - RATES.personalAllowance)
    if (adjustedNetIncome > RATES.higherRateLimit) bracket = '45% Additional Rate'
    else if (adjustedNetIncome > RATES.basicRateLimit) bracket = '40% Higher Rate'
    else if (adjustedNetIncome > RATES.personalAllowance) bracket = '20% Basic Rate'

    setResult({
      profit: p,
      adjustedNetIncome,
      incomeTax,
      class4NI,
      studentLoanRepayment,
      totalDeductions,
      takeHome,
      effectiveRate,
      bracket,
      pensionContrib,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          UK Self-Employed Tax Calculator 2026/27
        </h1>
        <p className="text-sm text-gray-500">
          Estimate your Income Tax and Class 4 National Insurance as a sole trader or freelancer.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ 2026/27 rates — Class 4 NI 6%/2% | Income Tax 20%/40%/45%
        </p>
      </div>

      <div className="space-y-4">
        {/* Annual profit */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Self-Employment Profit
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Turnover minus allowable business expenses (before tax)
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={profit} onChange={e => setProfit(e.target.value)}
              placeholder="e.g. 45,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Pension */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Pension Contributions (gross) <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Reduces your adjusted net income — enter the gross amount (including tax relief)
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={pension} onChange={e => setPension(e.target.value)}
              placeholder="e.g. 3,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Gift Aid */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Gift Aid Donations (gross) <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={giftAid} onChange={e => setGiftAid(e.target.value)}
              placeholder="e.g. 500"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        {/* Student Loan */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Student Loan <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: 'none', label: 'None' },
              { value: 'plan1', label: 'Plan 1' },
              { value: 'plan2', label: 'Plan 2' },
              { value: 'plan4', label: 'Plan 4' },
              { value: 'plan5', label: 'Plan 5' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setStudentLoan(opt.value)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  studentLoan === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Self-Employed Tax
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Main result */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Estimated Take-Home Profit
                </p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.takeHome)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Effective tax rate: {result.effectiveRate}% · {result.bracket}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Total Tax & NI</p>
                <p className="text-xl font-bold text-red-500">{fmt(result.totalDeductions)}</p>
                <p className="text-xs text-gray-400">{fmtPct(result.totalDeductions, result.profit)} of profit</p>
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Full Breakdown</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Gross profit</span>
              <span className="font-semibold">{fmt(result.profit)}</span>
            </div>
            {result.pensionContrib > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-500">Pension contributions</span>
                <span className="font-semibold text-green-600">- {fmt(result.pensionContrib)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Adjusted net income</span>
              <span className="font-semibold">{fmt(result.adjustedNetIncome)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Income Tax</span>
                <span className="font-semibold text-red-500">- {fmt(result.incomeTax)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Class 4 National Insurance</span>
                <span className="font-semibold text-red-500">- {fmt(result.class4NI)}</span>
              </div>
              {result.studentLoanRepayment > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Student Loan Repayment</span>
                  <span className="font-semibold text-red-500">- {fmt(result.studentLoanRepayment)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
              <span>Estimated take-home</span>
              <span>{fmt(result.takeHome)}</span>
            </div>
          </div>

          {/* Monthly/Weekly breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-gray-700 mb-3">Take-Home Breakdown</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: 'Annual', value: fmt(result.takeHome) },
                { label: 'Monthly', value: fmt(result.takeHome / 12) },
                { label: 'Weekly', value: fmt(result.takeHome / 52) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-white rounded-lg p-3 border border-gray-100">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-bold text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* NI bands */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-2">2026/27 Self-Employed NI (Class 4)</p>
            {[
              ['Below £12,570', '0%', 'Below Lower Profits Limit'],
              ['£12,570 – £50,270', '6%', 'Main rate'],
              ['Above £50,270', '2%', 'Above Upper Profits Limit'],
            ].map(([band, rate, note], i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 gap-2">
                <span className="w-32 shrink-0">{band}</span>
                <span className="font-bold text-indigo-600 w-6">{rate}</span>
                <span className="text-gray-400">{note}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ Key Facts — Self-Employed Tax 2026/27</p>
            <p>• Class 2 NI abolished from April 2024 — you no longer pay Class 2</p>
            <p>• Class 4 NI: 6% on profits £12,570–£50,270 | 2% above £50,270</p>
            <p>• Self Assessment deadline: 31 January 2027 for 2025/26 tax year</p>
            <p>• Payments on Account: HMRC may ask for advance payments in Jan & Jul</p>
            <p>• Pension contributions reduce both Income Tax and NI liability</p>
            <p>• Turnover above £90,000 (2026/27): VAT registration required</p>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How Is Self-Employed Tax Calculated in the UK?
          </h2>
          <p className="leading-relaxed">
            As a self-employed sole trader or freelancer in the UK, you pay two main taxes on your
            profits: Income Tax and Class 4 National Insurance Contributions (NICs). Both are
            calculated on your net profit — your turnover minus allowable business expenses.
            You report and pay these through Self Assessment, with the deadline of 31 January
            following the end of the tax year.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">
            2026/27 Self-Employed Tax Rates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">On profits</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Income Tax — Personal Allowance', '0%', 'Up to £12,570'],
                  ['Income Tax — Basic Rate', '20%', '£12,571 – £50,270'],
                  ['Income Tax — Higher Rate', '40%', '£50,271 – £125,140'],
                  ['Income Tax — Additional Rate', '45%', 'Over £125,140'],
                  ['Class 4 NI — Main Rate', '6%', '£12,570 – £50,270'],
                  ['Class 4 NI — Higher Rate', '2%', 'Over £50,270'],
                ].map(([tax, rate, on], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{tax}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{rate}</td>
                    <td className="p-2 border border-gray-200">{on}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Rates effective 6 April 2026. Source: HMRC.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'What is the difference between employed and self-employed tax?',
                a: 'Employees pay Income Tax and Class 1 NI, deducted automatically via PAYE. Self-employed people pay Income Tax and Class 4 NI through Self Assessment. The Income Tax rates are the same, but Class 4 NI rates (6%/2%) are lower than employee Class 1 NI (8%/2%). Self-employed people are also responsible for paying their own tax bill by 31 January — it is not deducted automatically.',
              },
              {
                q: 'Do I still pay Class 2 National Insurance?',
                a: 'No. Class 2 NI was abolished from 6 April 2024. Self-employed people with profits above the Small Profits Threshold (£6,725) now automatically receive NI credits toward their State Pension through their Class 4 NI contributions, without paying Class 2 separately.',
              },
              {
                q: 'What expenses can I deduct to reduce my self-employed tax?',
                a: 'You can deduct any allowable business expense incurred wholly and exclusively for your business. Common deductions include: office costs, travel and mileage, equipment, software subscriptions, professional fees, marketing costs, and a proportion of home costs if you work from home. Pension contributions also reduce your adjusted net income, lowering both Income Tax and NI.',
              },
              {
                q: 'What are Payments on Account?',
                a: 'If your Self Assessment tax bill is over £1,000, HMRC requires you to make advance payments toward next year\'s bill — called Payments on Account. You pay 50% in January and 50% in July. This means your first year of self-employment can result in a higher-than-expected January bill. Always set aside money throughout the year to cover your tax bill.',
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
          <a href="https://www.gov.uk/self-employed-national-insurance-rates" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Self-employed National Insurance rates</a>
          <a href="https://www.gov.uk/self-assessment-tax-returns" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Self Assessment tax returns</a>
          <a href="https://www.gov.uk/expenses-if-youre-self-employed" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Allowable expenses if you're self-employed</a>
        </div>
      </div>
    </div>
  )
}