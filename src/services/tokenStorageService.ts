/**
 * Platform-Aware Token Storage Service (SSO v2)
 * 
 * WEB:
 * - Access token: IN-MEMORY ONLY (never localStorage — XSS protection)
 * - Refresh token: HTTP-only cookie (server-managed)
 * - Multi-tab sync via BroadcastChannel
 * - Session restored on page load via cookie-based /v2/auth/refresh
 * 
 * MOBILE (Capacitor):
 * - All tokens: Secure Storage (Keychain on iOS, EncryptedSharedPreferences on Android)
 * - 256-bit AES encryption at rest
 * - Refresh token stored locally (no cookie support in WebView)
 */

import { Capacitor } from '@capacitor/core';

// ============= PLATFORM DETECTION =============

export const isNativePlatform = (): boolean => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = (): 'web' | 'android' | 'ios' => {
  if (!Capacitor.isNativePlatform()) return 'web';
  const platform = Capacitor.getPlatform();
  return platform === 'ios' ? 'ios' : 'android';
};

// ============= SECURE STORAGE HELPERS =============

/**
 * Wraps SecureStoragePlugin calls. On native, uses encrypted Keychain/EncryptedSharedPreferences.
 * get() throws when key doesn't exist, so we catch and return null.
 */
const secureStorage = {
  async set(key: string, value: string): Promise<void> {
    const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
    await SecureStoragePlugin.set({ key, value });
  },

  async get(key: string): Promise<string | null> {
    try {
      const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
      const result = await SecureStoragePlugin.get({ key });
      return result.value;
    } catch {
      // Key doesn't exist
      return null;
    }
  },

  async remove(key: string): Promise<void> {
    try {
      const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
      await SecureStoragePlugin.remove({ key });
    } catch {
      // Key didn't exist — no-op
    }
  },

  async clear(): Promise<void> {
    const { SecureStoragePlugin } = await import('capacitor-secure-storage-plugin');
    await SecureStoragePlugin.clear();
  },
};

// ============= STORAGE KEYS =============

const KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token', // Mobile always; Web only when rememberMe
  USER_DATA: 'user_data',
  DEVICE_ID: 'device_id',
  TOKEN_EXPIRY: 'token_expiry',
  REMEMBER_ME: 'remember_me',
} as const;

// ============= IN-MEMORY TOKEN STORE =============

let memoryStore: {
  accessToken: string | null;
  refreshToken: string | null; // mobile only
  expiresAt: number | null;
} = { accessToken: null, refreshToken: null, expiresAt: null };

// ============= MULTI-TAB SYNC (Web Only) =============

let broadcastChannel: BroadcastChannel | null = null;

function getBroadcastChannel(): BroadcastChannel | null {
  if (isNativePlatform()) return null;
  if (!broadcastChannel && typeof BroadcastChannel !== 'undefined') {
    broadcastChannel = new BroadcastChannel('auth_sync');
    broadcastChannel.onmessage = (event) => {
      const { type, accessToken, expiresAt } = event.data;
      if (type === 'TOKEN_UPDATE') {
        memoryStore.accessToken = accessToken;
        memoryStore.expiresAt = expiresAt;
      } else if (type === 'LOGOUT') {
        memoryStore = { accessToken: null, refreshToken: null, expiresAt: null };
        window.dispatchEvent(new CustomEvent('auth:logged-out-other-tab'));
      }
    };
  }
  return broadcastChannel;
}

// Initialize broadcast channel on web
if (typeof window !== 'undefined' && !isNativePlatform()) {
  getBroadcastChannel();
}

function broadcastTokenUpdate() {
  const ch = getBroadcastChannel();
  if (ch) {
    ch.postMessage({
      type: 'TOKEN_UPDATE',
      accessToken: memoryStore.accessToken,
      expiresAt: memoryStore.expiresAt,
    });
  }
}

function broadcastLogout() {
  const ch = getBroadcastChannel();
  if (ch) {
    ch.postMessage({ type: 'LOGOUT' });
  }
}

// ============= TOKEN STORAGE SERVICE =============

