import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { AccessControl } from '@/utils/permissions';
import { useToast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { uploadWithSignedUrl } from '@/utils/signedUploadHelper';
import UpdateInstituteForm, { type InstituteUpdateData } from '@/components/forms/UpdateInstituteForm';
import {
  Building, Phone, Mail, MapPin, Globe, Calendar, Edit, Camera,
  Eye, Target, FileText, Facebook, Youtube, Palette, Loader2, CheckCircle, XCircle
} from 'lucide-react';

interface InstituteDetailData {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  district?: string;
  province?: string;
  country?: string;
  pinCode?: string;
  type?: string;
  isActive: boolean;
  logoUrl?: string;
  imageUrl?: string;
  imageUrls?: string[];
  loadingGifUrl?: string;
  primaryColorCode?: string;
  secondaryColorCode?: string;
  vision?: string;
  mission?: string;
  description?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const InstituteDetails = () => {
  const { selectedInstitute, currentInstituteId } = useAuth();
  const userRole = useInstituteRole();
  const { toast } = useToast();

  const [instituteData, setInstituteData] = useState<InstituteDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const canEdit = AccessControl.hasPermission(userRole, 'edit-institute');

  const fetchInstituteDetails = useCallback(async (forceRefresh = false) => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const data = await enhancedCachedClient.get<InstituteDetailData>(
        `/institutes/${currentInstituteId}`,
        undefined,
        {
          ttl: CACHE_TTL.INSTITUTE_PROFILE || 5,
          forceRefresh,
          instituteId: currentInstituteId,
        }
      );
      setInstituteData(data);
    } catch (error: any) {
      console.error('Error fetching institute details:', error);
      // Fallback to selectedInstitute from context
      if (selectedInstitute) {
        setInstituteData({
          id: selectedInstitute.id,
          name: selectedInstitute.name,
          code: selectedInstitute.code,
          description: selectedInstitute.description,
          isActive: selectedInstitute.isActive,
          logoUrl: selectedInstitute.logo,
          type: selectedInstitute.type,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, selectedInstitute]);

  useEffect(() => {
    fetchInstituteDetails();
  }, [fetchInstituteDetails]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentInstituteId) return;

    setUploadingLogo(true);
    try {
      const relativePath = await uploadWithSignedUrl(file, 'institute-images');
      await enhancedCachedClient.patch(`/institutes/${currentInstituteId}`, { logoUrl: relativePath }, { instituteId: currentInstituteId });
      toast({ title: 'Success', description: 'Logo updated successfully.' });
      fetchInstituteDetails(true);
    } catch (error: any) {
      toast({ title: 'Error', description: error?.message || 'Failed to upload logo.', variant: 'destructive' });
    } finally {
      setUploadingLogo(false);
    }
  };

  if (!selectedInstitute && !currentInstituteId) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No institute selected</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const data = instituteData;
  if (!data) return null;

  const InfoItem = ({ icon: Icon, label, value }: { icon: any; label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
        <Icon className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground font-medium">{label}</p>
          <p className="text-sm font-medium text-foreground break-words">{value}</p>
        </div>
      </div>
    );
  };

  const locationParts = [data.address, data.city, data.district, data.province, data.state, data.country, data.pinCode].filter(Boolean);
  const fullAddress = locationParts.join(', ');

  return (
    <div className="space-y-6">
      {/* Header with Logo */}
      <div className="relative bg-gradient-to-br from-card/80 to-card/50 backdrop-blur-xl rounded-2xl border border-border/50 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Logo */}
            <div className="relative group">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-background shadow-lg">
                <AvatarImage src={getImageUrl(data.logoUrl || data.imageUrl)} alt={data.name} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
                  {data.shortName || data.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {canEdit && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploadingLogo ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : (
                    <Camera className="h-6 w-6 text-white" />
                  )}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} disabled={uploadingLogo} />
                </label>
              )}
            </div>

            {/* Name & Info */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">{data.name}</h1>
                <Badge variant={data.isActive ? 'default' : 'secondary'} className="w-fit mx-auto sm:mx-0">
                  {data.isActive ? <><CheckCircle className="h-3 w-3 mr-1" /> Active</> : <><XCircle className="h-3 w-3 mr-1" /> Inactive</>}
                </Badge>
              </div>
              <p className="text-muted-foreground">
                Code: <span className="font-mono font-semibold">{data.code}</span>
                {data.shortName && <> · {data.shortName}</>}
                {data.type && <> · {data.type}</>}
              </p>
              {data.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start">
                  <Mail className="h-4 w-4" /> {data.email}
                </div>
              )}

              {/* Color swatches */}
              {(data.primaryColorCode || data.secondaryColorCode) && (
                <div className="flex items-center gap-2 justify-center sm:justify-start pt-1">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  {data.primaryColorCode && (
                    <div className="flex items-center gap-1">
                      <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: data.primaryColorCode }} />
                      <span className="text-xs text-muted-foreground font-mono">{data.primaryColorCode}</span>
                    </div>
                  )}
                  {data.secondaryColorCode && (
                    <div className="flex items-center gap-1">
                      <div className="h-5 w-5 rounded-full border" style={{ backgroundColor: data.secondaryColorCode }} />
                      <span className="text-xs text-muted-foreground font-mono">{data.secondaryColorCode}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Edit Button */}
            {canEdit && (
              <Button onClick={() => setShowEditDialog(true)} className="shrink-0">
                <Edit className="h-4 w-4 mr-2" /> Edit Institute
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact & Location */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Contact & Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem icon={Phone} label="Phone" value={data.phone} />
            <InfoItem icon={Mail} label="Email" value={data.email} />
            <InfoItem icon={MapPin} label="Address" value={fullAddress || undefined} />
            <InfoItem icon={Calendar} label="Established" value={data.createdAt ? new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) : undefined} />
            {!data.phone && !data.email && !fullAddress && (
              <p className="text-sm text-muted-foreground italic py-2">No contact information available.</p>
            )}
          </CardContent>
        </Card>

        {/* Online Presence */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Online Presence</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.websiteUrl && (
              <a href={data.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Globe className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Website</p>
                  <p className="text-sm font-medium text-primary truncate">{data.websiteUrl}</p>
                </div>
              </a>
            )}
            {data.facebookPageUrl && (
              <a href={data.facebookPageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Facebook className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">Facebook</p>
                  <p className="text-sm font-medium text-primary truncate">{data.facebookPageUrl}</p>
                </div>
              </a>
            )}
            {data.youtubeChannelUrl && (
              <a href={data.youtubeChannelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                <Youtube className="h-5 w-5 text-primary" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground font-medium">YouTube</p>
                  <p className="text-sm font-medium text-primary truncate">{data.youtubeChannelUrl}</p>
                </div>
              </a>
            )}
            {!data.websiteUrl && !data.facebookPageUrl && !data.youtubeChannelUrl && (
              <p className="text-sm text-muted-foreground italic py-2">No online presence configured.</p>
            )}
          </CardContent>
        </Card>

        {/* Vision */}
        {data.vision && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.vision}</p>
            </CardContent>
          </Card>
        )}

        {/* Mission */}
        {data.mission && (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.mission}</p>
            </CardContent>
          </Card>
        )}

        {/* Description */}
        {data.description && (
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">About</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.description}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      {canEdit && (
        <UpdateInstituteForm
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          instituteId={data.id || currentInstituteId || ''}
          currentData={{
            name: data.name,
            shortName: data.shortName,
            code: data.code,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            state: data.state,
            district: data.district,
            province: data.province,
            country: data.country,
            pinCode: data.pinCode,
            vision: data.vision,
            mission: data.mission,
            description: data.description,
            websiteUrl: data.websiteUrl,
            facebookPageUrl: data.facebookPageUrl,
            youtubeChannelUrl: data.youtubeChannelUrl,
            primaryColorCode: data.primaryColorCode,
            secondaryColorCode: data.secondaryColorCode,
          }}
          onSuccess={() => fetchInstituteDetails(true)}
        />
      )}
    </div>
  );
};

export default InstituteDetails;
