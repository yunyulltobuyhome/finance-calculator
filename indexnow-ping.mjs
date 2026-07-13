// Post-build IndexNow ping: tells Bing/DuckDuckGo/Yandex-family engines to
// (re)crawl every URL in the sitemap immediately. Google ignores IndexNow,
// but the Bing family indexes new domains far faster than Google, so this
// diversifies search traffic with zero ongoing effort.
//
// Intentionally NON-FATAL: any network failure just logs and exits 0 so the
// build never breaks (e.g. in sandboxes without outbound network).
import fs from 'node:fs'

const KEY = '14d90d7fffee2fbb320247400bafa136'
const HOST = 'joincalc.com'

try {
  const sitemap = fs.readFileSync(new URL('./dist/sitemap.xml', import.meta.url), 'utf8')
  const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1])
  if (urlList.length === 0) throw new Error('no URLs found in dist/sitemap.xml')

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(15000),
  })
  console.log(`IndexNow: submitted ${urlList.length} URLs — HTTP ${res.status}`)
} catch (err) {
  console.log(`IndexNow ping skipped (non-fatal): ${err.message}`)
}
