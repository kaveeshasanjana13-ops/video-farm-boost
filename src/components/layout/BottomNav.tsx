import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, Bell, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  onMenuClick: () => void;
}

const BottomNav = ({ onMenuClick }: BottomNavProps) => {
  const { selectedInstitute } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = useCallback((path: string) => {
    if (path === '/dashboard' || path === '/select-institute') {
      return location.pathname === '/dashboard' || location.pathname === '/select-institute' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const handleHomeClick = useCallback(() => {
    if (selectedInstitute?.id) {
      navigate(`/institute/${selectedInstitute.id}/dashboard`);
    } else {
      navigate('/dashboard');
    }
  }, [selectedInstitute?.id, navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const handleNotificationsClick = useCallback(() => {
    if (selectedInstitute?.id) {
      navigate(`/institute/${selectedInstitute.id}/notifications`);
    } else {
      navigate('/notifications');
    }
  }, [selectedInstitute?.id, navigate]);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe-bottom">
      <div className="flex items-center justify-around h-14">
        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
            isActive('/dashboard') || (selectedInstitute && isActive(`/institute/${selectedInstitute.id}/dashboard`))
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotificationsClick}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
            isActive('/notifications')
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Bell className="h-5 w-5" />
          <span className="text-[10px] font-medium">Alerts</span>
        </button>

        {/* Profile */}
        <button
          onClick={handleProfileClick}
          className={cn(
            "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
            isActive('/profile')
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <User className="h-5 w-5" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>

        {/* Menu (Sidebar) - opens from right */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center flex-1 h-full gap-0.5 text-muted-foreground transition-colors"
        >
          <Menu className="h-5 w-5" />
          <span className="text-[10px] font-medium">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
