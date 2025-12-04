// API utility functions for user registration and file upload
import { env } from '@/config/env';

// Storage base URL for public files
const STORAGE_BASE_URL = 'https://storage.suraksha.lk';

/**
 * Get API base URL from environment configuration
 * Priority: localStorage > environment variable > default
 * @security Never hardcode API URLs
 */
const getApiBaseUrl = (): string => {
  // Allow override via localStorage for testing/debugging
  const localStorageUrl = localStorage.getItem('apiBaseUrl');
  if (localStorageUrl && env.enableDebug) {
    console.warn('🔧 Using API URL from localStorage:', localStorageUrl);
    return localStorageUrl;
  }
  return env.apiBaseUrl;
};

/**
 * Get JWT token from environment configuration
 * @security In production, this should come from a secure authentication flow
 */
const getJwtToken = (): string => {
  // In production, this should be retrieved from a secure auth context
  return env.jwtToken;
};

// Helper to get headers with JWT
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getJwtToken()}`
});

// Get folder type based on file context
export const getFolderType = (context: 'profile' | 'student' | 'institute' | 'subject' | 'homework' | 'correction' | 'payment' | 'id-document'): string => {
  const folderMap = {
    'profile': 'profile-images',
    'student': 'student-images',
    'institute': 'institute-images',
    'subject': 'subject-images',
    'homework': 'homework-files',
    'correction': 'correction-files',
    'payment': 'payment-receipts',
    'id-document': 'id-documents'
  };
  return folderMap[context] || 'profile-images';
};

// Generate signed URL for file upload - AWS S3 POST method
export interface SignedUrlRequest {
  folder: string;
  fileName: string;
  contentType: string;
  fileSize: number;
}

export interface SignedUrlResponse {
  success: boolean;
  message: string;
  uploadUrl: string;
  publicUrl: string;
  relativePath: string;
  fields: Record<string, string>;
  instructions?: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
  };
}

export const generateSignedUrl = async (file: File, context: string = 'profile'): Promise<SignedUrlResponse> => {
  const folder = getFolderType(context as any);
  
  const params = new URLSearchParams({
    folder,
    fileName: file.name,
    contentType: file.type,
    fileSize: file.size.toString()
  });

  const response = await fetch(`${getApiBaseUrl()}/upload/get-signed-url?${params}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getJwtToken()}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate signed URL');
  }

  return response.json();
};

// Upload file to S3 using POST with FormData
export const uploadFileToSignedUrl = async (file: File, signedUrlData: SignedUrlResponse): Promise<void> => {
  const formData = new FormData();
  
  // IMPORTANT: Add all fields from backend BEFORE the file
  if (signedUrlData.fields) {
    Object.keys(signedUrlData.fields).forEach(key => {
      formData.append(key, signedUrlData.fields[key]);
    });
  }
  
  // Add file LAST
  formData.append('file', file);

  // POST to S3 - DO NOT set Content-Type header, browser handles it
  const response = await fetch(signedUrlData.uploadUrl, {
    method: 'POST',
    body: formData
    // NO Content-Type header - browser sets it automatically with boundary
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`S3 upload failed: ${errorText}`);
  }
};

// Verify and publish uploaded file
export const verifyAndPublish = async (relativePath: string): Promise<{ success: boolean; publicUrl: string }> => {
  const response = await fetch(`${getApiBaseUrl()}/upload/verify-and-publish`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ relativePath })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to verify upload');
  }

  return response.json();
};

// Complete file upload flow - AWS S3 POST method
export const uploadFile = async (file: File, context: string = 'profile'): Promise<string> => {
  // Validate file size (frontend validation)
  const maxSizes: Record<string, number> = {
    'profile-images': 5 * 1024 * 1024,      // 5MB
    'student-images': 5 * 1024 * 1024,      // 5MB
    'institute-images': 10 * 1024 * 1024,   // 10MB
    'homework-files': 20 * 1024 * 1024,     // 20MB
    'payment-receipts': 10 * 1024 * 1024,   // 10MB
    'id-documents': 10 * 1024 * 1024        // 10MB
  };

  const folder = getFolderType(context as any);
  const maxSize = maxSizes[folder] || 5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(`File too large. Max size: ${maxSize / 1024 / 1024}MB`);
  }

  // Step 1: Get signed URL
  const signedUrlResponse = await generateSignedUrl(file, context);
  
  // Step 2: Upload file to S3 using POST with FormData
  await uploadFileToSignedUrl(file, signedUrlResponse);
  
  // Step 3: Verify and make public
  const verifyResult = await verifyAndPublish(signedUrlResponse.relativePath);
  
  // Step 4: Return relative path for use in API
  return signedUrlResponse.relativePath;
};

