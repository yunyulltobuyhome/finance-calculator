import { useState } from 'react'
import { Link } from 'react-router-dom'
import { payoffFixed } from './CreditCardPayoffCalc'
import { autoLoanPayment } from './AutoLoanCalc'

const fmt = (n) => '$' + Math.round(n).toLocaleString()
const dur = (m) => `${Math.floor(m / 12)}y ${m % 12}m`

export default function DebtConsolidationCalc() {
  const [form, setForm] = useState({ balance: 15000, apr: 22, payment: 450, newApr: 11, newMonths: 48, feePct: 3 })
  const [result, setResult] = useState(null)

  const calc = () => {
    const balance = +form.balance, apr = +form.apr, payment = +form.payment
    const newApr = +form.newApr, newMonths = +form.newMonths, feePct = +form.feePct
    if (!balance || balance <= 0 || !payment || payment <= 0 || !newMonths || newMonths <= 0) return
    const current = payoffFixed(balance, apr, payment)
    const financed = balance * (1 + Math.max(0, feePct) / 100)
    const newMonthly = autoLoanPayment(financed, newApr, newMonths)
    const newTotalCost = newMonthly * newMonths
    const newInterestAndFees = newTotalCost - balance
    setResult({
      current,
      newMonthly,
      newInterestAndFees,
      newMonths,
      monthlyChange: payment - newMonthly,
      totalSavings: current.never ? null : current.interest - newInterestAndFees,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Debt Consolidation Calculator</h1>
        <p className="text-sm text-gray-500">See whether rolling your debts into one lower-rate loan actually saves money — monthly payment, total interest and payoff time compared.</p>
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Your current debt</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Total balance ($)', key: 'balance' },
          { label: 'Average APR (%)', key: 'apr' },
          { label: 'Total monthly payment ($)', key: 'payment' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Consolidation loan offer</p>
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'New APR (%)', key: 'newApr' },
          { label: 'Term (months)', key: 'newMonths' },
          { label: 'Origination fee (%)', key: 'feePct' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Compare My Options
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          {result.current.never ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              ⚠️ Your current monthly payment doesn&apos;t cover the interest on this balance, so it would never be repaid on the current path — consolidation (or a higher payment) is essential here.
            </div>
          ) : (
            <div className={`rounded-xl p-5 border ${result.totalSavings > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
              <p className="text-sm font-semibold mb-1" style={{ color: result.totalSavings > 0 ? '#047857' : '#b45309' }}>
                {result.totalSavings > 0 ? 'Consolidating saves you' : 'Consolidating costs you MORE'}
              </p>
              <p className="text-3xl font-black" style={{ color: result.totalSavings > 0 ? '#065f46' : '#92400e' }}>
                {fmt(Math.abs(result.totalSavings))}
              </p>
              <p className="text-xs text-gray-500 mt-1">total interest & fees vs staying on your current path</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Current path</p>
              <p className="font-bold text-gray-800">{result.current.never ? 'Never repaid' : `${dur(result.current.months)} · ${fmt(result.current.interest)} interest`}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Consolidation loan</p>
              <p className="font-bold text-gray-800">{dur(result.newMonths)} · {fmt(result.newInterestAndFees)} interest + fees</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">New monthly payment</p>
              <p className="font-bold text-gray-800">{fmt(result.newMonthly)}/mo</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400">Monthly change</p>
              <p className="font-bold text-gray-800">{result.monthlyChange >= 0 ? `${fmt(result.monthlyChange)} lower` : `${fmt(-result.monthlyChange)} higher`}</p>
            </div>
          </div>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Debt Consolidation Works</h2>
          <p className="leading-relaxed">
            Debt consolidation replaces several high-interest debts — typically credit cards at 20%+ APR — with a
            single personal loan at a lower fixed rate. You keep one payment, one due date, and a firm payoff date
            instead of open-ended revolving debt. Whether it saves money comes down to three numbers: the new APR,
            the loan term, and any origination fee (often 1–8% of the loan). A lower rate helps; a longer term and
            fees push the other way, which is why some "lower monthly payment" offers actually cost more in total.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Worked Example</h2>
          <p className="leading-relaxed">
            Say you owe $15,000 across cards at an average 22% APR and pay $450 a month. On that path you&apos;d be
            debt-free in about 4 years and pay roughly $6,800 in interest. Consolidating into a 48-month loan at 11%
            with a 3% fee gives a payment of about $399 a month and around $4,200 in interest and fees — saving
            roughly $2,600 <em>and</em> $50 a month. Stretch the same loan to 72 months, though, and the "cheaper"
            payment quietly erases most of that saving.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Consolidation Mistakes to Avoid</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Judging by the monthly payment.</strong> A longer term nearly always lowers the payment while raising the total cost — compare total interest + fees, not the monthly figure.</li>
            <li><strong>Ignoring the origination fee.</strong> A 5% fee on $15,000 is $750 added to your debt on day one; it can wipe out the benefit of a modest rate drop.</li>
            <li><strong>Running the cards back up.</strong> Consolidation frees your card limits — new spending on top of the loan is how people end up with double the debt.</li>
            <li><strong>Overlooking a 0% balance transfer.</strong> For smaller balances you can clear within 12–21 months, a 0% transfer card (typical 3–5% fee) often beats a loan.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Does debt consolidation hurt your credit score?', a: 'There is a small temporary dip from the hard inquiry and new account. Over time it usually helps: your credit-card utilization drops sharply once the cards are paid off, and an on-time installment loan builds positive history.' },
              { q: 'What credit score do I need for a consolidation loan?', a: 'Most lenders want a score above about 640–660 for reasonable rates, with the best APRs going to 720+. Below that, the offered rate may not beat what you already pay — always compare the APR to your current average.' },
              { q: 'Which debts can I consolidate?', a: 'Credit cards, store cards, medical bills and other personal loans are the usual candidates. Secured debts like mortgages and auto loans are generally consolidated separately (or via refinancing), and federal student loans have their own consolidation programs.' },
              { q: 'Is debt consolidation the same as debt settlement?', a: 'No. Consolidation repays everything you owe at a lower rate and does not by itself damage your credit. Settlement negotiates to pay less than you owe, badly damages your credit for years, and often has tax consequences — it is a last resort.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p className="text-sm text-indigo-800">
            Paying off cards without a loan? Compare the{' '}
            <Link to="/credit-card-payoff" className="font-semibold underline">Credit Card Payoff Calculator</Link>{' '}
            and the avalanche vs snowball methods first.
          </p>
        </div>
      </div>
    </div>
  )
}
