import { useState, useEffect, useCallback } from 'react';

export function useViewMode() {
  const [viewMode, setViewModeState] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });

  useEffect(() => {
    const handleViewModeChange = (e: Event) => {
      const mode = (e as CustomEvent<'card' | 'table'>).detail;
      if (mode === 'card' || mode === 'table') {
        setViewModeState(mode);
      }
    };

    const handleStorageChange = () => {
      const mode = (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
      setViewModeState(mode);
    };

    window.addEventListener('viewModeChange', handleViewModeChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('viewModeChange', handleViewModeChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setViewMode = useCallback((mode: 'card' | 'table') => {
    setViewModeState(mode);
    localStorage.setItem('viewMode', mode);
    window.dispatchEvent(new CustomEvent('viewModeChange', { detail: mode }));
  }, []);

  return { viewMode, setViewMode } as const;
}
