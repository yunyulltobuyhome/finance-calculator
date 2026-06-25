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
import Privacy from './components/Privacy'
import TermsOfService from './components/TermsOfService'

const DISCLAIMER = "Results are estimates only and do not constitute financial, tax, or legal advice. Tax laws change frequently — always verify with official sources (IRS, HMRC) and consult a qualified professional before making decisions."

const tabs = [
  {
    label: 'FIRE Calculator', icon: '🔥', path: '/fire',
    title: 'FIRE Calculator — Financial Independence Retire Early | JoinCalc',
    description: 'Calculate your FIRE number, retirement age, and savings goal. Free FIRE calculator for US, UK, Canada and Australia.',
  },
  {
    label: 'Buy vs Rent', icon: '🏠', path: '/buy-vs-rent',
    title: 'Buy vs Rent Calculator — Should You Buy or Rent a Home? | JoinCalc',
    description: 'Compare buying vs renting a home with our free calculator. See total costs over time for US, UK, Canada and Australia.',
  },
  {
    label: 'Stamp Duty', icon: '🏛️', path: '/stamp-duty',
    title: 'Stamp Duty Calculator 2026 — UK SDLT Calculator | JoinCalc',
    description: 'Calculate UK Stamp Duty Land Tax (SDLT) instantly. Updated April 2025 rates for standard buyers, first-time buyers and additional properties.',
  },
  {
    label: 'Capital Gains Tax', icon: '📊', path: '/capital-gains',
    title: 'Capital Gains Tax Calculator 2026 — US & UK CGT | JoinCalc',
    description: 'Calculate capital gains tax for the US or UK. Latest 2026 rates including long-term, short-term, NIIT and UK annual exempt amount.',
  },
  {
    label: 'Inheritance Tax', icon: '🏦', path: '/inheritance-tax',
    title: 'Inheritance Tax Calculator 2026 — UK IHT & US Estate Tax | JoinCalc',
    description: 'Calculate UK Inheritance Tax (IHT) or US Estate Tax. Updated 2026 rates including nil-rate band, RNRB, and $15M US exemption.',
  },
  {
    label: 'Dividend Income', icon: '💰', path: '/dividend',
    title: 'Dividend Income Calculator — Estimate Passive Income | JoinCalc',
    description: 'Calculate your dividend income and passive cash flow. Free dividend calculator with reinvestment (DRIP) support.',
  },
  {
    label: 'Loan Calculator', icon: '📋', path: '/loan',
    title: 'Loan Calculator — Monthly Payments & Amortization | JoinCalc',
    description: 'Calculate monthly loan payments, total interest and amortization schedule. Supports mortgage, auto, and personal loans.',
  },
  {
    label: 'Salary & Tax', icon: '💼', path: '/salary',
    title: 'Salary Take-Home Calculator — After Tax Income | JoinCalc',
    description: 'Calculate your take-home pay after tax. Free salary calculator for US, UK, Canada and Australia.',
  },
  {
    label: 'Compound Interest', icon: '📈', path: '/compound',
    title: 'Compound Interest Calculator — Grow Your Savings | JoinCalc',
    description: 'See how your money grows with compound interest. Free compound interest calculator with monthly contributions.',
  },
]

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
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-2">Calculators</p>
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (location.pathname === '/' && tab.path === '/fire')
          return (
            <Link key={tab.path} to={tab.path} onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-sm font-medium transition-all ${
                isActive ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}>
              <span className="text-base w-5 text-center">{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          )
        })}
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
  const currentTab = tabs.find(t => t.path === location.pathname) || tabs[0]
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        <title>{currentTab.title}</title>
        <meta name="description" content={currentTab.description} />
        <meta property="og:title" content={currentTab.title} />
        <meta property="og:description" content={currentTab.description} />
        <meta property="og:url" content={`https://joincalc.com${currentTab.path}`} />
        <link rel="canonical" href={`https://joincalc.com${currentTab.path}`} />
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
              <Route path="/dividend"        element={<DividendCalc />} />
              <Route path="/loan"            element={<LoanCalc />} />
              <Route path="/salary"          element={<SalaryCalc />} />
              <Route path="/compound"        element={<CompoundCalc />} />
              <Route path="/privacy"         element={<Privacy />} />
              <Route path="/terms"           element={<TermsOfService />} />
              <Route path="*"               element={<FIRECalc />} />
            </Routes>
          </div>

          {/* 강화된 Disclaimer */}
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