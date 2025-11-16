import { Play, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useEffect, useState } from 'react';
import ContactFormDialog from '@/components/ContactFormDialog';

const VSL = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  useEffect(() => {
    // Add Wistia scripts to head for all four videos
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.head.appendChild(script1);
    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/vq42y2aqto.js';
    script2.async = true;
    script2.type = 'module';
    document.head.appendChild(script2);
    const script3 = document.createElement('script');
    script3.src = 'https://fast.wistia.com/embed/ynn9gzhdb9.js';
    script3.async = true;
    script3.type = 'module';
    document.head.appendChild(script3);
    const script4 = document.createElement('script');
    script4.src = 'https://fast.wistia.com/embed/l5fvkmb2kx.js';
    script4.async = true;
    script4.type = 'module';
    document.head.appendChild(script4);
    const script5 = document.createElement('script');
    script5.src = 'https://fast.wistia.com/embed/kjgs07eh6r.js';
    script5.async = true;
    script5.type = 'module';
    document.head.appendChild(script5);

    // Add Wistia styles to head
    const style = document.createElement('style');
    style.textContent = `
      wistia-player[media-id='vq42y2aqto']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/vq42y2aqto/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='ynn9gzhdb9']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/ynn9gzhdb9/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='l5fvkmb2kx']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/l5fvkmb2kx/swatch'); 
        display: block; 
        filter: blur(5px); 
        padding-top:56.25%; 
      }
      wistia-player[media-id='kjgs07eh6r']:not(:defined) { 
        background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/kjgs07eh6r/swatch'); 
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
      document.head.removeChild(script3);
      document.head.removeChild(script4);
      document.head.removeChild(script5);
      document.head.removeChild(style);
    };
  }, []);

  const testimonials = [{
    company: "Chaser",
    author: "Josh Martow Co-founder & CEO",
    quote: "The video strategy transformed our user engagement completely. We saw a 120% increase in conversions within weeks.",
    thumbnail: "bg-gradient-to-br from-orange-500 to-red-500",
    duration: "3:45",
    hasVideo: true,
    mediaId: "vq42y2aqto"
  }, {
    company: "Reface",
    author: "Ivan Altsybieiev, Co-founder",
    quote: "ContentFarm transformed our onboarding experience. The video series increased our trial conversions by 67%.",
    thumbnail: "bg-gradient-to-br from-green-500 to-blue-500",
    duration: "4:32",
    hasVideo: true,
    mediaId: "ynn9gzhdb9"
  }, {
    company: "Finmap",
    author: "Oleksandr Solovei, CEO and co-founder",
    quote: "The explainer videos made our complex payment flows crystal clear. Developer adoption increased dramatically.",
    thumbnail: "bg-gradient-to-br from-purple-500 to-pink-500",
    duration: "3:18",
    hasVideo: true,
    mediaId: "l5fvkmb2kx"
  }, {
    company: "Real Estate Consulting",
    author: "Anna Vintoniak",
    quote: "These videos unlocked feature adoption we never thought possible. Our power users increased by 85%.",
    thumbnail: "bg-gradient-to-br from-blue-500 to-teal-500",
    duration: "5:24",
    hasVideo: true,
    mediaId: "kjgs07eh6r"
  }];

  return (
    <section className="py-32 cinematic-section border-t border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8 mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight cinematic-text-shadow">
            What Our Clients Say About 
            <span className="cinematic-gradient-text">
              {" "}Working With Us
            </span>
          </h2>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed cinematic-text-shadow">
            Hear directly from CEOs who've transformed their businesses with our video content strategies.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="group mx-auto max-w-4xl">
                    <div className="relative bg-black rounded-3xl overflow-hidden shadow-2xl cursor-pointer mb-8">
                      {testimonial.hasVideo && testimonial.mediaId ? (
                        <div className="aspect-video">
                          <div dangerouslySetInnerHTML={{
                            __html: `<wistia-player media-id="${testimonial.mediaId}" aspect="1.7777777777777777" seo="false"></wistia-player>`
                          }} />
                        </div>
                      ) : (
                        <div className={`aspect-video ${testimonial.thumbnail} flex items-center justify-center relative`}>
                          <div className="absolute inset-0 bg-black/20"></div>
                          <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Play className="h-10 w-10 text-white ml-1" fill="white" />
                            </div>
                          </div>
                          
                          <div className="absolute bottom-6 left-6 flex items-center gap-3 text-white/80">
                            <Volume2 className="h-4 w-4" />
                            <span className="text-sm">{testimonial.duration}</span>
                          </div>
                          
                          <div className="absolute top-6 right-6 bg-red-600 text-white text-sm px-3 py-2 rounded">LIVE</div>
                        </div>
                      )}
                    </div>

                    <div className="text-center text-white space-y-6">
                      <div className="space-y-2">
                        <div className="font-bold text-2xl text-white">{testimonial.company}</div>
                        <div className="text-lg text-gray-400">
                          {index === 0 ? (
                            <a href="https://www.linkedin.com/in/joshmartow/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">
                              {testimonial.author}
                            </a>
                          ) : index === 1 ? (
                            <a href="https://www.linkedin.com/in/ivanalts/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">
                              {testimonial.author}
                            </a>
                          ) : index === 2 ? (
                            <a href="https://www.linkedin.com/in/oleksandr-solovei-32a56a180/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">
                              {testimonial.author}
                            </a>
                          ) : index === 3 ? (
                            <a href="https://www.linkedin.com/in/anna-vintoniak-8a350283/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors cursor-pointer">
                              {testimonial.author}
                            </a>
                          ) : testimonial.author}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="right-4 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="cinematic-cta text-xl px-10 py-6 shadow-glow hover:shadow-glow"
            onClick={() => setIsDialogOpen(true)}
          >
            Get Your Success Story
          </Button>
          <ContactFormDialog isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
          <p className="text-gray-400 text-lg mt-4">
            Free strategy call • No pitch, just value • 30 minutes
          </p>
        </div>
      </div>
    </section>
  );
};

export default VSL;
