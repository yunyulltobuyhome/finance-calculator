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
import CorporationTaxCalc from './components/CorporationTaxCalc'
import PensionCreditCalc from './components/PensionCreditCalc'
import SocialSecurityCalc from './components/SocialSecurityCalc'
import Privacy from './components/Privacy'
import TermsOfService from './components/TermsOfService'
import About from './components/About'
import Contact from './components/Contact'
import Home from './components/Home'
import SalaryLanding from './components/SalaryLanding'
import StampDutyLanding from './components/StampDutyLanding'
import CapitalGainsLanding from './components/CapitalGainsLanding'
import MortgageLanding from './components/MortgageLanding'
import VATCalc from './components/VATCalc'
import PayRiseCalc from './components/PayRiseCalc'
import CreditCardPayoffCalc from './components/CreditCardPayoffCalc'
import AutoLoanCalc from './components/AutoLoanCalc'
import RefinanceCalc from './components/RefinanceCalc'
import HourlyToSalaryCalc from './components/HourlyToSalaryCalc'
import DebtConsolidationCalc from './components/DebtConsolidationCalc'
import TaxTablesUK from './components/TaxTablesUK'
import TaxTablesUS from './components/TaxTablesUS'
import AutoLoanLanding from './components/AutoLoanLanding'
import CreditCardLanding from './components/CreditCardLanding'
import GuidesIndex from './components/GuidesIndex'
import ArticlePage from './components/ArticlePage'
import NotFound from './components/NotFound'
import EmbedCalc from './components/EmbedCalc'
import EmbedSnippet from './components/EmbedSnippet'
import Logo from './components/Logo'
import ResultActions from './components/ResultActions'
import CookieConsent from './components/CookieConsent'

// Calculator → matching in-depth guide, for a tool↔content funnel (more
// pageviews per session = more ad impressions, plus better dwell time/SEO).
const CALC_GUIDE = {
  '/stamp-duty': { slug: 'how-is-stamp-duty-calculated-uk', label: 'How is stamp duty calculated?' },
  '/capital-gains': { slug: 'how-much-capital-gains-tax-uk', label: 'How much capital gains tax will I pay?' },
  '/national-insurance': { slug: 'how-is-national-insurance-calculated-uk', label: 'How is National Insurance calculated?' },
  '/redundancy': { slug: 'how-much-redundancy-pay-uk', label: 'How much redundancy pay am I entitled to?' },
  '/salary': { slug: 'how-to-calculate-take-home-pay-uk', label: 'How to calculate your take-home pay' },
  '/vat': { slug: 'uk-vat-rates-explained', label: 'UK VAT rates explained' },
  '/compound': { slug: 'how-compound-interest-works', label: 'How compound interest works' },
  '/student-loan': { slug: 'student-loan-repayments-explained', label: 'UK student loan repayments explained' },
  '/mortgage': { slug: 'how-much-can-i-borrow-for-a-mortgage', label: 'How much can I borrow for a mortgage?' },
  '/fire': { slug: 'what-is-a-fire-number', label: 'What is a FIRE number?' },
  '/pay-rise': { slug: 'how-to-calculate-take-home-pay-uk', label: 'How to calculate your take-home pay' },
  '/credit-card-payoff': { slug: 'how-to-pay-off-credit-card-debt-fast', label: 'How to pay off credit card debt fast' },
  '/auto-loan': { slug: 'how-much-car-can-i-afford', label: 'How much car can I afford?' },
  '/refinance': { slug: 'should-i-refinance-my-mortgage', label: 'Should I refinance my mortgage?' },
  '/hourly-to-salary': { slug: 'how-to-calculate-take-home-pay-uk', label: 'How to calculate your take-home pay' },
  '/debt-consolidation': { slug: 'how-to-pay-off-credit-card-debt-fast', label: 'How to pay off credit card debt fast' },
}

