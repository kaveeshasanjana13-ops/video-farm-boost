import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop, convertToPixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { profileImageApi, type InstituteImageHistoryEntry, type InstituteImageHistoryResponse } from '@/api/profileImage.api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { SafeImage } from '@/components/ui/SafeImage';
import { 
  Building2, Mail, Phone, MapPin, Globe, ExternalLink,
  Shield, Calendar, IdCard, CheckCircle, XCircle, User,
  RefreshCw, Eye, Facebook, Youtube,
  Camera, Upload, Loader2, Clock, Trash2, History, Images, ChevronRight,
} from 'lucide-react';

// Institute profile data from GET /institutes/:id/profile
// 35mm Ã— 45mm = 7:9 aspect ratio
const PROFILE_ASPECT_RATIO = 7 / 9;

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number): Crop {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

interface InstituteProfileData {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  logoUrl?: string;
  loadingGifUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
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
  nameWithInitials?: string | null;
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
  const isMobile = useIsMobile();
  const [instituteProfile, setInstituteProfile] = useState<InstituteProfileData | null>(null);
  const [userProfile, setUserProfile] = useState<InstituteUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'institute' | 'my-profile'>('institute');

  // â”€â”€ Institute image upload state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [cropImgSrc, setCropImgSrc] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageCrop, setImageCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [uploading, setUploading] = useState(false);
  const [deletingPending, setDeletingPending] = useState(false);
  const [instituteImageHistory, setInstituteImageHistory] = useState<InstituteImageHistoryResponse | null>(null);
  const [showHistory, setShowHistory] = useState(true);
  const historyRef = useRef<HTMLDivElement>(null);

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast({ title: 'Invalid file', description: 'Only JPEG, PNG, or WebP images are allowed.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 5 MB.', variant: 'destructive' });
      return;
    }
    setSelectedImage(file);
    setImageCrop(undefined);
    setCompletedCrop(undefined);
    const reader = new FileReader();
    reader.onload = () => setCropImgSrc(reader.result as string);
    reader.readAsDataURL(file);
    setShowImageUpload(true);
  };

  const handleInstituteImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerAspectCrop(width, height, PROFILE_ASPECT_RATIO);
    setImageCrop(crop);
    setCompletedCrop(convertToPixelCrop(crop, width, height));
  };

  const handleInstituteImageUpload = async () => {
    if (!completedCrop || !imgRef.current || !selectedImage || !currentInstituteId || !userProfile) return;
    setUploading(true);
    try {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX, completedCrop.y * scaleY,
        completedCrop.width * scaleX, completedCrop.height * scaleY,
        0, 0, completedCrop.width, completedCrop.height
      );
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.92));
      const croppedFile = new File([blob], selectedImage.name, { type: 'image/jpeg' });

      await profileImageApi.uploadInstituteProfileImage(
        userProfile.userId,
        currentInstituteId,
        croppedFile
      );
      toast({ title: 'Image submitted', description: 'Your institute image is pending admin review.' });
      setShowImageUpload(false);
      setSelectedImage(null);
      setCropImgSrc('');
      setInstituteImageHistory(null); // clear cache so it reloads
      loadData();
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  const loadInstituteImageHistory = useCallback(async () => {
    if (!currentInstituteId || !userProfile) return;
    try {
      const response = await profileImageApi.getInstituteImageHistory(userProfile.userId, currentInstituteId);
      setInstituteImageHistory(response);
    } catch (err) {
      console.error('Failed to load institute image history:', err);
    }
  }, [currentInstituteId, userProfile]);

  const handleDeletePendingImage = async () => {
    if (!currentInstituteId || !userProfile) return;
    setDeletingPending(true);
    try {
      await profileImageApi.deleteInstituteImage(userProfile.userId, currentInstituteId);
      toast({ title: 'Image removed', description: 'Pending image has been deleted.' });
      setInstituteImageHistory(null);
      loadData();
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    } finally {
      setDeletingPending(false);
    }
  };
  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  const loadData = useCallback(async (forceRefresh = false) => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const [instProfile, userProf] = await Promise.allSettled([
        enhancedCachedClient.get<InstituteProfileData>(
          `/institutes/${currentInstituteId}/profile`,
          {},
          { ttl: CACHE_TTL.INSTITUTE_PROFILE, instituteId: currentInstituteId, forceRefresh }
        ),
        enhancedCachedClient.get<InstituteUserProfile>(
          `/institute-users/institute/${currentInstituteId}/me`,
          {},
          { ttl: CACHE_TTL.INSTITUTE_PROFILE, userId: currentInstituteId, forceRefresh }
        )
      ]);

      if (instProfile.status === 'fulfilled') setInstituteProfile(instProfile.value);
      if (userProf.status === 'fulfilled') setUserProfile(userProf.value);
      if (forceRefresh) setInstituteImageHistory(null);
    } catch (error: any) {
      console.error('Error fetching institute profile:', error);
      if (!error?.message?.includes('Rate limited')) {
        toast({ title: 'Error', description: 'Failed to load profile data.', variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, toast]);

  // Auto-load institute image history when user profile is available
  useEffect(() => {
    if (userProfile && currentInstituteId) {
      loadInstituteImageHistory();
    }
  }, [userProfile?.userId, currentInstituteId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-56 sm:h-72 w-full animate-pulse" style={{ background: 'linear-gradient(135deg, hsl(var(--primary)/0.2) 0%, hsl(var(--primary)/0.1) 100%)' }} />
        <div className="max-w-5xl mx-auto px-4 sm:px-8 -mt-16 space-y-6 pb-10">
          <Skeleton className="h-32 w-32 rounded-2xl border-4 border-background" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-48" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const inst = instituteProfile;
  const user = userProfile;

  const primaryColor = inst?.primaryColorCode || 'hsl(var(--primary))';
  const secondaryColor = inst?.secondaryColorCode || primaryColor;
  const heroGradient = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'VERIFIED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/30';
      case 'REJECTED': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const galleryImages = [
    ...(inst?.imageUrl ? [inst.imageUrl] : []),
    ...(inst?.imageUrls || []),
  ];

  const InfoRow = ({ icon: Icon, label, value, href }: { icon: any; label: string; value?: string | null; href?: string }) => {
    if (!value) return null;
    return (
      <div className="flex items-center gap-3 text-sm py-2 border-b border-border/30 last:border-0">
        <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 break-all">
            {value} <ExternalLink className="h-3 w-3 flex-shrink-0" />
          </a>
        ) : (
          <span className="break-words">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* HERO SECTION                            */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* Banner: cover image if available, else brand gradient */}
      <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
        {/* Background layer — cover image or gradient */}
        {inst?.imageUrl ? (
          <img
            src={inst.imageUrl}
            alt="Institute banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{ filter: 'blur(2px) brightness(0.55) saturate(1.1)' }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: heroGradient }} />
        )}

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10 pointer-events-none" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${primaryColor}55 0%, transparent 60%)` }} />

        {/* Bottom fade to background */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* Refresh button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-4 right-4 bg-black/30 backdrop-blur-md text-white border border-white/20 hover:bg-black/50 z-10"
          onClick={() => loadData(true)}
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />Refresh
        </Button>

        {/* Hero content */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-10 flex flex-col sm:flex-row items-center sm:items-end gap-5 z-10">
          {/* Logo — frosted glass card */}
          <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-3xl border-2 border-white/30 shadow-2xl overflow-hidden bg-white/15 backdrop-blur-xl flex items-center justify-center shrink-0 ring-4 ring-black/20">
            {inst?.logoUrl ? (
              <SafeImage
                src={inst.logoUrl}
                alt={inst?.name || 'Logo'}
                className="h-full w-full object-contain p-3"
                fallback={<Building2 className="h-12 w-12 text-white/80" />}
              />
            ) : (
              <Building2 className="h-12 w-12 text-white/80" />
            )}
          </div>

          {/* Name & badges */}
          <div className="flex-1 text-center sm:text-left text-white pb-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
              {inst?.name || 'Institute'}
            </h1>
            <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
              {inst?.shortName && (
                <span className="text-sm bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full font-semibold border border-white/25">{inst.shortName}</span>
              )}
              {inst?.code && (
                <span className="text-xs bg-black/30 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full font-mono border border-white/15">{inst.code}</span>
              )}
              {inst?.type && (
                <span className="text-xs bg-black/25 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full capitalize border border-white/15">{inst.type.toLowerCase().replace(/_/g, ' ')}</span>
              )}
              {inst?.city && (
                <span className="text-xs bg-black/25 backdrop-blur-sm text-white/90 px-3 py-1 rounded-full flex items-center gap-1 border border-white/15">
                  <MapPin className="h-3 w-3" />{inst.city}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CONTACT BAR */}
      {(inst?.email || inst?.phone || inst?.websiteUrl || inst?.facebookPageUrl || inst?.youtubeChannelUrl) && (
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-md border-b border-border/40 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          {/* Brand accent line */}
          <div className="h-0.5 w-full" style={{ background: heroGradient }} />
          <div className="max-w-5xl mx-auto px-4 sm:px-8 py-2.5">
            <div className="flex gap-2 overflow-x-auto pb-0.5 items-center" style={{ scrollbarWidth: 'none' }}>
              {inst?.email && (
                <a href={`mailto:${inst.email}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-primary/10 hover:text-primary border border-border/50 hover:border-primary/40 text-sm text-muted-foreground transition-all duration-200 whitespace-nowrap shrink-0 group">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors shrink-0">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {inst.email}
                </a>
              )}
              {inst?.phone && (
                <a href={`tel:${inst.phone}`}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-emerald-500/10 hover:text-emerald-600 border border-border/50 hover:border-emerald-500/40 text-sm text-muted-foreground transition-all duration-200 whitespace-nowrap shrink-0 group">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors shrink-0">
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                  </span>
                  {inst.phone}
                </a>
              )}
              {inst?.websiteUrl && (
                <a href={inst.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-sky-500/10 hover:text-sky-600 border border-border/50 hover:border-sky-500/40 text-sm text-muted-foreground transition-all duration-200 whitespace-nowrap shrink-0 group">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-sky-500/10 group-hover:bg-sky-500/20 transition-colors shrink-0">
                    <Globe className="h-3.5 w-3.5 text-sky-600" />
                  </span>
                  Website
                  <ExternalLink className="h-3 w-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                </a>
              )}
              {inst?.facebookPageUrl && (
                <a href={inst.facebookPageUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-blue-600/10 hover:text-blue-600 border border-border/50 hover:border-blue-600/40 text-sm text-muted-foreground transition-all duration-200 whitespace-nowrap shrink-0 group">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-600/10 group-hover:bg-blue-600/20 transition-colors shrink-0">
                    <Facebook className="h-3.5 w-3.5 text-blue-600" />
                  </span>
                  Facebook
                </a>
              )}
              {inst?.youtubeChannelUrl && (
                <a href={inst.youtubeChannelUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-muted/70 hover:bg-red-600/10 hover:text-red-600 border border-border/50 hover:border-red-600/40 text-sm text-muted-foreground transition-all duration-200 whitespace-nowrap shrink-0 group">
                  <span className="flex items-center justify-center h-6 w-6 rounded-full bg-red-600/10 group-hover:bg-red-600/20 transition-colors shrink-0">
                    <Youtube className="h-3.5 w-3.5 text-red-600" />
                  </span>
                  YouTube
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB SWITCHER ── */}
      <div className="bg-background border-b border-border/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <div className="flex">
            <button
              onClick={() => setActiveTab('institute')}
              className={"flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors " + (activeTab === 'institute' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              <Building2 className="h-4 w-4" />
              Institute
            </button>
            <button
              onClick={() => setActiveTab('my-profile')}
              className={"flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-colors " + (activeTab === 'my-profile' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}
            >
              <User className="h-4 w-4" />
              My Profile
            </button>
          </div>
        </div>
      </div>

      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      {/* MAIN PAGE BODY                          */}
      {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-14">

        {/* â”€â”€ GALLERY â”€â”€ */}
        {/* ──── INSTITUTE TAB ──── */}{activeTab === 'institute' && <>
        {galleryImages.length > 0 && (
          <section>
            {galleryImages.length === 1 ? (
              <div className="overflow-hidden rounded-2xl border border-border/40 shadow-md">
                <SafeImage
                  src={galleryImages[0]}
                  alt="Institute image"
                  className="w-full object-cover max-h-80 sm:max-h-[420px]"
                  fallback={<div className="h-48 flex items-center justify-center bg-muted text-muted-foreground"><Images className="h-10 w-10" /></div>}
                />
              </div>
            ) : galleryImages.length === 2 ? (
              <div className="grid grid-cols-2 gap-3">
                {galleryImages.map((url, idx) => (
                  <div key={idx} className="overflow-hidden rounded-2xl border border-border/40 shadow-md">
                    <SafeImage
                      src={url}
                      alt={`Institute image ${idx + 1}`}
                      className="w-full object-cover aspect-video"
                      fallback={<div className="aspect-video flex items-center justify-center bg-muted text-muted-foreground"><Images className="h-8 w-8" /></div>}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* First image spans 2 cols */}
                <div className="col-span-2 overflow-hidden rounded-2xl border border-border/40 shadow-md">
                  <SafeImage
                    src={galleryImages[0]}
                    alt="Institute main image"
                    className="w-full object-cover aspect-video"
                    fallback={<div className="aspect-video flex items-center justify-center bg-muted text-muted-foreground"><Images className="h-10 w-10" /></div>}
                  />
                </div>
                {galleryImages.slice(1).map((url, idx) => (
                  <div key={idx} className="overflow-hidden rounded-2xl border border-border/40 shadow-md">
                    <SafeImage
                      src={url}
                      alt={`Gallery ${idx + 2}`}
                      className="w-full object-cover aspect-square sm:aspect-video"
                      fallback={<div className="aspect-square sm:aspect-video flex items-center justify-center bg-muted text-muted-foreground"><Images className="h-8 w-8" /></div>}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* â”€â”€ VISION & MISSION â”€â”€ */}
        {(inst?.vision || inst?.mission) && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">About Us</h2>
              <div className="h-1 w-16 rounded-full mx-auto" style={{ background: heroGradient }} />
            </div>
            <div className={`grid gap-6 ${inst?.vision && inst?.mission ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
              {inst?.vision && (
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ background: heroGradient }} />
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Eye className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Vision</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{inst.vision}</p>
                </div>
              )}
              {inst?.mission && (
                <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                  <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ background: heroGradient }} />
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-xl bg-primary/10">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">Mission</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{inst.mission}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* â”€â”€ LOADING GIF â”€â”€ */}
        {inst?.loadingGifUrl && (
          <section className="flex flex-col items-center gap-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Loading Animation</p>
            <div className="p-5 rounded-2xl border border-border/40 bg-card shadow-sm inline-flex">
              <img src={inst.loadingGifUrl} alt="Loading GIF" className="h-20 w-auto rounded-xl" />
            </div>
          </section>
        )}

        {/* â”€â”€ SOCIAL / LINKS â”€â”€ */}
        {(inst?.websiteUrl || inst?.facebookPageUrl || inst?.youtubeChannelUrl) && (
          <section className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Find Us Online</h2>
              <div className="h-1 w-16 rounded-full mx-auto" style={{ background: heroGradient }} />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              {inst?.websiteUrl && (
                <a
                  href={inst.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-7 py-4 rounded-2xl border-2 border-primary/30 bg-card text-foreground font-medium hover:border-primary hover:bg-primary/5 transition-all shadow-sm group"
                >
                  <Globe className="h-5 w-5 text-primary" />
                  <span>Website</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              {inst?.facebookPageUrl && (
                <a
                  href={inst.facebookPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-7 py-4 rounded-2xl border-2 border-blue-600/30 bg-card text-foreground font-medium hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all shadow-sm group"
                >
                  <Facebook className="h-5 w-5 text-blue-600" />
                  <span>Facebook</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </a>
              )}
              {inst?.youtubeChannelUrl && (
                <a
                  href={inst.youtubeChannelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-7 py-4 rounded-2xl border-2 border-red-600/30 bg-card text-foreground font-medium hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all shadow-sm group"
                >
                  <Youtube className="h-5 w-5 text-red-600" />
                  <span>YouTube</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-600 transition-colors" />
                </a>
              )}
            </div>
          </section>
        )}

        </>}
        {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
        {/* MY PROFILE SECTION                      */}
        {/* â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â”â” */}
        {activeTab === 'my-profile' && (
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold">My Profile</h2>
            <div className="h-1 w-16 rounded-full mx-auto" style={{ background: heroGradient }} />
          </div>

          {user ? (() => {
            const approvedImageUrl = instituteImageHistory?.currentInstituteImageUrl ?? user.instituteUserImageUrl ?? '';
            const historyEntries = instituteImageHistory?.data ?? [];
            const latestRecord = historyEntries[0];
            const hasPending = latestRecord?.status === 'PENDING';
            const hasRejected = latestRecord?.status === 'REJECTED';

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* â”€â”€ User Info â”€â”€ */}
                <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full" style={{ background: heroGradient }} />
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <Avatar className="h-16 w-16 ring-4 ring-primary/10 shrink-0">
                        <AvatarImage src={approvedImageUrl} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold leading-tight">{user.nameWithInitials || `${user.firstName} ${user.lastName}`}</h3>
                        {user.nameWithInitials && (
                          <p className="text-sm text-muted-foreground">{user.firstName} {user.lastName}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />{user.userType}
                          </Badge>
                          <Badge className={`text-xs ${getStatusColor(user.status)}`}>{user.status}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <InfoRow icon={Mail} label="Email" value={user.email} />
                      <InfoRow icon={Phone} label="Phone" value={user.phoneNumber} />
                      <InfoRow icon={IdCard} label="Institute User ID" value={user.userIdByInstitute} />
                      <InfoRow icon={IdCard} label="Institute Card ID" value={user.instituteCardId} />
                      {user.createdAt && (
                        <div className="flex items-center gap-3 text-sm py-2">
                          <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span>Member since {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* â”€â”€ Profile Image Management â”€â”€ */}
                <div className="rounded-2xl border border-border/50 bg-card shadow-sm overflow-hidden">
                  <div className="h-1.5 w-full" style={{ background: heroGradient }} />
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Camera className="h-4 w-4 text-primary" />Profile Image
                      </h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => loadData(true)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-5">
                      <div className="shrink-0 flex flex-col items-center gap-1.5">
                        <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                          <AvatarImage src={approvedImageUrl} className="object-cover" />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        {hasPending && (
                          <Badge className="bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700 text-xs gap-1">
                            <Clock className="h-3 w-3" />Under Review
                          </Badge>
                        )}
                        {!hasPending && !hasRejected && user.imageVerificationStatus === 'VERIFIED' && (
                          <Badge className="bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700 text-xs gap-1">
                            <CheckCircle className="h-3 w-3" />Verified
                          </Badge>
                        )}
                        {hasRejected && (
                          <Badge className="bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-700 text-xs gap-1">
                            <XCircle className="h-3 w-3" />Rejected
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" onClick={() => fileInputRef.current?.click()}>
                          <Camera className="h-3.5 w-3.5 mr-1.5" />
                          {hasRejected ? 'Re-upload Photo' : 'Change Photo'}
                        </Button>
                        {hasPending && (
                          <Button
                            size="sm" variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400"
                            onClick={handleDeletePendingImage}
                            disabled={deletingPending}
                          >
                            {deletingPending
                              ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Removingâ€¦</>
                              : <><Trash2 className="h-3.5 w-3.5 mr-1.5" />Cancel Submission</>
                            }
                          </Button>
                        )}
                      </div>
                    </div>

                    {hasPending && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/50">
                        {latestRecord?.imageUrl ? (
                          <Avatar className="h-12 w-12 shrink-0 rounded-lg">
                            <AvatarImage src={latestRecord.imageUrl} className="object-cover" />
                            <AvatarFallback className="rounded-lg bg-muted text-xs">?</AvatarFallback>
                          </Avatar>
                        ) : <Clock className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">New image under review</p>
                          <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Your current image stays visible until approved.</p>
                        </div>
                      </div>
                    )}

                    {hasRejected && (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800/50">
                        <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-red-800 dark:text-red-300">Image rejected</p>
                          {latestRecord?.rejectionReason ? (
                            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">Reason: {latestRecord.rejectionReason}</p>
                          ) : (
                            <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">Please upload a new passport-style photo.</p>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      size="sm" variant="outline" className="w-full"
                      onClick={() => {
                        const next = !showHistory;
                        setShowHistory(next);
                        if (next) {
                          if (!instituteImageHistory) loadInstituteImageHistory();
                          setTimeout(() => historyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                        }
                      }}
                    >
                      <History className="h-3.5 w-3.5 mr-1.5" />
                      {showHistory ? 'Hide History' : 'View History'}
                      <ChevronRight className={`h-3.5 w-3.5 ml-1 transition-transform ${showHistory ? 'rotate-90' : ''}`} />
                    </Button>

                    {showHistory && (
                      <div ref={historyRef} className="space-y-2 scroll-mt-4">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Submission History</p>
                        {!instituteImageHistory ? (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                            <Loader2 className="h-3 w-3 animate-spin" /> Loadingâ€¦
                          </div>
                        ) : historyEntries.length === 0 ? (
                          <p className="text-xs text-muted-foreground py-2">No history yet.</p>
                        ) : (
                          <div className="space-y-2">
                            {historyEntries.map(entry => (
                              <div key={entry.imageId} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/40 text-xs">
                                <Avatar className="h-9 w-9 shrink-0">
                                  <AvatarImage src={entry.imageUrl} className="object-cover" />
                                  <AvatarFallback className="text-[10px]">IMG</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    {entry.status === 'VERIFIED' && <Badge className="bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/30 dark:text-green-400 text-[10px] h-4 gap-0.5"><CheckCircle className="h-2.5 w-2.5" />Verified</Badge>}
                                    {entry.status === 'PENDING'  && <Badge className="bg-amber-100 text-amber-700 border border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] h-4 gap-0.5"><Clock className="h-2.5 w-2.5" />Pending</Badge>}
                                    {entry.status === 'REJECTED' && <Badge className="bg-red-100 text-red-700 border border-red-300 dark:bg-red-900/30 dark:text-red-400 text-[10px] h-4 gap-0.5"><XCircle className="h-2.5 w-2.5" />Rejected</Badge>}
                                    <span className="text-muted-foreground">{new Date(entry.submittedAt).toLocaleDateString()}</span>
                                  </div>
                                  {entry.rejectionReason && <p className="text-red-600 dark:text-red-400">Reason: {entry.rejectionReason}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })() : (
            <div className="rounded-2xl border border-border/50 bg-card p-12 text-center shadow-sm">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Unable to load your institute profile.</p>
            </div>
          )}
        </section>
        )}

      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleImageFileSelect}
      />

      {/* Crop + Upload Dialog */}
      <Dialog open={showImageUpload} onOpenChange={open => { if (!open) setShowImageUpload(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Crop Institute Photo (35mm Ã— 45mm)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cropImgSrc && (
              <div className="flex justify-center overflow-hidden rounded-xl">
                <ReactCrop
                  crop={imageCrop}
                  onChange={(_, pct) => setImageCrop(pct)}
                  onComplete={c => setCompletedCrop(c)}
                  aspect={PROFILE_ASPECT_RATIO}
                  minWidth={30}
                  minHeight={30}
                  keepSelection
                >
                  <img
                    ref={imgRef}
                    src={cropImgSrc}
                    alt="Crop"
                    onLoad={handleInstituteImageLoad}
                    style={{ maxHeight: 360, maxWidth: '100%', display: 'block' }}
                  />
                </ReactCrop>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowImageUpload(false)} disabled={uploading}>Cancel</Button>
              <Button className="flex-1" onClick={handleInstituteImageUpload} disabled={!completedCrop || uploading}>
                {uploading
                  ? <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" />Uploadingâ€¦</>
                  : <><Upload className="h-4 w-4 mr-1.5" />Upload</>
                }
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstituteProfile;

