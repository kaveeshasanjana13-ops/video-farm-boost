import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useToast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { SafeImage } from '@/components/ui/SafeImage';
import { 
  Building2, Mail, Phone, MapPin, Globe, ExternalLink,
  Shield, Calendar, IdCard, CheckCircle, User,
  RefreshCw, Eye, Facebook, Youtube
} from 'lucide-react';

// Institute profile data from GET /institutes/:id/profile
interface InstituteProfileData {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  logoUrl?: string;
  primaryColorCode?: string;
  secondaryColorCode?: string;
  phone?: string;
  email?: string;
  city?: string;
  type?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
  vision?: string;
  mission?: string;
}

// Institute user profile from GET /institute-users/institute/:id/me
interface InstituteUserProfile {
  userId: string;
  instituteId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: string;
  status: string;
  userIdByInstitute: string;
  instituteUserImageUrl: string | null;
  instituteCardId: string | null;
  imageVerificationStatus: string;
  imageVerifiedBy: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const InstituteProfile = () => {
  const { currentInstituteId } = useAuth();
  const userRole = useInstituteRole();
  const { toast } = useToast();
  const [instituteProfile, setInstituteProfile] = useState<InstituteProfileData | null>(null);
  const [userProfile, setUserProfile] = useState<InstituteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const [instProfile, userProf] = await Promise.allSettled([
        enhancedCachedClient.get<InstituteProfileData>(
          `/institutes/${currentInstituteId}/profile`,
          {},
          { ttl: CACHE_TTL.INSTITUTE_PROFILE, instituteId: currentInstituteId }
        ),
        enhancedCachedClient.get<InstituteUserProfile>(
          `/institute-users/institute/${currentInstituteId}/me`,
          {},
          { ttl: CACHE_TTL.INSTITUTE_PROFILE, userId: currentInstituteId }
        )
      ]);

      if (instProfile.status === 'fulfilled') setInstituteProfile(instProfile.value);
      if (userProf.status === 'fulfilled') setUserProfile(userProf.value);
    } catch (error: any) {
      console.error('Error fetching institute profile:', error);
      if (!error?.message?.includes('Rate limited')) {
        toast({ title: 'Error', description: 'Failed to load profile data.', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const inst = instituteProfile;
  const user = userProfile;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'VERIFIED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const InfoRow = ({ icon: Icon, label, value, href }: { icon: any; label: string; value?: string | null; href?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
        <div className="p-2 rounded-lg bg-primary/5 mt-0.5">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 mt-0.5 break-all">
              {value} <ExternalLink className="h-3 w-3 flex-shrink-0" />
            </a>
          ) : (
            <p className="text-sm font-medium text-foreground mt-0.5 break-words">{value}</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Institute Profile</h1>
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* ===== INSTITUTE IDENTITY CARD ===== */}
        {inst && (
          <div className="relative overflow-hidden rounded-3xl border border-border/50 shadow-xl">
            {/* Gradient Banner */}
            <div className="h-32 sm:h-40 relative" style={{
              background: `linear-gradient(135deg, ${inst.primaryColorCode || 'hsl(var(--primary))'} 0%, ${inst.secondaryColorCode || 'hsl(var(--primary))'} 100%)`
            }}>
              <div className="absolute inset-0 bg-black/10" />
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent" />
            </div>

            <div className="relative px-6 sm:px-8 pb-8 -mt-16 sm:-mt-20 bg-card">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6">
                {/* Logo */}
                <div className="relative z-10">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 rounded-2xl border-4 border-card shadow-xl overflow-hidden bg-card flex items-center justify-center">
                    {inst.logoUrl ? (
                      <SafeImage src={inst.logoUrl} alt={inst.name} className="h-full w-full object-contain p-2" fallback={<Building2 className="h-12 w-12 text-muted-foreground" />} />
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Name & Meta */}
                <div className="flex-1 text-center sm:text-left pb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">{inst.name}</h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                    {inst.shortName && <Badge variant="secondary" className="text-xs">{inst.shortName}</Badge>}
                    <Badge variant="outline" className="text-xs">{inst.code}</Badge>
                    {inst.type && <Badge variant="outline" className="text-xs capitalize">{inst.type.toLowerCase().replace('_', ' ')}</Badge>}
                    {inst.city && (
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {inst.city}
                      </span>
                    )}
                  </div>
                </div>

                {/* Color Dots */}
                <div className="flex items-center gap-2 pb-2">
                  {inst.primaryColorCode && (
                    <div className="h-6 w-6 rounded-full border-2 border-card shadow-sm" style={{ backgroundColor: inst.primaryColorCode }} title={`Primary: ${inst.primaryColorCode}`} />
                  )}
                  {inst.secondaryColorCode && (
                    <div className="h-6 w-6 rounded-full border-2 border-card shadow-sm" style={{ backgroundColor: inst.secondaryColorCode }} title={`Secondary: ${inst.secondaryColorCode}`} />
                  )}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border/50">
                {inst.email && (
                  <a href={`mailto:${inst.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="h-4 w-4" /> {inst.email}
                  </a>
                )}
                {inst.phone && (
                  <a href={`tel:${inst.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <Phone className="h-4 w-4" /> {inst.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== TABS: About + My Profile + Links ===== */}
        <Tabs defaultValue="about" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="about" className="text-xs sm:text-sm">
              <Eye className="h-4 w-4 mr-1.5 hidden sm:block" />About
            </TabsTrigger>
            <TabsTrigger value="my-profile" className="text-xs sm:text-sm">
              <User className="h-4 w-4 mr-1.5 hidden sm:block" />My Profile
            </TabsTrigger>
            <TabsTrigger value="links" className="text-xs sm:text-sm">
              <Globe className="h-4 w-4 mr-1.5 hidden sm:block" />Links
            </TabsTrigger>
          </TabsList>

          {/* About Tab */}
          <TabsContent value="about">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {inst?.vision && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-4 w-4 text-primary" /> Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{inst.vision}</p>
                  </CardContent>
                </Card>
              )}
              {inst?.mission && (
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" /> Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{inst.mission}</p>
                  </CardContent>
                </Card>
              )}
              {!inst?.vision && !inst?.mission && (
                <Card className="col-span-full border-border/50">
                  <CardContent className="py-12 text-center">
                    <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No vision or mission statement available.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* My Profile Tab */}
          <TabsContent value="my-profile">
            {user ? (
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                      <AvatarImage src={user.instituteUserImageUrl || ''} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{user.firstName} {user.lastName}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          <Shield className="h-3 w-3 mr-1" />{user.userType}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(user.status)}`}>{user.status}</Badge>
                        <Badge className={`text-xs ${getStatusColor(user.imageVerificationStatus)}`}>
                          <CheckCircle className="h-3 w-3 mr-1" />{user.imageVerificationStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    <InfoRow icon={Mail} label="Email" value={user.email} />
                    <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
                    <InfoRow icon={IdCard} label="Institute User ID" value={user.userIdByInstitute} />
                    <InfoRow icon={IdCard} label="Institute Card ID" value={user.instituteCardId} />
                    <InfoRow icon={Calendar} label="Member Since" value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined} />
                    <InfoRow icon={Calendar} label="Last Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : undefined} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-12 text-center">
                  <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Unable to load your institute profile.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Links Tab */}
          <TabsContent value="links">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-base">Online Presence</CardTitle>
                <CardDescription>Website and social media links</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-0">
                  <InfoRow icon={Globe} label="Website" value={inst?.websiteUrl} href={inst?.websiteUrl || undefined} />
                  <InfoRow icon={Facebook} label="Facebook" value={inst?.facebookPageUrl} href={inst?.facebookPageUrl || undefined} />
                  <InfoRow icon={Youtube} label="YouTube" value={inst?.youtubeChannelUrl} href={inst?.youtubeChannelUrl || undefined} />
                  {!inst?.websiteUrl && !inst?.facebookPageUrl && !inst?.youtubeChannelUrl && (
                    <div className="py-8 text-center">
                      <Globe className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">No online links available.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default InstituteProfile;
