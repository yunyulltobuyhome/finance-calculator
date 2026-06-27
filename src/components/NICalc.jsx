import { useState } from 'react'

// 2026/27 Class 1 Employee NI
const NI_RATES = {
  PRIMARY_THRESHOLD: 12570,
  UPPER_EARNINGS_LIMIT: 50270,
  MAIN_RATE: 0.08,
  HIGHER_RATE: 0.02,
}

// 2026/27 Employer NI
const EMPLOYER_RATES = {
  SECONDARY_THRESHOLD: 5000,
  RATE: 0.15,
}

function calcNI(salary) {
  const { PRIMARY_THRESHOLD, UPPER_EARNINGS_LIMIT, MAIN_RATE, HIGHER_RATE } = NI_RATES
  let employee = 0
  if (salary > PRIMARY_THRESHOLD) {
    const mainBand = Math.min(salary, UPPER_EARNINGS_LIMIT) - PRIMARY_THRESHOLD
    employee += mainBand * MAIN_RATE
    if (salary > UPPER_EARNINGS_LIMIT) {
      employee += (salary - UPPER_EARNINGS_LIMIT) * HIGHER_RATE
    }
  }
  const employer = salary > EMPLOYER_RATES.SECONDARY_THRESHOLD
    ? (salary - EMPLOYER_RATES.SECONDARY_THRESHOLD) * EMPLOYER_RATES.RATE
    : 0
  return {
    employee: Math.round(employee),
    employer: Math.round(employer),
    employeeMonthly: Math.round(employee / 12),
    employerMonthly: Math.round(employer / 12),
    effectiveRate: salary > 0 ? ((employee / salary) * 100).toFixed(1) : '0.0',
  }
}

function calcIncomeTax(salary) {
  const personal = 12570
  const basic = 50270
  const higher = 125140
  let tax = 0
  if (salary > personal) {
    tax += (Math.min(salary, basic) - personal) * 0.20
    if (salary > basic) tax += (Math.min(salary, higher) - basic) * 0.40
    if (salary > higher) tax += (salary - higher) * 0.45
  }
  return Math.round(tax)
}

export default function NICalc() {
  const [salary, setSalary] = useState('')
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()

  const calculate = () => {
    const s = parseFloat(salary)
    if (!s || s < 0) return
    const ni = calcNI(s)
    const incomeTax = calcIncomeTax(s)
    const takeHome = s - ni.employee - incomeTax
    setResult({ ...ni, salary: s, incomeTax, takeHome })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          UK National Insurance Calculator 2026/27
        </h2>
        <p className="text-sm text-gray-500">
          Estimate your Class 1 National Insurance contributions as an employee.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ Rates updated April 2026 — Employee 8% / 2% | Employer 15%
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Gross Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
              placeholder="e.g. 35,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate NI Contributions
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Main result */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Estimated Employee NI (Annual)
                </p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.employee)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {fmt(result.employeeMonthly)}/month · Effective rate {result.effectiveRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Estimated Take-Home</p>
                <p className="text-xl font-bold text-green-600">{fmt(result.takeHome)}</p>
                <p className="text-xs text-gray-400">{fmt(Math.round(result.takeHome / 12))}/month</p>
              </div>
            </div>
          </div>

          {/* Full breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Full Deduction Breakdown (estimated)</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Gross salary</span>
              <span className="font-semibold">{fmt(result.salary)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Income Tax (est.)</span>
              <span className="font-semibold text-red-500">- {fmt(result.incomeTax)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Employee NI (est.)</span>
              <span className="font-semibold text-red-500">- {fmt(result.employee)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
              <span>Estimated take-home</span>
              <span>{fmt(result.takeHome)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-orange-600">
              <span className="text-gray-500">Employer NI (your cost to employer)</span>
              <span className="font-semibold">{fmt(result.employer)}</span>
            </div>
          </div>

          {/* NI bands */}
          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-2">2026/27 Employee NI Bands</p>
            {[
              ['Up to £12,570/yr', '0%', 'Below Primary Threshold — no NI'],
              ['£12,571 – £50,270/yr', '8%', 'Main rate'],
              ['Over £50,270/yr', '2%', 'Above Upper Earnings Limit'],
            ].map(([band, rate, note], i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 gap-2">
                <span className="w-36 shrink-0">{band}</span>
                <span className="font-bold text-indigo-600 w-8">{rate}</span>
                <span className="text-gray-400">{note}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ UK NI 2026/27 Key Facts</p>
            <p>• Employee NI: 8% on earnings £12,570–£50,270 | 2% above £50,270</p>
            <p>• Employer NI: 15% on earnings above £5,000 (from April 2025)</p>
            <p>• Personal Allowance: £12,570 (income tax)</p>
            <p>• Estimates assume standard tax code (1257L) — pension, student loan not included</p>
            <p>• Self-employed NI (Class 2/4) uses different rates — not included here</p>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How Much National Insurance Do I Pay in 2026?
          </h2>
          <p className="leading-relaxed">
            National Insurance (NI) is a tax on earnings paid by employees, employers, and the
            self-employed. As an employee in 2026/27, you pay Class 1 NI at 8% on earnings between
            £12,570 and £50,270 per year, and 2% on anything above £50,270.
            Employers pay 15% on earnings above £5,000 per year.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">NI Rates 2026/27 at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Contribution</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Threshold</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Employee (main)', '£12,570 – £50,270/yr', '8%'],
                  ['Employee (higher)', 'Above £50,270/yr', '2%'],
                  ['Employer', 'Above £5,000/yr', '15%'],
                  ['Self-employed Class 4', '£12,570 – £50,270/yr', '6%'],
                  ['Self-employed Class 4 (higher)', 'Above £50,270/yr', '2%'],
                ].map(([type, threshold, rate], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{type}</td>
                    <td className="p-2 border border-gray-200">{threshold}</td>
                    <td className="p-2 border border-gray-200 font-semibold text-indigo-600">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Rates effective 6 April 2026. Source: HMRC.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'What does National Insurance pay for?',
                a: 'NI contributions go towards the State Pension, the NHS, Jobseeker\'s Allowance, Employment and Support Allowance, and other state benefits. Your NI record affects how much State Pension you receive — you generally need 35 qualifying years for the full new State Pension (£230.25/week in 2026).',
              },
              {
                q: 'Do I pay NI on all my income?',
                a: 'As an employee, you pay Class 1 NI on earned income (salary, wages, bonuses) above the Primary Threshold (£12,570). You do not pay NI on investment income, rental income, or pension income. If you have multiple jobs, NI is calculated separately for each employment.',
              },
              {
                q: 'Is NI different if I\'m self-employed?',
                a: 'Yes. Self-employed people pay Class 4 NI (6% on profits £12,570–£50,270, then 2%). Class 2 NI was abolished from April 2024 — self-employed people now build NI credits through Class 4 alone. This calculator covers employee (Class 1) NI only.',
              },
              {
                q: 'When do I stop paying National Insurance?',
                a: 'Employees stop paying NI when they reach State Pension age (currently 66). Employers continue paying Employer NI on your wages regardless of your age. Check your NI record and State Pension forecast at gov.uk/check-state-pension.',
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
          <a href="https://www.gov.uk/national-insurance" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — National Insurance rates and categories</a>
          <a href="https://www.gov.uk/check-national-insurance-record" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Check your NI record</a>
        </div>
      </div>
    </div>
  )
}