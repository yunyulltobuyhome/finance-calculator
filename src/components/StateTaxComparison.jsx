import { Link } from 'react-router-dom'
import { SALARY_TAX_DATA } from '../data/salaryTaxRates'
import useShareableState from '../hooks/useShareableState'
import { SplitBar } from './ResultChart'

const US = SALARY_TAX_DATA.US

function bracketTax(taxable, brackets) {
  let tax = 0
  for (const b of brackets) if (taxable > b.min) tax += (Math.min(taxable, b.max) - b.min) * b.rate
  return tax
}

function stateTax(gross, s) {
  const taxable = Math.max(0, gross - (s.deduction || 0))
  return s.brackets ? bracketTax(taxable, s.brackets) : taxable * (s.flat || 0)
}

// Federal tax and FICA are identical in every state, so the entire difference
// in take-home between states is the state income tax line.
function breakdown(gross, s) {
  const federal = bracketTax(Math.max(0, gross - US.standardDeduction), US.brackets)
  const state = stateTax(gross, s)
  const fica = Math.min(gross, US.socialSecurityCap) * US.socialSecurity + gross * US.medicare
  const net = gross - federal - state - fica
  return {
    name: s.name,
    hasTax: !s.brackets && !s.flat ? false : state > 0,
    federal: Math.round(federal),
    state: Math.round(state),
    fica: Math.round(fica),
    net: Math.round(net),
  }
}

const fmt = (n) => '$' + Math.round(n).toLocaleString()

