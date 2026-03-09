/**
 * Public Institute Registration API
 * Uses SPECIAL_API_KEY (no JWT required)
 * Endpoint: POST /api/public/institutes
 */

import { getBaseUrl } from '@/contexts/utils/auth.api';

// ============= TYPES =============

export interface CreatePublicInstituteRequest {
  // Required
  name: string;
  email: string;
  systemContactPhoneNumber: string;
  systemContactEmail: string;
  // Optional — Basic Info
  shortName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  district?: string;
  province?: string;
  pinCode?: string;
  // Optional — Images
  logoUrl?: string;
  loadingGifUrl?: string;
  imageUrl?: string;
  // Optional — Metadata
  description?: string;
  websiteUrl?: string;
}

export interface CreatePublicInstituteResponse {
  success: boolean;
  message: string;
  requestId: string;
  data: {
    id: string;
    name: string;
    shortName: string | null;
    code: string;
    email: string;
    systemContactPhoneNumber: string;
    systemContactEmail: string;
    phone: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    province: string | null;
    country: string | null;
    pinCode: string | null;
    logoUrl: string | null;
    loadingGifUrl: string | null;
    imageUrl: string | null;
    description: string | null;
    websiteUrl: string | null;
    isActive: boolean;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

// ============= API =============

const getHeaders = (): Record<string, string> => ({
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_SPECIAL_API_KEY || '',
});

export const registerInstitute = async (
  data: CreatePublicInstituteRequest
): Promise<CreatePublicInstituteResponse> => {
  const baseUrl = getBaseUrl();

  const response = await fetch(`${baseUrl}/public/institutes`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (response.status === 400) {
      const messages = Array.isArray(errorData.errors)
        ? errorData.errors.join('. ')
        : errorData.message || 'Validation failed.';
      throw new Error(messages);
    }
    if (response.status === 401) {
      throw new Error('Unauthorized. Please contact support.');
    }
    if (response.status === 429) {
      throw new Error('Too many requests. Please wait a minute and try again.');
    }
    throw new Error(errorData.message || `Registration failed: ${response.status}`);
  }

  return response.json();
};

export const isValidSriLankanPhone = (phone: string): boolean => {
  return /^\+947[0-9]{8}$/.test(phone);
};
