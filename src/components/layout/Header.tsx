
import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import surakshaLogo from '@/assets/suraksha-logo.png';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import SafeImage from '@/components/ui/SafeImage';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { notificationApiService } from '@/services/notificationApiService';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout, selectedInstitute, setSelectedInstitute, loadUserInstitutes } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [institutes, setInstitutes] = useState<any[]>([]);
  const [institutesLoaded, setInstitutesLoaded] = useState(false);

  // Map backend instituteUserType to display role
  const mapInstituteRoleToDisplayRole = (raw?: string) => {
    switch (raw) {
      case 'INSTITUTE_ADMIN':
        return 'InstituteAdmin';
      case 'STUDENT':
        return 'Student';
      case 'TEACHER':
        return 'Teacher';
      case 'ATTENDANCE_MARKER':
        return 'AttendanceMarker';
      case 'PARENT':
        return 'Parent';
      case 'ORGANIZATION_MANAGER':
        return 'OrganizationManager';
      default:
        return undefined;
    }
  };

  // Display role: use institute-specific role if available, otherwise global role
  const displayRole = selectedInstitute?.userRole 
    ? mapInstituteRoleToDisplayRole(selectedInstitute.userRole) || mapInstituteRoleToDisplayRole(selectedInstitute.instituteUserType)
    : user?.role;

  const [instituteAvatarUrl, setInstituteAvatarUrl] = useState<string>('');

  React.useEffect(() => {
    let cancelled = false;
    
    const load = async () => {
      try {
        if (!selectedInstitute?.id) { 
          setInstituteAvatarUrl(''); 
          return; 
        }
        
        const resp = await enhancedCachedClient.get<any>(
          `/institute-users/institute/${selectedInstitute.id}/me`,
          {},
          { ttl: 300, forceRefresh: false, userId: selectedInstitute.id }
        );
        if (!cancelled) {
          setInstituteAvatarUrl(resp?.instituteUserImageUrl || '');
        }
      } catch (err: any) {
        if (cancelled) return;
        // On rate limit or error, just keep existing avatar or clear it
        console.warn('Failed to load institute avatar:', err?.message);
        if (err?.message?.includes('Too many requests')) {
          return;
        }
        setInstituteAvatarUrl('');
      }
    };
    load();
    
    return () => { cancelled = true; };
  }, [selectedInstitute?.id]);

  // Load unread notification count once on mount
  React.useEffect(() => {
    const loadUnread = async () => {
      try {
        if (selectedInstitute?.id) {
          const result = await notificationApiService.getInstituteUnreadCount(selectedInstitute.id);
          setUnreadCount(result.unreadCount || 0);
        } else {
          const result = await notificationApiService.getSystemUnreadCount();
          setUnreadCount(result.unreadCount || 0);
        }
      } catch { /* silent */ }
    };
    loadUnread();
  }, [selectedInstitute?.id]);

  // Load institutes for switcher
  const loadInstitutes = async () => {
    if (institutesLoaded) return;
    try {
      const data = await loadUserInstitutes();
      setInstitutes(data);
      setInstitutesLoaded(true);
    } catch { /* silent */ }
  };

  const handleSwitchInstitute = (inst: any) => {
    setSelectedInstitute(inst);
    // Navigate to same page but with new institute
    const path = location.pathname;
    const match = path.match(/^\/institute\/[^/]+\/(.*)$/);
    if (match) {
      navigate(`/institute/${inst.id}/${match[1]}`);
    } else {
      navigate(`/institute/${inst.id}/dashboard`);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Avatar image priority: institute user image → user profile image → fallback
  const avatarImageUrl = instituteAvatarUrl 
    ? getImageUrl(instituteAvatarUrl) 
    : (user?.imageUrl ? getImageUrl(user.imageUrl) : '');

  return (
    <header className="lg:hidden bg-background border-b border-border px-3 sm:px-4 py-3 sm:py-4 sticky top-0 z-40 pt-safe-top">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Institute Switcher Dropdown */}
          <DropdownMenu onOpenChange={(open) => { if (open) loadInstitutes(); }}>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 focus:outline-none hover:bg-muted/50 rounded-lg px-1 py-1 transition-colors">
                <SafeImage 
                  src={selectedInstitute?.logo || surakshaLogo} 
                  alt={selectedInstitute?.shortName ? "Institute logo" : "SurakshaLMS logo"}
                  className="h-9 w-9 object-contain rounded-lg shrink-0"
                />
                <div className="flex flex-col items-start min-w-0">
                  <h1 className="text-sm font-semibold text-foreground truncate leading-tight max-w-[140px]">
                    {selectedInstitute?.shortName || 'SurakshaLMS'}
                  </h1>
                  <span className="text-[10px] text-muted-foreground leading-tight truncate max-w-[140px]">
                    {selectedInstitute?.type || displayRole || ''}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 z-50 max-h-72 overflow-y-auto">
              {!institutesLoaded ? (
                <div className="p-3 text-center text-xs text-muted-foreground">Loading...</div>
              ) : institutes.length === 0 ? (
                <div className="p-3 text-center text-xs text-muted-foreground">No institutes</div>
              ) : (
                institutes.map((inst) => (
                  <DropdownMenuItem
                    key={inst.id}
                    onClick={() => handleSwitchInstitute(inst)}
                    className={`cursor-pointer flex items-center gap-2.5 py-2.5 ${selectedInstitute?.id === inst.id ? 'bg-primary/10' : ''}`}
                  >
                    <SafeImage 
                      src={inst.logo || surakshaLogo}
                      alt={inst.shortName || inst.name}
                      className="h-7 w-7 object-contain rounded shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-medium truncate">{inst.shortName || inst.name}</span>
                      {inst.type && <span className="text-[10px] text-muted-foreground">{inst.type}</span>}
                    </div>
                    {selectedInstitute?.id === inst.id && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <button
            onClick={() => {
              if (selectedInstitute?.id) {
                navigate(`/institute/${selectedInstitute.id}/notifications`);
              } else {
                navigate('/notifications');
              }
            }}
            className="relative p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold px-1">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none rounded-full">
                <Avatar className="h-10 w-10 border-2 border-border cursor-pointer">
                  {avatarImageUrl && (
                    <AvatarImage 
                      src={avatarImageUrl}
                      alt={user?.name}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="bg-muted text-xs">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer text-xs">
                <User className="h-3.5 w-3.5 mr-2" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-xs text-destructive">
                <LogOut className="h-3.5 w-3.5 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
