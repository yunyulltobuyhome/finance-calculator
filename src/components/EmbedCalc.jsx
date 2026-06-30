import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { CALC_REGISTRY } from '../calculatorRegistry'

// Chrome-less calculator for embedding on third-party sites via <iframe>.
// Posts its height to the parent window so the host iframe can auto-resize,
// and carries a "Powered by JoinCalc" backlink. Always noindex.
export default function EmbedCalc() {
  const { slug } = useParams()
  const entry = CALC_REGISTRY[slug]

  useEffect(() => {
    if (!entry) return
    const post = () => {
      const height = document.documentElement.scrollHeight
      try { window.parent?.postMessage({ type: 'joincalc-embed-height', slug, height }, '*') } catch { /* cross-origin */ }
    }
    post()
    const ro = new ResizeObserver(post)
    ro.observe(document.body)
    window.addEventListener('load', post)
    return () => { ro.disconnect(); window.removeEventListener('load', post) }
  }, [slug, entry])

  if (!entry) {
    return (
      <div className="min-h-screen bg-white p-6 text-center text-sm text-gray-600">
        <p>Calculator not found.</p>
        <a href="https://joincalc.com" target="_top" rel="noopener" className="text-indigo-600 font-semibold">Browse JoinCalc calculators →</a>
      </div>
    )
  }

  const C = entry.C
  return (
    <div className="bg-white p-4">
      <Helmet>
        <title>{entry.label} — JoinCalc</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <C />
      <div className="mt-5 pt-3 border-t border-gray-100 text-center">
        <a href={`https://joincalc.com/${slug}`} target="_top" rel="noopener"
          className="text-xs text-gray-400 hover:text-indigo-600">
          Powered by <span className="font-semibold text-indigo-600">JoinCalc</span> — free financial calculators
        </a>
      </div>
    </div>
  )
}
