import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Every figure on this page mirrors the constants used by the live calculators,
// so the tables and the tools can never disagree.
function Section({ title, calc, children, note }) {
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-bold text-gray-800">{title}</h2>
        {calc && (
          <Link to={calc.path} className="text-xs font-semibold text-indigo-600 hover:underline shrink-0 ml-3">
            {calc.label} →
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">{children}</div>
      {note && <p className="text-xs text-gray-400 mt-2">{note}</p>}
    </section>
  )
}

function T({ headers, rows }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="bg-gray-50">
          {headers.map((h, i) => (
            <th key={i} className="text-left p-2 border border-gray-200 font-semibold text-xs">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
            {row.map((cell, j) => (
              <td key={j} className={`p-2 border border-gray-200 text-xs ${j === row.length - 1 ? 'text-indigo-600 font-semibold' : ''}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function TaxTablesUK() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>UK Tax Rates & Thresholds 2026/27 — All Tables | JoinCalc</title>
        <meta name="description" content="Every UK tax rate and threshold for 2026/27 on one page: income tax bands, National Insurance, dividends, CGT, stamp duty, VAT, corporation tax, IHT and more." />
        <meta name="keywords" content="uk tax rates 2026/27, income tax bands 2026, national insurance thresholds 2026, dividend allowance 2026, cgt allowance 2026, tax tables uk" />
        <link rel="canonical" href="https://joincalc.com/uk-tax-rates-2026/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:title" content="UK Tax Rates & Thresholds 2026/27 — All Tables | JoinCalc" />
        <meta property="og:description" content="Every UK tax rate and threshold for 2026/27 on one page: income tax bands, National Insurance, dividends, CGT, stamp duty, VAT, corporation tax, IHT and more." />
        <meta property="og:url" content="https://joincalc.com/uk-tax-rates-2026/" />
        <meta name="twitter:title" content="UK Tax Rates & Thresholds 2026/27 — All Tables | JoinCalc" />
        <meta name="twitter:description" content="Every UK tax rate and threshold for 2026/27 on one page: income tax bands, National Insurance, dividends, CGT, stamp duty, VAT, corporation tax, IHT and more." />
      </Helmet>

      <h1 className="text-2xl font-black text-gray-800 mb-2">UK Tax Rates &amp; Thresholds 2026/27</h1>
      <p className="text-sm text-gray-500 mb-1">
        Every headline UK rate and threshold for the 2026/27 tax year on a single page — the same figures
        used by our calculators, checked against HMRC and GOV.UK. Looking for the US?{' '}
        <Link to="/us-tax-rates-2026" className="text-indigo-600 hover:underline font-medium">US tax tables →</Link>
      </p>
      <p className="text-xs text-emerald-700 bg-emerald-50 inline-flex items-center gap-1 rounded-full px-2.5 py-1 mb-6">
        ✓ Checked against HMRC &amp; GOV.UK · July 2026
      </p>

      {/* The tables are the easy part. This is the context that actually
          answers what people came to work out. */}
      <section className="mb-8 text-sm text-gray-600 leading-relaxed space-y-3">
        <h2 className="text-base font-bold text-gray-800">How to read these tables</h2>
        <p>
          Income Tax and National Insurance are charged separately, on different rules, and both come out of the
          same payslip — which is why your take-home never matches the Income Tax table on its own. The bands
          below are <strong>marginal</strong>: crossing into the higher rate does not tax your whole salary at
          40%, only the pounds above £50,270.
        </p>
        <div className="overflow-x-auto">
          <T headers={['Salary', 'Income Tax', 'National Insurance', 'Total deducted', 'Effective rate']} rows={[
            ['£30,000', '£3,486', '£1,394', '£4,880', '16.3%'],
            ['£55,000', '£9,432', '£3,111', '£12,543', '22.8%'],
            ['£110,000', '£33,432', '£4,211', '£37,643', '34.2%'],
          ]} />
        </div>
        <p className="text-xs text-gray-400">
          England, Wales and Northern Ireland, standard tax code, no pension or student loan. Scotland sets its
          own Income Tax bands.
        </p>
        <p>
          Notice that National Insurance moves the opposite way to Income Tax. NI is 8% between £12,570 and
          £50,270 but only <strong>2%</strong> above it, so at exactly the point Income Tax doubles from 20% to
          40%, NI drops by six points. The combined marginal rate goes from 28% to 42% — a real jump, but not the
          doubling the headline rates suggest.
        </p>
        <h3 className="text-sm font-bold text-gray-800 pt-2">The £100,000 trap</h3>
        <p>
          The most expensive band in the UK system is not the 45% additional rate — it is the stretch between
          £100,000 and £125,140. The personal allowance is withdrawn by £1 for every £2 earned above £100,000, so
          each extra pound is taxed at 40% <em>and</em> costs you 50p of tax-free allowance. The effective rate on
          that slice is <strong>60%</strong>, or 62% once the 2% NI is added — higher than anything paid by
          someone on £200,000.
        </p>
        <p>
          This is why a pension contribution is worth far more in that band than anywhere else. Salary sacrifice
          reduces the income the taper is measured against, so contributing enough to bring your income back to
          £100,000 restores the full allowance: £1,000 sacrificed can cost as little as £380 of take-home pay.
          A bonus that pushes you just over £100,000 is often worth redirecting into a pension for exactly this
          reason.
        </p>
      </section>

      <Section title="Income Tax bands" calc={{ path: '/salary', label: 'Take-home calculator' }}
        note="The personal allowance shrinks by £1 for every £2 earned above £100,000, disappearing entirely at £125,140. Scotland sets its own bands.">
        <T headers={['Band', 'Taxable income', 'Rate']} rows={[
          ['Personal allowance', 'Up to £12,570', '0%'],
          ['Basic rate', '£12,571 – £50,270', '20%'],
          ['Higher rate', '£50,271 – £125,140', '40%'],
          ['Additional rate', 'Over £125,140', '45%'],
        ]} />
      </Section>

      <Section title="National Insurance (Class 1, employees)" calc={{ path: '/national-insurance', label: 'NI calculator' }}
        note="Employers pay 15% on employee earnings above £5,000 a year. Employees stop paying NI at State Pension age.">
        <T headers={['Earnings', 'Employee rate']} rows={[
          ['Up to £12,570', '0%'],
          ['£12,570 – £50,270', '8%'],
          ['Above £50,270', '2%'],
        ]} />
      </Section>

      <Section title="Self-employed (Class 4 NI)" calc={{ path: '/self-employed', label: 'Self-employed calculator' }}>
        <T headers={['Profits', 'Class 4 rate']} rows={[
          ['Up to £12,570', '0%'],
          ['£12,570 – £50,270', '6%'],
          ['Above £50,270', '2%'],
        ]} />
      </Section>

      <Section title="Dividend tax" calc={{ path: '/dividend', label: 'Dividend calculator' }}
        note="The first £500 of dividends is tax-free (dividend allowance). Rates apply by your overall income band.">
        <T headers={['Band', 'Rate on dividends']} rows={[
          ['Dividend allowance', '£500 at 0%'],
          ['Basic rate', '8.75%'],
          ['Higher rate', '33.75%'],
          ['Additional rate', '39.35%'],
        ]} />
      </Section>

      <Section title="Capital Gains Tax" calc={{ path: '/capital-gains', label: 'CGT calculator' }}
        note="Gains stack on top of income: the part within the basic-rate band is taxed at 18%, the rest at 24%.">
        <T headers={['Item', 'Amount / rate']} rows={[
          ['Annual exempt amount', '£3,000'],
          ['Basic-rate taxpayer', '18%'],
          ['Higher/additional-rate taxpayer', '24%'],
        ]} />
      </Section>

      <Section title="Stamp Duty Land Tax (England & NI)" calc={{ path: '/stamp-duty', label: 'Stamp duty calculator' }}
        note="First-time buyers: 0% to £300,000, then 5% to £500,000 (no relief above £500,000). Additional properties add 5% to every band; non-UK residents add a further 2%.">
        <T headers={['Portion of price', 'Standard rate']} rows={[
          ['Up to £125,000', '0%'],
          ['£125,001 – £250,000', '2%'],
          ['£250,001 – £925,000', '5%'],
          ['£925,001 – £1,500,000', '10%'],
          ['Above £1,500,000', '12%'],
        ]} />
      </Section>

      <Section title="Corporation Tax" calc={{ path: '/corporation-tax', label: 'Corporation tax calculator' }}>
        <T headers={['Profits', 'Rate']} rows={[
          ['Up to £50,000', '19% (small profits rate)'],
          ['£50,000 – £250,000', 'Marginal relief (19–25%)'],
          ['Above £250,000', '25% (main rate)'],
        ]} />
      </Section>

      <Section title="VAT" calc={{ path: '/vat', label: 'VAT calculator' }}
        note="Registration is compulsory once VAT-taxable turnover passes £90,000.">
        <T headers={['Rate', '%', 'Examples']} rows={[
          ['Standard', '20%', 'Most goods and services'],
          ['Reduced', '5%', "Domestic energy, children's car seats"],
          ['Zero', '0%', "Most food, books, children's clothing"],
        ]} />
      </Section>

      <Section title="Inheritance Tax" calc={{ path: '/inheritance-tax', label: 'IHT calculator' }}
        note="The residence nil-rate band applies when a home passes to direct descendants. Unused allowances transfer between spouses.">
        <T headers={['Item', 'Amount / rate']} rows={[
          ['Nil-rate band', '£325,000'],
          ['Residence nil-rate band', '£175,000'],
          ['Standard IHT rate', '40%'],
          ['Rate with 10%+ left to charity', '36%'],
        ]} />
      </Section>

      <Section title="Student loan repayment thresholds" calc={{ path: '/student-loan', label: 'Student loan calculator' }}
        note="You repay 9% of income above your threshold (6% for Postgraduate loans).">
        <T headers={['Plan', 'Annual threshold', 'Rate']} rows={[
          ['Plan 1', '£24,990', '9%'],
          ['Plan 2', '£29,385', '9%'],
          ['Plan 4 (Scotland)', '£32,745', '9%'],
          ['Plan 5', '£25,000', '9%'],
          ['Postgraduate', '£21,000', '6%'],
        ]} />
      </Section>

      <Section title="Redundancy pay" calc={{ path: '/redundancy', label: 'Redundancy calculator' }}>
        <T headers={['Item', 'Amount']} rows={[
          ['Weekly pay cap (England, Wales, Scotland)', '£751'],
          ['Weekly pay cap (Northern Ireland)', '£749'],
          ['Maximum years of service counted', '20'],
          ['Tax-free limit on redundancy pay', '£30,000'],
        ]} />
      </Section>

      <Section title="Pensions & other allowances" calc={{ path: '/retirement', label: 'Pension calculator' }}>
        <T headers={['Item', 'Amount']} rows={[
          ['Pension annual allowance', '£60,000'],
          ['Pension Credit minimum guarantee (single)', '£227.10 / week'],
          ['Pension Credit minimum guarantee (couple)', '£346.60 / week'],
          ['Statutory holiday entitlement', '5.6 weeks (28-day cap)'],
        ]} />
      </Section>

      <section className="mb-8 text-sm text-gray-600 leading-relaxed space-y-3 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-gray-800">Where these numbers change what you do</h2>
        <p>
          <strong>Capital Gains Tax stacks on top of your income.</strong> The £3,000 annual exempt amount comes
          off first, then whatever is left is taxed at 18% for the part that still fits inside your basic-rate
          band and 24% above it. A £20,000 gain for a basic-rate taxpayer leaves £17,000 taxable — about £3,060.
          Because the allowance renews each April, splitting a large disposal across two tax years can save the
          tax on a second £3,000, and transfers between spouses are exempt, which doubles the allowance available
          to a couple.
        </p>
        <p>
          <strong>Dividends are taxed far more lightly than salary.</strong> After the £500 allowance the rates
          are 8.75%, 33.75% and 39.35% — and dividends carry no National Insurance at all. That gap is the whole
          reason company directors take a small salary and the rest as dividends, though the profit has already
          borne Corporation Tax on the way out.
        </p>
        <p>
          <strong>Stamp duty is banded, not a cliff.</strong> Only the slice of the price inside each band is
          charged at that band's rate, so nudging just over £250,000 costs 5% on the excess, not on the whole
          purchase. The genuine cliff is first-time buyer relief, which stops entirely above £500,000 — at
          £500,001 a first-time buyer pays the full standard rate on the lot.
        </p>
        <p>
          <strong>Student loan repayments behave like an extra tax band.</strong> You repay 9% of everything above
          your plan's threshold (6% for Postgraduate), on top of Income Tax and NI. For a Plan 2 graduate earning
          above £50,270 the combined marginal deduction is 51%, and someone with both an undergraduate and a
          postgraduate loan pays more still.
        </p>
      </section>

      <div className="mt-10 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-gray-800">Frequently Asked Questions</h2>
        {[
          { q: 'When does the 2026/27 tax year run?', a: 'The UK tax year runs from 6 April 2026 to 5 April 2027. New rates and thresholds normally take effect from the first day of the tax year.' },
          { q: 'Why do the thresholds stay the same each year?', a: 'Several thresholds — including the £12,570 personal allowance and £50,270 higher-rate threshold — have been frozen for multiple years. As wages rise with inflation, more income drifts into higher bands, an effect known as fiscal drag.' },
          { q: 'Do these rates apply in Scotland?', a: 'National Insurance, VAT, CGT and most other taxes apply UK-wide, but Scotland sets its own income tax bands and rates, and Scotland and Wales replace stamp duty with LBTT and LTT respectively.' },
          { q: 'What is the 60% tax trap?', a: 'Between £100,000 and £125,140 the personal allowance is withdrawn by £1 for every £2 earned, so each extra pound is taxed at 40% and also costs 50p of tax-free allowance. The effective rate on that band is 60%, or 62% with National Insurance — higher than the 45% additional rate paid above £125,140.' },
          { q: 'How much of a pay rise do I actually keep?', a: 'It depends on the band you are in, not your average rate. A basic-rate taxpayer keeps about 72p of each extra pound after 20% tax and 8% NI; a higher-rate taxpayer keeps 58p; someone in the £100,000–£125,140 taper keeps only 38p. Add a student loan and each figure drops a further 9p.' },
          { q: 'Does a pension contribution save tax at my marginal rate?', a: 'Yes. Contributions come out before Income Tax, so relief is given at the highest rate you pay — and with salary sacrifice National Insurance is saved too. This is most powerful in the £100,000–£125,140 band, where sacrificing back under £100,000 also restores the full personal allowance.' },
        ].map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-700 mb-1">{f.q}</p>
            <p className="text-gray-600 text-xs leading-relaxed">{f.a}</p>
          </div>
        ))}
        <p className="text-xs text-gray-400">
          Figures mirror the constants used by our calculators and are checked against HMRC and GOV.UK
          publications. Rates can change at fiscal events — always confirm on GOV.UK before acting.
        </p>
      </div>
    </div>
  )
}
