import { useEffect } from 'react';
import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
import StructuredData from '@/components/StructuredData';
import { Button } from '@/components/ui/button';
import { Play, ArrowRight, Sparkles, Zap, Users, Trophy, ChevronRight } from 'lucide-react';
const VideoProduction = () => {
  const videoShowcase = [{
    id: 1,
    title: "Webinars",
    subtitle: "Engaging educational content that converts",
    mediaId: "7mm562yxql",
    duration: "2:30"
  }, {
    id: 2,
    title: "Sport Coaches",
    subtitle: "Training content that drives performance",
    mediaId: "rgzuqmmgux",
    duration: "1:45"
  }, {
    id: 3,
    title: "Product",
    subtitle: "Real results from real customers",
    mediaId: "e0v4sz3lzr",
    duration: "3:15"
  }, {
    id: 4,
    title: "Ads",
    subtitle: "Behind the scenes authenticity",
    mediaId: "x1hro3zaan",
    duration: "2:00"
  }];

  // Load Wistia scripts
  useEffect(() => {
    // Load main Wistia player script
    const playerScript = document.createElement('script');
    playerScript.src = 'https://fast.wistia.com/player.js';
    playerScript.async = true;
    document.head.appendChild(playerScript);

    // Load individual video scripts
    const videoScripts = videoShowcase.map(video => {
      const script = document.createElement('script');
      script.src = `https://fast.wistia.com/embed/${video.mediaId}.js`;
      script.async = true;
      script.type = 'module';
      document.head.appendChild(script);
      return script;
    });

    // Add Wistia styles
    const style = document.createElement('style');
    style.textContent = videoShowcase.map(video => `
      wistia-player[media-id='${video.mediaId}']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${video.mediaId}/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top: 56.25%; 
      }
    `).join('');
    document.head.appendChild(style);

    // Cleanup
    return () => {
      document.head.removeChild(playerScript);
      videoScripts.forEach(script => document.head.removeChild(script));
      document.head.removeChild(style);
    };
  }, []);
  const features = [{
    icon: Sparkles,
    title: "Cinematic Quality",
    description: "4K production with professional color grading"
  }, {
    icon: Zap,
    title: "Fast Delivery",
    description: "From concept to final cut in 2-3 weeks"
  }, {
    icon: Users,
    title: "Dedicated Team",
    description: "Your personal production crew"
  }, {
    icon: Trophy,
    title: "Award Winning",
    description: "Recognized excellence in video production"
  }];
  return <div className="min-h-screen bg-background">
      <SEO title="Professional Video Production Services | ContentFarm" description="Transform your brand with professional video production services. From strategy to final delivery, we create compelling videos that drive results for your business." keywords="video production, professional videography, video marketing, content creation, business videos" />
      
      <StructuredData type="service" data={{
      name: "Video Production Services",
      description: "Professional video production and marketing services for businesses",
      provider: {
        "@type": "Organization",
        name: "ContentFarm"
      }
    }} />

      <ModernHeader />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 cinematic-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-tight mb-8">
              <span className="gradient-text block">Premium Video Production That Grows Your SaaS
            </span>
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-xl mx-auto mb-8">High-converting, cinema-quality videos that attract users, build authority, and turn free trials into paying customers.</p>
            <div className="inline-flex items-center gap-3 bg-black/40 px-6 py-3 rounded-full border border-primary/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-primary rounded-full animate-glow"></div>
              <span className="text-base font-medium text-white tracking-[-0.01em]">Serving clients worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Showcase Grid */}
      <section className="pt-12 pb-32 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold gradient-text text-center max-w-4xl mx-auto mb-16 leading-relaxed">
              We help B2B SaaS founders create studio-quality videos that attract users and convert trials into paying customers.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center">
                <p className="text-lg text-gray-200 leading-relaxed">
                  Record yourself with our online guidance and best practices — we'll handle all editing, storytelling, and polishing.
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-gray-200 leading-relaxed">
                  Or go fully hands-off and let our team produce everything for you — from hiring actors to complete video delivery.
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-lg text-gray-200 leading-relaxed">
                  Get studio-quality results either way, with fast turnaround and unlimited revisions included.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center mb-16">
              <div className="text-gray-400 text-2xl">⸻</div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-8 cinematic-text-shadow">
              Our Signature Work
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {videoShowcase.map((video, index) => <div key={video.id} className="group animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="relative overflow-hidden rounded-3xl cinematic-card shadow-cinematic transition-all duration-700 group-hover:scale-[1.01]">
                  <div className="relative">
                    <wistia-player media-id={video.mediaId} seo="false" aspect="1.7777777777777777" className="w-full rounded-t-3xl" />
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-white mb-3">{video.title}</h3>
                    <p className="text-gray-300">{video.subtitle}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 cinematic-section">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 cinematic-text-shadow">
              Why we're different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {features.map((feature, index) => <div key={index} className="text-center group animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-all duration-500 shadow-cinematic">
                  <feature.icon className="h-10 w-10 text-black transition-colors duration-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-background">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 cinematic-text-shadow">
            Simple. Seamless. Stunning.
          </h2>
          <p className="text-xl text-gray-200 mb-20 leading-relaxed max-w-4xl mx-auto">
            Our streamlined process takes you from idea to final video 
            with minimal effort on your part.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-20">
            {[{
            step: "01",
            title: "Discovery",
            description: "We understand your vision and goals"
          }, {
            step: "02",
            title: "Creation",
            description: "Professional filming and post‑production"
          }, {
            step: "03",
            title: "Delivery",
            description: "Your finished video, ready to share"
          }].map((item, index) => <div key={index} className="relative animate-fade-in" style={{
            animationDelay: `${index * 0.2}s`
          }}>
                <div className="text-8xl font-bold gradient-text mb-6">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
                {index < 2 && <ChevronRight className="hidden md:block absolute top-12 -right-8 h-8 w-8 text-primary/40" strokeWidth={1.5} />}
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 cinematic-section">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 cinematic-text-shadow">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-200 mb-16 leading-relaxed max-w-4xl mx-auto">
            Let's create something extraordinary together.
          </p>
          <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="btn-gradient text-lg px-8 py-4 font-semibold shadow-cinematic hover:scale-105 transition-all duration-300 animate-glow">
              Get Your Free Video Growth Plan →
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" strokeWidth={1.5} />
            </Button>
          </a>
        </div>
      </section>

      <Footer />
    </div>;
};
export default VideoProduction;