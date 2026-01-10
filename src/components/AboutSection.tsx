import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Film, Camera, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { icon: Film, value: '50+', label: 'Projects' },
  { icon: Award, value: '12', label: 'Awards' },
  { icon: Camera, value: '15', label: 'Years Experience' },
  { icon: Users, value: '100+', label: 'Collaborations' },
];

const credits = [
  'Sikuru Hathe — Comedy Film',
  'Suriya Arana — Drama/Family',
  'Uthuru Sulaga — Drama/Romance',
  'Mr.Mrs — Comedy',
  'Sathya — Teledrama',
  'Babarek Awith — Teledrama',
  'Amma — Teledrama',
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const creditsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text reveal animation
      const words = textRef.current?.querySelectorAll('.reveal-word');
      if (words) {
        words.forEach((word, index) => {
          gsap.fromTo(
            word,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: word,
                start: 'top 85%',
              },
              delay: index * 0.05,
            }
          );
        });
      }

      // Stats animation
      const statItems = statsRef.current?.querySelectorAll('.stat-item');
      if (statItems) {
        statItems.forEach((item, index) => {
          gsap.fromTo(
            item,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              scrollTrigger: {
                trigger: statsRef.current,
                start: 'top 80%',
              },
              delay: index * 0.1,
            }
          );
        });
      }

      // Credits list animation
      const creditItems = creditsRef.current?.querySelectorAll('.credit-item');
      if (creditItems) {
        creditItems.forEach((item, index) => {
          gsap.fromTo(
            item,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              scrollTrigger: {
                trigger: item,
                start: 'top 90%',
              },
              delay: index * 0.08,
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const bioText = `With over 15 years behind the camera, I've dedicated my career to crafting visual narratives that resonate deeply with audiences. From indie features to major commercial campaigns, my approach blends technical precision with artistic intuition. I believe every frame tells a story, and my mission is to make each one unforgettable.`;

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 md:px-12 lg:px-24 bg-background"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Bio */}
          <div>
            <span className="text-primary text-sm uppercase tracking-[0.3em] font-body mb-6 block">
              About
            </span>
            <h2 className="text-section-title text-foreground mb-12">
              The Vision Behind<br />the Lens
            </h2>

            <div ref={textRef} className="space-y-6">
              <p className="text-lg md:text-xl text-foreground/80 font-body leading-relaxed">
                {bioText.split(' ').map((word, index) => (
                  <span key={index} className="reveal-word inline-block mr-[0.3em]">
                    {word}
                  </span>
                ))}
              </p>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item text-center md:text-left">
                  <stat.icon className="w-6 h-6 text-primary mb-3 mx-auto md:mx-0" />
                  <div className="text-3xl md:text-4xl font-display font-light text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground font-body mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Credits */}
          <div className="lg:pt-20">
            <h3 className="text-2xl font-display font-light text-foreground mb-8">
              Selected Credits
            </h3>

            <div ref={creditsRef} className="space-y-4">
              {credits.map((credit, index) => (
                <div
                  key={index}
                  className="credit-item group py-4 border-b border-border hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <p className="text-lg font-body text-foreground/80 group-hover:text-foreground transition-colors">
                    {credit}
                  </p>
                </div>
              ))}
            </div>

            {/* Awards mention */}
            <div className="mt-12 p-6 card-cinematic rounded-lg">
              <div className="flex items-center gap-4">
                <Award className="w-8 h-8 text-primary" />
                <div>
                  <h4 className="font-display text-xl text-foreground">
                    Award-Winning Work
                  </h4>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    Cannes Lions • ASC Awards • BAFTA Nominated
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
