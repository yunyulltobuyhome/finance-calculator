import { useState } from 'react'
import { Link } from 'react-router-dom'

const POPULAR_PRICES = [200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 750000, 1000000]

const RATES = {
  uk_standard: [
    { min: 0,       max: 125000,  rate: 0 },
    { min: 125000,  max: 250000,  rate: 0.02 },
    { min: 250000,  max: 925000,  rate: 0.05 },
    { min: 925000,  max: 1500000, rate: 0.10 },
    { min: 1500000, max: Infinity,rate: 0.12 },
  ],
  uk_first_time: [
    { min: 0,       max: 300000,  rate: 0 },
    { min: 300000,  max: 500000,  rate: 0.05 },
  ],
  uk_additional: [
    { min: 0,       max: 125000,  rate: 0.05 },
    { min: 125000,  max: 250000,  rate: 0.07 },
    { min: 250000,  max: 925000,  rate: 0.10 },
    { min: 925000,  max: 1500000, rate: 0.15 },
    { min: 1500000, max: Infinity,rate: 0.17 },
  ],
}

function calcSDLT(price, buyerType) {
  let bands = []
  if (buyerType === 'first_time') {
    if (price <= 300000) return { tax: 0, bands: [{ label: '£0 – £300,000 (0%)', tax: 0 }] }
    else if (price <= 500000) bands = RATES.uk_first_time
    else bands = RATES.uk_standard
  } else if (buyerType === 'additional') {
    bands = RATES.uk_additional
  } else {
    bands = RATES.uk_standard
  }

  let total = 0
  const breakdown = []
  for (const band of bands) {
    if (price <= band.min) break
    const taxable = Math.min(price, band.max) - band.min
    const tax = taxable * band.rate
    if (taxable > 0) {
      breakdown.push({
        label: `£${band.min.toLocaleString()} – ${band.max === Infinity ? 'above' : '£' + band.max.toLocaleString()} (${band.rate * 100}%)`,
        taxable, tax,
      })
    }
    total += tax
  }
  return { tax: total, bands: breakdown }
}

