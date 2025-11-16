import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen cinematic-section">
      <ModernHeader />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none prose-invert">
            <h1 className="text-4xl font-bold text-white border-b-2 border-white/20 pb-4 mb-6 cinematic-text-shadow">
              Privacy Policy for ContentFarm.club
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              <strong>Effective Date:</strong> 1st of June 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">1. Introduction</h2>
              <p className="text-gray-300">
                ContentFarm.club ("we," "us," or "our") provides online video services and values your privacy. This Privacy Policy explains how we collect, use, disclose, and protect your information when you use our website (http://contentfarm.club, the "Site").
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold text-white mb-2">a. Information You Provide:</p>
                  <p className="text-gray-300 mb-2">
                    We do not require you to create an account or submit personal content. However, we may collect personal data when you:
                  </p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1">
                    <li>Contact us via forms or email</li>
                    <li>Complete a payment through Stripe (billing details handled by Stripe)</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">b. Automatically Collected Data:</p>
                  <p className="text-gray-300 mb-2">We may collect:</p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1">
                    <li>IP address and device info</li>
                    <li>Browser type and settings</li>
                    <li>Pages viewed, time on site</li>
                    <li>Referring/exit pages</li>
                    <li>Location data (approximate)</li>
                    <li>Interaction with video content</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-2">c. Cookies and Tracking:</p>
                  <p className="text-gray-300 mb-2">We use cookies and similar technologies for:</p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-1">
                    <li>Site performance and personalization</li>
                    <li>Analytics via Google Analytics</li>
                    <li>Advertising and retargeting</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">3. Use of Your Information</h2>
              <p className="text-gray-300 mb-2">We use your data to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li>Deliver and improve our video services</li>
                <li>Process payments (via Stripe)</li>
                <li>Analyze visitor behavior</li>
                <li>Provide support or respond to inquiries</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">4. Sharing of Information</h2>
              <p className="text-gray-300 mb-2">
                We do <strong>not</strong> sell or share your personal data with third parties for their own marketing. We may share data with:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li>Stripe for payment processing</li>
                <li>Google Analytics for site insights</li>
                <li>Legal authorities if required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">5. Cookies & Tracking Technologies</h2>
              <p className="text-gray-300 mb-2">We use cookies and pixels to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1 mb-4">
                <li>Track usage patterns</li>
                <li>Deliver targeted advertising</li>
                <li>Improve performance</li>
              </ul>
              <p className="text-gray-300">
                <strong>Note:</strong> We do not currently display a cookie consent banner. If you are visiting from the EU or other regions requiring explicit consent, please disable cookies in your browser or contact us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-300 mb-2">
                Our payment processing is handled by Stripe. Their privacy policy is available at:{" "}
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                  stripe.com/privacy
                </a>
              </p>
              <p className="text-gray-300">
                We use Google Analytics to measure traffic and usage trends. Opt out at:{" "}
                <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                  gaoptout
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">7. Data Retention</h2>
              <p className="text-gray-300">
                We retain non-identifiable usage data indefinitely for analytics. Transaction and communication data are retained as long as necessary for compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">8. Your Privacy Rights</h2>
              <p className="text-gray-300">
                Depending on your location, you may have rights to access, delete, or restrict your data. To make a request, please email us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-300">
                ContentFarm.club is not intended for children under 16. We do not knowingly collect data from minors.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">10. International Visitors</h2>
              <p className="text-gray-300">
                Your data may be transferred and stored in the United States. By using the Site, you consent to such transfer.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">11. Contact Information</h2>
              <div className="text-gray-300">
                <p className="mb-2">For privacy inquiries:</p>
                <p><strong>Email:</strong> hello@contentfarm.club</p>
                <p><strong>Operator:</strong> Sole Proprietor of ContentFarm.club</p>
                <p><strong>Location:</strong> Lisbon, Portugal</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">12. Changes to This Policy</h2>
              <p className="text-gray-300">
                We may update this Privacy Policy from time to time. Changes will be posted here with a new effective date.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;