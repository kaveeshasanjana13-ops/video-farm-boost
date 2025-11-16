import ModernHeader from '@/components/ModernHeader';
import Footer from '@/components/Footer';
import { ArrowLeft, Play, TrendingUp, Users, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useEffect } from 'react';

const CaseStudies = () => {
  useEffect(() => {
    // Add Wistia scripts to head
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/8gywrfd4p3.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);

    // Add Wistia styles to head
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='8gywrfd4p3']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/8gywrfd4p3/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(style);
    };
  }, []);
  const successStories = [{
    id: 1,
    title: "ProjectFlow Success",
    subtitle: "From 0 to $50K ARR in 6 months",
    thumbnail: "bg-gradient-to-br from-blue-500 to-purple-600",
    result: "+340% conversions",
    metric: "67% trial increase",
    hasVideo: true
  }, {
    id: 2,
    title: "TaskMaster Growth",
    subtitle: "Scaled to 10K+ active users",
    thumbnail: "bg-gradient-to-br from-green-500 to-blue-500",
    result: "+250% retention",
    metric: "85% feature adoption",
    hasVideo: true
  }, {
    id: 3,
    title: "DataBridge Transformation",
    subtitle: "Reduced churn by 70%",
    thumbnail: "bg-gradient-to-br from-purple-500 to-pink-500",
    result: "+180% revenue",
    metric: "3x user engagement",
    hasVideo: true
  }, {
    id: 4,
    title: "ShopGenius Explosion",
    subtitle: "Viral growth in 30 days",
    thumbnail: "bg-gradient-to-br from-orange-500 to-red-500",
    result: "+500% signups",
    metric: "2M+ video views",
    hasVideo: true
  }];
  const getVideoId = (storyId: number) => {
    switch (storyId) {
      case 1:
        return "8gywrfd4p3";
      case 2:
        return "uv0619hth3";
      case 3:
        return "wuikfu07dd";
      case 4:
        return "nv9fv10ztj";
      default:
        return "8gywrfd4p3";
    }
  };
  return <div className="min-h-screen cinematic-section">
      <ModernHeader />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 cinematic-section relative overflow-hidden">
          <div className="absolute inset-0 cinematic-grain opacity-20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-12">
              <a href="/" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </a>
            </div>
            
            {/* Sales-focused Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight cinematic-text-shadow">
                Watch How We Transformed
                <span className="cinematic-gradient-text">
                  {" "}These Businesses
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 max-w-4xl mx-auto mb-8">
                See real results from real companies.
              </p>
              
              <div className="flex items-center justify-center gap-8 text-sm text-gray-300 mb-12">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-yellow-400" />
                  <span>Average 250% ROI increase</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span>30-day turnaround</span>
                </div>
              </div>
            </div>
            
            {/* Video Success Stories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {successStories.map(story => <Dialog key={story.id}>
                  <DialogTrigger asChild>
                    <div className="group cursor-pointer">
                      <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
                        <div className={`absolute inset-0 ${story.thumbnail} transition-transform duration-500 group-hover:scale-110`}>
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                          
                           {/* Video Player or Play Button */}
                           <div className="absolute inset-0 flex items-center justify-center">
                             {story.hasVideo ? <wistia-player media-id={getVideoId(story.id)} aspect="1.7777777777777777" seo="false"></wistia-player> : <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-125 group-hover:bg-white transition-all duration-300 shadow-lg">
                                 <Play className="h-10 w-10 text-gray-900 ml-1" fill="currentColor" />
                               </div>}
                           </div>
                        </div>
                      </div>
                    </div>
                  </DialogTrigger>
                  
                  <DialogContent className="max-w-4xl w-full p-0 cinematic-section border-white/20">
                    <div className="aspect-video">
                      <wistia-player media-id={getVideoId(story.id)} aspect="1.7777777777777777" seo="false"></wistia-player>
                    </div>
                  </DialogContent>
                </Dialog>)}
            </div>
            
            {/* CTA Section */}
            <div className="text-center mt-16 p-8 cinematic-card border border-white/20 shadow-cinematic text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10"></div>
              <div className="relative">
                <h2 className="text-3xl font-bold mb-4 cinematic-gradient-text">Ready to Be Our Next Success Story?</h2>
                <p className="text-xl mb-6 text-gray-200">Join 50+ companies that have transformed their growth with our video strategies</p>
                <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer" className="inline-block cinematic-cta font-bold text-lg px-8 py-4 transform hover:scale-105">
                  Get Your Free Strategy Call
                </a>
                <p className="text-sm mt-4 text-gray-300">
                  Free 30-minute consultation • No pitch, just value • Results guaranteed
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>;
};
export default CaseStudies;