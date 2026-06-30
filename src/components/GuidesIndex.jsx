import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { GUIDES } from '../content/guides'

export default function GuidesIndex() {
  const schemaList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'JoinCalc Money Guides',
    url: 'https://joincalc.com/guides',
    numberOfItems: GUIDES.length,
    itemListElement: GUIDES.map((g, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: g.h1,
      url: `https://joincalc.com/guides/${g.slug}`,
    })),
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-6">
      <Helmet>
        <title>Money Guides — UK Tax & Finance Explained | JoinCalc</title>
        <meta name="description" content="Plain-English UK money guides on stamp duty, capital gains tax, National Insurance and redundancy pay — each with a free calculator to get your exact figure." />
        <meta name="keywords" content="uk tax guides, stamp duty explained, capital gains tax guide, national insurance explained, redundancy pay guide" />
        <link rel="canonical" href="https://joincalc.com/guides" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Money Guides — UK Tax & Finance Explained | JoinCalc" />
        <meta property="og:url" content="https://joincalc.com/guides" />
        <script type="application/ld+json">{JSON.stringify(schemaList)}</script>
      </Helmet>

      <h1 className="text-2xl font-black text-gray-800 mb-2">Money Guides</h1>
      <p className="text-sm text-gray-500 mb-6">
        Clear, jargon-free explanations of how UK tax and money rules actually work — updated for
        2026. Every guide links to a free calculator so you can turn the theory into your own numbers.
      </p>

      <div className="space-y-3">
        {GUIDES.map(g => (
          <Link key={g.slug} to={`/guides/${g.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
            <p className="text-base font-bold text-gray-800">{g.h1}</p>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{g.description}</p>
            <p className="text-xs text-indigo-500 mt-2 font-medium">
              {g.updated} · {g.readMins} min read · includes the {g.tool.label} →
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
