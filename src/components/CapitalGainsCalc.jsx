import { useState } from 'react'

const US_LT_SINGLE = [
  { max: 49450,    rate: 0 },
  { max: 545500,   rate: 0.15 },
  { max: Infinity, rate: 0.20 },
]
const US_LT_MFJ = [
  { max: 98900,    rate: 0 },
  { max: 613700,   rate: 0.15 },
  { max: Infinity, rate: 0.20 },
]
const US_ST_SINGLE = [
  { max: 11925,    rate: 0.10 },
  { max: 48475,    rate: 0.12 },
  { max: 103350,   rate: 0.22 },
  { max: 197300,   rate: 0.24 },
  { max: 250525,   rate: 0.32 },
  { max: 626350,   rate: 0.35 },
  { max: Infinity, rate: 0.37 },
]
const US_ST_MFJ = [
  { max: 23850,    rate: 0.10 },
  { max: 96950,    rate: 0.12 },
  { max: 206700,   rate: 0.22 },
  { max: 394600,   rate: 0.24 },
  { max: 501050,   rate: 0.32 },
  { max: 751600,   rate: 0.35 },
  { max: Infinity, rate: 0.37 },
]

const UK_BASIC_RATE_BAND = 50270
const UK_PERSONAL_ALLOWANCE = 12570
const UK_AEA = 3000
const UK_BASIC_RATE = 0.18
const UK_HIGHER_RATE = 0.24

function calcUSCGT(gain, income, holdingType, filingStatus) {
  const isLong = holdingType === 'long'
  const brackets = isLong
    ? (filingStatus === 'single' ? US_LT_SINGLE : US_LT_MFJ)
    : (filingStatus === 'single' ? US_ST_SINGLE : US_ST_MFJ)

  if (isLong) {
    const totalIncome = income + gain
    let tax = 0
    let prevMax = 0
    for (const bracket of brackets) {
      const bandStart = Math.max(prevMax, income)
      const bandEnd = bracket.max
      if (bandStart >= bandEnd) { prevMax = bracket.max; continue }
      const taxableInBand = Math.max(0, Math.min(totalIncome, bandEnd) - bandStart)
      tax += taxableInBand * bracket.rate
      prevMax = bracket.max
      if (totalIncome <= bracket.max) break
    }
    const niitThreshold = filingStatus === 'single' ? 200000 : 250000
    const niitBase = Math.max(0, Math.min(gain, income + gain - niitThreshold))
    const niit = niitBase > 0 ? niitBase * 0.038 : 0
    return { tax, niit, total: tax + niit }
  } else {
    let totalTax = 0, incomeTax = 0
    let prevMax = 0
    for (const bracket of brackets) {
      const taxable = Math.min(income + gain, bracket.max) - Math.max(prevMax, 0)
      if (taxable > 0) totalTax += taxable * bracket.rate
      prevMax = bracket.max
      if (income + gain <= bracket.max) break
    }
    prevMax = 0
    for (const bracket of brackets) {
      const taxable = Math.min(income, bracket.max) - Math.max(prevMax, 0)
      if (taxable > 0) incomeTax += taxable * bracket.rate
      prevMax = bracket.max
      if (income <= bracket.max) break
    }
    const tax = totalTax - incomeTax
    return { tax, niit: 0, total: tax }
  }
}

function calcUKCGT(gain, income) {
  const taxableIncome = Math.max(0, income - UK_PERSONAL_ALLOWANCE)
  const taxableGain = Math.max(0, gain - UK_AEA)
  if (taxableGain <= 0) return { tax: 0, basicPart: 0, higherPart: 0 }
  const remainingBasic = Math.max(0, UK_BASIC_RATE_BAND - taxableIncome)
  const basicPart = Math.min(taxableGain, remainingBasic)
  const higherPart = Math.max(0, taxableGain - remainingBasic)
  const tax = basicPart * UK_BASIC_RATE + higherPart * UK_HIGHER_RATE
  return { tax, basicPart, higherPart }
}

