import { useState } from 'react'

const PLANS = {
  plan1: {
    label: 'Plan 1',
    desc: 'Started before Sep 2012 (England/Wales) or Northern Ireland',
    threshold: 24990,
    rate: 0.09,
    interestRate: 0.043,
    writeOffYears: 25,
    writeOffNote: '25 years from April after first repayment, or age 65',
  },
  plan2: {
    label: 'Plan 2',
    desc: 'Started Sep 2012 – Jul 2023 (England/Wales)',
    threshold: 29385,
    rate: 0.09,
    interestRate: 0.075,
    writeOffYears: 30,
    writeOffNote: '30 years from April after first repayment',
  },
  plan4: {
    label: 'Plan 4',
    desc: 'Scottish undergraduate loans',
    threshold: 32745,
    rate: 0.09,
    interestRate: 0.043,
    writeOffYears: 30,
    writeOffNote: '30 years from April after first repayment, or age 65',
  },
  plan5: {
    label: 'Plan 5',
    desc: 'Started Aug 2023 onwards (England)',
    threshold: 25000,
    rate: 0.09,
    interestRate: 0.075,
    writeOffYears: 40,
    writeOffNote: '40 years from April after first repayment',
  },
  pg: {
    label: 'Postgraduate Loan',
    desc: "Master's or PhD loan (England/Wales)",
    threshold: 21000,
    rate: 0.06,
    interestRate: 0.075,
    writeOffYears: 30,
    writeOffNote: '30 years from April after first repayment',
  },
}

