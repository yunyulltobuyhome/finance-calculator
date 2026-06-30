import { useState } from 'react'

const RATES = [
  { label: 'Standard 20%', value: 0.20 },
  { label: 'Reduced 5%', value: 0.05 },
  { label: 'Zero 0%', value: 0 },
]

export default function VATCalc() {
  const [amount, setAmount] = useState('')
  const [rate, setRate] = useState(0.20)
  const [mode, setMode] = useState('add') // 'add' = amount is net, 'remove' = amount is gross
  const [result, setResult] = useState(null)

  const fmt = (n) => '£' + (Math.round(n * 100) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const a = parseFloat(amount)
    if (isNaN(a) || a < 0) return
    let net, vat, gross
    if (mode === 'add') {
      net = a
      vat = a * rate
      gross = a + vat
    } else {
      gross = a
      net = a / (1 + rate)
      vat = gross - net
    }
    setResult({ net, vat, gross, ratePct: Math.round(rate * 100) })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">UK VAT Calculator 2026</h2>
        <p className="text-sm text-gray-500">Add VAT to a net price or work out the VAT in a gross (VAT-inclusive) price.</p>
        <p className="text-xs text-gray-400 mt-1">✓ Standard 20% · Reduced 5% · Zero 0% — UK rates</p>
      </div>

      <div className="space-y-4">
        {/* Mode toggle */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { key: 'add', label: 'Add VAT', sub: 'price excludes VAT' },
            { key: 'remove', label: 'Remove VAT', sub: 'price includes VAT' },
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key)}
              className={`px-3 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                mode === m.key ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}>
              {m.label}
              <span className={`block text-xs font-normal mt-0.5 ${mode === m.key ? 'text-indigo-100' : 'text-gray-400'}`}>{m.sub}</span>
            </button>
          ))}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            {mode === 'add' ? 'Net amount (excluding VAT)' : 'Gross amount (including VAT)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">£</span>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="e.g. 1,000"
              className="w-full pl-7 pr-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">VAT rate</label>
          <div className="grid grid-cols-3 gap-2">
            {RATES.map(r => (
              <button key={r.value} onClick={() => setRate(r.value)}
                className={`px-2 py-2 rounded-lg text-xs font-medium border transition-all ${
                  rate === r.value ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate VAT
      </button>

      {result && (
        <div className="mt-6 space-y-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-indigo-600 font-semibold mb-1">
              {mode === 'add' ? 'Gross price (with VAT)' : 'Net price (without VAT)'}
            </p>
            <p className="text-3xl font-black text-indigo-700">
              {mode === 'add' ? fmt(result.gross) : fmt(result.net)}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Net', val: fmt(result.net) },
              { label: `VAT (${result.ratePct}%)`, val: fmt(result.vat) },
              { label: 'Gross', val: fmt(result.gross) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-800">{val}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How to Work Out VAT</h2>
          <p className="leading-relaxed">
            VAT (Value Added Tax) in the UK is charged at a standard rate of 20%. To <strong>add VAT</strong> to a
            net price, multiply it by 1.20. To <strong>remove VAT</strong> from a VAT-inclusive (gross) price,
            divide by 1.20 — not subtract 20%, which is a common mistake. For example, £120 including 20% VAT
            contains £20 of VAT (£120 ÷ 1.2 = £100 net), not £24.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">UK VAT Rates 2026</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">%</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Applies to (examples)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Standard', '20%', 'Most goods and services'],
                  ['Reduced', '5%', 'Domestic energy, children\'s car seats, some home improvements'],
                  ['Zero', '0%', 'Most food, books, newspapers, children\'s clothing'],
                  ['Exempt', '—', 'Insurance, postage stamps, financial & property transactions'],
                ].map(([name, pct, ex], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{name}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{pct}</td>
                    <td className="p-2 border border-gray-200">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Always check the current rate and category for your goods on GOV.UK.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How do I remove VAT from a price?', a: 'Divide the VAT-inclusive (gross) price by 1.20 for the standard 20% rate to get the net price. The difference between the gross and net is the VAT. For the 5% rate, divide by 1.05.' },
              { q: 'How much VAT is in £100?', a: 'If £100 already includes 20% VAT, the VAT element is £16.67 (£100 ÷ 1.2 = £83.33 net, so £16.67 VAT). If you are adding 20% VAT to a £100 net price, the VAT is £20 and the total is £120.' },
              { q: 'What is the VAT registration threshold?', a: 'A business must register for VAT once its VAT-taxable turnover exceeds the registration threshold (£90,000 as of 2024, the latest confirmed figure). You can also register voluntarily below the threshold to reclaim VAT on purchases.' },
              { q: 'Is VAT the same as sales tax?', a: 'They are similar consumer taxes but VAT is collected at each stage of the supply chain, with businesses reclaiming VAT on their inputs, whereas US-style sales tax is charged only at the final sale.' },
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
