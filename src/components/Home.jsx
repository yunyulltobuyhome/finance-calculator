import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GUIDES } from '../content/guides'

const CATEGORIES = [
  {
    title: 'UK Tax Calculators',
    color: 'bg-indigo-600',
    items: [
      { label: 'Stamp Duty Calculator', desc: 'SDLT for buyers, movers & investors', path: '/stamp-duty' },
      { label: 'National Insurance', desc: 'Class 1 employee NI 2026/27', path: '/national-insurance' },
      { label: 'Self-Employed Tax', desc: 'Sole trader & freelancer, Class 4 NI', path: '/self-employed' },
      { label: 'Corporation Tax', desc: 'Company tax + Marginal Relief 2026/27', path: '/corporation-tax' },
      { label: 'VAT Calculator', desc: 'Add or remove UK VAT (20% / 5%)', path: '/vat' },
      { label: 'Capital Gains Tax', desc: 'UK CGT — shares, property, crypto', path: '/capital-gains' },
      { label: 'Inheritance Tax', desc: 'Nil-rate band, RNRB & the 36% rate', path: '/inheritance-tax' },
    ],
  },
  {
    title: 'UK Pay & Employment',
    color: 'bg-indigo-700',
    items: [
      { label: 'Salary & Take-Home Pay', desc: 'Income tax, NI, pension & student loan', path: '/salary' },
      { label: 'Pay Rise Calculator', desc: 'How much of a rise you actually keep', path: '/pay-rise' },
      { label: 'Student Loan', desc: 'Repayments — Plans 1, 2, 4, 5 & PG', path: '/student-loan' },
      { label: 'Redundancy Pay', desc: 'Statutory entitlement & the £30k rule', path: '/redundancy' },
      { label: 'Holiday Entitlement', desc: '5.6 weeks for any working pattern', path: '/holiday' },
      { label: 'Pension Credit', desc: 'Guarantee & Savings Credit 2026/27', path: '/pension-credit' },
      { label: 'Hourly to Salary', desc: 'Convert an hourly rate to annual pay', path: '/hourly-to-salary' },
    ],
  },
  {
    title: 'Property & Mortgages',
    color: 'bg-indigo-600',
    items: [
      { label: 'Mortgage Affordability', desc: 'What you can borrow — and afford', path: '/mortgage' },
      { label: 'Buy vs Rent', desc: 'Should you buy or keep renting?', path: '/buy-vs-rent' },
      { label: 'Mortgage Refinance', desc: 'Savings & break-even point', path: '/refinance' },
    ],
  },
  {
    title: 'Loans & Debt',
    color: 'bg-indigo-700',
    items: [
      { label: 'Credit Card Payoff', desc: 'Months to clear + interest saved', path: '/credit-card-payoff' },
      { label: 'Debt Consolidation', desc: 'One loan vs your cards — who wins?', path: '/debt-consolidation' },
      { label: 'Auto Loan', desc: 'Monthly car payment & total cost', path: '/auto-loan' },
      { label: 'Loan Calculator', desc: 'Monthly payments & amortisation', path: '/loan' },
    ],
  },
  {
    title: 'Investing & Retirement',
    color: 'bg-indigo-600',
    items: [
      { label: 'Compound Interest', desc: 'Watch your money grow', path: '/compound' },
      { label: 'FIRE Calculator', desc: 'When could you retire early?', path: '/fire' },
      { label: 'Pension & 401k', desc: 'Project your retirement pot', path: '/retirement' },
      { label: 'Dividend Income', desc: 'Income from dividends, after tax', path: '/dividend' },
    ],
  },
  {
    title: 'US Tools',
    color: 'bg-indigo-800',
    items: [
      { label: 'State Tax Comparison', desc: 'Same salary across 7 US states', path: '/state-tax-comparison' },
      { label: 'Social Security', desc: 'Benefit estimate — claiming ages 62–70', path: '/social-security' },
      { label: 'Roth vs Traditional IRA', desc: 'Compare IRA options for 2026', path: '/roth-ira' },
    ],
  },
]

