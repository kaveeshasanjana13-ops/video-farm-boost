
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

interface HeaderProps {
  onMenuClick: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout, selectedInstitute } = useAuth();
  const navigate = useNavigate();

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
          <SafeImage 
            src={selectedInstitute?.logo || surakshaLogo} 
            alt={selectedInstitute?.shortName ? "Institute logo" : "SurakshaLMS logo"}
            className="h-10 w-10 object-contain rounded-lg"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground truncate leading-tight">
              {selectedInstitute?.shortName || 'SurakshaLMS'}
            </h1>
            {displayRole && (
              <span className="text-[11px] text-muted-foreground leading-tight">{displayRole}</span>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
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
