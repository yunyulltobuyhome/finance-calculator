import { useState } from 'react'

const US_STATES = [
  { name: 'California', propertyTaxRate: 0.76 },
  { name: 'New York', propertyTaxRate: 1.72 },
  { name: 'Texas', propertyTaxRate: 1.60 },
  { name: 'Florida', propertyTaxRate: 0.91 },
  { name: 'Illinois', propertyTaxRate: 2.27 },
  { name: 'New Jersey', propertyTaxRate: 2.47 },
  { name: 'Washington', propertyTaxRate: 0.98 },
  { name: 'Nevada', propertyTaxRate: 0.55 },
]

const EU_COUNTRIES = [
  { name: 'Germany', avgRate: 3.8 },
  { name: 'France', avgRate: 3.6 },
  { name: 'Netherlands', avgRate: 4.1 },
  { name: 'Spain', avgRate: 3.5 },
  { name: 'Italy', avgRate: 3.9 },
  { name: 'United Kingdom', avgRate: 4.5 },
  { name: 'Sweden', avgRate: 3.2 },
  { name: 'Portugal', avgRate: 3.7 },
]

export default function LoanCalc() {
  const [region, setRegion] = useState('US')
  const [state, setState] = useState(US_STATES[0])
  const [country, setCountry] = useState(EU_COUNTRIES[0])
  const [form, setForm] = useState({ principal: 300000, rate: 4.5, years: 30, extra: 0 })
  const [result, setResult] = useState(null)

  const calc = () => {
    const p = +form.principal
    const r = +form.rate / 100 / 12
    const n = +form.years * 12
    const extra = +form.extra
    const monthly = r === 0 ? p / n : p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1)
    const totalPay = monthly * n
    const totalInt = totalPay - p
    let bal = p, months = 0
    if (extra > 0) {
      while (bal > 0 && months < n) { bal = bal * (1 + r) - (monthly + extra); months++ }
    }
    const annualPropertyTax = region === 'US' ? p * state.propertyTaxRate / 100 : 0
    setResult({
      monthly: Math.round(monthly),
      totalInt: Math.round(totalInt),
      totalPay: Math.round(totalPay),
      earlyYears: extra > 0 ? Math.round(months / 12 * 10) / 10 : null,
      principalPct: Math.round(p / totalPay * 100),
      annualPropertyTax: Math.round(annualPropertyTax),
      monthlyWithTax: Math.round(monthly + annualPropertyTax / 12),
    })
  }

  const fmt = (n) => '$' + n.toLocaleString()

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Mortgage & Loan Calculator</h2>

      <div className="flex gap-2 mb-4">
        {['US', 'Europe'].map(r => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              region === r
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {r === 'US' ? '🇺🇸 United States' : '🇪🇺 Europe'}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">
          {region === 'US' ? 'State (affects property tax estimate)' : 'Country (reference rates)'}
        </label>
        <select
          onChange={e => {
            if (region === 'US') setState(US_STATES.find(s => s.name === e.target.value))
            else setCountry(EU_COUNTRIES.find(c => c.name === e.target.value))
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {(region === 'US' ? US_STATES : EU_COUNTRIES).map(item => (
            <option key={item.name}>{item.name}</option>
          ))}
        </select>
        <p className="text-xs text-gray-400 mt-1">
          {region === 'US'
            ? `Avg property tax: ${state.propertyTaxRate}% per year`
            : `Avg mortgage rate in ${country.name}: ~${country.avgRate}%`}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Loan Amount ($)', key: 'principal' },
          { label: 'Annual Interest Rate (%)', key: 'rate' },
          { label: 'Loan Term (years)', key: 'years' },
          { label: 'Extra Monthly Payment ($)', key: 'extra' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input
              type="number"
              value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        ))}
      </div>

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Monthly Payment', val: fmt(result.monthly) },
              { label: 'Total Interest', val: fmt(result.totalInt) },
              { label: 'Total Payment', val: fmt(result.totalPay) },
              ...(region === 'US' ? [{ label: 'Monthly (incl. property tax est.)', val: fmt(result.monthlyWithTax) }] : []),
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs mb-3">
            {[
              { label: 'Principal', pct: result.principalPct, color: 'bg-indigo-400' },
              { label: 'Interest', pct: 100 - result.principalPct, color: 'bg-orange-400' },
            ].map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="w-14 text-gray-400">{label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                  <div className={`h-full ${color} rounded-full flex items-center pl-2 text-white`} style={{ width: `${pct}%` }}>
                    {pct}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {result.earlyYears && (
            <div className="bg-indigo-50 rounded-xl p-3 text-sm text-indigo-700">
              💡 With extra payments, paid off in <strong>{result.earlyYears} years</strong>
            </div>
          )}

          {region === 'US' && (
            <p className="text-xs text-gray-400 mt-2">
              * Property tax estimate based on {state.name} avg rate ({state.propertyTaxRate}%). Actual rates vary by county.
            </p>
          )}
        </div>
      )}
    </div>
  )
}