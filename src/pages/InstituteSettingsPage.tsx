import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { SafeImage } from '@/components/ui/SafeImage';
import ImageCropUpload from '@/components/common/ImageCropUpload';
import { ImageFieldUploader } from '@/components/institute-settings/ImageFieldUploader';
import { GalleryManager } from '@/components/institute-settings/GalleryManager';
import { Separator } from '@/components/ui/separator';
import {
  Building2, Mail, Phone, MapPin, Globe, Facebook, Youtube,
  Palette, Save, Loader2, Eye, Image, Settings, RefreshCw,
  CheckCircle, AlertCircle
} from 'lucide-react';

interface InstituteSettings {
  id: string;
  name: string;
  shortName?: string;
  code: string;
  email: string;
  phone?: string;
  systemContactEmail?: string;
  systemContactPhoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  province?: string;
  pinCode?: string;
  type?: string;
  logoUrl?: string;
  loadingGifUrl?: string;
  primaryColorCode?: string;
  secondaryColorCode?: string;
  imageUrls?: string[];
  imageUrl?: string;
  vision?: string;
  mission?: string;
  description?: string;
  websiteUrl?: string;
  facebookPageUrl?: string;
  youtubeChannelUrl?: string;
  isActive: boolean;
  updatedAt: string;
}

