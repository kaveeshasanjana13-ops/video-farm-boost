import partner1 from "@/assets/partners/partner-1.png";
import awsLogo from "@/assets/partners/aws-logo.png";
import sinhalaLogo from "@/assets/partners/sinhala-logo.png";
import googleLogo from "@/assets/partners/google-logo.png";
import solanaLogo from "@/assets/partners/solana-logo.png";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
const PartnersSection = () => {
  const { elementRef, isVisible } = useIntersectionObserver();
  
  // Base partner logos
  const basePartners = [{
    name: "Partner 1",
    logo: partner1
  }, {
    name: "AWS",
    logo: awsLogo
  }, {
    name: "Sinhala Partner",
    logo: sinhalaLogo
  }, {
    name: "Google",
    logo: googleLogo
  }, {
    name: "Solana",
    logo: solanaLogo
  }];

  // Create two copies for seamless loop animation
  const partners = [...basePartners, ...basePartners];
  return <section ref={elementRef} className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-y border-primary/20 relative overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-dark/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold border border-primary/20 animate-fade-in">
              Trusted Partnerships
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Collaborating with industry leaders to deliver excellence in education
          </p>
        </div>
        
        {/* Partners Grid with Hover Effects */}
        <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {basePartners.map((partner, index) => (
            <div 
              key={index} 
              className="group flex items-center justify-center p-6 bg-card/80 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={partner.logo} 
                alt={`${partner.name} - SurakshaLMS Partner`} 
                className="max-w-full max-h-16 md:max-h-20 object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" 
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Partnership CTA */}
        <div className={`text-center mt-12 transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-muted-foreground mb-4">Interested in partnering with us?</p>
          <button className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
            Become a Partner
          </button>
        </div>
      </div>
    </section>;
};
export default PartnersSection;