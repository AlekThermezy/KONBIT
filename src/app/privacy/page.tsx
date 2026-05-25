'use client'

import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
          <p className="text-gray-500 mb-8">Last updated: May 2026</p>

          <div className="space-y-6">
            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">1. Information We Collect</h2>
              <p className="text-gray-300 mb-4">
                We collect information you provide directly:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Account information (name, email, password)</li>
                <li>Profile information (avatar, bio, country)</li>
                <li>Investment activity and transaction history</li>
                <li>Learning progress and course enrollments</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Provide and improve our services</li>
                <li>Process investments and distributions</li>
                <li>Communicate about your account and platform updates</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Service providers (payment processors, cloud hosting)</li>
                <li>Business partners (with your consent)</li>
                <li>Legal authorities (when required by law)</li>
                <li>In connection with a business transfer (acquisition, merger)</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-300">
                We use industry-standard encryption (TLS/SSL), secure cloud infrastructure,
                and access controls to protect your data. No method of transmission is 100% secure,
                and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">5. Cookies & Tracking</h2>
              <p className="text-gray-300">
                We use essential cookies for authentication and preferences. Analytics cookies
                help us understand how visitors use our site. You can opt out of non-essential
                cookies in your browser settings.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">6. Your Rights</h2>
              <p className="text-gray-300 mb-4">Depending on your location, you may have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Delete your data ("right to be forgotten")</li>
                <li>Export your data in a portable format</li>
                <li>Object to certain processing</li>
              </ul>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-300">
                We retain your data for as long as your account is active or as needed to provide
                services. After account closure, data is deleted within 90 days, except where
                retention is required by law.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300">
                KONBIT is not intended for users under 18. We do not knowingly collect data from
                minors. If you believe a minor has provided us data, contact us immediately.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">9. International Transfers</h2>
              <p className="text-gray-300">
                Your data may be transferred internationally. When we transfer data outside your
                home country, we ensure appropriate safeguards are in place.
              </p>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">10. Contact Us</h2>
              <p className="text-gray-300">
                Questions about this Privacy Policy? Contact our Data Protection Officer at{' '}
                <a href="mailto:privacy@konbit.io" className="text-green-400 hover:underline">
                  privacy@konbit.io
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