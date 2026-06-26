export default function About() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">About JoinCalc</h1>
      <p className="text-sm text-gray-500 mb-8">Free financial calculators for the US, UK, Canada and Australia</p>

      <div className="space-y-8 text-sm text-gray-600">
        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What is JoinCalc?</h2>
          <p className="leading-relaxed">
            JoinCalc is a free financial calculator platform designed to help individuals in the US, UK, Canada,
            and Australia make better financial decisions. Our tools cover tax calculations, property decisions,
            retirement planning, and investment projections — all updated for 2026 rates and legislation.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Our Data Sources</h2>
          <p className="leading-relaxed mb-3">
            All tax rates, thresholds, and financial rules used in our calculators are sourced directly
            from official government publications and updated whenever legislation changes.
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
          <h2 className="text-base font-bold text-gray-800 mb-3">How We Keep Rates Updated</h2>
          <p className="leading-relaxed">
            Tax rates change every year. We monitor official government announcements — including the
            UK Autumn Budget, US IRS inflation adjustments, and Australian ATO updates — and update
            our calculators as soon as new rates are confirmed. Each calculator displays its last
            verified date so you always know how current the information is.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Important Disclaimer</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold mb-2">⚠️ For informational purposes only</p>
            <p>
              JoinCalc calculators provide estimates based on standard tax rules and publicly available rates.
              They do not constitute financial, tax, or legal advice. Individual circumstances vary, and tax
              situations can be complex. Always consult a qualified financial advisor, tax professional,
              or solicitor before making significant financial decisions.
            </p>
            <p className="mt-2">
              Results may differ from your actual tax liability due to personal allowances, deductions,
              exemptions, or legislative changes not captured by our calculators.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why Free?</h2>
          <p className="leading-relaxed">
            JoinCalc is funded by Google AdSense advertising — small, non-intrusive ads that appear
            on our pages. This allows us to offer all calculators completely free, with no account
            required, no data collection, and no paywalls. All calculations happen instantly
            in your browser — we never see your numbers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Contact</h2>
          <p className="leading-relaxed">
            Found an error in our rates? Have a suggestion for a new calculator?
            We'd love to hear from you. Our calculators are only useful if they're accurate,
            so we take rate corrections seriously.
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