const DISCLAIMER = "Results are estimates only and do not constitute financial, tax, or legal advice. Tax laws change frequently — always verify with official sources (IRS, HMRC) and consult a qualified professional before making decisions."

const NAV = [
  {
    category: '🏦 Tax Calculators',
    items: [
      {
        label: 'Stamp Duty', icon: '🏛️', path: '/stamp-duty',
        title: "Stamp Duty Calculator UK 2026 — Instant & Free | JoinCalc",
        description: "See exactly what stamp duty you'll pay in seconds — 2026 SDLT bands, first-time buyer relief and the second-home surcharge. Free, no sign-up.",
        keywords: 'stamp duty calculator 2026, UK SDLT calculator, stamp duty land tax, first time buyer stamp duty',
        lastUpdated: 'April 2025',
        source: "HMRC",
      },
      {
        label: 'Capital Gains', icon: '📊', path: '/capital-gains',
        title: "Capital Gains Tax Calculator 2026 — US & UK | JoinCalc",
        description: "Work out your exact CGT bill in seconds for shares, property or crypto — 2026 US & UK rates and allowances built in. Free, no sign-up.",
        keywords: 'capital gains tax calculator 2026, UK CGT calculator, US capital gains tax, long term capital gains',
        lastUpdated: 'January 2026',
        source: "HMRC & IRS",
      },
      {
        label: 'Inheritance Tax', icon: '🏦', path: '/inheritance-tax',
        title: "Inheritance Tax Calculator 2026 (UK & US) | JoinCalc",
        description: "Estimate inheritance tax in seconds — UK nil-rate band & RNRB or the $15M US exemption, with a full breakdown. Free and anonymous.",
        keywords: 'inheritance tax calculator 2026, UK IHT calculator, US estate tax calculator, nil rate band',
        lastUpdated: 'July 2025',
        source: "HMRC & IRS",
      },
      {
        label: 'National Insurance', icon: '🏥', path: '/national-insurance',
        title: "National Insurance Calculator 2026/27 (UK) | JoinCalc",
        description: "See exactly how much National Insurance you'll pay in 2026/27, plus your take-home pay, with the 8% and 2% bands explained. Free & instant.",
        keywords: 'national insurance calculator 2026, NI calculator UK, how much national insurance do I pay',
        lastUpdated: 'April 2026',
        source: "HMRC",
      },
      {
        label: 'Self-Employed Tax', icon: '🧾', path: '/self-employed',
        title: "Self-Employed Tax Calculator UK 2026/27 | JoinCalc",
        description: "Sole trader or freelancer? See your Income Tax, Class 4 NI and take-home profit for 2026/27 in seconds. HMRC rates. Free, no sign-up.",
        keywords: 'self employed tax calculator UK 2026, sole trader tax calculator, freelancer tax calculator UK, class 4 national insurance calculator',
        lastUpdated: 'April 2026',
        source: "HMRC",
      },
      {
        label: 'Corporation Tax', icon: '🏢', path: '/corporation-tax',
        title: "Corporation Tax Calculator UK 2026/27 | JoinCalc",
        description: "Work out your company's 2026/27 Corporation Tax in seconds — 19% and 25% rates with Marginal Relief calculated for you. Free, no sign-up.",
        keywords: 'corporation tax calculator UK 2026, UK company tax calculator, marginal relief calculator, small profits rate 2026',
        lastUpdated: 'April 2026',
        source: "HMRC",
      },
      {
        label: 'VAT', icon: '🧮', path: '/vat',
        title: "VAT Calculator UK — Add or Remove VAT Instantly | JoinCalc",
        description: "Add or strip UK VAT in one click at 20%, 5% or 0% — see the net, VAT and gross instantly, without the common ÷1.2 mistake. Free tool.",
        keywords: 'vat calculator uk, add vat calculator, remove vat calculator, 20% vat calculator, how to work out vat',
        lastUpdated: 'June 2026',
        source: "HMRC",
      },
    ],
  },
  {
    category: '🏠 Property',
    items: [
      {
        label: 'Buy vs Rent', icon: '🏠', path: '/buy-vs-rent',
        title: "Buy vs Rent Calculator — Which Saves You More? | JoinCalc",
        description: "Renting or buying: which leaves you better off? Compare the true long-term costs for the US, UK, Canada & Australia in seconds. Free.",
        keywords: 'buy vs rent calculator, rent or buy calculator, should I buy or rent',
        lastUpdated: 'June 2026',
        source: "standard cost-comparison methodology",
      },
      {
        label: 'Mortgage', icon: '🔑', path: '/mortgage',
        title: "How Much Can I Borrow? Mortgage Calculator 2026 | JoinCalc",
        description: "See how much mortgage you could borrow in seconds — UK income multiples (4–5.5x) and the US DTI method side by side. Free, no sign-up.",
        keywords: 'mortgage affordability calculator 2026, how much can I borrow, mortgage calculator UK',
        lastUpdated: 'June 2026',
        source: "standard DTI & income-multiple methodology",
      },
      {
        label: 'Refinance', icon: '🔄', path: '/refinance',
        title: "Refinance Calculator — Should I Refinance? | JoinCalc",
        description: "See your new payment, monthly savings and exact break-even month before you refinance — plus lifetime interest compared. Free & instant.",
        keywords: 'mortgage refinance calculator, refinance calculator, should i refinance, refinance break even calculator, refinance savings',
        lastUpdated: 'June 2026',
        source: "standard amortization methodology",
      },
    ],
  },
  {
    category: '📈 Investing & Retirement',
    items: [
      {
        label: 'FIRE', icon: '🔥', path: '/fire',
        title: "FIRE Calculator — When Can I Retire Early? | JoinCalc",
        description: "Find your FIRE number and the age you could retire early, using the 4% rule and your real savings rate. Takes 30 seconds — free, no sign-up.",
        keywords: 'FIRE calculator, financial independence retire early, FIRE number calculator',
        lastUpdated: 'June 2026',
        source: "the 4% rule methodology",
      },
      {
        label: '401k / Pension', icon: '🧓', path: '/retirement',
        title: "401k & Pension Calculator 2026 — Your Pot at 65 | JoinCalc",
        description: "Project your 401k or pension pot to retirement — employer match, 2026 IRS $24,500 limit and UK £60k allowance included. Free, no sign-up.",
        keywords: '401k calculator 2026, pension calculator UK, retirement savings calculator',
        lastUpdated: 'July 2025',
        source: "IRS & GOV.UK",
      },
      {
        label: 'Roth vs Traditional IRA', icon: '🏦', path: '/roth-ira',
        title: "Roth vs Traditional IRA Calculator 2026 | JoinCalc",
        description: "Roth or Traditional? Compare projected after-tax values side by side with 2026 IRS limits and income phase-outs. Decide in seconds — free.",
        keywords: 'roth ira calculator 2026, roth vs traditional ira, ira contribution limit 2026',
        lastUpdated: 'January 2026',
        source: "IRS",
      },
      {
        label: 'Social Security', icon: '🇺🇸', path: '/social-security',
        title: "Social Security Calculator 2026 — Benefit by Age | JoinCalc",
        description: "Estimate your monthly Social Security check and compare claiming at 62, 67 or 70 — see exactly what waiting is worth. Free, no sign-up.",
        keywords: 'social security calculator 2026, when to claim social security, social security retirement benefit estimate, full retirement age calculator',
        lastUpdated: 'January 2026',
        source: "SSA",
      },
      {
        label: 'Pension Credit', icon: '🧓', path: '/pension-credit',
        title: "Pension Credit Calculator UK 2026/27 | JoinCalc",
        description: "Check in seconds whether you qualify for Pension Credit and how much — Guarantee and Savings Credit at 2026/27 rates. Free and anonymous.",
        keywords: 'pension credit calculator UK 2026, guarantee credit calculator, pension credit eligibility, how much pension credit',
        lastUpdated: 'April 2026',
        source: "GOV.UK",
      },
      {
        label: 'Dividend Income', icon: '💰', path: '/dividend',
        title: "Dividend Income Calculator — Live Off Dividends? | JoinCalc",
        description: "See the dividend income your portfolio could pay — with DRIP reinvestment and dividend growth compounding year by year. Free, no sign-up.",
        keywords: 'dividend calculator, dividend income calculator, DRIP calculator',
        lastUpdated: 'June 2026',
        source: "IRS & HMRC",
      },
      {
        label: 'Compound Interest', icon: '📈', path: '/compound',
        title: "Compound Interest Calculator — Watch Money Grow | JoinCalc",
        description: "See what your savings become with compound growth and monthly deposits — S&P 500 and savings-account presets built in. Free, instant results.",
        keywords: 'compound interest calculator, compound growth calculator',
        lastUpdated: 'June 2026',
        source: "standard compound-interest formula",
      },
    ],
  },
  {
    category: '💼 Income & Employment',
    items: [
      {
        label: 'Salary & Tax', icon: '💼', path: '/salary',
        title: "Salary Calculator 2026 — Take-Home Pay After Tax | JoinCalc",
        description: "See your real take-home pay for 2026 in seconds — income tax, NI/FICA and monthly net for the US, UK, Canada & Australia. Free, no sign-up.",
        keywords: 'salary calculator 2026, take home pay calculator, after tax income calculator',
        lastUpdated: 'April 2026',
        source: "IRS, HMRC, CRA & ATO",
      },
      {
        label: 'Hourly to Salary', icon: '⏱️', path: '/hourly-to-salary',
        title: "Hourly to Salary Calculator — Wage to Annual Pay | JoinCalc",
        description: "Convert any hourly rate to yearly, monthly and weekly pay in one click — e.g. $25/hour is $52,000 a year. Free, instant, no sign-up.",
        keywords: 'hourly to salary calculator, hourly wage to annual salary, 25 an hour is how much a year, wage converter',
        lastUpdated: 'July 2026',
        source: "standard payroll formula",
      },
      {
        label: 'Pay Rise', icon: '📈', path: '/pay-rise',
        title: "Pay Rise Calculator UK — What You Actually Keep | JoinCalc",
        description: "Got a pay rise? See your new salary and how much of the rise survives tax and NI — most people keep just 58–72%. Free, instant answer.",
        keywords: 'pay rise calculator uk, salary increase calculator, pay rise after tax, how much of my pay rise will i keep',
        lastUpdated: 'June 2026',
        source: "HMRC",
      },
      {
        label: 'Redundancy Pay', icon: '📋', path: '/redundancy',
        title: "Redundancy Pay Calculator UK 2026 | JoinCalc",
        description: "Facing redundancy? Check your exact statutory entitlement in seconds — 2026 £751 weekly cap and the £30,000 tax-free limit. Free tool.",
        keywords: 'redundancy pay calculator UK 2026, statutory redundancy calculator',
        lastUpdated: 'April 2026',
        source: "GOV.UK",
      },
      {
        label: 'Holiday Entitlement', icon: '🌴', path: '/holiday',
        title: "Holiday Entitlement Calculator UK 2026 | JoinCalc",
        description: "Work out your exact statutory holiday allowance — full-time, part-time and irregular hours, including bank holidays. Free & instant.",
        keywords: 'holiday entitlement calculator UK 2026, statutory holiday calculator',
        lastUpdated: 'April 2026',
        source: "GOV.UK",
      },
      {
        label: 'Student Loan', icon: '🎓', path: '/student-loan',
        title: "Student Loan Repayment Calculator UK — All Plans | JoinCalc",
        description: "See your real monthly student loan repayment for Plan 1, 2, 4, 5 or Postgraduate — and when it's written off. Free, takes 20 seconds.",
        keywords: 'student loan calculator UK 2026, student loan repayment calculator, plan 2 student loan',
        lastUpdated: 'April 2026',
        source: "GOV.UK",
      },
      {
        label: 'Loan Calculator', icon: '🏦', path: '/loan',
        title: "Loan Repayment Calculator — Payment & Interest | JoinCalc",
        description: "Get your exact monthly payment, total interest and full amortization schedule for any loan, rate and term. Free — no sign-up, no email.",
        keywords: 'loan calculator, monthly payment calculator, amortization calculator',
        lastUpdated: 'June 2026',
        source: "standard amortization formula",
      },
    ],
  },
  {
    category: '💳 Loans & Debt',
    items: [
      {
        label: 'Credit Card Payoff', icon: '💳', path: '/credit-card-payoff',
        title: "Credit Card Payoff Calculator — Debt-Free Date | JoinCalc",
        description: "Find your debt-free date and total interest — and see what paying more than the minimum really saves you. Free, private, instant.",
        keywords: 'credit card payoff calculator, credit card interest calculator, pay off credit card, minimum payment calculator, debt payoff calculator',
        lastUpdated: 'June 2026',
        source: "standard amortization formula",
      },
      {
        label: 'Auto Loan', icon: '🚗', path: '/auto-loan',
        title: "Auto Loan Calculator — Monthly Car Payment | JoinCalc",
        description: "Get your real monthly car payment with tax, down payment and trade-in included — plus total interest by term. Free, no sign-up.",
        keywords: 'auto loan calculator, car loan calculator, car payment calculator, monthly car payment, vehicle finance calculator',
        lastUpdated: 'June 2026',
        source: "standard amortization formula",
      },
      {
        label: 'Debt Consolidation', icon: '📉', path: '/debt-consolidation',
        title: "Debt Consolidation Calculator — Will You Save? | JoinCalc",
        description: "Compare your current debts against a consolidation loan — new payment, total interest with fees, and exactly how much you save (or lose). Free.",
        keywords: 'debt consolidation calculator, debt consolidation loan calculator, should i consolidate debt, consolidation savings calculator',
        lastUpdated: 'July 2026',
        source: "standard amortization formula",
      },
    ],
  },
]

