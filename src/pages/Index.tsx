import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import LoadingScreen from '@/components/LoadingScreen';
import Navigation from '@/components/Navigation';
import ScrollProgress from '@/components/ScrollProgress';
import HeroSection from '@/components/HeroSection';
import HorizontalGallery from '@/components/HorizontalGallery';
import ShowreelSection from '@/components/ShowreelSection';
import PortfolioGrid from '@/components/PortfolioGrid';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (!isLoading) {
      // Smooth scroll behavior
      ScrollTrigger.defaults({
        toggleActions: 'play none none reverse',
      });

      // Refresh ScrollTrigger on load
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <div className="relative bg-background text-foreground">
      {/* Film grain overlay */}
      <div className="film-grain" />
      
      {/* Vignette effect */}
      <div className="vignette" />

      {/* Navigation */}
      <Navigation />

      {/* Scroll Progress */}
      <ScrollProgress />

      {/* Hero Section - First slide */}
      <section className="sticky top-0 z-[1]">
        <HeroSection />
      </section>

      {/* Horizontal Gallery - Second slide */}
      <section id="work" className="sticky top-0 z-[2] bg-background">
        <HorizontalGallery />
      </section>

      {/* Video Section - Third slide */}
      <section id="video" className="sticky top-0 z-[3] bg-background">
        <ShowreelSection />
      </section>

      {/* Portfolio Grid - Fourth slide */}
      <section className="sticky top-0 z-[4] bg-background">
        <PortfolioGrid />
      </section>

      {/* About Section - Fifth slide */}
      <section id="about" className="sticky top-0 z-[5] bg-background">
        <AboutSection />
      </section>

      {/* Contact Section - Sixth slide */}
      <section id="contact" className="sticky top-0 z-[6] bg-background">
        <ContactSection />
      </section>

      {/* Footer - Last slide - relative to break sticky chain */}
      <section className="relative z-[8] bg-background">
        <Footer />
      </section>
    </div>
  );
};

export default Index;
