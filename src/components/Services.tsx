import { Video, Users, BookOpen, Youtube, ArrowRight, CheckCircle, Star, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState, useEffect } from 'react';
import ContactFormDialog from '@/components/ContactFormDialog';
const Services = () => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('1b2pvbr0d0');
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  useEffect(() => {
    if (showVideoModal) {
      // Add Wistia scripts when modal opens
      const playerScript = document.createElement('script');
      playerScript.src = 'https://fast.wistia.com/player.js';
      playerScript.async = true;
      document.head.appendChild(playerScript);
      const embedScript = document.createElement('script');
      embedScript.src = `https://fast.wistia.com/embed/${currentVideoId}.js`;
      embedScript.async = true;
      embedScript.type = 'module';
      document.head.appendChild(embedScript);
      const style = document.createElement('style');
      style.textContent = `
        wistia-player[media-id='${currentVideoId}']:not(:defined) { 
          background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${currentVideoId}/swatch'); 
          display: block; 
          filter: blur(5px); 
          padding-top:56.25%; 
        }
      `;
      document.head.appendChild(style);
      return () => {
        // Cleanup scripts and styles when modal closes
        document.head.removeChild(playerScript);
        document.head.removeChild(embedScript);
        document.head.removeChild(style);
      };
    }
  }, [showVideoModal, currentVideoId]);
  const services = [{
    icon: Video,
    title: "Product Demo Videos",
    description: "Turn prospects into customers with demos that showcase your SaaS like never before.",
    features: ["Feature walkthroughs that convert", "Interactive demos that engage", "A/B tested scripts", "Mobile-optimized delivery"],
    badge: "Most Popular",
    badgeColor: "bg-gradient-to-r from-green-500 to-emerald-600"
  }, {
    icon: BookOpen,
    title: "Explainers & Onboarding",
    description: "Reduce churn by 40% with crystal-clear onboarding that gets users to 'aha!' moments faster.",
    features: ["User journey mapping", "Step-by-step visual guides", "Animated explanations", "Multi-language support"],
    badge: "Best ROI",
    badgeColor: "bg-gradient-to-r from-purple-500 to-violet-600"
  }, {
    icon: Users,
    title: "Webinars & Event Repurposing",
    description: "Transform one event into 10+ pieces of engaging content that work 24/7 for your business.",
    features: ["Event highlight reels", "Speaker spotlight videos", "Q&A compilation clips", "Social media snippets"],
    badge: "High Impact",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-600"
  }, {
    icon: Youtube,
    title: "YouTube Content Strategy",
    description: "Build authority and generate leads with YouTube content that ranks on page 1 and converts viewers.",
    features: ["SEO-optimized content", "Thumbnail design that converts", "Strategic content calendar", "Performance analytics"],
    badge: "Long-term Growth",
    badgeColor: "bg-gradient-to-r from-blue-500 to-cyan-600"
  }];
  return <>
      {/* Problem/Pain Points Section */}
      <section className="relative py-20 cinematic-section overflow-hidden">
        {/* Background decoration with blob shapes */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/10 blob-shape blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-primary/20 blob-organic blur-3xl animate-blob-pulse" style={{
        animationDelay: '2s'
      }}></div>
        <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-primary/5 blob-soft blur-2xl animate-blob-breathe" style={{
        animationDelay: '4s'
      }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-6xl font-bold cinematic-gradient-text leading-tight">
              Your SaaS is Bleeding Money Every Day
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed cinematic-text-shadow">
              While you're stuck explaining your product with boring text and screenshots...
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="cinematic-card p-8 shadow-cinematic liquid-card">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-bold mb-4 text-white">73% of visitors bounce without understanding your product</h3>
              <p className="text-gray-300">
                Your competitors with video demos are eating your lunch while you're still writing feature lists
              </p>
            </div>

            <div className="cinematic-card p-8 shadow-cinematic liquid-card">
              <div className="text-4xl mb-4">💸</div>
              <h3 className="text-xl font-bold mb-4 text-white">You're spending $10K+/month on ads that convert at 0.8%</h3>
              <p className="text-gray-300">
                Because nobody understands what your SaaS actually DOES in 30 seconds
              </p>
            </div>

            <div className="cinematic-card p-8 shadow-cinematic liquid-card md:col-span-2 lg:col-span-1">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-4 text-white">Your sales team wastes 40+ hours/week explaining basic features</h3>
              <p className="text-gray-300">
                Instead of closing deals, they're doing product demos that should be automated
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution/Benefits Section */}
      <section className="relative py-20 cinematic-section overflow-hidden border-t border-primary/20">
        {/* Background decoration with morphing blobs */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/10 blob-shape blur-3xl animate-blob"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-primary/10 blob-organic blur-3xl animate-blob-breathe" style={{
        animationDelay: '1s'
      }}></div>
        <div className="absolute top-2/3 left-1/3 w-60 h-60 bg-primary/5 blob-soft blur-xl animate-blob-pulse" style={{
        animationDelay: '3s'
      }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-6xl font-bold cinematic-gradient-text leading-tight">
              We Fix This in 30 Days or You Don't Pay
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed cinematic-text-shadow">
              Here's exactly what happens when you work with ContentFarm:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="cinematic-card p-8 shadow-cinematic liquid-card">
              <div className="text-center">
                <div className="text-4xl mb-4">📈</div>
                <h3 className="text-2xl font-bold mb-4 cinematic-gradient-text">3-5x Higher Conversion Rates</h3>
                <p className="text-gray-300">
                  Your product demo video explains your SaaS in 90 seconds better than your sales team does in 30 minutes
                </p>
              </div>
            </div>

            <div className="cinematic-card p-8 shadow-cinematic liquid-card">
              <div className="text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold mb-4 cinematic-gradient-text">Instant ROI on Ad Spend</h3>
                <p className="text-gray-300">
                  Same traffic, same budget - but now visitors actually understand and buy your product
                </p>
              </div>
            </div>

            <div className="cinematic-card p-8 shadow-cinematic liquid-card">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-2xl font-bold mb-4 cinematic-gradient-text">Sales Team 10x More Efficient</h3>
                <p className="text-gray-300">
                  They skip the "what does it do?" calls and jump straight to closing qualified leads
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="relative py-20 cinematic-section overflow-hidden border-t border-primary/20">
        {/* Background decoration with organic blobs */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary/20 blob-organic blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/10 blob-shape blur-3xl animate-blob-pulse" style={{
        animationDelay: '3s'
      }}></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-primary/10 blob-soft blur-2xl animate-blob-breathe" style={{
        animationDelay: '5s'
      }}></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with compelling messaging */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight cinematic-text-shadow">
              Video Services That
              <span className="cinematic-gradient-text block mt-2">
                Actually Drive Revenue
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed cinematic-text-shadow">
              Stop wasting money on videos that look pretty but don't convert. Our data-driven approach has helped SaaS companies 
              <span className="font-bold cinematic-gradient-text"> increase conversions by up to 340%</span> and 
              <span className="font-bold cinematic-gradient-text"> reduce churn by 40%</span>.
            </p>
            
            {/* Social proof numbers with liquid design */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-8">
              <div className="text-center cinematic-card p-4 shadow-cinematic liquid-card">
                <div className="text-2xl font-bold cinematic-gradient-text">340%</div>
                <div className="text-sm text-gray-400">Avg. Conversion Increase</div>
              </div>
              <div className="text-center cinematic-card p-4 shadow-cinematic liquid-card">
                <div className="text-2xl font-bold cinematic-gradient-text">40%</div>
                <div className="text-sm text-gray-400">Churn Reduction</div>
              </div>
              <div className="text-center cinematic-card p-4 shadow-cinematic liquid-card">
                <div className="text-2xl font-bold cinematic-gradient-text">72hrs</div>
                <div className="text-sm text-gray-400">Average Delivery</div>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {services.map((service, index) => {
            const Icon = service.icon;
            return <Card key={index} className="relative group liquid-card transition-all duration-500 cinematic-card overflow-hidden flex flex-col h-full shadow-cinematic cursor-pointer" onClick={index === 0 || index === 1 ? () => {
              setCurrentVideoId(index === 0 ? 'uv0619hth3' : 'nv9fv10ztj');
              setShowVideoModal(true);
            } : undefined}>
                  {/* Badge */}
                  <div className={`absolute top-4 right-4 ${service.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md`}>
                    {service.badge}
                  </div>
                  
                  <CardHeader className="text-center pb-4 relative">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary blob-shape flex items-center justify-center group-hover:scale-110 group-hover:animate-blob-pulse transition-all duration-500 shadow-lg group-hover:shadow-glow">
                      <Icon className="h-10 w-10 text-primary-foreground" />
                    </div>
                     <CardTitle className="text-xl font-bold text-white mb-4">{service.title}</CardTitle>
                   </CardHeader>
                   
                   <CardContent className="space-y-6 flex flex-col flex-grow">
                     <CardDescription className="text-gray-300 text-center font-medium">
                       {service.description}
                     </CardDescription>
                     
                     <ul className="space-y-3 flex-grow">
                       {service.features.map((feature, featureIndex) => <li key={featureIndex} className="flex items-center gap-3 text-sm text-white">
                           <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                           <span>{feature}</span>
                         </li>)}
                     </ul>
                  </CardContent>
                </Card>;
          })}
          </div>

          {/* Bottom CTA with urgency */}
          <div className="text-center mt-16">
            <div className="relative cinematic-card p-8 text-white max-w-4xl mx-auto shadow-cinematic overflow-hidden" style={{
            borderRadius: '40px'
          }}>
              {/* Background decoration with blob shapes */}
              <div className="absolute top-4 right-4 w-32 h-32 bg-primary/20 blob-shape blur-2xl animate-blob-breathe"></div>
              <div className="absolute bottom-4 left-4 w-24 h-24 bg-primary/10 blob-organic blur-xl animate-blob-pulse"></div>
              
              <div className="relative">
                <h3 className="text-3xl font-bold mb-4 cinematic-gradient-text">
                  🔥 Ready to Transform Your Video Marketing?
                </h3>
                <p className="text-xl text-gray-300 mb-6">Book a call and get a FREE video</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button 
                    size="lg" 
                    className="cinematic-cta text-lg px-8 py-4 font-bold shadow-glow hover:shadow-glow transition-all duration-300"
                    onClick={() => setIsContactDialogOpen(true)}
                  >
                    Get Your Free Video Growth Plan →
                  </Button>
                  <ContactFormDialog isOpen={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
                  <Link to="/pricing">
                    <Button size="lg" variant="outline" className="text-lg px-8 py-4 font-bold border-primary/50 text-primary hover:bg-primary/10 transition-all duration-300 flex items-center gap-2">
                      <Calculator className="w-5 h-5" />
                      ROI Calculator
                    </Button>
                  </Link>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      <Dialog open={showVideoModal} onOpenChange={setShowVideoModal}>
        <DialogContent className="max-w-4xl w-full">
          <DialogHeader>
            <DialogTitle>{currentVideoId === 'uv0619hth3' ? 'Product Demo Video' : 'Explainers & Onboarding Video'}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <wistia-player media-id={currentVideoId} seo="false" aspect="1.7777777777777777"></wistia-player>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
export default Services;