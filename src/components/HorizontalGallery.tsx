import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';

gsap.registerPlugin(ScrollTrigger);

const portfolioImages = [
  { src: portfolio1, title: 'Golden Hour', category: 'Drama' },
  { src: portfolio2, title: 'Desert Highway', category: 'Documentary' },
  { src: portfolio3, title: 'Neon Streets', category: 'Thriller' },
  { src: portfolio4, title: 'Behind the Lens', category: 'BTS' },
  { src: portfolio5, title: 'Mountain Dawn', category: 'Nature' },
];

const HorizontalGallery = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple entrance animation for images
    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('.portfolio-item');
      if (items) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-background flex flex-col">
      {/* Section Title */}
      <div className="py-16 md:py-24 px-6 md:px-12 lg:px-24">
        <span className="text-primary text-sm uppercase tracking-[0.3em] font-body mb-4 block">
          Selected Works
        </span>
        <h2 className="text-section-title text-foreground">
          Visual Stories
        </h2>
      </div>

      {/* Horizontal Scrollable Gallery */}
      <div ref={triggerRef} className="flex-1 overflow-x-auto overflow-y-hidden pb-12">
        <div
          ref={containerRef}
          className="flex items-stretch h-full gap-6 md:gap-8 px-6 md:px-12 lg:px-24"
          style={{ width: 'max-content' }}
        >
          {portfolioImages.map((item, index) => (
            <div
              key={index}
              className="portfolio-item relative flex-shrink-0 h-[50vh] md:h-[60vh] w-[70vw] md:w-[45vw] lg:w-[30vw] rounded-lg overflow-hidden group"
            >
              <img
                src={item.src}
                alt={item.title}
                className="gallery-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <span className="text-xs uppercase tracking-[0.2em] text-primary/80 font-body">
                  {item.category}
                </span>
                <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-light text-foreground mt-1">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HorizontalGallery;
