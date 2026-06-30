import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const RATES = [4, 4.5, 5, 5.5, 6]
const TERMS = [25, 30]

export const MORTGAGE_AMOUNTS = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 750000, 1000000]

function monthlyPayment(principal, annualRatePct, years) {
  const r = annualRatePct / 100 / 12
  const n = years * 12
  if (r === 0) return principal / n
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

const fmt0 = (n) => '£' + Math.round(n).toLocaleString()

export default function MortgageLanding() {
  const { slug } = useParams()
  if (!/^\d+$/.test(slug || '')) return <Navigate to="/mortgage" replace />
  const amount = parseInt(slug, 10)
  if (amount < 10000 || amount > 50000000) return <Navigate to="/mortgage" replace />

  const headline = monthlyPayment(amount, 5, 25) // 5% over 25 years
  const canonical = `https://joincalc.com/mortgage/${amount}`
  const title = `${fmt0(amount)} Mortgage Repayments (UK 2026) — Monthly Cost | JoinCalc`
  const description = `Monthly repayments on a ${fmt0(amount)} mortgage: about ${fmt0(headline)} a month over 25 years at 5%. See the full table of monthly payments across interest rates and terms.`

  const related = MORTGAGE_AMOUNTS.filter(a => a !== amount)
    .map(a => ({ a, d: Math.abs(a - amount) }))
    .sort((x, y) => x.d - y.d).slice(0, 6).map(x => x.a).sort((a, b) => a - b)

  const schemaFAQ = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `What are the monthly repayments on a ${fmt0(amount)} mortgage?`,
        acceptedAnswer: { '@type': 'Answer', text: `On a repayment basis, a ${fmt0(amount)} mortgage costs roughly ${fmt0(headline)} a month over 25 years at a 5% interest rate. The exact figure depends on your rate and term.` } },
    ],
  }
  const schemaBreadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://joincalc.com' },
      { '@type': 'ListItem', position: 2, name: 'Mortgage Calculator', item: 'https://joincalc.com/mortgage' },
      { '@type': 'ListItem', position: 3, name: `${fmt0(amount)} mortgage`, item: canonical },
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
          <Link to="/mortgage" className="hover:text-indigo-500">Mortgage Calculator</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{fmt0(amount)} mortgage</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">{fmt0(amount)} Mortgage Repayments</h1>
        <p className="text-sm text-gray-500 mb-6">
          Estimated monthly repayments on a {fmt0(amount)} repayment mortgage in the UK, across a range of
          interest rates and terms. Figures assume a capital-and-interest (repayment) mortgage.
        </p>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-4">
          <p className="text-sm text-indigo-600 font-semibold mb-1">Typical monthly repayment</p>
          <p className="text-4xl font-black text-indigo-700">{fmt0(headline)}<span className="text-lg text-gray-400 font-normal">/month</span></p>
          <p className="text-xs text-gray-500 mt-1">over 25 years at 5% interest</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Monthly Repayments by Rate &amp; Term</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Interest rate</th>
                  {TERMS.map(t => <th key={t} className="text-left p-2 border border-gray-200 font-semibold">{t}-year term</th>)}
                </tr>
              </thead>
              <tbody>
                {RATES.map((rate, i) => (
                  <tr key={rate} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{rate}%</td>
                    {TERMS.map(t => (
                      <td key={t} className="p-2 border border-gray-200 text-indigo-600 font-semibold">
                        {fmt0(monthlyPayment(amount, rate, t))}/mo
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Capital-and-interest repayment mortgage. Interest-only payments would be lower but never reduce the balance.</p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Want your exact figures?</p>
          <p className="text-indigo-700 text-xs mb-3">
            Use the Loan &amp; Repayment Calculator for any rate, term and overpayment — or check how much you
            could borrow with the affordability calculator.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/loan" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Loan &amp; Repayment Calculator →
            </Link>
            <Link to="/mortgage" className="inline-block bg-white text-indigo-700 border border-indigo-200 text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors">
              How much can I borrow?
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Repayments on Nearby Amounts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(a => (
              <Link key={a} to={`/mortgage/${a}`}
                className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">
                {fmt0(a)} mortgage
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> Illustrative repayment estimates only, not a mortgage offer. Actual
            payments depend on your lender, rate type, fees and term. Your home may be repossessed if you do not
            keep up repayments. Always seek regulated mortgage advice.
          </p>
        </div>
      </div>
    </div>
  )
}
