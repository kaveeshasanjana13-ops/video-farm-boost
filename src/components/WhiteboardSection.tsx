import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";

const WhiteboardSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.3
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen bg-background flex items-center justify-center px-4 py-16 relative overflow-hidden"
    >
      {/* Decorative Background Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top area dots */}
        <div className="absolute top-20 left-[15%] w-2 h-2 bg-primary/20 rounded-full"></div>
        <div className="absolute top-32 left-[12%] w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute top-16 right-[20%] w-3 h-3 bg-primary/15 rounded-full"></div>
        <div className="absolute top-28 right-[25%] w-1.5 h-1.5 bg-primary/25 rounded-full"></div>
        
        {/* Right area dots near video */}
        <div className="absolute top-[25%] right-[8%] w-2 h-2 bg-primary/20 rounded-full"></div>
        <div className="absolute top-[35%] right-[5%] w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute top-[45%] right-[12%] w-1.5 h-1.5 bg-primary/25 rounded-full"></div>
        
        {/* Bottom area dots */}
        <div className="absolute bottom-32 left-[18%] w-2 h-2 bg-primary/20 rounded-full"></div>
        <div className="absolute bottom-24 left-[22%] w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute bottom-40 right-[15%] w-2.5 h-2.5 bg-primary/15 rounded-full"></div>
        <div className="absolute bottom-28 right-[18%] w-1 h-1 bg-primary/25 rounded-full"></div>
        
        {/* Additional scattered dots */}
        <div className="absolute top-[60%] left-[8%] w-1.5 h-1.5 bg-primary/20 rounded-full"></div>
        <div className="absolute top-[70%] left-[25%] w-1 h-1 bg-primary/30 rounded-full"></div>
        <div className="absolute top-[15%] left-[40%] w-2 h-2 bg-primary/15 rounded-full"></div>
        <div className="absolute bottom-[65%] right-[35%] w-1 h-1 bg-primary/25 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Content */}
        <div className={`space-y-8 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
              <span className="text-foreground">Filling the </span>
              <span className="text-primary">Gap</span>
              <br />
              <span className="text-primary">Between</span>
              <span className="text-foreground"> Student, Parent & Teacher</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
              Connecting education stakeholders through innovative learning solutions.
            </p>
          </div>
        </div>

        {/* Right Content - Video */}
        <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000 delay-300`}>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800">
            {/* YouTube Embed */}
            <iframe 
              src="https://www.youtube.com/embed/as6q5DylTyg?si=1LFjUkYrd7Yq-ii4" 
              title="YouTube video player" 
              className="w-full h-full" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              referrerPolicy="strict-origin-when-cross-origin" 
              allowFullScreen
            ></iframe>
            
            {/* Video Overlay Info */}
            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-2 text-white text-sm font-medium">
              Suraksha LMS
            </div>
            
            {/* YouTube Branding */}
            <div className="absolute bottom-4 right-4 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">
              YouTube
            </div>
          </div>
          
          {/* Additional Video Info */}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Watch our step-by-step tutorial
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-primary/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default WhiteboardSection;