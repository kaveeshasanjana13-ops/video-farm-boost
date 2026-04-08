import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { SafeImage } from '@/components/ui/SafeImage';
import ImageCropUpload from '@/components/common/ImageCropUpload';
import { ImageFieldUploader } from '@/components/institute-settings/ImageFieldUploader';
import { BrandingImageUploader } from '@/components/institute-settings/BrandingImageUploader';
import { GalleryManager } from '@/components/institute-settings/GalleryManager';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { tenantApi, type LoginBrandingData, type TenantSettingsResponse, type SmsSettingsResponse, type PlanInfoResponse } from '@/api/tenant.api';
import {
  Building2, Mail, Phone, MapPin, Globe, Facebook, Youtube,
  Palette, Save, Loader2, Eye, Image, Settings, RefreshCw,
  CheckCircle, AlertCircle, ChevronRight, Server, Link2, Sparkles,
  MessageSquare, Shield, Crown, Zap, Lock
} from 'lucide-react';
import InstituteDriveSettings from '@/components/institute-settings/InstituteDriveSettings';

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
  // Multi-tenant fields
  tier?: string;
  subdomain?: string | null;
  customDomain?: string | null;
  customDomainVerified?: boolean;
  customLoginEnabled?: boolean;
  isVisibleInApp?: boolean;
  isVisibleInWebSelector?: boolean;
  loginLogoUrl?: string | null;
  loginBackgroundType?: string;
  loginBackgroundUrl?: string | null;
  loginVideoPosterUrl?: string | null;
  loginIllustrationUrl?: string | null;
  loginWelcomeTitle?: string | null;
  loginWelcomeSubtitle?: string | null;
  loginFooterText?: string | null;
  faviconUrl?: string | null;
  customAppName?: string | null;
  poweredByVisible?: boolean;
}

const VALID_TABS = ['basic', 'branding', 'tenant', 'location', 'about', 'online', 'sms', 'integrations'];

