import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoSlider from './VideoSlider';

gsap.registerPlugin(ScrollTrigger);

const ShowreelSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate content on scroll into view
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Parallax effect on content
      gsap.to(contentRef.current, {
        y: -30,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-background overflow-hidden py-20"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal to-background">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,_hsl(35_90%_55%_/_0.1),_transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,_hsl(35_80%_45%_/_0.08),_transparent_50%)]" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 flex flex-col items-center justify-center h-full px-6"
      >
        <span className="text-primary text-sm uppercase tracking-[0.3em] font-body mb-6">
          Featured Work
        </span>
        <h2 className="text-section-title text-foreground mb-4 text-center">
          Video Portfolio
        </h2>
        <p className="text-lg text-muted-foreground font-body max-w-xl mb-12 text-center">
          A curated collection of my finest cinematographic work spanning features,
          commercials, and documentary projects.
        </p>

        {/* Video Slider */}
        <VideoSlider />
      </div>
    </section>
  );
};

export default ShowreelSection;
