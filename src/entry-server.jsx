import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import { Layout } from './App'

// Renders a route to a static HTML string for build-time prerendering.
// React 19 emits <title>/<meta>/<link> at the front (before the root <div>);
// prerender.js relocates that block into <head>.
export function render(url) {
  return renderToString(
    <HelmetProvider>
      <StaticRouter location={url}>
        <Layout />
      </StaticRouter>
    </HelmetProvider>
  )
}
