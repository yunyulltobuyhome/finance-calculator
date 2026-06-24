import { useState } from 'react'
import FIRECalc from './components/FIRECalc'
import DividendCalc from './components/DividendCalc'
import LoanCalc from './components/LoanCalc'
import CompoundCalc from './components/CompoundCalc'
import SalaryCalc from './components/SalaryCalc'
import Privacy from './components/Privacy'

export default function App() {
  const [page, setPage] = useState('home')
  const [active, setActive] = useState(0)

  const tabs = [
    { label: 'FIRE', icon: '🔥' },
    { label: 'Dividend', icon: '💰' },
    { label: 'Loan', icon: '🏠' },
    { label: 'Salary', icon: '💼' },
    { label: 'Compound', icon: '📈' },
  ]

  if (page === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <button onClick={() => setPage('home')} className="text-sm text-indigo-600 hover:underline">
            ← Back to Calculators
          </button>
        </header>
        <Privacy />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">JoinCalc</h1>
        <p className="text-sm text-gray-500">Free Financial Calculators - FIRE, Dividends, Loans, Salary & More</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                active === i
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          {active === 0 && <FIRECalc />}
          {active === 1 && <DividendCalc />}
          {active === 2 && <LoanCalc />}
          {active === 3 && <SalaryCalc />}
          {active === 4 && <CompoundCalc />}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-700 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> For informational purposes only. Not financial, tax, or legal advice. Always consult professionals.
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 space-x-4">
        <span>© 2026 JoinCalc</span>
        <button onClick={() => setPage('privacy')} className="hover:text-indigo-600 hover:underline">
          Privacy Policy
        </button>
      </footer>
    </div>
  )
}