const InstituteSettingsPage = () => {
  const { currentInstituteId, selectedInstitute } = useAuth();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [settings, setSettings] = useState<InstituteSettings | null>(null);
  const [formData, setFormData] = useState<Partial<InstituteSettings>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const isMobile = useIsMobile();

  // Read initial tab from URL query param
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'basic';
  const [mobileSection, setMobileSection] = useState<string | null>(() => {
    if (isMobile && tabParam && VALID_TABS.includes(tabParam)) return tabParam;
    return null;
  });
  const [activeTab, setActiveTab] = useState(initialTab);

  // Sync tab to URL when it changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('tab', tab);
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  const handleMobileSection = useCallback((section: string | null) => {
    setMobileSection(section);
    if (section) {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set('tab', section);
        return next;
      }, { replace: true });
    }
  }, [setSearchParams]);

  // Tenant-specific state
  const [tenantSaving, setTenantSaving] = useState(false);
  const [subdomainInput, setSubdomainInput] = useState('');
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [subdomainChecking, setSubdomainChecking] = useState(false);
  const [brandingForm, setBrandingForm] = useState<LoginBrandingData>({});
  const [visibleInApp, setVisibleInApp] = useState(true);
  const [visibleInWeb, setVisibleInWeb] = useState(true);

  // SMS & Plan state
  const [smsSettings, setSmsSettings] = useState<SmsSettingsResponse | null>(null);
  const [planInfo, setPlanInfo] = useState<PlanInfoResponse | null>(null);
  const [smsSaving, setSmsSaving] = useState(false);
  const [selectedSmsMask, setSelectedSmsMask] = useState<string>('__default__');

  // Computed tier helpers (must be after planInfo/settings state declarations)
  const effectiveTier = planInfo?.tier || settings?.tier || 'FREE';
  const isFree = effectiveTier === 'FREE';
  const isStarter = effectiveTier === 'STARTER';
  const hasSubdomain = planInfo?.features?.subdomain ?? !isFree;
  const hasLoginBranding = planInfo?.features?.loginBranding ?? !isFree;
  const hasCustomDomain = planInfo?.features?.customDomain ?? (effectiveTier === 'ENTERPRISE' || effectiveTier === 'ISOLATED');
  const hasVideoBackground = planInfo?.features?.videoBackground ?? (effectiveTier === 'PROFESSIONAL' || effectiveTier === 'ENTERPRISE' || effectiveTier === 'ISOLATED');
  const hasSmsMasking = planInfo?.features?.smsMasking ?? !isFree;

  const loadSettings = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const [response, smsRes, planRes] = await Promise.all([
        enhancedCachedClient.get<InstituteSettings>(
          `/institutes/${currentInstituteId}/settings`,
          {},
          { ttl: CACHE_TTL.SETTINGS, forceRefresh: true, instituteId: currentInstituteId }
        ),
        tenantApi.getSmsSettings(currentInstituteId).catch(() => null),
        tenantApi.getPlanInfo(currentInstituteId, true).catch(() => null),
      ]);
      setSettings(response);
      setFormData(response);
      setHasChanges(false);
      if (smsRes) {
        setSmsSettings(smsRes);
        setSelectedSmsMask(smsRes.smsSenderName || '__default__');
      }
      if (planRes) setPlanInfo(planRes);
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

  // Sync tenant state when settings load
  useEffect(() => {
    if (settings) {
      setSubdomainInput(settings.subdomain || '');
      setVisibleInApp(settings.isVisibleInApp ?? true);
      setVisibleInWeb(settings.isVisibleInWebSelector ?? true);
      setBrandingForm({
        loginLogoUrl: settings.loginLogoUrl,
        loginBackgroundType: (settings.loginBackgroundType as LoginBrandingData['loginBackgroundType']) || 'COLOR',
        loginBackgroundUrl: settings.loginBackgroundUrl,
        loginVideoPosterUrl: settings.loginVideoPosterUrl,
        loginIllustrationUrl: settings.loginIllustrationUrl,
        loginWelcomeTitle: settings.loginWelcomeTitle,
        loginWelcomeSubtitle: settings.loginWelcomeSubtitle,
        loginFooterText: settings.loginFooterText,
        faviconUrl: settings.faviconUrl,
        customAppName: settings.customAppName,
        poweredByVisible: settings.poweredByVisible ?? true,
      });
    }
  }, [settings]);

  const handleCheckSubdomain = async () => {
    const value = subdomainInput.trim().toLowerCase();
    if (!value) return;
    setSubdomainChecking(true);
    try {
      const res = await tenantApi.checkSubdomainAvailability(value);
      setSubdomainAvailable(res.available);
    } catch {
      toast({ title: 'Error', description: 'Failed to check subdomain', variant: 'destructive' });
    } finally {
      setSubdomainChecking(false);
    }
  };

  const handleSetSubdomain = async () => {
    if (!currentInstituteId || !subdomainInput.trim()) return;
    setTenantSaving(true);
    try {
      const res = await tenantApi.setSubdomain(currentInstituteId, subdomainInput.trim().toLowerCase());
      toast({ title: 'Success', description: `Subdomain set! Your login URL: ${res.url}` });
      loadSettings();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to set subdomain', variant: 'destructive' });
    } finally {
      setTenantSaving(false);
    }
  };

  const handleRemoveSubdomain = async () => {
    if (!currentInstituteId) return;
    setTenantSaving(true);
    try {
      await tenantApi.removeSubdomain(currentInstituteId);
      toast({ title: 'Success', description: 'Subdomain removed' });
      loadSettings();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to remove subdomain', variant: 'destructive' });
    } finally {
      setTenantSaving(false);
    }
  };

  const handleSaveBranding = async () => {
    if (!currentInstituteId) return;
    setTenantSaving(true);
    try {
      await tenantApi.updateLoginBranding(currentInstituteId, brandingForm);
      toast({ title: 'Success', description: 'Login branding updated' });
      loadSettings();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update branding', variant: 'destructive' });
    } finally {
      setTenantSaving(false);
    }
  };

  const handleSaveVisibility = async () => {
    if (!currentInstituteId) return;
    setTenantSaving(true);
    try {
      await tenantApi.updateVisibility(currentInstituteId, { isVisibleInApp: visibleInApp, isVisibleInWebSelector: visibleInWeb });
      toast({ title: 'Success', description: 'Visibility settings updated' });
      loadSettings();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update visibility', variant: 'destructive' });
    } finally {
      setTenantSaving(false);
    }
  };

  const handleSaveSmsSettings = async () => {
    if (!currentInstituteId) return;
    setSmsSaving(true);
    try {
      const result = await tenantApi.updateSmsSettings(currentInstituteId, {
        smsSenderName: selectedSmsMask === '__default__' ? null : (selectedSmsMask || null),
      });
      setSmsSettings(result);
      toast({ title: 'Success', description: 'SMS settings updated' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message || 'Failed to update SMS settings', variant: 'destructive' });
    } finally {
      setSmsSaving(false);
    }
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
      {isMobile && !mobileSection ? (
        <div className="divide-y divide-border/40 border border-border/50 rounded-xl overflow-hidden bg-card/50 mt-4">
          {[
            { id: 'basic', icon: Building2, label: 'Basic Information', description: 'Name, email, contact details', color: 'text-blue-500' },
            { id: 'branding', icon: Palette, label: 'Branding', description: 'Logo, colors, cover image', color: 'text-pink-500' },
            { id: 'tenant', icon: Globe, label: 'Domain & Login Page', description: 'Subdomain, login branding, visibility', color: 'text-cyan-500' },
            { id: 'sms', icon: MessageSquare, label: 'SMS & Messaging', description: 'Sender name, masks, notifications', color: 'text-green-500' },
            { id: 'location', icon: MapPin, label: 'Location & Address', description: 'Address, city, district', color: 'text-amber-500' },
            { id: 'about', icon: Eye, label: 'About', description: 'Vision, mission, and description', color: 'text-emerald-500' },
            { id: 'online', icon: Globe, label: 'Online Presence', description: 'Website & social media links', color: 'text-violet-500' },
            { id: 'integrations', icon: Link2, label: 'Integrations', description: 'Google Drive & third-party apps', color: 'text-blue-500' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMobileSection(item.id)}
                className="w-full flex items-center gap-4 px-4 py-4 text-left active:bg-muted/60 transition-colors"
                type="button"
              >
                <div className={`p-2.5 rounded-xl bg-muted/60 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </button>
            );
          })}
        </div>
      ) : (
        <div className={isMobile ? "space-y-4 mt-4" : "mt-4"}>
          {isMobile && mobileSection && (
            <div className="flex items-center mb-4">
              <button
                onClick={() => handleMobileSection(null)}
                className="flex items-center gap-2 text-sm font-medium text-primary active:opacity-70 transition-opacity"
                type="button"
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
                Back to Menu
              </button>
            </div>
          )}
          {isMobile && mobileSection && (
            <h2 className="text-lg font-bold text-foreground mb-4">
              {mobileSection === 'basic' && 'Basic Information'}
              {mobileSection === 'branding' && 'Branding'}
              {mobileSection === 'tenant' && 'Domain & Login Page'}
              {mobileSection === 'sms' && 'SMS & Messaging'}
              {mobileSection === 'location' && 'Location & Address'}
              {mobileSection === 'about' && 'About'}
              {mobileSection === 'online' && 'Online Presence'}
              {mobileSection === 'integrations' && 'Integrations'}
            </h2>
          )}
          <Tabs value={isMobile ? mobileSection : activeTab} onValueChange={handleTabChange} className="w-full">
            {!isMobile && (
              <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 h-auto">
                <TabsTrigger value="basic" className="text-xs sm:text-sm">
                  <Building2 className="h-4 w-4 mr-1.5 hidden sm:block" />Basic
                </TabsTrigger>
                <TabsTrigger value="branding" className="text-xs sm:text-sm">
                  <Palette className="h-4 w-4 mr-1.5 hidden sm:block" />Branding
                </TabsTrigger>
                <TabsTrigger value="tenant" className="text-xs sm:text-sm">
                  <Globe className="h-4 w-4 mr-1.5 hidden sm:block" />Domain
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
                <TabsTrigger value="sms" className="text-xs sm:text-sm">
                  <MessageSquare className="h-4 w-4 mr-1.5 hidden sm:block" />SMS
                </TabsTrigger>
                <TabsTrigger value="integrations" className="text-xs sm:text-sm">
                  <Link2 className="h-4 w-4 mr-1.5 hidden sm:block" />Integrations
                </TabsTrigger>
              </TabsList>
            )}

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

        {/* ═══ TENANT & DOMAIN TAB ═══ */}
        <TabsContent value="tenant">
          <div className="space-y-6">
            {/* Tier & Plan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Current Plan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge className={`text-sm px-3 py-1 ${
                    effectiveTier === 'ENTERPRISE' ? 'bg-orange-100 text-orange-700' :
                    effectiveTier === 'PROFESSIONAL' ? 'bg-purple-100 text-purple-700' :
                    effectiveTier === 'STARTER' ? 'bg-blue-100 text-blue-700' :
                    effectiveTier === 'ISOLATED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {effectiveTier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {effectiveTier === 'ENTERPRISE' ? 'Custom domain + full branding' :
                     effectiveTier === 'PROFESSIONAL' ? 'Video backgrounds + advanced branding' :
                     effectiveTier === 'STARTER' ? 'Subdomain + basic login branding' :
                     effectiveTier === 'ISOLATED' ? 'Full white-label' :
                     'Default login via lms.suraksha.lk'}
                  </span>
                </div>
                {planInfo?.features && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                    {[
                      { key: 'subdomain', label: 'Custom Subdomain' },
                      { key: 'customDomain', label: 'Custom Domain' },
                      { key: 'loginBranding', label: 'Login Branding' },
                      { key: 'videoBackground', label: 'Video Background' },
                      { key: 'smsMasking', label: 'Custom SMS Sender' },
                      { key: 'whiteLabel', label: 'White Label' },
                    ].map(f => (
                      <div key={f.key} className={`flex items-center gap-2 text-sm ${(planInfo.features as any)[f.key] ? 'text-green-600' : 'text-muted-foreground'}`}>
                        {(planInfo.features as any)[f.key] ? <CheckCircle className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        {f.label}
                      </div>
                    ))}
                  </div>
                )}
                {isFree && (
                  <div className="mt-4 p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      Your institute uses the default login at <strong>lms.suraksha.lk</strong>. Upgrade to <strong>Starter</strong> or higher to get a custom subdomain, login branding, and more.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contact your system administrator to upgrade your plan.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Visibility — always visible, always locked (admin-only) */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Visibility
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </CardTitle>
                <CardDescription>Control where your institute appears</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Visibility settings can only be changed by a system administrator. Contact your admin if you need to update these.
                  </p>
                </div>
                <div className="flex items-center justify-between opacity-60">
                  <div>
                    <Label>Visible in Mobile App</Label>
                    <p className="text-xs text-muted-foreground">Show in the app's institute selector</p>
                  </div>
                  <Switch checked={visibleInApp} disabled />
                </div>
                <div className="flex items-center justify-between opacity-60">
                  <div>
                    <Label>Visible in Web Selector</Label>
                    <p className="text-xs text-muted-foreground">Show in the web institute search/selector</p>
                  </div>
                  <Switch checked={visibleInWeb} disabled />
                </div>
              </CardContent>
            </Card>

            {isFree ? null : (
              <>
                {/* Subdomain Management — STARTER+ */}
                {hasSubdomain && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 className="h-5 w-5" />
                        Custom Subdomain
                      </CardTitle>
                      <CardDescription>
                        Set a custom login URL for your institute (e.g., academy.suraksha.lk)
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {settings.subdomain ? (
                        <div className="p-4 rounded-lg border border-green-200 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-medium text-sm">Active Subdomain</span>
                          </div>
                          <p className="text-sm font-mono text-green-700 dark:text-green-400">
                            https://{settings.subdomain}.suraksha.lk
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Students and staff can use this URL to access your branded login page.
                          </p>
                        </div>
                      ) : null}
                      <div className="space-y-2">
                        <Label>Subdomain</Label>
                        <div className="flex gap-2">
                          <Input
                            value={subdomainInput}
                            onChange={(e) => { setSubdomainInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')); setSubdomainAvailable(null); }}
                            placeholder="your-institute"
                            className="flex-1"
                            maxLength={63}
                          />
                          <span className="flex items-center text-sm text-muted-foreground whitespace-nowrap">.suraksha.lk</span>
                          <Button variant="outline" size="sm" onClick={handleCheckSubdomain} disabled={!subdomainInput.trim() || subdomainChecking}>
                            {subdomainChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
                          </Button>
                        </div>
                        {subdomainAvailable !== null && (
                          <p className={`text-sm flex items-center gap-1.5 ${subdomainAvailable ? 'text-green-600' : 'text-red-600'}`}>
                            {subdomainAvailable ? <><CheckCircle className="h-3.5 w-3.5" /> Available</> : <><AlertCircle className="h-3.5 w-3.5" /> Taken or reserved</>}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Only lowercase letters, numbers, and hyphens. Must start/end with a letter or number.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSetSubdomain} disabled={tenantSaving || !subdomainInput.trim()}>
                          {tenantSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          {settings.subdomain ? 'Update Subdomain' : 'Set Subdomain'}
                        </Button>
                        {settings.subdomain && (
                          <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleRemoveSubdomain} disabled={tenantSaving}>
                            Remove
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Custom Domain — ENTERPRISE+ */}
                {hasCustomDomain && settings.customDomain && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Server className="h-5 w-5" />
                        Custom Domain
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">{settings.customDomain}</Badge>
                        {settings.customDomainVerified ? (
                          <Badge className="bg-green-100 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" /> Verified
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Pending Verification</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Custom domains are managed by system administrators. Contact support to configure or verify your domain.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Login Page Branding — STARTER+ */}
                {hasLoginBranding && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        Login Page Branding
                      </CardTitle>
                      <CardDescription>
                        Customize the appearance of your institute's login page
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Welcome Title</Label>
                          <Input
                            value={brandingForm.loginWelcomeTitle || ''}
                            onChange={e => setBrandingForm(prev => ({ ...prev, loginWelcomeTitle: e.target.value }))}
                            placeholder="Welcome to Academy"
                            maxLength={200}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Custom App Name</Label>
                          <Input
                            value={brandingForm.customAppName || ''}
                            onChange={e => setBrandingForm(prev => ({ ...prev, customAppName: e.target.value }))}
                            placeholder="Academy LMS"
                            maxLength={100}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Welcome Subtitle</Label>
                        <Input
                          value={brandingForm.loginWelcomeSubtitle || ''}
                          onChange={e => setBrandingForm(prev => ({ ...prev, loginWelcomeSubtitle: e.target.value }))}
                          placeholder="Sign in to access your courses"
                          maxLength={500}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Footer Text</Label>
                        <Input
                          value={brandingForm.loginFooterText || ''}
                          onChange={e => setBrandingForm(prev => ({ ...prev, loginFooterText: e.target.value }))}
                          placeholder="© 2026 Academy. All rights reserved."
                          maxLength={200}
                        />
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <BrandingImageUploader
                          currentUrl={brandingForm.loginLogoUrl}
                          label="Login Logo"
                          description="Logo displayed on the login page"
                          accept="image/*"
                          disabled={false}
                          onUploaded={(url) => setBrandingForm(prev => ({ ...prev, loginLogoUrl: url }))}
                          onRemoved={() => setBrandingForm(prev => ({ ...prev, loginLogoUrl: '' }))}
                        />
                        <BrandingImageUploader
                          currentUrl={brandingForm.faviconUrl}
                          label="Favicon"
                          description="Browser tab icon"
                          accept="image/png,image/x-icon,image/svg+xml,image/*"
                          disabled={false}
                          onUploaded={(url) => setBrandingForm(prev => ({ ...prev, faviconUrl: url }))}
                          onRemoved={() => setBrandingForm(prev => ({ ...prev, faviconUrl: '' }))}
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label>Background Type</Label>
                        <Select
                          value={brandingForm.loginBackgroundType || 'COLOR'}
                          onValueChange={(v) => setBrandingForm(prev => ({ ...prev, loginBackgroundType: v as LoginBrandingData['loginBackgroundType'] }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="COLOR">Solid Color</SelectItem>
                            <SelectItem value="GRADIENT">Gradient</SelectItem>
                            <SelectItem value="IMAGE">Image</SelectItem>
                            {hasVideoBackground && <SelectItem value="VIDEO">Video</SelectItem>}
                          </SelectContent>
                        </Select>
                        {!hasVideoBackground && (
                          <p className="text-xs text-muted-foreground">Video backgrounds require Professional tier or higher.</p>
                        )}
                      </div>

                      {(brandingForm.loginBackgroundType === 'IMAGE' || brandingForm.loginBackgroundType === 'VIDEO') && (
                        <BrandingImageUploader
                          currentUrl={brandingForm.loginBackgroundUrl}
                          label={`Background ${brandingForm.loginBackgroundType === 'VIDEO' ? 'Video' : 'Image'}`}
                          description={brandingForm.loginBackgroundType === 'VIDEO' ? 'Upload a background video' : 'Upload a background image'}
                          accept={brandingForm.loginBackgroundType === 'VIDEO' ? 'video/*' : 'image/*'}
                          disabled={false}
                          onUploaded={(url) => setBrandingForm(prev => ({ ...prev, loginBackgroundUrl: url }))}
                          onRemoved={() => setBrandingForm(prev => ({ ...prev, loginBackgroundUrl: '' }))}
                        />
                      )}

                      {brandingForm.loginBackgroundType === 'VIDEO' && (
                        <BrandingImageUploader
                          currentUrl={brandingForm.loginVideoPosterUrl}
                          label="Video Poster Image"
                          description="Shown while the background video loads"
                          accept="image/*"
                          disabled={false}
                          onUploaded={(url) => setBrandingForm(prev => ({ ...prev, loginVideoPosterUrl: url }))}
                          onRemoved={() => setBrandingForm(prev => ({ ...prev, loginVideoPosterUrl: '' }))}
                        />
                      )}

                      <BrandingImageUploader
                        currentUrl={brandingForm.loginIllustrationUrl}
                        label="Login Illustration"
                        description="Decorative illustration shown on the login page"
                        accept="image/*"
                        disabled={false}
                        onUploaded={(url) => setBrandingForm(prev => ({ ...prev, loginIllustrationUrl: url }))}
                        onRemoved={() => setBrandingForm(prev => ({ ...prev, loginIllustrationUrl: '' }))}
                      />

                      <Separator />

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Show "Powered by SurakshaLMS"</Label>
                          <p className="text-xs text-muted-foreground">Display the SurakshaLMS badge on your login page</p>
                        </div>
                        <Switch
                          checked={brandingForm.poweredByVisible ?? true}
                          onCheckedChange={v => setBrandingForm(prev => ({ ...prev, poweredByVisible: v }))}
                          disabled={isStarter}
                        />
                        {isStarter && (
                          <p className="text-xs text-muted-foreground">Requires Professional tier</p>
                        )}
                      </div>

                      <Button onClick={handleSaveBranding} disabled={tenantSaving}>
                        {tenantSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Login Branding
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Visibility already shown above (locked for all tiers) */}
              </>
            )}
          </div>
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

        {/* ═══ SMS & MESSAGING TAB ═══ */}
        <TabsContent value="sms">
          <div className="space-y-6">
            {/* Current Plan for SMS */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Plan & SMS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={`text-sm px-3 py-1 ${
                    effectiveTier === 'ENTERPRISE' ? 'bg-orange-100 text-orange-700' :
                    effectiveTier === 'PROFESSIONAL' ? 'bg-purple-100 text-purple-700' :
                    effectiveTier === 'STARTER' ? 'bg-blue-100 text-blue-700' :
                    effectiveTier === 'ISOLATED' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {effectiveTier}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {hasSmsMasking ? 'Custom SMS Sender Available' : 'Default SMS Sender Only'}
                  </span>
                </div>
                {isFree && (
                  <div className="mt-2 p-3 rounded-lg border border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-800">
                    <p className="text-sm text-amber-700 dark:text-amber-400">
                      SMS messages are sent using the default <strong>SurakshaLMS</strong> sender. Upgrade to Starter or higher for custom SMS sender names.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* SMS Sender Configuration — STARTER+ only */}
            {hasSmsMasking ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    SMS Sender Name
                  </CardTitle>
                  <CardDescription>
                    Choose which sender name appears when your institute sends SMS messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Current SMS Sender</span>
                    </div>
                    <p className="text-lg font-mono font-semibold text-primary">
                      {smsSettings?.effectiveSmsSender || 'SurakshaLMS'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This is the name recipients see when receiving SMS from your institute
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Select SMS Sender</Label>
                    <Select
                      value={selectedSmsMask}
                      onValueChange={setSelectedSmsMask}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose sender name..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__default__">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            SurakshaLMS (Default)
                          </div>
                        </SelectItem>
                        {smsSettings?.activeMasks?.map(mask => (
                          <SelectItem key={mask.maskId} value={mask.maskId}>
                            <div className="flex items-center gap-2">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              {mask.maskId}
                              {mask.displayName && <span className="text-muted-foreground">({mask.displayName})</span>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {smsSettings?.activeMasks?.length
                        ? `You have ${smsSettings.activeMasks.length} approved custom sender mask(s). Select one or use the default "SurakshaLMS".`
                        : 'No custom sender masks available. Contact your administrator to request a custom sender mask.'}
                    </p>
                  </div>

                  <Button onClick={handleSaveSmsSettings} disabled={smsSaving}>
                    {smsSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                    Save SMS Settings
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <Lock className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm font-medium">Custom SMS sender requires Starter plan or higher</p>
                  <p className="text-xs text-muted-foreground mt-1">Contact your system administrator to upgrade.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold">Integrations</h2>
              <p className="text-sm text-muted-foreground">Connect third-party services to enhance your institute's capabilities.</p>
            </div>
            {currentInstituteId && settings && (
              <InstituteDriveSettings
                instituteId={currentInstituteId}
                instituteName={settings.name}
                isAdmin={true}
              />
            )}
          </div>
        </TabsContent>
          </Tabs>
        </div>
      )}

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
