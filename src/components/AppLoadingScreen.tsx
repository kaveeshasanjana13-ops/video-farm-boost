import React from 'react';
import appIcon from '@/assets/app-icon.png';

interface AppLoadingScreenProps {
  message?: string;
}

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center space-y-5">
        {/* Branded logo with ping animation */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-2xl bg-primary/15 animate-ping" style={{ animationDuration: '2s' }} />
          <img
            src={appIcon}
            alt="App Logo"
            className="relative w-20 h-20 rounded-2xl shadow-lg object-cover"
          />
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden mx-auto">
          <div 
            className="h-full bg-primary rounded-full"
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
