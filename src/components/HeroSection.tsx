import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-cinematic.jpg';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial animations
      gsap.fromTo(
        imageRef.current,
        { scale: 1.2, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
      );

      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.5, ease: 'power3.out' }
      );

      gsap.fromTo(
        subtitleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'power3.out' }
      );

      gsap.fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, delay: 1.5 }
      );

      // Scroll animations - keep title and subtitle always visible
      gsap.to(titleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        y: -50,
        scale: 0.95,
      });

      gsap.to(subtitleRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: 1,
        },
        y: -30,
      });

      gsap.to(imageRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
        scale: 1.1,
        y: 100,
      });

      gsap.to(scrollIndicatorRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '10% top',
          end: '30% top',
          scrub: 1,
        },
        opacity: 0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image */}
      <div
        ref={imageRef}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 gradient-overlay" />
      <div className="absolute inset-0 z-10 bg-background/30" />

      {/* Content */}
      <div className="relative z-20 flex h-full flex-col items-center justify-center px-6">
        <h1
          ref={titleRef}
          className="text-hero text-foreground text-center mb-4"
        >
          KAPILA <span className="text-primary">SUGATH</span>
        </h1>
        <p
          ref={subtitleRef}
          className="text-lg md:text-2xl lg:text-3xl font-body font-light tracking-[0.3em] uppercase text-foreground/80"
        >
          Camera Director / Cinematographer
        </p>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs uppercase tracking-[0.25em] text-foreground/50 font-body">
          Scroll to explore
        </span>
        <ChevronDown className="w-5 h-5 text-primary animate-float" />
      </div>
    </section>
  );
};

export default HeroSection;
