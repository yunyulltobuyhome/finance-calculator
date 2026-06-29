import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// ===== 2026/27 tax logic =====
const UK = {
  personalAllowance: 12570,
  basicLimit: 50270,
  higherLimit: 125140,
  basic: 0.20, higher: 0.40, additional: 0.45,
  niPrimary: 12570, niUpper: 50270, niMain: 0.08, niUpper2: 0.02,
}
const US = {
  standardDeduction: 16100,
  brackets: [
    [0, 0.10], [11925, 0.12], [48475, 0.22], [103350, 0.24],
    [197300, 0.32], [250525, 0.35], [626350, 0.37],
  ],
  ss: 0.062, ssCap: 184500, medicare: 0.0145,
}

function calcUK(salary) {
  let pa = UK.personalAllowance
  if (salary > 100000) pa = Math.max(0, pa - Math.floor((salary - 100000) / 2))
  const taxable = Math.max(0, salary - pa)
  let tax = 0
  tax += Math.min(taxable, Math.max(0, UK.basicLimit - pa)) * UK.basic
  if (taxable > UK.basicLimit - pa) tax += Math.min(taxable - (UK.basicLimit - pa), UK.higherLimit - UK.basicLimit) * UK.higher
  if (taxable > UK.higherLimit - pa) tax += (taxable - (UK.higherLimit - pa)) * UK.additional
  let ni = 0
  if (salary > UK.niPrimary) {
    ni += Math.min(salary, UK.niUpper) - UK.niPrimary
    ni = ni * UK.niMain
    if (salary > UK.niUpper) ni += (salary - UK.niUpper) * UK.niUpper2
  }
  tax = Math.round(tax); ni = Math.round(ni)
  const net = salary - tax - ni
  return { tax, ni, net, gross: salary }
}

function calcUS(salary) {
  const taxable = Math.max(0, salary - US.standardDeduction)
  let tax = 0
  for (let i = US.brackets.length - 1; i >= 0; i--) {
    const [threshold, rate] = US.brackets[i]
    if (taxable > threshold) { tax += (taxable - threshold) * rate; break }
  }
  // progressive proper calc
  tax = 0
  for (let i = 0; i < US.brackets.length; i++) {
    const [threshold, rate] = US.brackets[i]
    const next = US.brackets[i + 1]?.[0] ?? Infinity
    if (taxable > threshold) tax += (Math.min(taxable, next) - threshold) * rate
  }
  const ss = Math.min(salary, US.ssCap) * US.ss
  const medicare = salary * US.medicare
  tax = Math.round(tax)
  const fica = Math.round(ss + medicare)
  const net = salary - tax - fica
  return { tax, fica, net, gross: salary, ss: Math.round(ss), medicare: Math.round(medicare) }
}

// ===== Popular amounts =====
const UK_AMOUNTS = [15000, 20000, 25000, 28000, 30000, 32000, 35000, 38000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 90000, 100000, 120000, 150000]
const US_AMOUNTS = [30000, 40000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 100000, 110000, 120000, 130000, 150000, 175000, 200000]

export const SALARY_SLUGS = [
  ...UK_AMOUNTS.map(a => `${a}-after-tax-uk`),
  ...US_AMOUNTS.map(a => `${a}-after-tax-us`),
]

const fmtGBP = (n) => '£' + Math.round(n).toLocaleString()
const fmtUSD = (n) => '$' + Math.round(n).toLocaleString()

