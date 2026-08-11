import { SALARY_TAX_DATA } from '../data/salaryTaxRates'

// Shared US tax engine. Previously duplicated inside SalaryCalc and
// StateTaxComparison; keeping one copy means the salary calculator, the state
// comparison and mortgage affordability can never drift apart on the numbers.
export const US = SALARY_TAX_DATA.US

// Sum a progressive bracket schedule for a given taxable amount.
export function bracketTax(taxable, brackets) {
  let tax = 0
  for (const b of brackets) if (taxable > b.min) tax += (Math.min(taxable, b.max) - b.min) * b.rate
  return tax
}

// State income tax: bracketed states apply their schedule after the state
// standard deduction, flat states a single rate, no-income-tax states zero.
export function usStateTax(gross, stateData) {
  if (!stateData) return 0
  const taxable = Math.max(0, gross - (stateData.deduction || 0))
  if (stateData.brackets) return bracketTax(taxable, stateData.brackets)
  return taxable * (stateData.flat || 0)
}

export function findState(name) {
  return US.states.find(s => s.name === name)
}

// Full federal + state + FICA breakdown for one salary.
// `contribution` is an annual pre-tax 401(k) amount: it reduces the income-tax
// base but not FICA, which is charged on gross wages.
export function usTakeHome(gross, stateName, contribution = 0) {
  const incomeBase = Math.max(0, gross - contribution)
  const federal = bracketTax(Math.max(0, incomeBase - US.standardDeduction), US.brackets)
  const state = usStateTax(incomeBase, findState(stateName))
  const fica = Math.min(gross, US.socialSecurityCap) * US.socialSecurity + gross * US.medicare
  const net = gross - federal - state - fica - contribution
  return {
    gross,
    federal: Math.round(federal),
    state: Math.round(state),
    fica: Math.round(fica),
    net: Math.round(net),
    monthlyNet: Math.round(net / 12),
    monthlyGross: Math.round(gross / 12),
  }
}
