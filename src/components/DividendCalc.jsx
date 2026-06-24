import { useState } from 'react'

const US_STATES = [
  { name: 'California', stateTax: 13.3 },
  { name: 'New York', stateTax: 10.9 },
  { name: 'New Jersey', stateTax: 10.75 },
  { name: 'Oregon', stateTax: 9.9 },
  { name: 'Minnesota', stateTax: 9.85 },
  { name: 'Illinois', stateTax: 4.95 },
  { name: 'Ohio', stateTax: 3.99 },
  { name: 'Texas', stateTax: 0 },
  { name: 'Florida', stateTax: 0 },
  { name: 'Nevada', stateTax: 0 },
  { name: 'Washington', stateTax: 0 },
  { name: 'Wyoming', stateTax: 0 },
]

const EU_COUNTRIES = [
  { name: 'Germany', withholding: 25 },
  { name: 'France', withholding: 30 },
  { name: 'Netherlands', withholding: 15 },
  { name: 'Spain', withholding: 19 },
  { name: 'Italy', withholding: 26 },
  { name: 'Sweden', withholding: 30 },
  { name: 'Denmark', withholding: 27 },
  { name: 'Belgium', withholding: 30 },
  { name: 'Switzerland', withholding: 35 },
  { name: 'United Kingdom', withholding: 0 },
  { name: 'Ireland', withholding: 25 },
  { name: 'Portugal', withholding: 28 },
]

const FEDERAL_TAX = 15 // US qualified dividend federal rate (most common bracket)

export default function DividendCalc() {
  const [region, setRegion] = useState('US')
  const [state, setState] = useState(US_STATES[0])
  const [country, setCountry] = useState(EU_COUNTRIES[0])
  const [form, setForm] = useState({ principal: 10000, yield: 4, years: 20, drip: true })
  const [result, setResult] = useState(null)

  const getTaxRate = () => {
    if (region === 'US') return (FEDERAL_TAX + state.stateTax) / 100
    return country.withholding / 100
  }

  const calc = () => {
    const p = +form.principal
    const y = +form.yield / 100
    const yrs = +form.years
    const taxRate = getTaxRate()
    let total = p
    let annual = 0
    const data = []

    for (let i = 1; i <= yrs; i++) {
      annual = total * y
      const afterTax = annual * (1 - taxRate)
      if (form.drip) total += afterTax
      if (i % Math.ceil(yrs / 5) === 0 || i === yrs) {
        data.push({ yr: i, gross: Math.round(annual), net: Math.round(afterTax) })
      }
    }

    const grossAnnual = Math.round(total * y)
    const netAnnual = Math.round(grossAnnual * (1 - taxRate))

    setResult({
      total: Math.round(total),
      grossAnnual,
      netAnnual,
      monthly: Math.round(netAnnual / 12),
      taxRate: Math.round(taxRate * 100 * 10) / 10,
      data,
    })
  }

  const fmt = (n) => '$' + n.toLocaleString()

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Dividend Reinvestment Calculator</h2>

      {/* Region Toggle */}
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

      {/* State / Country Selector */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">
          {region === 'US' ? 'State (affects state income tax)' : 'Country (withholding tax)'}
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
            ? `Federal: ${FEDERAL_TAX}% + State: ${state.stateTax}% = Total: ${FEDERAL_TAX + state.stateTax}%`
            : `Withholding tax: ${country.withholding}%`}
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          { label: 'Initial Investment ($)', key: 'principal' },
          { label: 'Annual Dividend Yield (%)', key: 'yield' },
          { label: 'Investment Period (years)', key: 'years' },
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
        <div>
          <label className="text-xs text-gray-500 block mb-1">Reinvest Dividends (DRIP)</label>
          <select
            value={form.drip}
            onChange={e => setForm({ ...form, drip: e.target.value === 'true' })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="true">Yes (Compound effect)</option>
            <option value="false">No</option>
          </select>
        </div>
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
              { label: 'Portfolio Value', val: fmt(result.total) },
              { label: 'Annual Dividend (gross)', val: fmt(result.grossAnnual) },
              { label: 'Annual Dividend (after tax)', val: fmt(result.netAnnual) },
              { label: 'Monthly Income (after tax)', val: fmt(result.monthly) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-xl p-3 mb-3 text-xs text-indigo-700">
            💡 Effective tax rate applied: <strong>{result.taxRate}%</strong>
            {region === 'US' && ` (Federal ${FEDERAL_TAX}% + ${state.name} ${state.stateTax}%)`}
            {region === 'Europe' && ` (${country.name} withholding)`}
          </div>

          <p className="text-xs text-gray-400 mb-2 font-medium">After-tax annual dividend over time</p>
          <div className="space-y-2">
            {result.data.map(({ yr, net }) => {
              const pct = Math.round((net / result.netAnnual) * 70 + 30)
              return (
                <div key={yr} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-gray-400 text-right">{yr}yr</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                    <div
                      className="h-full bg-teal-400 rounded-full flex items-center pl-2 text-white"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    >
                      {fmt(net)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}