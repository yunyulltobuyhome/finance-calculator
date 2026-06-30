import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { getGuide } from '../content/guides'

function ToolCTA({ tool }) {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 my-6">
      <p className="font-bold text-indigo-800 mb-1">{tool.cta}</p>
      <p className="text-indigo-700 text-xs mb-3">
        Skip the maths — get an instant, up-to-date figure with our free calculator.
      </p>
      <Link to={tool.path}
        className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
        Open the {tool.label} →
      </Link>
    </div>
  )
}

export default function ArticlePage() {
  const { slug } = useParams()
  const guide = getGuide(slug)
  if (!guide) return <Navigate to="/guides" replace />

  const canonical = `https://joincalc.com/guides/${guide.slug}`
  const related = (guide.related || []).map(getGuide).filter(Boolean)

  const schemaArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.h1,
    description: guide.description,
    image: 'https://joincalc.com/og-image.png',
    author: { '@type': 'Organization', name: 'JoinCalc' },
    publisher: {
      '@type': 'Organization',
      name: 'JoinCalc',
      logo: { '@type': 'ImageObject', url: 'https://joincalc.com/favicon.svg' },
    },
    mainEntityOfPage: canonical,
    dateModified: '2026-06-30',
  }
  const schemaFAQ = guide.faq?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  } : null
  const schemaBreadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: 'https://joincalc.com/guides' },
      { '@type': 'ListItem', position: 3, name: guide.h1, item: canonical },
    ],
  }

  return (
    <article className="max-w-2xl mx-auto px-4 md:px-8 py-6">
      <Helmet>
        <title>{guide.title}</title>
        <meta name="description" content={guide.description} />
        <meta name="keywords" content={guide.keywords} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={guide.title} />
        <meta property="og:description" content={guide.description} />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify(schemaArticle)}</script>
        {schemaFAQ && <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>}
        <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>
      </Helmet>

      <nav className="text-xs text-gray-400 mb-4">
        <Link to="/" className="hover:text-indigo-500">Home</Link>
        <span className="mx-2">›</span>
        <Link to="/guides" className="hover:text-indigo-500">Guides</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{guide.h1}</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-800 mb-2">{guide.h1}</h1>
      <p className="text-xs text-gray-400 mb-5">
        Updated {guide.updated} · {guide.readMins} min read · Free calculator inside
      </p>

      <p className="text-base text-gray-600 leading-relaxed mb-2">{guide.intro}</p>

      {/* Top-of-page funnel CTA — capture intent early */}
      <ToolCTA tool={guide.tool} />

      <div className="space-y-7">
        {guide.sections.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold text-gray-800 mb-2">{s.h2}</h2>
            {s.body?.map((p, j) => (
              <p key={j} className="text-sm text-gray-600 leading-relaxed mb-2">{p}</p>
            ))}
            {s.list && (
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 leading-relaxed">
                {s.list.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            )}
            {s.table && (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      {s.table.headers.map((h, j) => (
                        <th key={j} className="text-left p-2 border border-gray-200 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        {row.map((cell, k) => (
                          <td key={k} className={`p-2 border border-gray-200 ${k === 1 ? 'font-semibold text-indigo-600' : ''}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {s.table.note && <p className="text-xs text-gray-400 mt-2">{s.table.note}</p>}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* FAQ */}
      {guide.faq?.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {guide.faq.map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1 text-sm">{f.q}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom funnel CTA — convert readers who scrolled the whole way */}
      <ToolCTA tool={guide.tool} />

      {/* Related guides — internal linking + extra pageviews per session */}
      {related.length > 0 && (
        <div className="mt-8 border-t border-gray-100 pt-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Related Guides</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {related.map(r => (
              <Link key={r.slug} to={`/guides/${r.slug}`}
                className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                <p className="text-sm font-bold text-gray-800">{r.h1}</p>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{r.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-xs text-amber-800 leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> This guide is for general information only and does not
          constitute financial, tax, or legal advice. Rates and thresholds can change — always check
          the latest figures on GOV.UK and consult a qualified professional before making decisions.
        </p>
      </div>
    </article>
  )
}
