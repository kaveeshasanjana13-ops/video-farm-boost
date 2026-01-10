import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Menu, X } from 'lucide-react';
import logo from '@/assets/logo.png';

const navLinks = [
  { name: 'Work', href: '#work' },
  { name: 'Showreel', href: '#showreel' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate nav on load
    gsap.fromTo(
      '.nav-item',
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, stagger: 0.1, delay: 1.2, duration: 0.6 }
    );
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-background/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="nav-item flex items-center gap-3 text-foreground hover:text-primary transition-colors"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src={logo} alt="Kapila Sugath" className="w-8 h-8 object-contain" />
            <span className="text-lg font-display font-light tracking-wider">KS</span>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(link.href)}
                className="nav-item text-sm uppercase tracking-[0.2em] font-body text-foreground/70 hover:text-primary link-underline transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden nav-item text-foreground p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-background transition-transform duration-500 md:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, index) => (
            <button
              key={index}
              onClick={() => scrollToSection(link.href)}
              className="text-3xl font-display font-light text-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