export const tokenStorageService = {
  // ============= ACCESS TOKEN =============

  /**
   * Store access token
   * - Web: IN-MEMORY ONLY (+ broadcast to other tabs)
   * - Mobile: Secure Storage (encrypted) + memory
   */
  async setAccessToken(token: string): Promise<void> {
    memoryStore.accessToken = token;

    if (isNativePlatform()) {
      await secureStorage.set(KEYS.ACCESS_TOKEN, token);
    }

    broadcastTokenUpdate();
  },

  /**
   * Get access token from memory.
   * Returns the token even if expired — the server will 401 and the API client
   * will trigger a refresh + retry.
   */
  async getAccessToken(): Promise<string | null> {
    if (memoryStore.accessToken) {
      return memoryStore.accessToken;
    }

    // On mobile, fall back to secure storage if memory is empty (cold start)
    if (isNativePlatform()) {
      const value = await secureStorage.get(KEYS.ACCESS_TOKEN);
      if (value) {
        memoryStore.accessToken = value;
        if (!memoryStore.expiresAt) {
          memoryStore.expiresAt = await this.getTokenExpiry();
        }
        return value;
      }
    }

    // Web: no fallback — memory-only. If null, caller should refresh via cookie.
    return null;
  },

  async removeAccessToken(): Promise<void> {
    memoryStore.accessToken = null;
    if (isNativePlatform()) {
      await secureStorage.remove(KEYS.ACCESS_TOKEN);
    }
  },

  // ============= REFRESH TOKEN =============

  async setRefreshToken(token: string): Promise<void> {
    memoryStore.refreshToken = token;
    if (isNativePlatform()) {
      await secureStorage.set(KEYS.REFRESH_TOKEN, token);
    } else {
      const rememberMe = localStorage.getItem(KEYS.REMEMBER_ME);
      if (rememberMe === 'true') {
        localStorage.setItem(KEYS.REFRESH_TOKEN, token);
      }
    }
  },

  async getRefreshToken(): Promise<string | null> {
    if (memoryStore.refreshToken) return memoryStore.refreshToken;
    if (isNativePlatform()) {
      const value = await secureStorage.get(KEYS.REFRESH_TOKEN);
      memoryStore.refreshToken = value;
      return value;
    }
    const stored = localStorage.getItem(KEYS.REFRESH_TOKEN);
    if (stored) {
      memoryStore.refreshToken = stored;
      return stored;
    }
    return null;
  },

  async removeRefreshToken(): Promise<void> {
    memoryStore.refreshToken = null;
    if (isNativePlatform()) {
      await secureStorage.remove(KEYS.REFRESH_TOKEN);
    } else {
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
    }
  },

  // ============= USER DATA =============

  async setUserData(userData: object): Promise<void> {
    const dataString = JSON.stringify(userData);
    if (isNativePlatform()) {
      await secureStorage.set(KEYS.USER_DATA, dataString);
    } else {
      localStorage.setItem(KEYS.USER_DATA, dataString);
    }
  },

  async getUserData<T = any>(): Promise<T | null> {
    let dataString: string | null = null;
    if (isNativePlatform()) {
      dataString = await secureStorage.get(KEYS.USER_DATA);
    } else {
      dataString = localStorage.getItem(KEYS.USER_DATA);
    }
    if (!dataString) return null;
    try {
      return JSON.parse(dataString) as T;
    } catch {
      return null;
    }
  },

  async removeUserData(): Promise<void> {
    if (isNativePlatform()) {
      await secureStorage.remove(KEYS.USER_DATA);
    } else {
      localStorage.removeItem(KEYS.USER_DATA);
    }
  },

  // ============= TOKEN EXPIRY =============

  async setTokenExpiry(expiryTimestamp: number): Promise<void> {
    memoryStore.expiresAt = expiryTimestamp;
    const value = expiryTimestamp.toString();
    if (isNativePlatform()) {
      await secureStorage.set(KEYS.TOKEN_EXPIRY, value);
    }
    broadcastTokenUpdate();
  },

  async getTokenExpiry(): Promise<number | null> {
    if (memoryStore.expiresAt) return memoryStore.expiresAt;
    if (isNativePlatform()) {
      const value = await secureStorage.get(KEYS.TOKEN_EXPIRY);
      if (value) {
        memoryStore.expiresAt = parseInt(value, 10);
        return memoryStore.expiresAt;
      }
    }
    return null;
  },

  async isTokenExpired(): Promise<boolean> {
    const expiry = await this.getTokenExpiry();
    if (!expiry) return true;
    return Date.now() >= expiry;
  },

  // ============= DEVICE ID (Mobile Only) =============

  async getDeviceId(): Promise<string | null> {
    if (!isNativePlatform()) return null;
    const value = await secureStorage.get(KEYS.DEVICE_ID);
    if (value) return value;
    const deviceId = `${getPlatform()}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    await secureStorage.set(KEYS.DEVICE_ID, deviceId);
    return deviceId;
  },

  // ============= REMEMBER ME =============

  async setRememberMe(value: boolean): Promise<void> {
    if (isNativePlatform()) {
      await secureStorage.set(KEYS.REMEMBER_ME, value.toString());
    } else {
      localStorage.setItem(KEYS.REMEMBER_ME, value.toString());
    }
  },

  async getRememberMe(): Promise<boolean> {
    if (isNativePlatform()) {
      const value = await secureStorage.get(KEYS.REMEMBER_ME);
      return value === 'true';
    }
    return localStorage.getItem(KEYS.REMEMBER_ME) === 'true';
  },

  // ============= CLEAR ALL =============

  async clearAll(): Promise<void> {
    memoryStore = { accessToken: null, refreshToken: null, expiresAt: null };

    if (isNativePlatform()) {
      await Promise.all([
        secureStorage.remove(KEYS.ACCESS_TOKEN),
        secureStorage.remove(KEYS.REFRESH_TOKEN),
        secureStorage.remove(KEYS.USER_DATA),
        secureStorage.remove(KEYS.TOKEN_EXPIRY),
        secureStorage.remove(KEYS.REMEMBER_ME),
      ]);
    } else {
      localStorage.removeItem(KEYS.USER_DATA);
      localStorage.removeItem(KEYS.REFRESH_TOKEN);
      localStorage.removeItem(KEYS.REMEMBER_ME);
      localStorage.removeItem('token');
      localStorage.removeItem('authToken');
      localStorage.removeItem('org_access_token');
      localStorage.removeItem(KEYS.ACCESS_TOKEN);
      localStorage.removeItem(KEYS.TOKEN_EXPIRY);
    }

    broadcastLogout();
  },

  // ============= AUTH CHECK =============

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getAccessToken();
    return !!token;
  },

  hasAnyAuthHint(): boolean {
    if (memoryStore.accessToken) return true;
    if (!isNativePlatform()) {
      return !!localStorage.getItem(KEYS.USER_DATA);
    }
    return false;
  },

  // ============= SYNC ACCESS TOKEN (for API headers) =============

  getAccessTokenSync(): string | null {
    return memoryStore.accessToken || null;
  },
};

// ============= AUTH API HELPER =============

export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = await tokenStorageService.getAccessToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const getAuthHeadersSync = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const token = tokenStorageService.getAccessTokenSync();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export default tokenStorageService;