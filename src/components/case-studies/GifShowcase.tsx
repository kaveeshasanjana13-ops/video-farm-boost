import { useState, useEffect } from 'react';

interface GifShowcaseProps {
  gif: {
    id: number;
    title: string;
    thumbnail: string;
  };
}

const GifShowcase = ({ gif }: GifShowcaseProps) => {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Load Wistia scripts
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/oln855rp82.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);

    // Load Wistia styles
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='oln855rp82']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/oln855rp82/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:53.54%; 
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(script1)) document.head.removeChild(script1);
      if (document.head.contains(script2)) document.head.removeChild(script2);
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  return (
    <section className="py-16 cinematic-section border-t border-white/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 animate-fade-in cinematic-text-shadow">
            GIF Creation
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            By creating dynamic GIFs from scratch with custom 2D elements, Chaser transformed their raw content into animations that captured attention and drove real engagement - no more 3-second drop-offs.
          </p>
          
          <div className="max-w-2xl mx-auto mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                Designed and animated GIFs fully from scratch
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                Crafted bespoke 2D elements tailored to Chaser's brand
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                Optimized animations for attention retention and engagement
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-3 mt-1">•</span>
                Delivered polished assets ready for campaigns
              </li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <div 
            className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 w-full max-w-md animate-scale-in hover-scale" 
            style={{ animationDelay: '0.2s' }}
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="aspect-video bg-gradient-to-br from-yellow-400/20 to-yellow-400/5 flex items-center justify-center relative overflow-hidden border border-white/10">
              <wistia-player 
                media-id="oln855rp82" 
                seo="false" 
                aspect="1.867704280155642"
                className={`w-full h-full transition-all duration-500 ${
                  isHovered ? 'scale-105' : 'scale-100'
                }`}
              />
              <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white font-bold text-lg mb-2 transform transition-transform duration-300 translate-y-2 group-hover:translate-y-0">
                    {gif.title}
                  </h3>
                  <p className="text-white/80 text-sm transform transition-transform duration-300 delay-100 translate-y-4 group-hover:translate-y-0">
                    High-impact visual storytelling
                  </p>
                </div>
              </div>
              
              {/* Decorative corner accent */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-yellow-400/50 transform transition-all duration-300 group-hover:scale-110"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GifShowcase;