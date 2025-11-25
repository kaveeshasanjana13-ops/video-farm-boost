import partner1 from "@/assets/partners/partner-1.png";
import awsLogo from "@/assets/partners/aws-logo.png";
import sinhalaLogo from "@/assets/partners/sinhala-logo.png";
import googleLogo from "@/assets/partners/google-logo.png";
import solanaLogo from "@/assets/partners/solana-logo.png";
const PartnersSection = () => {
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
  return <section className="py-4 bg-gradient-to-r from-background via-muted/20 to-background border-y border-border/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-3">
          <h2 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent mb-1">
            Our Trusted Partners
          </h2>
          <p className="text-muted-foreground text-xs max-w-md mx-auto">
            Working together with leading organizations to transform education
          </p>
        </div>
        
        {/* Partners Marquee - Left to Right */}
        <div className="relative overflow-hidden mb-2">
          <div className="flex items-center justify-center">
            <div className="flex animate-scroll-right space-x-4 md:space-x-6">
              {partners.map((partner, index) => <div key={index} className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-card/50 backdrop-blur-sm rounded-md border border-border/10 hover:border-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-sm group">
                  <img src={partner.logo} alt={partner.name} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300" />
                </div>)}
            </div>
          </div>
        </div>

        {/* Customers Marquee - Right to Left */}
        <div className="relative overflow-hidden">
          
        </div>
      </div>
    </section>;
};
export default PartnersSection;