export default function StudentLoanCalc() {
  const [plan, setPlan] = useState('plan2')
  const [salary, setSalary] = useState('')
  const [balance, setBalance] = useState('')
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()

  const calculate = () => {
    const s = parseFloat(salary) || 0
    const b = parseFloat(balance) || 0
    const p = PLANS[plan]

    const annualRepayment = s > p.threshold
      ? (s - p.threshold) * p.rate
      : 0
    const monthlyRepayment = annualRepayment / 12
    const annualInterest = b * p.interestRate
    const monthlyInterest = annualInterest / 12
    const netAnnualChange = annualRepayment - annualInterest
    const balanceGrowing = netAnnualChange < 0 && b > 0

    // Rough payoff estimate (simplified — real calculation is complex)
    let yearsToPayoff = null
    let projectedTotal = null
    if (annualRepayment > annualInterest && b > 0) {
      // Simple estimate — actual depends on salary growth
      yearsToPayoff = Math.ceil(b / netAnnualChange)
      projectedTotal = annualRepayment * Math.min(yearsToPayoff, p.writeOffYears)
    } else if (b > 0) {
      yearsToPayoff = p.writeOffYears
      projectedTotal = annualRepayment * p.writeOffYears
    }

    setResult({
      plan: p,
      salary: s,
      balance: b,
      annualRepayment: Math.round(annualRepayment),
      monthlyRepayment: Math.round(monthlyRepayment),
      annualInterest: Math.round(annualInterest),
      monthlyInterest: Math.round(monthlyInterest),
      netAnnualChange: Math.round(netAnnualChange),
      balanceGrowing,
      yearsToPayoff: yearsToPayoff ? Math.min(yearsToPayoff, p.writeOffYears) : null,
      projectedTotal: projectedTotal ? Math.round(projectedTotal) : null,
      writtenOff: yearsToPayoff === null || yearsToPayoff >= p.writeOffYears,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          UK Student Loan Repayment Calculator 2026
        </h2>
        <p className="text-sm text-gray-500">
          Estimate your monthly student loan repayments across Plan 1, 2, 4, 5 and Postgraduate loans.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ Updated for 2026/27 thresholds — Plan 5 PAYE deductions began April 2026
        </p>
      </div>

      <div className="space-y-4">
        {/* Plan selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Loan Plan</label>
          <div className="space-y-2">
            {Object.entries(PLANS).map(([key, p]) => (
              <button key={key}
                onClick={() => { setPlan(key); setResult(null) }}
                className={`w-full py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left ${
                  plan === key
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                <p className="font-semibold">{p.label}</p>
                <p className={`text-xs mt-0.5 ${plan === key ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {p.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Salary (gross, before tax)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
              placeholder="e.g. 32,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Repayment threshold for {PLANS[plan].label}: {fmt(PLANS[plan].threshold)}/yr
          </p>
        </div>

        {/* Balance */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Current Loan Balance <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={balance} onChange={e => setBalance(e.target.value)}
              placeholder="e.g. 45,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Find your balance on your Student Loans Company (SLC) statement
          </p>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Repayments
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* No repayment */}
          {result.annualRepayment === 0 ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-green-600 font-bold text-lg mb-1">✅ No Repayments Due</p>
              <p className="text-sm text-gray-600">
                Your salary of {fmt(result.salary)} is below the {result.plan.label} repayment
                threshold of {fmt(result.plan.threshold)}/yr.
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Interest of approximately {fmt(result.monthlyInterest)}/month may still be accruing on your balance.
              </p>
            </div>
          ) : (
            <>
              {/* Main result */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold mb-1">
                      Estimated Monthly Repayment
                    </p>
                    <p className="text-4xl font-black text-indigo-700">
                      {fmt(result.monthlyRepayment)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {fmt(result.annualRepayment)}/year · {result.plan.rate * 100}% of income above {fmt(result.plan.threshold)}
                    </p>
                  </div>
                  {result.balance > 0 && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Monthly interest</p>
                      <p className={`text-xl font-bold ${result.balanceGrowing ? 'text-red-500' : 'text-orange-500'}`}>
                        {fmt(result.monthlyInterest)}
                      </p>
                      <p className="text-xs text-gray-400">{(result.plan.interestRate * 100).toFixed(1)}%/yr</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Balance projection */}
              {result.balance > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <p className="font-semibold text-gray-700 mb-2">Balance Projection (illustrative)</p>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Current balance</span>
                    <span className="font-semibold">{fmt(result.balance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Annual repayment</span>
                    <span className="font-semibold text-green-600">- {fmt(result.annualRepayment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Annual interest added</span>
                    <span className="font-semibold text-red-500">+ {fmt(result.annualInterest)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                    <span>Net annual change</span>
                    <span className={result.balanceGrowing ? 'text-red-500' : 'text-green-600'}>
                      {result.balanceGrowing ? '+' : ''}{fmt(Math.abs(result.netAnnualChange))}
                      {result.balanceGrowing ? ' (growing)' : ' (reducing)'}
                    </span>
                  </div>
                  {result.balanceGrowing && (
                    <p className="text-xs text-orange-600 mt-1">
                      ⚠️ Your balance is estimated to be growing — this is common on Plan 2/5 at average salaries.
                      The loan will still be written off after {result.plan.writeOffYears} years.
                    </p>
                  )}
                  {!result.balanceGrowing && result.yearsToPayoff && (
                    <div className="flex justify-between text-indigo-600">
                      <span>Estimated payoff</span>
                      <span className="font-semibold">~{result.yearsToPayoff} years</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Write-off after</span>
                    <span className="font-semibold">{result.plan.writeOffYears} years</span>
                  </div>
                </div>
              )}

              {/* Write-off info */}
              {result.writtenOff && result.balance > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
                  <p className="font-bold mb-1">📋 Write-Off Projection (illustrative)</p>
                  <p>
                    Based on your current salary, your remaining balance is estimated to be written off
                    after {result.plan.writeOffYears} years rather than repaid in full.
                    This is very common on {result.plan.label} — many borrowers pay a graduate-style
                    contribution throughout their career and have the remainder cancelled.
                  </p>
                  <p className="mt-1 text-blue-500">
                    Estimated total repaid: approximately {fmt(result.projectedTotal || 0)} over {result.plan.writeOffYears} years
                    (illustrative only — salary growth not modelled).
                  </p>
                </div>
              )}
            </>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ {result.plan.label} Key Facts 2026</p>
            <p>• Repayment threshold: {fmt(result.plan.threshold)}/yr ({fmt(Math.round(result.plan.threshold / 12))}/month)</p>
            <p>• Repayment rate: {result.plan.rate * 100}% of income above threshold</p>
            <p>• Interest rate: approximately {(result.plan.interestRate * 100).toFixed(1)}% (subject to change)</p>
            <p>• Write-off: {result.plan.writeOffNote}</p>
            <p>• Repayments deducted via PAYE (employed) or Self Assessment (self-employed)</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ⚠️ <strong>Important:</strong> These are simplified estimates for illustrative purposes only.
            Actual repayments depend on exact pay periods, PAYE rounding, and interest rate changes.
            Interest rates for Plan 2/5 are linked to RPI and change annually.
            For your actual balance and repayment history, log in to the{' '}
            <a href="https://www.gov.uk/repaying-your-student-loan" target="_blank" rel="noopener noreferrer"
              className="underline text-amber-700">Student Loans Company</a>.
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How Does UK Student Loan Repayment Work?
          </h2>
          <p className="leading-relaxed">
            UK student loans work differently from conventional debt. You only repay when your income
            exceeds a plan-specific threshold, and repayments are calculated as a percentage of the
            income above that threshold — not based on your total balance.
            Any remaining balance is written off after a set number of years.
            For many borrowers, especially on Plan 2 and Plan 5, the loan functions more like a
            graduate income contribution than a traditional debt.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">
            Student Loan Plan Comparison 2026/27
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Plan</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Threshold</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Write-Off</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Plan 1', '£24,990/yr', '9%', '25 yrs / age 65'],
                  ['Plan 2', '£29,385/yr', '9%', '30 years'],
                  ['Plan 4', '£32,745/yr', '9%', '30 yrs / age 65'],
                  ['Plan 5', '£25,000/yr', '9%', '40 years'],
                  ['Postgrad', '£21,000/yr', '6%', '30 years'],
                ].map(([p, threshold, rate, writeoff], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{p}</td>
                    <td className="p-2 border border-gray-200">{threshold}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{rate}</td>
                    <td className="p-2 border border-gray-200">{writeoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Thresholds effective April 2026. Interest rates subject to annual change.
            Source: Student Loans Company / GOV.UK.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Which student loan plan am I on?',
                a: 'Your plan depends on when and where you started your course. Plan 1 covers England/Wales starters before September 2012. Plan 2 covers England/Wales starters September 2012 to July 2023. Plan 4 covers Scottish undergraduate loans. Plan 5 covers England starters from August 2023. Check your payslip or SLC account if you\'re unsure.',
              },
              {
                q: 'Should I make voluntary overpayments?',
                a: 'For most Plan 2 and Plan 5 borrowers with large balances, voluntary overpayments are generally not recommended by financial experts — if your loan will be written off anyway, extra payments simply reduce the amount that would have been cancelled for free. However, if projections show you will repay in full before write-off, overpaying could save interest. This is a complex personal finance decision — consider speaking with an independent financial adviser.',
              },
              {
                q: 'Does my student loan affect my credit score?',
                a: 'UK student loans do not appear on your credit file and do not directly affect your credit score. However, when applying for a mortgage, lenders typically ask about monthly student loan deductions as part of their affordability assessment, which can reduce the amount you can borrow.',
              },
              {
                q: 'What happens if I go abroad?',
                a: 'If you leave the UK for more than 3 months, you must notify the Student Loans Company. Repayments continue based on your overseas earnings, using country-specific thresholds set by the SLC. Interest continues to accrue while you are abroad.',
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
          <a href="https://www.gov.uk/repaying-your-student-loan" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Repaying your student loan</a>
          <a href="https://www.studentfinance.service.gov.uk" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ Student Finance — Check your balance</a>
        </div>
      </div>
    </div>
  )
}