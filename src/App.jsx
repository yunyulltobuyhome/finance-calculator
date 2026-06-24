import { useState } from 'react'
import DividendCalc from './components/DividendCalc'
import LoanCalc from './components/LoanCalc'
import CompoundCalc from './components/CompoundCalc'
import Privacy from './components/Privacy'

const tabs = [
  { label: 'Dividend', icon: '💰' },
  { label: 'Loan', icon: '🏠' },
  { label: 'Compound', icon: '📈' },
]

export default function App() {
  const [active, setActive] = useState(0)
  const [page, setPage] = useState('home')

  if (page === 'privacy') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <button onClick={() => setPage('home')} className="text-sm text-indigo-600 hover:underline">
            ← Back to Calculator
          </button>
        </header>
        <Privacy />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-800">Finance Calculator</h1>
        <p className="text-sm text-gray-500">Dividend · Loan · Compound Interest</p>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
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
          {active === 0 && <DividendCalc />}
          {active === 1 && <LoanCalc />}
          {active === 2 && <CompoundCalc />}
        </div>

        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <p className="text-xs text-yellow-700 leading-relaxed">
            ⚠️ <strong>Disclaimer:</strong> This tool is for informational and educational purposes only.
            It does not constitute financial, tax, or legal advice. Tax rates shown are approximate and
            may not reflect your personal situation. Always consult a qualified financial advisor or tax
            professional before making investment decisions.
          </p>
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-gray-400 space-x-4">
        <span>© 2026 Finance Calculator</span>
        <button onClick={() => setPage('privacy')} className="hover:text-indigo-600 hover:underline">
          Privacy Policy
        </button>
        <span>All rights reserved.</span>
      </footer>
    </div>
  )
}