/**
 * Get the public URL for a file from its relative path
 * Uses the storage base URL: https://storage.suraksha.lk/{relativePath}
 */
export const getPublicUrl = (relativePath: string): string => {
  if (!relativePath) return '';
  // Remove any leading slash
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  return `${STORAGE_BASE_URL}/${cleanPath}`;
};

// Create comprehensive user (parent or student)
export interface ParentData {
  occupation: string;
  workplace: string;
  workPhone: string;
  educationLevel: string;
}

export interface StudentData {
  studentId: string | null;
  emergencyContact: string | null;
  medicalConditions: string;
  allergies: string;
  bloodGroup: string;
  fatherId?: string;
  fatherPhoneNumber?: string;
  motherId?: string;
  motherPhoneNumber?: string;
  guardianId?: string;
  guardianPhoneNumber?: string;
}

export interface ComprehensiveUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  userType: 'USER_WITHOUT_PARENT' | 'USER_WITHOUT_STUDENT';
  gender: string;
  dateOfBirth: string;
  nic: string;
  birthCertificateNo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  district: string;
  province: string;
  postalCode: string;
  country: string;
  imageUrl?: string;
  isActive: boolean;
  parentData?: ParentData;
  studentData?: StudentData;
}

export interface ComprehensiveUserResponse {
  success: boolean;
  message: string;
  userId: string;
}

export const createComprehensiveUser = async (userData: ComprehensiveUserRequest): Promise<ComprehensiveUserResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/comprehensive`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(userData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to create user';
    const userId = errorData.userId || '';
    const statusCode = response.status || errorData.statusCode || 500;
    
    // Create error with detailed information
    const error = new Error(errorMessage) as any;
    error.userId = userId;
    error.statusCode = statusCode;
    throw error;
  }

  return response.json();
};

// Update profile image URL
export interface UpdateProfileImageRequest {
  userId: string;
  imageUrl: string;
}

export interface UpdateProfileImageResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    imageUrl: string;
    updatedAt: string;
  };
}

export const updateProfileImage = async (data: UpdateProfileImageRequest): Promise<UpdateProfileImageResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/profile/image-url`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to update profile image');
  }

  return response.json();
};

// OTP Request and Verification
export interface OTPRequestResponse {
  success: boolean;
  message: string;
  expiresAt: string | null;
  remainingAttempts: number;
  totalRequests: number;
}

export interface OTPVerifyResponse {
  success: boolean;
  message: string;
}

export const requestPhoneOTP = async (phoneNumber: string): Promise<OTPRequestResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/create-phone-number-otp/request`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ phoneNumber })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to request phone OTP';
    const userId = errorData.userId || '';
    const statusCode = response.status || errorData.statusCode || 500;
    
    const error = new Error(errorMessage) as any;
    error.userId = userId;
    error.statusCode = statusCode;
    throw error;
  }

  return response.json();
};

export const verifyPhoneOTP = async (phoneNumber: string, otpCode: string): Promise<OTPVerifyResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/create-phone-number-otp/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ phoneNumber, otpCode })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to verify phone OTP';
    const userId = errorData.userId || '';
    const statusCode = response.status || errorData.statusCode || 500;
    
    const error = new Error(errorMessage) as any;
    error.userId = userId;
    error.statusCode = statusCode;
    throw error;
  }

  return response.json();
};

export const requestEmailOTP = async (email: string): Promise<OTPRequestResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/create-email-otp/request`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to request email OTP';
    const userId = errorData.userId || '';
    const statusCode = response.status || errorData.statusCode || 500;
    
    const error = new Error(errorMessage) as any;
    error.userId = userId;
    error.statusCode = statusCode;
    throw error;
  }

  return response.json();
};

export const verifyEmailOTP = async (email: string, otpCode: string): Promise<OTPVerifyResponse> => {
  const response = await fetch(`${getApiBaseUrl()}/users/create-email-otp/verify`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, otpCode })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || 'Failed to verify email OTP';
    const userId = errorData.userId || '';
    const statusCode = response.status || errorData.statusCode || 500;
    
    const error = new Error(errorMessage) as any;
    error.userId = userId;
    error.statusCode = statusCode;
    throw error;
  }

  return response.json();
};