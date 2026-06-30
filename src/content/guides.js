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
]

export const GUIDE_SLUGS = GUIDES.map(g => g.slug)
export const getGuide = (slug) => GUIDES.find(g => g.slug === slug)
