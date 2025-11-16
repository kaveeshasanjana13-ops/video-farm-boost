import { useEffect } from 'react';
import { ArrowLeft, Play } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface CaseStudyHeroProps {
  mainTestimonialVideo: string;
}

const CaseStudyHero = ({ mainTestimonialVideo }: CaseStudyHeroProps) => {
  useEffect(() => {
    // Add Wistia scripts to head
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/vq42y2aqto.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);

    // Add Wistia styles to head
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='vq42y2aqto']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/vq42y2aqto/swatch'); 
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
  return (
    <section className="py-16 cinematic-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-12 animate-fade-in">
          <a href="/" className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </a>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="inline-block px-4 py-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-full text-sm font-semibold mb-4">
              Case Study
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight cinematic-text-shadow">
              How We Turned Chaser's Raw Footage Into
              <span className="cinematic-gradient-text">
                {" "}High-Converting Marketing Assets
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Client: <a href="https://www.trychaser.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:text-yellow-300 font-semibold story-link">Chaser</a> was dealing with what nearly every company experiences: raw footage that fails to hold attention beyond 3 seconds.
            </p>
          </div>

          {/* Hero Video with Play Button */}
          <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Dialog>
              <DialogTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl aspect-video max-w-3xl mx-auto transform transition-all duration-500 hover:scale-105 hover:shadow-3xl">
                      <div 
                        className="absolute inset-0 bg-center bg-cover"
                        style={{ backgroundImage: "url('https://fast.wistia.com/embed/medias/vq42y2aqto/swatch')" }}
                      >
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-300"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:bg-white/30">
                            <Play className="w-8 h-8 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 text-white">
                          <p className="text-sm opacity-75">Client Testimonial</p>
                          <p className="font-semibold">Watch the full story</p>
                        </div>
                      </div>
                    </div>
                  </div>
              </DialogTrigger>
              
              <DialogContent className="max-w-4xl w-full p-0 bg-black border-gray-800">
                <div className="aspect-video">
                  <wistia-player media-id="vq42y2aqto" aspect="1.7777777777777777" seo="false"></wistia-player>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaseStudyHero;