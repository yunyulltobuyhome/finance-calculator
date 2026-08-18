import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function About() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>About JoinCalc — Free Financial Calculators</title>
        <meta name="description" content="About JoinCalc: free, accurate financial calculators for the US, UK, Canada and Australia, built on official IRS, HMRC, ATO and CRA sources and updated for 2026." />
        <link rel="canonical" href="https://joincalc.com/about/" />
      </Helmet>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">About JoinCalc</h1>
      <p className="text-sm text-gray-500 mb-8">Free financial calculators for the US, UK, Canada and Australia</p>

      <div className="space-y-8 text-sm text-gray-600">
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What is JoinCalc?</h2>
          <p className="leading-relaxed">
            JoinCalc is a free set of financial calculators for people in the US, UK, Canada and Australia,
            covering tax, property, retirement, debt and investment questions — all built on the 2026 rates and
            thresholds published by the relevant tax authority.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Who runs this site</h2>
          <p className="leading-relaxed mb-3">
            JoinCalc is an independent site, built and maintained by one person rather than a company or an
            editorial team. There is no staff behind the word &ldquo;we&rdquo; anywhere on this site, and it seems
            more useful to say so than to imply otherwise.
          </p>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-1.5">I am not an accountant, tax adviser or financial planner.</p>
            <p className="text-xs leading-relaxed">
              I hold no professional financial qualification, and nothing on this site is personal advice. What
              this site does is narrower and, I think, more honest: it applies the rules and rates that HMRC, the
              IRS and other authorities publish, shows the arithmetic behind each result, and documents where
              every figure came from. Judging whether a result fits your circumstances is a separate question —
              and for anything with real financial consequences, that is a conversation to have with a qualified
              professional.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why you can check the numbers yourself</h2>
          <p className="leading-relaxed mb-3">
            Since you have no credentials of mine to rely on, the calculations are built to be verifiable
            instead:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 leading-relaxed">
            <li>Every calculator shows a badge naming the authority its figures come from and the date they were last checked.</li>
            <li>The published <Link to="/uk-tax-rates-2026" className="text-indigo-600 hover:underline">UK</Link> and <Link to="/us-tax-rates-2026" className="text-indigo-600 hover:underline">US</Link> rate tables are written from the same constants the calculators use, so a table and the tool it links to cannot disagree.</li>
            <li>Results are checked against a separately written implementation of the published rules before release, rather than against the code&apos;s own output.</li>
            <li>Known limitations are listed openly — filing status, which US states are covered, excluded local taxes — instead of being left for you to discover.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            The full detail is on the{' '}
            <Link to="/methodology" className="text-indigo-600 hover:underline font-medium">How We Calculate</Link>{' '}
            page. If a figure looks wrong, please say so — a specific report is genuinely welcome, and
            corrections are made as soon as the error can be verified against the source.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Data sources</h2>
          <p className="leading-relaxed mb-3">
            Every rate, threshold and allowance comes from the responsible authority&apos;s own published figures —
            not from other calculator sites — and is updated when that authority confirms a change.
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { country: '🇺🇸 United States', sources: [
                { name: 'IRS — Tax Brackets & 401(k) Limits', url: 'https://www.irs.gov' },
                { name: 'Freddie Mac — Mortgage Rate Survey', url: 'https://www.freddiemac.com/pmms' },
              ]},
              { country: '🇬🇧 United Kingdom', sources: [
                { name: 'HMRC — Income Tax & NI Rates', url: 'https://www.gov.uk/government/organisations/hm-revenue-customs' },
                { name: 'GOV.UK — Stamp Duty & IHT Rates', url: 'https://www.gov.uk/stamp-duty-land-tax' },
              ]},
              { country: '🇨🇦 Canada', sources: [
                { name: 'CRA — Federal & Provincial Tax Rates', url: 'https://www.canada.ca/en/revenue-agency.html' },
              ]},
              { country: '🇦🇺 Australia', sources: [
                { name: 'ATO — Income Tax & Medicare Levy', url: 'https://www.ato.gov.au' },
              ]},
            ].map((item) => (
              <div key={item.country} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-2">{item.country}</p>
                <ul className="space-y-1">
                  {item.sources.map((s) => (
                    <li key={s.name}>
                      <a href={s.url} target="_blank" rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline text-xs">
                        ↗ {s.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How rates are kept up to date</h2>
          <p className="leading-relaxed">
            Tax rates change on a predictable cycle: the IRS publishes inflation adjustments in the autumn for
            the following January, and the UK confirms rates at fiscal events for the tax year starting 6 April.
            Calculators are updated when the responsible body confirms new figures — not when they are proposed
            or reported. Each calculator and guide carries a &ldquo;✓ Checked against&nbsp;…&rdquo; badge naming
            the specific body its figures are based on (HMRC, IRS, SSA, GOV.UK) and the date it was last
            verified, so you can judge how current a page is rather than assuming. Tools that use a standard
            financial formula rather than a government-set rate — loan amortisation, the 4% retirement rule —
            say so directly instead of citing an authority that does not apply.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Important Disclaimer</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold mb-2">⚠️ For informational purposes only</p>
            <p>
              JoinCalc calculators provide estimates based on standard tax rules and publicly available rates.
              They do not constitute financial, tax, or legal advice, and are not produced by a qualified
              professional. Individual circumstances vary and tax situations can be complex — always consult a
              qualified financial adviser, tax professional or solicitor before making significant financial
              decisions.
            </p>
            <p className="mt-2">
              Results may differ from your actual liability because of personal allowances, deductions,
              exemptions, local taxes or legislative changes the calculators do not model. The known
              limitations are listed in full on the How We Calculate page.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How the site is funded</h2>
          <p className="leading-relaxed">
            JoinCalc is funded by advertising. Every calculator is free, there is no premium tier, no account
            and no paywall, and no lead or mailing list is ever sold — none of which would be possible anyway,
            since calculations run entirely in your browser and your numbers are never transmitted or stored.
            Advertising is separate from the calculations: no result, ranking or comparison on this site is
            influenced by an advertiser. Where a page concludes that one option costs less than another, that
            comes from the arithmetic on the page and nothing else.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Contact and corrections</h2>
          <p className="leading-relaxed">
            Found a figure that looks wrong, or want a calculator that does not exist yet? Please get in touch.
            A calculator is only worth using if it is accurate, so corrections are taken seriously and made as
            soon as the error can be verified against the source. The most useful reports name the page, the
            inputs you used and the result you expected.
          </p>
          <a href="mailto:hello@joincalc.com"
            className="inline-block mt-3 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors">
            Contact Us
          </a>
        </section>
      </div>
    </div>
  )
}