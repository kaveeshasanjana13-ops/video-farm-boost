import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
const ModernHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll for sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle scrolling to sections when navigating from other pages
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [location]);
  const handleSectionNavigation = (sectionId: string) => {
    setIsMenuOpen(false);
    if (location.pathname === '/') {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };
  const servicesItems = [{
    name: 'Product Demo Videos',
    href: '/product-demo-videos'
  }, {
    name: 'Shorts',
    href: '/shorts'
  }, {
    name: 'Video Production',
    href: '/video-production'
  }];
  const resourcesItems = [{
    name: 'Script Generator',
    href: '/youtube-script-generator'
  }, {
    name: 'Blog',
    href: '/blog'
  }];
  return <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b border-border/50' : 'bg-background/90 backdrop-blur-md border-b border-border/30'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold gradient-text hover:scale-105 transition-transform duration-300">
              ContentFarm
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors duration-200 font-medium focus:outline-none whitespace-nowrap">
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background/95 backdrop-blur-xl border border-border/50 shadow-xl">
                <DropdownMenuItem asChild>
                  <Link to="/shorts" className="w-full text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200">
                    Shorts
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/product-demo-videos" className="w-full text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200">
                    Product Demo Videos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/video-production" className="w-full text-foreground hover:text-primary hover:bg-accent/50 transition-colors duration-200">
                    Video Production
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/#how-it-works" onClick={() => handleSectionNavigation('#how-it-works')} className="text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap">
              How It Works
            </Link>

            <Link to="/case-studies" className="text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap">
              Case Study
            </Link>

            <Link to="/youtube-script-generator" className="text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap">
              Script Generator
            </Link>

            <Link to="/about" className="text-foreground hover:text-primary transition-colors duration-200 font-medium whitespace-nowrap">
              About
            </Link>

            
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/content-machine">
              <Button variant="outline" size="sm" className="font-semibold border-primary/50 text-primary hover:bg-primary/10 transition-all duration-500 hover:scale-110 animate-[premium-glow_3s_ease-in-out_infinite] hover:animate-none relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:animate-[shimmer_3s_ease-in-out_infinite] px-8">
                Creator-Led
              </Button>
            </Link>
            <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
              
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground hover:text-primary transition-colors duration-200 p-2" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
          <nav className="py-6 border-t border-border/30 space-y-4">
            <Link to="/" className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>

            {/* Mobile Services */}
            <div className="space-y-2">
              <div className="text-foreground font-medium py-2">Services</div>
              {servicesItems.map(item => <Link key={item.href} to={item.href} className="block text-muted-foreground hover:text-primary transition-colors duration-200 pl-4 py-1" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>)}
            </div>

            <Link to="/case-studies" className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Showcase
            </Link>
            
            <Link to="/#how-it-works" className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2" onClick={() => handleSectionNavigation('#how-it-works')}>
              How It Works
            </Link>

            {/* Mobile Resources */}
            <div className="space-y-2">
              <div className="text-foreground font-medium py-2">Resources</div>
              {resourcesItems.map(item => <Link key={item.href} to={item.href} className="block text-muted-foreground hover:text-primary transition-colors duration-200 pl-4 py-1" onClick={() => setIsMenuOpen(false)}>
                  {item.name}
                </Link>)}
            </div>

            <Link to="/about" className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>

            <Link to="/content-machine" className="block text-foreground hover:text-primary transition-colors duration-200 font-medium py-2" onClick={() => setIsMenuOpen(false)}>
              Creator-Led
            </Link>

            {/* Mobile CTAs */}
            <div className="pt-4 space-y-3">
              <Link to="/content-machine">
                <Button variant="outline" className="w-full font-semibold border-primary/50 text-primary hover:bg-primary/10 transition-all duration-500 hover:scale-110 animate-[premium-glow_3s_ease-in-out_infinite] hover:animate-none relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/20 before:to-transparent before:animate-[shimmer_3s_ease-in-out_infinite]" onClick={() => setIsMenuOpen(false)}>
                  Creator-Led
                </Button>
              </Link>
              <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
                <Button className="btn-gradient w-full font-semibold shadow-lg" onClick={() => setIsMenuOpen(false)}>
                  Get Quote
                </Button>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>;
};
export default ModernHeader;