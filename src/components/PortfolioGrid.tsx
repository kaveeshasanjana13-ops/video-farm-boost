import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import portfolio1 from '@/assets/portfolio-1.jpg';
import portfolio2 from '@/assets/portfolio-2.jpg';
import portfolio3 from '@/assets/portfolio-3.jpg';
import portfolio4 from '@/assets/portfolio-4.jpg';
import portfolio5 from '@/assets/portfolio-5.jpg';

gsap.registerPlugin(ScrollTrigger);

const portfolioItems = [
  { src: portfolio1, title: 'The Last Light', category: 'Feature Film', year: '2024' },
  { src: portfolio2, title: 'Road to Nowhere', category: 'Music Video', year: '2023' },
  { src: portfolio3, title: 'Midnight City', category: 'Commercial', year: '2023' },
  { src: portfolio4, title: 'In Focus', category: 'Documentary', year: '2024' },
  { src: portfolio5, title: 'Above the Clouds', category: 'Feature Film', year: '2022' },
  { src: portfolio2, title: 'Echoes', category: 'Short Film', year: '2023' },
];

const PortfolioGrid = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gridRef.current?.querySelectorAll('.grid-item');
      if (!items) return;

      items.forEach((item, index) => {
        gsap.fromTo(
          item,
          {
            opacity: 0,
            y: 80,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
            delay: (index % 3) * 0.1,
          }
        );
      });

      // Title animation
      gsap.fromTo(
        '.portfolio-title',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12 lg:px-24 bg-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="portfolio-title mb-20">
          <span className="text-primary text-sm uppercase tracking-[0.3em] font-body mb-4 block">
            Portfolio
          </span>
          <h2 className="text-section-title text-foreground">
            Featured Projects
          </h2>
        </div>

        {/* Asymmetric Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {portfolioItems.map((item, index) => (
            <div
              key={index}
              className={`grid-item portfolio-item relative overflow-hidden rounded-lg ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              } ${index === 3 ? 'lg:col-span-2' : ''}`}
            >
              <div
                className={`relative ${
                  index === 0 ? 'aspect-[4/3] md:aspect-[16/10]' : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs uppercase tracking-[0.15em] text-primary font-body">
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground font-body">
                        {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-display font-light text-foreground">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioGrid;
