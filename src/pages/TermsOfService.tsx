
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  return (
    <div className="min-h-screen cinematic-section">
      <ModernHeader />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none prose-invert">
            <h1 className="text-4xl font-bold text-white border-b-2 border-white/20 pb-4 mb-6 cinematic-text-shadow">
              Terms of Service for ContentFarm.club
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              <strong>Effective Date:</strong> 1st of June 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300">
                By using ContentFarm.club, you agree to these Terms and our{' '}
                <a href="/privacy-policy" className="text-yellow-400 hover:underline">Privacy Policy</a>. 
                If you do not agree, please do not use the Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">2. Use of the Site</h2>
              <p className="text-gray-300">
                You agree not to interfere with the functionality of the Site, reverse-engineer any part of it, 
                use bots, or upload harmful content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">3. Intellectual Property</h2>
              <p className="text-gray-300">
                All content is owned or licensed by ContentFarm.club and may not be reproduced without permission.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">4. Payments</h2>
              <p className="text-gray-300">
                Payments are processed by Stripe. We do not store payment information. Stripe's terms and privacy apply.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">5. Disclaimers</h2>
              <p className="text-gray-300">
                ContentFarm.club is provided "as is" without warranties. We do not guarantee uninterrupted service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">6. Limitation of Liability</h2>
              <p className="text-gray-300">
                We are not liable for any indirect or consequential damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">7. Third-Party Links</h2>
              <p className="text-gray-300">
                We are not responsible for the content or privacy of third-party websites linked from our Site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">8. Changes to These Terms</h2>
              <p className="text-gray-300">
                We may update these Terms. Continued use of the Site means you accept the updated Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">9. Governing Law</h2>
              <p className="text-gray-300">
                These Terms are governed by the laws of Portugal.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">10. Contact</h2>
              <p className="text-gray-300">
                Email: hello@contentfarm.club
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;