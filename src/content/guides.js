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
]

export const GUIDE_SLUGS = GUIDES.map(g => g.slug)
export const getGuide = (slug) => GUIDES.find(g => g.slug === slug)