export default function CapitalGainsCalc() {
  const [country, setCountry] = useState('us')
  const [buyPrice, setBuyPrice] = useState('')
  const [sellPrice, setSellPrice] = useState('')
  const [income, setIncome] = useState('')
  const [holdingType, setHoldingType] = useState('long')
  const [filingStatus, setFilingStatus] = useState('single')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const buy = parseFloat(buyPrice)
    const sell = parseFloat(sellPrice)
    const inc = parseFloat(income) || 0
    if (!buy || !sell) return
    const gain = sell - buy
    if (gain <= 0) { setResult({ gain, tax: 0, loss: true }); return }
    if (country === 'us') {
      const { tax, niit, total } = calcUSCGT(gain, inc, holdingType, filingStatus)
      setResult({ gain, tax, niit, total, country: 'us' })
    } else {
      const { tax, basicPart, higherPart } = calcUKCGT(gain, inc)
      setResult({ gain, tax, total: tax, basicPart, higherPart, country: 'uk' })
    }
  }

  const fmt = (n) => (country === 'uk' ? '£' : '$') + Math.round(n).toLocaleString()

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Capital Gains Tax Calculator 2026</h2>
        <p className="text-sm text-gray-500">Estimate your CGT for the US or UK based on the latest 2026 rates.</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
        <div className="grid grid-cols-2 gap-2">
          {[{ value: 'us', label: '🇺🇸 United States' }, { value: 'uk', label: '🇬🇧 United Kingdom' }].map(opt => (
            <button key={opt.value} onClick={() => { setCountry(opt.value); setResult(null) }}
              className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${country === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {country === 'us' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Holding Period</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: 'long', label: '📅 Long-Term (>1 year)' }, { value: 'short', label: '⚡ Short-Term (≤1 year)' }].map(opt => (
                <button key={opt.value} onClick={() => setHoldingType(opt.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${holdingType === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Filing Status</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ value: 'single', label: '👤 Single' }, { value: 'mfj', label: '👫 Married Filing Jointly' }].map(opt => (
                <button key={opt.value} onClick={() => setFilingStatus(opt.value)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${filingStatus === opt.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Purchase Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={buyPrice} onChange={e => setBuyPrice(e.target.value)} placeholder="10,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
            <input type="number" value={sellPrice} onChange={e => setSellPrice(e.target.value)} placeholder="20,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Income (before this gain)</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{country === 'uk' ? '£' : '$'}</span>
          <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder={country === 'us' ? '75,000' : '35,000'}
            className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <button onClick={calculate} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
        Calculate CGT
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {result.loss ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
              <p className="text-green-600 font-bold text-lg">📉 Capital Loss</p>
              <p className="text-green-700 font-black text-3xl mt-1">{fmt(Math.abs(result.gain))}</p>
              <p className="text-sm text-green-600 mt-2">No CGT to pay. You may be able to offset this loss against other gains.</p>
            </div>
          ) : (
            <>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-indigo-600 font-semibold mb-1">Total Tax Due</p>
                    <p className="text-4xl font-black text-indigo-700">{fmt(result.total)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Your Gain</p>
                    <p className="text-2xl font-bold text-gray-700">{fmt(result.gain)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Capital Gain</span>
                  <span className="font-semibold">{fmt(result.gain)}</span>
                </div>
                {result.country === 'uk' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Annual Exempt Amount</span>
                      <span className="font-semibold text-green-600">- £3,000</span>
                    </div>
                    {result.basicPart > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Basic rate (18%)</span>
                        <span className="font-semibold">{fmt(result.basicPart * 0.18)}</span>
                      </div>
                    )}
                    {result.higherPart > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Higher rate (24%)</span>
                        <span className="font-semibold">{fmt(result.higherPart * 0.24)}</span>
                      </div>
                    )}
                  </>
                )}
                {result.country === 'us' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Federal CGT</span>
                      <span className="font-semibold">{fmt(result.tax)}</span>
                    </div>
                    {result.niit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">NIIT (3.8%)</span>
                        <span className="font-semibold">{fmt(result.niit)}</span>
                      </div>
                    )}
                  </>
                )}
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>After-Tax Profit</span>
                  <span className="text-green-600">{fmt(result.gain - result.total)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
                {result.country === 'us' ? (
                  <>
                    <p className="font-bold">ℹ️ US CGT 2026</p>
                    <p>• Long-term (&gt;1 year): 0% / 15% / 20% based on income</p>
                    <p>• Short-term (≤1 year): taxed as ordinary income (10%–37%)</p>
                    <p>• NIIT 3.8% applies if income exceeds $200k (single) / $250k (MFJ)</p>
                    <p>• State taxes not included</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold">ℹ️ UK CGT 2026/27</p>
                    <p>• Annual Exempt Amount: £3,000</p>
                    <p>• Basic rate taxpayers: 18%</p>
                    <p>• Higher/additional rate taxpayers: 24%</p>
                    <p>• Basic rate band: income up to £50,270</p>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Capital Gains Tax in 2026</h2>
          <p className="leading-relaxed">
            Capital gains tax (CGT) is paid on the profit you make when selling an asset such as shares, property, or cryptocurrency.
            The rate depends on how long you held the asset, your income, and which country you're in.
            Holding an asset for more than one year typically results in a significantly lower tax rate.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">2026 CGT Rates at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Type</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇺🇸 US Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">🇬🇧 UK Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Short-term (≤1 year)', '10%–37% (ordinary income)', 'Taxed as income'],
                  ['Long-term (>1 year)', '0%, 15%, or 20%', '18% or 24%'],
                  ['Tax-free allowance', 'None', '£3,000 annual exempt amount'],
                  ['High earner surcharge', '+3.8% NIIT above $200k/$250k', 'N/A'],
                ].map(([type, us, uk], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{type}</td>
                    <td className="p-2 border border-gray-200">{us}</td>
                    <td className="p-2 border border-gray-200">{uk}</td>
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
              { q: 'How do I reduce capital gains tax in the US?', a: 'Hold assets for more than one year to qualify for lower long-term rates (0%, 15%, or 20%). Use tax-advantaged accounts like 401(k)s and IRAs where gains are not taxed. If your income is below $49,450 (single) or $98,900 (MFJ) in 2026, you may owe 0% on long-term gains.' },
              { q: 'What is the UK CGT allowance for 2026?', a: 'The Annual Exempt Amount for 2026/27 is £3,000. Gains below this threshold are completely tax-free. This has fallen sharply from £12,300 in 2022/23, making tax planning more important.' },
              { q: 'Do I pay CGT on cryptocurrency?', a: 'Yes — in both the US and UK, cryptocurrency is treated as a capital asset. Selling, swapping, or spending crypto triggers a taxable event. In the UK, HMRC explicitly confirms that crypto gains are subject to CGT.' },
              { q: 'What is the NIIT?', a: 'The Net Investment Income Tax (NIIT) adds 3.8% on investment income for high earners. In 2026, it applies if your Modified AGI exceeds $200,000 (single) or $250,000 (married filing jointly).' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}