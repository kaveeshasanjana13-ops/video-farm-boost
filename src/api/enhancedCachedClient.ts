/**
 * Enhanced Cached API Client
 * Provides automatic caching with context awareness and cache invalidation
 */

import { secureCache } from '@/utils/secureCache';
import { getBaseUrl, getBaseUrl2, getApiHeadersAsync, refreshAccessToken, getCredentialsMode, getOrgAccessTokenAsync, removeOrgAccessTokenAsync, isNativePlatform, tokenStorageService } from '@/contexts/utils/auth.api';
import { parseApiError, ApiError } from '@/api/apiError';

export interface EnhancedCacheOptions {
  ttl?: number; // Time to live in minutes
  forceRefresh?: boolean;
  useStaleWhileRevalidate?: boolean;
  userId?: string;
  instituteId?: string;
  classId?: string;
  subjectId?: string;
  role?: string;
}

class EnhancedCachedApiClient {
  private baseUrl: string;
  private useBaseUrl2: boolean = false;
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly PENDING_REQUEST_TTL = 30000; // 30 seconds
  private requestCooldown = new Map<string, number>();
  private readonly COOLDOWN_PERIOD = 1000; // 1 second
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;
  
  // Per-endpoint rate limit tracking - only the specific endpoint is blocked, not all requests
  private rateLimitedEndpoints = new Map<string, number>();
  // Legacy global rate limit (kept for backwards compat, rarely used)
  private rateLimitedUntil: number = 0;
  private readonly RATE_LIMIT_BACKOFF = 30000; // 30 seconds per-endpoint backoff
  private backgroundRevalidationPaused: boolean = false;
  
