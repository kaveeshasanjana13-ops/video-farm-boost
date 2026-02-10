
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import ProfileImageUpload from '@/components/ProfileImageUpload';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, MapPin, Calendar, Shield, Lock, Eye, EyeOff, Camera, Briefcase, GraduationCap, CreditCard, Languages, Monitor, Smartphone, Tablet, LogOut, ShieldAlert, RefreshCw, Link2 } from 'lucide-react';
import { getActiveSessions, revokeSession, revokeAllSessions } from '@/contexts/utils/auth.api';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import ConnectedApps from '@/components/ConnectedApps';

interface UserData {
  id: string;
  nameWithInitials: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: string;
  dateOfBirth: string;
  gender: string;
  nic: string;
  birthCertificateNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  occupation: string;
  workplace: string;
  workPhone: string;
  educationLevel: string;
  subscriptionPlan: string;
  language: string;
}

const InfoRow = ({ icon: Icon, label, value }: { icon?: React.ElementType; label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 py-3 border-b border-border/30 last:border-0">
    <div className="flex items-center gap-2 sm:w-36 shrink-0">
      {Icon && <Icon className="h-4 w-4 text-muted-foreground shrink-0" />}
      <span className="text-xs sm:text-sm text-muted-foreground">{label}</span>
    </div>
    <span className="text-sm font-medium text-foreground break-all pl-6 sm:pl-0">{value || '—'}</span>
  </div>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const instituteRole = useInstituteRole();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '', nameWithInitials: '', email: '', phone: '', dateOfBirth: '', gender: '',
    nic: '', birthCertificateNo: '', addressLine1: '', addressLine2: '', city: '',
    district: '', province: '', postalCode: '', country: '', joinDate: '',
    occupation: '', workplace: '', workPhone: '', educationLevel: '',
    subscriptionPlan: '', language: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState({
    currentPassword: false, newPassword: false, confirmNewPassword: false
  });
  const [activeProfileTab, setActiveProfileTab] = useState('details');
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);
  const [revokingAll, setRevokingAll] = useState(false);

  const loadSessions = async () => {
    setSessionsLoading(true);
    try {
      const data = await getActiveSessions({ sortBy: 'createdAt', sortOrder: 'DESC' });
      setSessions(Array.isArray(data.sessions) ? data.sessions : []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load active sessions', variant: 'destructive' });
    } finally {
      setSessionsLoading(false);
    }
  };

  const handleRevoke = async (sessionId: string) => {
    setRevoking(sessionId);
    try {
      await revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      toast({ title: 'Session revoked', description: 'The device has been logged out.' });
    } catch {
      toast({ title: 'Error', description: 'Failed to revoke session', variant: 'destructive' });
    } finally {
      setRevoking(null);
    }
  };

  const handleRevokeAll = async () => {
    setRevokingAll(true);
    try {
      await revokeAllSessions();
      toast({ title: 'All sessions revoked', description: 'Logging you out...' });
      setTimeout(() => logout(), 1500);
    } catch {
      toast({ title: 'Error', description: 'Failed to revoke all sessions', variant: 'destructive' });
      setRevokingAll(false);
    }
  };

  const parseUserAgent = (ua: string | null): { os: string; browser: string } => {
    if (!ua) return { os: 'Unknown', browser: '' };
    let os = 'Unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os/i.test(ua)) os = 'macOS';
    else if (/linux/i.test(ua) && !/android/i.test(ua)) os = 'Linux';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';

    let browser = '';
    if (/edg\//i.test(ua)) browser = 'Edge';
    else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = 'Opera';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/chrome/i.test(ua)) browser = 'Chrome';

    return { os, browser };
  };

  const getPlatformIcon = (platform: string, userAgent?: string | null) => {
    const iconClass = "h-6 w-6";
    // Platform-specific icons using SVG for Android/Apple/Windows
    if (platform === 'android') {
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.523 15.341a.667.667 0 0 0 .667-.667.667.667 0 0 0-.667-.667.667.667 0 0 0-.667.667.667.667 0 0 0 .667.667m-11.046 0a.667.667 0 0 0 .667-.667.667.667 0 0 0-.667-.667.667.667 0 0 0-.667.667.667.667 0 0 0 .667.667M17.928 10.807l1.847-3.2a.386.386 0 0 0-.142-.526.386.386 0 0 0-.526.142l-1.87 3.239a11.495 11.495 0 0 0-10.474 0l-1.87-3.24a.386.386 0 0 0-.526-.14.386.386 0 0 0-.142.526l1.847 3.2A10.633 10.633 0 0 0 1 20h22a10.633 10.633 0 0 0-5.072-9.193"/>
        </svg>
      );
    }
    if (platform === 'ios') {
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
        </svg>
      );
    }
    // Web: detect OS from userAgent
    const { os } = parseUserAgent(userAgent || null);
    if (os === 'Windows') {
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 12V6.5l8-1.1V12H3m9 0V5.3L21 3v9H12M3 13h8v6.6l-8-1.1V13m9 0h9v9l-9-1.7V13"/>
        </svg>
      );
    }
    if (os === 'macOS') {
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
        </svg>
      );
    }
    if (os === 'Linux') {
      return <Monitor className={iconClass} />;
    }
    // Default: browser/globe icon
    return (
      <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    );
  };

  const getDeviceLabel = (session: any): string => {
    if (session.deviceName) return session.deviceName;
    const { os, browser } = parseUserAgent(session.userAgent || null);
    if (session.platform === 'android') return os === 'Unknown' ? 'Android Device' : `${os} Device`;
    if (session.platform === 'ios') return 'iPhone / iPad';
    // Web: show OS + Browser
    const parts = [os !== 'Unknown' ? os : '', browser].filter(Boolean);
    return parts.length ? parts.join(' · ') : 'Web Browser';
  };

  const loadUserData = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get<{ success: boolean; data: any }>('/auth/me');
      if (response.success && response.data) {
        const d = response.data;
        const ud: UserData = {
          id: d.id || '', nameWithInitials: d.nameWithInitials || '',
          firstName: d.firstName || '', lastName: d.lastName || '',
          email: d.email || '', phone: d.phoneNumber || '',
          userType: d.userType || '', dateOfBirth: d.dateOfBirth || '',
          gender: d.gender || '', nic: d.nic || '',
          birthCertificateNo: d.birthCertificateNo || '',
          addressLine1: d.addressLine1 || '', addressLine2: d.addressLine2 || '',
          city: d.city || '', district: d.district || '',
          province: d.province || '', postalCode: d.postalCode || '',
          country: d.country || '', imageUrl: d.imageUrl || '',
          isActive: d.isActive ?? true, createdAt: d.createdAt || '',
          updatedAt: d.updatedAt || '', occupation: d.occupation || '',
          workplace: d.workplace || '', workPhone: d.workPhone || '',
          educationLevel: d.educationLevel || '',
          subscriptionPlan: d.subscriptionPlan || '', language: d.language || ''
        };
        setUserData(ud);
        setFormData({
          name: `${ud.firstName} ${ud.lastName}`.trim(),
          nameWithInitials: ud.nameWithInitials, email: ud.email, phone: ud.phone,
          dateOfBirth: ud.dateOfBirth, gender: ud.gender, nic: ud.nic,
          birthCertificateNo: ud.birthCertificateNo,
          addressLine1: ud.addressLine1, addressLine2: ud.addressLine2,
          city: ud.city, district: ud.district, province: ud.province,
          postalCode: ud.postalCode, country: ud.country,
          joinDate: ud.createdAt ? new Date(ud.createdAt).toLocaleDateString() : '',
          occupation: ud.occupation, workplace: ud.workplace,
          workPhone: ud.workPhone, educationLevel: ud.educationLevel,
          subscriptionPlan: ud.subscriptionPlan, language: ud.language
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({ title: "Error", description: "Failed to load profile data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUserData(); }, []);

  const handleImageUpdate = (newImageUrl: string) => {
    if (userData) setUserData({ ...userData, imageUrl: newImageUrl });
  };

  const validatePassword = (password: string): boolean => {
    if (password.length < 8 || password.length > 20) return false;
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password) && /[^A-Za-z0-9]/.test(password);
  };

  const handlePasswordChange = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
      toast({ title: "Error", description: "All password fields are required.", variant: "destructive" });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
      return;
    }
    if (!validatePassword(passwordData.newPassword)) {
      toast({ title: "Error", description: "Password must be 8-20 characters with uppercase, lowercase, number, and special character.", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_LMS_BASE_URL || 'https://lmsapi.suraksha.lk';
      const token = localStorage.getItem('access_token');
      if (!token) {
        toast({ title: "Error", description: "Please login again.", variant: "destructive" });
        await logout();
        return;
      }
      let response = await fetch(`${baseUrl}/v2/auth/change-password`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(passwordData)
      });
      if (response.status === 404) {
        response = await fetch(`${baseUrl}/auth/change-password`, {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(passwordData)
        });
      }
      const data = await response.json();
      if (response.ok && (data.success !== false || data.isSuccess || data.message === "Password changed successfully")) {
        toast({ title: "Success", description: "✅ Password changed! You will be logged out." });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(async () => { await logout(); }, 2000);
      } else {
        toast({ title: "Error", description: data.message || "Failed to change password.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to change password.", variant: "destructive" });
    } finally {
      setPasswordLoading(false);
    }
  };

  const currentImageUrl = userData?.imageUrl || '';
  const userTypeDisplay = userData?.userType || user?.userType || 'USER';
  const getUserInitials = () => {
    if (!user) return 'U';
    return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const langDisplay = formData.language === 'E' ? 'English' : formData.language === 'S' ? 'Sinhala' : formData.language;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Logout Button - Mobile */}
      <div className="lg:hidden">
        <Button
          variant="outline"
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 h-10 text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <Avatar className="h-24 w-24 ring-2 ring-border">
                <AvatarImage src={currentImageUrl} alt="Profile" />
                <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="secondary"
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full shadow-md"
                onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="change-photo"]')?.click()}
              >
                <Camera className="h-3.5 w-3.5" />
              </Button>
              <div className="hidden">
                <ProfileImageUpload currentImageUrl={currentImageUrl} onImageUpdate={handleImageUpdate} />
              </div>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-foreground">{formData.name || 'Welcome'}</h1>
              <p className="text-muted-foreground text-sm mt-1">{formData.email}</p>
              <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                <Badge variant="secondary" className="text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  {userTypeDisplay}
                </Badge>
                {formData.joinDate && (
                  <span className="text-xs text-muted-foreground">Joined {formData.joinDate}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeProfileTab} onValueChange={(val) => {
        setActiveProfileTab(val);
        if (val === 'devices' && sessions.length === 0) loadSessions();
      }}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="details" className="gap-1 text-xs sm:text-sm">
            <User className="h-4 w-4" /> <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="change-password" className="gap-1 text-xs sm:text-sm">
            <Lock className="h-4 w-4" /> <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="gap-1 text-xs sm:text-sm">
            <Monitor className="h-4 w-4" /> <span className="hidden sm:inline">Devices</span>
          </TabsTrigger>
          <TabsTrigger value="apps" className="gap-1 text-xs sm:text-sm">
            <Link2 className="h-4 w-4" /> <span className="hidden sm:inline">Apps</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          {/* Personal Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4 text-primary" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Name with Initials" value={formData.nameWithInitials} />
              <InfoRow label="Full Name" value={formData.name} />
              <InfoRow icon={Mail} label="Email" value={formData.email} />
              <InfoRow icon={Phone} label="Phone" value={formData.phone} />
              <InfoRow icon={Calendar} label="Date of Birth" value={formData.dateOfBirth} />
              <InfoRow label="Gender" value={formData.gender} />
              <InfoRow label="NIC" value={formData.nic} />
              <InfoRow label="Birth Cert. No" value={formData.birthCertificateNo} />
              <InfoRow icon={Shield} label="User Type" value={userTypeDisplay} />
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow label="Address Line 1" value={formData.addressLine1} />
              <InfoRow label="Address Line 2" value={formData.addressLine2} />
              <InfoRow label="City" value={formData.city} />
              <InfoRow label="District" value={formData.district} />
              <InfoRow label="Province" value={formData.province} />
              <InfoRow label="Postal Code" value={formData.postalCode} />
              <InfoRow label="Country" value={formData.country} />
            </CardContent>
          </Card>

          {/* Professional */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-primary" /> Professional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow icon={Briefcase} label="Occupation" value={formData.occupation} />
              <InfoRow label="Workplace" value={formData.workplace} />
              <InfoRow icon={Phone} label="Work Phone" value={formData.workPhone} />
              <InfoRow icon={GraduationCap} label="Education" value={formData.educationLevel} />
            </CardContent>
          </Card>

          {/* Account */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" /> Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InfoRow icon={CreditCard} label="Plan" value={formData.subscriptionPlan || 'FREE'} />
              <InfoRow icon={Languages} label="Language" value={langDisplay} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="change-password" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" /> Change Password
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {(['currentPassword', 'newPassword', 'confirmNewPassword'] as const).map((field) => (
                <div key={field} className="space-y-1.5">
                  <Label htmlFor={field} className="text-sm">
                    {field === 'currentPassword' ? 'Current Password' : field === 'newPassword' ? 'New Password' : 'Confirm New Password'}
                  </Label>
                  <div className="relative">
                    <Input
                      id={field}
                      type={passwordVisibility[field] ? 'text' : 'password'}
                      placeholder={field === 'currentPassword' ? 'Enter current password' : field === 'newPassword' ? 'Enter new password' : 'Confirm new password'}
                      value={passwordData[field]}
                      onChange={e => setPasswordData({ ...passwordData, [field]: e.target.value })}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisibility({ ...passwordVisibility, [field]: !passwordVisibility[field] })}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {passwordVisibility[field] ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                8-20 characters, with uppercase, lowercase, number, and special character.
              </p>
              <Button onClick={handlePasswordChange} disabled={passwordLoading} className="w-full">
                <Lock className="h-4 w-4 mr-2" />
                {passwordLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Devices ({sessions.length})</CardTitle>
                <Button variant="ghost" size="sm" onClick={loadSessions} disabled={sessionsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${sessionsLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Devices currently logged into your account.</p>
            </CardHeader>
            <CardContent className="space-y-1">
              {sessionsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No active sessions found.</p>
              ) : (
                sessions.map((session, index) => (
                  <React.Fragment key={session.id}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center gap-4 py-3">
                      <div className="shrink-0 text-muted-foreground p-2 rounded-lg bg-muted/50">
                        {getPlatformIcon(session.platform, session.userAgent)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-foreground">
                            {getDeviceLabel(session)}
                          </span>
                          {session.isCurrent && <Badge variant="secondary" className="text-xs">This device</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-0.5 mt-1">
                          {session.ipAddress && <p>IP: {session.ipAddress}</p>}
                          <p>Logged in: {session.createdAt ? new Date(session.createdAt).getFullYear() > 1971 ? new Date(session.createdAt).toLocaleString() : session.createdAt : 'Unknown'}</p>
                          {session.expiresInHuman ? (
                            <p>Expires in: {session.expiresInHuman}</p>
                          ) : session.expiresAt ? (
                            <p>Expires: {new Date(session.expiresAt).getFullYear() > 1971 ? new Date(session.expiresAt).toLocaleString() : session.expiresAt}</p>
                          ) : null}
                        </div>
                      </div>
                      {!session.isCurrent && (
                        <Button variant="outline" size="sm" onClick={() => handleRevoke(session.id)} disabled={revoking === session.id} className="shrink-0">
                          <LogOut className="h-3.5 w-3.5 mr-1" />
                          {revoking === session.id ? 'Revoking...' : 'Log out'}
                        </Button>
                      )}
                    </div>
                  </React.Fragment>
                ))
              )}
            </CardContent>
          </Card>

          {sessions.length > 1 && (
            <Card className="border-destructive/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">Log out everywhere</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      This will revoke all sessions including this one. You'll need to log in again on every device.
                    </p>
                    <Button variant="destructive" size="sm" className="mt-3" onClick={handleRevokeAll} disabled={revokingAll}>
                      {revokingAll ? 'Revoking all...' : 'Log out of all devices'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="apps" className="mt-4">
          <ConnectedApps />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
