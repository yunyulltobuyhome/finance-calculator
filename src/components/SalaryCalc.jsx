import { useState } from 'react'
import { SALARY_TAX_DATA } from '../data/salaryTaxRates'

// Sum a progressive bracket schedule for a given taxable amount.
function bracketTax(taxable, brackets) {
  let tax = 0
  for (const b of brackets) {
    if (taxable > b.min) tax += (Math.min(taxable, b.max) - b.min) * b.rate
  }
  return tax
}

// US state income tax. Handles bracketed states (their schedule applied after
// the state standard deduction), flat states, and no-income-tax states.
function usStateTax(gross, stateData) {
  if (!stateData) return 0
  const taxable = Math.max(0, gross - (stateData.deduction || 0))
  if (stateData.brackets) return bracketTax(taxable, stateData.brackets)
  return taxable * (stateData.flat || 0)
}

// Pay frequencies people actually get paid on, with the number of periods a
// year — this is what "biweekly paycheck calculator" and friends look for.
const PAY_PERIODS = [
  { name: 'annual', label: 'a year', periods: 1 },
  { name: 'monthly', label: 'a month', periods: 12 },
  { name: 'semimonthly', label: 'a paycheck (twice a month)', periods: 24 },
  { name: 'biweekly', label: 'a paycheck (every 2 weeks)', periods: 26 },
  { name: 'weekly', label: 'a week', periods: 52 },
]

// What the pre-tax retirement pot is called in each country.
const RETIREMENT_LABEL = {
  US: '401(k) contribution',
  UK: 'Pension contribution (salary sacrifice)',
  CA: 'RRSP contribution',
  AU: 'Salary-sacrifice super',
}

