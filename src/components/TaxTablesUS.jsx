import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

// Figures mirror the constants used by the live calculators (IRS/SSA-sourced).
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

export default function TaxTablesUS() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>US Tax Brackets & Limits 2026 — All Tables | JoinCalc</title>
        <meta name="description" content="Every headline US federal tax figure for 2026 on one page: income tax brackets (single & married), standard deduction, FICA, capital gains, 401(k) limits and estate tax." />
        <meta name="keywords" content="2026 tax brackets, us tax rates 2026, standard deduction 2026, 401k limit 2026, capital gains brackets 2026, fica rates 2026" />
        <link rel="canonical" href="https://joincalc.com/us-tax-rates-2026/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
      </Helmet>

      <h1 className="text-2xl font-black text-gray-800 mb-2">US Tax Brackets &amp; Limits 2026</h1>
      <p className="text-sm text-gray-500 mb-1">
        The headline federal figures for 2026 in one place — the same numbers our calculators use, checked
        against IRS publications. Looking for the UK?{' '}
        <Link to="/uk-tax-rates-2026" className="text-indigo-600 hover:underline font-medium">UK tax tables →</Link>
      </p>
      <p className="text-xs text-emerald-700 bg-emerald-50 inline-flex items-center gap-1 rounded-full px-2.5 py-1 mb-6">
        ✓ Checked against IRS · July 2026
      </p>

      <Section title="Federal income tax brackets — Single" calc={{ path: '/salary', label: 'Take-home calculator' }}
        note="Applied to taxable income (after the standard deduction). Only the slice inside each bracket is taxed at that rate.">
        <T headers={['Taxable income', 'Rate']} rows={[
          ['Up to $11,925', '10%'],
          ['$11,925 – $48,475', '12%'],
          ['$48,475 – $103,350', '22%'],
          ['$103,350 – $197,300', '24%'],
          ['$197,300 – $250,525', '32%'],
          ['$250,525 – $626,350', '35%'],
          ['Above $626,350', '37%'],
        ]} />
      </Section>

      <Section title="Federal income tax brackets — Married filing jointly">
        <T headers={['Taxable income', 'Rate']} rows={[
          ['Up to $23,850', '10%'],
          ['$23,850 – $96,950', '12%'],
          ['$96,950 – $206,700', '22%'],
          ['$206,700 – $394,600', '24%'],
          ['$394,600 – $501,050', '32%'],
          ['$501,050 – $751,600', '35%'],
          ['Above $751,600', '37%'],
        ]} />
      </Section>

      <Section title="Standard deduction & FICA" calc={{ path: '/salary', label: 'Take-home calculator' }}
        note="State income tax comes on top in most states; Texas, Florida and a handful of others have none.">
        <T headers={['Item', 'Amount / rate']} rows={[
          ['Standard deduction (single)', '$16,100'],
          ['Social Security tax', '6.2% on wages up to $184,500'],
          ['Medicare tax', '1.45% (no cap)'],
        ]} />
      </Section>

      <Section title="Long-term capital gains — Single" calc={{ path: '/capital-gains', label: 'CGT calculator' }}
        note="Assets held over one year. Short-term gains are taxed as ordinary income. High earners may owe an extra 3.8% NIIT above $200,000 (single) / $250,000 (married).">
        <T headers={['Taxable income', 'LTCG rate']} rows={[
          ['Up to $49,450', '0%'],
          ['$49,450 – $545,500', '15%'],
          ['Above $545,500', '20%'],
        ]} />
      </Section>

      <Section title="Long-term capital gains — Married filing jointly">
        <T headers={['Taxable income', 'LTCG rate']} rows={[
          ['Up to $98,900', '0%'],
          ['$98,900 – $613,700', '15%'],
          ['Above $613,700', '20%'],
        ]} />
      </Section>

      <Section title="Retirement contribution limits" calc={{ path: '/retirement', label: '401k calculator' }}
        note="The ages 60–63 “super catch-up” allows the higher limit in those years only.">
        <T headers={['401(k) limit', 'Amount']} rows={[
          ['Under 50', '$24,500'],
          ['50 and over (catch-up)', '$32,500'],
          ['Ages 60–63 (super catch-up)', '$35,750'],
        ]} />
      </Section>

      <Section title="Estate tax" calc={{ path: '/inheritance-tax', label: 'Estate tax calculator' }}>
        <T headers={['Item', 'Amount / rate']} rows={[
          ['Federal estate tax exemption', '$15,000,000'],
          ['Top estate tax rate', '40%'],
        ]} />
      </Section>

      <div className="mt-10 space-y-3 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <h2 className="text-base font-bold text-gray-800">Frequently Asked Questions</h2>
        {[
          { q: 'Are these the rates for my 2026 paychecks or my 2026 tax return?', a: 'These are the 2026 tax-year figures — they apply to income earned during calendar year 2026, which you report on the return filed in early 2027.' },
          { q: 'Do tax brackets change every year?', a: 'Yes. The IRS adjusts bracket thresholds, the standard deduction and contribution limits for inflation each fall, effective the following January.' },
          { q: 'Does moving into a higher bracket raise tax on all my income?', a: 'No — the US system is marginal. Only the dollars inside each bracket are taxed at that bracket’s rate, so a raise can never leave you with less after-tax income from the brackets alone.' },
        ].map((f, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-4">
            <p className="font-semibold text-gray-700 mb-1">{f.q}</p>
            <p className="text-gray-600 text-xs leading-relaxed">{f.a}</p>
          </div>
        ))}
        <p className="text-xs text-gray-400">
          Figures mirror the constants used by our calculators, checked against IRS publications.
          State taxes vary — confirm with the IRS or a tax professional before acting.
        </p>
      </div>
    </div>
  )
}
