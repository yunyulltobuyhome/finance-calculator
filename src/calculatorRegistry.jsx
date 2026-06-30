// Slug → calculator component + label. Used by the embeddable /embed/:slug
// pages (and any future slug-driven calculator rendering).
import FIRECalc from './components/FIRECalc'
import DividendCalc from './components/DividendCalc'
import LoanCalc from './components/LoanCalc'
import CompoundCalc from './components/CompoundCalc'
import SalaryCalc from './components/SalaryCalc'
import BuyVsRentCalc from './components/BuyVsRentCalc'
import StampDutyCalc from './components/StampDutyCalc'
import CapitalGainsCalc from './components/CapitalGainsCalc'
import InheritanceTaxCalc from './components/InheritanceTaxCalc'
import MortgageAffordabilityCalc from './components/MortgageAffordabilityCalc'
import RetirementCalc from './components/RetirementCalc'
import RedundancyCalc from './components/RedundancyCalc'
import NICalc from './components/NICalc'
import HolidayCalc from './components/HolidayCalc'
import StudentLoanCalc from './components/StudentLoanCalc'
import RothIRACalc from './components/RothIRACalc'
import SelfEmployedCalc from './components/SelfEmployedCalc'
import CorporationTaxCalc from './components/CorporationTaxCalc'
import PensionCreditCalc from './components/PensionCreditCalc'
import SocialSecurityCalc from './components/SocialSecurityCalc'
import VATCalc from './components/VATCalc'
import PayRiseCalc from './components/PayRiseCalc'
import CreditCardPayoffCalc from './components/CreditCardPayoffCalc'
import AutoLoanCalc from './components/AutoLoanCalc'
import RefinanceCalc from './components/RefinanceCalc'

export const CALC_REGISTRY = {
  'stamp-duty':        { C: StampDutyCalc, label: 'Stamp Duty Calculator' },
  'capital-gains':     { C: CapitalGainsCalc, label: 'Capital Gains Tax Calculator' },
  'inheritance-tax':   { C: InheritanceTaxCalc, label: 'Inheritance Tax Calculator' },
  'national-insurance':{ C: NICalc, label: 'National Insurance Calculator' },
  'self-employed':     { C: SelfEmployedCalc, label: 'Self-Employed Tax Calculator' },
  'corporation-tax':   { C: CorporationTaxCalc, label: 'Corporation Tax Calculator' },
  'vat':               { C: VATCalc, label: 'VAT Calculator' },
  'mortgage':          { C: MortgageAffordabilityCalc, label: 'Mortgage Affordability Calculator' },
  'refinance':         { C: RefinanceCalc, label: 'Mortgage Refinance Calculator' },
  'buy-vs-rent':       { C: BuyVsRentCalc, label: 'Buy vs Rent Calculator' },
  'fire':              { C: FIRECalc, label: 'FIRE Calculator' },
  'retirement':        { C: RetirementCalc, label: '401k & Pension Calculator' },
  'roth-ira':          { C: RothIRACalc, label: 'Roth vs Traditional IRA Calculator' },
  'social-security':   { C: SocialSecurityCalc, label: 'Social Security Calculator' },
  'pension-credit':    { C: PensionCreditCalc, label: 'Pension Credit Calculator' },
  'dividend':          { C: DividendCalc, label: 'Dividend Income Calculator' },
  'compound':          { C: CompoundCalc, label: 'Compound Interest Calculator' },
  'salary':            { C: SalaryCalc, label: 'Salary Take-Home Calculator' },
  'pay-rise':          { C: PayRiseCalc, label: 'Pay Rise Calculator' },
  'redundancy':        { C: RedundancyCalc, label: 'Redundancy Pay Calculator' },
  'holiday':           { C: HolidayCalc, label: 'Holiday Entitlement Calculator' },
  'student-loan':      { C: StudentLoanCalc, label: 'Student Loan Repayment Calculator' },
  'loan':              { C: LoanCalc, label: 'Loan Calculator' },
  'credit-card-payoff':{ C: CreditCardPayoffCalc, label: 'Credit Card Payoff Calculator' },
  'auto-loan':         { C: AutoLoanCalc, label: 'Auto Loan Calculator' },
}
