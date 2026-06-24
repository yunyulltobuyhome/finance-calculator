export const LOAN_DATA = {
  US: {
    name: '🇺🇸 United States',
    currency: 'USD',
    types: [
      { name: 'Mortgage (30-year)', rate: 0.069, term: 30 },
      { name: 'Mortgage (15-year)', rate: 0.065, term: 15 },
      { name: 'Auto Loan (60 months)', rate: 0.072, term: 5 },
      { name: 'Personal Loan (84 months)', rate: 0.105, term: 7 },
      { name: 'Student Loan', rate: 0.053, term: 10 },
    ],
    repaymentMethods: ['Fixed-Rate', 'Interest-Only', 'Balloon Payment'],
  },
  UK: {
    name: '🇬🇧 United Kingdom',
    currency: 'GBP',
    types: [
      { name: 'Mortgage (25-year)', rate: 0.058, term: 25 },
      { name: 'Mortgage (5-year Fixed)', rate: 0.062, term: 5 },
      { name: 'Car Loan (60 months)', rate: 0.068, term: 5 },
      { name: 'Personal Loan (60 months)', rate: 0.095, term: 5 },
      { name: 'Student Loan', rate: 0.069, term: 25 },
    ],
    repaymentMethods: ['Fixed-Rate', 'Interest-Only'],
  },
  CA: {
    name: '🇨🇦 Canada',
    currency: 'CAD',
    types: [
      { name: 'Mortgage (25-year)', rate: 0.059, term: 25 },
      { name: 'Mortgage (5-year Fixed)', rate: 0.063, term: 5 },
      { name: 'Auto Loan (60 months)', rate: 0.069, term: 5 },
      { name: 'Personal Loan (60 months)', rate: 0.098, term: 5 },
      { name: 'Student Loan', rate: 0.050, term: 15 },
    ],
    repaymentMethods: ['Fixed-Rate', 'Interest-Only'],
  },
  AU: {
    name: '🇦🇺 Australia',
    currency: 'AUD',
    types: [
      { name: 'Mortgage (30-year)', rate: 0.063, term: 30 },
      { name: 'Mortgage (5-year Fixed)', rate: 0.065, term: 5 },
      { name: 'Car Loan (60 months)', rate: 0.075, term: 5 },
      { name: 'Personal Loan (60 months)', rate: 0.108, term: 5 },
      { name: 'HECS Student Loan', rate: 0.044, term: 25 },
    ],
    repaymentMethods: ['Fixed-Rate', 'Interest-Only'],
  },
};

export const EXCHANGE_RATES_LOAN = {
  USD: 1,
  GBP: 1.27,
  CAD: 0.72,
  AUD: 0.65,
};