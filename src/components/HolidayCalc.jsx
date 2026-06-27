import { useState } from 'react'

// 2026 UK statutory holiday entitlement
const STATUTORY_DAYS = 28 // 5.6 weeks × 5 days

export default function HolidayCalc() {
  const [employmentType, setEmploymentType] = useState('fulltime')
  const [daysPerWeek, setDaysPerWeek] = useState('5')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [hoursPerDay, setHoursPerDay] = useState('8')
  const [startDate, setStartDate] = useState('')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const dpw = parseFloat(daysPerWeek) || 5
    const hpw = parseFloat(hoursPerWeek) || 40
    const hpd = parseFloat(hoursPerDay) || 8

    let annualDays = 0
    let annualHours = 0
    let weeksEntitlement = 5.6

    if (employmentType === 'fulltime') {
      annualDays = 28
      annualHours = 28 * (hpw / 5)
    } else if (employmentType === 'parttime') {
      annualDays = Math.min(5.6 * dpw, 28)
      annualHours = annualDays * hpd
    } else if (employmentType === 'irregular') {
      // 12.07% method for irregular hours
      // Note: Supreme Court ruled this method may undercount in some cases
      annualHours = hpw * 52 * 0.1207
      annualDays = annualHours / hpd
    }

    // Pro-rata if start date provided
    let proRataDays = null
    let proRataHours = null
    if (startDate) {
      const start = new Date(startDate)
      const now = new Date()
      const yearEnd = new Date(start.getFullYear() + 1, start.getMonth(), start.getDate())
      const totalDaysInYear = (yearEnd - start) / (1000 * 60 * 60 * 24)
      const daysWorked = Math.min((now - start) / (1000 * 60 * 60 * 24), totalDaysInYear)
      const fraction = Math.min(daysWorked / totalDaysInYear, 1)
      proRataDays = Math.round(annualDays * fraction * 10) / 10
      proRataHours = Math.round(annualHours * fraction * 10) / 10
    }

    setResult({
      annualDays: Math.round(annualDays * 10) / 10,
      annualHours: Math.round(annualHours * 10) / 10,
      weeksEntitlement,
      proRataDays,
      proRataHours,
      employmentType,
      dpw,
    })
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          UK Holiday Entitlement Calculator 2026
        </h2>
        <p className="text-sm text-gray-500">
          Estimate your statutory annual leave entitlement based on your working pattern.
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✓ Based on Working Time Regulations 1998 — 5.6 weeks statutory minimum
        </p>
      </div>

      <div className="space-y-4">
        {/* Employment type */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Working Pattern</label>
          <div className="grid grid-cols-1 gap-2">
            {[
              { value: 'fulltime', label: '🏢 Full-Time (fixed days/week)', desc: '5 days/week, regular hours' },
              { value: 'parttime', label: '⏰ Part-Time (fixed days/week)', desc: 'Fewer than 5 days/week' },
              { value: 'irregular', label: '🔄 Irregular / Zero Hours', desc: 'Variable hours each week' },
            ].map(opt => (
              <button key={opt.value}
                onClick={() => { setEmploymentType(opt.value); setResult(null) }}
                className={`py-3 px-4 rounded-xl text-sm font-medium border transition-all text-left ${
                  employmentType === opt.value
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                <p className="font-semibold">{opt.label}</p>
                <p className={`text-xs mt-0.5 ${employmentType === opt.value ? 'text-indigo-200' : 'text-gray-400'}`}>
                  {opt.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Part-time: days per week */}
        {employmentType === 'parttime' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Days Worked Per Week
            </label>
            <input type="number" step="0.5" min="1" max="4" value={daysPerWeek}
              onChange={e => setDaysPerWeek(e.target.value)}
              placeholder="e.g. 3"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

        {/* Hours per week (irregular) */}
        {employmentType === 'irregular' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Average Hours Worked Per Week
            </label>
            <p className="text-xs text-gray-400 mb-1">
              Use your average over the past 52 weeks (excluding zero-hour weeks)
            </p>
            <input type="number" step="0.5" value={hoursPerWeek}
              onChange={e => setHoursPerWeek(e.target.value)}
              placeholder="e.g. 25"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

        {/* Hours per day */}
        {(employmentType === 'fulltime' || employmentType === 'irregular') && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hours Per Working Day
            </label>
            <input type="number" step="0.5" value={hoursPerDay}
              onChange={e => setHoursPerDay(e.target.value)}
              placeholder="e.g. 8"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

        {/* Hours per week (fulltime) */}
        {employmentType === 'fulltime' && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Hours Per Week
            </label>
            <input type="number" step="0.5" value={hoursPerWeek}
              onChange={e => setHoursPerWeek(e.target.value)}
              placeholder="e.g. 40"
              className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        )}

        {/* Start date (optional) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Employment Start Date <span className="text-gray-400 font-normal">(optional — for pro-rata)</span>
          </label>
          <input type="date" value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors mt-6">
        Calculate Holiday Entitlement
      </button>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Main result */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-indigo-600 font-semibold mb-1">
                  Estimated Annual Holiday Entitlement
                </p>
                <p className="text-4xl font-black text-indigo-700">
                  {result.annualDays} days
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {result.annualHours} hours · {result.weeksEntitlement} weeks statutory minimum
                </p>
              </div>
              {result.proRataDays !== null && (
                <div className="text-right">
                  <p className="text-xs text-gray-500">Accrued to date</p>
                  <p className="text-xl font-bold text-green-600">{result.proRataDays} days</p>
                  <p className="text-xs text-gray-400">{result.proRataHours} hours</p>
                </div>
              )}
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">How This is Calculated</p>
            {result.employmentType === 'fulltime' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statutory weeks</span>
                  <span className="font-semibold">5.6 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days per week</span>
                  <span className="font-semibold">5 days</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Annual entitlement</span>
                  <span>{result.annualDays} days</span>
                </div>
              </>
            )}
            {result.employmentType === 'parttime' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Statutory weeks</span>
                  <span className="font-semibold">5.6 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Days per week</span>
                  <span className="font-semibold">{result.dpw} days</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Annual entitlement</span>
                  <span>{result.annualDays} days</span>
                </div>
              </>
            )}
            {result.employmentType === 'irregular' && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-500">Average weekly hours</span>
                  <span className="font-semibold">{hoursPerWeek} hrs</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Holiday accrual rate</span>
                  <span className="font-semibold">12.07% method</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold">
                  <span>Annual entitlement</span>
                  <span>{result.annualHours} hours</span>
                </div>
              </>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 space-y-1">
            <p className="font-bold">ℹ️ UK Holiday Entitlement 2026</p>
            <p>• Statutory minimum: 5.6 weeks per year (28 days for 5-day week workers)</p>
            <p>• Includes bank holidays — your employer decides whether these count separately</p>
            <p>• Part-time workers get the same 5.6 weeks, pro-rated to days worked</p>
            <p>• Your contract may give more than the statutory minimum</p>
            <p>• Unused holiday may be carried over in limited circumstances — check your contract</p>
            {result.employmentType === 'irregular' && (
              <p>• Irregular hours: 12.07% method used — for complex cases, verify with ACAS</p>
            )}
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className="mt-8 space-y-6 text-sm text-gray-600 border-t border-gray-100 pt-6">
        <div>
          <h2 className="text-base font-bold text-gray-800 mb-2">
            How Much Holiday Am I Entitled To in the UK?
          </h2>
          <p className="leading-relaxed">
            Under the Working Time Regulations 1998, almost all workers in the UK are entitled to a
            minimum of 5.6 weeks of paid holiday per year. For someone working 5 days a week, this
            equals 28 days. Part-time workers receive the same 5.6 weeks, calculated in proportion
            to the days they work. Your employer may offer more than the statutory minimum —
            always check your employment contract.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Holiday Entitlement by Working Pattern</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Working Pattern</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Days/Week</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Holiday Days/Year</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Full-time',  '5 days', '28 days'],
                  ['Part-time',  '4 days', '22.4 days'],
                  ['Part-time',  '3 days', '16.8 days'],
                  ['Part-time',  '2 days', '11.2 days'],
                  ['Part-time',  '1 day',  '5.6 days'],
                ].map(([type, days, holiday], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{type}</td>
                    <td className="p-2 border border-gray-200">{days}</td>
                    <td className="p-2 border border-gray-200 font-semibold text-indigo-600">{holiday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Based on 5.6 weeks statutory minimum. Bank holidays may or may not be included depending on your contract.
          </p>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Do bank holidays count as part of my 28 days?',
                a: 'It depends on your contract. Employers can choose to include bank holidays as part of your 28-day statutory entitlement, or offer them in addition to it. Check your employment contract or staff handbook to confirm your arrangement.',
              },
              {
                q: 'Can my employer refuse to let me take holiday?',
                a: 'Your employer can refuse specific dates but cannot prevent you from taking your statutory entitlement altogether. They must give you notice (at least twice the length of the holiday requested) if they need to refuse or postpone leave.',
              },
              {
                q: 'What happens to unused holiday when I leave a job?',
                a: 'If you leave a job with unused statutory holiday, your employer must pay you for it. This is called holiday pay in lieu. The amount is calculated based on your average weekly pay over the previous 52 weeks.',
              },
              {
                q: 'Do I accrue holiday during sick leave or maternity leave?',
                a: 'Yes. Holiday continues to accrue during sick leave and statutory maternity, paternity, and adoption leave. If you cannot take holiday because of illness, you may be able to carry it forward into the next leave year — your employer should have a policy on this.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
          <p className="font-semibold text-gray-600">Official Sources</p>
          <a href="https://www.gov.uk/holiday-entitlement-rights" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ GOV.UK — Holiday entitlement</a>
          <a href="https://www.acas.org.uk/holiday-entitlement" target="_blank" rel="noopener noreferrer"
            className="block text-indigo-500 hover:underline">↗ ACAS — Holiday entitlement and pay</a>
        </div>
      </div>
    </div>
  )
}