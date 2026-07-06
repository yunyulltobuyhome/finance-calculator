import { Helmet } from 'react-helmet-async'

export default function TermsOfService() {
  return (
    <div className="prose prose-sm max-w-none text-gray-600">
      <Helmet>
        <title>Terms of Service — JoinCalc</title>
        <meta name="description" content="The terms of service for using JoinCalc's free financial calculators. Estimates are for information only and not financial, tax, or legal advice." />
        <link rel="canonical" href="https://joincalc.com/terms/" />
      </Helmet>
      <h1 className="text-xl font-bold text-gray-800 mb-4">Terms of Service</h1>
      <p className="text-xs text-gray-400 mb-6">Last updated: June 2026</p>

      <div className="space-y-6">
        <section>
          <h3 className="font-bold text-gray-700 mb-2">1. Informational Purpose Only</h3>
          <p className="text-sm leading-relaxed">
            All calculators, tools, and content on JoinCalc.com are provided for <strong>general informational and educational purposes only</strong>. Nothing on this website constitutes financial, tax, legal, investment, or professional advice of any kind.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">2. No Professional Relationship</h3>
          <p className="text-sm leading-relaxed">
            Use of this website does not create any professional relationship between you and JoinCalc. We are not registered financial advisors, tax professionals, attorneys, or any other licensed professionals. Always consult a qualified professional before making any financial decisions.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">3. Accuracy of Information</h3>
          <p className="text-sm leading-relaxed">
            While we strive to keep tax rates and thresholds current, <strong>tax laws change frequently</strong>. We make no representations or warranties — express or implied — that the information on this site is accurate, complete, or up to date. Always verify rates with official government sources (IRS, HMRC, ATO, CRA) before making decisions.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">4. Limitation of Liability</h3>
          <p className="text-sm leading-relaxed">
            To the fullest extent permitted by law, JoinCalc and its operators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of — or reliance on — any information or calculation results provided on this website. <strong>You use this website entirely at your own risk.</strong>
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">5. Estimates Only</h3>
          <p className="text-sm leading-relaxed">
            All calculation results are <strong>estimates only</strong> and may differ from actual tax liabilities due to individual circumstances, local rules, deductions, exemptions, or legislative changes. Do not use these results for official tax filings or legal purposes.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">6. Third-Party Content</h3>
          <p className="text-sm leading-relaxed">
            This site may display third-party advertisements via Google AdSense. JoinCalc does not endorse any advertised products or services. We are not responsible for the content of external websites linked from this site.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">7. Jurisdiction</h3>
          <p className="text-sm leading-relaxed">
            This website provides calculations for multiple countries (US, UK, Canada, Australia) as a convenience. Tax rules vary significantly by jurisdiction, and results may not reflect your specific local or state/provincial rules. Always refer to your local tax authority for authoritative guidance.
          </p>
        </section>

        <section>
          <h3 className="font-bold text-gray-700 mb-2">8. Changes to Terms</h3>
          <p className="text-sm leading-relaxed">
            We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-6">
          <p className="text-xs text-red-700 font-semibold">
            ⚠️ IMPORTANT: JoinCalc is NOT a substitute for professional financial, tax, or legal advice. The consequences of incorrect tax calculations can be severe. Please consult a qualified professional for your specific situation.
          </p>
        </div>
      </div>
    </div>
  )
}