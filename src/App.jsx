import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FIRECalc from './components/FIRECalc'
import DividendCalc from './components/DividendCalc'
import LoanCalc from './components/LoanCalc'
import CompoundCalc from './components/CompoundCalc'
import SalaryCalc from './components/SalaryCalc'
import BuyVsRentCalc from './components/BuyVsRentCalc'
import StampDutyCalc from './components/StampDutyCalc'
import CapitalGainsCalc from './components/CapitalGainsCalc'
import InheritanceTaxCalc from './components/InheritanceTaxCalc'
import MortgageAffordabilityCalc from './components/MortgageAffordabilityCalc'
import RetirementCalc from './components/RetirementCalc'
import RedundancyCalc from './components/RedundancyCalc'
import NICalc from './components/NICalc'
import HolidayCalc from './components/HolidayCalc'
import StudentLoanCalc from './components/StudentLoanCalc'
import RothIRACalc from './components/RothIRACalc'
import SelfEmployedCalc from './components/SelfEmployedCalc'
import Privacy from './components/Privacy'
import TermsOfService from './components/TermsOfService'
import About from './components/About'
import Home from './components/Home'
import Logo from './components/Logo'

const DISCLAIMER = "Results are estimates only and do not constitute financial, tax, or legal advice. Tax laws change frequently — always verify with official sources (IRS, HMRC) and consult a qualified professional before making decisions."

