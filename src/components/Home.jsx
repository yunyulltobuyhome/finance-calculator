import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { GUIDES } from '../content/guides'

const CATEGORIES = [
  {
    title: '🏦 Tax Calculators',
    color: 'bg-indigo-600',
    items: [
      { label: 'Stamp Duty Calculator', desc: 'UK SDLT for buyers & investors', path: '/stamp-duty', icon: '🏛️' },
      { label: 'Capital Gains Tax', desc: 'US & UK CGT — stocks, property, crypto', path: '/capital-gains', icon: '📊' },
      { label: 'Inheritance Tax', desc: 'UK IHT & US Estate Tax 2026', path: '/inheritance-tax', icon: '🏦' },
      { label: 'National Insurance', desc: 'Employee NI contributions 2026/27', path: '/national-insurance', icon: '🏥' },
      { label: 'Self-Employed Tax', desc: 'Sole trader & freelancer tax estimate', path: '/self-employed', icon: '🧾' },
      { label: 'Corporation Tax', desc: 'UK company tax + Marginal Relief 2026', path: '/corporation-tax', icon: '🏢' },
      { label: 'VAT Calculator', desc: 'Add or remove UK VAT (20% / 5%)', path: '/vat', icon: '🧮' },
    ],
  },
  {
    title: '🏠 Property',
    color: 'bg-blue-600',
    items: [
      { label: 'Buy vs Rent', desc: 'Should you buy or keep renting?', path: '/buy-vs-rent', icon: '🏠' },
      { label: 'Mortgage Affordability', desc: 'How much can you borrow?', path: '/mortgage', icon: '🔑' },
      { label: 'Mortgage Refinance', desc: 'Savings & break-even point', path: '/refinance', icon: '🔄' },
    ],
  },
  {
    title: '📈 Investing & Retirement',
    color: 'bg-emerald-600',
    items: [
      { label: 'FIRE Calculator', desc: 'When can you retire early?', path: '/fire', icon: '🔥' },
      { label: '401k & Pension', desc: 'Project your retirement pot', path: '/retirement', icon: '🧓' },
      { label: 'Roth vs Traditional IRA', desc: 'Compare IRA options for 2026', path: '/roth-ira', icon: '🏦' },
      { label: 'Social Security', desc: 'US benefit estimate — ages 62–70', path: '/social-security', icon: '🇺🇸' },
      { label: 'Pension Credit', desc: 'UK Guarantee & Savings Credit 2026', path: '/pension-credit', icon: '🧓' },
      { label: 'Dividend Income', desc: 'Passive income from dividends', path: '/dividend', icon: '💰' },
      { label: 'Compound Interest', desc: 'Watch your money grow', path: '/compound', icon: '📈' },
    ],
  },
  {
    title: '💼 Income & Employment',
    color: 'bg-orange-500',
    items: [
      { label: 'Salary & Tax', desc: 'Take-home pay — US, UK, CA, AU', path: '/salary', icon: '💼' },
      { label: 'Pay Rise Calculator', desc: 'How much of a rise you keep after tax', path: '/pay-rise', icon: '📈' },
      { label: 'Redundancy Pay', desc: 'UK statutory redundancy entitlement', path: '/redundancy', icon: '📋' },
      { label: 'Holiday Entitlement', desc: 'UK annual leave calculator', path: '/holiday', icon: '🌴' },
      { label: 'Student Loan', desc: 'UK repayment calculator — all plans', path: '/student-loan', icon: '🎓' },
      { label: 'Loan Calculator', desc: 'Monthly payments & amortization', path: '/loan', icon: '🏦' },
    ],
  },
  {
    title: '💳 Loans & Debt',
    color: 'bg-rose-600',
    items: [
      { label: 'Credit Card Payoff', desc: 'Months to clear + interest saved', path: '/credit-card-payoff', icon: '💳' },
      { label: 'Auto Loan', desc: 'Monthly car payment & total cost', path: '/auto-loan', icon: '🚗' },
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
        <h1 className="text-2xl font-black text-gray-800 mb-2">Free Financial Calculators 2026</h1>
        <p className="text-gray-500 text-sm">
          Free, accurate, and up-to-date calculators for tax, property, retirement, and investing.
          Updated for US, UK, Canada and Australia. No sign-up required.
        </p>
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
                    <span className="text-2xl">{item.icon}</span>
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
                  <p className="text-sm font-semibold text-gray-800 leading-tight">📖 {g.h1}</p>
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
                    <span className="text-2xl">{item.icon}</span>
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
            { icon: '✅', text: 'Updated for 2026 tax rates' },
            { icon: '✅', text: 'US, UK, Canada & Australia' },
            { icon: '✅', text: 'No sign-up required' },
            { icon: '✅', text: 'All calculations in your browser' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}