
import { LoginCredentials, ApiResponse, User } from '../types/auth.types';

export const getBaseUrl = (): string => {
  return 'https://lms-923357517997.europe-west1.run.app';
};

export const getBaseUrl2 = (): string => {
  // First check localStorage for user-configured URL
  const storedUrl = localStorage.getItem('baseUrl2');
  if (storedUrl) {
    return storedUrl;
  }
  
  // Then check environment variable
  const envUrl = import.meta.env.VITE_API_BASE_URL_2;
  if (envUrl) {
    return envUrl;
  }
  
  // Return empty string to force user configuration
  return '';
};

export const getAttendanceUrl = (): string => {
  return 'https://laas-backend-02-923357517997.europe-west1.run.app';
};

export const getApiHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Always get token from localStorage for API calls
  const token = localStorage.getItem('access_token');
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    console.log('Authorization header added with token');
  } else {
    console.warn('No access token found in localStorage');
  }

  return headers;
};

export const loginUser = async (credentials: LoginCredentials): Promise<ApiResponse> => {
  const baseUrl = getBaseUrl();
  
  console.log('Attempting login with credentials:', { email: credentials.email });
  
  const loginHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(`${baseUrl}/v2/auth/login`, {
    method: 'POST',
    headers: loginHeaders,
    body: JSON.stringify(credentials)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Login failed: ${response.status}`);
  }

  const data = await response.json();
  
  // Store the access token immediately
  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token);
    console.log('Access token stored successfully after login');
  } else {
    console.error('No access token received from login response');
  }
  
  return data;
};

export const validateToken = async (): Promise<User> => {
  const baseUrl = getBaseUrl();
  const token = localStorage.getItem('access_token');

  if (!token) {
    console.warn('⚠️ No authentication token found in localStorage');
    throw new Error('No authentication token found');
  }

  console.log('🔐 Validating token with backend...', { 
    tokenExists: !!token,
    tokenLength: token.length,
    endpoint: `${baseUrl}/auth/me`
  });

  try {
    const response = await fetch(`${baseUrl}/auth/me`, {
      method: 'GET',
      headers: getApiHeaders()
    });

    console.log('📡 Token validation response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      // Clear invalid token
      localStorage.removeItem('access_token');
      console.error('❌ Token validation failed, token cleared');
      throw new Error(`Token validation failed: ${response.status} ${response.statusText}`);
    }

    const userData = await response.json();
    console.log('✅ Token validation successful, user data:', {
      userId: userData.id,
      email: userData.email,
      role: userData.role
    });
    return userData;
  } catch (error) {
    console.error('❌ Token validation error:', error);
    localStorage.removeItem('access_token');
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  // Clear all auth-related data from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('token');
  localStorage.removeItem('authToken');
  localStorage.removeItem('org_access_token');
  
  // Clear any other user-related data
  localStorage.removeItem('selectedInstitute');
  localStorage.removeItem('selectedClass');
  localStorage.removeItem('selectedSubject');
  localStorage.removeItem('selectedChild');
  localStorage.removeItem('selectedOrganization');
  
  console.log('All auth tokens and user data cleared from localStorage');
};
