import { LoginCredentials, ApiResponse, ApiUserResponse } from '../types/auth.types';
import { tokenStorageService, isNativePlatform, getAuthHeadersSync } from '@/services/tokenStorageService';

// ============= BASE URL CONFIGURATION =============

export const getBaseUrl = (): string => {
  return import.meta.env.VITE_LMS_BASE_URL || 'https://lmsapi.suraksha.lk';
};

export const getBaseUrl2 = (): string => {
  const storedUrl = localStorage.getItem('baseUrl2');
  if (storedUrl) return storedUrl;
  const envUrl = import.meta.env.VITE_API_BASE_URL_2;
  if (envUrl) return envUrl;
  return '';
};

export const getAttendanceUrl = (): string => {
  return import.meta.env.VITE_ATTENDANCE_BASE_URL || 'https://lmsapi.suraksha.lk';
};

// ============= API HEADERS =============

/** @deprecated Use getApiHeadersAsync() */
export const getApiHeaders = (): Record<string, string> => {
  return getAuthHeadersSync();
};

export const getApiHeadersAsync = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const token = await tokenStorageService.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getCredentialsMode = (): RequestCredentials => {
  return isNativePlatform() ? 'omit' : 'include';
};

// ============= ORG TOKEN HELPERS =============

export const getOrgAccessTokenAsync = async (): Promise<string | null> => {
  if (isNativePlatform()) {
    try {
      const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
      const result = await SecureStoragePlugin.get({ key: 'org_access_token' });
      return result.value;
    } catch {
      return null;
    }
  }
  return localStorage.getItem('org_access_token');
};

export const setOrgAccessTokenAsync = async (token: string): Promise<void> => {
  if (isNativePlatform()) {
    const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
    await SecureStoragePlugin.set({ key: 'org_access_token', value: token });
  } else {
    localStorage.setItem('org_access_token', token);
  }
};

export const removeOrgAccessTokenAsync = async (): Promise<void> => {
  if (isNativePlatform()) {
    try {
      const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
      await SecureStoragePlugin.remove({ key: 'org_access_token' });
    } catch {
      // Key didn't exist
    }
  } else {
    localStorage.removeItem('org_access_token');
  }
};

// ============= TOKEN REFRESH STATE (Singleton) =============

let isRefreshing = false;
let refreshPromise: Promise<ApiUserResponse> | null = null;

// ============= LOGIN =============

export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl();
  const isMobile = isNativePlatform();

  const loginEndpoint = isMobile ? '/v2/auth/login/mobile' : '/v2/auth/login';

  // Store rememberMe preference BEFORE the request (so it's available for token storage)
  await tokenStorageService.setRememberMe(!!credentials.rememberMe);

  const response = await fetch(`${baseUrl}${loginEndpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: isMobile ? 'omit' : 'include',
    body: JSON.stringify({
      identifier: credentials.identifier,
      password: credentials.password,
      rememberMe: !!credentials.rememberMe,
      remember_me: !!credentials.rememberMe,
      ...(isMobile && { deviceId: await tokenStorageService.getDeviceId() })
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Login failed: ${response.status}`);
  }

  const data = await response.json();

  // Store access token in memory (web) or native storage (mobile)
  if (data.access_token) {
    await tokenStorageService.setAccessToken(data.access_token);
  }

  // Store refresh token (mobile always; web when rememberMe for cookie fallback)
  if (data.refresh_token) {
    await tokenStorageService.setRefreshToken(data.refresh_token);
  }

  // Store token expiry
  if (data.expires_in) {
    const expiryTimestamp = Date.now() + (data.expires_in * 1000);
    await tokenStorageService.setTokenExpiry(expiryTimestamp);
  }

  // Store minimal user data
  if (data.user) {
    await tokenStorageService.setUserData({
      id: data.user.id,
      email: data.user.email,
      nameWithInitials: data.user.nameWithInitials,
      userType: data.user.userType,
      imageUrl: data.user.imageUrl
    });
  }

  return data;
};

// ============= TOKEN REFRESH (Singleton Pattern) =============

/**
 * Refresh access token
 * - Web: POST /v2/auth/refresh with httpOnly cookie (credentials: 'include')
 * - Mobile: POST /auth/refresh/mobile with refresh_token in body
 * Singleton pattern prevents concurrent refresh requests.
 */
