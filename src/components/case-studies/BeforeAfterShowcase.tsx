import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GlowCard } from '@/components/ui/spotlight-card';
import { ArrowRight, Play, CheckCircle, XCircle } from 'lucide-react';
interface BeforeAfterShowcaseProps {
  beforeAfterVideos: {
    testimonials: {
      before: string;
      after: string;
    };
    tutorials: {
      before: string;
      after: string;
    };
    verticalAds: {
      before: string;
      after: string;
    };
  };
}
const BeforeAfterShowcase = ({
  beforeAfterVideos
}: BeforeAfterShowcaseProps) => {
  const [selectedComparison, setSelectedComparison] = useState<'testimonials' | 'tutorials' | 'verticalAds'>('testimonials');
  useEffect(() => {
    // Add Wistia scripts to head
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/r6efrnxmve.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);
    const script3 = document.createElement('script');
    script3.src = 'https://fast.wistia.com/embed/ys4rhzkf1q.js';
    script3.async = true;
    script3.type = 'module';
    document.head.appendChild(script3);
    const script4 = document.createElement('script');
    script4.src = 'https://fast.wistia.com/embed/zn6fa4f8jj.js';
    script4.async = true;
    script4.type = 'module';
    document.head.appendChild(script4);
    const script5 = document.createElement('script');
    script5.src = 'https://fast.wistia.com/embed/f0xwww5mdf.js';
    script5.async = true;
    script5.type = 'module';
    document.head.appendChild(script5);
    const script6 = document.createElement('script');
    script6.src = 'https://fast.wistia.com/embed/c5tw2tz3av.js';
    script6.async = true;
    script6.type = 'module';
    document.head.appendChild(script6);

    // Add Wistia styles to head
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='r6efrnxmve']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/r6efrnxmve/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='ys4rhzkf1q']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/ys4rhzkf1q/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='zn6fa4f8jj']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/zn6fa4f8jj/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='f0xwww5mdf']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/f0xwww5mdf/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:177.78%; 
      }
      wistia-player[media-id='c5tw2tz3av']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/c5tw2tz3av/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:177.78%; 
      }
    `;
    document.head.appendChild(style);

    // Cleanup function
    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
      document.head.removeChild(script3);
      document.head.removeChild(script4);
      document.head.removeChild(script5);
      document.head.removeChild(script6);
      document.head.removeChild(style);
    };
  }, []);
  return <section className="relative py-16 cinematic-section border-t border-white/10 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/10 blob-shape blur-3xl animate-blob"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-yellow-400/5 blob-soft blur-3xl animate-blob-pulse" style={{
      animationDelay: '2s'
    }}></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold cinematic-gradient-text mb-8 animate-fade-in cinematic-text-shadow">
            Before & After Transformation
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 animate-fade-in leading-relaxed" style={{
          animationDelay: '0.1s'
        }}>
            See the dramatic improvement in engagement and conversion rates
          </p>
          
          {/* Enhanced Toggle Buttons */}
          <div className="flex justify-center mb-8 animate-scale-in" style={{
          animationDelay: '0.2s'
        }}>
            <div className="cinematic-card p-2 shadow-xl">
              <button onClick={() => setSelectedComparison('testimonials')} className={`relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ${selectedComparison === 'testimonials' ? 'cinematic-cta text-black shadow-2xl transform scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                Customer Testimonials
                {selectedComparison === 'testimonials' && <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl animate-pulse"></div>}
              </button>
              <button onClick={() => setSelectedComparison('tutorials')} className={`relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ${selectedComparison === 'tutorials' ? 'cinematic-cta text-black shadow-2xl transform scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                Tutorial
                {selectedComparison === 'tutorials' && <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl animate-pulse"></div>}
              </button>
              <button onClick={() => setSelectedComparison('verticalAds')} className={`relative px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-500 ${selectedComparison === 'verticalAds' ? 'cinematic-cta text-black shadow-2xl transform scale-105' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                Vertical Ads
                {selectedComparison === 'verticalAds' && <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-xl animate-pulse"></div>}
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Before/After Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-stretch">
          {/* Before Section with GlowCard */}
          <div className="relative flex">
            <GlowCard customSize={true} glowColor="red" className="w-full h-full min-h-[600px] animate-slide-in-left flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                <h3 className="text-2xl font-bold text-red-500">Before</h3>
                <XCircle className="w-6 h-6 text-red-500 ml-auto" />
              </div>
              
              {selectedComparison === 'testimonials' && <div className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="cinematic-card p-4 bg-red-500/10 border border-red-500/20">
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          Nearly a full minute of filler ("um, ah, so...") that distracted from the message
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          Echoey audio that made it hard to focus
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          No branding at all—viewers had no reason to remember the company
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          A pace so slow it lost attention before the point landed
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                  
                  {/* Video Player */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                    <wistia-player media-id="r6efrnxmve" aspect="1.7777777777777777" seo="false" />
                  </div>
                </div>}
              
              {selectedComparison === 'tutorials' && <div className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="cinematic-card p-4 bg-red-500/10 border border-red-500/20">
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          A talking head with a voiceover
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          No visual cues, no energy
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Video Player for Tutorials */}
                  {beforeAfterVideos[selectedComparison].before.startsWith('youtube:') ? <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                      <div className="aspect-video">
                        <iframe src={`https://www.youtube.com/embed/${beforeAfterVideos[selectedComparison].before.replace('youtube:', '')}`} title="Before - Tutorial Process" className="w-full h-full" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                      </div>
                    </div> : <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                      <wistia-player media-id="u4mm5490v8" aspect="1.7777777777777777" seo="false" />
                    </div>}
                </div>}
              
              {selectedComparison === 'verticalAds' && <div className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="cinematic-card p-4 bg-red-500/10 border border-red-500/20">
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          Static, uninspiring vertical ad
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          Low engagement rates
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          Poor mobile performance
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                  
                  {/* Video Player for Vertical Ads */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl max-w-sm mx-auto">
                    <wistia-player media-id="f0xwww5mdf" aspect="0.5625" seo="false" />
                  </div>
                </div>}
            </GlowCard>
          </div>


          {/* After Section with GlowCard */}
          <div className="relative flex">
            <GlowCard customSize={true} glowColor="green" className="w-full h-full min-h-[600px] animate-slide-in-right flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-2xl font-bold text-green-500">After</h3>
                <CheckCircle className="w-6 h-6 text-green-500 ml-auto" />
              </div>
              
              {selectedComparison === 'testimonials' && <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="cinematic-card p-4 bg-green-500/10 border border-green-500/20">
                      <p className="font-semibold text-white mb-3">Here's how we turned it around:</p>
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Tight editing</strong> → Every word adds value, no awkward pauses</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Clear subtitles</strong> → Perfect for viewers who watch with the sound off</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>On-brand design</strong> → Every frame reinforces credibility and identity</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Engaging pacing</strong> → Smooth flow that keeps attention to the very end</span>
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                  
                  {/* Video Player */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                    <wistia-player media-id="zn6fa4f8jj" aspect="1.7777777777777777" seo="false" />
                  </div>
                </div>}
              
              {selectedComparison === 'tutorials' && <div className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="cinematic-card p-4 bg-green-500/10 border border-green-500/20">
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Motion graphics that guide the eye</strong> → makes steps crystal clear</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>On-brand visuals</strong> → every second builds recognition</span>
                        </li>
                        
                      </ul>
                    </div>
                    
                  </div>
                  
                  {/* Video Player for Tutorials */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl">
                    <wistia-player media-id="ys4rhzkf1q" aspect="1.7777777777777777" seo="false" />
                  </div>
                </div>}
              
              {selectedComparison === 'verticalAds' && <div className="space-y-6">
                  <div className="space-y-4">
                    
                    <div className="cinematic-card p-4 bg-green-500/10 border border-green-500/20">
                      <ul className="space-y-3 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Dynamic motion graphics</strong> → Eye-catching animations</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Mobile-optimized format</strong> → Perfect for social platforms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span><strong>Higher engagement</strong> → Increased click-through rates</span>
                        </li>
                      </ul>
                    </div>
                    
                  </div>
                  
                  {/* Video Player for Vertical Ads */}
                  <div className="relative overflow-hidden rounded-xl border border-border/50 shadow-2xl max-w-sm mx-auto">
                    <wistia-player media-id="c5tw2tz3av" aspect="0.5625" seo="false" />
                  </div>
                </div>}
            </GlowCard>
          </div>
        </div>
        
        {/* Results Summary */}
        <div className="mt-20 text-center">
          
        </div>
      </div>
    </section>
};

export default BeforeAfterShowcase;