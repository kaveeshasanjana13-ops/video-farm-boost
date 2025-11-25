import { useState, useRef, useEffect } from "react";
import { Play } from "lucide-react";
const VideoShowcaseSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  return <section ref={sectionRef} className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Geometric Shapes */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{
        animationDuration: '4s'
      }} />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{
        animationDuration: '6s',
        animationDelay: '1s'
      }} />
        
        {/* 3D-like geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-white/20 rotate-45 animate-spin" style={{
        animationDuration: '20s'
      }} />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-white/30 rounded-lg rotate-12 animate-bounce" style={{
        animationDuration: '5s'
      }} />
        
        {/* Floating dots pattern */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => <div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse" style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 3}s`
        }} />)}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-0 md:px-8">
        {/* Video Container */}
        <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {/* Video Wrapper with Glow Effect */}
          <div className="relative group w-full">
            {/* Animated Glow */}
            <div className="absolute -inset-0.5 md:-inset-1 bg-gradient-to-r from-blue-300 via-white to-blue-300 rounded-2xl md:rounded-3xl opacity-40 blur-lg md:blur-xl group-hover:opacity-60 transition-all duration-500 animate-pulse" />
            
            {/* Video Frame */}
            <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl border border-white/20 md:border-2 md:border-white/10">
              {/* Logo Overlay */}
              <div className="absolute top-4 right-4 z-20 transition-all duration-300 hover:scale-110">
                
              </div>

              {/* Video Player */}
              <div className="relative w-full" style={{
              paddingTop: '56.25%'
            }}>
                <video 
                  className="absolute top-0 left-0 w-full h-full" 
                  src="https://surakshalms.s3.us-east-1.amazonaws.com/SURAKSHA_LMS.mp4" 
                  title="SurakshaLMS Platform Demo"
                  controls
                  controlsList="nodownload"
                  playsInline
                />
              </div>

              {/* Hover Overlay Effect */}
              <div className={`absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* Floating Play Icon Animation */}
            
          </div>

          {/* Feature Tags */}
          
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>;
};
export default VideoShowcaseSection;