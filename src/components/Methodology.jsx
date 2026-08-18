import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function Block({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="text-base font-bold text-gray-800 mb-2">{title}</h2>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

export default function Methodology() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>How We Calculate — Methodology & Sources | JoinCalc</title>
        <meta name="description" content="Exactly how JoinCalc calculators work: the formula behind each tool, where every tax figure comes from, how figures are verified, the limitations we know about, and how to report an error." />
        <meta name="keywords" content="joincalc methodology, how tax calculators work, calculator accuracy, tax calculator sources" />
        <link rel="canonical" href="https://joincalc.com/methodology/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:title" content="How We Calculate — Methodology & Sources | JoinCalc" />
        <meta property="og:description" content="The formula behind each calculator, where every figure comes from, how it is verified, and the limitations we know about." />
        <meta property="og:url" content="https://joincalc.com/methodology/" />
      </Helmet>

      <h1 className="text-2xl font-black text-gray-800 mb-2">How We Calculate</h1>
      <p className="text-sm text-gray-500 mb-6">
        Most calculators give you a number and no way to check it. This page documents the method behind every
        tool on the site, the source of each figure, and — just as importantly — what our calculators do
        <em> not</em> account for.
      </p>

      <Block title="Everything runs in your browser">
        <p>
          No calculation on this site is sent anywhere. Every tool is JavaScript that executes on your own
          device, which means your salary, debts, property value and estate details never reach our servers —
          because there is no server-side calculation to send them to. We do not store, log or transmit anything
          you type into a calculator.
        </p>
        <p>
          A practical consequence: results are instant and work offline once the page has loaded, and there is
          no account to create. It also means we cannot recover a calculation for you — sharing a result works
          by encoding your inputs into the page URL, which stays entirely on your side.
        </p>
      </Block>

      <Block title="Where the tax figures come from">
        <p>
          Every rate, threshold and allowance is taken from the responsible authority's own published figures,
          not from other calculator sites:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Area</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Source</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['US federal income tax, standard deduction, capital gains, estate tax, 401(k) limits', 'IRS'],
                ['US Social Security and Medicare rates and wage cap', 'SSA / IRS'],
                ['US state income tax schedules', 'Each state’s published rate schedule (e.g. California FTB)'],
                ['UK Income Tax, National Insurance, dividends, CGT, IHT, VAT, Corporation Tax', 'HMRC and GOV.UK'],
                ['UK stamp duty (SDLT), redundancy caps, holiday entitlement, student loan plans', 'GOV.UK'],
                ['Canada federal and provincial rates, CPP, EI', 'CRA'],
                ['Australia income tax, Medicare levy, superannuation', 'ATO'],
              ].map(([a, s], i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border border-gray-200">{a}</td>
                  <td className="p-2 border border-gray-200 font-medium">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Tools that use a standard financial formula rather than a government-set rate — loan amortisation,
          compound interest, the 4% retirement rule — say so on the page instead of citing an authority that
          does not apply to them.
        </p>
      </Block>

      <Block title="How the figures are kept consistent">
        <p>
          A recurring failure in calculator sites is that different pages quietly disagree: the rate table says
          one thing and the calculator does another. We avoid that structurally rather than by proofreading.
        </p>
        <p>
          The <Link to="/uk-tax-rates-2026" className="text-indigo-600 hover:underline">UK</Link> and{' '}
          <Link to="/us-tax-rates-2026" className="text-indigo-600 hover:underline">US</Link> rate tables are
          written from the same constants the calculators use, so a published table and the tool it links to
          cannot drift apart. The US tax engine — federal brackets, the standard deduction, FICA and state
          schedules — is a single shared module, which is why the paycheck calculator, the state comparison and
          mortgage affordability always return the same take-home figure for the same salary.
        </p>
        <p>
          Calculations are checked against an independently written implementation of the published rules before
          being released, rather than against the code's own output. Where a result has a known correct answer —
          the UK 60% personal-allowance taper band, the point National Insurance drops to 2%, a full bracket
          schedule at several income levels — those are the cases used to verify it.
        </p>
      </Block>

      <Block title="What our calculators do not do">
        <p>
          Stating limitations plainly is more useful than implying precision we do not have. Known simplifications:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Filing status.</strong> US figures assume a single filer taking the standard deduction unless a tool explicitly offers married filing jointly. Itemised deductions are not modelled.</li>
          <li><strong>US state coverage.</strong> State income tax covers California, New York, Illinois, Texas, Florida, Nevada and Washington. Other states are not yet included.</li>
          <li><strong>Local taxes.</strong> City and county income taxes are excluded — most significantly New York City, whose residents pay a separate local income tax on top of the state figure shown.</li>
          <li><strong>Scotland.</strong> UK Income Tax figures use the England, Wales and Northern Ireland bands. Scotland sets its own and is not separately modelled.</li>
          <li><strong>Benefits and credits.</strong> Means-tested benefits, tax credits, child benefit and the High Income Child Benefit Charge are not included in take-home figures.</li>
          <li><strong>Investment returns.</strong> Projections use a fixed annual rate you choose. Real markets do not deliver constant returns, and no figure on this site is adjusted for inflation unless the page says so.</li>
          <li><strong>Interest rates.</strong> Default rates in loan and mortgage tools are illustrative starting points, not live market quotes. Always use a rate you have actually been offered.</li>
        </ul>
        <p>
          None of these make a result useless — they make it an estimate, which is what it is labelled as. For
          anything with a real financial consequence, confirm with the relevant authority or a qualified
          professional.
        </p>
      </Block>

      <Block title="Updates and corrections">
        <p>
          Tax rates change on a predictable cycle: the IRS publishes inflation adjustments in the autumn for the
          following January, and the UK confirms rates at fiscal events for the tax year starting 6 April. We
          update the calculators when the responsible body confirms new figures, not when they are proposed or
          reported.
        </p>
        <p>
          Each calculator shows a badge naming the body its figures come from and the date they were last
          verified, so you can judge how current a page is rather than assuming.
        </p>
        <p>
          If you believe a figure is wrong, please tell us — a specific report (the page, the input you used and
          the result you expected) is genuinely useful and we would rather hear it than not. You can reach us
          via the <Link to="/contact" className="text-indigo-600 hover:underline">contact page</Link>. Corrections
          to a calculation are made as soon as we can verify the error against the source.
        </p>
      </Block>

      <Block title="How this site is funded">
        <p>
          JoinCalc is free and carries advertising. We do not charge for any calculator, there is no premium
          tier, and we do not sell leads, mailing lists or user data — none of which would be possible anyway,
          since calculations never leave your browser.
        </p>
        <p>
          Advertising is served by Google AdSense and is not connected to our calculations: no result, ranking
          or recommendation on this site is influenced by an advertiser. Where a page suggests one option is
          cheaper than another, that conclusion comes from the arithmetic on the page and nothing else.
        </p>
      </Block>

      <p className="text-xs text-gray-400 border-t border-gray-100 pt-4">
        Results are estimates and do not constitute financial, tax or legal advice. See our{' '}
        <Link to="/terms" className="text-indigo-600 hover:underline">terms</Link> and{' '}
        <Link to="/privacy" className="text-indigo-600 hover:underline">privacy policy</Link>.
      </p>
    </div>
  )
}
