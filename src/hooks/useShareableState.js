import { useState, useEffect, useRef } from 'react'

// Keeps a calculator's inputs in the URL query string, so "Share" / bookmark /
// paste-into-a-forum reproduces the exact scenario the user was looking at
// instead of dumping them on a blank calculator.
//
// Everything stays client-side: values are only ever written to the address bar
// via history.replaceState (no navigation, no history spam, no network call).
// SSR-safe — during prerender there is no window, so defaults are used.

function decode(defaults) {
  if (typeof window === 'undefined') return defaults
  const sp = new URLSearchParams(window.location.search)
  const out = { ...defaults }
  for (const key of Object.keys(defaults)) {
    const raw = sp.get(key)
    if (raw === null) continue
    const def = defaults[key]
    if (typeof def === 'number') {
      const n = Number(raw)
      if (Number.isFinite(n)) out[key] = n
    } else if (typeof def === 'boolean') {
      out[key] = raw === '1' || raw === 'true'
    } else {
      // Cap free-text length so a hand-edited URL can't bloat the input.
      out[key] = raw.slice(0, 120)
    }
  }
  return out
}

export default function useShareableState(defaults) {
  const [state, setState] = useState(() => decode(defaults))
  // Don't touch the URL until the user actually changes something — a freshly
  // loaded page should keep its clean canonical address.
  const pristine = useRef(true)

  useEffect(() => {
    if (pristine.current) {
      pristine.current = false
      return
    }
    if (typeof window === 'undefined') return

    const sp = new URLSearchParams()
    for (const key of Object.keys(defaults)) {
      const val = state[key]
      if (val === undefined || val === null || val === '') continue
      // Values still at their default are implied — leaving them out keeps
      // shared links short and readable.
      if (String(val) === String(defaults[key])) continue
      sp.set(key, typeof val === 'boolean' ? (val ? '1' : '0') : String(val))
    }

    const qs = sp.toString()
    const { pathname } = window.location
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
    // `defaults` is a literal defined at call site; state is the real dependency.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  return [state, setState]
}
