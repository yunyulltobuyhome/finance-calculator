import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// 2026 SDLT bands (England & Northern Ireland) — mirrors StampDutyCalc.
const STANDARD = [
  { min: 0, max: 125000, rate: 0 },
  { min: 125000, max: 250000, rate: 0.02 },
  { min: 250000, max: 925000, rate: 0.05 },
  { min: 925000, max: 1500000, rate: 0.10 },
  { min: 1500000, max: Infinity, rate: 0.12 },
]
const FIRST_TIME = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300000, max: 500000, rate: 0.05 },
]
const ADDITIONAL = [
  { min: 0, max: 125000, rate: 0.05 },
  { min: 125000, max: 250000, rate: 0.07 },
  { min: 250000, max: 925000, rate: 0.10 },
  { min: 925000, max: 1500000, rate: 0.15 },
  { min: 1500000, max: Infinity, rate: 0.17 },
]

function sumBands(price, bands) {
  let tax = 0
  const rows = []
  for (const b of bands) {
    if (price > b.min) {
      const slice = Math.min(price, b.max) - b.min
      const amt = slice * b.rate
      tax += amt
      if (b.rate > 0) rows.push({ band: b, slice, amt })
    }
  }
  return { tax: Math.round(tax), rows }
}

function firstTimeTax(price) {
  if (price <= 300000) return { tax: 0, rows: [] }
  if (price <= 500000) return sumBands(price, FIRST_TIME)
  return sumBands(price, STANDARD) // no relief above £500k
}

// Popular property prices for programmatic landing pages.
export const STAMP_DUTY_PRICES = [
  100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000,
  350000, 400000, 425000, 450000, 500000, 550000, 600000, 650000, 700000,
  750000, 800000, 850000, 900000, 950000, 1000000, 1250000, 1500000, 2000000,
]

const fmt = (n) => '£' + Math.round(n).toLocaleString()

export default function StampDutyLanding() {
  const { slug } = useParams()
  if (!/^\d+$/.test(slug || '')) return <Navigate to="/stamp-duty" replace />
  const price = parseInt(slug, 10)
  if (price < 1000 || price > 50000000) return <Navigate to="/stamp-duty" replace />

  const standard = sumBands(price, STANDARD)
  const firstTime = firstTimeTax(price)
  const additional = sumBands(price, ADDITIONAL)

  const canonical = `https://joincalc.com/stamp-duty/${price}`
  const title = `Stamp Duty on a ${fmt(price)} House (2026) — How Much Will I Pay? | JoinCalc`
  const description = `Stamp Duty (SDLT) on a ${fmt(price)} property in England & NI for 2026: ${fmt(standard.tax)} for home movers, ${fmt(firstTime.tax)} for first-time buyers, and ${fmt(additional.tax)} with the additional-property surcharge. Full band-by-band breakdown.`

  const related = STAMP_DUTY_PRICES
    .filter(p => p !== price)
    .map(p => ({ p, d: Math.abs(p - price) }))
    .sort((a, b) => a.d - b.d).slice(0, 6).map(x => x.p).sort((a, b) => a - b)

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `How much stamp duty do I pay on a ${fmt(price)} house?`,
        acceptedAnswer: { '@type': 'Answer', text: `For 2026, Stamp Duty Land Tax on a ${fmt(price)} property is ${fmt(standard.tax)} for a standard home mover, ${fmt(firstTime.tax)} for an eligible first-time buyer, and ${fmt(additional.tax)} if it is an additional property subject to the surcharge.` } },
    ],
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Stamp Duty Calculator', item: 'https://joincalc.com/stamp-duty' },
      { '@type': 'ListItem', position: 3, name: `${fmt(price)} House`, item: canonical },
    ],
  }

  const cards = [
    { label: 'Home mover', sub: 'standard rates', tax: standard.tax, highlight: true },
    { label: 'First-time buyer', sub: price > 500000 ? 'no relief above £500k' : 'first-time buyer relief', tax: firstTime.tax },
    { label: 'Additional property', sub: '+5% surcharge', tax: additional.tax },
  ]

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
          <Link to="/stamp-duty" className="hover:text-indigo-500">Stamp Duty Calculator</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{fmt(price)} House</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">Stamp Duty on a {fmt(price)} House</h1>
        <p className="text-sm text-gray-500 mb-6">
          Here's the Stamp Duty Land Tax (SDLT) you'd pay on a {fmt(price)} property in England or
          Northern Ireland for the 2026 tax year, depending on your buyer type.
        </p>

        <div className="grid sm:grid-cols-3 gap-3 mb-6">
          {cards.map(c => (
            <div key={c.label} className={`rounded-2xl p-4 border ${c.highlight ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200'}`}>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className={`text-2xl font-black ${c.highlight ? 'text-indigo-700' : 'text-gray-800'}`}>{fmt(c.tax)}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* Band breakdown for standard buyer */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">How it's worked out (home mover)</h2>
          {standard.rows.length === 0 ? (
            <p className="text-sm text-gray-500">No stamp duty is due — the price is within the 0% band (up to £125,000).</p>
          ) : (
            <div className="space-y-2 text-sm">
              {standard.rows.map((r, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500">
                    {fmt(r.band.min)}–{r.band.max === Infinity ? '+' : fmt(r.band.max)} at {Math.round(r.band.rate * 100)}%
                  </span>
                  <span className="font-semibold">{fmt(r.amt)}</span>
                </div>
              ))}
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-indigo-700">
                <span>Total SDLT</span><span>{fmt(standard.tax)}</span>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3">
            Effective rate: {((standard.tax / price) * 100).toFixed(2)}% of the purchase price.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Buying at a different price?</p>
          <p className="text-indigo-700 text-xs mb-3">Get an instant figure for any price, including Scotland (LBTT) and Wales (LTT) comparisons.</p>
          <Link to="/stamp-duty" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Open the Stamp Duty Calculator →
          </Link>
        </div>

        {/* Nearby prices */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Stamp Duty on Nearby Prices</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(p => (
              <Link key={p} to={`/stamp-duty/${p}`}
                className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">
                {fmt(p)} house
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> Estimates for SDLT in England & Northern Ireland for the 2026
            tax year based on standard rules. Your actual liability may differ (e.g. mixed-use property,
            reliefs, or non-resident surcharge). Scotland and Wales use different taxes. Always verify on
            GOV.UK and consult a conveyancer.
          </p>
        </div>
      </div>
    </div>
  )
}