export default function SalaryLanding() {
  const { slug } = useParams()
  const match = slug?.match(/^(\d+)-after-tax-(uk|us)$/)
  if (!match) return <Navigate to="/salary" replace />

  const amount = parseInt(match[1])
  const country = match[2]
  const fmt = country === 'uk' ? fmtGBP : fmtUSD
  const r = country === 'uk' ? calcUK(amount) : calcUS(amount)

  const countryName = country === 'uk' ? 'UK' : 'US'
  const symbol = country === 'uk' ? '£' : '$'
  const title = `${symbol}${amount.toLocaleString()} After Tax ${countryName} (2026/27) — Take-Home Pay | JoinCalc`
  const description = `${symbol}${amount.toLocaleString()} salary after tax in the ${countryName}: take-home pay is ${fmt(r.net)}/year (${fmt(r.net / 12)}/month). Full 2026/27 breakdown of income tax${country === 'uk' ? ' and National Insurance' : ', Social Security and Medicare'}.`
  const canonical = `https://joincalc.com/salary/${slug}`

  const related = (country === 'uk' ? UK_AMOUNTS : US_AMOUNTS)
    .filter(a => a !== amount)
    .map(a => ({ a, diff: Math.abs(a - amount) }))
    .sort((x, y) => x.diff - y.diff)
    .slice(0, 6)
    .map(x => x.a)
    .sort((a, b) => a - b)

  const monthly = r.net / 12
  const weekly = r.net / 52
  const effectiveRate = ((amount - r.net) / amount * 100).toFixed(1)

  const schemaFAQ = {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": `How much is ${symbol}${amount.toLocaleString()} after tax in the ${countryName}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `${symbol}${amount.toLocaleString()} a year after tax in the ${countryName} is ${fmt(r.net)} per year, or about ${fmt(monthly)} per month, for the 2026/27 tax year.` } },
    ]
  }
  const schemaBreadcrumb = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://joincalc.com" },
      { "@type": "ListItem", "position": 2, "name": "Salary Calculator", "item": "https://joincalc.com/salary" },
      { "@type": "ListItem", "position": 3, "name": `${symbol}${amount.toLocaleString()} After Tax`, "item": canonical },
    ]
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
          <Link to="/salary" className="hover:text-indigo-500">Salary Calculator</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{symbol}{amount.toLocaleString()} After Tax</span>
        </nav>

        <h1 className="text-2xl font-black text-gray-800 mb-2">
          {symbol}{amount.toLocaleString()} After Tax {countryName} (2026/27)
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          If you earn {fmt(amount)} a year in the {countryName}, here's your estimated take-home pay
          after {country === 'uk' ? 'Income Tax and National Insurance' : 'federal income tax, Social Security and Medicare'} for the 2026/27 tax year.
        </p>

        {/* Main result */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-4">
          <p className="text-sm text-indigo-600 font-semibold mb-1">Estimated Take-Home Pay</p>
          <p className="text-4xl font-black text-indigo-700">{fmt(r.net)}<span className="text-lg text-gray-400 font-normal">/year</span></p>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[['Monthly', monthly], ['Weekly', weekly], ['Effective Rate', null]].map(([label, val], i) => (
              <div key={i} className="bg-white rounded-lg p-3 text-center">
                <p className="text-xs text-gray-400">{label}</p>
                <p className="font-bold text-gray-800 mt-0.5">{val !== null ? fmt(val) : effectiveRate + '%'}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Full Breakdown</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Gross salary</span><span className="font-semibold">{fmt(amount)}</span></div>
            {country === 'uk' ? (
              <>
                <div className="flex justify-between"><span className="text-gray-500">Income Tax</span><span className="font-semibold text-red-500">- {fmt(r.tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">National Insurance</span><span className="font-semibold text-red-500">- {fmt(r.ni)}</span></div>
              </>
            ) : (
              <>
                <div className="flex justify-between"><span className="text-gray-500">Federal Income Tax</span><span className="font-semibold text-red-500">- {fmt(r.tax)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Social Security</span><span className="font-semibold text-red-500">- {fmt(r.ss)}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Medicare</span><span className="font-semibold text-red-500">- {fmt(r.medicare)}</span></div>
              </>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
              <span>Take-home pay</span><span>{fmt(r.net)}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Based on {country === 'uk' ? '2026/27 HMRC rates (standard tax code, no student loan or pension)' : '2026 IRS rates (single filer, standard deduction, no state tax)'}.
          </p>
        </div>

        {/* CTA to full calculator */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-6">
          <p className="font-bold text-indigo-800 mb-1">Want a Custom Calculation?</p>
          <p className="text-indigo-700 text-xs mb-3">
            Add student loan, pension, or a different filing status with our full salary calculator.
          </p>
          <Link to="/salary" className="inline-block bg-indigo-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
            Open Salary Calculator →
          </Link>
        </div>

        {/* Related amounts — internal linking for SEO */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-4">
          <h2 className="text-base font-bold text-gray-800 mb-3">Nearby Salaries</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {related.map(a => (
              <Link key={a} to={`/salary/${a}-after-tax-${country}`}
                className="text-sm text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-2 text-center">
                {symbol}{a.toLocaleString()} after tax
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-700 mb-1">How much is {symbol}{amount.toLocaleString()} after tax in the {countryName}?</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                {symbol}{amount.toLocaleString()} a year after tax in the {countryName} is approximately {fmt(r.net)} per year,
                or about {fmt(monthly)} per month and {fmt(weekly)} per week, for the 2026/27 tax year.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-700 mb-1">What is the effective tax rate on {symbol}{amount.toLocaleString()}?</p>
              <p className="text-gray-600 text-xs leading-relaxed">
                The effective tax rate (total deductions as a percentage of gross salary) on {fmt(amount)} is
                approximately {effectiveRate}%. This includes {country === 'uk' ? 'Income Tax and National Insurance' : 'federal income tax, Social Security and Medicare'}.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs text-amber-800 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> These are estimates for the 2026/27 tax year based on standard
            assumptions and do not constitute financial or tax advice. Your actual take-home pay may vary
            based on your tax code, pension, student loan, {country === 'us' ? 'state tax, ' : ''}and other factors.
            Always verify with official sources ({country === 'uk' ? 'HMRC' : 'IRS'}).
          </p>
        </div>
      </div>
    </div>
  )
}