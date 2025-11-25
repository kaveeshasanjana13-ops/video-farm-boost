import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

// Business Section Layout with enhanced overlapping
const BusinessSection = ({
  isVisible
}: {
  isVisible: boolean;
}) => <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`}>
    <div className="relative h-[500px] w-full">
      {/* Large background image */}
      <div className="absolute top-0 left-4 w-80 h-60 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-100 to-purple-100 transform hover:scale-105 transition-all duration-500 z-10">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-OzYon8UTGRa5VyyHZfunvoNs7EfhBL-UsA&s" alt="Business mockup" className="w-full h-full object-cover" />
      </div>
      
      {/* Overlapping smaller image - top right */}
      <div className="absolute top-12 right-0 w-40 h-40 aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-100 to-blue-100 transform hover:scale-105 transition-all duration-300 z-20">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdvI07zqvyF3OIEnHy8_NkwqAJwNyQqencDQ&s" alt="Team mockup" className="w-full h-full object-cover" />
      </div>
      
      {/* Behind image - bottom left */}
      <div className="absolute bottom-8 left-0 w-48 h-36 aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 transform hover:scale-105 transition-all duration-300 z-5">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbYIU57Ku_OOZX35PET37vlrbWwK523PWucS_HtzRpzVS1Whhp3jmP8oWQrCwk01LpdnY&usqp=CAU" alt="Handshake mockup" className="w-full h-full object-cover" />
      </div>

      {/* Small overlapping element - center right */}
      <div className="absolute bottom-10 right-0 w-28 h-28 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100 transform hover:scale-105 transition-all duration-300 z-15">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJDvA0YvksMaX2UmRFoo94UZ0Lm0O8QJHu3g&s" alt="Chart mockup" className="w-full h-full object-cover" />
      </div>

      {/* Connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-1">
        <line x1="20%" y1="50%" x2="70%" y2="30%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" opacity="0.3">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="2s" repeatCount="indefinite" />
        </line>
        <line x1="60%" y1="70%" x2="85%" y2="45%" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="5,5" opacity="0.2">
          <animate attributeName="stroke-dashoffset" values="0;-10" dur="3s" repeatCount="indefinite" />
        </line>
      </svg>
    </div>
  </div>;

// Marketing Section Layout with complex overlapping
const MarketingSection = ({
  isVisible
}: {
  isVisible: boolean;
}) => <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`}>
    <div className="relative h-[500px] w-full">
      {/* Main large image - slightly off-center */}
      <div className="absolute top-8 left-8 w-72 h-48 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-pink-100 to-red-100 transform hover:scale-105 transition-all duration-500 z-10">
        <img src="https://www.sundaytimes.lk/200920/uploads/Sagara-1793.jpg" alt="Marketing mockup" className="w-full h-full object-cover" />
      </div>
      
      {/* Overlapping social element - partially over main image */}
      <div className="absolute top-20 right-4 w-44 h-32 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-cyan-100 transform hover:scale-105 transition-all duration-300 z-20">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdrjXrBDVIcGQSoWENPRfhjZ1LEkp2Exf69Q&s" alt="Social media mockup" className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2 bg-blue-600 rounded p-1">
          
        </div>
      </div>

      {/* Behind element - bottom right */}
      <div className="absolute bottom-4 right-0 w-56 h-40 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-orange-100 to-yellow-100 transform hover:scale-105 transition-all duration-300 z-5">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9P-9yYnfWfHO9tfh4oQC3CaqISJIgbWBq5w&s" alt="Analytics mockup" className="w-full h-full object-cover" />
      </div>

      {/* Small circular element - floating */}
      <div className="absolute bottom-32 left-4 w-24 h-24 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-indigo-100 transform hover:scale-105 transition-all duration-300 z-15">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGpd-PyxOsrFKxk3CKiXRnQ96UJ9jq3qcrLQ&s" alt="Profile mockup" className="w-full h-full object-cover" />
      </div>
    </div>
  </div>;

