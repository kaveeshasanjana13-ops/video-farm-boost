import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getBaseUrl } from './utils/auth.api';

// ═══════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════

export interface TenantBranding {
  id: string;
  name: string;
  code: string;
  tier: 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE' | 'ISOLATED';
  logoUrl: string | null;
  primaryColorCode: string | null;
  secondaryColorCode: string | null;
  loginLogoUrl: string | null;
  loginBackgroundType: 'COLOR' | 'GRADIENT' | 'IMAGE' | 'VIDEO';
  loginBackgroundUrl: string | null;
  loginVideoPosterUrl: string | null;
  loginIllustrationUrl: string | null;
  loginWelcomeTitle: string | null;
  loginWelcomeSubtitle: string | null;
  loginFooterText: string | null;
  loginCustomCss: Record<string, string> | null;
  faviconUrl: string | null;
  customAppName: string | null;
  poweredByVisible: boolean;
}

export type TenantLoginMethod = 'SURAKSHA_WEB' | 'SURAKSHA_APP' | 'SUBDOMAIN' | 'CUSTOM_DOMAIN';

export interface TenantContextType {
  /** Whether we're on a tenant subdomain/custom domain (not the default lms.suraksha.lk) */
  isTenantLogin: boolean;
  /** Detected subdomain (null if default or custom domain) */
  subdomain: string | null;
  /** Detected custom domain (null if default or subdomain) */
  customDomain: string | null;
  /** Determined login method */
  loginMethod: TenantLoginMethod;
  /** Branding data fetched from the API */
  branding: TenantBranding | null;
  /** Loading state while fetching branding */
  isLoading: boolean;
  /** Error if branding fetch failed */
  error: string | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = (): TenantContextType => {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenant must be used within TenantProvider');
  return ctx;
};

// ═══════════════════════════════════════════════════════════════════
// Tenant detection from hostname
// ═══════════════════════════════════════════════════════════════════

interface DetectedTenant {
  subdomain: string | null;
  customDomain: string | null;
  loginMethod: TenantLoginMethod;
  isTenantLogin: boolean;
}

function detectTenant(): DetectedTenant {
  const hostname = window.location.hostname;

  // Skip detection for localhost / dev
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Check for dev override: ?subdomain=academy
    const params = new URLSearchParams(window.location.search);
    const devSubdomain = params.get('subdomain');
    if (devSubdomain) {
      return { subdomain: devSubdomain, customDomain: null, loginMethod: 'SUBDOMAIN', isTenantLogin: true };
    }
    return { subdomain: null, customDomain: null, loginMethod: 'SURAKSHA_WEB', isTenantLogin: false };
  }

  // Dev: handle *.localhost subdomains (e.g. royal-science.localhost:5173)
  const localMatch = hostname.match(/^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.localhost$/i);
  if (localMatch) {
    return { subdomain: localMatch[1].toLowerCase(), customDomain: null, loginMethod: 'SUBDOMAIN', isTenantLogin: true };
  }

  // Check if this is a *.suraksha.lk subdomain
  const surakshaMatch = hostname.match(/^([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)\.suraksha\.lk$/i);
  if (surakshaMatch) {
    const sub = surakshaMatch[1].toLowerCase();
    // Default endpoints — not tenant subdomains
    const defaultSubs = ['lms', 'org', 'admin', 'transport', 'api', 'lmsapi', 'storage', 'www'];
    if (defaultSubs.includes(sub)) {
      return { subdomain: null, customDomain: null, loginMethod: 'SURAKSHA_WEB', isTenantLogin: false };
    }
    return { subdomain: sub, customDomain: null, loginMethod: 'SUBDOMAIN', isTenantLogin: true };
  }

  // Not a suraksha.lk domain — treat as custom domain
  return { subdomain: null, customDomain: hostname, loginMethod: 'CUSTOM_DOMAIN', isTenantLogin: true };
}

// ═══════════════════════════════════════════════════════════════════
// Provider
// ═══════════════════════════════════════════════════════════════════

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const detected = useMemo(() => detectTenant(), []);
  const [branding, setBranding] = useState<TenantBranding | null>(null);
  const [isLoading, setIsLoading] = useState(detected.isTenantLogin);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detected.isTenantLogin) return;

    let isMounted = true;

    const fetchBranding = async () => {
      try {
        const baseUrl = getBaseUrl();
        let url: string;

        if (detected.subdomain) {
          url = `${baseUrl}/v2/tenant/branding/subdomain/${encodeURIComponent(detected.subdomain)}`;
        } else if (detected.customDomain) {
          url = `${baseUrl}/v2/tenant/branding/domain/${encodeURIComponent(detected.customDomain)}`;
        } else {
          return;
        }

        const res = await fetch(url);
        if (!isMounted) return;
        if (!res.ok) {
          if (res.status === 404) {
            setError('Institute not found for this domain');
          } else {
            setError('Failed to load institute branding');
          }
          return;
        }
        const data: TenantBranding = await res.json();
        if (!isMounted) return;
        setBranding(data);

        // Apply favicon if provided
        if (data.faviconUrl) {
          const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
          if (link) link.href = data.faviconUrl;
        }

        // Apply custom app name
        if (data.customAppName) {
          document.title = data.customAppName;
        }
      } catch (err) {
        if (isMounted) setError('Failed to connect to server');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchBranding();

    return () => {
      isMounted = false;
    };
  }, [detected]);

  const value: TenantContextType = useMemo(() => ({
    isTenantLogin: detected.isTenantLogin,
    subdomain: detected.subdomain,
    customDomain: detected.customDomain,
    loginMethod: detected.loginMethod,
    branding,
    isLoading,
    error,
  }), [detected, branding, isLoading, error]);

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};
