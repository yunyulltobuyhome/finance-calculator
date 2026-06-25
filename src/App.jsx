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
import Privacy from './components/Privacy'
import TermsOfService from './components/TermsOfService'

const DISCLAIMER = "Results are estimates only and do not constitute financial, tax, or legal advice. Tax laws change frequently — always verify with official sources (IRS, HMRC) and consult a qualified professional before making decisions."

const NAV = [
  {
    category: '🏦 Tax Calculators',
    items: [
      {
        label: 'Stamp Duty', icon: '🏛️', path: '/stamp-duty',
        title: 'Stamp Duty Calculator 2026 — UK SDLT | JoinCalc',
        description: 'Calculate UK Stamp Duty Land Tax (SDLT). Updated April 2025 rates for first-time buyers, standard buyers and additional properties.',
        keywords: 'stamp duty calculator 2026, UK SDLT calculator, stamp duty land tax, first time buyer stamp duty, stamp duty rates 2026',
      },
      {
        label: 'Capital Gains', icon: '📊', path: '/capital-gains',
        title: 'Capital Gains Tax Calculator 2026 — US & UK | JoinCalc',
        description: 'Calculate capital gains tax for the US or UK. 2026 rates: long-term, short-term, NIIT, and UK annual exempt amount.',
        keywords: 'capital gains tax calculator 2026, UK CGT calculator, US capital gains tax, long term capital gains, short term capital gains, NIIT calculator',
      },
      {
        label: 'Inheritance Tax', icon: '🏦', path: '/inheritance-tax',
        title: 'Inheritance Tax Calculator 2026 — UK IHT & US Estate Tax | JoinCalc',
        description: 'Calculate UK Inheritance Tax or US Estate Tax. 2026 nil-rate band, RNRB, and $15M US exemption included.',
        keywords: 'inheritance tax calculator 2026, UK IHT calculator, US estate tax calculator, nil rate band, RNRB calculator, inheritance tax threshold',
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
        keywords: 'buy vs rent calculator, rent or buy calculator, should I buy or rent, buy vs rent comparison 2026',
      },
      {
        label: 'Mortgage', icon: '🔑', path: '/mortgage',
        title: 'Mortgage Affordability Calculator 2026 — How Much Can I Borrow? | JoinCalc',
        description: 'Calculate how much mortgage you can afford. US DTI method and UK income multiple (4x–5.5x). Updated June 2026.',
        keywords: 'mortgage affordability calculator 2026, how much can I borrow, mortgage calculator UK, DTI calculator, income multiple mortgage UK',
      },
    ],
  },
  {
    category: '📈 Investing & Retirement',
    items: [
      {
        label: 'FIRE', icon: '🔥', path: '/fire',
        title: 'FIRE Calculator 2026 — Financial Independence Retire Early | JoinCalc',
        description: 'Calculate your FIRE number, retirement age, and savings goal. Free FIRE calculator for US, UK, Canada and Australia.',
        keywords: 'FIRE calculator, financial independence retire early, FIRE number calculator, lean FIRE, fat FIRE, retirement age calculator',
      },
      {
        label: '401k / Pension', icon: '🧓', path: '/retirement',
        title: '401k & Pension Calculator 2026 — Retirement Savings | JoinCalc',
        description: 'Project your 401k or UK pension pot. 2026 IRS limits ($24,500), employer match, compound growth, and UK £60,000 annual allowance.',
        keywords: '401k calculator 2026, pension calculator UK, retirement savings calculator, employer match calculator, UK pension annual allowance 2026',
      },
      {
        label: 'Dividend Income', icon: '💰', path: '/dividend',
        title: 'Dividend Income Calculator | JoinCalc',
        description: 'Estimate dividend income and passive cash flow with DRIP reinvestment support.',
        keywords: 'dividend calculator, dividend income calculator, DRIP calculator, dividend yield calculator, passive income calculator',
      },
      {
        label: 'Compound Interest', icon: '📈', path: '/compound',
        title: 'Compound Interest Calculator | JoinCalc',
        description: 'See how your money grows with compound interest and monthly contributions.',
        keywords: 'compound interest calculator, compound growth calculator, investment growth calculator',
      },
    ],
  },
  {
    category: '💼 Income',
    items: [
      {
        label: 'Salary & Tax', icon: '💼', path: '/salary',
        title: 'Salary Take-Home Calculator 2026 — After Tax Income | JoinCalc',
        description: 'Calculate your take-home pay after tax for US, UK, Canada and Australia.',
        keywords: 'salary calculator 2026, take home pay calculator, after tax income calculator, UK salary calculator, US salary calculator',
      },
      {
        label: 'Loan Calculator', icon: '📋', path: '/loan',
        title: 'Loan Calculator — Monthly Payments & Amortization | JoinCalc',
        description: 'Calculate monthly loan payments, total interest and amortization schedule.',
        keywords: 'loan calculator, monthly payment calculator, amortization calculator, mortgage payment calculator',
      },
    ],
  },
]

