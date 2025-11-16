import ModernHeader from '@/components/ModernHeader';
import SmartBar from '@/components/SmartBar';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import VSL from '@/components/VSL';
import HowItWorks from '@/components/HowItWorks';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { MessageCircle, Figma, FileText } from 'lucide-react';

const Index = () => {
  const services = [
    {
      name: "Product Demo Videos",
      description: "Turn prospects into customers with demos that showcase your SaaS like never before.",
      provider: "ContentFarm"
    },
    {
      name: "Explainer & Onboarding Videos",
      description: "Reduce churn by 40% with crystal-clear onboarding that gets users to 'aha!' moments faster.",
      provider: "ContentFarm"
    },
    {
      name: "Webinars & Event Repurposing",
      description: "Transform one event into 10+ pieces of engaging content that work 24/7 for your business.",
      provider: "ContentFarm"
    },
    {
      name: "YouTube Content Strategy",
      description: "Build authority and generate leads with YouTube content that ranks on page 1 and converts viewers.",
      provider: "ContentFarm"
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO 
        title="ContentFarm - Professional SaaS Video Production Agency | Product Demos & Explainer Videos"
        description="Leading SaaS video production agency specializing in high-converting product demos, explainer videos, and onboarding content. 30-day results guarantee. Trusted by top SaaS companies worldwide. Transform your product into engaging video content that drives conversions and reduces churn by 40%."
        keywords="SaaS video production agency, product demo videos, explainer videos, SaaS marketing videos, video content marketing, onboarding videos, product video production, B2B video marketing, software demo videos, SaaS video agency, video production Lisbon Portugal, YouTube content strategy, webinar repurposing, video marketing services"
        url="https://contentfarm.club"
        type="website"
        image="https://contentfarm.club/lovable-uploads/42844e19-815c-453d-9d1d-66e5ec0590fb.png"
      />
      
      <StructuredData type="organization" />
      <StructuredData type="service" services={services} />
      
      <SmartBar />
      <ModernHeader />
      <Hero />
      <div id="services">
        <Services />
      </div>
      <VSL />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      
      {/* Easy Collaboration Section */}
      <section className="py-20 cinematic-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 cinematic-text-shadow">
              Working With Us Is Seamless
            </h2>
            <p className="text-xl text-gray-200">
              No complicated processes or endless meetings. We integrate smoothly into your workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center cinematic-card p-8 shadow-cinematic">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Chat on Slack</h3>
              <p className="text-gray-300">
                Direct communication with our team through Slack. Get instant updates, share feedback, and collaborate in real-time without switching platforms.
              </p>
            </div>

            <div className="text-center cinematic-card p-8 shadow-cinematic">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                <Figma className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Preview in Figma</h3>
              <p className="text-gray-300">
                Watch your video thumbnails and storyboards come to life in Figma. Review designs, leave comments, and approve concepts before production starts.
              </p>
            </div>

            <div className="text-center cinematic-card p-8 shadow-cinematic">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Track in Notion</h3>
              <p className="text-gray-300">
                Complete transparency with our Notion workspace. Track video requests, monitor progress, access deliverables, and stay updated on every milestone.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
