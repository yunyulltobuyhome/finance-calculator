import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// 2026 UK CGT — mirrors CapitalGainsCalc: £3,000 annual exempt amount,
// 18% basic-rate and 24% higher-rate on most assets.
const AEA = 3000
const BASIC = 0.18
const HIGHER = 0.24

export const CGT_GAINS = [5000, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 250000, 500000]

const fmt = (n) => '£' + Math.round(n).toLocaleString()

export default function CapitalGainsLanding() {
  const { slug } = useParams()
  if (!/^\d+$/.test(slug || '')) return <Navigate to="/capital-gains" replace />
  const gain = parseInt(slug, 10)
  if (gain < 100 || gain > 50000000) return <Navigate to="/capital-gains" replace />

  const taxable = Math.max(0, gain - AEA)
  const basicTax = Math.round(taxable * BASIC)
  const higherTax = Math.round(taxable * HIGHER)

  const canonical = `https://joincalc.com/capital-gains/${gain}`
  const title = `Capital Gains Tax on ${fmt(gain)} (UK 2026) — How Much Will I Pay? | JoinCalc`
  const description = `Capital Gains Tax on a ${fmt(gain)} gain in the UK for 2026: after the £3,000 allowance you'd pay ${fmt(basicTax)} as a basic-rate taxpayer (18%) or ${fmt(higherTax)} as a higher-rate taxpayer (24%).`

  const related = CGT_GAINS.filter(g => g !== gain)
    .map(g => ({ g, d: Math.abs(g - gain) }))
    .sort((a, b) => a.d - b.d).slice(0, 6).map(x => x.g).sort((a, b) => a - b)

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How much capital gains tax do I pay on a ${fmt(gain)} gain?`,
        acceptedAnswer: { '@type': 'Answer', text: `After deducting the £3,000 annual exempt amount, a ${fmt(gain)} gain leaves ${fmt(taxable)} taxable. That is ${fmt(basicTax)} at the 18% basic rate or ${fmt(higherTax)} at the 24% higher rate for 2026.` } },
    ],
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Capital Gains Tax Calculator', item: 'https://joincalc.com/capital-gains' },
      { '@type': 'ListItem', position: 3, name: `CGT on ${fmt(gain)}`, item: canonical },
    ],
  }

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow, max-snippet:-1" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
      </Helmet>

      <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
        <nav className="text-xs text-gray-400 mb-4">
          <Link to="/" className="hover:text-indigo-500">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/capital-gains" className="hover:text-indigo-500">Capital Gains Tax</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">CGT on {fmt(gain)}</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">Capital Gains Tax on a {fmt(gain)} Gain</h1>
        <p className="text-sm text-gray-500 mb-6">
          Here's the UK Capital Gains Tax (CGT) you'd pay on a {fmt(gain)} profit for the 2026 tax year,
          after the £3,000 annual exempt amount. The rate depends on whether you're a basic- or higher-rate taxpayer.
        </p>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4 border bg-white border-gray-200">
            <p className="text-xs text-gray-500">Basic-rate taxpayer</p>
            <p className="text-2xl font-black text-gray-800">{fmt(basicTax)}</p>
            <p className="text-xs text-gray-400 mt-0.5">18% on the taxable gain</p>
          </div>
          <div className="rounded-2xl p-4 border bg-indigo-50 border-indigo-200">
            <p className="text-xs text-gray-500">Higher-rate taxpayer</p>
            <p className="text-2xl font-black text-indigo-700">{fmt(higherTax)}</p>
            <p className="text-xs text-gray-400 mt-0.5">24% on the taxable gain</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">How it's worked out</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Total gain</span><span className="font-semibold">{fmt(gain)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Annual exempt amount</span><span className="font-semibold text-red-500">− {fmt(Math.min(gain, AEA))}</span></div>
            <div className="border-t border-gray-200 pt-2 flex justify-between"><span className="text-gray-500">Taxable gain</span><span className="font-semibold">{fmt(taxable)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CGT at 18% (basic rate)</span><span className="font-semibold">{fmt(basicTax)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CGT at 24% (higher rate)</span><span className="font-semibold">{fmt(higherTax)}</span></div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Your actual rate depends on your income: gains falling within the basic-rate band (up to £50,270)
            are taxed at 18% and the rest at 24%, so a single gain can be taxed partly at each rate.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Want it tailored to your income?</p>
          <p className="text-indigo-700 text-xs mb-3">Our calculator stacks the gain on your income to split it across the 18% and 24% bands, and covers US CGT too.</p>
          <Link to="/capital-gains" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Open the Capital Gains Tax Calculator →
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">CGT on Nearby Amounts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(g => (
              <Link key={g} to={`/capital-gains/${g}`}
                className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">
                CGT on {fmt(g)}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> Estimates for UK CGT in the 2026 tax year on most assets, assuming
            the full £3,000 allowance is available. Your actual bill depends on your income, other gains,
            losses and reliefs. Always verify on GOV.UK and consult a tax adviser.
          </p>
        </div>
      </div>
    </div>
  )
}
