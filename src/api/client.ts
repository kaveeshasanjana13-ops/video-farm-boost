import { getBaseUrl, getBaseUrl2, getApiHeaders } from '@/contexts/utils/auth.api';

export interface ApiResponse<T = any> {
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    previousPage: number | null;
    nextPage: number | null;
  };
  success?: boolean;
  message?: string;
  error?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}

class ApiClient {
  private useBaseUrl2 = false;

  setUseBaseUrl2(use: boolean) {
    this.useBaseUrl2 = use;
  }

  private getCurrentBaseUrl(): string {
    return this.useBaseUrl2 ? getBaseUrl2() : getBaseUrl();
  }

  private getHeaders(): Record<string, string> {
    const headers = getApiHeaders();
    
    // Add organization-specific token if using baseUrl2
    if (this.useBaseUrl2) {
      const orgToken = localStorage.getItem('org_access_token');
      if (orgToken) {
        headers['Authorization'] = `Bearer ${orgToken}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP Error: ${response.status}`,
        statusCode: response.status,
        error: response.statusText
      }));
      
      console.error('API Error:', errorData);
      
      // Handle authentication errors
      if (response.status === 401) {
        console.warn('Authentication failed - token may be expired');
        // Clear invalid tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        if (this.useBaseUrl2) {
          localStorage.removeItem('org_access_token');
        }
      }
      
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return {} as T;
  }

  async get<T = any>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const baseUrl = this.getCurrentBaseUrl();
    const url = new URL(`${baseUrl}${endpoint}`);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    console.log('GET Request:', url.toString());
    console.log('Request Headers:', this.getHeaders());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getHeaders()
    });

    return this.handleResponse<T>(response);
  }

  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    const baseUrl = this.getCurrentBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    console.log('POST Request:', url, data);
    
    const headers = this.getHeaders();
    let body: any;
    
    // Handle FormData differently - don't stringify it and don't set Content-Type
    if (data instanceof FormData) {
      body = data;
      // Remove Content-Type header to let browser set it with boundary
      delete headers['Content-Type'];
      console.log('FormData detected, removed Content-Type header');
    } else {
      body = data ? JSON.stringify(data) : undefined;
    }
    
    console.log('Request Headers:', headers);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    return this.handleResponse<T>(response);
  }

  async put<T = any>(endpoint: string, data?: any): Promise<T> {
    const baseUrl = this.getCurrentBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    console.log('PUT Request:', url, data);
    console.log('Request Headers:', this.getHeaders());
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });

    return this.handleResponse<T>(response);
  }

  async patch<T = any>(endpoint: string, data?: any): Promise<T> {
    const baseUrl = this.getCurrentBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    console.log('PATCH Request:', url, data);
    console.log('Request Headers:', this.getHeaders());
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });

    return this.handleResponse<T>(response);
  }

  async delete<T = any>(endpoint: string): Promise<T> {
    const baseUrl = this.getCurrentBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    
    console.log('DELETE Request:', url);
    console.log('Request Headers:', this.getHeaders());
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders()
    });

    return this.handleResponse<T>(response);
  }
}

export const apiClient = new ApiClient();