export default function StateTaxComparison() {
  const [form, setForm] = useShareableState({ salary: 100000 })
  const salary = Math.max(0, +form.salary || 0)

  const rows = US.states.map(s => breakdown(salary, s)).sort((a, b) => b.net - a.net)
  const best = rows[0]
  const worst = rows[rows.length - 1]
  const spread = best.net - worst.net

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">US State Tax Comparison 2026</h1>
        <p className="text-sm text-gray-500">
          The same salary, side by side in seven states — see exactly what state income tax costs you, and what
          moving would actually save.
        </p>
      </div>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Annual salary (gross)</label>
        <input type="number" value={form.salary}
          onChange={e => setForm({ ...form, salary: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
      </div>

      {salary > 0 && (
        <>
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5 mb-4">
            <p className="text-sm text-indigo-600 font-semibold mb-1">Difference between best and worst state</p>
            <p className="text-3xl font-black text-indigo-700">{fmt(spread)}<span className="text-lg text-gray-400 font-normal"> a year</span></p>
            <p className="text-xs text-gray-500 mt-1">
              {best.name} keeps you {fmt(spread)} better off than {worst.name} on {fmt(salary)} — that is{' '}
              {fmt(spread / 12)} a month, purely from state income tax.
            </p>
          </div>

          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold text-xs">State</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold text-xs">State tax</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold text-xs">Take-home</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold text-xs">vs {best.name}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium text-xs">{r.name}</td>
                    <td className="p-2 border border-gray-200 text-right text-xs">{r.state === 0 ? 'None' : fmt(r.state)}</td>
                    <td className="p-2 border border-gray-200 text-right text-xs font-semibold text-indigo-600">{fmt(r.net)}</td>
                    <td className="p-2 border border-gray-200 text-right text-xs text-gray-500">
                      {r.net === best.net ? '—' : '−' + fmt(best.net - r.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
            <SplitBar
              caption={`Where ${fmt(salary)} goes in ${worst.name}`}
              format={fmt}
              segments={[
                { label: 'Take-home', value: worst.net, color: '#4f46e5' },
                { label: 'Federal tax', value: worst.federal, color: '#a5b4fc' },
                { label: 'FICA', value: worst.fica, color: '#fbbf24' },
                { label: 'State tax', value: worst.state, color: '#ef4444' },
              ]}
            />
            <p className="text-xs text-gray-400">
              Federal tax and FICA are the same in every state, so the whole difference above is the state line.
              Single filer, standard deduction, no local taxes.
            </p>
          </div>

          <p className="text-xs text-gray-500 mb-2">
            Want the full breakdown for one state, including 401(k) and per-paycheck figures?{' '}
            <Link to="/salary" className="text-indigo-600 hover:underline font-medium">Use the paycheck calculator →</Link>
          </p>
        </>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Why the Same Salary Pays Different Tax</h2>
          <p className="leading-relaxed mb-3">
            Federal income tax, Social Security and Medicare are identical wherever you live in the US. State
            income tax is not, and it is the only line that changes in the table above — which is why the entire
            gap between the best and worst state is state tax alone.
          </p>
          <p className="leading-relaxed mb-3">
            Four of the states here — Texas, Florida, Nevada and Washington — levy no state income tax at all.
            California runs a nine-band progressive schedule from 1% to 12.3%, New York runs nine bands from 4%
            to 10.9%, and Illinois charges a single flat 4.95% on everything above a personal exemption.
          </p>
          <p className="leading-relaxed">
            The gap widens as income rises, because progressive states take a larger share at the top. On
            $60,000 the spread between best and worst is under $3,000 a year; on $150,000 it is nearly $10,000.
            That is the arithmetic behind the steady flow of high earners from California and New York to Texas
            and Florida.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Flat Tax Is Not Automatically Cheaper</h2>
          <p className="leading-relaxed mb-3">
            The comparison produces one result that surprises almost everyone. At $60,000, Illinois — with its
            flat 4.95% — takes <strong>more</strong> than California, whose top rate is 12.3%. At $150,000 the
            order reverses and California costs considerably more.
          </p>
          <p className="leading-relaxed mb-3">
            The reason is that a progressive schedule charges its low rates first. A California earner on
            $60,000 pays 1%, 2%, 4% and 6% on successive slices, and only touches 9.3% at the very top of their
            income. A flat rate applies the same 4.95% to the first dollar and the last, so it lands hardest on
            the people with the least.
          </p>
          <p className="leading-relaxed">
            The practical lesson: a state's headline top rate tells you very little about your own bill. What
            matters is where <em>your</em> income sits in that state's schedule.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">No Income Tax Does Not Mean No Tax</h2>
          <p className="leading-relaxed mb-3">
            Every state has to raise revenue somehow, and the ones without an income tax simply raise it
            elsewhere. Before treating a move as a straight saving, weigh what this comparison does not include:
          </p>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed mb-3">
            <li><strong>Property tax.</strong> Texas has some of the highest effective property tax rates in the country. For a homeowner, that can consume much or all of the income tax saving.</li>
            <li><strong>Sales tax.</strong> Washington and Nevada lean heavily on sales tax, which falls on everything you buy and is regressive in effect.</li>
            <li><strong>Local income tax.</strong> This calculator covers state tax only. New York City levies its own income tax on top of New York State — a resident there pays considerably more than the table shows.</li>
            <li><strong>Cost of living.</strong> Housing, insurance and utilities vary far more between metros than tax does. A larger take-home in a more expensive city can still leave you with less.</li>
          </ul>
          <p className="leading-relaxed">
            Tax is one input into a relocation decision, and rarely the largest. It is, however, the one that is
            easiest to quantify — which is what this page is for.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Remote Work and Which State Taxes You</h2>
          <p className="leading-relaxed mb-3">
            Working remotely for a company in another state does not automatically move your tax bill. In
            general you owe income tax to the state where you physically perform the work, not where your
            employer is headquartered. Living in Texas while employed by a California business usually means no
            state income tax on that salary.
          </p>
          <p className="leading-relaxed">
            Two complications are worth knowing. A handful of states apply "convenience of the employer" rules
            that can tax a remote worker as though they were in the office state. And splitting the year between
            states generally makes you a part-year resident in both, requiring the income to be apportioned. If
            you move mid-year or work across state lines, this is a point to confirm rather than assume.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Which states have no income tax?', a: 'Nine states levy no tax on wage income: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington and Wyoming. This comparison covers Texas, Florida, Nevada and Washington alongside three states that do tax income.' },
              { q: 'How much would I save moving from California to Texas?', a: 'It is the whole California state tax line, since Texas has none. On $100,000 that is roughly $5,300 a year, and on $150,000 close to $10,000. Enter your own salary above for an exact figure — then set it against Texas property tax if you plan to buy.' },
              { q: 'Does this include city or local taxes?', a: 'No — state income tax only. Some cities levy their own, most notably New York City, which charges a separate resident income tax on top of New York State. If you live in one of those cities your total bill is higher than shown.' },
              { q: 'Which filing status do these figures use?', a: 'Single filer with the standard deduction, using 2026 federal brackets and each state’s single-filer schedule. Married filing jointly generally lowers the effective rate in progressive states, so the gaps shown here narrow somewhat for couples.' },
              { q: 'Why is my actual paycheck different from these numbers?', a: 'Payroll withholding is an estimate based on the W-4 you filed and is reconciled when you file your return. These figures also exclude pre-tax deductions such as 401(k) contributions and health insurance, which lower taxable income. The paycheck calculator handles those.' },
            ].map((f, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{f.q}</p>
                <p className="text-gray-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