const NAV = [
  {
    category: '🏦 Tax Calculators',
    items: [
      {
        label: 'Stamp Duty', icon: '🏛️', path: '/stamp-duty',
        title: 'Stamp Duty Calculator 2026 — UK SDLT | JoinCalc',
        description: 'Calculate UK Stamp Duty Land Tax (SDLT). Updated April 2025 rates for first-time buyers, standard buyers and additional properties.',
        keywords: 'stamp duty calculator 2026, UK SDLT calculator, stamp duty land tax, first time buyer stamp duty',
        lastUpdated: 'April 2025',
      },
      {
        label: 'Capital Gains', icon: '📊', path: '/capital-gains',
        title: 'Capital Gains Tax Calculator 2026 — US & UK | JoinCalc',
        description: 'Calculate capital gains tax for the US or UK. 2026 rates: long-term, short-term, NIIT, and UK annual exempt amount.',
        keywords: 'capital gains tax calculator 2026, UK CGT calculator, US capital gains tax, long term capital gains',
        lastUpdated: 'January 2026',
      },
      {
        label: 'Inheritance Tax', icon: '🏦', path: '/inheritance-tax',
        title: 'Inheritance Tax Calculator 2026 — UK IHT & US Estate Tax | JoinCalc',
        description: 'Calculate UK Inheritance Tax or US Estate Tax. 2026 nil-rate band, RNRB, and $15M US exemption included.',
        keywords: 'inheritance tax calculator 2026, UK IHT calculator, US estate tax calculator, nil rate band',
        lastUpdated: 'July 2025',
      },
      {
        label: 'National Insurance', icon: '🏥', path: '/national-insurance',
        title: 'UK National Insurance Calculator 2026/27 | JoinCalc',
        description: 'Estimate your UK National Insurance contributions for 2026/27. Employee 8%/2% rates, employer 15% rate, and take-home pay breakdown.',
        keywords: 'national insurance calculator 2026, NI calculator UK, how much national insurance do I pay',
        lastUpdated: 'April 2026',
      },
      {
        label: 'Self-Employed Tax', icon: '🧾', path: '/self-employed',
        title: 'UK Self-Employed Tax Calculator 2026/27 — Sole Trader & Freelancer | JoinCalc',
        description: 'Calculate Income Tax and Class 4 NI as a self-employed sole trader or freelancer. 2026/27 HMRC rates, pension deductions, and take-home profit estimate.',
        keywords: 'self employed tax calculator UK 2026, sole trader tax calculator, freelancer tax calculator UK, class 4 national insurance calculator, self assessment tax estimate',
        lastUpdated: 'April 2026',
      },
    ],
  },
  {
    category: '🏠 Property',
    items: [
      {
        label: 'Buy vs Rent', icon: '🏠', path: '/buy-vs-rent',
        title: 'Buy vs Rent Calculator 2026 | JoinCalc',
        description: 'Should you buy or rent? Compare total costs over time for US, UK, Canada and Australia.',
        keywords: 'buy vs rent calculator, rent or buy calculator, should I buy or rent',
        lastUpdated: 'June 2026',
      },
      {
        label: 'Mortgage', icon: '🔑', path: '/mortgage',
        title: 'Mortgage Affordability Calculator 2026 — How Much Can I Borrow? | JoinCalc',
        description: 'Calculate how much mortgage you can afford. US DTI method and UK income multiple (4x–5.5x). Updated June 2026.',
        keywords: 'mortgage affordability calculator 2026, how much can I borrow, mortgage calculator UK',
        lastUpdated: 'June 2026',
      },
    ],
  },
  {
    category: '📈 Investing & Retirement',
    items: [
      {
        label: 'FIRE', icon: '🔥', path: '/fire',
        title: 'FIRE Calculator 2026 — Financial Independence Retire Early | JoinCalc',
        description: 'Calculate your FIRE number, retirement age, and savings goal.',
        keywords: 'FIRE calculator, financial independence retire early, FIRE number calculator',
        lastUpdated: 'June 2026',
      },
      {
        label: '401k / Pension', icon: '🧓', path: '/retirement',
        title: '401k & Pension Calculator 2026 — Retirement Savings | JoinCalc',
        description: 'Project your 401k or UK pension pot. 2026 IRS limits ($24,500), employer match, and UK £60,000 annual allowance.',
        keywords: '401k calculator 2026, pension calculator UK, retirement savings calculator',
        lastUpdated: 'July 2025',
      },
      {
        label: 'Roth vs Traditional IRA', icon: '🏦', path: '/roth-ira',
        title: 'Roth vs Traditional IRA Calculator 2026 | JoinCalc',
        description: 'Compare Roth IRA vs Traditional IRA projected values. 2026 IRS limits, income phase-outs, tax break-even analysis.',
        keywords: 'roth ira calculator 2026, roth vs traditional ira, ira contribution limit 2026',
        lastUpdated: 'January 2026',
      },
      {
        label: 'Dividend Income', icon: '💰', path: '/dividend',
        title: 'Dividend Income Calculator | JoinCalc',
        description: 'Estimate dividend income and passive cash flow with DRIP reinvestment support.',
        keywords: 'dividend calculator, dividend income calculator, DRIP calculator',
        lastUpdated: 'June 2026',
      },
      {
        label: 'Compound Interest', icon: '📈', path: '/compound',
        title: 'Compound Interest Calculator | JoinCalc',
        description: 'See how your money grows with compound interest and monthly contributions.',
        keywords: 'compound interest calculator, compound growth calculator',
        lastUpdated: 'June 2026',
      },
    ],
  },
  {
    category: '💼 Income & Employment',
    items: [
      {
        label: 'Salary & Tax', icon: '💼', path: '/salary',
        title: 'Salary Take-Home Calculator 2026 — After Tax Income | JoinCalc',
        description: 'Calculate your take-home pay after tax for US, UK, Canada and Australia.',
        keywords: 'salary calculator 2026, take home pay calculator, after tax income calculator',
        lastUpdated: 'April 2026',
      },
      {
        label: 'Redundancy Pay', icon: '📋', path: '/redundancy',
        title: 'UK Statutory Redundancy Pay Calculator 2026 | JoinCalc',
        description: 'Estimate your UK statutory redundancy pay entitlement. Updated April 2026 rates.',
        keywords: 'redundancy pay calculator UK 2026, statutory redundancy calculator',
        lastUpdated: 'April 2026',
      },
      {
        label: 'Holiday Entitlement', icon: '🌴', path: '/holiday',
        title: 'UK Holiday Entitlement Calculator 2026 | JoinCalc',
        description: 'Calculate your statutory UK annual leave entitlement. Full-time, part-time and irregular hours workers.',
        keywords: 'holiday entitlement calculator UK 2026, statutory holiday calculator',
        lastUpdated: 'April 2026',
      },
      {
        label: 'Student Loan', icon: '🎓', path: '/student-loan',
        title: 'UK Student Loan Repayment Calculator 2026 — Plan 1, 2, 4, 5 & PG | JoinCalc',
        description: 'Estimate your UK student loan monthly repayments. Covers Plan 1, 2, 4, 5 and Postgraduate loans.',
        keywords: 'student loan calculator UK 2026, student loan repayment calculator, plan 2 student loan',
        lastUpdated: 'April 2026',
      },
      {
        label: 'Loan Calculator', icon: '🏦', path: '/loan',
        title: 'Loan Calculator — Monthly Payments & Amortization | JoinCalc',
        description: 'Calculate monthly loan payments, total interest and amortization schedule.',
        keywords: 'loan calculator, monthly payment calculator, amortization calculator',
        lastUpdated: 'June 2026',
      },
    ],
  },
]

