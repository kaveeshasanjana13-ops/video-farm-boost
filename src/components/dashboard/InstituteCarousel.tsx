import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Building2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Institute } from '@/contexts/types/auth.types';

interface InstituteCarouselProps {
  onSelectInstitute: (institute: Institute) => void;
}

const InstituteCarousel: React.FC<InstituteCarouselProps> = ({ onSelectInstitute }) => {
  const { user, selectedInstitute, loadUserInstitutes } = useAuth();
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const isPaused = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await loadUserInstitutes();
        setInstitutes(data);
      } catch (e) {
        console.error('Failed to load institutes:', e);
        if (user?.institutes?.length) {
          setInstitutes(user.institutes);
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  // Auto-scroll one by one
  useEffect(() => {
    if (institutes.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayRef.current = setInterval(() => {
        if (!isPaused.current) {
          setActiveIndex(prev => (prev + 1) % institutes.length);
        }
      }, 3000);
    };

    startAutoPlay();
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [institutes]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    // Reset auto-play timer on manual navigation
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      if (!isPaused.current) {
        setActiveIndex(prev => (prev + 1) % institutes.length);
      }
    }, 3000);
  };

  const goPrev = () => goTo((activeIndex - 1 + institutes.length) % institutes.length);
  const goNext = () => goTo((activeIndex + 1) % institutes.length);

  if (loading) {
    return (
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 w-full rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (institutes.length === 0) return null;

  const inst = institutes[activeIndex];
  const isSelected = selectedInstitute?.id === inst.id;

  return (
    <div
      onMouseEnter={() => { isPaused.current = true; }}
      onMouseLeave={() => { isPaused.current = false; }}
      onTouchStart={() => { isPaused.current = true; }}
      onTouchEnd={() => { setTimeout(() => { isPaused.current = false; }, 2000); }}
    >
      {/* Arrow + Card row */}
      <div className="flex items-center gap-2">
        {/* Left Arrow */}
        {institutes.length > 1 && (
          <button
            onClick={goPrev}
            className="shrink-0 w-8 h-8 rounded-full bg-muted/80 backdrop-blur border border-border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-foreground" />
          </button>
        )}

        {/* Main Card */}
        <button
          onClick={() => onSelectInstitute(inst)}
          className={`
            flex-1 min-w-0 rounded-2xl p-5 text-left
            transition-all duration-500 ease-in-out
            border overflow-hidden
            ${isSelected
              ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/10'
              : 'bg-card border-border hover:border-primary/20 hover:shadow-md'
            }
          `}
        >
          <div className="flex items-center gap-4">
            {inst.logo ? (
              <img
                src={inst.logo}
                alt={inst.shortName || inst.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 ring-2 ring-background shadow-sm"
              />
            ) : (
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}>
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className={`text-base font-semibold truncate ${
                isSelected ? 'text-primary' : 'text-foreground'
              }`}>
                {inst.shortName || inst.name}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {inst.instituteUserType
                  ? inst.instituteUserType.replace(/_/g, ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())
                  : inst.type || 'Institute'}
              </p>
            </div>
            {isSelected && (
              <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 animate-pulse" />
            )}
          </div>
        </button>

        {/* Right Arrow */}
        {institutes.length > 1 && (
          <button
            onClick={goNext}
            className="shrink-0 w-8 h-8 rounded-full bg-muted/80 backdrop-blur border border-border shadow-sm flex items-center justify-center hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4 text-foreground" />
          </button>
        )}
      </div>

      {/* Dot Indicators */}
      {institutes.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {institutes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={`rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? 'w-5 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InstituteCarousel;