const ALL_CALCS = CATEGORIES.flatMap(c => c.items)

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') || '')
  const ql = q.trim().toLowerCase()

  const onSearch = (value) => {
    setQ(value)
    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set('q', value.trim()); else next.delete('q')
    setSearchParams(next, { replace: true })
  }

  const calcMatches = ql ? ALL_CALCS.filter(i => `${i.label} ${i.desc} ${i.path}`.toLowerCase().includes(ql)) : []
  const guideMatches = ql ? GUIDES.filter(g => `${g.h1} ${g.description} ${g.keywords}`.toLowerCase().includes(ql)) : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-2">UK Tax &amp; Money Calculators 2026/27</h1>
        <p className="text-gray-500 text-sm mb-3">
          Stamp duty, National Insurance, take-home pay, VAT, capital gains and more — built on the 2026/27
          rates published by HMRC and GOV.UK, and checked against them. Free, no sign-up, and every calculation
          runs in your browser, so your numbers are never sent anywhere. US, Canadian and Australian tools are
          included where the same calculator supports them.
        </p>
        {/* What separates this from the dozens of other calculator sites, stated
            up front and linked so it can be checked rather than just claimed. */}
        <div className="flex flex-wrap gap-2">
          <Link to="/methodology"
            className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
            <span className="font-medium">Published methodology</span>
          </Link>
          <Link to="/tax-cliffs"
            className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
            <span className="font-medium">Original analysis</span>
          </Link>
          <Link to="/about"
            className="inline-flex items-center gap-1.5 text-xs bg-white border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
            <span className="font-medium">Who runs this site</span>
          </Link>
        </div>
      </div>

      {/* Search — find a calculator or guide */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </span>
        <input
          type="search"
          value={q}
          onChange={e => onSearch(e.target.value)}
          placeholder="Search calculators & guides — e.g. stamp duty, VAT, pay rise…"
          aria-label="Search calculators and guides"
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      {ql ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {calcMatches.length + guideMatches.length} result{calcMatches.length + guideMatches.length === 1 ? '' : 's'} for “{q.trim()}”
          </p>
          {calcMatches.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden mb-6">
              {calcMatches.map(item => (
                <Link key={item.path} to={item.path} className="bg-white hover:bg-indigo-50 transition-colors p-4 group">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">{item.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {guideMatches.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-2 mb-6">
              {guideMatches.map(g => (
                <Link key={g.slug} to={`/guides/${g.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{g.h1}</p>
                  <p className="text-xs text-gray-400 mt-1">{g.readMins} min read</p>
                </Link>
              ))}
            </div>
          )}
          {calcMatches.length === 0 && guideMatches.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-sm">No calculators or guides match “{q.trim()}”.</p>
              <button onClick={() => onSearch('')} className="text-sm text-indigo-600 font-semibold hover:underline mt-2">
                Clear search
              </button>
            </div>
          )}
        </div>
      ) : (
      <>
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <div className={`${cat.color} text-white px-4 py-2 rounded-t-xl text-sm font-bold`}>
              {cat.title}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-b-xl overflow-hidden">
              {cat.items.map((item) => (
                <Link key={item.path} to={item.path}
                  className="bg-white hover:bg-indigo-50 transition-colors p-4 group">
                  <div className="flex items-start gap-3">
                    <div>
                      <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">
                        {item.label}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Link>
              ))}
              {cat.items.length % 3 !== 0 && Array.from({ length: 3 - (cat.items.length % 3) }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-gray-50" />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-700">📚 Money Guides</h2>
          <Link to="/guides" className="text-xs font-medium text-indigo-600 hover:underline">View all →</Link>
        </div>
        <p className="text-xs text-gray-400 mb-3">
          New to UK tax? These plain-English guides explain how it works — each with a free calculator inside.
        </p>
        <div className="grid sm:grid-cols-2 gap-2">
          {GUIDES.map((g) => (
            <Link key={g.slug} to={`/guides/${g.slug}`}
              className="block bg-white border border-gray-200 rounded-xl p-3 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
              <p className="text-sm font-semibold text-gray-800 leading-tight">{g.h1}</p>
              <p className="text-xs text-gray-400 mt-1">{g.readMins} min read</p>
            </Link>
          ))}
        </div>
      </div>
      </>
      )}

      <div className="mt-10 space-y-4 text-sm text-gray-500 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-gray-700">About JoinCalc</h2>
        <p className="leading-relaxed">
          JoinCalc provides free financial calculators for individuals in the US, UK, Canada, and Australia.
          All calculators are updated for 2026 tax rates and use official government sources including the IRS, HMRC, ATO, and CRA.
          No account required — all calculations happen instantly in your browser.
        </p>
        <div className="grid grid-cols-2 gap-3 text-xs">
          {[
            { text: 'Updated for 2026 tax rates' },
            { text: 'US, UK, Canada & Australia' },
            { text: 'No sign-up required' },
            { text: 'All calculations in your browser' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500">
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}