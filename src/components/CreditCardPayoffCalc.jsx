import { useState } from 'react'
import { Link } from 'react-router-dom'

// Simulate paying a fixed amount each month.
export function payoffFixed(balance, apr, payment) {
  const r = apr / 100 / 12
  if (payment <= balance * r) return { never: true }
  let bal = balance, months = 0, interest = 0
  while (bal > 0.005 && months < 1200) {
    const i = bal * r
    interest += i
    bal = bal + i - payment
    months++
  }
  return { never: false, months, interest: Math.round(interest), totalPaid: Math.round(balance + interest) }
}

// Simulate paying only the minimum (1% of balance + interest, floor $25).
export function payoffMinimum(balance, apr) {
  const r = apr / 100 / 12
  let bal = balance, months = 0, interest = 0
  while (bal > 0.005 && months < 1200) {
    const i = bal * r
    let pay = Math.max(25, bal * 0.01 + i)
    if (pay > bal + i) pay = bal + i
    interest += i
    bal = bal + i - pay
    months++
  }
  return { months, interest: Math.round(interest) }
}

const fmt = (n) => '$' + Math.round(n).toLocaleString()
const dur = (m) => `${Math.floor(m / 12)}y ${m % 12}m`

export default function CreditCardPayoffCalc() {
  const [form, setForm] = useState({ balance: 5000, apr: 22, payment: 200 })
  const [result, setResult] = useState(null)

  const calc = () => {
    const balance = +form.balance, apr = +form.apr, payment = +form.payment
    if (!balance || balance <= 0 || apr < 0 || !payment || payment <= 0) return
    const fixed = payoffFixed(balance, apr, payment)
    const min = payoffMinimum(balance, apr)
    setResult({ fixed, min, balance })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Credit Card Payoff Calculator 2026</h1>
        <p className="text-sm text-gray-500">See how long it takes to clear your balance, the total interest, and how much faster you'd be debt-free by paying more than the minimum.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Balance ($)', key: 'balance' },
          { label: 'APR (%)', key: 'apr' },
          { label: 'Monthly payment ($)', key: 'payment' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Calculate Payoff
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          {result.fixed.never ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
              ⚠️ Your payment is lower than the monthly interest, so the balance would never reduce. Increase the monthly payment above {fmt(result.balance * (+form.apr / 100 / 12))}.
            </div>
          ) : (
            <>
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
                <p className="text-sm text-indigo-600 font-semibold mb-1">Time to pay off</p>
                <p className="text-3xl font-black text-indigo-700">{dur(result.fixed.months)}</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400">Total interest</p><p className="font-bold text-gray-800">{fmt(result.fixed.interest)}</p></div>
                  <div className="bg-white rounded-lg p-3"><p className="text-xs text-gray-400">Total paid</p><p className="font-bold text-gray-800">{fmt(result.fixed.totalPaid)}</p></div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-1">If you paid only the minimum…</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  It would take <strong>{dur(result.min.months)}</strong> and cost <strong>{fmt(result.min.interest)}</strong> in interest —
                  that's <strong>{fmt(Math.max(0, result.min.interest - result.fixed.interest))}</strong> more than your plan above.
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How Credit Card Payoff Works</h2>
          <p className="leading-relaxed">
            Credit cards charge interest daily on your balance, quoted as an APR (Annual Percentage Rate). Each month,
            interest is added first, then your payment reduces what's left. Because interest compounds on the remaining
            balance, paying just a little more each month can cut years — and thousands of dollars — off your payoff.
            The average US credit card APR is around 20–24%, so the cost of carrying a balance is high.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">The Minimum Payment Trap</h2>
          <p className="leading-relaxed mb-3">
            Minimum payments are usually about 1–3% of your balance. They're designed to keep you in debt as long as
            possible. Here's how a $5,000 balance at 22% APR plays out:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Monthly payment</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Time to clear</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Interest paid</th>
              </tr></thead>
              <tbody>
                {[100, 150, 200, 300, 500].map((p, i) => {
                  const r = payoffFixed(5000, 22, p)
                  return (
                    <tr key={p} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium">${p}/mo</td>
                      <td className="p-2 border border-gray-200">{r.never ? 'Never' : dur(r.months)}</td>
                      <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">{r.never ? '—' : fmt(r.interest)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Illustrative, fixed payment, 22% APR, no new spending.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How can I pay off credit card debt faster?', a: 'Pay more than the minimum, target the highest-APR card first (the avalanche method), stop adding new charges, and consider a 0% balance transfer card or a lower-rate personal loan to cut the interest you pay.' },
              { q: 'What is a good monthly payment?', a: 'As much as your budget allows above the minimum. Even an extra $50–$100 a month dramatically shortens payoff time because more of each payment goes to principal instead of interest.' },
              { q: 'Should I use a balance transfer card?', a: 'A 0% introductory APR balance transfer can save a lot of interest if you clear the balance before the promo ends. Watch for the transfer fee (typically 3–5%) and the rate after the promo.' },
              { q: 'Does paying off a credit card help my credit score?', a: 'Yes. Lowering your balance reduces your credit utilization ratio, which is a major factor in your score. Keeping the card open after payoff also helps your available credit and account age.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Payoff by Balance</h2>
          <div className="flex flex-wrap gap-2">
            {[1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000].map(b => (
              <Link key={b} to={`/credit-card-payoff/${b}`} className="text-indigo-600 hover:underline bg-gray-50 rounded-lg px-3 py-1.5 text-sm">
                ${b.toLocaleString()}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
