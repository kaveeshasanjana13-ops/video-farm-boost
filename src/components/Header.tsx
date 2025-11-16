import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { AnimeNavbar } from '@/components/ui/anime-navbar';
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
      // If already on home page, just scroll to section
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    // If not on home page, Link component will handle navigation to /#section
  };
  return <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ContentFarm
            </Link>
          </div>
          
          <AnimeNavbar 
            className="hidden md:block"
            items={[
              { name: 'Services', href: '/#services', onClick: () => handleSectionNavigation('#services') },
              { name: 'How It Works', href: '/#how-it-works', onClick: () => handleSectionNavigation('#how-it-works') },
              { name: 'Product Demo Videos', href: '/product-demo-videos' },
              { name: 'Case Study', href: '/case-studies' },
              { name: 'Shorts', href: '/shorts' },
              { name: 'Video Production', href: '/video-production' },
              { name: 'Script Generator', href: '/youtube-script-generator' },
              { name: 'About', href: '/about' }
            ]}
          />

          <div className="hidden md:flex items-center space-x-4">
            <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Get Quote
              </Button>
            </a>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 hover:text-blue-600">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              <Link to="/#services" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => handleSectionNavigation('#services')}>
                Services
              </Link>
              <Link to="/#how-it-works" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => handleSectionNavigation('#how-it-works')}>
                How It Works
              </Link>
              <Link to="/product-demo-videos" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Product Demo Videos</Link>
              <Link to="/case-studies" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Case Study</Link>
              <Link to="/shorts" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Shorts</Link>
              <Link to="/video-production" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Video Production</Link>
              <Link to="/youtube-script-generator" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Script Generator</Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
              <div className="flex flex-col space-y-2 pt-4">
                <a href="https://calendly.com/kvit/15-minutes-discovery-call" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full">
                    Get Quote
                  </Button>
                </a>
              </div>
            </div>
          </div>}
      </div>
    </header>;
};
export default Header;
