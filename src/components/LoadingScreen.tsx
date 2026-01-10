import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import logo from '@/assets/logo.png';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate logo entrance
    gsap.fromTo(
      '.loading-logo',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
    );

    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    // Complete loading after animation
    const timer = setTimeout(() => {
      gsap.to('.loading-screen', {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          onLoadingComplete();
        },
      });
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen fixed inset-0 z-[100] bg-background text-foreground flex flex-col items-center justify-center">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.12) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.12) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>

      {/* Glow effects */}
      <div className="absolute w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse" />

      {/* Logo with rotation animation */}
      <div className="loading-logo relative z-10 mb-8">
        <div className="relative">
          <img
            src={logo}
            alt="Kapila Sugath Logo"
            className="w-40 h-40 md:w-48 md:h-48 object-contain animate-pulse"
          />
          {/* Rotating ring around logo */}
          <div
            className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin"
            style={{ animationDuration: '8s' }}
          />
          <div
            className="absolute inset-[-8px] border border-primary/20 rounded-full animate-spin"
            style={{ animationDuration: '12s', animationDirection: 'reverse' }}
          />
        </div>
      </div>

      {/* Brand Name */}
      <h1 className="loading-logo text-3xl md:text-4xl font-display font-bold text-foreground mb-2 tracking-wider">
        KAPILA <span className="text-primary">SUGATH</span>
      </h1>
      <p className="loading-logo text-sm text-muted-foreground tracking-[0.3em] uppercase mb-12">
        Camera Director / Cinematographer
      </p>

      {/* Progress Bar */}
      <div className="loading-logo w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Progress Text */}
      <span className="loading-logo mt-4 text-xs text-muted-foreground font-mono">
        {progress}%
      </span>

      {/* Scan lines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--primary) / 0.12) 2px, hsl(var(--primary) / 0.12) 4px)',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