export const refreshAccessToken = async (): Promise<ApiUserResponse> => {
  const baseUrl = getBaseUrl();
  const isMobile = isNativePlatform();

  // Reuse in-flight refresh
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = (async () => {
    try {
      let response: Response;

      if (isMobile) {
        // Mobile: always use stored refresh token
        const refreshToken = await tokenStorageService.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        response = await fetch(`${baseUrl}/auth/refresh/mobile`, {
          method: 'POST',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refresh_token: refreshToken,
            deviceId: await tokenStorageService.getDeviceId()
          })
        });
      } else {
        // Web: try cookie-based refresh first
        response = await fetch(`${baseUrl}/v2/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });

        // If cookie-based refresh fails, try stored refresh token as fallback
        if (!response.ok) {
          console.log('🔁 Cookie-based refresh failed, trying stored refresh token...');
          const storedRefreshToken = await tokenStorageService.getRefreshToken();
          if (storedRefreshToken) {
            response = await fetch(`${baseUrl}/v2/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: storedRefreshToken })
            });
          }
        }
      }

      if (!response.ok) {
        console.error('❌ Token refresh failed:', response.status);
        await clearAuthData();
        window.dispatchEvent(new CustomEvent('auth:refresh-failed'));
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      // Store new access token
      if (data.access_token) {
        await tokenStorageService.setAccessToken(data.access_token);
      }

      // Store new refresh token (token rotation — both web and mobile)
      if (data.refresh_token) {
        await tokenStorageService.setRefreshToken(data.refresh_token);
      }

      // Update token expiry
      if (data.expires_in) {
        const expiryTimestamp = Date.now() + (data.expires_in * 1000);
        await tokenStorageService.setTokenExpiry(expiryTimestamp);
      }

      // Update user data
      if (data.user) {
        await tokenStorageService.setUserData({
          id: data.user.id,
          email: data.user.email,
          nameWithInitials: data.user.nameWithInitials,
          userType: data.user.userType,
          imageUrl: data.user.imageUrl
        });
      }

      // Notify AuthContext
      window.dispatchEvent(new CustomEvent('auth:refresh-success', {
        detail: { user: data.user }
      }));

      return data.user;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// ============= TOKEN VALIDATION =============

export const validateToken = async (): Promise<ApiUserResponse> => {
  const baseUrl = getBaseUrl();
  const isMobile = isNativePlatform();

  const token = await tokenStorageService.getAccessToken();
  const cachedUserData = await tokenStorageService.getUserData();

  // If token is expired or near-expiry, refresh first
  const expiry = await tokenStorageService.getTokenExpiry();
  if (token && expiry && Date.now() >= (expiry - 60_000)) {
    return await refreshAccessToken();
  }

  // If no access token in memory, try refresh (cookie-based on web)
  if (!token) {
    try {
      return await refreshAccessToken();
    } catch {
      throw new Error('No authentication token found');
    }
  }

  // If user data cached, return it
  if (cachedUserData) {
    return cachedUserData;
  }

  // Fetch from /auth/me
  try {
    const headers = await getApiHeadersAsync();
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers,
      credentials: isMobile ? 'omit' : 'include'
    });

    if (response.status === 401) {
      return await refreshAccessToken();
    }

    if (!response.ok) {
      await clearAuthData();
      throw new Error(`Token validation failed: ${response.status}`);
    }

    const responseData = await response.json();
    const userData = responseData.data || responseData;

    await tokenStorageService.setUserData({
      id: userData.id,
      email: userData.email,
      nameWithInitials: userData.nameWithInitials,
      userType: userData.userType,
      imageUrl: userData.imageUrl
    });

    return userData;
  } catch (error) {
    await clearAuthData();
    throw error;
  }
};

// ============= LOGOUT =============

export const logoutUser = async (): Promise<void> => {
  const baseUrl = getBaseUrl();
  const isMobile = isNativePlatform();

  try {
    if (isMobile) {
      const refreshToken = await tokenStorageService.getRefreshToken();
      if (refreshToken) {
        await fetch(`${baseUrl}/auth/logout/mobile`, {
          method: 'POST',
          credentials: 'omit',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            refresh_token: refreshToken,
            deviceId: await tokenStorageService.getDeviceId()
          })
        });
      }
    } else {
      await fetch(`${baseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch {
    // Ignore — token will expire
  }

  await clearAuthData();
};

// ============= SESSION MANAGEMENT =============

export const getActiveSessions = async (params?: { page?: number; limit?: number; platform?: string; sortBy?: string; sortOrder?: string }): Promise<{ sessions: any[]; pagination?: any; summary?: any }> => {
  const baseUrl = getBaseUrl();
  const headers = await getApiHeadersAsync();
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.platform) query.set('platform', params.platform);
  if (params?.sortBy) query.set('sortBy', params.sortBy);
  if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
  const qs = query.toString();
  const response = await fetch(`${baseUrl}/auth/sessions${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers,
    credentials: getCredentialsMode()
  });
  if (!response.ok) throw new Error('Failed to load sessions');
  const data = await response.json();
  return {
    sessions: data.sessions || data.data || (Array.isArray(data) ? data : []),
    pagination: data.pagination,
    summary: data.summary
  };
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  const baseUrl = getBaseUrl();
  const headers = await getApiHeadersAsync();
  const response = await fetch(`${baseUrl}/auth/sessions/revoke/${sessionId}`, {
    method: 'POST',
    headers,
    credentials: getCredentialsMode()
  });
  if (!response.ok) throw new Error('Failed to revoke session');
};

export const revokeAllSessions = async (): Promise<void> => {
  const baseUrl = getBaseUrl();
  const headers = await getApiHeadersAsync();
  const response = await fetch(`${baseUrl}/auth/sessions/revoke-all`, {
    method: 'POST',
    headers,
    credentials: getCredentialsMode()
  });
  if (!response.ok) throw new Error('Failed to revoke all sessions');
};

// ============= HELPERS =============

const clearAuthData = async (): Promise<void> => {
  await tokenStorageService.clearAll();
  if (!isNativePlatform()) {
    localStorage.removeItem('selectedInstitute');
    localStorage.removeItem('selectedClass');
    localStorage.removeItem('selectedSubject');
    localStorage.removeItem('selectedChild');
    localStorage.removeItem('selectedOrganization');
  }
};

export const isAuthenticatedAsync = async (): Promise<boolean> => {
  return await tokenStorageService.isAuthenticated();
};

/** @deprecated Use isAuthenticatedAsync() */
export const isAuthenticated = (): boolean => {
  return !!tokenStorageService.getAccessTokenSync();
};

export const getAccessTokenAsync = async (): Promise<string | null> => {
  return await tokenStorageService.getAccessToken();
};

/** @deprecated */
export const getAccessToken = (): string | null => {
  return tokenStorageService.getAccessTokenSync();
};

// Re-export
export { isNativePlatform, tokenStorageService };