  // Global force refresh flag - when set, ALL next GET requests bypass cache
  private _globalForceRefresh: boolean = false;
  private _globalForceRefreshTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.baseUrl = getBaseUrl();
  }

  /**
   * Check if we're rate limited for a specific endpoint (or globally)
   */
  private isRateLimited(endpoint?: string): boolean {
    const now = Date.now();
    // Per-endpoint check first
    if (endpoint) {
      const endpointLimit = this.rateLimitedEndpoints.get(endpoint);
      if (endpointLimit) {
        if (now < endpointLimit) return true;
        this.rateLimitedEndpoints.delete(endpoint);
      }
      return false;
    }
    // Global check (fallback)
    if (now < this.rateLimitedUntil) return true;
    if (this.rateLimitedUntil > 0) {
      this.rateLimitedUntil = 0;
      this.backgroundRevalidationPaused = false;
    }
    return false;
  }

  /**
   * Set rate limit for a specific endpoint (preferred) or globally
   */
  private setRateLimited(retryAfterSeconds?: number, endpoint?: string): void {
    const backoffMs = Math.min((retryAfterSeconds || 30) * 1000, 60000);
    if (endpoint) {
      this.rateLimitedEndpoints.set(endpoint, Date.now() + backoffMs);
      console.warn(`🛑 Rate limited endpoint: ${endpoint} for ${backoffMs / 1000}s`);
    } else {
      this.rateLimitedUntil = Date.now() + backoffMs;
      this.backgroundRevalidationPaused = true;
      console.warn(`🛑 Global rate limit for ${backoffMs / 1000}s`);
    }
  }

  /**
   * Handle 401 errors by refreshing token and redirecting to login if refresh fails
   */
  private async handle401Error(options?: EnhancedCacheOptions): Promise<boolean> {
    // If already refreshing, wait for the refresh to complete
    if (this.isRefreshing && this.refreshPromise) {
      try {
        await this.refreshPromise;
        return true; // Token refreshed successfully
      } catch {
        return false; // Refresh failed
      }
    }

    // Start token refresh
    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        console.log('🔄 401 Error - Attempting token refresh...');
        await refreshAccessToken();
        console.log('✅ Token refreshed successfully');
        
        // Clear user cache after refresh
        if (options?.userId) {
          await secureCache.clearUserCache(options.userId);
        }
      } catch (error: any) {
        console.error('❌ Token refresh failed:', error);
        
        // Clear all auth data using platform-aware storage
        await tokenStorageService.clearAll();
        
        if (!isNativePlatform()) {
          // Web: Also clear legacy localStorage keys
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
        }
        
        if (this.useBaseUrl2) {
          await removeOrgAccessTokenAsync();
        }
        
        // Clear user cache
        if (options?.userId) {
          await secureCache.clearUserCache(options.userId);
        }
        
        // Redirect to login page
        console.log('🚪 Redirecting to login page...');
        window.location.href = '/login';
        
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    try {
      await this.refreshPromise;
      return true; // Token refreshed successfully
    } catch {
      return false; // Refresh failed, user will be redirected
    }
  }

  private generateRequestKey(endpoint: string, params?: Record<string, any>): string {
    return `${endpoint}_${JSON.stringify(params || {})}`;
  }

  private isInCooldown(requestKey: string): boolean {
    const lastRequestTime = this.requestCooldown.get(requestKey);
    if (!lastRequestTime) return false;
    
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    return timeSinceLastRequest < this.COOLDOWN_PERIOD;
  }

  private setCooldown(requestKey: string): void {
    this.requestCooldown.set(requestKey, Date.now());
    // Auto-cleanup after cooldown
    setTimeout(() => {
      this.requestCooldown.delete(requestKey);
    }, this.COOLDOWN_PERIOD + 1000);
  }

  setUseBaseUrl2(use: boolean): void {
    this.useBaseUrl2 = use;
    this.baseUrl = use ? getBaseUrl2() : getBaseUrl();
    console.log(`📡 Switched to ${use ? 'baseUrl2' : 'baseUrl'}:`, this.baseUrl);
  }

  private async getHeaders(): Promise<Record<string, string>> {
    const headers = await getApiHeadersAsync();
    
    if (this.useBaseUrl2) {
      const orgToken = await getOrgAccessTokenAsync();
      if (orgToken) {
        headers['Authorization'] = `Bearer ${orgToken}`;
      }
    }

    return headers;
  }

  private extractContext(options: EnhancedCacheOptions): any {
    return {
      userId: options.userId,
      instituteId: options.instituteId,
      classId: options.classId,
      subjectId: options.subjectId,
      role: options.role
    };
  }

  /**
   * GET request with intelligent caching
   */
  async get<T = any>(
    endpoint: string, 
    params?: Record<string, any>, 
    options: EnhancedCacheOptions = {}
  ): Promise<T> {
    const { 
      forceRefresh: optionForceRefresh = false, 
      ttl = 150, // Changed from 30 to 150 (5x longer) to enforce local caching by default
      useStaleWhileRevalidate = false // Disabled by default, relies on user 'Refresh' action or cache expiration
    } = options;
    
    // Check global force refresh flag
    const forceRefresh = optionForceRefresh || this._globalForceRefresh;

    const requestKey = this.generateRequestKey(endpoint, params);
    
    // Check per-endpoint rate limit FIRST - only this endpoint is blocked, other endpoints still work
    if (this.isRateLimited(endpoint)) {
      console.log('🛑 Rate limited (endpoint) - checking cache for:', endpoint);
      try {
        const cachedData = await secureCache.getCache<T>(endpoint, params, {
          context: this.extractContext(options),
          ttl: ttl * 10, // Accept much older cache during rate limit
          forceRefresh: false
        });
        if (cachedData !== null) {
          console.log('✅ Returning cached data during rate limit:', endpoint);
          return cachedData;
        }
      } catch (e) {
        // No cache available
      }
      throw new Error('Too many requests. Please wait a moment and try again.');
    }
    
    // Try to get from cache first (unless forcing refresh)
    if (!forceRefresh) {
      try {
        const cachedData = await secureCache.getCache<T>(endpoint, params, {
          context: this.extractContext(options),
          ttl,
          forceRefresh
        });

        if (cachedData !== null) {
          // Stale-while-revalidate: return cache immediately, fetch in background
          if (useStaleWhileRevalidate) {
            this.revalidateInBackground(endpoint, params, options, ttl);
          }
          return cachedData;
        }
      } catch (error: any) {
        console.warn('⚠️ Cache retrieval failed:', error);
      }
    }

    // If there's already a pending request, reuse it
    if (this.pendingRequests.has(requestKey)) {
      console.log('♻️ Reusing pending request:', requestKey);
      return this.pendingRequests.get(requestKey)!;
    }

    // Check cooldown to prevent request spam (AFTER cache + pending request checks)
    if (!forceRefresh && this.isInCooldown(requestKey)) {
      console.log('⏸️ Request in cooldown period (no fresh cache):', requestKey);

      // Try returning slightly older cache during cooldown
      try {
        const staleCached = await secureCache.getCache<T>(endpoint, params, {
          context: this.extractContext(options),
          ttl: ttl * 2, // Accept older cache during cooldown
          forceRefresh: false
        });

        if (staleCached !== null) {
          return staleCached;
        }
      } catch (error: any) {
        console.warn('⚠️ No cached data available during cooldown');
      }

      // No cache and no pending request; proceed with request instead of throwing.
      console.log('⚠️ No cache during cooldown; proceeding with request:', requestKey);
    }


    // Create new request
    const requestPromise = this.executeRequest<T>(endpoint, params, options, ttl);
    
    // Store pending request
    this.pendingRequests.set(requestKey, requestPromise);
    
    // Set cooldown
    this.setCooldown(requestKey);
    
    // Clean up after completion
    requestPromise.finally(() => {
      this.pendingRequests.delete(requestKey);
    });

    return requestPromise;
  }

  private activeRevalidations = new Set<string>();

  /**
   * Background revalidation for stale-while-revalidate
   */
  private async revalidateInBackground<T>(
    endpoint: string,
    params: Record<string, any> | undefined,
    options: EnhancedCacheOptions,
    ttl: number
  ): Promise<void> {
    const revalKey = this.generateRequestKey(endpoint, params);
    
    // Skip if already revalidating this endpoint, rate limited, or paused
    if (this.activeRevalidations.has(revalKey) || this.backgroundRevalidationPaused || this.isRateLimited()) {
      return;
    }
    
    this.activeRevalidations.add(revalKey);
    
    try {
      // Wait a bit to avoid immediate re-fetch
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Double-check rate limit after delay
      if (this.backgroundRevalidationPaused || this.isRateLimited()) {
        return;
      }
      
      const data = await this.executeRequest<T>(endpoint, params, options, ttl);
      console.log('🔄 Background revalidation complete:', endpoint);
    } catch (error: any) {
      console.warn('⚠️ Background revalidation failed:', error?.message || error);
    } finally {
      this.activeRevalidations.delete(revalKey);
    }
  }

  /**
   * Execute the actual HTTP request
   */
  private async executeRequest<T>(
    endpoint: string, 
    params?: Record<string, any>, 
    options: EnhancedCacheOptions = {},
    ttl: number = 30
  ): Promise<T> {
    // Refresh base URL
    this.baseUrl = this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
    
    if (!this.baseUrl) {
      throw new Error('Backend URL not configured. Please set the backend URL in settings.');
    }
    
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log('📡 API Request:', {
      method: 'GET',
      url: url.toString(),
      context: this.extractContext(options)
    });

    try {
      const headers = await this.getHeaders();
      const credentials = getCredentialsMode();
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        credentials // Platform-aware: 'include' for web, 'omit' for mobile
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.error(`❌ API Error ${response.status}:`, errorText);
        
        // Handle 429 - Rate Limited
        if (response.status === 429) {
          let retryAfter = 60;
          try {
            const errorJson = JSON.parse(errorText);
            if (errorJson.details?.retryAfter) {
              const match = errorJson.details.retryAfter.match(/(\d+)/);
              if (match) retryAfter = parseInt(match[1], 10);
            }
          } catch {}
          
          this.setRateLimited(retryAfter, endpoint);
          throw parseApiError(429, errorText, url.toString());
        }
        
        // Handle 401 - Try to refresh token
        if (response.status === 401) {
          const refreshed = await this.handle401Error(options);
          
          if (refreshed) {
            console.log('🔁 Retrying request with new token...');
            const retryHeaders = await this.getHeaders();
            const retryResponse = await fetch(url.toString(), {
              method: 'GET',
              headers: retryHeaders,
              credentials
            });
            
            if (!retryResponse.ok) {
              const retryErrorText = await retryResponse.text().catch(() => '');
              throw parseApiError(retryResponse.status, retryErrorText, url.toString());
            }
            
            const retryContentType = retryResponse.headers.get('Content-Type');
            const retryData: T = retryContentType && retryContentType.includes('application/json')
              ? await retryResponse.json()
              : {} as T;
            
            await secureCache.setCache(endpoint, retryData, params, {
              ttl,
              context: this.extractContext(options)
            });
            
            console.log('✅ Retry successful after token refresh');
            return retryData;
          }
          
          throw parseApiError(401, errorText, url.toString());
        }
        
        throw parseApiError(response.status, errorText, url.toString());
      }

      const contentType = response.headers.get('Content-Type');
      let data: T;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = {} as T;
      }

      // Cache the successful response
      try {
        await secureCache.setCache(endpoint, data, params, {
          ttl,
          context: this.extractContext(options)
        });
      } catch (error: any) {
        console.warn('⚠️ Failed to cache response:', error);
      }

      console.log('✅ API request successful:', endpoint);
      return data;

    } catch (error: any) {
      console.error('❌ API request failed:', endpoint, error);
      // Wrap raw network errors (TypeError: Failed to fetch) with friendly messages
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError || error?.message?.match(/^(Failed to fetch|NetworkError|Load failed|fetch failed)/i)) {
        throw new Error('Unable to connect to the server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  /**
   * POST request with automatic cache invalidation
   */
  async post<T = any>(endpoint: string, data?: any, options: EnhancedCacheOptions = {}): Promise<T> {
    this.baseUrl = this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
    
    if (!this.baseUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('📡 POST Request:', { url, context: this.extractContext(options) });
    
    const headers = await this.getHeaders();
    const credentials = getCredentialsMode();
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials // Platform-aware: 'include' for web, 'omit' for mobile
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`❌ POST Error ${response.status}:`, errorText);
      
      if (response.status === 401) {
        const refreshed = await this.handle401Error(options);
        
        if (refreshed) {
          console.log('🔁 Retrying POST request with new token...');
          const retryHeaders = await this.getHeaders();
          const retryResponse = await fetch(url, {
            credentials,
            method: 'POST',
            headers: retryHeaders,
            body: data ? JSON.stringify(data) : undefined
          });
          
          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text().catch(() => '');
            throw parseApiError(retryResponse.status, retryErrorText, url);
          }
          
          const retryContentType = retryResponse.headers.get('Content-Type');
          const retryResult = retryContentType && retryContentType.includes('application/json')
            ? await retryResponse.json()
            : {} as T;
          
          await secureCache.invalidateOnMutation('POST', endpoint, this.extractContext(options));
          console.log('✅ POST retry successful after token refresh');
          return retryResult;
        }
        
        throw parseApiError(401, errorText, url);
      }
      
      throw parseApiError(response.status, errorText, url);
    }

    const contentType = response.headers.get('Content-Type');
    const result = contentType && contentType.includes('application/json') 
      ? await response.json() 
      : {} as T;

    // Invalidate affected caches
    await secureCache.invalidateOnMutation('POST', endpoint, this.extractContext(options));
    
    console.log('✅ POST successful, cache invalidated:', endpoint);
    return result;
  }

  /**
   * PUT request with automatic cache invalidation
   */
  async put<T = any>(endpoint: string, data?: any, options: EnhancedCacheOptions = {}): Promise<T> {
    this.baseUrl = this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
    
    if (!this.baseUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('📡 PUT Request:', { url, context: this.extractContext(options) });
    
    const headers = await this.getHeaders();
    const credentials = getCredentialsMode();
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials // Platform-aware: 'include' for web, 'omit' for mobile
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`❌ PUT Error ${response.status}:`, errorText);
      
      if (response.status === 401) {
        const refreshed = await this.handle401Error(options);
        
        if (refreshed) {
          console.log('🔁 Retrying PUT request with new token...');
          const retryHeaders = await this.getHeaders();
          const retryResponse = await fetch(url, {
            credentials,
            method: 'PUT',
            headers: retryHeaders,
            body: data ? JSON.stringify(data) : undefined
          });
          
          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text().catch(() => '');
            throw parseApiError(retryResponse.status, retryErrorText, url);
          }
          
          const retryContentType = retryResponse.headers.get('Content-Type');
          const retryResult = retryContentType && retryContentType.includes('application/json')
            ? await retryResponse.json()
            : {} as T;
          
          await secureCache.invalidateOnMutation('PUT', endpoint, this.extractContext(options));
          console.log('✅ PUT retry successful after token refresh');
          return retryResult;
        }
        
        throw parseApiError(401, errorText, url);
      }
      
      throw parseApiError(response.status, errorText, url);
    }

    const contentType = response.headers.get('Content-Type');
    const result = contentType && contentType.includes('application/json') 
      ? await response.json() 
      : {} as T;

    // Invalidate affected caches
    await secureCache.invalidateOnMutation('PUT', endpoint, this.extractContext(options));
    
    console.log('✅ PUT successful, cache invalidated:', endpoint);
    return result;
  }

  /**
   * PATCH request with automatic cache invalidation
   */
  async patch<T = any>(endpoint: string, data?: any, options: EnhancedCacheOptions = {}): Promise<T> {
    this.baseUrl = this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
    
    if (!this.baseUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('📡 PATCH Request:', { url, context: this.extractContext(options) });
    
    const headers = await this.getHeaders();
    const credentials = getCredentialsMode();
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined,
      credentials // Platform-aware: 'include' for web, 'omit' for mobile
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`❌ PATCH Error ${response.status}:`, errorText);
      
      if (response.status === 401) {
        const refreshed = await this.handle401Error(options);
        
        if (refreshed) {
          console.log('🔁 Retrying PATCH request with new token...');
          const retryHeaders = await this.getHeaders();
          const retryResponse = await fetch(url, {
            credentials,
            method: 'PATCH',
            headers: retryHeaders,
            body: data ? JSON.stringify(data) : undefined
          });
          
          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text().catch(() => '');
            throw parseApiError(retryResponse.status, retryErrorText, url);
          }
          
          const retryContentType = retryResponse.headers.get('Content-Type');
          const retryResult = retryContentType && retryContentType.includes('application/json')
            ? await retryResponse.json()
            : {} as T;
          
          await secureCache.invalidateOnMutation('PATCH', endpoint, this.extractContext(options));
          console.log('✅ PATCH retry successful after token refresh');
          return retryResult;
        }
        
        throw parseApiError(401, errorText, url);
      }
      
      throw parseApiError(response.status, errorText, url);
    }

    const contentType = response.headers.get('Content-Type');
    const result = contentType && contentType.includes('application/json') 
      ? await response.json() 
      : {} as T;

    // Invalidate affected caches
    await secureCache.invalidateOnMutation('PATCH', endpoint, this.extractContext(options));
    
    console.log('✅ PATCH successful, cache invalidated:', endpoint);
    return result;
  }

  /**
   * DELETE request with automatic cache invalidation
   */
  async delete<T = any>(endpoint: string, options: EnhancedCacheOptions = {}): Promise<T> {
    this.baseUrl = this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
    
    if (!this.baseUrl) {
      throw new Error('Backend URL not configured');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log('📡 DELETE Request:', { url, context: this.extractContext(options) });
    
    const headers = await this.getHeaders();
    const credentials = getCredentialsMode();
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials // Platform-aware: 'include' for web, 'omit' for mobile
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`❌ DELETE Error ${response.status}:`, errorText);
      
      if (response.status === 401) {
        const refreshed = await this.handle401Error(options);
        
        if (refreshed) {
          console.log('🔁 Retrying DELETE request with new token...');
          const retryHeaders = await this.getHeaders();
          const retryResponse = await fetch(url, {
            credentials,
            method: 'DELETE',
            headers: retryHeaders
          });
          
          if (!retryResponse.ok) {
            const retryErrorText = await retryResponse.text().catch(() => '');
            throw parseApiError(retryResponse.status, retryErrorText, url);
          }
          
          const retryContentType = retryResponse.headers.get('Content-Type');
          const retryResult = retryContentType && retryContentType.includes('application/json')
            ? await retryResponse.json()
            : {} as T;
          
          await secureCache.invalidateOnMutation('DELETE', endpoint, this.extractContext(options));
          console.log('✅ DELETE retry successful after token refresh');
          return retryResult;
        }
        
        throw parseApiError(401, errorText, url);
      }
      
      throw parseApiError(response.status, errorText, url);
    }

    const contentType = response.headers.get('Content-Type');
    const result = contentType && contentType.includes('application/json') 
      ? await response.json() 
      : {} as T;

    // Invalidate affected caches
    await secureCache.invalidateOnMutation('DELETE', endpoint, this.extractContext(options));
    
    console.log('✅ DELETE successful, cache invalidated:', endpoint);
    return result;
  }

  /**
   * Check if data is cached
   */
  async hasCache(endpoint: string, params?: Record<string, any>, context?: any): Promise<boolean> {
    try {
      const cached = await secureCache.getCache(endpoint, params, { context, forceRefresh: false });
      return cached !== null;
    } catch (error: any) {
      return false;
    }
  }

  /**
   * Get cached data only (no network request)
   */
  async getCachedOnly<T = any>(endpoint: string, params?: Record<string, any>, context?: any): Promise<T | null> {
    try {
      return await secureCache.getCache<T>(endpoint, params, { context, forceRefresh: false });
    } catch (error: any) {
      console.warn('⚠️ Cache-only retrieval failed:', error);
      return null;
    }
  }

  /**
   * Preload data into cache
   */
  async preload<T = any>(
    endpoint: string, 
    params?: Record<string, any>, 
    options: EnhancedCacheOptions = {}
  ): Promise<void> {
    try {
      await this.get<T>(endpoint, params, { ...options, forceRefresh: false });
      console.log('📥 Preloaded:', endpoint);
    } catch (error: any) {
      console.warn('⚠️ Preload failed:', endpoint, error);
    }
  }

  /**
   * Clear all pending requests
   */
  clearPendingRequests(): void {
    console.log('🗑️ Clearing all pending requests');
    this.pendingRequests.clear();
    this.requestCooldown.clear();
  }

  /**
   * Get cache statistics
   */
  async getCacheStats() {
    return await secureCache.getCacheStats();
  }

  /**
   * Clear all cache
   */
  async clearAllCache(): Promise<void> {
    await secureCache.clearAllCache();
  }

  /**
   * Clear user-specific cache
   */
  async clearUserCache(userId: string): Promise<void> {
    await secureCache.clearUserCache(userId);
  }

  /**
   * Clear institute-specific cache
   */
  async clearInstituteCache(instituteId: string): Promise<void> {
    await secureCache.clearInstituteCache(instituteId);
  }

  /**
   * Enable global force refresh - ALL subsequent GET requests will bypass cache
   * Automatically resets after the specified duration (default 10 seconds)
   */
  enableGlobalForceRefresh(durationMs: number = 10000): void {
    console.log('🔄 Global force refresh ENABLED - all requests will bypass cache');
    this._globalForceRefresh = true;
    
    // Clear any existing timeout
    if (this._globalForceRefreshTimeout) {
      clearTimeout(this._globalForceRefreshTimeout);
    }
    
    // Auto-reset after duration
    this._globalForceRefreshTimeout = setTimeout(() => {
      this._globalForceRefresh = false;
      this._globalForceRefreshTimeout = null;
      console.log('🔄 Global force refresh DISABLED - cache resumed');
    }, durationMs);
  }

  /**
   * Disable global force refresh manually
   */
  disableGlobalForceRefresh(): void {
    this._globalForceRefresh = false;
    if (this._globalForceRefreshTimeout) {
      clearTimeout(this._globalForceRefreshTimeout);
      this._globalForceRefreshTimeout = null;
    }
  }
}

export const enhancedCachedClient = new EnhancedCachedApiClient();
