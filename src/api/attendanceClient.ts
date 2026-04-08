import { apiCache } from '@/utils/apiCache';
import { getAttendanceUrl, getApiHeadersAsync, refreshAccessToken } from '@/contexts/utils/auth.api';
import { parseApiError } from '@/api/apiError';

export interface CachedRequestOptions {
  ttl?: number;
  forceRefresh?: boolean;
  useStaleWhileRevalidate?: boolean;
}

class AttendanceApiClient {
  private baseUrl: string;
  private pendingRequests = new Map<string, Promise<any>>();
  private readonly PENDING_REQUEST_TTL = 30000; // 30 seconds
  private requestCooldown = new Map<string, number>();
  private readonly COOLDOWN_PERIOD = 1000; // 1 second between identical requests
  private isRefreshing = false;
  private refreshPromise: Promise<void> | null = null;

  constructor() {
    this.baseUrl = getAttendanceUrl();
  }

  /**
   * Handle 401 errors by refreshing token and redirecting to login if refresh fails
   */
  private async handle401Error(): Promise<boolean> {
    if (this.isRefreshing && this.refreshPromise) {
      try {
        await this.refreshPromise;
        return true;
      } catch {
        return false;
      }
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      try {
        await refreshAccessToken();
      } catch (error: any) {
        // Dispatch the same event that the main ApiClient uses, so AuthContext
        // handles a clean, complete logout (server revocation + all storage cleared).
        window.dispatchEvent(new CustomEvent('auth:refresh-failed'));
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    try {
      await this.refreshPromise;
      return true;
    } catch {
      return false;
    }
  }

  private generateRequestKey(endpoint: string, params?: Record<string, any>): string {
    return `attendance_${endpoint}_${JSON.stringify(params || {})}`;
  }

  private isInCooldown(requestKey: string): boolean {
    const lastRequestTime = this.requestCooldown.get(requestKey);
    if (!lastRequestTime) return false;
    
    const timeSinceLastRequest = Date.now() - lastRequestTime;
    return timeSinceLastRequest < this.COOLDOWN_PERIOD;
  }

  private setCooldown(requestKey: string): void {
    this.requestCooldown.set(requestKey, Date.now());
  }

  private async getHeaders(): Promise<Record<string, string>> {
    return getApiHeadersAsync();
  }

  async get<T = any>(
    endpoint: string, 
    params?: Record<string, any>, 
    options: CachedRequestOptions = {}
  ): Promise<T> {
    const { 
      forceRefresh = false, 
      ttl = 30, 
      useStaleWhileRevalidate = true 
    } = options;

    const requestKey = this.generateRequestKey(endpoint, params);
    
    // Check cooldown period to prevent spam
    if (this.isInCooldown(requestKey) && !forceRefresh) {
      throw new Error('Please wait a moment before trying again.');
    }

    // Try to get from cache first (unless forcing refresh)
    if (!forceRefresh) {
      try {
        const cachedData = await apiCache.getCache<T>(requestKey, params, { ttl, forceRefresh });
        if (cachedData !== null) {
          console.log('Cache hit for attendance:', endpoint);
          return cachedData;
        }
      } catch (error: any) {
        console.warn('Attendance cache retrieval failed:', error);
      }
    }

    // Check if there's already a pending request for the same data
    if (this.pendingRequests.has(requestKey)) {
      console.log('Reusing pending attendance request for:', requestKey);
      return this.pendingRequests.get(requestKey)!;
    }

    // Create new request
    const requestPromise = this.executeRequest<T>(endpoint, params, ttl);
    
    // Store the pending request
    this.pendingRequests.set(requestKey, requestPromise);
    
    // Set cooldown
    this.setCooldown(requestKey);
    
    // Clean up after request completes
    requestPromise
      .finally(() => {
        this.pendingRequests.delete(requestKey);
        // Clean up cooldown after TTL
        setTimeout(() => {
          this.requestCooldown.delete(requestKey);
        }, this.PENDING_REQUEST_TTL);
      })
      .catch(() => {
        // prevent unhandled rejection warnings from detached finally chain
      });

    return requestPromise;
  }

  private async executeRequest<T>(
    endpoint: string, 
    params?: Record<string, any>, 
    ttl: number = 30
  ): Promise<T> {
    // Refresh base URL in case it was updated
    this.baseUrl = getAttendanceUrl();
    
    if (!this.baseUrl) {
      throw new Error('Attendance service is not configured. Please check your settings.');
    }
    
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log('Making attendance API request to:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await this.getHeaders(),
        credentials: 'include' // CRITICAL: Send httpOnly refresh token cookie
      });

      console.log('Attendance API Response Status:', response.status);
      console.log('Response Content-Type:', response.headers.get('Content-Type'));

      // Check if response is HTML (ngrok warning page)
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('text/html')) {
        const htmlContent = await response.text();
        
        // Check if it's an ngrok warning page
        if (htmlContent.includes('ngrok') && htmlContent.includes('You are about to visit')) {
          throw new Error('The attendance server is not reachable. Please try again or check your connection.');
        }
        
        throw new Error('Unexpected response from the server. Please try again later.');
      }

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');

        console.error(`Attendance API Error ${response.status}:`, errorText);

        // Handle 401 - Try to refresh token
        if (response.status === 401) {
          const refreshed = await this.handle401Error();

          if (refreshed) {
            console.log('🔁 Retrying attendance request with new token...');
            const retryHeaders = await this.getHeaders();
            const retryResponse = await fetch(url.toString(), {
              method: 'GET',
              headers: retryHeaders,
              credentials: 'include' // CRITICAL: Send httpOnly refresh token cookie
            });

            if (!retryResponse.ok) {
              const retryErrorText = await retryResponse.text().catch(() => '');
              throw parseApiError(retryResponse.status, retryErrorText, url.toString());
            }

            const retryContentType = retryResponse.headers.get('Content-Type') || '';
            let retryData: T;

            if (retryContentType.includes('application/json')) {
              retryData = await retryResponse.json();
            } else {
              retryData = {} as T;
            }

            const requestKey = this.generateRequestKey(endpoint, params);
            await apiCache.setCache(requestKey, retryData, params, ttl);
            console.log('✅ Retry successful after token refresh');
            return retryData;
          }

          throw parseApiError(401, errorText, url.toString());
        }

        throw parseApiError(response.status, errorText, url.toString());
      }