export default function StampDutyCalc() {
  const [price, setPrice] = useState('')
  const [buyerType, setBuyerType] = useState('standard')
  const [overseas, setOverseas] = useState(false)
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()

  const calculate = () => {
    const p = parseFloat(price.replace(/,/g, ''))
    if (!p || p <= 0) return
    let { tax, bands } = calcSDLT(p, buyerType)
    if (overseas) tax += p * 0.02
    const effectiveRate = ((tax / p) * 100).toFixed(2)
    setResult({ tax, bands, effectiveRate, price: p, overseas })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">UK Stamp Duty Calculator 2026</h2>
        <p className="text-sm text-gray-500">Calculate your Stamp Duty Land Tax (SDLT) based on the latest 2026 rates (updated April 2025).</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Buyer Type</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'standard',   label: '🏠 Standard Buyer' },
            { value: 'first_time', label: '🔑 First-Time Buyer' },
            { value: 'additional', label: '🏢 Additional Property' },
          ].map(opt => (
            <button key={opt.value} onClick={() => setBuyerType(opt.value)}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                buyerType === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Property Price</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">£</span>
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="350,000"
            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={overseas} onChange={e => setOverseas(e.target.checked)} className="w-4 h-4 accent-indigo-600" />
          <span className="text-sm text-gray-700">Non-UK resident buyer <span className="text-gray-400">(+2% surcharge)</span></span>
        </label>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
        Calculate Stamp Duty
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">Total Stamp Duty</p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.tax)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Effective Rate</p>
                <p className="text-2xl font-bold text-gray-700">{result.effectiveRate}%</p>
              </div>
            </div>
            {result.tax === 0 && <p className="mt-3 text-sm text-green-600 font-semibold">✅ No Stamp Duty to pay!</p>}
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Property Price</span>
              <span className="font-semibold text-gray-800">{fmt(result.price)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Stamp Duty</span>
              <span className="font-semibold text-red-500">{fmt(result.tax)}</span>
            </div>
            {result.overseas && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Non-UK Surcharge (2%)</span>
                <span className="font-semibold text-red-400">{fmt(result.price * 0.02)}</span>
              </div>
            )}
            <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between text-sm">
              <span className="font-bold text-gray-700">Total Cost</span>
              <span className="font-bold text-gray-800">{fmt(result.price + result.tax)}</span>
            </div>
          </div>

          {result.bands.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-2">Tax Breakdown by Band</p>
              <div className="space-y-2">
                {result.bands.map((band, i) => (
                  <div key={i} className="flex justify-between items-center bg-white border border-gray-100 rounded-lg px-4 py-2">
                    <span className="text-xs text-gray-500">{band.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{fmt(band.tax)}</span>
                  </div>
                ))}
                {result.overseas && (
                  <div className="flex justify-between items-center bg-white border border-gray-100 rounded-lg px-4 py-2">
                    <span className="text-xs text-gray-500">Non-UK Resident Surcharge (2%)</span>
                    <span className="text-sm font-semibold text-gray-800">{fmt(result.price * 0.02)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ 2026 Rate Info (England & Northern Ireland)</p>
            <p>• Standard: 0% up to £125k → 2% → 5% → 10% → 12%</p>
            <p>• First-time buyer: 0% up to £300k, 5% up to £500k</p>
            <p>• Additional property: +5% surcharge on all bands</p>
            <p>• Non-UK resident: +2% surcharge on top</p>
            <p className="mt-1 text-blue-500">Rates effective from 1 April 2025. Scotland (LBTT) and Wales (LTT) use different rates.</p>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">What is Stamp Duty?</h2>
          <p className="leading-relaxed">
            Stamp Duty Land Tax (SDLT) is a tax paid when buying property in England or Northern Ireland.
            Since April 2025, the nil-rate threshold returned to £125,000, meaning most buyers now pay stamp duty on properties over this amount.
            First-time buyers benefit from relief up to £300,000.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Stamp Duty Rates 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Property Value</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Standard Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">First-Time Buyer</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Additional Property</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Up to £125,000',      '0%',  '0%',  '5%'],
                  ['£125,001 – £250,000', '2%',  '0%',  '7%'],
                  ['£250,001 – £300,000', '5%',  '0%',  '10%'],
                  ['£300,001 – £925,000', '5%',  '5%',  '10%'],
                  ['£925,001 – £1.5m',    '10%', '10%', '15%'],
                  ['Over £1.5m',          '12%', '12%', '17%'],
                ].map(([range, std, ftb, add], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200">{range}</td>
                    <td className="p-2 border border-gray-200">{std}</td>
                    <td className="p-2 border border-gray-200 text-green-600">{ftb}</td>
                    <td className="p-2 border border-gray-200 text-orange-600">{add}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Rates effective from 1 April 2025. Non-UK residents pay an additional 2% surcharge.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Do first-time buyers pay stamp duty in 2026?',
                a: 'First-time buyers pay 0% on properties up to £300,000. For properties between £300,001 and £500,000, they pay 5% on the portion above £300,000. If the property costs more than £500,000, standard rates apply.',
              },
              {
                q: 'When do you pay stamp duty?',
                a: 'Stamp duty must be paid within 14 days of completing your property purchase. Your solicitor or conveyancer usually handles this on your behalf.',
              },
              {
                q: 'Do you pay stamp duty on second homes?',
                a: 'Yes. Buying an additional property attracts a 5% surcharge on top of standard rates, starting from £40,000.',
              },
              {
                q: 'Is stamp duty different in Scotland and Wales?',
                a: 'Yes. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT). This calculator covers England and Northern Ireland only.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Stamp Duty by House Price</h2>
          <div className="flex flex-wrap gap-2">
            {POPULAR_PRICES.map(p => (
              <Link key={p} to={`/stamp-duty/${p}`}
                className="text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                £{p.toLocaleString()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}