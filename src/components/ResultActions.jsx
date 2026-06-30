import { useState } from 'react'

// Free "premium" utilities that competitor calculators usually paywall:
//  • Print / Save as PDF — uses the browser print dialog + a print stylesheet
//    (see index.css) that strips the nav, ads and buttons for a clean report.
//  • Share — native share sheet on mobile, clipboard copy everywhere else.
// Both are 100% client-side, no data leaves the browser, no legal risk.
export default function ResultActions() {
  const [copied, setCopied] = useState(false)

  const handlePrint = () => window.print()

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const shareData = {
      title: document.title,
      text: 'Check out this free financial calculator on JoinCalc',
      url,
    }
    try {
      if (navigator.share) {
        await navigator.share(shareData)
        return
      }
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // User dismissed the share sheet or clipboard was blocked — ignore.
    }
  }

  return (
    <div className="no-print flex flex-wrap items-center gap-2">
      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
        aria-label="Print or save this calculation as a PDF"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print / Save PDF
      </button>
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
        aria-label="Share this calculator"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        {copied ? 'Link copied!' : 'Share'}
      </button>
    </div>
  )
}
