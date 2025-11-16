
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen cinematic-section">
      <ModernHeader />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none prose-invert">
            <h1 className="text-4xl font-bold text-white border-b-2 border-white/20 pb-4 mb-6 cinematic-text-shadow">
              Cookie Policy for ContentFarm.club
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              <strong>Effective Date:</strong> 1st of June 2025
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">1. What Are Cookies?</h2>
              <p className="text-gray-300">
                Cookies are small data files stored on your device to remember information about your visit.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-300 mb-2">We use cookies to:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li>Analyze website usage with Google Analytics</li>
                <li>Serve personalized content</li>
                <li>Support advertising and retargeting</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">3. Types of Cookies</h2>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li><strong>Essential Cookies</strong> – required for website functionality</li>
                <li><strong>Analytics Cookies</strong> – help us understand user activity</li>
                <li><strong>Advertising Cookies</strong> – personalize ads you see</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-300 mb-2">We allow third parties like Google to set cookies. Learn more or opt out:</p>
              <ul className="list-disc pl-6 text-gray-300 space-y-1">
                <li>
                  <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    Google Analytics Opt-Out
                  </a>
                </li>
                <li>
                  <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">
                    Google Ads Settings
                  </a>
                </li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">5. Managing Cookies</h2>
              <p className="text-gray-300">
                You can disable or manage cookies via your browser settings, though doing so may limit site functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">6. Changes</h2>
              <p className="text-gray-300">
                We may update this Cookie Policy. Changes will be posted here with a revised effective date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">7. Contact</h2>
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

export default CookiePolicy;