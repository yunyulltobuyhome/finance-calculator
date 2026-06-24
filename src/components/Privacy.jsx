export default function Privacy() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

      {[
        {
          title: '1. Overview',
          content: 'Finance Calculator ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our website at finance-calculator-bi5.pages.dev.',
        },
        {
          title: '2. Information We Do Not Collect',
          content: 'We do not collect, store, or transmit any personal information. All calculations are performed entirely in your browser. No data you enter into our calculators is ever sent to any server.',
        },
        {
          title: '3. Cookies & Advertising',
          content: 'We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting Google\'s Ads Settings at adssettings.google.com.',
        },
        {
          title: '4. Google Analytics',
          content: 'We may use Google Analytics to understand how visitors use our site. This collects anonymous usage data such as pages visited and time spent. No personally identifiable information is collected.',
        },
        {
          title: '5. Third-Party Links',
          content: 'Our website may contain links to third-party websites. We are not responsible for the privacy practices of those sites and encourage you to review their privacy policies.',
        },
        {
          title: '6. Children\'s Privacy',
          content: 'Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children.',
        },
        {
          title: '7. Changes to This Policy',
          content: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.',
        },
        {
          title: '8. Contact',
          content: 'If you have any questions about this Privacy Policy, please contact us at: dbstjd334@naver.com',
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
          Always consult a qualified financial advisor before making investment decisions.
        </p>
      </div>
    </div>
  )
}