      let data: T;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Unexpected response from the server. Please try again later.');
        }
      } else {
        // If not JSON, try to parse anyway but provide fallback
        try {
          data = await response.json();
        } catch {
          data = {} as T;
        }
      }

      // Cache the successful response with attendance prefix
      try {
        const requestKey = this.generateRequestKey(endpoint, params);
        await apiCache.setCache(requestKey, data, params, ttl);
      } catch (error: any) {
        console.warn('Failed to cache attendance response:', error);
      }

      console.log('Attendance API request successful for:', endpoint);
      return data;

    } catch (error: any) {
      console.error('Attendance API request failed for:', endpoint, error);
      throw error;
    }
  }

  clearPendingRequests(): void {
    console.log('Clearing all pending attendance requests');
    this.pendingRequests.clear();
    this.requestCooldown.clear();
  }

  async patch<T = any>(
    endpoint: string, 
    body?: any
  ): Promise<T> {
    return this.mutate<T>('PATCH', endpoint, body);
  }

  async delete<T = any>(
    endpoint: string
  ): Promise<T> {
    return this.mutate<T>('DELETE', endpoint);
  }

  async post<T = any>(
    endpoint: string, 
    body?: any
  ): Promise<T> {
    return this.mutate<T>('POST', endpoint, body);
  }

  private async mutate<T = any>(
    method: 'POST' | 'PATCH' | 'DELETE',
    endpoint: string, 
    body?: any
  ): Promise<T> {
    // Refresh base URL in case it was updated
    this.baseUrl = getAttendanceUrl();
    
    if (!this.baseUrl) {
      throw new Error('Attendance service is not configured. Please check your settings.');
    }
    
    const url = `${this.baseUrl}${endpoint}`;
    console.log(`Making attendance ${method} request to:`, url);

    try {
      const headers = await this.getHeaders();
      const response = await fetch(url, {
        method,
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include' // CRITICAL: Send httpOnly refresh token cookie
      });

      console.log(`Attendance ${method} Response Status:`, response.status);

      const contentType = response.headers.get('Content-Type') || '';
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => '');

        console.error(`Attendance ${method} Error ${response.status}:`, errorText);

        // Handle 401 - Try to refresh token
        if (response.status === 401) {
          const refreshed = await this.handle401Error();

          if (refreshed) {
            console.log(`🔁 Retrying attendance ${method} with new token...`);
            const retryHeaders = await this.getHeaders();
            const retryResponse = await fetch(url, {
              method,
              headers: {
                ...retryHeaders,
                'Content-Type': 'application/json'
              },
              body: body ? JSON.stringify(body) : undefined,
              credentials: 'include'
            });

            if (!retryResponse.ok) {
              const retryErrorText = await retryResponse.text().catch(() => '');
              throw parseApiError(retryResponse.status, retryErrorText, url);
            }

            const retryContentType = retryResponse.headers.get('Content-Type') || '';
            let retryData: T;

            if (retryContentType.includes('application/json')) {
              retryData = await retryResponse.json();
            } else {
              retryData = {} as T;
            }

            console.log(`✅ ${method} retry successful after token refresh`);
            return retryData;
          }

          throw parseApiError(401, errorText, url);
        }

        throw parseApiError(response.status, errorText, url);
      }

      let data: T;
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response:', jsonError);
          throw new Error('Unexpected response from the server. Please try again later.');
        }
      } else {
        data = {} as T;
      }

      console.log(`Attendance ${method} request successful for:`, endpoint);
      return data;

    } catch (error: any) {
      console.error(`Attendance ${method} request failed for:`, endpoint, error);
      throw error;
    }
  }
}

export const attendanceApiClient = new AttendanceApiClient();