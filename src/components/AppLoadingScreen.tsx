import React from 'react';

interface AppLoadingScreenProps {
  message?: string;
}

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-4">
        {/* Animated logo/brand area */}
        <div className="relative mx-auto w-16 h-16">
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" style={{ animationDuration: '1.5s' }} />
          <div className="relative w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-primary rounded-full animate-pulse"
            style={{
              animation: 'loading-bar 1.2s ease-in-out infinite',
            }}
          />
        </div>

        <p className="text-sm text-muted-foreground font-medium">{message}</p>

        <style>{`
          @keyframes loading-bar {
            0% { width: 0%; margin-left: 0%; }
            50% { width: 60%; margin-left: 20%; }
            100% { width: 0%; margin-left: 100%; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
