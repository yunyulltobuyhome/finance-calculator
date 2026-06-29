import { useState } from 'react'

// 2026/27 UK Corporation Tax rates
const CT_RATES = {
  smallProfitsRate: 0.19,
  smallProfitsLimit: 50000,
  mainRate: 0.25,
  mainRateLimit: 250000,
  marginalReliefFraction: 3 / 200,
}

function calcCorpTax(profit, associatedCompanies = 0) {
  const divisor = associatedCompanies + 1
  const lowerLimit = CT_RATES.smallProfitsLimit / divisor
  const upperLimit = CT_RATES.mainRateLimit / divisor

  if (profit <= 0) return { tax: 0, effectiveRate: 0, band: 'No profit' }

  let tax = 0
  let band = ''

  if (profit <= lowerLimit) {
    tax = profit * CT_RATES.smallProfitsRate
    band = '19% Small Profits Rate'
  } else if (profit >= upperLimit) {
    tax = profit * CT_RATES.mainRate
    band = '25% Main Rate'
  } else {
    // Marginal Relief
    const mainRateTax = profit * CT_RATES.mainRate
    const marginalRelief = CT_RATES.marginalReliefFraction * (upperLimit - profit)
    tax = mainRateTax - marginalRelief
    band = 'Marginal Relief (19%–25%)'
  }

  return {
    tax: Math.round(tax),
    effectiveRate: profit > 0 ? ((tax / profit) * 100).toFixed(2) : '0.00',
    band,
    lowerLimit,
    upperLimit,
  }
}

export default function CorporationTaxCalc() {
  const [profit, setProfit] = useState('')
  const [associated, setAssociated] = useState('0')
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + Math.round(n).toLocaleString()

  const calculate = () => {
    const p = parseFloat(profit) || 0
    const a = parseInt(associated) || 0
    if (p <= 0) return
    const res = calcCorpTax(p, a)
    setResult({ ...res, profit: p, associated: a, afterTax: p - res.tax })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          UK Corporation Tax Calculator 2026/27
        </h2>
        <p className="text-sm text-gray-500">
          Estimate your Corporation Tax liability including Marginal Relief for profits between £50,000 and £250,000.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ 2026/27 rates — 19% small profits | 25% main rate | Marginal Relief
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Annual Taxable Profit
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Profit before Corporation Tax (after allowable expenses and capital allowances)
          </p>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={profit} onChange={e => setProfit(e.target.value)}
              placeholder="e.g. 80,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Associated Companies <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <p className="text-xs text-gray-400 mb-1">
            Number of other companies under common control — divides the rate limits
          </p>
          <input type="number" min="0" value={associated} onChange={e => setAssociated(e.target.value)}
            placeholder="0"
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Corporation Tax
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">Estimated Corporation Tax</p>
                <p className="text-4xl font-black text-indigo-700">{fmt(result.tax)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {result.band} · Effective rate {result.effectiveRate}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">After-Tax Profit</p>
                <p className="text-xl font-bold text-green-600">{fmt(result.afterTax)}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Breakdown</p>
            <div className="flex justify-between">
              <span className="text-gray-500">Taxable profit</span>
              <span className="font-semibold">{fmt(result.profit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Rate band</span>
              <span className="font-semibold">{result.band}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Corporation Tax</span>
              <span className="font-semibold text-red-500">- {fmt(result.tax)}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
              <span>After-tax profit</span>
              <span>{fmt(result.afterTax)}</span>
            </div>
          </div>

          {result.associated > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
              <p className="font-bold mb-1">ℹ️ Associated Companies Applied</p>
              <p>With {result.associated} associated {result.associated === 1 ? 'company' : 'companies'}, rate limits are divided by {result.associated + 1}:</p>
              <p>• Small profits limit: {fmt(result.lowerLimit)}</p>
              <p>• Main rate limit: {fmt(result.upperLimit)}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-600">
            <p className="font-semibold text-gray-700 mb-2">2026/27 Corporation Tax Bands</p>
            {[
              ['Up to £50,000', '19%', 'Small Profits Rate'],
              ['£50,001 – £249,999', '19–25%', 'Marginal Relief applies'],
              ['£250,000+', '25%', 'Main Rate'],
            ].map(([band, rate, note], i) => (
              <div key={i} className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="w-32">{band}</span>
                <span className="font-bold text-indigo-600 w-12">{rate}</span>
                <span className="text-gray-400">{note}</span>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ Corporation Tax 2026/27 Key Facts</p>
            <p>• Small profits rate (19%): profits up to £50,000</p>
            <p>• Main rate (25%): profits above £250,000</p>
            <p>• Marginal Relief: smooths the transition between 19% and 25%</p>
            <p>• Associated companies: limits are divided among all related companies</p>
            <p>• Payment due 9 months and 1 day after your accounting period ends</p>
            <p>• Large companies (profits £1.5m+): quarterly instalment payments required</p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How Is UK Corporation Tax Calculated?
          </h2>
          <p className="leading-relaxed">
            UK Corporation Tax is paid by limited companies on their taxable profits. From April 2023,
            the rate depends on your profit level. Small companies with profits up to £50,000 pay 19%,
            while companies with profits above £250,000 pay 25%. Between these thresholds, Marginal
            Relief reduces the effective rate gradually from 25% toward 19%.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Marginal Relief Explained</h2>
          <p className="leading-relaxed">
            Marginal Relief prevents a cliff-edge jump from 19% to 25% for profits between £50,000
            and £250,000. It is calculated as: 3/200 × (£250,000 − your profit). This means a company
            with £150,000 profit pays an effective rate of about 22.5% — not a sudden jump to 25%.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'When do I pay Corporation Tax?',
                a: 'Corporation Tax is generally due 9 months and 1 day after the end of your accounting period. For example, if your year ends 31 March 2026, payment is due 1 January 2027. Large companies with profits above £1.5 million must pay in quarterly instalments.',
              },
              {
                q: 'What counts as taxable profit?',
                a: 'Taxable profit is your company\'s income minus allowable business expenses, capital allowances, and any available reliefs such as R&D tax credits. It is not the same as your accounting profit — certain items (like depreciation) are not allowable for tax.',
              },
              {
                q: 'What is an associated company?',
                a: 'An associated company is another company under common control — for example, if you own two companies, each is associated with the other. Associated companies cause the £50,000 and £250,000 profit limits to be divided equally, which can push you into a higher rate band sooner.',
              },
              {
                q: 'Do I need to file a Corporation Tax return if I make a loss?',
                a: 'Yes. You must file a Company Tax Return (CT600) even if you make a loss or owe no Corporation Tax. The deadline for filing is 12 months after the end of your accounting period. Losses can often be carried forward to offset future profits.',
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
          <a href="https://www.gov.uk/corporation-tax-rates" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Corporation Tax rates</a>
          <a href="https://www.gov.uk/guidance/marginal-relief-for-corporation-tax" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Marginal Relief guidance</a>
        </div>
      </div>
    </div>
  )
}