const allTabs = NAV.flatMap(g => g.items)
const STATIC_PAGES = ['/privacy', '/terms', '/about', '/contact', '/uk-tax-rates-2026', '/us-tax-rates-2026']

const CALC_CATEGORY = {}
NAV.forEach(g => g.items.forEach(it => { CALC_CATEGORY[it.path] = g.category }))

// Suggest related calculators (same category first, then fill) — increases
// internal linking and pages per session, the key lever for ad revenue.
function relatedCalcs(path) {
  const cat = CALC_CATEGORY[path]
  const same = allTabs.filter(t => CALC_CATEGORY[t.path] === cat && t.path !== path)
  const others = allTabs.filter(t => CALC_CATEGORY[t.path] !== cat && t.path !== path)
  return [...same, ...others].slice(0, 4)
}

function RelatedCalcs({ path }) {
  const items = relatedCalcs(path)
  if (!items.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h2 className="text-sm font-bold text-gray-700 mb-3">Related Calculators</h2>
      <div className="grid grid-cols-2 gap-2">
        {items.map(t => (
          <Link key={t.path} to={t.path}
            className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg px-3 py-2 transition-colors">
            <span>{t.icon}</span>
            <span className="font-medium leading-tight">{t.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="no-print border-t border-gray-100 mt-10 pt-6 pb-8 text-center">
      <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-gray-400">
        <Link to="/" className="hover:text-indigo-500">All Calculators</Link>
        <Link to="/guides" className="hover:text-indigo-500">Guides</Link>
        <Link to="/uk-tax-rates-2026" className="hover:text-indigo-500">2026 Tax Tables</Link>
        <Link to="/about" className="hover:text-indigo-500">About</Link>
        <Link to="/contact" className="hover:text-indigo-500">Contact</Link>
        <Link to="/privacy" className="hover:text-indigo-500">Privacy Policy</Link>
        <Link to="/terms" className="hover:text-indigo-500">Terms of Service</Link>
        <button
          onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
          className="hover:text-indigo-500"
        >
          Cookie settings
        </button>
      </nav>
      <p className="text-xs text-gray-300 mt-3">
        © 2026 JoinCalc — Free financial calculators for the US, UK, Canada &amp; Australia.
        Estimates only; not financial advice.
      </p>
    </footer>
  )
}

function Sidebar({ onClose }) {
  const location = useLocation()
  // Normalise the trailing slash so active states work on /salary/ etc.
  const path = location.pathname !== '/' ? location.pathname.replace(/\/+$/, '') : '/'
  return (
    <nav className="flex flex-col h-full">
      <div className="p-5 border-b border-gray-100">
        <Link to="/" onClick={onClose}><Logo size="md" theme="light" /></Link>
      </div>
      <div className="flex-1 overflow-y-auto py-3 px-3">
        <Link to="/" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-3 text-sm font-medium transition-all ${
            path === '/' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          <span className="text-base w-5 text-center">🏠</span>
          <span>All Calculators</span>
        </Link>
        <Link to="/guides" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-3 text-sm font-medium transition-all ${
            path.startsWith('/guides') ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          <span className="text-base w-5 text-center">📚</span>
          <span>Money Guides</span>
        </Link>
        <Link to="/uk-tax-rates-2026" onClick={onClose}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-3 text-sm font-medium transition-all ${
            path.includes('-tax-rates-') ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'
          }`}>
          <span className="text-base w-5 text-center">📊</span>
          <span>2026 Tax Tables</span>
        </Link>
        {NAV.map((group) => (
          <div key={group.category} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1">
              {group.category}
            </p>
            {group.items.map((tab) => {
              const isActive = path === tab.path
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
        <Link to="/about" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500">About JoinCalc</Link>
        <Link to="/contact" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500">Contact</Link>
        <Link to="/privacy" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500">Privacy Policy</Link>
        <Link to="/terms" onClick={onClose} className="block text-xs text-gray-400 hover:text-indigo-500">Terms of Service</Link>
        <p className="text-xs text-gray-300 mt-2">© 2026 JoinCalc</p>
      </div>
    </nav>
  )
}

export function Layout() {
  const location = useLocation()
  // The host serves pages at trailing-slash URLs (/salary/), which is also the
  // canonical form. Normalise before any flag/lookup comparison so /salary/ is
  // recognised as the salary calculator — not mistaken for a /salary/:slug
  // landing (which previously stripped the page chrome on canonical URLs).
  const path = location.pathname !== '/' ? location.pathname.replace(/\/+$/, '') : '/'
  const isStatic = STATIC_PAGES.includes(path)
  const isHome = path === '/'
  // Programmatic SEO landing pages (e.g. /salary/50000-after-tax-uk) and guide
  // articles own their own <Helmet>, heading and disclaimer, so they render
  // without the card chrome. (After normalisation, /salary/ no longer matches.)
  const isLanding = ['/salary/', '/stamp-duty/', '/capital-gains/', '/mortgage/', '/auto-loan/', '/credit-card-payoff/'].some(p => path.startsWith(p))
  const isGuide = path === '/guides' || path.startsWith('/guides/')
  // Static pages (about/contact/privacy/terms) set their own <Helmet>, so the
  // layout must not also emit title/description/canonical for them.
  const ownsMeta = isLanding || isGuide || isStatic
  const currentTab = allTabs.find(t => t.path === path)
  const relatedGuide = CALC_GUIDE[path]
  // Unknown URL → 404 page (renders without the calculator card/chrome).
  const isUnknown = !isHome && !isStatic && !isGuide && !isLanding && !currentTab
  const [mobileOpen, setMobileOpen] = useState(false)

  // Embeddable calculators render chrome-less (no sidebar/header/footer/cookie
  // banner) so third-party sites can iframe them.
  if (location.pathname.startsWith('/embed/')) {
    return (
      <Routes>
        <Route path="/embed/:slug" element={<EmbedCalc />} />
      </Routes>
    )
  }

  const seoTitle = isHome
    ? 'Free Financial Calculators 2026 — Tax, Salary & More | JoinCalc'
    : isStatic ? 'JoinCalc — Free Financial Calculators'
    : currentTab?.title || 'JoinCalc'

  const seoDesc = isHome
    ? '25 free calculators for tax, salary, mortgage, debt and retirement — 2026 rates for the US & UK. Instant answers in your browser, no sign-up ever.'
    : currentTab?.description || ''

  const seoKeywords = isHome
    ? 'financial calculator, stamp duty calculator 2026, corporation tax calculator UK, self employed tax calculator, social security calculator 2026, pension credit calculator, national insurance calculator, mortgage affordability, 401k calculator, salary calculator'
    : currentTab?.keywords || ''

  // Normalise trailing slash so the canonical matches the prerendered one
  // regardless of how the host serves /path vs /path/.
  // The host (Cloudflare Pages) serves directory-style pages with a trailing
  // slash and 308-redirects /salary -> /salary/. So the canonical (and sitemap)
  // must use the trailing-slash form to point at the real, non-redirecting URL.
  const canonicalPath = path === '/' ? '/' : path + '/'
  const canonicalUrl = `https://joincalc.com${canonicalPath}`

  // WebSite + Organization JSON-LD live in index.html (every page), so they are
  // not re-injected here. Only page-specific schema is emitted below.
  const schemaApp = currentTab ? { "@context": "https://schema.org", "@type": "SoftwareApplication", "name": currentTab.title, "applicationCategory": "FinanceApplication", "operatingSystem": "Web", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }, "description": currentTab.description, "url": canonicalUrl, "image": "https://joincalc.com/og-image.png", "dateModified": "2026-06-30", "provider": { "@type": "Organization", "name": "JoinCalc", "url": "https://joincalc.com" } } : null
  // NOTE: no auto-generated FAQPage schema here. Google requires FAQ markup to
  // mirror FAQs visible on the page; the old one-question schema ("What is the
  // X calculator?") never appeared in the page body, which reads as spammy
  // structured data. Guides emit real FAQPage schema that matches their
  // visible FAQ sections.
  const schemaBreadcrumb = !isHome && !isStatic && currentTab ? { "@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": "Home", "item": "https://joincalc.com" }, { "@type": "ListItem", "position": 2, "name": currentTab.label, "item": canonicalUrl }] } : null

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Helmet>
        {/* Page-specific tags are skipped on pages that own their own <Helmet>
            (/salary/:slug landings and /guides articles). */}
        {!ownsMeta && <title>{seoTitle}</title>}
        {!ownsMeta && <meta name="description" content={seoDesc} />}
        {!ownsMeta && <meta name="keywords" content={seoKeywords} />}
        {!ownsMeta && <meta property="og:title" content={seoTitle} />}
        {!ownsMeta && <meta property="og:description" content={seoDesc} />}
        {!ownsMeta && <meta property="og:url" content={canonicalUrl} />}
        {!ownsMeta && <meta name="twitter:title" content={seoTitle} />}
        {!ownsMeta && <meta name="twitter:description" content={seoDesc} />}
        {!ownsMeta && <link rel="canonical" href={canonicalUrl} />}
        {/* Route-independent defaults below */}
        <meta name="author" content="JoinCalc" />
        {/* Landing/guide pages set their own robots; the 404 sets noindex. */}
        {!ownsMeta && !isUnknown && <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="JoinCalc" />
        <meta property="og:image" content="https://joincalc.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://joincalc.com/og-image.png" />
        {currentTab?.lastUpdated && <meta name="revised" content={currentTab.lastUpdated} />}
        {schemaApp && <script type="application/ld+json">{JSON.stringify(schemaApp)}</script>}
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
              <div className="text-lg font-bold text-gray-800">{currentTab.label}</div>
              {currentTab.lastUpdated && (
                <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full"
                  title={currentTab.source ? `Figures checked against ${currentTab.source}` : undefined}>
                  ✓ {currentTab.source ? `Checked against ${currentTab.source}` : 'Verified'} · {currentTab.lastUpdated}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-0.5">{currentTab.description}</p>
          </header>
        )}

        {isHome && (
          <header className="hidden md:block bg-white border-b border-gray-200 px-8 py-4">
            <div className="text-lg font-bold text-gray-800">All Calculators</div>
            <p className="text-sm text-gray-400 mt-0.5">Free financial calculators for US, UK, Canada & Australia — updated for 2026</p>
          </header>
        )}

        <main className="max-w-2xl mx-auto px-4 md:px-8 py-6">
          {isStatic && (
            <Link to="/" className="text-sm text-indigo-600 hover:underline block mb-4">← Back to Calculators</Link>
          )}
          <div className={(isStatic || isHome || ownsMeta || isUnknown) ? '' : 'bg-white rounded-2xl border border-gray-200 p-6'}>
            <Routes>
              <Route path="/"                   element={<Home />} />
              <Route path="/salary/:slug"       element={<SalaryLanding />} />
              <Route path="/stamp-duty/:slug"   element={<StampDutyLanding />} />
              <Route path="/capital-gains/:slug" element={<CapitalGainsLanding />} />
              <Route path="/mortgage/:slug"     element={<MortgageLanding />} />
              <Route path="/auto-loan/:slug"    element={<AutoLoanLanding />} />
              <Route path="/credit-card-payoff/:slug" element={<CreditCardLanding />} />
              <Route path="/vat"                element={<VATCalc />} />
              <Route path="/pay-rise"           element={<PayRiseCalc />} />
              <Route path="/credit-card-payoff" element={<CreditCardPayoffCalc />} />
              <Route path="/auto-loan"          element={<AutoLoanCalc />} />
              <Route path="/refinance"          element={<RefinanceCalc />} />
              <Route path="/hourly-to-salary"   element={<HourlyToSalaryCalc />} />
              <Route path="/debt-consolidation" element={<DebtConsolidationCalc />} />
              <Route path="/uk-tax-rates-2026"  element={<TaxTablesUK />} />
              <Route path="/us-tax-rates-2026"  element={<TaxTablesUS />} />
              <Route path="/guides"             element={<GuidesIndex />} />
              <Route path="/guides/:slug"       element={<ArticlePage />} />
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
              <Route path="/corporation-tax"    element={<CorporationTaxCalc />} />
              <Route path="/pension-credit"     element={<PensionCreditCalc />} />
              <Route path="/social-security"    element={<SocialSecurityCalc />} />
              <Route path="/privacy"            element={<Privacy />} />
              <Route path="/terms"              element={<TermsOfService />} />
              <Route path="/about"              element={<About />} />
              <Route path="/contact"            element={<Contact />} />
              <Route path="*"                  element={<NotFound />} />
            </Routes>
          </div>

          {!isStatic && !isHome && !isUnknown && (
            <div className="mt-4 space-y-2">
              {relatedGuide && (
                <Link to={`/guides/${relatedGuide.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                  <p className="text-xs text-indigo-500 font-semibold mb-0.5">📖 Read the guide</p>
                  <p className="text-sm font-bold text-gray-800">{relatedGuide.label}</p>
                </Link>
              )}
              <ResultActions />
              {currentTab && <EmbedSnippet slug={currentTab.path.slice(1)} label={currentTab.label} />}
              {currentTab && <RelatedCalcs path={currentTab.path} />}
              {!ownsMeta && (
                <>
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
                </>
              )}
            </div>
          )}

          <SiteFooter />
        </main>
      </div>

      <CookieConsent />
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