// Educators Section Layout with stacked overlapping
const EducatorsSection = ({
  isVisible
}: {
  isVisible: boolean;
}) => <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`}>
    <div className="relative h-[500px] w-full">
      {/* School building - back element */}
      <div className="absolute top-4 left-0 w-64 h-44 aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-teal-100 transform hover:scale-105 transition-all duration-500 z-5">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="School mockup" className="w-full h-full object-cover" />
      </div>
      
      {/* Teacher element - overlapping */}
      <div className="absolute top-16 right-8 w-52 h-36 aspect-video rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-indigo-100 transform hover:scale-105 transition-all duration-300 z-20">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Education mockup" className="w-full h-full object-cover" />
      </div>

      {/* Student element - bottom overlap */}
      <div className="absolute bottom-8 left-16 w-48 h-32 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100 transform hover:scale-105 transition-all duration-300 z-15">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Student mockup" className="w-full h-full object-cover" />
      </div>

      {/* Book element - floating top right */}
      <div className="absolute top-0 right-0 w-32 h-24 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-red-100 to-pink-100 transform hover:scale-105 transition-all duration-300 z-10">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Book mockup" className="w-full h-full object-cover" />
      </div>

      {/* Educational badge */}
      
    </div>
  </div>;

// Localization Section Layout with scattered positioning
const LocalizationSection = ({
  isVisible
}: {
  isVisible: boolean;
}) => <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`}>
    <div className="relative h-[500px] w-full">
      {/* Main content - center left */}
      <div className="absolute top-12 left-4 w-76 h-48 aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-green-100 to-blue-100 transform hover:scale-105 transition-all duration-500 z-10">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Localization mockup" className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 w-12 h-8 rounded overflow-hidden shadow-md">
          
        </div>
      </div>

      {/* Translation element - overlapping right */}
      <div className="absolute top-8 right-0 w-40 h-40 aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-pink-100 transform hover:scale-105 transition-all duration-300 z-20">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Translation mockup" className="w-full h-full object-cover" />
      </div>

      {/* Global element - behind bottom */}
      <div className="absolute bottom-4 left-8 w-52 h-36 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-cyan-100 to-blue-100 transform hover:scale-105 transition-all duration-300 z-5">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Global mockup" className="w-full h-full object-cover" />
      </div>

      {/* Language selector - floating */}
      <div className="absolute bottom-16 right-12 w-28 h-20 rounded-lg overflow-hidden shadow-lg bg-gradient-to-br from-indigo-100 to-purple-100 transform hover:scale-105 transition-all duration-300 z-15">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Language mockup" className="w-full h-full object-cover" />
      </div>
    </div>
  </div>;

// eCommerce Section Layout with product showcase overlapping
const ECommerceSection = ({
  isVisible
}: {
  isVisible: boolean;
}) => <div className={`${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`}>
    <div className="relative h-[500px] w-full">
      {/* Product 1 - back left */}
      <div className="absolute top-8 left-0 w-44 h-44 aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-purple-100 to-blue-100 transform hover:scale-105 transition-all duration-300 z-5">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Product 1 mockup" className="w-full h-full object-cover" />
      </div>

      {/* Main product showcase - overlapping center */}
      <div className="absolute top-16 left-20 w-72 h-52 aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-orange-100 to-red-100 transform hover:scale-105 transition-all duration-500 z-15">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="eCommerce mockup" className="w-full h-full object-cover" />
      </div>

      {/* Product 2 - overlapping right */}
      <div className="absolute top-4 right-4 w-36 h-36 aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-pink-100 to-purple-100 transform hover:scale-105 transition-all duration-300 z-20">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Product 2 mockup" className="w-full h-full object-cover" />
      </div>

      {/* Cart element - bottom right overlap */}
      <div className="absolute bottom-8 right-0 w-48 h-32 rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-green-100 to-teal-100 transform hover:scale-105 transition-all duration-300 z-10">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Cart mockup" className="w-full h-full object-cover" />
      </div>

      {/* Small product - floating bottom left */}
      <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full overflow-hidden shadow-lg bg-gradient-to-br from-yellow-100 to-orange-100 transform hover:scale-105 transition-all duration-300 z-25">
        <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Sunflower_from_Silesia2.jpg" alt="Featured product" className="w-full h-full object-cover" />
      </div>

      {/* Shopping cart overlay */}
      
    </div>
  </div>;
