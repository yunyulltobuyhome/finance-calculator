import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import FIRECalc from './components/FIRECalc'
import DividendCalc from './components/DividendCalc'
import LoanCalc from './components/LoanCalc'
import CompoundCalc from './components/CompoundCalc'
import SalaryCalc from './components/SalaryCalc'
import BuyVsRentCalc from './components/BuyVsRentCalc'
import StampDutyCalc from './components/StampDutyCalc'
import Privacy from './components/Privacy'

const tabs = [
  {
    label: 'FIRE', icon: '🔥', path: '/fire',
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
    label: 'Dividend', icon: '💰', path: '/dividend',
    title: 'Dividend Income Calculator — Estimate Passive Income | JoinCalc',
    description: 'Calculate your dividend income and passive cash flow. Free dividend calculator with reinvestment (DRIP) support.',
  },
  {
    label: 'Loan', icon: '📋', path: '/loan',
    title: 'Loan Calculator — Monthly Payments & Amortization | JoinCalc',
    description: 'Calculate monthly loan payments, total interest and amortization schedule. Supports mortgage, auto, and personal loans.',
  },
  {
    label: 'Salary', icon: '💼', path: '/salary',
    title: 'Salary Take-Home Calculator — After Tax Income | JoinCalc',
    description: 'Calculate your take-home pay after tax. Free salary calculator for US, UK, Canada and Australia.',
  },
  {
    label: 'Compound', icon: '📈', path: '/compound',
    title: 'Compound Interest Calculator — Grow Your Savings | JoinCalc',
    description: 'See how your money grows with compound interest. Free compound interest calculator with monthly contributions.',
  },
]

function Layout() {
  const location = useLocation()
  const isPrivacy = location.pathname === '/privacy'
  const currentTab = tabs.find(t => t.path === location.pathname) || tabs[0]

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{currentTab.title}</title>
        <meta name="description" content={currentTab.description} />
        <meta property="og:title" content={currentTab.title} />
        <meta property="og:description" content={currentTab.description} />
        <meta property="og:url" content={`https://joincalc.com${currentTab.path}`} />
        <link rel="canonical" href={`https://joincalc.com${currentTab.path}`} />
      </Helmet>

      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <Link to="/fire">
          <h1 className="text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors">
            JoinCalc
          </h1>
        </Link>
        <p className="text-sm text-gray-500">
          Free Financial Calculators — FIRE, Buy vs Rent, Stamp Duty, Loan, Salary & More
        </p>
      </header>

      {!isPrivacy && (
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-2">
              {tabs.map((tab) => {
                const isActive = location.pathname === tab.path || (location.pathname === '/' && tab.path === '/fire')
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 py-6">
        {isPrivacy && (
          <Link to="/fire" className="text-sm text-indigo-600 hover:underline block mb-4">
            ← Back to Calculators
          </Link>
        )}

        <div className={isPrivacy ? '' : 'bg-white rounded-2xl border border-gray-200 p-6'}>
          <Routes>
            <Route path="/"            element={<FIRECalc />} />
            <Route path="/fire"        element={<FIRECalc />} />
            <Route path="/buy-vs-rent" element={<BuyVsRentCalc />} />
            <Route path="/stamp-duty"  element={<StampDutyCalc />} />
            <Route path="/dividend"    element={<DividendCalc />} />
            <Route path="/loan"        element={<LoanCalc />} />
            <Route path="/salary"      element={<SalaryCalc />} />
            <Route path="/compound"    element={<CompoundCalc />} />
            <Route path="/privacy"     element={<Privacy />} />
            <Route path="*"            element={<FIRECalc />} />
          </Routes>
        </div>

        {!isPrivacy && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-xs text-yellow-700 leading-relaxed">
              ⚠️ <strong>Disclaimer:</strong> For informational purposes only. Not financial, tax, or legal advice. Always consult professionals.
            </p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 space-x-4">
        <span>© 2026 JoinCalc</span>
        <Link to="/privacy" className="hover:text-indigo-600 hover:underline">
          Privacy Policy
        </Link>
      </footer>
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