export default function SalaryCalc() {
  const [country, setCountry] = useState('US')
  const [state, setState] = useState('California')
  const [province, setProvince] = useState('Ontario')
  const [annualSalary, setAnnualSalary] = useState(100000)
  const [loanPlan, setLoanPlan] = useState('None')
  const [retirementPct, setRetirementPct] = useState(0)
  const [payFrequency, setPayFrequency] = useState('monthly')
  const [result, setResult] = useState(null)

  // `contribution` is an annual pre-tax retirement amount (401(k) / pension /
  // RRSP / salary-sacrifice super). Each country reduces the right base by it:
  // it always lowers the income-tax base, and in the UK salary sacrifice also
  // lowers National Insurance and the student-loan base — which is exactly why
  // it can claw back the tapered personal allowance above £100,000.
  const calculateTax = (gross, contribution = 0) => {
    const data = SALARY_TAX_DATA[country]
    let federalTax = 0
    let deductions = {}
    // Income subject to income tax after the pre-tax contribution.
    const incomeBase = Math.max(0, gross - contribution)

    switch (country) {
      case 'US': {
        // 401(k) is pre-tax for income tax but not for FICA, so Social Security
        // and Medicare stay on full gross wages.
        const taxable = Math.max(0, incomeBase - data.standardDeduction)
        federalTax = bracketTax(taxable, data.brackets)
        const ssWages = Math.min(gross, data.socialSecurityCap)
        const stateData = data.states.find(s => s.name === state)
        const st = Math.round(usStateTax(incomeBase, stateData))
        deductions = { federalTax: Math.round(federalTax) }
        // No-income-tax states (TX, FL, NV, WA) simply omit the line.
        if (st > 0) deductions.stateTax = st
        deductions.socialSecurity = Math.round(ssWages * data.socialSecurity)
        deductions.medicare = Math.round(gross * data.medicare)
        break
      }
      case 'UK': {
        // Salary sacrifice reduces gross for income tax, NI and student loan
        // alike, so everything here works off incomeBase, not gross.
        const taper = Math.max(0, (incomeBase - data.taperThreshold) / 2)
        const allowance = Math.max(0, data.personalAllowance - taper)
        const taxable = Math.max(0, incomeBase - allowance)

        // Bands are measured on taxable income: 20% on the first £37,700,
        // 40% up to £125,140, 45% above.
        const basicBand = data.nationalInsuranceCap - data.personalAllowance
        const additionalFrom = 125140
        federalTax =
          Math.min(taxable, basicBand) * 0.2 +
          Math.max(0, Math.min(taxable, additionalFrom) - basicBand) * 0.4 +
          Math.max(0, taxable - additionalFrom) * 0.45

        // Class 1 NI: 8% between the thresholds, then 2% on everything above.
        const niMain = Math.max(0, Math.min(incomeBase, data.nationalInsuranceCap) - data.nationalInsuranceThreshold)
        const niUpper = Math.max(0, incomeBase - data.nationalInsuranceCap)

        const plan = data.studentLoanPlans.find(p => p.name === loanPlan) || data.studentLoanPlans[0]
        deductions = {
          incomeTax: Math.round(federalTax),
          nationalInsurance: Math.round(niMain * data.nationalInsurance + niUpper * data.nationalInsuranceUpperRate),
        }
        if (plan.rate > 0) {
          deductions.studentLoan = Math.round(Math.max(0, incomeBase - plan.threshold) * plan.rate)
        }
        break
      }
      case 'CA': {
        // RRSP contributions are deductible from income tax; CPP/EI stay on gross.
        federalTax = bracketTax(incomeBase, data.federalBrackets)
        const provData = data.provinces.find(p => p.name === province)
        const provTax = provData ? bracketTax(incomeBase, provData.brackets) : 0
        deductions = {
          federalTax: Math.round(federalTax),
          provinceTax: Math.round(provTax),
          cpp: Math.round(Math.min(gross * data.cpp, data.cppMax)),
          ei: Math.round(gross * data.ei),
        }
        break
      }
      case 'AU': {
        // Salary-sacrifice super lowers taxable income (and the Medicare levy
        // that rides on it); employer super is separate and stays on gross.
        federalTax = bracketTax(incomeBase, data.brackets)
        deductions = {
          incomeTax: Math.round(federalTax),
          medicareLevey: Math.round(incomeBase * data.medicareLevey),
          superannuation: Math.round(gross * data.superannuation),
        }
        break
      }
    }

    const totalTaxAndDeductions = Object.values(deductions).reduce((a, b) => a + b, 0)
    // Take-home is gross minus tax minus the money diverted into retirement.
    const net = gross - totalTaxAndDeductions - contribution
    return { gross, deductions, net, totalDeductions: totalTaxAndDeductions, contribution }
  }

  // Most take-home calculators stop at the final number. The rate that actually
  // drives decisions — asking for a raise, making a pension contribution — is
  // the marginal one, so probe it by pricing the next slice of income. Doing it
  // as a delta means it stays correct for every country without special-casing.
  const STEP = 1000
  const marginalAnalysis = (gross, contribution = 0) => {
    const here = calculateTax(gross, contribution)
    const next = calculateTax(gross + STEP, contribution)
    const extraDeductions = next.totalDeductions - here.totalDeductions
    const keep = STEP - extraDeductions
    return {
      effectiveRate: gross > 0 ? (here.totalDeductions / gross) * 100 : 0,
      marginalRate: (extraDeductions / STEP) * 100,
      keepFromNext: Math.round(keep),
    }
  }

  // Bands where the effective marginal rate jumps well above the headline rate.
  // Purely a description of how the published thresholds interact — the figures
  // come straight out of the calculation above.
  const cliffNote = (gross) => {
    if (country !== 'UK') return null
    if (gross > 100000 && gross <= 125140) {
      return 'You are inside the £100,000–£125,140 band where the personal allowance tapers away, so each extra £1 of salary is effectively taxed at 60% (plus National Insurance). A pension contribution that brings your income back under £100,000 restores the full allowance.'
    }
    if (gross > 95000 && gross <= 100000) {
      return `You are ${fmt(Math.round(100000 - gross))} below £100,000, where the personal allowance starts to taper and the effective rate on the next slice of income jumps to about 60%.`
    }
    if (gross > 45000 && gross <= 50270) {
      return `You are ${fmt(Math.round(50270 - gross))} below the £50,270 higher-rate threshold. Above it, income tax on the extra goes from 20% to 40% while NI drops from 8% to 2%.`
    }
    return null
  }

  const calc = () => {
    const contribution = Math.round(annualSalary * (Math.min(100, Math.max(0, +retirementPct)) / 100))
    const res = calculateTax(annualSalary, contribution)

    // Per-paycheck view: divide the actual take-home by the number of pay
    // periods in the year. "paycheck calculator" is what most people search.
    const period = PAY_PERIODS.find(p => p.name === payFrequency) || PAY_PERIODS[0]
    const perPaycheck = Math.round(res.net / period.periods)
    const grossPerPaycheck = Math.round(annualSalary / period.periods)

    let contributionImpact = null
    if (contribution > 0) {
      // The whole point of the feature: you divert `contribution` into
      // retirement, but take-home only falls by `trueCost`, because the money
      // came out before tax. The gap is the tax (and NI) you no longer pay.
      const withoutC = calculateTax(annualSalary, 0)
      const trueCost = withoutC.net - res.net
      contributionImpact = {
        contribution,
        trueCost: Math.round(trueCost),
        taxSaving: Math.round(contribution - trueCost),
        effectiveCostRate: contribution > 0 ? (trueCost / contribution) * 100 : 0,
        // Restoring the personal allowance shows up as take-home falling by far
        // less than the contribution — flag it when it happens in the UK.
        restoresAllowance: country === 'UK' && annualSalary > 100000 && (annualSalary - contribution) <= 100000,
      }
    }

    setResult({
      ...res,
      monthly: Math.round(res.net / 12),
      perPaycheck,
      grossPerPaycheck,
      periodLabel: period.label,
      periods: period.periods,
      contributionImpact,
      ...marginalAnalysis(annualSalary, contribution),
      cliff: cliffNote(annualSalary),
    })
  }

  const fmt = (n) => {
    const data = SALARY_TAX_DATA[country]
    const symbol = data.currency === 'USD' ? '$' : data.currency === 'GBP' ? '£' : data.currency === 'CAD' ? 'C$' : 'A$'
    return symbol + n.toLocaleString()
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-gray-700 mb-4">Paycheck &amp; Salary Take-Home Calculator 2026</h1>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Select Country</label>
        <select value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setState(SALARY_TAX_DATA[e.target.value].states?.[0]?.name || '')
            setProvince(SALARY_TAX_DATA[e.target.value].provinces?.[0]?.name || '')
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          {Object.entries(SALARY_TAX_DATA).map(([key, val]) => (
            <option key={key} value={key}>{val.name}</option>
          ))}
        </select>
      </div>

      {country === 'US' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">State (affects tax)</label>
          <select value={state} onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {SALARY_TAX_DATA.US.states.map((s) => <option key={s.name}>{s.name}</option>)}
          </select>
        </div>
      )}

      {country === 'CA' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Province (affects tax)</label>
          <select value={province} onChange={(e) => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {SALARY_TAX_DATA.CA.provinces.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Annual Salary</label>
        <input type="number" value={annualSalary} onChange={(e) => setAnnualSalary(+e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      {country === 'UK' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Student Loan Plan</label>
          <select value={loanPlan} onChange={(e) => setLoanPlan(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            {SALARY_TAX_DATA.UK.studentLoanPlans.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1">{RETIREMENT_LABEL[country]} (% of salary)</label>
          <input type="number" min="0" max="100" step="1" value={retirementPct}
            onChange={(e) => setRetirementPct(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Show pay per</label>
          <select value={payFrequency} onChange={(e) => setPayFrequency(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="weekly">Week</option>
            <option value="biweekly">2 weeks (biweekly)</option>
            <option value="semimonthly">Twice a month</option>
            <option value="monthly">Month</option>
            <option value="annual">Year</option>
          </select>
        </div>
      </div>

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Take-Home Pay
      </button>

      {result && (
        <div className="mt-5">
          {/* Per-paycheck take-home is the headline most people came for. */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-3">
            <p className="text-sm text-indigo-600 font-semibold mb-1">Take-home pay</p>
            <p className="text-3xl font-black text-indigo-700">
              {fmt(result.perPaycheck)}
              <span className="text-lg text-gray-400 font-normal"> {result.periodLabel}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              from {fmt(result.grossPerPaycheck)} gross{result.periods > 1 ? `, across ${result.periods} pay periods a year` : ''}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Gross Annual', val: fmt(result.gross) },
              { label: 'Total Deductions', val: fmt(result.totalDeductions) },
              { label: 'Net Annual', val: fmt(result.net) },
              { label: 'Monthly Take-Home', val: fmt(result.monthly) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          {/* The differentiator: what a pre-tax contribution actually costs you.
              Because the marginal rate here is accurate (state / NI / taper),
              the "true cost" is too — most calculators only approximate it. */}
          {result.contributionImpact && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-3">
              <p className="text-sm font-semibold text-emerald-800 mb-2">{RETIREMENT_LABEL[country]} impact</p>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">You contribute</p>
                  <p className="text-base font-bold text-gray-800">{fmt(result.contributionImpact.contribution)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Take-home drops by</p>
                  <p className="text-base font-bold text-gray-800">{fmt(result.contributionImpact.trueCost)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Tax saving</p>
                  <p className="text-base font-bold text-emerald-600">{fmt(result.contributionImpact.taxSaving)}</p>
                </div>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed mt-3">
                Every {fmt(100)} you put in only costs you{' '}
                <strong>{fmt(Math.round(result.contributionImpact.effectiveCostRate))}</strong> of take-home pay —
                the rest is tax you no longer pay.
                {result.contributionImpact.restoresAllowance && ' By bringing your income back under £100,000 you also restore your full personal allowance, which is why take-home barely moves.'}
              </p>
            </div>
          )}

          {/* Effective vs marginal rate — the number that actually answers
              "is a raise worth it" and "should I put this into a pension". */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <p className="text-xs text-gray-400 font-medium mb-3">Your tax rates</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Effective rate</p>
                <p className="text-lg font-bold text-gray-800">{result.effectiveRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">of your whole salary</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Marginal rate</p>
                <p className="text-lg font-bold text-gray-800">{result.marginalRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">on your next {fmt(1000)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">You keep</p>
                <p className="text-lg font-bold text-emerald-600">{fmt(result.keepFromNext)}</p>
                <p className="text-xs text-gray-400 leading-snug mt-0.5">of the next {fmt(1000)} you earn</p>
              </div>
            </div>
            {result.cliff && (
              <p className="text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3 mt-3 leading-relaxed">
                ⚠️ {result.cliff}
              </p>
            )}
          </div>

          <div className="bg-indigo-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-indigo-700 font-medium mb-2">Tax & Deduction Breakdown</p>
            <div className="space-y-1">
              {Object.entries(result.deductions).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs text-indigo-600">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {[
              { label: 'Gross', val: result.gross, pct: 100, color: 'bg-indigo-400' },
              { label: 'Taxes', val: result.totalDeductions, pct: (result.totalDeductions / result.gross) * 100, color: 'bg-orange-400' },
              { label: 'Net', val: result.net, pct: (result.net / result.gross) * 100, color: 'bg-green-400' },
            ].map(({ label, val, pct, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-16 text-gray-400">{label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div className={`h-full ${color} rounded-full flex items-center pl-2 text-white`} style={{ width: `${pct}%` }}>
                    {fmt(val)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Much Tax Will I Pay on My Salary?</h2>
          <p className="leading-relaxed">
            Your take-home pay depends on your gross salary, country, and filing status.
            All countries use progressive tax systems — meaning higher income is taxed at higher rates.
            This calculator shows your net pay after income tax, social security, and other mandatory deductions.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Tax Rates by Country 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Country</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Top Income Tax Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Social Security / NI</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax-Free Allowance</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['🇺🇸 United States', '37% (federal)', '6.2% SS + 1.45% Medicare', 'Standard deduction $16,100'],
                  ['🇬🇧 United Kingdom', '45% (additional rate)', '8% National Insurance', 'Personal allowance £12,570'],
                  ['🇨🇦 Canada', '33% (federal)', 'CPP + EI contributions', 'Basic personal amount ~$16,129'],
                  ['🇦🇺 Australia', '45% (top rate)', 'Medicare levy 2%', 'Tax-free threshold A$18,200'],
                ].map(([country, top, ss, allowance], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{country}</td>
                    <td className="p-2 border border-gray-200">{top}</td>
                    <td className="p-2 border border-gray-200">{ss}</td>
                    <td className="p-2 border border-gray-200">{allowance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Gross Pay vs Take-Home Pay</h2>
          <p className="leading-relaxed">
            Your <strong>gross</strong> salary is the headline figure in your job offer — before anything is taken
            off. Your <strong>take-home</strong> (net) pay is what actually lands in your bank account after income
            tax, and social contributions like National Insurance (UK) or Social Security and Medicare (US). Because
            tax is banded, a pay rise is never taxed at your full marginal rate on the whole salary — only the slice
            in each higher band is. That is why doubling your gross salary does not double your take-home.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Else Comes Out of Your Pay</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Pension / retirement contributions.</strong> Workplace pension or 401(k) contributions reduce your take-home now but build long-term savings, often with an employer match and tax relief.</li>
            <li><strong>Student loan repayments.</strong> In the UK these are a percentage of income above a threshold; in the US they are separate from payroll. Either way they lower disposable income.</li>
            <li><strong>State and local taxes (US).</strong> This calculator uses federal figures; states like California or New York add their own income tax, while Texas and Florida have none.</li>
            <li><strong>Benefits in kind.</strong> Perks such as a company car or private medical cover can be taxed through your code, quietly lowering your net pay.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is take-home pay?', a: 'Take-home pay (also called net pay) is your salary after all deductions — income tax, social security, national insurance, and other mandatory contributions. It\'s the actual amount deposited into your bank account each payday.' },
              { q: 'How much tax do I pay on $100,000 in the US?', a: 'On a $100,000 salary (2026 brackets, single, after the $16,100 standard deduction), federal income tax is about $13,400, plus Social Security (6.2%) and Medicare (1.45%). State tax is on top and varies: in California it is roughly $5,300, giving total deductions near $26,300 and take-home around $73,700. In no-income-tax states like Texas or Florida there is no state line, so take-home is closer to $79,000.' },
              { q: 'How much does a 401(k) or pension contribution reduce my paycheck?', a: 'Less than the amount you contribute, because it comes out before tax. Enter a contribution percentage above and the calculator shows the "true cost" — for example, if you are in a 30% marginal band, every $100 into a 401(k) only lowers your take-home by about $70. In the UK, salary-sacrifice pension also cuts National Insurance, and if it brings your income back under £100,000 it restores the tapered personal allowance, so £100 in can cost as little as £38 of take-home.' },
              { q: 'What is the difference between my effective and marginal tax rate?', a: 'Your effective rate is total tax as a share of your whole salary. Your marginal rate is what you pay on the next pound or dollar you earn — it is always higher, and it is the number that tells you what a pay rise is really worth or how much a pension contribution saves. Both are shown with every result above.' },
              { q: 'What is the UK personal allowance for 2026?', a: 'The personal allowance for 2026/27 is £12,570. You pay no income tax on earnings below this amount. Above £12,570, you pay 20% basic rate, 40% higher rate (above £50,270), and 45% additional rate (above £125,140).' },
              { q: 'How does Australian tax work?', a: 'Australia uses a progressive tax system with a tax-free threshold of A$18,200. Rates range from 19% to 45%. A Medicare levy of 2% applies to most taxpayers. Employers also contribute 11.5% of your salary to your superannuation (pension) fund in 2026.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular salary lookups — internal links */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-gray-800 mb-3">Popular Salary Lookups</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">🇬🇧 UK After Tax</p>
            <div className="flex flex-wrap gap-2">
              {[20000, 25000, 30000, 35000, 40000, 50000, 60000, 75000, 100000].map(a => (
                <a key={a} href={`/salary/${a}-after-tax-uk`}
                  className="text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-1.5">
                  £{a.toLocaleString()}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">🇺🇸 US After Tax</p>
            <div className="flex flex-wrap gap-2">
              {[40000, 50000, 60000, 70000, 80000, 100000, 120000, 150000].map(a => (
                <a key={a} href={`/salary/${a}-after-tax-us`}
                  className="text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-1.5">
                  ${a.toLocaleString()}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}