import { useState } from 'react'
import { SALARY_TAX_DATA } from '../data/salaryTaxRates'

export default function SalaryCalc() {
  const [country, setCountry] = useState('US')
  const [state, setState] = useState('California')
  const [province, setProvince] = useState('Ontario')
  const [annualSalary, setAnnualSalary] = useState(100000)
  const [result, setResult] = useState(null)

  const calculateTax = (gross) => {
    const data = SALARY_TAX_DATA[country]
    let federalTax = 0
    let deductions = {}

    switch (country) {
      case 'US': {
        for (let bracket of data.brackets) {
          if (gross > bracket.min) {
            federalTax += (Math.min(gross, bracket.max) - bracket.min) * bracket.rate
          }
        }
        const ssWages = Math.min(gross, data.socialSecurityCap)
        const stateData = data.states.find(s => s.name === state)
        deductions = {
          federalTax: Math.round(federalTax),
          stateTax: Math.round(gross * (stateData?.tax || 0)),
          socialSecurity: Math.round(ssWages * data.socialSecurity),
          medicare: Math.round(gross * data.medicare),
        }
        break
      }
      case 'UK': {
        for (let bracket of data.brackets) {
          if (gross > bracket.min) {
            federalTax += (Math.min(gross, bracket.max) - bracket.min) * bracket.rate
          }
        }
        deductions = {
          incomeTax: Math.round(federalTax),
          nationalInsurance: Math.round(Math.max(0, gross - 12570) * data.nationalInsurance),
          studentLoan: Math.round(Math.max(0, gross - data.studentLoanThreshold) * data.studentLoan),
        }
        break
      }
      case 'CA': {
        for (let bracket of data.federalBrackets) {
          if (gross > bracket.min) {
            federalTax += (Math.min(gross, bracket.max) - bracket.min) * bracket.rate
          }
        }
        const provData = data.provinces.find(p => p.name === province)
        let provTax = 0
        if (provData) {
          for (let bracket of provData.brackets) {
            if (gross > bracket.min) provTax += (Math.min(gross, bracket.max) - bracket.min) * bracket.rate
          }
        }
        deductions = {
          federalTax: Math.round(federalTax),
          provinceTax: Math.round(provTax),
          cpp: Math.round(Math.min(gross * data.cpp, data.cppMax)),
          ei: Math.round(gross * data.ei),
        }
        break
      }
      case 'AU': {
        for (let bracket of data.brackets) {
          if (gross > bracket.min) {
            federalTax += (Math.min(gross, bracket.max) - bracket.min) * bracket.rate
          }
        }
        deductions = {
          incomeTax: Math.round(federalTax),
          medicareLevey: Math.round(gross * data.medicareLevey),
          superannuation: Math.round(gross * data.superannuation),
        }
        break
      }
    }

    const totalTaxAndDeductions = Object.values(deductions).reduce((a, b) => a + b, 0)
    return { gross, deductions, net: gross - totalTaxAndDeductions, totalDeductions: totalTaxAndDeductions }
  }

  const calc = () => {
    const res = calculateTax(annualSalary)
    setResult({ ...res, monthly: Math.round(res.net / 12), biweekly: Math.round(res.net / 26) })
  }

  const fmt = (n) => {
    const data = SALARY_TAX_DATA[country]
    const symbol = data.currency === 'USD' ? '$' : data.currency === 'GBP' ? '£' : data.currency === 'CAD' ? 'C$' : 'A$'
    return symbol + n.toLocaleString()
  }

  return (
    <div>
      <h1 className="text-base font-semibold text-gray-700 mb-4">Salary Take-Home Calculator 2026</h1>

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

      <button onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Take-Home Pay
      </button>

      {result && (
        <div className="mt-5">
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
              { q: 'How much tax do I pay on $100,000 in the US?', a: 'On a $100,000 salary, federal income tax is approximately $17,400 (2026 brackets). Add Social Security (6.2%), Medicare (1.45%), and state tax (varies). In California, total deductions would be around $30,000–$35,000, leaving a take-home of roughly $65,000–$70,000.' },
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