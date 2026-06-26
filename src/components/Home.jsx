import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    title: '🏦 Tax Calculators',
    color: 'bg-indigo-600',
    items: [
      { label: 'Stamp Duty Calculator', desc: 'UK SDLT for buyers & investors', path: '/stamp-duty', icon: '🏛️' },
      { label: 'Capital Gains Tax', desc: 'US & UK CGT — stocks, property, crypto', path: '/capital-gains', icon: '📊' },
      { label: 'Inheritance Tax', desc: 'UK IHT & US Estate Tax 2026', path: '/inheritance-tax', icon: '🏦' },
      { label: 'Salary & Tax', desc: 'Take-home pay — US, UK, CA, AU', path: '/salary', icon: '💼' },
    ],
  },
  {
    title: '🏠 Property',
    color: 'bg-blue-600',
    items: [
      { label: 'Buy vs Rent', desc: 'Should you buy or keep renting?', path: '/buy-vs-rent', icon: '🏠' },
      { label: 'Mortgage Affordability', desc: 'How much can you borrow?', path: '/mortgage', icon: '🔑' },
    ],
  },
  {
    title: '📈 Investing & Retirement',
    color: 'bg-emerald-600',
    items: [
      { label: 'FIRE Calculator', desc: 'When can you retire early?', path: '/fire', icon: '🔥' },
      { label: '401k & Pension', desc: 'Project your retirement pot', path: '/retirement', icon: '🧓' },
      { label: 'Dividend Income', desc: 'Passive income from dividends', path: '/dividend', icon: '💰' },
      { label: 'Compound Interest', desc: 'Watch your money grow', path: '/compound', icon: '📈' },
    ],
  },
  {
    title: '💳 Loans',
    color: 'bg-orange-500',
    items: [
      { label: 'Loan Calculator', desc: 'Monthly payments & amortization', path: '/loan', icon: '📋' },
    ],
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-800 mb-2">Free Financial Calculators 2026</h1>
        <p className="text-gray-500 text-sm">
          Free, accurate, and up-to-date calculators for tax, property, retirement, and investing.
          Updated for US, UK, Canada and Australia. No sign-up required.
        </p>
      </div>

      {/* Category Grid */}
      <div className="space-y-6">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            {/* Category Header */}
            <div className={`${cat.color} text-white px-4 py-2 rounded-t-xl text-sm font-bold`}>
              {cat.title}
            </div>

            {/* Calculator Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-gray-200 border border-gray-200 rounded-b-xl overflow-hidden">
              {cat.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="bg-white hover:bg-indigo-50 transition-colors p-4 group"
                >
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
            </div>
          </div>
        ))}
      </div>

      {/* SEO Text */}
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