const allTabs = NAV.flatMap(g => g.items)
const STATIC_PAGES = ['/privacy', '/terms', '/about']

function Sidebar({ onClose }) {
  const location = useLocation()
  return (
    <nav className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link to="/" onClick={onClose}><Logo size="md" theme="light" /></Link>
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <Link to="/" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-3 text-sm font-medium transition-all ${
            location.pathname === '/' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          <span className="text-base w-5 text-center">🏠</span>
          <span>All Calculators</span>
        </Link>
        {NAV.map((group) => (
          <div key={group.category} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              {group.category}
            </p>
            {group.items.map((tab) => {
              const isActive = location.pathname === tab.path
              return (
                <Link key={tab.path} to={tab.path} onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                  <span className="text-base w-5 text-center">{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link to="/about" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500 transition-colors">About JoinCalc</Link>
        <Link to="/privacy" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500 transition-colors">Privacy Policy</Link>
        <Link to="/terms" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500 transition-colors">Terms of Service</Link>
        <p className="text-xs text-gray-300 mt-2">© 2026 JoinCalc</p>
      </div>
    </nav>
  )
}

function Layout() {
  const location = useLocation()
  const isStatic = STATIC_PAGES.includes(location.pathname)
  const isHome = location.pathname === '/'
  const currentTab = allTabs.find(t => t.path === location.pathname)
  const [mobileOpen, setMobileOpen] = useState(false)

  const seoTitle = isHome
    ? 'Free Financial Calculators 2026 — Tax, Mortgage, Retirement | JoinCalc'
    : isStatic ? 'JoinCalc — Free Financial Calculators'
    : currentTab?.title || 'JoinCalc'

  const seoDesc = isHome
    ? 'Free financial calculators for 2026: stamp duty, capital gains tax, self-employed tax, national insurance, redundancy pay, student loan, mortgage, 401k, pension, salary, FIRE, and more. US & UK. No sign-up required.'
    : currentTab?.description || ''

  const seoKeywords = isHome
    ? 'financial calculator, stamp duty calculator 2026, capital gains tax calculator, self employed tax calculator UK, national insurance calculator, redundancy pay calculator, student loan calculator UK, mortgage affordability, 401k calculator, salary calculator, FIRE calculator'
    : currentTab?.keywords || ''

  const canonicalUrl = `https://joincalc.com${location.pathname}`

  const schemaWebSite = {
    "@context": "https://schema.org", "@type": "WebSite",
    "name": "JoinCalc", "url": "https://joincalc.com",
    "description": "Free financial calculators for US, UK, Canada and Australia",
    "potentialAction": { "@type": "SearchAction", "target": "https://joincalc.com/?q={search_term_string}", "query-input": "required name=search_term_string" }
  }
  const schemaOrg = {
    "@context": "https://schema.org", "@type": "Organization",
    "name": "JoinCalc", "url": "https://joincalc.com",
    "logo": "https://joincalc.com/favicon.svg",
    "contactPoint": { "@type": "ContactPoint", "email": "hello@joincalc.com", "contactType": "customer support" }
  }
  const schemaApp = currentTab ? {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    "name": currentTab.title, "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "description": currentTab.description, "url": canonicalUrl, "dateModified": "2026-06-29",
    "provider": { "@type": "Organization", "name": "JoinCalc", "url": "https://joincalc.com" }
  } : null
  const schemaFAQ = currentTab ? {
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": [{ "@type": "Question", "name": `What is the ${currentTab.label} calculator?`, "acceptedAnswer": { "@type": "Answer", "text": currentTab.description } }]
  } : null
  const schemaBreadcrumb = !isHome && !isStatic && currentTab ? {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://joincalc.com" },
      { "@type": "ListItem", "position": 2, "name": currentTab.label, "item": canonicalUrl }
    ]
  } : null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <meta name="keywords" content={seoKeywords} />
        <meta name="author" content="JoinCalc" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="JoinCalc" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content="https://joincalc.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDesc} />
        <meta name="twitter:image" content="https://joincalc.com/og-image.png" />
        {currentTab?.lastUpdated && <meta name="revised" content={currentTab.lastUpdated} />}
        <script type="application/ld+json">{JSON.stringify(schemaWebSite)}</script>
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
        {schemaApp && <script type="application/ld+json">{JSON.stringify(schemaApp)}</script>}
        {schemaFAQ && <script type="application/ld+json">{JSON.stringify(schemaFAQ)}</script>}
        {schemaBreadcrumb && <script type="application/ld+json">{JSON.stringify(schemaBreadcrumb)}</script>}
      </Helmet>

      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed h-full z-10">
        <Sidebar onClose={() => {}} />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex-1 md:ml-56">
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/"><Logo size="sm" theme="light" /></Link>
          {currentTab && <span className="text-gray-400 text-xs ml-auto">{currentTab.icon} {currentTab.label}</span>}
        </header>

        {!isHome && !isStatic && currentTab && (
          <header className="hidden md:block bg-white border-b border-gray-200 px-8 py-4">
            <nav className="text-xs text-gray-400 mb-2">
              <Link to="/" className="hover:text-indigo-500">Home</Link>
              <span className="mx-2">›</span>
              <span className="text-gray-600">{currentTab.label}</span>
            </nav>
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentTab.icon}</span>
              <h2 className="text-lg font-bold text-gray-800">{currentTab.label}</h2>
              {currentTab.lastUpdated && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                  ✓ Rates verified: {currentTab.lastUpdated}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{currentTab.description}</p>
          </header>
        )}

        {isHome && (
          <header className="hidden md:block bg-white border-b border-gray-200 px-8 py-4">
            <h2 className="text-lg font-bold text-gray-800">All Calculators</h2>
            <p className="text-sm text-gray-400 mt-0.5">Free financial calculators for US, UK, Canada & Australia — updated for 2026</p>
          </header>
        )}

        <main className="max-w-2xl mx-auto px-4 md:px-8 py-6">
          {isStatic && (
            <Link to="/" className="text-sm text-indigo-600 hover:underline block mb-4">← Back to Calculators</Link>
          )}
          <div className={isStatic ? '' : (isHome ? '' : 'bg-white rounded-2xl border border-gray-200 p-6')}>
            <Routes>
              <Route path="/"                   element={<Home />} />
              <Route path="/fire"               element={<FIRECalc />} />
              <Route path="/buy-vs-rent"        element={<BuyVsRentCalc />} />
              <Route path="/stamp-duty"         element={<StampDutyCalc />} />
              <Route path="/capital-gains"      element={<CapitalGainsCalc />} />
              <Route path="/inheritance-tax"    element={<InheritanceTaxCalc />} />
              <Route path="/mortgage"           element={<MortgageAffordabilityCalc />} />
              <Route path="/retirement"         element={<RetirementCalc />} />
              <Route path="/roth-ira"           element={<RothIRACalc />} />
              <Route path="/dividend"           element={<DividendCalc />} />
              <Route path="/loan"               element={<LoanCalc />} />
              <Route path="/salary"             element={<SalaryCalc />} />
              <Route path="/compound"           element={<CompoundCalc />} />
              <Route path="/redundancy"         element={<RedundancyCalc />} />
              <Route path="/national-insurance" element={<NICalc />} />
              <Route path="/holiday"            element={<HolidayCalc />} />
              <Route path="/student-loan"       element={<StudentLoanCalc />} />
              <Route path="/self-employed"      element={<SelfEmployedCalc />} />
              <Route path="/privacy"            element={<Privacy />} />
              <Route path="/terms"              element={<TermsOfService />} />
              <Route path="/about"              element={<About />} />
              <Route path="*"                  element={<Home />} />
            </Routes>
          </div>

          {!isStatic && !isHome && (
            <div className="mt-4 space-y-2">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  ⚠️ <strong>Disclaimer:</strong> {DISCLAIMER}
                </p>
              </div>
              <p className="text-xs text-gray-400 text-center">
                By using JoinCalc you agree to our{' '}
                <Link to="/terms" className="text-indigo-400 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</Link>
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}