import { Helmet } from 'react-helmet-async'

export default function Contact() {
  return (
    <div className="max-w-2xl">
      <Helmet>
        <title>Contact JoinCalc — Get in Touch</title>
        <meta name="description" content="Contact the JoinCalc team about rate corrections, calculator suggestions, advertising, or privacy questions. We aim to reply within 2 business days." />
        <link rel="canonical" href="https://joincalc.com/contact" />
      </Helmet>

      <h1 className="text-2xl font-bold text-gray-800 mb-2">Contact Us</h1>
      <p className="text-sm text-gray-500 mb-8">
        We'd love to hear from you. Whether you've spotted an error in our rates, want to suggest a new
        calculator, or have a question about privacy or advertising, get in touch and we'll reply as soon
        as we can — usually within 2 business days.
      </p>

      <div className="space-y-6 text-sm text-gray-600">
        <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-gray-800 mb-2">📧 Email</h2>
          <p className="leading-relaxed mb-3">
            The fastest way to reach us is by email. We read every message.
          </p>
          <a href="mailto:hello@joincalc.com"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
            hello@joincalc.com
          </a>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What to contact us about</h2>
          <ul className="space-y-2">
            {[
              ['📊 Rate corrections', 'Found a tax rate or threshold that looks out of date? Tell us the calculator and the correct figure with a source, and we\'ll fix it quickly.'],
              ['💡 Calculator requests', 'Need a calculator we don\'t offer yet? Suggestions help us decide what to build next.'],
              ['📣 Advertising & partnerships', 'For advertising or partnership enquiries, email us with details of your proposal.'],
              ['🔒 Privacy requests', 'Questions about how we handle data, cookies, or advertising — or a request relating to your privacy — are always welcome.'],
            ].map(([title, body]) => (
              <li key={title} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{title}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-2">About the rates we publish</h2>
          <p className="leading-relaxed">
            Every calculator is based on official sources — the IRS, HMRC, ATO, and CRA — and shows a
            "rates verified" date so you know how current it is. Our calculators are only useful if they're
            accurate, so we take corrections seriously and act on them fast.
          </p>
        </section>
      </div>
    </div>
  )
}
