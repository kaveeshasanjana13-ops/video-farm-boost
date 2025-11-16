import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Only scroll to top if it's not a hash navigation (fragment identifier)
    if (!location.hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname, location.key]); // Include location.key to detect same-page navigations

  return null;
};

export default ScrollToTop;