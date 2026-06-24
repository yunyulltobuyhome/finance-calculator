import { useState } from 'react'
import { SALARY_TAX_DATA, EXCHANGE_RATES } from '../data/salaryTaxRates'

export default function SalaryCalc() {
  const [country, setCountry] = useState('US')
  const [state, setState] = useState('California')
  const [province, setProvince] = useState('Ontario')
  const [annualSalary, setAnnualSalary] = useState(100000)
  const [result, setResult] = useState(null)

  const calculateTax = (gross) => {
    const data = SALARY_TAX_DATA[country]
    let federalTax = 0
    let deductions = {}

    switch (country) {
      case 'US': {
        const brackets = data.brackets
        for (let bracket of brackets) {
          if (gross > bracket.min) {
            const taxableInBracket = Math.min(gross, bracket.max) - bracket.min
            federalTax += taxableInBracket * bracket.rate
          }
        }
        const ssWages = Math.min(gross, data.socialSecurityCap)
        const ss = ssWages * data.socialSecurity
        const medicare = gross * data.medicare
        const stateData = data.states.find(s => s.name === state)
        const stateTax = gross * (stateData?.tax || 0)
        
        deductions = {
          federalTax: Math.round(federalTax),
          stateTax: Math.round(stateTax),
          socialSecurity: Math.round(ss),
          medicare: Math.round(medicare),
        }
        break
      }

      case 'UK': {
        const brackets = data.brackets
        for (let bracket of brackets) {
          if (gross > bracket.min) {
            const taxableInBracket = Math.min(gross, bracket.max) - bracket.min
            federalTax += taxableInBracket * bracket.rate
          }
        }
        const niWages = Math.max(0, gross - 12570)
        const ni = niWages * data.nationalInsurance
        const studentLoan = Math.max(0, gross - data.studentLoanThreshold) * data.studentLoan
        
        deductions = {
          incomeTax: Math.round(federalTax),
          nationalInsurance: Math.round(ni),
          studentLoan: Math.round(studentLoan),
        }
        break
      }

      case 'CA': {
        const fedBrackets = data.federalBrackets
        for (let bracket of fedBrackets) {
          if (gross > bracket.min) {
            const taxableInBracket = Math.min(gross, bracket.max) - bracket.min
            federalTax += taxableInBracket * bracket.rate
          }
        }
        
        const provData = data.provinces.find(p => p.name === province)
        let provTax = 0
        if (provData) {
          for (let bracket of provData.brackets) {
            if (gross > bracket.min) {
              const taxableInBracket = Math.min(gross, bracket.max) - bracket.min
              provTax += taxableInBracket * bracket.rate
            }
          }
        }
        
        const cpp = Math.min(gross * data.cpp, data.cppMax)
        const ei = gross * data.ei
        
        deductions = {
          federalTax: Math.round(federalTax),
          provinceTax: Math.round(provTax),
          cpp: Math.round(cpp),
          ei: Math.round(ei),
        }
        break
      }

      case 'AU': {
        const brackets = data.brackets
        for (let bracket of brackets) {
          if (gross > bracket.min) {
            const taxableInBracket = Math.min(gross, bracket.max) - bracket.min
            federalTax += taxableInBracket * bracket.rate
          }
        }
        const medicare = gross * data.medicareLevey
        const superannuation = gross * data.superannuation
        
        deductions = {
          incomeTax: Math.round(federalTax),
          medicareLevey: Math.round(medicare),
          superannuation: Math.round(superannuation),
        }
        break
      }
    }

    const totalTaxAndDeductions = Object.values(deductions).reduce((a, b) => a + b, 0)
    return {
      gross,
      deductions,
      net: gross - totalTaxAndDeductions,
      totalDeductions: totalTaxAndDeductions,
    }
  }

  const calc = () => {
    const res = calculateTax(annualSalary)
    setResult({
      ...res,
      monthly: Math.round(res.net / 12),
      biweekly: Math.round(res.net / 26),
    })
  }

  const fmt = (n) => {
    const data = SALARY_TAX_DATA[country]
    const symbol = data.currency === 'USD' ? '$' : data.currency === 'GBP' ? '£' : data.currency === 'CAD' ? 'C$' : 'A$'
    return symbol + n.toLocaleString()
  }

  const countryList = Object.entries(SALARY_TAX_DATA).map(([key, val]) => ({
    key,
    name: val.name,
  }))

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-700 mb-4">Global Salary Calculator</h2>

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Select Country</label>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value)
            setState(SALARY_TAX_DATA[e.target.value].states?.[0]?.name || '')
            setProvince(SALARY_TAX_DATA[e.target.value].provinces?.[0]?.name || '')
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {countryList.map(({ key, name }) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {country === 'US' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">State (affects tax)</label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {SALARY_TAX_DATA.US.states.map((s) => (
              <option key={s.name}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {country === 'CA' && (
        <div className="mb-4">
          <label className="text-xs text-gray-500 block mb-1">Province (affects tax)</label>
          <select
            value={province}
            onChange={(e) => setProvince(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {SALARY_TAX_DATA.CA.provinces.map((p) => (
              <option key={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1">Annual Salary</label>
        <input
          type="number"
          value={annualSalary}
          onChange={(e) => setAnnualSalary(+e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <button
        onClick={calc}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
      >
        Calculate
      </button>

      {result && (
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Gross Annual', val: fmt(result.gross) },
              { label: 'Total Deductions', val: fmt(result.totalDeductions) },
              { label: 'Net Annual', val: fmt(result.net) },
              { label: 'Monthly Take-Home', val: fmt(result.monthly) },
            ].map(({ label, val }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-semibold text-gray-800">{val}</p>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-indigo-700 font-medium mb-2">Tax & Deduction Breakdown</p>
            <div className="space-y-1">
              {Object.entries(result.deductions).map(([key, val]) => (
                <div key={key} className="flex justify-between text-xs text-indigo-600">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-medium">{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-16 text-gray-400">Gross</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-indigo-400 rounded-full flex items-center pl-2 text-white" style={{width: '100%'}}>
                  {fmt(result.gross)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-gray-400">Taxes</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-orange-400 rounded-full flex items-center pl-2 text-white" style={{width: `${(result.totalDeductions / result.gross) * 100}%`}}>
                  {fmt(result.totalDeductions)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-gray-400">Net</span>
              <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                <div className="h-full bg-green-400 rounded-full flex items-center pl-2 text-white" style={{width: `${(result.net / result.gross) * 100}%`}}>
                  {fmt(result.net)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}