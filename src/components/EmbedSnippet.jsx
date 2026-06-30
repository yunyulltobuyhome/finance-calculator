import { useState } from 'react'
import { CALC_REGISTRY } from '../calculatorRegistry'

// "Embed this calculator" — gives site owners a copy-paste snippet. The snippet
// renders an auto-resizing iframe plus an attribution <a> in the host's own HTML,
// which is the actual backlink to JoinCalc.
export default function EmbedSnippet({ slug, label }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  if (!CALC_REGISTRY[slug]) return null // only offer embeds we can serve
  label = CALC_REGISTRY[slug].label || label
  const id = `joincalc-${slug}`

  const code =
`<iframe id="${id}" src="https://joincalc.com/embed/${slug}" title="${label} by JoinCalc" loading="lazy" style="width:100%;max-width:520px;border:0;height:640px"></iframe>
<script>window.addEventListener("message",function(e){if(e.data&&e.data.type==="joincalc-embed-height"&&e.data.slug==="${slug}"){var f=document.getElementById("${id}");if(f){f.style.height=e.data.height+"px";}}});</script>
<p style="font-size:12px;color:#6b7280">Powered by <a href="https://joincalc.com/${slug}" target="_blank" rel="noopener">${label} — JoinCalc</a></p>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  return (
    <div className="no-print bg-white border border-gray-200 rounded-xl p-4">
      <button onClick={() => setOpen(o => !o)} className="flex w-full items-center gap-2 text-sm font-bold text-gray-700">
        <span className="font-mono text-indigo-600">&lt;/&gt;</span>
        <span>Embed this calculator on your site — free</span>
        <span className="ml-auto text-gray-400">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">
            Paste this into your website. It adds a free, auto-resizing calculator and a credit link back to JoinCalc.
          </p>
          <textarea readOnly value={code} onClick={e => e.target.select()} rows={5}
            className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          <button onClick={copy}
            className="mt-2 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors">
            {copied ? '✓ Copied!' : 'Copy embed code'}
          </button>
        </div>
      )}
    </div>
  )
}