const InstituteSettingsPage = () => {
  const { currentInstituteId, selectedInstitute } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<InstituteSettings | null>(null);
  const [formData, setFormData] = useState<Partial<InstituteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const loadSettings = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const response = await enhancedCachedClient.get<InstituteSettings>(
        `/institutes/${currentInstituteId}/settings`,
        {},
        { ttl: CACHE_TTL.SETTINGS, forceRefresh: true, instituteId: currentInstituteId }
      );
      setSettings(response);
      setFormData(response);
      setHasChanges(false);
    } catch (error: any) {
      console.error('Failed to load institute settings:', error);
      toast({ title: 'Error', description: 'Failed to load institute settings.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleChange = (field: keyof InstituteSettings, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!currentInstituteId || !settings) return;
    setSaving(true);
    try {
      const changes: Record<string, any> = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value !== undefined && value !== (settings as any)[key]) {
          changes[key] = value;
        }
      }

      if (Object.keys(changes).length === 0) {
        toast({ title: 'No changes', description: 'No fields were modified.' });
        setSaving(false);
        return;
      }

      const updated = await enhancedCachedClient.patch<InstituteSettings>(
        `/institutes/${currentInstituteId}/settings`,
        changes,
        { instituteId: currentInstituteId }
      );

      setSettings(updated);
      setFormData(updated);
      setHasChanges(false);
      toast({ title: 'Success', description: 'Institute settings updated successfully.' });
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      const msg = error?.message?.includes('409') ? 'Email is already taken by another institute.' : error?.message || 'Failed to save settings.';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpdate = (newUrl: string) => {
    setFormData(prev => ({ ...prev, logoUrl: newUrl }));
    setHasChanges(true);
  };

  const handleSettingsRefresh = (updated: InstituteSettings) => {
    setSettings(updated);
    setFormData(updated);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 text-center">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Unable to load institute settings.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            Institute Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your institute's information, branding, and online presence</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={loadSettings} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving || !hasChanges}>
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={settings.isActive ? 'default' : 'secondary'} className="text-xs">
          {settings.isActive ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
          {settings.isActive ? 'Active' : 'Inactive'}
        </Badge>
        {settings.type && <Badge variant="outline" className="text-xs">{settings.type}</Badge>}
        {settings.code && <Badge variant="outline" className="text-xs">Code: {settings.code}</Badge>}
        {hasChanges && <Badge className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/30">Unsaved Changes</Badge>}
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
          <TabsTrigger value="basic" className="text-xs sm:text-sm">
            <Building2 className="h-4 w-4 mr-1.5 hidden sm:block" />Basic
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs sm:text-sm">
            <Palette className="h-4 w-4 mr-1.5 hidden sm:block" />Branding
          </TabsTrigger>
          <TabsTrigger value="location" className="text-xs sm:text-sm">
            <MapPin className="h-4 w-4 mr-1.5 hidden sm:block" />Location
          </TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">
            <Eye className="h-4 w-4 mr-1.5 hidden sm:block" />About
          </TabsTrigger>
          <TabsTrigger value="online" className="text-xs sm:text-sm">
            <Globe className="h-4 w-4 mr-1.5 hidden sm:block" />Online
          </TabsTrigger>
        </TabsList>

        {/* Basic Info */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>Core institute details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Institute Name</Label>
                  <Input value={formData.name || ''} onChange={e => handleChange('name', e.target.value)} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label>Short Name</Label>
                  <Input value={formData.shortName || ''} onChange={e => handleChange('shortName', e.target.value)} maxLength={50} />
                </div>
                <div className="space-y-2">
                  <Label>Code</Label>
                  <Input value={formData.code || ''} disabled className="bg-muted" />
                  <p className="text-xs text-muted-foreground">Code cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} maxLength={60} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} maxLength={15} />
                </div>
                <div className="space-y-2">
                  <Label>System Contact Email</Label>
                  <Input value={formData.systemContactEmail || ''} onChange={e => handleChange('systemContactEmail', e.target.value)} placeholder="Internal admin email" />
                </div>
                <div className="space-y-2">
                  <Label>System Contact Phone</Label>
                  <Input value={formData.systemContactPhoneNumber || ''} onChange={e => handleChange('systemContactPhoneNumber', e.target.value)} placeholder="Internal admin phone" />
                </div>
                <div className="space-y-2">
                  <Label>Institute Type</Label>
                  <Input value={formData.type || ''} onChange={e => handleChange('type', e.target.value)} placeholder="e.g. SCHOOL" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Branding */}
        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Branding & Appearance</CardTitle>
              <CardDescription>Logo, colors, and visual identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Uploaders */}
              {currentInstituteId && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageFieldUploader
                      instituteId={currentInstituteId}
                      field="logo"
                      settingsField="logoUrl"
                      currentDisplayUrl={settings?.logoUrl || null}
                      label="Institute Logo"
                      accept="image/*"
                      onUpdate={handleSettingsRefresh as any}
                    />
                    <ImageFieldUploader
                      instituteId={currentInstituteId}
                      field="loading-gif"
                      settingsField="loadingGifUrl"
                      currentDisplayUrl={settings?.loadingGifUrl || null}
                      label="Loading Animation (GIF)"
                      accept="image/gif,image/*"
                      onUpdate={handleSettingsRefresh as any}
                    />
                  </div>
                  <ImageFieldUploader
                    instituteId={currentInstituteId}
                    field="cover-image"
                    settingsField="imageUrl"
                    currentDisplayUrl={settings?.imageUrl || null}
                    label="Cover Image"
                    accept="image/*"
                    onUpdate={handleSettingsRefresh as any}
                  />

                  <Separator />

                  <GalleryManager
                    instituteId={currentInstituteId}
                    imageUrls={settings?.imageUrls || []}
                    onUpdate={handleSettingsRefresh as any}
                  />

                  <Separator />
                </>
              )}

              {/* Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.primaryColorCode || '#1976D2'}
                      onChange={e => handleChange('primaryColorCode', e.target.value)}
                      className="h-12 w-12 rounded-lg border border-border cursor-pointer"
                    />
                    <Input value={formData.primaryColorCode || ''} onChange={e => handleChange('primaryColorCode', e.target.value)} placeholder="#1976D2" maxLength={7} className="flex-1" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.secondaryColorCode || '#FFC107'}
                      onChange={e => handleChange('secondaryColorCode', e.target.value)}
                      className="h-12 w-12 rounded-lg border border-border cursor-pointer"
                    />
                    <Input value={formData.secondaryColorCode || ''} onChange={e => handleChange('secondaryColorCode', e.target.value)} placeholder="#FFC107" maxLength={7} className="flex-1" />
                  </div>
                </div>
              </div>

              {/* Color Preview */}
              {(formData.primaryColorCode || formData.secondaryColorCode) && (
                <div className="p-4 rounded-xl border border-border bg-muted/30">
                  <Label className="text-sm text-muted-foreground mb-3 block">Color Preview</Label>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-16 rounded-lg shadow-sm flex items-center justify-center text-white font-semibold text-sm" style={{ backgroundColor: formData.primaryColorCode || '#1976D2' }}>
                      Primary
                    </div>
                    <div className="flex-1 h-16 rounded-lg shadow-sm flex items-center justify-center font-semibold text-sm" style={{ backgroundColor: formData.secondaryColorCode || '#FFC107' }}>
                      Secondary
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location */}
        <TabsContent value="location">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Location & Address</CardTitle>
              <CardDescription>Physical location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} rows={2} placeholder="Street address..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>District</Label>
                  <Input value={formData.district || ''} onChange={e => handleChange('district', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Province</Label>
                  <Input value={formData.province || ''} onChange={e => handleChange('province', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={formData.country || ''} onChange={e => handleChange('country', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Pin Code</Label>
                  <Input value={formData.pinCode || ''} onChange={e => handleChange('pinCode', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About the Institute</CardTitle>
              <CardDescription>Vision, mission, and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Vision</Label>
                <Textarea value={formData.vision || ''} onChange={e => handleChange('vision', e.target.value)} rows={3} placeholder="Institute vision statement..." />
              </div>
              <div className="space-y-2">
                <Label>Mission</Label>
                <Textarea value={formData.mission || ''} onChange={e => handleChange('mission', e.target.value)} rows={3} placeholder="Institute mission statement..." />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} rows={4} placeholder="Brief description of the institute..." />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Online Presence */}
        <TabsContent value="online">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Online Presence</CardTitle>
              <CardDescription>Website and social media links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  Website URL
                </Label>
                <Input value={formData.websiteUrl || ''} onChange={e => handleChange('websiteUrl', e.target.value)} placeholder="https://your-institute.edu" maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Facebook className="h-4 w-4 text-muted-foreground" />
                  Facebook Page
                </Label>
                <Input value={formData.facebookPageUrl || ''} onChange={e => handleChange('facebookPageUrl', e.target.value)} placeholder="https://facebook.com/your-institute" maxLength={255} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Youtube className="h-4 w-4 text-muted-foreground" />
                  YouTube Channel
                </Label>
                <Input value={formData.youtubeChannelUrl || ''} onChange={e => handleChange('youtubeChannelUrl', e.target.value)} placeholder="https://youtube.com/c/your-institute" maxLength={255} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Floating Save Bar */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="bg-card border border-border shadow-2xl rounded-2xl px-6 py-3 flex items-center gap-4">
            <span className="text-sm text-muted-foreground">You have unsaved changes</span>
            <Button size="sm" variant="outline" onClick={loadSettings} disabled={saving}>
              Discard
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstituteSettingsPage;
