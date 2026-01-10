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

      {/* Hero Section */}
      <section className="relative">
        <HeroSection />
      </section>

      {/* Horizontal Gallery */}
      <section id="work" className="relative bg-background">
        <HorizontalGallery />
      </section>

      {/* Video Section */}
      <section id="video" className="relative bg-background">
        <ShowreelSection />
      </section>

      {/* Portfolio Grid */}
      <section className="relative bg-background">
        <PortfolioGrid />
      </section>

      {/* About Section */}
      <section id="about" className="relative bg-background">
        <AboutSection />
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative bg-background">
        <ContactSection />
      </section>

      {/* Footer */}
      <section className="relative bg-background">
        <Footer />
      </section>
    </div>
  );
};

export default Index;
