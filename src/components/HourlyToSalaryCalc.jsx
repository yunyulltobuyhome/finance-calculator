import { useState } from 'react'
import { Link } from 'react-router-dom'

const fmt0 = (sym, n) => sym + Math.round(n).toLocaleString()

export default function HourlyToSalaryCalc() {
  const [form, setForm] = useState({ rate: 25, hours: 40, weeks: 52 })
  const [currency, setCurrency] = useState('$')
  const [result, setResult] = useState(null)

  const calc = () => {
    const rate = +form.rate, hours = +form.hours, weeks = +form.weeks
    if (!rate || rate <= 0 || !hours || hours <= 0 || !weeks || weeks <= 0) return
    const annual = rate * hours * weeks
    setResult({
      annual,
      monthly: annual / 12,
      biweekly: rate * hours * 2,
      weekly: rate * hours,
      daily: rate * (hours / 5),
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">Hourly to Salary Calculator</h1>
        <p className="text-sm text-gray-500">Convert your hourly wage into yearly, monthly, biweekly and weekly pay — instantly.</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {[['$', 'USD ($)'], ['£', 'GBP (£)']].map(([sym, label]) => (
          <button key={sym} onClick={() => setCurrency(sym)}
            className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
              currency === sym ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: `Hourly rate (${currency})`, key: 'rate' },
          { label: 'Hours per week', key: 'hours' },
          { label: 'Weeks per year', key: 'weeks' },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="text-xs text-gray-500 block mb-1">{label}</label>
            <input type="number" value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        ))}
      </div>

      <button onClick={calc} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
        Convert to Salary
      </button>

      {result && (
        <div className="mt-5 space-y-3">
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <p className="text-sm text-indigo-600 font-semibold mb-1">Annual salary (gross)</p>
            <p className="text-3xl font-black text-indigo-700">{fmt0(currency, result.annual)}<span className="text-lg text-gray-400 font-normal">/year</span></p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              ['Monthly', result.monthly],
              ['Biweekly', result.biweekly],
              ['Weekly', result.weekly],
              ['Per day (8h)', result.daily],
            ].map(([label, val]) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-sm font-bold text-gray-800">{fmt0(currency, val)}</p>
              </div>
            ))}
          </div>
          <Link to="/salary" className="block text-center text-sm text-indigo-600 font-semibold hover:underline">
            See what this salary is after tax →
          </Link>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">How the Conversion Works</h2>
          <p className="leading-relaxed">
            The standard full-time year is 40 hours a week × 52 weeks = <strong>2,080 working hours</strong>. So an
            hourly wage converts to an annual salary by multiplying by 2,080: for example, $25/hour × 2,080 =
            $52,000 a year. If you take unpaid time off, use fewer weeks (e.g. 50) — and remember the result is
            your <em>gross</em> pay, before income tax and other deductions come out.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Hourly to Annual — Quick Reference (40h/week)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Hourly rate</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Annual</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Monthly</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Weekly</th>
              </tr></thead>
              <tbody>
                {[15, 18, 20, 22, 25, 30, 35, 40, 50].map((r, i) => (
                  <tr key={r} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">${r}/hr</td>
                    <td className="p-2 border border-gray-200 text-indigo-600 font-semibold">${(r * 2080).toLocaleString()}</td>
                    <td className="p-2 border border-gray-200">${Math.round(r * 2080 / 12).toLocaleString()}</td>
                    <td className="p-2 border border-gray-200">${(r * 40).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Gross figures at 40 hours/week, 52 weeks/year, before tax.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Things People Forget in the Conversion</h2>
          <ul className="list-disc pl-5 space-y-1 leading-relaxed">
            <li><strong>Unpaid leave shrinks the real number.</strong> Hourly workers without paid holidays should use 48–50 weeks, not 52 — that alone cuts a $52,000 conversion to roughly $48,000–$50,000.</li>
            <li><strong>Overtime isn&apos;t in the base conversion.</strong> Regular time-and-a-half hours can make an hourly job out-earn its salaried equivalent.</li>
            <li><strong>Salaried roles often include benefits</strong> — employer pension/401(k) match, paid leave and insurance can be worth 20–30% on top of the headline salary.</li>
            <li><strong>It&apos;s gross, not take-home.</strong> Run the annual figure through a take-home calculator to see what actually lands in your account.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: '$25 an hour is how much a year?', a: 'At 40 hours a week for 52 weeks, $25/hour is $52,000 a year gross — about $4,333 a month or $1,000 a week before tax.' },
              { q: '$20 an hour is how much a year?', a: '$20/hour at full time (2,080 hours) is $41,600 a year gross, roughly $3,467 a month. With two weeks of unpaid leave (50 weeks) it is $40,000.' },
              { q: 'How many working hours are in a year?', a: 'The standard figure is 2,080 hours (40 × 52). Accounting for typical US public holidays and two weeks of leave, most full-time employees actually work about 1,900–2,000 hours.' },
              { q: 'How do I convert salary back to hourly?', a: 'Divide the annual salary by 2,080. A $60,000 salary is about $28.85/hour; £30,000 is about £14.42/hour at 40 hours a week.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
