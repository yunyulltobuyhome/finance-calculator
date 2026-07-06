import { Helmet } from 'react-helmet-async'

export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Helmet>
        <title>Privacy Policy — JoinCalc</title>
        <meta name="description" content="How JoinCalc handles data, cookies, and advertising. We use Google AdSense; calculations run entirely in your browser and we collect no personal data." />
        <link rel="canonical" href="https://joincalc.com/privacy/" />
      </Helmet>

      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

      {[
        {
          title: '1. Overview',
          content: 'JoinCalc ("we", "our", or "us") operates the website at https://joincalc.com. We are committed to protecting your privacy. This Privacy Policy explains what information is collected when you use our calculators, how cookies and advertising work, and the choices available to you.',
        },
        {
          title: '2. Information We Collect',
          content: 'We do not ask you to create an account and we do not collect names, email addresses, or payment details. Every calculation you perform runs entirely inside your own browser — the figures you enter are never transmitted to or stored on our servers. We do not sell or share personal information, because we do not collect it.',
        },
        {
          title: '3. Cookies',
          content: 'A cookie is a small text file stored on your device. We and our partners use cookies and similar technologies for two purposes: (a) essential functionality, such as remembering your cookie-consent choice; and (b) advertising, as described below. You can control or delete cookies through your browser settings at any time. Blocking advertising cookies will not stop you from using any calculator.',
        },
        {
          title: '4. Advertising & Google AdSense',
          content: 'We display advertising through Google AdSense to keep JoinCalc free. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to this and other websites. Google\'s use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.',
        },
        {
          title: '5. Your Advertising Choices',
          content: 'You may opt out of personalised advertising by visiting Google Ads Settings (https://adssettings.google.com) and the Google Advertising policies at https://policies.google.com/technologies/ads. You can also opt out of third-party vendor cookies at https://www.aboutads.info/choices (US) or https://www.youronlinechoices.eu (EU/UK). If you are in the EEA or the UK, we ask for your consent before non-essential advertising cookies are set, and you can change or withdraw that consent at any time using the "Cookie settings" link in the site footer.',
        },
        {
          title: '6. Analytics',
          content: 'We may use privacy-friendly, aggregated analytics to understand which calculators are most useful (for example, page views and approximate region). This data is anonymous and is not used to identify you personally.',
        },
        {
          title: '7. Legal Basis & Your Rights (UK/EU)',
          content: 'Where the UK GDPR or EU GDPR applies, our legal basis for setting advertising cookies is your consent, and for essential cookies it is our legitimate interest in operating the site. You have the right to access, correct, or delete any personal data we may hold, and to object to processing. Because we do not collect personal data through the calculators, most requests will simply concern cookie preferences, which you control directly.',
        },
        {
          title: '8. Third-Party Links',
          content: 'Our calculators link to official sources such as the IRS, HMRC, ATO, and CRA, and our pages may contain advertising links. We are not responsible for the privacy practices of third-party websites and encourage you to review their privacy policies.',
        },
        {
          title: "9. Children's Privacy",
          content: 'JoinCalc is intended for a general adult audience and is not directed to children under 13. We do not knowingly collect personal information from children.',
        },
        {
          title: '10. Changes to This Policy',
          content: 'We may update this Privacy Policy from time to time. Any changes will be posted on this page with a revised "Last updated" date.',
        },
        {
          title: '11. Contact',
          content: 'If you have any questions about this Privacy Policy or your privacy choices, please contact us at hello@joincalc.com.',
        },
      ].map(({ title, content }) => (
        <div key={title} className="mb-6">
          <h2 className="text-base font-semibold text-gray-700 mb-1">{title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{content}</p>
        </div>
      ))}

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
        <p className="text-xs text-yellow-700 leading-relaxed">
          ⚠️ <strong>Disclaimer:</strong> All calculators on this site are for informational and educational purposes only.
          Results do not constitute financial, tax, or legal advice. Tax rates shown are approximate.
          Always consult a qualified financial advisor before making financial decisions.
        </p>
      </div>
    </div>
  )
}
