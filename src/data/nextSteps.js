// Hand-curated "what would this person actually need next" map.
//
// The previous logic picked same-category calculators and then filled the rest
// in registration order, which produced technically-related but useless
// suggestions. These are real journeys — someone working out what they can
// borrow genuinely does need the stamp duty bill next — and each carries the
// reason, because a bare label gives the reader nothing to act on.
//
// Anything not listed here falls back to the category logic in App.jsx.

export const NEXT_STEPS = {
  // ── Property ───────────────────────────────────────────────────────────
  '/mortgage': [
    { path: '/stamp-duty', why: 'Budget the tax bill due on completion' },
    { path: '/buy-vs-rent', why: 'Check buying actually beats renting for you' },
    { path: '/salary', why: 'See the take-home pay the repayments come out of' },
  ],
  '/stamp-duty': [
    { path: '/mortgage', why: 'Work out how much you can borrow' },
    { path: '/buy-vs-rent', why: 'Compare the total cost against renting' },
    { path: '/capital-gains', why: 'If you are selling a property too' },
  ],
  '/buy-vs-rent': [
    { path: '/mortgage', why: 'Find the loan size the numbers assume' },
    { path: '/stamp-duty', why: 'Add the upfront tax to the buying side' },
    { path: '/refinance', why: 'See if a better rate changes the answer' },
  ],
  '/refinance': [
    { path: '/mortgage', why: 'Re-check affordability at the new rate' },
    { path: '/loan', why: 'Compare against a straight personal loan' },
    { path: '/buy-vs-rent', why: 'Reconsider whether to keep the property' },
  ],

  // ── Debt ───────────────────────────────────────────────────────────────
  '/credit-card-payoff': [
    { path: '/debt-consolidation', why: 'See if one cheaper loan beats this plan' },
    { path: '/loan', why: 'Price up a lower-rate personal loan' },
    { path: '/salary', why: 'Find the spare income to put against it' },
  ],
  '/debt-consolidation': [
    { path: '/credit-card-payoff', why: 'Compare against just overpaying the cards' },
    { path: '/loan', why: 'Check the consolidation loan repayments' },
    { path: '/salary', why: 'Confirm the new payment fits your take-home' },
  ],
  '/loan': [
    { path: '/auto-loan', why: 'If the loan is for a car, use the tailored version' },
    { path: '/credit-card-payoff', why: 'Clearing cards first is often cheaper' },
    { path: '/debt-consolidation', why: 'Roll several debts into one payment' },
  ],
  '/auto-loan': [
    { path: '/loan', why: 'Compare against a general personal loan' },
    { path: '/salary', why: 'Check the payment against your monthly income' },
    { path: '/debt-consolidation', why: 'If you are carrying other debt too' },
  ],

  // ── Income & employment ────────────────────────────────────────────────
  '/salary': [
    { path: '/national-insurance', why: 'Break down the NI deducted from your pay' },
    { path: '/pay-rise', why: 'See what a raise actually adds after tax' },
    { path: '/student-loan', why: 'Add your loan repayment to the deductions' },
  ],
  '/pay-rise': [
    { path: '/salary', why: 'Full take-home breakdown on the new figure' },
    { path: '/student-loan', why: 'A raise increases your repayment too' },
    { path: '/national-insurance', why: 'Check the NI on the extra income' },
  ],
  '/hourly-to-salary': [
    { path: '/salary', why: 'Turn that annual figure into take-home pay' },
    { path: '/holiday', why: 'Work out the leave you are entitled to' },
    { path: '/pay-rise', why: 'Model a higher hourly rate' },
  ],
  '/national-insurance': [
    { path: '/salary', why: 'See NI alongside income tax and pension' },
    { path: '/self-employed', why: 'Class 2 and 4 NI if you work for yourself' },
    { path: '/retirement', why: 'NI years feed your State Pension' },
  ],
  '/student-loan': [
    { path: '/salary', why: 'See the repayment inside your full payslip' },
    { path: '/pay-rise', why: 'Check how a raise changes what you repay' },
  ],
  '/redundancy': [
    { path: '/salary', why: 'Work out take-home on your final pay' },
    { path: '/holiday', why: 'Untaken leave is paid out on top' },
  ],
  '/holiday': [
    { path: '/salary', why: 'Value that leave against your pay' },
    { path: '/redundancy', why: 'Leave is paid out if you are let go' },
    { path: '/hourly-to-salary', why: 'Convert an hourly rate to annual pay' },
  ],

  // ── Self-employed & business ───────────────────────────────────────────
  '/self-employed': [
    { path: '/national-insurance', why: 'Break out the Class 2 and Class 4 NI' },
    { path: '/corporation-tax', why: 'Compare with running through a company' },
    { path: '/vat', why: 'Check what you owe once registered' },
  ],
  '/corporation-tax': [
    { path: '/dividend', why: 'Tax on taking profit out as dividends' },
    { path: '/self-employed', why: 'Compare with staying a sole trader' },
    { path: '/vat', why: 'Work out the VAT on your sales' },
  ],
  '/vat': [
    { path: '/corporation-tax', why: 'Tax on the profit underneath the VAT' },
    { path: '/self-employed', why: 'Your own income tax and NI position' },
  ],
  '/dividend': [
    { path: '/corporation-tax', why: 'Company tax paid before dividends' },
    { path: '/capital-gains', why: 'Tax if you sell the shares instead' },
    { path: '/compound', why: 'What reinvesting builds over time' },
  ],

  // ── Tax on assets ──────────────────────────────────────────────────────
  '/capital-gains': [
    { path: '/dividend', why: 'Tax on income from the same holdings' },
    { path: '/stamp-duty', why: 'If the asset is a property you are replacing' },
    { path: '/inheritance-tax', why: 'How the estate is taxed on death' },
  ],
  '/inheritance-tax': [
    { path: '/capital-gains', why: 'Tax if assets are sold rather than passed on' },
    { path: '/retirement', why: 'Pensions usually sit outside the estate' },
  ],

  // ── Investing & retirement ─────────────────────────────────────────────
  '/fire': [
    { path: '/compound', why: 'See how the pot grows year by year' },
    { path: '/retirement', why: 'Layer your pension on top of the target' },
    { path: '/roth-ira', why: 'Pick the account that keeps most of the growth' },
  ],
  '/compound': [
    { path: '/fire', why: 'Turn that growth into a retirement date' },
    { path: '/dividend', why: 'Model income-paying holdings instead' },
    { path: '/retirement', why: 'Do the same inside a pension' },
  ],
  '/retirement': [
    { path: '/roth-ira', why: 'Compare Roth against traditional contributions' },
    { path: '/social-security', why: 'Add the state benefit to your pension' },
    { path: '/fire', why: 'Find out if you could stop earlier' },
  ],
  '/roth-ira': [
    { path: '/retirement', why: 'See the whole pension picture together' },
    { path: '/social-security', why: 'Benefits you will draw alongside it' },
    { path: '/compound', why: 'Growth on the contributions over time' },
  ],
  '/social-security': [
    { path: '/retirement', why: 'Your own savings on top of the benefit' },
    { path: '/roth-ira', why: 'Withdrawals can affect how benefits are taxed' },
    { path: '/fire', why: 'Check whether you can retire before claiming' },
  ],
  '/pension-credit': [
    { path: '/social-security', why: 'The State Pension it tops up' },
    { path: '/retirement', why: 'Private pension income counts towards it' },
  ],
}