interface SectionProps {
  title: string;
  description: string;
  isReversed?: boolean;
  delay?: number;
  layoutType: 'business' | 'marketing' | 'educators' | 'localization' | 'ecommerce';
}
const AnimatedSection = ({
  title,
  description,
  isReversed = false,
  delay = 0,
  layoutType
}: SectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          setIsVisible(true);
        }, delay);
      }
    }, {
      threshold: 0.3
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, [delay]);
  const renderLayout = () => {
    switch (layoutType) {
      case 'business':
        return <BusinessSection isVisible={isVisible} />;
      case 'marketing':
        return <MarketingSection isVisible={isVisible} />;
      case 'educators':
        return <EducatorsSection isVisible={isVisible} />;
      case 'localization':
        return <LocalizationSection isVisible={isVisible} />;
      case 'ecommerce':
        return <ECommerceSection isVisible={isVisible} />;
      default:
        return <BusinessSection isVisible={isVisible} />;
    }
  };
  return <section ref={sectionRef} className="min-h-screen bg-background flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center ${isReversed ? 'lg:grid-flow-col-dense' : ''}`}>
          
          {/* Images Section */}
          <div className={`${isReversed ? 'lg:col-start-2' : 'lg:col-start-1'}`}>
            {renderLayout()}
          </div>

          {/* Content Section */}
          <div className={`${isReversed ? 'lg:col-start-1' : 'lg:col-start-2'} space-y-6 ${isVisible ? 'animate-fade-in' : 'opacity-0'} transition-all duration-1000`} style={{
          animationDelay: '600ms'
        }}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              {title}
            </h2>
            
            <div className="text-lg text-muted-foreground leading-relaxed">
              <p>{description}</p>
            </div>

            
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 ${isReversed ? 'left-10' : 'right-10'} w-32 h-32 bg-gradient-to-br from-purple-200/20 to-blue-200/20 rounded-full blur-3xl ${isVisible ? 'animate-pulse' : ''}`}></div>
        <div className={`absolute bottom-1/4 ${isReversed ? 'right-20' : 'left-20'} w-24 h-24 bg-gradient-to-br from-pink-200/20 to-orange-200/20 rounded-full blur-2xl ${isVisible ? 'animate-pulse' : ''}`} style={{
        animationDelay: '1s'
      }}></div>
      </div>
    </section>;
};
const TextToVideoSections = () => {
  const sections = [{
    title: "AI-Powered LMS in Messaging Apps",
    description: "For the first time in Sri Lanka, empower students, parents, and educational teams with instant LMS access via WhatsApp and Telegram bots. Receive real-time notifications, updates on causes, and AI-powered assistance directly on your favorite messaging platform. Perfect for academic communities looking to stay connected and engaged without needing to access a separate portal.",
    isReversed: false,
    delay: 0,
    layoutType: 'business' as const
  }, {
    title: "Revolutionizing Education",
    description: "Transform traditional learning with innovative digital solutions. Create engaging educational content and interactive learning experiences that enhance student participation and academic success.",
    isReversed: true,
    delay: 50,
    layoutType: 'marketing' as const
  }];
  return <div className="bg-background">
      {sections.map((section, index) => <AnimatedSection key={index} title={section.title} description={section.description} isReversed={section.isReversed} delay={section.delay} layoutType={section.layoutType} />)}
    </div>;
};
export default TextToVideoSections;