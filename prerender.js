// Build-time prerendering: render every URL in the sitemap to static HTML so
// crawlers (and a brand-new domain's limited crawl/render budget) get full
// content + correct title/meta/canonical without executing JavaScript.
// Pure Node — no headless browser — so it runs in any deploy build environment.
import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const dist = path.join(__dirname, 'dist')

const { render } = await import('./dist-ssr/entry-server.js')

const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8')

// Routes come straight from the sitemap, so prerender and sitemap never drift.
const sitemap = fs.readFileSync(path.join(dist, 'sitemap.xml'), 'utf8')
const routes = [...new Set(
  [...sitemap.matchAll(/<loc>https:\/\/joincalc\.com(\/[^<]*)?<\/loc>/g)]
    .map(m => m[1] || '/')
    .map(p => (p !== '/' && p.endsWith('/') ? p.slice(0, -1) : p))
)]

// Replace helpers that use a function so '$' / '£' in content is never treated
// as a special replacement pattern.
const sub = (str, pattern, value) => str.replace(pattern, () => value)

let ok = 0
for (const route of routes) {
  let appHtml
  try {
    appHtml = render(route)
  } catch (err) {
    console.error(`prerender failed for ${route}:`, err.message)
    continue
  }

  // React 19 hoists <title>/<meta>/<link> ahead of the root <div>. Split there:
  // everything before is the page <head>; everything after is the app body.
  const firstDiv = appHtml.indexOf('<div')
  const metaBlock = firstDiv > -1 ? appHtml.slice(0, firstDiv) : ''
  const body = firstDiv > -1 ? appHtml.slice(firstDiv) : appHtml

  const titleMatch = metaBlock.match(/<title>([\s\S]*?)<\/title>/)
  const pageTitle = titleMatch ? titleMatch[1] : null
  const headTags = metaBlock.replace(/<title>[\s\S]*?<\/title>/, '')

  let page = sub(template, '<div id="root"></div>', `<div id="root">${body}</div>`)
  if (pageTitle) page = sub(page, /<title>[\s\S]*?<\/title>/, `<title>${pageTitle}</title>`)
  page = sub(page, '</head>', `${headTags}</head>`)

  // Rewrite internal links to the trailing-slash form the host serves with a
  // 200, so crawlers following prerendered links never hit the /path -> /path/
  // 308 redirect (which kept non-canonical URL variants alive in Search
  // Console). Only touches extension-less, root-relative paths; files like
  // /og-image.png, /sitemap.xml and external URLs are left alone. After JS
  // loads, React Router intercepts clicks anyway, so users are unaffected.
  page = page.replace(/href="(\/[a-zA-Z0-9-]+(?:\/[a-zA-Z0-9-]+)*)"/g, 'href="$1/"')

  const outPath = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html')
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, page)
  ok++
}

console.log(`Prerendered ${ok}/${routes.length} routes.`)
