import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const KEY = 'joincalc_cookie_consent'

// Lightweight, self-contained cookie notice. It records the visitor's choice in
// localStorage and is re-openable from the footer "Cookie settings" link. It is
// intentionally non-blocking — it never hides page content from crawlers and does
// not interfere with a Google-certified CMP if one is later enabled in AdSense.
export default function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true)
    } catch {
      // localStorage blocked (private mode) — show once for this session.
      setOpen(true)
    }
    const reopen = () => setOpen(true)
    window.addEventListener('open-cookie-settings', reopen)
    return () => window.removeEventListener('open-cookie-settings', reopen)
  }, [])

  const choose = (value) => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      /* ignore storage errors */
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="no-print fixed bottom-0 inset-x-0 z-50 p-3 md:p-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-xl rounded-2xl p-4 md:flex md:items-center md:gap-4">
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          🍪 We use cookies to keep JoinCalc free, including cookies set by Google AdSense to show
          relevant ads. Calculations always run in your browser and we collect no personal data.
          See our{' '}
          <Link to="/privacy" className="text-indigo-600 hover:underline font-medium">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2 mt-3 md:mt-0 shrink-0">
          <button
            onClick={() => choose('rejected')}
            className="flex-1 md:flex-none text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 transition-colors"
          >
            Reject non-essential
          </button>
          <button
            onClick={() => choose('accepted')}
            className="flex-1 md:flex-none text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg px-4 py-2 transition-colors"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
