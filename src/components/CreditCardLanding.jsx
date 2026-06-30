import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { payoffFixed } from './CreditCardPayoffCalc'

const DEFAULT_APR = 22
const PAYMENTS = [100, 150, 200, 300, 400, 500]
export const CC_BALANCES = [1000, 2000, 3000, 4000, 5000, 7500, 10000, 15000, 20000, 25000]

const fmt = (n) => '$' + Math.round(n).toLocaleString()
const dur = (m) => `${Math.floor(m / 12)}y ${m % 12}m`

export default function CreditCardLanding() {
  const { slug } = useParams()
  if (!/^\d+$/.test(slug || '')) return <Navigate to="/credit-card-payoff" replace />
  const balance = parseInt(slug, 10)
  if (balance < 100 || balance > 1000000) return <Navigate to="/credit-card-payoff" replace />

  const rows = PAYMENTS.map(p => ({ p, r: payoffFixed(balance, DEFAULT_APR, p) }))
  const headline = rows.find(x => !x.r.never) || rows[rows.length - 1]
  const canonical = `https://joincalc.com/credit-card-payoff/${balance}`
  const title = `How Long to Pay Off ${fmt(balance)} in Credit Card Debt? | JoinCalc`
  const description = `Paying off ${fmt(balance)} of credit card debt at ${DEFAULT_APR}% APR: see the months and total interest for different monthly payments, and how to clear it faster.`

  const related = CC_BALANCES.filter(b => b !== balance)
    .map(b => ({ b, d: Math.abs(b - balance) })).sort((x, y) => x.d - y.d).slice(0, 6).map(x => x.b).sort((a, b) => a - b)

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name: `How long does it take to pay off ${fmt(balance)} in credit card debt?`,
      acceptedAnswer: { '@type': 'Answer', text: `At ${DEFAULT_APR}% APR, paying ${fmt(headline.p)} a month clears a ${fmt(balance)} balance in about ${headline.r.never ? 'never — the payment is below the interest' : dur(headline.r.months)}, with ${headline.r.never ? '' : fmt(headline.r.interest) + ' in interest'}. Paying more each month clears it faster.` } }],
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Credit Card Payoff Calculator', item: 'https://joincalc.com/credit-card-payoff' },
      { '@type': 'ListItem', position: 3, name: `Pay off ${fmt(balance)}`, item: canonical },
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
          <Link to="/" className="hover:text-indigo-500">Home</Link><span className="mx-2">›</span>
          <Link to="/credit-card-payoff" className="hover:text-indigo-500">Credit Card Payoff</Link><span className="mx-2">›</span>
          <span className="text-gray-600">Pay off {fmt(balance)}</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">How Long to Pay Off {fmt(balance)} in Credit Card Debt?</h1>
        <p className="text-sm text-gray-500 mb-6">Here's how long it takes to clear a {fmt(balance)} balance at {DEFAULT_APR}% APR, and the interest it costs, for different monthly payments.</p>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Payoff Time by Monthly Payment</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Monthly payment</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Time to clear</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Interest paid</th>
              </tr></thead>
              <tbody>
                {rows.map(({ p, r }, i) => (
                  <tr key={p} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">${p}/mo</td>
                    <td className="p-2 border border-gray-200">{r.never ? 'Never' : dur(r.months)}</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{r.never ? '—' : fmt(r.interest)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">At {DEFAULT_APR}% APR with no new spending. "Never" means the payment is below the monthly interest.</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Try your own numbers</p>
          <p className="text-indigo-700 text-xs mb-3">Use your real APR and payment, and see how much faster you'd be debt-free by paying extra.</p>
          <Link to="/credit-card-payoff" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Open the Credit Card Payoff Calculator →</Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Pay Off Other Balances</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(b => (
              <Link key={b} to={`/credit-card-payoff/${b}`} className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">Pay off {fmt(b)}</Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">⚠️ <strong>Disclaimer:</strong> Illustrative estimates at a 22% APR with no new charges. Your actual payoff depends on your APR, fees and spending. Not financial advice.</p>
        </div>
      </div>
    </div>
  )
}