const allTabs = NAV.flatMap(g => g.items)

function Sidebar({ onClose }) {
  const location = useLocation()
  return (
    <nav className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link to="/fire" onClick={onClose}>
          <h1 className="text-xl font-black text-indigo-600">JoinCalc</h1>
          <p className="text-xs text-gray-400 mt-0.5">Free Financial Calculators</p>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-3">
        {NAV.map((group) => (
          <div key={group.category} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              {group.category}
            </p>
            {group.items.map((tab) => {
              const isActive = location.pathname === tab.path || (location.pathname === '/' && tab.path === '/fire')
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-sm font-medium transition-all ${
                    isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-base w-5 text-center">{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-100 space-y-1">
        <Link to="/privacy" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500 transition-colors">Privacy Policy</Link>
        <Link to="/terms" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500 transition-colors">Terms of Service</Link>
        <p className="text-xs text-gray-300 mt-2">© 2026 JoinCalc</p>
      </div>
    </nav>
  )
}

function Layout() {
  const location = useLocation()
  const isPrivacy = location.pathname === '/privacy'
  const isTerms = location.pathname === '/terms'
  const isStatic = isPrivacy || isTerms
  const currentTab = allTabs.find(t => t.path === location.pathname) || allTabs.find(t => t.path === '/fire')
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        <title>{currentTab.title}</title>
        <meta name="description" content={currentTab.description} />
        <meta name="keywords" content={currentTab.keywords || ''} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="JoinCalc" />
        <meta property="og:title" content={currentTab.title} />
        <meta property="og:description" content={currentTab.description} />
        <meta property="og:url" content={`https://joincalc.com${currentTab.path}`} />
        <meta property="og:image" content="https://joincalc.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentTab.title} />
        <meta name="twitter:description" content={currentTab.description} />
        <meta name="twitter:image" content="https://joincalc.com/og-image.png" />
        <link rel="canonical" href={`https://joincalc.com${currentTab.path}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": currentTab.title,
          "description": currentTab.description,
          "url": `https://joincalc.com${currentTab.path}`,
          "isPartOf": {
            "@type": "WebSite",
            "name": "JoinCalc",
            "url": "https://joincalc.com"
          }
        })}</script>
      </Helmet>

      {/* 데스크탑 사이드바 */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed h-full z-10">
        <Sidebar onClose={() => {}} />
      </aside>

      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-xl">
            <Sidebar onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* 메인 */}
      <div className="flex-1 md:ml-56">
        {/* 모바일 헤더 */}
        <header className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-30">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <span className="font-black text-indigo-600 text-lg">JoinCalc</span>
            <span className="text-gray-400 text-xs ml-2">{currentTab.icon} {currentTab.label}</span>
          </div>
        </header>

        {/* 데스크탑 헤더 */}
        <header className="hidden md:block bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentTab.icon}</span>
            <h2 className="text-lg font-bold text-gray-800">{currentTab.label}</h2>
          </div>
          <p className="text-sm text-gray-400 mt-0.5">{currentTab.description}</p>
        </header>

        <main className="max-w-2xl mx-auto px-4 md:px-8 py-6">
          {isStatic && (
            <Link to="/fire" className="text-sm text-indigo-600 hover:underline block mb-4">
              ← Back to Calculators
            </Link>
          )}

          <div className={isStatic ? '' : 'bg-white rounded-2xl border border-gray-200 p-6'}>
            <Routes>
              <Route path="/"                element={<FIRECalc />} />
              <Route path="/fire"            element={<FIRECalc />} />
              <Route path="/buy-vs-rent"     element={<BuyVsRentCalc />} />
              <Route path="/stamp-duty"      element={<StampDutyCalc />} />
              <Route path="/capital-gains"   element={<CapitalGainsCalc />} />
              <Route path="/inheritance-tax" element={<InheritanceTaxCalc />} />
              <Route path="/mortgage"        element={<MortgageAffordabilityCalc />} />
              <Route path="/retirement"      element={<RetirementCalc />} />
              <Route path="/dividend"        element={<DividendCalc />} />
              <Route path="/loan"            element={<LoanCalc />} />
              <Route path="/salary"          element={<SalaryCalc />} />
              <Route path="/compound"        element={<CompoundCalc />} />
              <Route path="/privacy"         element={<Privacy />} />
              <Route path="/terms"           element={<TermsOfService />} />
              <Route path="*"               element={<FIRECalc />} />
            </Routes>
          </div>

          {!isStatic && (
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