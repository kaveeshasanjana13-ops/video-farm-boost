/**
 * Phone-Based First Login API Service
 * 
 * 5-step flow:
 * 1. Initiate (phone) → SMS OTP
 * 2. Verify phone OTP → JWT + annotated profile
 * 3. Request email OTP (with JWT)
 * 4. Verify email OTP (with JWT)
 * 5. Complete profile + set password → real login tokens
 */

import { getBaseUrl } from '@/contexts/utils/auth.api';
import { tokenStorageService, isNativePlatform } from '@/services/tokenStorageService';

// ============= TYPES =============

export interface FieldAnnotation {
  value: any;
  editable: boolean;
  required: boolean;
  needsVerification?: boolean;
  options?: string[];
}

export interface PhoneVerifyResponse {
  success: boolean;
  message: string;
  access_token: string;
  userId: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  hasPassword: boolean;
  profile: Record<string, FieldAnnotation>;
  studentFields?: Record<string, FieldAnnotation>;
  parentFields?: Record<string, FieldAnnotation>;
}

export interface CompleteProfileResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  expires_in: string;
  refresh_expires_in: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
    phoneNumber: string;
    isPhoneVerified: boolean;
    isEmailVerified: boolean;
    firstLoginCompleted: boolean;
    profileCompletionStatus: string;
    profileCompletionPercentage: number;
    institutes: any[];
    nameWithInitials?: string;
    imageUrl?: string;
  };
}

// ============= API FUNCTIONS =============

const getApiBase = () => getBaseUrl();

/**
 * Step 1: Initiate first login by phone number
 * Sends SMS OTP to the user's phone
 */
export const initiatePhoneFirstLogin = async (phoneNumber: string): Promise<{
  success: boolean;
  message: string;
  expiresInMinutes: number;
}> => {
  const res = await fetch(`${getApiBase()}/auth/first-login/phone/initiate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send OTP');
  }
  return data;
};

/**
 * Step 2: Verify phone OTP
 * Returns JWT + annotated profile for form rendering
 */
export const verifyPhoneOtp = async (
  phoneNumber: string,
  otp: string
): Promise<PhoneVerifyResponse> => {
  const res = await fetch(`${getApiBase()}/auth/first-login/phone/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phoneNumber, otp }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Invalid OTP');
  }
  return data;
};

/**
 * Step 3: Request email OTP (requires JWT from step 2)
 */
export const requestEmailOtp = async (
  email: string,
  token: string
): Promise<{ success: boolean; message: string; expiresInMinutes: number }> => {
  const res = await fetch(`${getApiBase()}/auth/first-login/email/request-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send email OTP');
  }
  return data;
};

/**
 * Step 4: Verify email OTP (requires JWT from step 2)
 */
export const verifyEmailOtp = async (
  email: string,
  otpCode: string,
  token: string
): Promise<{ success: boolean; message: string; email: string }> => {
  const res = await fetch(`${getApiBase()}/auth/first-login/email/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email, otpCode }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to verify email');
  }
  return data;
};

/**
 * Step 5: Complete profile and set password
 * Returns real login tokens (access + refresh)
 */
export const completeFirstLogin = async (
  formData: Record<string, any>,
  token: string
): Promise<CompleteProfileResponse> => {
  const res = await fetch(`${getApiBase()}/auth/first-login/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to complete profile');
  }
  return data;
};

/**
 * Store the real login tokens after profile completion (Step 5)
 * Uses secure storage on mobile, memory + localStorage on web
 */
export const storeFirstLoginTokens = async (
  accessToken: string,
  refreshToken: string,
  expiresIn: string
): Promise<void> => {
  // Parse expires_in (e.g. "24h" → milliseconds)
  const expiryMs = parseExpiry(expiresIn);
  const expiryTimestamp = Date.now() + expiryMs;

  await tokenStorageService.setAccessToken(accessToken);
  await tokenStorageService.setRefreshToken(refreshToken);
  await tokenStorageService.setTokenExpiry(expiryTimestamp);

  // On mobile, always remember the user
  if (isNativePlatform()) {
    await tokenStorageService.setRememberMe(true);
  }
};

function parseExpiry(expiresIn: string): number {
  const match = expiresIn.match(/^(\d+)([hdms])$/);
  if (!match) return 24 * 60 * 60 * 1000; // default 24h
  const val = parseInt(match[1]);
  switch (match[2]) {
    case 'h': return val * 60 * 60 * 1000;
    case 'd': return val * 24 * 60 * 60 * 1000;
    case 'm': return val * 60 * 1000;
    case 's': return val * 1000;
    default: return 24 * 60 * 60 * 1000;
  }
}
