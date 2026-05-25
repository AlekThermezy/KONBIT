'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black mb-8">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: May 2026</p>

          <div className="prose prose-invert prose-green space-y-6">
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using KONBIT, you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use our platform.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">2. KONBIT Services</h2>
              <p className="text-gray-300">
                KONBIT provides a platform for diaspora investment in Haitian businesses (Growth)
                and educational content (Learn). We are not a licensed broker-dealer or investment advisor.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">3. Investment Risks</h2>
              <p className="text-gray-300">
                All investments involve risk, including potential loss of principal. Haitian business
                investments may be particularly volatile. Past performance does not guarantee future results.
                Only invest what you can afford to lose.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">4. Accredited Investors</h2>
              <p className="text-gray-300">
                Certain investment opportunities on KONBIT are restricted to accredited investors
                as defined by the SEC. It is your responsibility to ensure you meet applicable
                accreditation requirements before investing.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">5. User Accounts</h2>
              <p className="text-gray-300">
                You are responsible for maintaining the confidentiality of your account credentials
                and for all activities under your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300">
                All content on KONBIT is property of KONBIT or its licensors. You may not copy,
                modify, or distribute our content without written permission.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-300">
                KONBIT shall not be liable for any indirect, incidental, special, or consequential
                damages arising from your use of the platform or investment decisions made based on our content.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">8. Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right to modify these terms at any time. Continued use of KONBIT
                after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">9. Contact</h2>
              <p className="text-gray-300">
                Questions about these Terms? Contact us at{' '}
                <a href="mailto:legal@konbit.io" className="text-green-400 hover:underline">
                  legal@konbit.io
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}