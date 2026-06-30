import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const POPULAR = [
  { label: 'Salary Take-Home', path: '/salary', icon: '💼' },
  { label: 'Stamp Duty', path: '/stamp-duty', icon: '🏛️' },
  { label: 'VAT Calculator', path: '/vat', icon: '🧮' },
  { label: 'Mortgage', path: '/mortgage', icon: '🔑' },
  { label: 'Capital Gains Tax', path: '/capital-gains', icon: '📊' },
  { label: 'National Insurance', path: '/national-insurance', icon: '🏥' },
]

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 text-center">
      <Helmet>
        <title>Page Not Found — JoinCalc</title>
        {/* Avoid a soft 404: tell crawlers not to index missing pages. */}
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <p className="text-6xl mb-4">🧮</p>
      <h1 className="text-2xl font-black text-gray-800 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-8">
        The page you're looking for doesn't exist or has moved. Try one of our popular free calculators instead.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
        {POPULAR.map(c => (
          <Link key={c.path} to={c.path}
            className="flex items-center gap-2 text-sm text-gray-600 bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl px-3 py-3 transition-colors">
            <span>{c.icon}</span>
            <span className="font-medium leading-tight text-left">{c.label}</span>
          </Link>
        ))}
      </div>

      <Link to="/" className="inline-block bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
        ← Back to all calculators
      </Link>
    </div>
  )
}
