// Guide registry — informational content that funnels organic search traffic
// into the matching calculator. Add a new guide by appending one object here
// (and add its slug to public/sitemap.xml). Rates mirror the calculators exactly
// so the content stays accurate and internally consistent.
//
// Section shapes supported by ArticlePage:
//   { h2, body: ['paragraph', ...] }
//   { h2, list: ['item', ...] }
//   { h2, body: [...], table: { headers: [...], rows: [[...], ...], note: '' } }

export const GUIDES = [
  {
    slug: 'how-is-stamp-duty-calculated-uk',
    title: 'How Is Stamp Duty Calculated in the UK? (2026 Guide) | JoinCalc',
    h1: 'How Is Stamp Duty Calculated in the UK?',
    description: 'A plain-English 2026 guide to how UK Stamp Duty Land Tax (SDLT) is worked out — the bands, first-time buyer relief, the second-home surcharge, and worked examples.',
    keywords: 'how is stamp duty calculated, stamp duty bands 2026, sdlt calculation, first time buyer stamp duty, second home stamp duty surcharge',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/stamp-duty', label: 'Stamp Duty Calculator', cta: 'Calculate your exact stamp duty in seconds' },
    intro: 'Stamp Duty Land Tax (SDLT) is the tax you pay when you buy a home or land in England or Northern Ireland above a certain price. It catches a lot of buyers by surprise because it is not a single flat percentage — it is charged in slices, like income tax. This guide explains exactly how it is calculated for the 2026 rates, with worked examples for first-time buyers, home movers and people buying an additional property.',
    sections: [
      {
        h2: 'Stamp duty is charged in bands, not all at once',
        body: [
          'The single most important thing to understand is that SDLT is "progressive". You do not pay one rate on the whole purchase price. Instead, each slice of the price falls into a band, and you pay that band\'s rate only on the portion of the price inside it.',
          'So if you buy a £300,000 home as a standard buyer, you pay 0% on the first £125,000, 2% on the next £125,000, and 5% only on the final £50,000 — not 5% on the whole £300,000. This is why a quick "price × rate" sum almost always overstates the bill.',
        ],
      },
      {
        h2: 'Standard residential stamp duty rates (2026)',
        body: ['These rates apply if you are buying your only home and are not a first-time buyer.'],
        table: {
          headers: ['Portion of price', 'Rate'],
          rows: [
            ['Up to £125,000', '0%'],
            ['£125,001 – £250,000', '2%'],
            ['£250,001 – £925,000', '5%'],
            ['£925,001 – £1,500,000', '10%'],
            ['Above £1,500,000', '12%'],
          ],
          note: 'Rates for England & Northern Ireland. Scotland (LBTT) and Wales (LTT) use different systems.',
        },
      },
      {
        h2: 'Worked example: a £350,000 home',
        list: [
          'First £125,000 at 0% = £0',
          'Next £125,000 (£125k–£250k) at 2% = £2,500',
          'Final £100,000 (£250k–£350k) at 5% = £5,000',
          'Total SDLT = £7,500 (an effective rate of about 2.1%)',
        ],
      },
      {
        h2: 'First-time buyer relief',
        body: [
          'First-time buyers pay no stamp duty on the first £300,000 and 5% on the portion between £300,000 and £500,000. If the property costs more than £500,000 you get no first-time buyer relief at all and pay the standard rates.',
          'For example, a first-time buyer purchasing at £400,000 pays 0% on the first £300,000 and 5% on the remaining £100,000 — a total of £5,000.',
        ],
      },
      {
        h2: 'The additional property surcharge',
        body: [
          'If you are buying a second home, a buy-to-let, or any additional residential property, a surcharge of 5 percentage points is added to every band. So the first £125,000 is taxed at 5% (instead of 0%), the next band at 7%, and so on.',
          'The surcharge can usually be reclaimed if you are replacing your main residence and sell your previous home within the time limit set by HMRC.',
        ],
      },
    ],
    faq: [
      { q: 'Do first-time buyers pay any stamp duty?', a: 'Not on the first £300,000. Above that you pay 5% on the portion up to £500,000. If the home costs more than £500,000, first-time buyer relief does not apply and standard rates are used.' },
      { q: 'When do I have to pay stamp duty?', a: 'SDLT must be paid to HMRC within 14 days of completion. In practice your solicitor or conveyancer usually files the return and pays it on your behalf from the funds at completion.' },
      { q: 'Is stamp duty different in Scotland and Wales?', a: 'Yes. Scotland uses Land and Buildings Transaction Tax (LBTT) and Wales uses Land Transaction Tax (LTT), each with their own bands. SDLT only applies in England and Northern Ireland.' },
      { q: 'Can I add stamp duty to my mortgage?', a: 'SDLT itself is normally paid in cash at completion, but some buyers borrow slightly more to cover it. Doing so increases your loan-to-value and the total interest you pay over the mortgage term.' },
    ],
    related: ['how-is-national-insurance-calculated-uk', 'how-much-capital-gains-tax-uk'],
  },

  {
    slug: 'how-much-capital-gains-tax-uk',
    title: 'How Much Capital Gains Tax Will I Pay? (UK 2026 Guide) | JoinCalc',
    h1: 'How Much Capital Gains Tax Will I Pay in the UK?',
    description: 'Understand UK Capital Gains Tax for 2026: the £3,000 annual exempt amount, the 18% and 24% rates, how your income changes the rate, and worked examples for shares and property.',
    keywords: 'how much capital gains tax, uk cgt rates 2026, capital gains tax allowance 2026, cgt on shares, cgt on property uk',
    updated: 'June 2026',
    readMins: 7,
    tool: { path: '/capital-gains', label: 'Capital Gains Tax Calculator', cta: 'Estimate your CGT bill for shares, property or crypto' },
    intro: 'Capital Gains Tax (CGT) is the tax on the profit when you sell something that has gone up in value — shares, a second property, crypto, or a business. You are taxed on the gain, not the full sale price, and only after your tax-free allowance. This guide explains how the 2026 rates work and how your other income decides whether you pay the lower or higher rate.',
    sections: [
      {
        h2: 'You are taxed on the gain, after an allowance',
        body: [
          'Your gain is the sale price minus what you paid, minus allowable costs such as buying and selling fees or qualifying improvement work. From that you subtract the annual exempt amount (AEA), which is £3,000 for 2026. Only what is left is taxable.',
          'If your total gains for the year are below £3,000, you have no CGT to pay — though you may still need to report larger disposals to HMRC.',
        ],
      },
      {
        h2: 'UK Capital Gains Tax rates (2026)',
        body: ['The rate you pay depends on your total taxable income, because your gains are effectively stacked on top of your income.'],
        table: {
          headers: ['Your situation', 'CGT rate on most assets'],
          rows: [
            ['Basic-rate taxpayer (income + gains within the basic band)', '18%'],
            ['Higher / additional-rate taxpayer', '24%'],
          ],
          note: 'The basic-rate band ends at £50,270 and the personal allowance is £12,570 for 2026/27.',
        },
      },
      {
        h2: 'How your income changes your CGT rate',
        body: [
          'CGT is not charged in isolation. You add your taxable gain on top of your income to see how much of it falls within the basic-rate band (up to £50,270) and how much spills into the higher band.',
          'The part of the gain sitting within the basic-rate band is taxed at 18%, and any part above it at 24%. So a single gain can be taxed partly at 18% and partly at 24%.',
        ],
      },
      {
        h2: 'Worked example: selling shares',
        list: [
          'You earn £40,000 of salary and make a £20,000 gain on shares.',
          'Subtract the £3,000 allowance → £17,000 taxable gain.',
          'You have about £10,270 of unused basic-rate band (£50,270 − £40,000), taxed at 18% = £1,848.60.',
          'The remaining £6,730 is taxed at 24% = £1,615.20.',
          'Total CGT ≈ £3,464.',
        ],
      },
      {
        h2: 'Reliefs and things that are exempt',
        list: [
          'Your main home is normally exempt under Private Residence Relief.',
          'Gains inside an ISA or pension are free of CGT.',
          'Transfers between spouses or civil partners are exempt and can be used to use both partners\' allowances.',
          'ISAs are a common, legitimate way to shelter future gains from CGT.',
        ],
      },
    ],
    faq: [
      { q: 'What is the capital gains tax allowance for 2026?', a: 'The annual exempt amount is £3,000. You only pay CGT on gains above this figure in a tax year.' },
      { q: 'Do I pay capital gains tax on my home?', a: 'Usually not. Your main residence is normally covered by Private Residence Relief, so selling the home you live in does not trigger CGT. Second homes and buy-to-lets are not exempt.' },
      { q: 'Is crypto subject to capital gains tax?', a: 'Yes. HMRC treats most cryptoassets like shares for individuals, so selling, swapping or spending crypto can create a taxable gain in the same way.' },
      { q: 'What are the CGT rates on residential property?', a: 'Gains on residential property that is not your main home are taxed at the same 18% and 24% bands for 2026, based on where the gain falls relative to the basic-rate threshold.' },
    ],
    related: ['how-is-stamp-duty-calculated-uk', 'how-is-national-insurance-calculated-uk'],
  },

  {
    slug: 'how-is-national-insurance-calculated-uk',
    title: 'How Is National Insurance Calculated? (UK 2026/27 Guide) | JoinCalc',
    h1: 'How Is National Insurance Calculated in the UK?',
    description: 'A clear 2026/27 guide to UK National Insurance: the £12,570 threshold, the 8% and 2% employee rates, what employers pay, and worked examples of your monthly deduction.',
    keywords: 'how is national insurance calculated, national insurance rates 2026, how much national insurance do i pay, class 1 ni 2026, ni threshold 2026',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/national-insurance', label: 'National Insurance Calculator', cta: 'See your exact National Insurance for 2026/27' },
    intro: 'National Insurance (NI) is a deduction from your pay that builds up your entitlement to the State Pension and certain benefits. Most employees pay Class 1 NI, taken automatically through PAYE. This guide explains how it is worked out for 2026/27, what the thresholds and rates are, and how to estimate your own monthly deduction.',
    sections: [
      {
        h2: 'National Insurance is banded, like income tax',
        body: [
          'You pay nothing on earnings below the primary threshold of £12,570 a year. Between £12,570 and the upper earnings limit of £50,270 you pay the main rate of 8%. On anything above £50,270 you pay 2%.',
          'Like income tax, this is sliced: a higher earner pays 8% on the middle band and only 2% on the part above £50,270 — not 8% on everything.',
        ],
      },
      {
        h2: 'Employee National Insurance rates (2026/27)',
        table: {
          headers: ['Annual earnings', 'Employee NI rate'],
          rows: [
            ['Up to £12,570', '0%'],
            ['£12,570 – £50,270', '8%'],
            ['Above £50,270', '2%'],
          ],
          note: 'Class 1 (Category A) employee rates. NI is normally calculated per pay period, not annually.',
        },
      },
      {
        h2: 'Worked example: a £35,000 salary',
        list: [
          'Earnings below £12,570 → £0 NI.',
          'Earnings between £12,570 and £35,000 = £22,430, taxed at 8% = about £1,794 per year.',
          'That is roughly £150 a month in National Insurance.',
        ],
      },
      {
        h2: 'What your employer pays on top',
        body: [
          'Separately from your own deduction, your employer pays Class 1 NI on your earnings above the secondary threshold of £5,000 at a rate of 15% for 2026/27. This is an employment cost to them and does not come out of your take-home pay, but it is worth knowing about when negotiating salary or working out the true cost of hiring.',
        ],
      },
      {
        h2: 'National Insurance vs income tax',
        body: [
          'NI and income tax are separate deductions with different thresholds, so your payslip shows both. Income tax uses the £12,570 personal allowance and 20% / 40% / 45% bands, while NI uses the 8% / 2% structure above. Your take-home pay is your salary minus both.',
        ],
      },
    ],
    faq: [
      { q: 'How much National Insurance do I pay on £30,000?', a: 'On a £30,000 salary you pay 8% on earnings between £12,570 and £30,000 — about £1,394 a year, or roughly £116 a month, for 2026/27.' },
      { q: 'At what salary do you start paying National Insurance?', a: 'You start paying employee National Insurance once your earnings exceed the primary threshold of £12,570 a year (calculated per pay period in practice).' },
      { q: 'Do I pay National Insurance after State Pension age?', a: 'Generally no. Employees stop paying Class 1 NI once they reach State Pension age, even if they keep working, though their employer may still pay employer NI.' },
      { q: 'Does National Insurance count towards my pension?', a: 'Yes. Your NI record determines your entitlement to the State Pension. You typically need around 35 qualifying years for the full new State Pension and at least 10 to get any.' },
    ],
    related: ['how-much-redundancy-pay-uk', 'how-is-stamp-duty-calculated-uk'],
  },

  {
    slug: 'how-much-redundancy-pay-uk',
    title: 'How Much Redundancy Pay Am I Entitled To? (UK 2026 Guide) | JoinCalc',
    h1: 'How Much Redundancy Pay Am I Entitled To?',
    description: 'A 2026 guide to UK statutory redundancy pay: who qualifies, the age-based formula, the £751 weekly cap, the 20-year limit, and how the first £30,000 is tax-free.',
    keywords: 'how much redundancy pay, statutory redundancy pay 2026, redundancy pay calculator uk, redundancy weekly cap 2026, is redundancy pay taxed',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/redundancy', label: 'Redundancy Pay Calculator', cta: 'Work out your statutory redundancy entitlement' },
    intro: 'If you are made redundant after at least two years with an employer, you are usually entitled to statutory redundancy pay. The amount depends on your age, your length of service and your weekly pay — within set caps. This guide explains the 2026 formula and how the payment is taxed.',
    sections: [
      {
        h2: 'Who qualifies for statutory redundancy pay',
        body: [
          'You generally qualify if you are an employee with at least two years\' continuous service and you are being genuinely made redundant — that is, your role is no longer needed. Agency workers, the genuinely self-employed and some other groups are treated differently.',
        ],
      },
      {
        h2: 'The age-based formula',
        body: ['Statutory redundancy pay gives you a number of weeks\' pay for each full year of service, based on your age during that year:'],
        table: {
          headers: ['Age during the year of service', "Weeks' pay per year"],
          rows: [
            ['Under 22', 'Half a week'],
            ['22 to 40', 'One week'],
            ['41 and over', 'One and a half weeks'],
          ],
          note: 'A maximum of 20 years of service can be counted.',
        },
      },
      {
        h2: 'The weekly pay cap',
        body: [
          'Your weekly pay is capped for the statutory calculation. For 2026 the cap is £751 a week in England, Wales and Scotland (£749 in Northern Ireland). If you earn more than the cap, the calculation still only uses the capped figure — although your employer may pay more under a contractual or enhanced scheme.',
        ],
      },
      {
        h2: 'Worked example',
        list: [
          'You are 45, with 10 full years of service, earning £900 a week.',
          'Weekly pay is capped at £751.',
          'Years aged 41+ count at 1.5 weeks each. If all 10 years were after age 41, that is 15 weeks.',
          'Statutory redundancy ≈ 15 × £751 = £11,265.',
        ],
      },
      {
        h2: 'How redundancy pay is taxed',
        body: [
          'Genuine statutory and contractual redundancy payments are tax-free up to £30,000. Anything above £30,000 is taxed as income in the normal way. Note that pay in lieu of notice and any outstanding holiday pay are taxed and do not benefit from the £30,000 exemption.',
        ],
      },
    ],
    faq: [
      { q: 'How many years do I need to get redundancy pay?', a: 'You normally need at least two years of continuous employment with the same employer to qualify for statutory redundancy pay.' },
      { q: 'Is redundancy pay taxed in the UK?', a: 'Genuine redundancy payments are tax-free up to £30,000. Any amount above £30,000 is subject to income tax, and items like pay in lieu of notice are taxed separately.' },
      { q: 'What is the maximum statutory redundancy pay?', a: 'With the 2026 cap of £751 a week, 20 years of service and the 1.5-week rate, statutory redundancy is capped at around £22,530 — though enhanced employer schemes can pay more.' },
      { q: 'Does my employer have to pay enhanced redundancy?', a: 'No. Enhanced redundancy is only required if it is in your contract or an agreed policy. Otherwise the statutory minimum applies.' },
    ],
    related: ['how-is-national-insurance-calculated-uk', 'how-much-capital-gains-tax-uk'],
  },

  {
    slug: 'how-to-calculate-take-home-pay-uk',
    title: 'How to Calculate Your Take-Home Pay (UK 2026/27) | JoinCalc',
    h1: 'How to Calculate Your Take-Home Pay in the UK',
    description: 'Work out your UK take-home pay for 2026/27 — income tax bands, the £12,570 personal allowance, National Insurance, and what actually lands in your bank account.',
    keywords: 'how to calculate take home pay, take home pay calculator uk, net salary uk 2026, after tax salary uk, what is my take home pay',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/salary', label: 'Salary Take-Home Calculator', cta: 'See your exact take-home pay after tax' },
    intro: 'Your take-home pay (net pay) is what reaches your bank account after income tax and National Insurance are deducted from your gross salary. This guide shows how the 2026/27 deductions are worked out so you can sanity-check your payslip and understand exactly where your money goes.',
    sections: [
      {
        h2: 'The two main deductions',
        body: ['For most employees, take-home pay is gross salary minus income tax and National Insurance. Pension contributions and student loan repayments may also be taken off, but tax and NI are the two everyone pays.'],
      },
      {
        h2: 'Income tax bands (2026/27)',
        body: ['You get a tax-free personal allowance, then pay tax in bands on the rest:'],
        table: {
          headers: ['Band', 'Taxable income', 'Rate'],
          rows: [
            ['Personal allowance', 'Up to £12,570', '0%'],
            ['Basic rate', '£12,571 – £50,270', '20%'],
            ['Higher rate', '£50,271 – £125,140', '40%'],
            ['Additional rate', 'Over £125,140', '45%'],
          ],
          note: 'The personal allowance tapers away by £1 for every £2 earned above £100,000.',
        },
      },
      {
        h2: 'National Insurance on top',
        body: ['Employees also pay Class 1 National Insurance: 8% on earnings between £12,570 and £50,270, then 2% above that. NI is a separate deduction from income tax, with its own thresholds.'],
      },
      {
        h2: 'Worked example: £35,000 salary',
        list: [
          'Income tax: 20% on £22,430 (£35,000 − £12,570) ≈ £4,486.',
          'National Insurance: 8% on £22,430 ≈ £1,794.',
          'Take-home pay ≈ £28,720 a year, or about £2,393 a month.',
        ],
      },
    ],
    faq: [
      { q: 'How much is £30,000 after tax in the UK?', a: 'A £30,000 salary gives roughly £24,900 take-home for 2026/27 after income tax (about £3,486) and National Insurance (about £1,394) — around £2,075 a month.' },
      { q: 'Does take-home pay include pension contributions?', a: 'If you contribute to a workplace pension, that comes out before you get your take-home pay, so it reduces your net figure but builds your retirement pot. This guide assumes no pension contribution.' },
      { q: 'Why is my take-home pay lower than expected?', a: 'Common reasons include pension contributions, student loan repayments, a non-standard tax code, or benefits in kind being taxed through your code.' },
    ],
    related: ['how-is-national-insurance-calculated-uk', 'how-much-redundancy-pay-uk'],
  },

  {
    slug: 'uk-vat-rates-explained',
    title: 'UK VAT Rates Explained (2026) — Standard, Reduced & Zero | JoinCalc',
    h1: 'UK VAT Rates Explained',
    description: 'A simple guide to UK VAT in 2026: the 20% standard, 5% reduced and 0% zero rates, what each applies to, the £90,000 registration threshold, and how to add or remove VAT.',
    keywords: 'uk vat rate, what is the vat rate, vat rates explained, how to work out vat, vat registration threshold 2026',
    updated: 'June 2026',
    readMins: 5,
    tool: { path: '/vat', label: 'VAT Calculator', cta: 'Add or remove VAT in one click' },
    intro: 'VAT (Value Added Tax) is a consumption tax added to most goods and services in the UK. The headline rate is 20%, but reduced and zero rates apply to certain items. This guide explains the rates, what they cover, and the simple maths for adding or removing VAT.',
    sections: [
      {
        h2: 'The UK VAT rates',
        table: {
          headers: ['Rate', '%', 'Examples'],
          rows: [
            ['Standard', '20%', 'Most goods and services'],
            ['Reduced', '5%', 'Domestic energy, children\'s car seats'],
            ['Zero', '0%', 'Most food, books, children\'s clothing'],
            ['Exempt', '—', 'Insurance, postage, financial services'],
          ],
          note: 'Zero-rated items are taxable at 0% (and can be reclaimed by businesses); exempt items are outside VAT entirely.',
        },
      },
      {
        h2: 'How to add VAT',
        body: ['To add 20% VAT, multiply the net price by 1.20. So £100 net becomes £120 gross, of which £20 is VAT.'],
      },
      {
        h2: 'How to remove VAT',
        body: ['To find the VAT inside a gross (VAT-inclusive) price, divide by 1.20 — not subtract 20%. £120 gross ÷ 1.2 = £100 net, so the VAT is £20. Subtracting 20% would wrongly give £96.'],
      },
      {
        h2: 'When does a business have to register?',
        body: ['A business must register for VAT once its VAT-taxable turnover passes the registration threshold — £90,000 as of 2024, the latest confirmed figure. Below that, registration is optional but can let a business reclaim VAT on its purchases.'],
      },
    ],
    faq: [
      { q: 'What is the current UK VAT rate?', a: 'The standard rate is 20% and applies to most goods and services. Reduced (5%) and zero (0%) rates apply to specific categories.' },
      { q: 'How do I work out 20% VAT?', a: 'To add VAT, multiply the net price by 1.2. To find VAT within a gross price, divide by 1.2 and subtract the result from the gross.' },
      { q: 'Is there VAT on food in the UK?', a: 'Most basic foodstuffs are zero-rated, but there are exceptions such as hot takeaway food, confectionery, and restaurant meals, which are standard-rated at 20%.' },
    ],
    related: ['how-much-capital-gains-tax-uk', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'how-compound-interest-works',
    title: 'How Compound Interest Works (with Examples) | JoinCalc',
    h1: 'How Compound Interest Works',
    description: 'Understand compound interest: how earning interest on interest creates exponential growth, the Rule of 72, and worked examples showing why starting early matters most.',
    keywords: 'how compound interest works, compound interest explained, rule of 72, compound interest examples, power of compounding',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/compound', label: 'Compound Interest Calculator', cta: 'See how your money could grow over time' },
    intro: 'Compound interest is interest earned on both your original money and the interest it has already earned. Over time this snowballs into exponential growth, which is why it is often called the most powerful force in investing. Here is how it works and why time matters more than the amount.',
    sections: [
      {
        h2: 'Simple vs compound interest',
        body: ['Simple interest is paid only on your original principal. Compound interest is paid on the principal plus all previously earned interest, so each year you earn a little more than the last. On £10,000 at 8% for 30 years, compounding turns it into about £100,000 — far more than simple interest would.'],
      },
      {
        h2: 'The Rule of 72',
        body: ['A quick way to estimate doubling time is to divide 72 by your annual return. At 8%, money doubles roughly every 9 years; at 6%, every 12 years. It shows how higher returns and longer time horizons compound dramatically.'],
      },
      {
        h2: 'Why starting early beats investing more',
        list: [
          'Investing £200/month from age 25 to 65 at 7% grows to roughly £525,000.',
          'Waiting until 35 to start the same £200/month leaves you with about £245,000.',
          'Ten extra years roughly doubles the result — time is the biggest lever.',
        ],
      },
      {
        h2: 'How often interest compounds',
        body: ['Interest can compound annually, monthly or daily. More frequent compounding grows slightly faster. Most savings accounts and funds effectively compound monthly, which is what our calculator assumes.'],
      },
    ],
    faq: [
      { q: 'What is compound interest in simple terms?', a: 'It is interest earned on your interest. Each period you earn returns on a slightly larger balance, so growth accelerates over time.' },
      { q: 'How can I become a millionaire with compound interest?', a: 'Investing around £500 a month at a 7–8% long-term return for about 35 years can compound past £1 million. Starting earlier dramatically reduces how much you need to contribute.' },
      { q: 'Does compound interest beat inflation?', a: 'Over long periods, investments compounding at 6–8% have historically outpaced inflation, though returns are not guaranteed and inflation reduces real spending power.' },
    ],
    related: ['what-is-a-fire-number', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'student-loan-repayments-explained',
    title: 'UK Student Loan Repayments Explained (Plan 1, 2, 4, 5 & PG) | JoinCalc',
    h1: 'UK Student Loan Repayments Explained',
    description: 'How UK student loan repayments work in 2026: the repayment thresholds for Plan 1, 2, 4, 5 and Postgraduate loans, the 9% rate, and when loans are written off.',
    keywords: 'student loan repayment uk, plan 2 student loan threshold, when do i repay student loan, student loan plan 5, postgraduate loan repayment',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/student-loan', label: 'Student Loan Repayment Calculator', cta: 'Estimate your monthly student loan repayment' },
    intro: 'UK student loan repayments are income-contingent: you only repay once you earn above your plan\'s threshold, and the amount is a percentage of income above it — not the size of your debt. This guide explains the thresholds for each plan and how repayments and write-off work.',
    sections: [
      {
        h2: 'You repay a percentage of income above a threshold',
        body: ['For undergraduate plans you repay 9% of everything you earn above the repayment threshold. Postgraduate loans are 6%. Earn below the threshold and you repay nothing that month. The balance does not affect your monthly repayment.'],
      },
      {
        h2: 'Repayment thresholds by plan (2026)',
        table: {
          headers: ['Plan', 'Annual threshold', 'Rate'],
          rows: [
            ['Plan 1', '£24,990', '9%'],
            ['Plan 2', '£29,385', '9%'],
            ['Plan 4 (Scotland)', '£32,745', '9%'],
            ['Plan 5', '£25,000', '9%'],
            ['Postgraduate', '£21,000', '6%'],
          ],
          note: 'Which plan you are on depends on where and when you started studying.',
        },
      },
      {
        h2: 'Worked example (Plan 2)',
        list: [
          'You earn £35,000 and are on Plan 2 (£29,385 threshold).',
          'Income above the threshold: £5,615.',
          'Repayment: 9% of £5,615 ≈ £505 a year, or about £42 a month.',
        ],
      },
      {
        h2: 'When is the loan written off?',
        body: ['Any remaining balance is written off after a set period — for example 30 years after you become eligible to repay on Plan 2, and 40 years on Plan 5. Many borrowers never repay the full amount, so it often behaves more like a graduate contribution than a typical loan.'],
      },
    ],
    faq: [
      { q: 'How much do I repay on a £35,000 salary?', a: 'On Plan 2, you repay 9% of income above £29,385 — about £505 a year (£42 a month) at a £35,000 salary. Other plans use different thresholds.' },
      { q: 'Do student loan repayments stop automatically?', a: 'Repayments stop when your income drops below the threshold and when the loan is repaid or written off. They are collected through PAYE, so they adjust automatically with your pay.' },
      { q: 'Does my student loan affect my credit score?', a: 'No. UK student loans do not appear on your credit file and do not directly affect your credit score, though lenders may consider the repayment in affordability checks.' },
    ],
    related: ['how-to-calculate-take-home-pay-uk', 'how-is-national-insurance-calculated-uk'],
  },

  {
    slug: 'how-much-can-i-borrow-for-a-mortgage',
    title: 'How Much Can I Borrow for a Mortgage? (UK 2026) | JoinCalc',
    h1: 'How Much Can I Borrow for a Mortgage?',
    description: 'How UK mortgage affordability works in 2026: income multiples (typically 4–4.5x), affordability stress tests, deposits, and what lenders actually look at.',
    keywords: 'how much can i borrow mortgage, mortgage affordability uk, income multiple mortgage, how much mortgage can i get, mortgage borrowing calculator',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/mortgage', label: 'Mortgage Affordability Calculator', cta: 'Estimate how much you could borrow' },
    intro: 'How much you can borrow for a UK mortgage depends mainly on your income, your outgoings and your deposit. Lenders start from an income multiple and then apply affordability checks. This guide explains the rules of thumb and what really moves the number.',
    sections: [
      {
        h2: 'The income multiple rule of thumb',
        body: ['Most UK lenders cap borrowing at around 4 to 4.5 times your annual income, and occasionally up to 5.5x for higher earners or specific products. So a household income of £50,000 typically supports a mortgage of roughly £200,000–£225,000 before other factors.'],
      },
      {
        h2: 'Affordability and stress tests',
        body: ['Beyond the multiple, lenders assess affordability: your regular outgoings, existing debts, childcare and credit commitments. They also stress-test whether you could still pay if interest rates rose, so high outgoings reduce what you can borrow even on a good income.'],
      },
      {
        h2: 'Your deposit changes everything',
        list: [
          'A bigger deposit lowers your loan-to-value (LTV) and unlocks better rates.',
          'Typical deposits range from 5% to 25% of the property price.',
          'At 90% LTV you borrow more but usually pay a higher interest rate than at 75% LTV.',
        ],
      },
      {
        h2: 'What lenders look at',
        body: ['Income (including some bonuses and self-employed profits), outgoings, credit history, the property type, and the term all feed into the decision. A longer term lowers monthly payments and can increase the maximum loan, but costs more interest overall.'],
      },
    ],
    faq: [
      { q: 'How much can I borrow on a £50,000 salary?', a: 'As a rough guide, 4–4.5x income suggests about £200,000–£225,000, but your outgoings, deposit and credit profile can move this up or down significantly.' },
      { q: 'Do two incomes count for a joint mortgage?', a: 'Yes. Lenders usually combine both applicants\' incomes, though the multiple applied to the joint figure may be slightly lower than for a single applicant.' },
      { q: 'Does a bigger deposit mean I can borrow more?', a: 'A bigger deposit mainly lets you buy a more expensive home and access lower rates. The loan itself is still capped by income and affordability.' },
    ],
    related: ['how-is-stamp-duty-calculated-uk', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'what-is-a-fire-number',
    title: 'What Is a FIRE Number and How Do I Calculate It? | JoinCalc',
    h1: 'What Is a FIRE Number?',
    description: 'Learn what a FIRE number is, how the 25x rule and 4% safe withdrawal rate work, and how to estimate the pot you need to retire early.',
    keywords: 'fire number, what is fire number, 4 percent rule, 25x rule retirement, how much to retire early, financial independence number',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/fire', label: 'FIRE Calculator', cta: 'Work out your FIRE number and target age' },
    intro: 'FIRE stands for Financial Independence, Retire Early. Your "FIRE number" is the size of investment pot that could fund your lifestyle indefinitely from returns and withdrawals, so that paid work becomes optional. Here is how it is estimated.',
    sections: [
      {
        h2: 'The 25x rule',
        body: ['A common starting point is 25 times your annual spending. If you need £30,000 a year, your FIRE number is about £750,000. The logic comes from the 4% safe withdrawal rate, since 1 ÷ 0.04 = 25.'],
      },
      {
        h2: 'The 4% rule',
        body: ['The 4% rule suggests that withdrawing about 4% of your pot in the first year of retirement, then adjusting for inflation, has historically had a high chance of lasting 30+ years. It is a guide, not a guarantee — some choose a more cautious 3–3.5%.'],
      },
      {
        h2: 'Worked example',
        list: [
          'Annual spending: £40,000.',
          'FIRE number at 25x: £1,000,000.',
          'A more cautious 30x (3.3% withdrawal): £1,200,000.',
        ],
      },
      {
        h2: 'Variations of FIRE',
        list: [
          'Lean FIRE — a smaller pot funding a frugal lifestyle.',
          'Fat FIRE — a larger pot for a more comfortable lifestyle.',
          'Coast FIRE — investing enough early that growth alone reaches your number by retirement age.',
        ],
      },
    ],
    faq: [
      { q: 'How do I calculate my FIRE number?', a: 'Multiply your expected annual spending in retirement by 25 (the inverse of the 4% rule). For £30,000 a year that is £750,000.' },
      { q: 'Is the 4% rule safe?', a: 'It has historically worked for 30-year retirements in most scenarios, but it is not guaranteed. Longer retirements or poor early returns may call for a lower withdrawal rate such as 3–3.5%.' },
      { q: 'Does my pension count towards FIRE?', a: 'Yes. Pensions, ISAs and other investments all count toward your FIRE number, though access ages differ — private pensions are usually locked until your late 50s.' },
    ],
    related: ['how-compound-interest-works', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'how-to-pay-off-credit-card-debt-fast',
    title: 'How to Pay Off Credit Card Debt Fast (2026) | JoinCalc',
    h1: 'How to Pay Off Credit Card Debt Fast',
    description: 'Practical, proven ways to clear credit card debt faster in 2026: pay more than the minimum, the avalanche method, 0% balance transfers, and lower-rate loans.',
    keywords: 'how to pay off credit card debt, pay off debt fast, credit card payoff strategy, get out of debt, balance transfer',
    updated: 'June 2026',
    readMins: 7,
    tool: { path: '/credit-card-payoff', label: 'Credit Card Payoff Calculator', cta: 'See how fast you could be debt-free' },
    intro: 'Credit card debt is expensive because the average APR is around 20–24%, so most of a minimum payment goes to interest, not the balance. The good news: a few simple moves can cut years and thousands of dollars off your payoff. Here are the strategies that actually work.',
    sections: [
      {
        h2: 'Pay more than the minimum',
        body: ['Minimum payments are designed to keep you in debt. On a $5,000 balance at 22% APR, paying the minimum can take over a decade and cost more in interest than the original balance. Paying even an extra $50–$100 a month sends more to principal and dramatically shortens the payoff.'],
      },
      {
        h2: 'Use the avalanche method',
        body: ['List your cards by interest rate. Pay the minimum on all of them, then put every spare dollar toward the highest-APR card first. Once it is cleared, roll that payment onto the next. The avalanche method mathematically minimises the total interest you pay.'],
      },
      {
        h2: 'Consider a 0% balance transfer',
        body: ['A balance transfer card with a 0% introductory APR (often 12–21 months) lets your whole payment go to principal during the promo. Watch the transfer fee (typically 3–5%) and have a plan to clear the balance before the standard rate kicks in.'],
      },
      {
        h2: 'Look at a lower-rate loan',
        list: [
          'A personal loan at a fixed, lower rate can consolidate several cards into one cheaper payment.',
          'It replaces revolving debt with a fixed payoff date.',
          'Only worth it if the new rate is meaningfully lower and you stop adding new card debt.',
        ],
      },
      {
        h2: 'Stop the bleeding',
        body: ['None of this works if new charges keep landing on the card. Pause card spending, build a small emergency buffer so surprises do not go on the card, and automate your extra payment so it happens before you can spend it.'],
      },
    ],
    faq: [
      { q: 'Is it better to pay off debt or save?', a: 'Build a small starter emergency fund (around $1,000), then prioritise high-interest debt. Few savings accounts pay more than a 20%+ APR costs you, so clearing card debt is usually the better "return".' },
      { q: 'Will a balance transfer hurt my credit?', a: 'There may be a small temporary dip from the new application, but lowering your overall balance improves your credit utilisation, which usually helps your score over time.' },
      { q: 'What is the fastest way to pay off credit cards?', a: 'Pay as much as your budget allows above the minimum, target the highest-APR balance first, and cut the interest rate with a 0% transfer or lower-rate loan where possible.' },
    ],
    related: ['avalanche-vs-snowball-debt-payoff', 'how-compound-interest-works'],
  },

  {
    slug: 'avalanche-vs-snowball-debt-payoff',
    title: 'Avalanche vs Snowball: The Best Way to Pay Off Debt | JoinCalc',
    h1: 'Avalanche vs Snowball: Which Debt Payoff Method Wins?',
    description: 'Compare the debt avalanche and debt snowball methods — how each works, which saves the most money, which keeps you motivated, and how to choose.',
    keywords: 'debt avalanche vs snowball, debt snowball method, debt avalanche method, best way to pay off debt, debt payoff strategy',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/credit-card-payoff', label: 'Credit Card Payoff Calculator', cta: 'Model your own payoff plan' },
    intro: 'The two most popular debt payoff strategies are the avalanche and the snowball. Both have you pay the minimum on every debt and throw extra money at one target debt — they just disagree on which debt to attack first. Here is how they compare.',
    sections: [
      {
        h2: 'The avalanche method (lowest cost)',
        body: ['With the avalanche, you target the debt with the highest interest rate first, regardless of balance. Because you are killing the most expensive interest first, this method mathematically minimises the total interest paid and clears your debt soonest.'],
      },
      {
        h2: 'The snowball method (most motivating)',
        body: ['With the snowball, you target the smallest balance first. You get a quick win when the first debt disappears, then roll its payment onto the next. It usually costs slightly more interest than the avalanche, but the early wins keep many people motivated enough to actually finish.'],
      },
      {
        h2: 'Which should you choose?',
        list: [
          'Choose avalanche if you want to pay the least interest and stay disciplined by the numbers.',
          'Choose snowball if motivation is your biggest risk and quick wins keep you going.',
          'The best method is the one you will actually stick with to the end.',
        ],
      },
      {
        h2: 'A worked comparison',
        body: ['For most people with a few cards, the difference in total interest between the two methods is modest — often a few hundred dollars — while the difference in completion rate can be huge. That is why many advisers suggest the snowball for anyone who has struggled to stay on track.'],
      },
    ],
    faq: [
      { q: 'Does the avalanche or snowball save more money?', a: 'The avalanche method saves more interest because it tackles the highest-rate debt first. The snowball usually costs a little more but can be easier to stick with.' },
      { q: 'Can I combine the two methods?', a: 'Yes. Some people clear one tiny balance first for a quick win (snowball), then switch to attacking the highest rate (avalanche) for the rest.' },
      { q: 'Do these methods work for any debt?', a: 'Yes — credit cards, personal loans, car loans and more. List every debt, pay minimums on all, and direct your extra payment at the chosen target.' },
    ],
    related: ['how-to-pay-off-credit-card-debt-fast', 'how-compound-interest-works'],
  },

  {
    slug: 'how-much-car-can-i-afford',
    title: 'How Much Car Can I Afford? (2026 Guide) | JoinCalc',
    h1: 'How Much Car Can I Afford?',
    description: 'How to work out a car budget you can actually afford in 2026 — the 20/4/10 rule, total cost of ownership, down payments, and loan term traps.',
    keywords: 'how much car can i afford, car affordability, 20/4/10 rule, car budget, auto loan affordability',
    updated: 'June 2026',
    readMins: 6,
    tool: { path: '/auto-loan', label: 'Auto Loan Calculator', cta: 'Estimate your monthly car payment' },
    intro: 'A car is one of the biggest purchases most people make, and the sticker price is only part of the story. Working out what you can really afford means looking at the down payment, the loan, and the running costs together. Here is a simple framework.',
    sections: [
      {
        h2: 'The 20/4/10 rule',
        list: [
          'Put at least 20% down.',
          'Finance for no more than 4 years (48 months).',
          'Keep total car costs (payment + insurance) under 10% of your gross income.',
        ],
      },
      {
        h2: 'Look at total cost of ownership',
        body: ['The monthly loan payment is just the start. Insurance, fuel, maintenance, tax and depreciation can add as much again. A cheaper car with lower running costs often beats a pricier one that strains your budget every month.'],
      },
      {
        h2: 'Why long loan terms are a trap',
        body: ['Stretching a loan to 72 or 84 months lowers the monthly payment but means far more interest and years of "negative equity", where you owe more than the car is worth. Keeping the term to 48–60 months protects your finances.'],
      },
      {
        h2: 'Down payment matters',
        body: ['A bigger down payment lowers your monthly payment and total interest, reduces the risk of going underwater, and can unlock a better rate. Aim for 20% on a new car, or 10% on a used one as a minimum.'],
      },
    ],
    faq: [
      { q: 'What car payment can I afford on $60,000 a year?', a: 'Using the 10% guideline, total car costs (payment plus insurance) of around $500 a month is a reasonable ceiling on a $60,000 salary — so a loan payment of roughly $350–$400 a month.' },
      { q: 'How much should I spend on a car?', a: 'A common rule is to keep the total price under about half your annual income, with the loan kept short and the running costs comfortably within your monthly budget.' },
      { q: 'Is it better to buy new or used?', a: 'Used cars avoid the steepest depreciation, which happens in the first few years, so they often offer better value — but newer cars may have lower maintenance costs and better finance rates.' },
    ],
    related: ['how-much-can-i-borrow-for-a-mortgage', 'how-to-pay-off-credit-card-debt-fast'],
  },

  {
    slug: 'should-i-refinance-my-mortgage',
    title: 'Should I Refinance My Mortgage? (2026 Guide) | JoinCalc',
    h1: 'Should I Refinance My Mortgage?',
    description: 'When refinancing your mortgage is worth it in 2026: the break-even rule, closing costs, shortening your term, cash-out refinances, and the mistakes to avoid.',
    keywords: 'should i refinance my mortgage, mortgage refinance, refinance break even, when to refinance, cash out refinance',
    updated: 'June 2026',
    readMins: 7,
    tool: { path: '/refinance', label: 'Mortgage Refinance Calculator', cta: 'See your savings and break-even point' },
    intro: 'Refinancing swaps your current mortgage for a new one, usually to get a lower rate or change the term. Because it costs money to do, the decision comes down to one question: will the savings outweigh the closing costs before you sell or move? Here is how to decide.',
    sections: [
      {
        h2: 'The break-even rule',
        body: ['Refinancing has closing costs of roughly 2–5% of the loan. Divide those costs by your monthly saving to get the break-even point — the number of months until you come out ahead. If closing costs are $4,000 and you save $400 a month, you break even in 10 months. If you plan to keep the home past that, refinancing makes sense.'],
      },
      {
        h2: 'How big a rate drop do you need?',
        body: ['A common rule of thumb is at least a 0.5–1% lower rate, but the real test is the break-even, not the rate gap. A smaller drop can still be worth it on a large balance, while a big drop may not pay off if you move soon or the costs are high.'],
      },
      {
        h2: 'Shortening your term',
        body: ['Refinancing from a 30-year to a 15-year loan usually raises the monthly payment but slashes total interest, because you pay for far fewer years and often at a lower rate. If you can afford the higher payment, it is one of the most powerful ways to save.'],
      },
      {
        h2: 'Watch the term-reset trap',
        list: [
          'Refinancing a 30-year loan you are 7 years into back to a fresh 30 years restarts the clock.',
          'Even at a lower rate, stretching the term can increase the total interest you pay.',
          'Compare the lifetime interest of both loans (including closing costs), not just the monthly payment.',
        ],
      },
      {
        h2: 'Cash-out refinancing',
        body: ['A cash-out refinance lets you borrow against your home equity by taking a larger new loan and pocketing the difference. It can fund renovations or consolidate higher-rate debt, but it increases what you owe on your home, so use it carefully.'],
      },
    ],
    faq: [
      { q: 'How much does it cost to refinance a mortgage?', a: 'Typically 2–5% of the loan amount in closing costs. On a $300,000 mortgage that is about $6,000–$15,000, though no-closing-cost options exist in exchange for a slightly higher rate.' },
      { q: 'Is it worth refinancing for 1%?', a: 'Often yes, especially on a larger balance, but check the break-even point. If you will keep the loan well past the month your savings repay the closing costs, a 1% drop is usually worthwhile.' },
      { q: 'Does refinancing restart my mortgage?', a: 'A new loan resets the term unless you choose a shorter one. Restarting a 30-year clock can raise lifetime interest even at a lower rate, so compare total interest, not just the monthly payment.' },
    ],
    related: ['how-much-can-i-borrow-for-a-mortgage', 'how-compound-interest-works'],
  },

  // ── Long-tail question guides ────────────────────────────────────────────
  // Deliberately narrow, exact-question topics with low search competition —
  // a new domain can realistically rank for these while the big head terms
  // ("salary calculator") are dominated by decade-old sites. Each answers one
  // specific question precisely and funnels to the matching calculator.

  {
    slug: 'do-i-pay-tax-on-a-bonus-uk',
    title: 'Do I Pay Tax on a Bonus in the UK? (2026) | JoinCalc',
    h1: 'Do I Pay Tax on a Bonus in the UK?',
    description: 'Yes — bonuses are taxed exactly like salary in the UK. See how much tax and National Insurance comes off a bonus in 2026/27, with a worked example.',
    keywords: 'do i pay tax on a bonus uk, is bonus taxed the same as salary, bonus tax calculator uk, how much tax on bonus 2026',
    updated: 'July 2026',
    readMins: 4,
    tool: { path: '/salary', label: 'Salary Take-Home Calculator', cta: 'See exactly how much of your bonus you keep' },
    intro: 'Yes — in the UK, a bonus is not taxed differently from your normal salary. HMRC treats it as extra earnings in the pay period you receive it, so it is taxed through PAYE at your normal Income Tax and National Insurance rates. The confusion usually comes from the size of the deduction, which can look higher than expected.',
    sections: [
      {
        h2: 'Why a bonus can feel "extra taxed"',
        body: ['A £5,000 bonus paid on top of your normal monthly salary can push that single month\'s pay into a higher tax band, so PAYE deducts more that month than your usual payslip. Over the full tax year this evens out — you are not charged a special "bonus tax rate", it is just your normal marginal rate applied to a bigger paycheque that month.'],
      },
      {
        h2: 'Worked example: a £5,000 bonus',
        body: ['If you are a basic-rate taxpayer receiving a £5,000 bonus, it is taxed at 20% Income Tax and 8% National Insurance (assuming you are within the main NI band) — about £1,400 in deductions, leaving roughly £3,600. If the bonus pushes part of your income above £50,270, that portion is taxed at 40% instead, so a large bonus can be taxed at more than one rate across its own value.'],
      },
      {
        h2: 'What else can reduce the tax on a bonus',
        list: [
          'Paying some or all of the bonus into your pension via salary sacrifice avoids Income Tax and NI on that portion entirely.',
          'If the bonus tips you over £100,000, you start losing your personal allowance, creating an effective rate near 60% on that slice — pension contributions are the main way to avoid this.',
          'A bonus does not get a separate "bonus tax code" — any PAYE overpayment from a one-off large month is usually refunded automatically later in the tax year.',
        ],
      },
    ],
    faq: [
      { q: 'Is a bonus taxed at a higher rate than salary?', a: 'No special bonus rate exists — it uses your normal Income Tax and NI bands. It can look like a higher rate because the bonus temporarily raises that month\'s income into a higher band, but this balances out across the tax year.' },
      { q: 'Can I avoid tax on a bonus?', a: 'Not entirely, but sacrificing some or all of it into a pension avoids Income Tax and NI on that portion, since pension contributions come out before tax.' },
      { q: 'Does a bonus count towards my student loan repayment?', a: 'Yes. A bonus is added to your income for that pay period, so if it pushes you above your student loan threshold, you repay 9% (or 6% for postgraduate loans) on the amount above it.' },
    ],
    related: ['how-to-calculate-take-home-pay-uk', 'how-is-national-insurance-calculated-uk'],
  },

  {
    slug: 'do-i-pay-national-insurance-on-my-pension',
    title: 'Do I Pay National Insurance on My Pension? (UK 2026) | JoinCalc',
    h1: 'Do I Pay National Insurance on My Pension?',
    description: 'No — pension income is not subject to National Insurance in the UK, though it is still taxed. See exactly what is and isn\'t deducted from your pension.',
    keywords: 'do i pay national insurance on my pension, is pension income taxed, ni on pension uk, tax on private pension 2026',
    updated: 'July 2026',
    readMins: 4,
    tool: { path: '/retirement', label: '401k & Pension Calculator', cta: 'Project your pension pot and income' },
    intro: 'No. Once you start drawing your pension — whether it\'s the State Pension, a workplace pension or a private pension — you do not pay National Insurance on that income, regardless of your age. This is one of the few genuine tax advantages of retirement income over employment income.',
    sections: [
      {
        h2: 'Why pension income is NI-free',
        body: ['National Insurance is charged on earnings from work — employment or self-employment. Pension income is treated as "unearned" for NI purposes, so Class 1 (employee) and Class 4 (self-employed) National Insurance simply do not apply to it, even if you are under State Pension age when you start drawing a private pension.'],
      },
      {
        h2: 'But Income Tax still applies',
        body: ['Pension income is not NI-free of all deductions — it is still subject to Income Tax in the normal way, using your personal allowance (£12,570 for 2026/27) and the standard 20%/40%/45% bands. If your total income from the State Pension, a workplace pension and any part-time work exceeds your allowance, you pay tax on the excess.'],
      },
      {
        h2: 'What if I keep working after taking my pension?',
        list: [
          'Employment income is still subject to NI, even while you are also drawing a pension — the two income types are assessed separately for NI purposes.',
          'Once you reach State Pension age, you stop paying employee NI on any earnings, whether or not you have also started your pension.',
          'The 25% pension tax-free lump sum, when taken, is not subject to Income Tax or NI.',
        ],
      },
    ],
    faq: [
      { q: 'Do I pay NI on the State Pension?', a: 'No. The State Pension is never subject to National Insurance, and by the time you can claim it you have already reached State Pension age, at which point NI stops on any income.' },
      { q: 'Is a workplace pension taxed when I draw it?', a: 'Yes, for Income Tax — it is added to your taxable income and taxed at your normal rate above the personal allowance. It is just exempt from National Insurance.' },
      { q: 'Do employer pension contributions count towards NI?', a: 'Employer pension contributions are not subject to NI for either the employer or employee, which is one reason salary sacrifice into a pension is tax-efficient.' },
    ],
    related: ['how-is-national-insurance-calculated-uk', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'is-redundancy-pay-taxed-if-i-get-a-new-job',
    title: 'Is Redundancy Pay Taxed If I Get a New Job Straight Away? | JoinCalc',
    h1: 'Is Redundancy Pay Taxed If I Get a New Job Straight Away?',
    description: 'No — the £30,000 tax-free redundancy allowance applies regardless of whether you start a new job immediately. Here\'s exactly how it works.',
    keywords: 'is redundancy pay taxed if i get a new job, redundancy pay new job same year, tax free redundancy allowance, redundancy pay and new employment',
    updated: 'July 2026',
    readMins: 4,
    tool: { path: '/redundancy', label: 'Redundancy Pay Calculator', cta: 'Work out your redundancy entitlement' },
    intro: 'No — finding a new job straight away does not affect the tax treatment of your redundancy pay. The first £30,000 of a genuine redundancy payment is tax-free regardless of what you do next, including starting a new job the very next day.',
    sections: [
      {
        h2: 'The £30,000 exemption is about the payment, not your employment status',
        body: ['HMRC\'s £30,000 tax-free threshold applies to the redundancy payment itself, based on it being compensation for loss of employment — not on you remaining unemployed afterwards. Whether you are out of work for six months or start a new role on Monday, the same tax-free treatment applies to a genuine redundancy payment.'],
      },
      {
        h2: 'What this does NOT cover',
        list: [
          'Anything above £30,000 is still taxed as income at your normal rate, regardless of your new job status.',
          'Pay in lieu of notice (PILON), unpaid wages and accrued holiday pay are taxed as normal income and are separate from the £30,000 exemption.',
          'If your new job starts in the same tax year, your redundancy payment and new salary are simply both added to your income for that tax year when working out your overall Income Tax — the redundancy exemption itself does not shrink because of the new job.',
        ],
      },
      {
        h2: 'A common misconception',
        body: ['Some people believe redundancy pay becomes taxable if you are re-employed quickly, perhaps confusing it with unemployment benefit rules. There is no such rule for redundancy pay — the £30,000 exemption is a fixed feature of a genuine redundancy payment and does not depend on your subsequent employment.'],
      },
    ],
    faq: [
      { q: 'Do I have to tell HMRC I got a new job after redundancy?', a: 'Your new employer will collect tax through PAYE using your tax code as normal. You do not need to inform HMRC specifically about the redundancy payment — your employer reports it, and the £30,000 exemption is applied automatically by your former employer\'s payroll.' },
      { q: 'Does redundancy pay affect my tax code at my new job?', a: 'It can temporarily, if the redundancy payment and new salary land in the same tax month and push your income unusually high, similar to a large bonus. Any overpaid tax is generally corrected automatically over the rest of the tax year.' },
      { q: 'Is redundancy pay taxed differently if I retire instead of getting a new job?', a: 'No — the tax treatment of the £30,000 exemption is the same whether you retire, take time off, or start a new job immediately. It depends on the nature of the payment, not what you do afterwards.' },
    ],
    related: ['how-much-redundancy-pay-uk', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'how-much-can-i-earn-before-40-percent-tax-uk',
    title: 'How Much Can I Earn Before I Pay 40% Tax in the UK? | JoinCalc',
    h1: 'How Much Can I Earn Before I Pay 40% Tax in the UK?',
    description: 'You start paying the 40% higher rate once your taxable income passes £50,270 in 2026/27. See exactly where the threshold falls and how it is calculated.',
    keywords: 'how much can i earn before 40 percent tax, higher rate tax threshold uk 2026, when do i pay 40 tax, 40 tax bracket uk',
    updated: 'July 2026',
    readMins: 4,
    tool: { path: '/salary', label: 'Salary Take-Home Calculator', cta: 'See exactly how much tax you pay at your salary' },
    intro: 'For the 2026/27 tax year, you start paying the 40% higher rate once your taxable income exceeds £50,270 a year. Below that, income above your personal allowance is taxed at the 20% basic rate. Only the portion of income above £50,270 is taxed at 40% — not your whole salary.',
    sections: [
      {
        h2: 'The exact threshold',
        table: {
          headers: ['Band', 'Income range', 'Rate'],
          rows: [
            ['Personal allowance', 'Up to £12,570', '0%'],
            ['Basic rate', '£12,571 – £50,270', '20%'],
            ['Higher rate', '£50,271 – £125,140', '40%'],
            ['Additional rate', 'Over £125,140', '45%'],
          ],
          note: 'These are 2026/27 figures for England, Wales and Northern Ireland. Scotland has its own income tax bands.',
        },
      },
      {
        h2: 'Only the excess is taxed at 40%',
        body: ['Crossing £50,270 does not mean your whole salary is suddenly taxed at 40%. Only the slice of income above that threshold is taxed at the higher rate — the first £50,270 is still taxed at 0% and 20% as before. Someone earning £55,000 pays 40% only on the £4,730 above the threshold.'],
      },
      {
        h2: 'Things that can push you into the higher rate unexpectedly',
        list: [
          'A pay rise or bonus that tips your annual income over £50,270.',
          'Combining income from a second job, freelance work or rental income with your main salary.',
          'Losing part of your personal allowance above £100,000, which raises your effective rate further.',
        ],
      },
    ],
    faq: [
      { q: 'Does the 40% threshold change every year?', a: 'The government sets it in the Budget and it has been frozen at £50,270 for several years running (a "fiscal drag" freeze), meaning more people cross it each year purely through pay rises and inflation.' },
      { q: 'Can I avoid paying 40% tax?', a: 'You cannot avoid tax on income you keep, but pension contributions and salary sacrifice reduce your taxable income, which can keep you under the threshold or reduce how much falls into the higher band.' },
      { q: 'Is the 40% threshold the same in Scotland?', a: 'No. Scotland sets its own income tax bands and rates, which differ from the rest of the UK — check the Scottish rates separately if you pay tax there.' },
    ],
    related: ['how-to-calculate-take-home-pay-uk', 'do-i-pay-tax-on-a-bonus-uk'],
  },

  {
    slug: 'do-i-pay-tax-on-dividends-from-my-own-company',
    title: 'Do I Pay Tax on Dividends From My Own Limited Company? | JoinCalc',
    h1: 'Do I Pay Tax on Dividends From My Own Limited Company?',
    description: 'Yes — dividends from your own limited company are taxed at dividend rates after a £500 allowance, separately from salary. Here\'s how it works for 2026/27.',
    keywords: 'do i pay tax on dividends from my own company, director dividend tax uk, dividend allowance 2026, limited company dividend tax',
    updated: 'July 2026',
    readMins: 5,
    tool: { path: '/dividend', label: 'Dividend Income Calculator', cta: 'Estimate your dividend income and tax' },
    intro: 'Yes — dividends you pay yourself from your own limited company are taxed as personal income, separately from any salary you draw. They use their own tax-free allowance and their own set of rates, which are lower than Income Tax rates on salary — a major reason many director-shareholders pay themselves a mix of a small salary plus dividends.',
    sections: [
      {
        h2: 'The dividend allowance and rates (2026/27)',
        table: {
          headers: ['Band', 'Rate on dividends'],
          rows: [
            ['Dividend allowance', '£500 tax-free'],
            ['Basic rate', '8.75%'],
            ['Higher rate', '33.75%'],
            ['Additional rate', '39.35%'],
          ],
          note: 'Which rate applies depends on your total income (salary + dividends), stacked with your other income first.',
        },
      },
      {
        h2: 'Why dividends are separate from your salary',
        body: ['Your salary is taxed through PAYE with Income Tax and National Insurance. Dividends are paid from the company\'s post-tax profits (the company has already paid Corporation Tax on that profit) and are taxed on you personally at the lower dividend rates, with no National Insurance charged on dividends at all. This is why many director-shareholders draw a small salary — often around the NI threshold — and take the rest of their income as dividends.'],
      },
      {
        h2: 'What to watch for',
        list: [
          'You can only pay dividends from retained, post-tax profit — not from money the company hasn\'t actually earned.',
          'The £500 dividend allowance is separate from your £12,570 personal allowance, but dividend income still counts towards which tax band you are in overall.',
          'HMRC expects a dividend voucher and board minutes for each dividend payment as evidence it was properly declared.',
        ],
      },
    ],
    faq: [
      { q: 'How much can I pay myself in dividends tax-free?', a: 'The dividend allowance is £500 for 2026/27. If you have no other income, you could also use your unused £12,570 personal allowance against dividends first, but most director-shareholders also draw a salary, which uses up that allowance.' },
      { q: 'Do dividends count as income for a mortgage application?', a: 'Yes, lenders generally accept dividend income as evidence of earnings for self-employed directors, usually averaged over 1–3 years of accounts.' },
      { q: 'Is it better to take a salary or dividends from my company?', a: 'A combination is usually most tax-efficient: a small salary (often around the NI threshold, to preserve State Pension qualifying years) plus dividends for the rest, since dividends avoid NI and are taxed at lower rates than salary.' },
    ],
    related: ['how-is-national-insurance-calculated-uk', 'how-to-calculate-take-home-pay-uk'],
  },

  {
    slug: 'does-a-pay-rise-affect-my-student-loan-repayment',
    title: 'Does a Pay Rise Affect My Student Loan Repayment? | JoinCalc',
    h1: 'Does a Pay Rise Affect My Student Loan Repayment?',
    description: 'Yes — student loan repayments are 9% of income above your plan\'s threshold, so a pay rise increases your monthly repayment. See exactly how much.',
    keywords: 'does a pay rise affect my student loan, student loan repayment goes up, pay rise student loan uk, how much more do i repay student loan',
    updated: 'July 2026',
    readMins: 4,
    tool: { path: '/student-loan', label: 'Student Loan Repayment Calculator', cta: 'See your new repayment after a pay rise' },
    intro: 'Yes — because UK student loan repayments are calculated as 9% of your income above your plan\'s threshold (6% for Postgraduate loans), any pay rise that keeps you above the threshold increases your monthly repayment. The increase is smaller than you might expect, since only the amount above the threshold is used in the calculation.',
    sections: [
      {
        h2: 'How the increase is calculated',
        body: ['A pay rise adds to your income, and if you are already above your plan\'s repayment threshold, 9% (or 6% for Postgraduate loans) of the full pay rise goes toward extra repayment. For example, on Plan 2 (threshold £29,385), a £2,000 pay rise for someone already earning £35,000 adds £180 a year (£15 a month) to their repayment — not 9% of your whole new salary.'],
      },
      {
        h2: 'Repayment thresholds by plan (2026)',
        table: {
          headers: ['Plan', 'Threshold', 'Rate'],
          rows: [
            ['Plan 1', '£24,990', '9%'],
            ['Plan 2', '£29,385', '9%'],
            ['Plan 4 (Scotland)', '£32,745', '9%'],
            ['Plan 5', '£25,000', '9%'],
            ['Postgraduate', '£21,000', '6%'],
          ],
        },
      },
      {
        h2: 'What if the pay rise pushes me above the threshold for the first time?',
        list: [
          'If you were earning below the threshold and a pay rise takes you above it, you only start repaying on the amount above the threshold — not the whole salary.',
          'If you have both a Plan and a Postgraduate loan simultaneously, both repayments (9% and 6%) apply on top of each other above their respective thresholds, which can add up to 15% combined.',
          'A bonus is treated the same way as a pay rise for that pay period — it can temporarily increase that month\'s repayment.',
        ],
      },
    ],
    faq: [
      { q: 'Will my student loan repayment go up every time I get a raise?', a: 'Only if the raise keeps your income above your plan\'s threshold. If you are already above it, yes — 9% (or 6% for Postgraduate) of the extra income goes to repayment automatically through PAYE.' },
      { q: 'Can I choose to repay less after a pay rise?', a: 'No — the repayment percentage is fixed by law based on your plan and income; you cannot opt to repay less unless your income actually falls or you have finished repaying the loan.' },
      { q: 'Does overpaying my student loan voluntarily reduce future repayments?', a: 'Voluntary overpayments reduce your outstanding balance and can shorten how long you repay, but they do not change the 9%/6% rate applied to your income each month unless your balance is fully cleared.' },
    ],
    related: ['student-loan-repayments-explained', 'how-to-calculate-take-home-pay-uk'],
  },
]

export const GUIDE_SLUGS = GUIDES.map(g => g.slug)
export const getGuide = (slug) => GUIDES.find(g => g.slug === slug)
