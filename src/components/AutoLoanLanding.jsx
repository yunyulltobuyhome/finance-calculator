import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { autoLoanPayment } from './AutoLoanCalc'

const APRS = [4, 5, 6, 7, 8, 9]
const TERMS = [48, 60, 72]
export const AUTO_LOAN_AMOUNTS = [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000, 75000]

const fmt = (n) => '$' + Math.round(n).toLocaleString()

export default function AutoLoanLanding() {
  const { slug } = useParams()
  if (!/^\d+$/.test(slug || '')) return <Navigate to="/auto-loan" replace />
  const amount = parseInt(slug, 10)
  if (amount < 1000 || amount > 5000000) return <Navigate to="/auto-loan" replace />

  const headline = autoLoanPayment(amount, 7, 60)
  const canonical = `https://joincalc.com/auto-loan/${amount}`
  const title = `${fmt(amount)} Car Loan Payment (2026) — Monthly Cost | JoinCalc`
  const description = `Monthly payment on a ${fmt(amount)} car loan: about ${fmt(headline)}/month at 7% APR over 60 months. See the full table of monthly payments by APR and term.`

  const related = AUTO_LOAN_AMOUNTS.filter(a => a !== amount)
    .map(a => ({ a, d: Math.abs(a - amount) })).sort((x, y) => x.d - y.d).slice(0, 6).map(x => x.a).sort((a, b) => a - b)

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [{ '@type': 'Question', name: `What is the monthly payment on a ${fmt(amount)} car loan?`,
      acceptedAnswer: { '@type': 'Answer', text: `A ${fmt(amount)} auto loan costs roughly ${fmt(headline)} a month at a 7% APR over 60 months. The exact payment depends on your rate and term.` } }],
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Auto Loan Calculator', item: 'https://joincalc.com/auto-loan' },
      { '@type': 'ListItem', position: 3, name: `${fmt(amount)} car loan`, item: canonical },
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
          <Link to="/auto-loan" className="hover:text-indigo-500">Auto Loan Calculator</Link><span className="mx-2">›</span>
          <span className="text-gray-600">{fmt(amount)} car loan</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">{fmt(amount)} Car Loan Payment</h1>
        <p className="text-sm text-gray-500 mb-6">Estimated monthly payments on a {fmt(amount)} auto loan across a range of APRs and terms.</p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-4">
          <p className="text-sm text-indigo-600 font-semibold mb-1">Typical monthly payment</p>
          <p className="text-4xl font-black text-indigo-700">{fmt(headline)}<span className="text-lg text-gray-400 font-normal">/mo</span></p>
          <p className="text-xs text-gray-500 mt-1">at 7% APR over 60 months</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Monthly Payment by APR &amp; Term</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">APR</th>
                {TERMS.map(t => <th key={t} className="text-left p-2 border border-gray-200 font-semibold">{t} mo</th>)}
              </tr></thead>
              <tbody>
                {APRS.map((apr, i) => (
                  <tr key={apr} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{apr}%</td>
                    {TERMS.map(t => <td key={t} className="p-2 border border-gray-200 text-indigo-600 font-semibold">{fmt(autoLoanPayment(amount, apr, t))}/mo</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">{fmt(amount)} financed, excluding tax and fees.</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Want your exact payment?</p>
          <p className="text-indigo-700 text-xs mb-3">Add your down payment, trade-in and sales tax for a precise figure.</p>
          <Link to="/auto-loan" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">Open the Auto Loan Calculator →</Link>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Payments on Nearby Amounts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(a => (
              <Link key={a} to={`/auto-loan/${a}`} className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">{fmt(a)} loan</Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">⚠️ <strong>Disclaimer:</strong> Illustrative estimates only, excluding taxes, fees and add-ons, and not a finance offer. Your actual payment depends on your credit, lender and term.</p>
        </div>
      </div>
    </div>
  )
}
