import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function Finding({ n, title, headline, children, calc }) {
  return (
    <section className="mb-10">
      <p className="text-xs font-mono text-indigo-600 mb-1">FINDING {n}</p>
      <h2 className="text-lg font-bold text-gray-800 mb-2">{title}</h2>
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-3">
        <p className="text-sm text-indigo-900 font-medium leading-relaxed">{headline}</p>
      </div>
      <div className="text-sm text-gray-600 leading-relaxed space-y-3">{children}</div>
      {calc && (
        <p className="text-xs text-gray-500 mt-3">
          Check it yourself:{' '}
          <Link to={calc.path} className="text-indigo-600 hover:underline font-medium">{calc.label} →</Link>
        </p>
      )}
    </section>
  )
}

function T({ headers, rows, highlight }) {
  return (
    <div className="overflow-x-auto">
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
            <tr key={i} className={highlight === i ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.map((cell, j) => (
                <td key={j} className={`p-2 border border-gray-200 text-xs ${j > 0 ? 'font-semibold text-indigo-600' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function TaxCliffs() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>Tax Cliffs &amp; Quirks — What We Found Running the Numbers | JoinCalc</title>
        <meta name="description" content="Original analysis from our own tax engine: the UK salary where you keep only 29p of the next pound, the US income where a raise lowers your marginal rate, and the exact point California overtakes Illinois." />
        <meta name="keywords" content="60% tax trap uk, worst salary to earn uk, does a pay rise lower take home, marginal tax rate cliff, social security wage cap raise, california vs illinois tax crossover" />
        <link rel="canonical" href="https://joincalc.com/tax-cliffs/" />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta property="og:title" content="Tax Cliffs & Quirks — What We Found Running the Numbers | JoinCalc" />
        <meta property="og:description" content="Five things the tax rules do that almost nobody expects, computed from published rates — with the exact figures." />
        <meta property="og:url" content="https://joincalc.com/tax-cliffs/" />
      </Helmet>

      <h1 className="text-2xl font-black text-gray-800 mb-2">Tax Cliffs &amp; Quirks</h1>
      <p className="text-sm text-gray-500 mb-4">
        Five things the tax rules actually do that almost nobody expects — found by running our own calculators
        across every income level rather than by reading about them.
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-8 text-xs text-gray-600 leading-relaxed">
        <p className="font-semibold text-gray-700 mb-1">How these were produced</p>
        <p>
          Each finding below comes from sweeping a calculator across a range of incomes and recording where the
          result changes direction — not from a source we are summarising. The method is simple enough to
          reproduce: compute the outcome at income <em>X</em> and at <em>X</em> + 1,000, and the difference is
          the marginal effect at that point. Every figure uses the 2026 rates published by HMRC and the IRS, and
          every finding links to the calculator you can verify it with.
        </p>
      </div>

      <Finding
        n="01"
        title="The UK salary where you keep only 29p of the next pound"
        headline="A graduate on £101,000 with a Plan 2 student loan loses 71% of their next £1,000 — a higher marginal rate than someone earning £130,000, who loses 56%."
        calc={{ path: '/salary', label: 'Paycheck & salary calculator' }}
      >
        <p>
          Three separate rules stack in the same band. Above £100,000 the personal allowance is withdrawn by £1
          for every £2 earned, which taxes that slice at an effective 60%. National Insurance adds 2%. A Plan 2
          student loan takes another 9%. Together that is 71%, and it applies from £100,000 until the allowance
          is exhausted at £125,140.
        </p>
        <T
          headers={['Salary (Plan 2 loan)', 'Deducted from the next £1,000']}
          rows={[
            ['£28,000', '28%'],
            ['£35,000', '37%'],
            ['£55,000', '51%'],
            ['£101,000', '71%'],
            ['£115,000', '71%'],
            ['£130,000', '56%'],
          ]}
          highlight={3}
        />
        <p>
          The striking part is the last row. Once income passes £125,140 the allowance is already gone, so there
          is nothing further to withdraw and the marginal rate <em>falls</em>. A £130,000 earner keeps 44p of
          their next pound; a £101,000 earner keeps 29p. Being paid £29,000 less leaves you facing the higher
          marginal rate.
        </p>
      </Finding>

      <Finding
        n="02"
        title="Pension relief is worth most in the middle, not at the top"
        headline="£1,000 into a pension costs £580 of take-home at £55,000, only £380 at £105,000 — then rises back to £530 at £130,000."
        calc={{ path: '/salary', label: 'Try a contribution percentage' }}
      >
        <p>
          Pension contributions are usually described as being worth your marginal rate, which implies the
          benefit rises steadily with income. It does not. Because salary sacrifice reduces the income the
          personal-allowance taper is measured against, a contribution inside the £100,000–£125,140 band buys
          back allowance as well as relief — and then loses that extra benefit once you are above the band.
        </p>
        <T
          headers={['Salary', 'What £1,000 into a pension costs your take-home']}
          rows={[
            ['£30,000', '£720'],
            ['£55,000', '£580'],
            ['£99,000', '£580'],
            ['£105,000', '£380'],
            ['£120,000', '£380'],
            ['£130,000', '£530'],
            ['£200,000', '£530'],
          ]}
          highlight={3}
        />
        <p>
          A £200,000 earner and a £130,000 earner get identical value from the same contribution. Someone on
          £110,000 gets noticeably more than either. The cost curve is not monotonic, which is the opposite of
          how pension relief is normally explained.
        </p>
      </Finding>

      <Finding
        n="03"
        title="In the US, one pay rise lowers your marginal rate"
        headline="Crossing $184,500 of wages drops the marginal rate on your next $1,000 from 31.6% to 25.4%, because Social Security stops."
        calc={{ path: '/salary', label: 'US paycheck calculator' }}
      >
        <p>
          Social Security is charged at 6.2% on wages up to the annual cap and nothing above it. Medicare
          continues uncapped. The result is a rare downward step in an otherwise rising system: earnings past
          the cap are cheaper at the margin than the earnings just below it.
        </p>
        <T
          headers={['Wages', 'Marginal rate on next $1,000 (federal + FICA)']}
          rows={[
            ['$180,000', '31.6%'],
            ['$184,000', '28.5%'],
            ['$186,000', '25.4%'],
            ['$190,000', '25.4%'],
          ]}
          highlight={2}
        />
        <p>
          For anyone paid monthly this shows up mid-year rather than as an abstraction: take-home rises in the
          month the cap is crossed and stays higher until January resets it. State income tax is excluded here
          so the underlying federal effect is visible on its own.
        </p>
      </Finding>

      <Finding
        n="04"
        title="California overtakes Illinois at exactly $88,180"
        headline="Below $88,180, 'high-tax' California charges less state income tax than flat-rate Illinois. Above it, the order flips permanently."
        calc={{ path: '/state-tax-comparison', label: 'State tax comparison' }}
      >
        <p>
          California's top rate is 12.3% and Illinois charges a flat 4.95%, which makes the outcome look
          obvious. It is not, because a progressive schedule charges its lowest rates first: a Californian pays
          1%, 2%, 4% and 6% on successive slices before reaching anything higher, while a flat rate applies to
          the first dollar and the last alike.
        </p>
        <T
          headers={['Salary', 'California state tax', 'Illinois state tax']}
          rows={[
            ['$78,180', '$3,298', '$3,733'],
            ['$88,180', 'crossover point', 'crossover point'],
            ['$108,180', '$6,088', '$5,218'],
          ]}
          highlight={1}
        />
        <p>
          We found the crossover by stepping through salaries in $10 increments until the sign of the difference
          changed. The practical consequence is that a headline top rate tells you very little about your own
          bill — flat taxes fall hardest on lower earners, and that is measurable rather than rhetorical.
        </p>
      </Finding>

      <Finding
        n="05"
        title="$5 a month decides whether a credit card takes 11 years or 3"
        headline="On a $5,000 balance at 22% APR, paying $95 a month costs $12,517 in interest. Paying $100 costs $8,678 — a $5 difference worth $3,839 and four years."
        calc={{ path: '/credit-card-payoff', label: 'Credit card payoff calculator' }}
      >
        <p>
          The monthly interest on that balance is about $92. Any payment near that figure is almost entirely
          interest, so the small remainder that reaches the principal is what decides everything — and doubling
          a tiny remainder has an enormous effect on how long the debt survives.
        </p>
        <T
          headers={['Monthly payment', 'Months to clear', 'Total interest']}
          rows={[
            ['$95', '185', '$12,517'],
            ['$100', '137', '$8,678'],
            ['$110', '99', '$5,849'],
            ['$125', '73', '$4,095'],
            ['$150', '52', '$2,798'],
            ['$200', '34', '$1,750'],
            ['$300', '21', '$1,022'],
          ]}
          highlight={0}
        />
        <p>
          Below roughly $92 the balance never clears at all, however long you pay. This is why the payoff curve
          is so steep at the bottom and so flat at the top: going from $95 to $100 saves four years, while going
          from $200 to $300 saves about one.
        </p>
      </Finding>

      <div className="border-t border-gray-100 pt-6 text-xs text-gray-500 leading-relaxed space-y-2">
        <p>
          All figures assume 2026 rates, a single filer taking the standard deduction in the US, and England,
          Wales and Northern Ireland bands in the UK. Local and state taxes are excluded where noted. Full
          assumptions and known limitations are on the{' '}
          <Link to="/methodology" className="text-indigo-600 hover:underline">How We Calculate</Link> page.
        </p>
        <p>
          These are estimates produced from published rules, not personal advice. If you spot an error in any
          figure here, please <Link to="/contact" className="text-indigo-600 hover:underline">tell us</Link> —
          corrections are made as soon as they can be verified.
        </p>
      </div>
    </div>
  )
}
