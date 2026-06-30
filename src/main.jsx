import React from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

// Pages are prerendered to static HTML at build time (see prerender.js) so
// crawlers get full content + correct <head> metadata without running JS.
// React 19 hoists/reconciles its own metadata into <head> on mount, so we
// render (rather than hydrate) to avoid mismatches with the injected head;
// the prerendered markup already painted, so users still see content instantly.
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)
