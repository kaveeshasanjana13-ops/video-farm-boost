// API utility functions for user registration and file upload
import { env } from '@/config/env';

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

// Generate signed URL for file upload
export interface SignedUrlRequest {
  folder: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  expiresIn: number;
}

export interface SignedUrlResponse {
  success: boolean;
  message: string;
  data: {
    uploadUrl: string;
    relativePath: string;
    expiresAt: string | null;
    maxFileSize: number;
    contentType: string;
  };
  instructions: {
    step1: string;
    step2: string;
    step3: string;
    uploadMethod: string;
    uploadUrl: string;
    headers: {
      'Content-Type': string;
      'x-goog-content-length-range': string;
    };
    maxFileSize: number;
    expiresIn: string;
    important: string;
  };
}

export const generateSignedUrl = async (file: File, context: string = 'profile'): Promise<SignedUrlResponse> => {
  const folder = getFolderType(context as any);
  const fileName = `${folder}.${file.name.split('.').pop()}`;
  
  const requestBody: SignedUrlRequest = {
    folder,
    fileName,
    contentType: file.type,
    fileSize: file.size,
    expiresIn: 600 // 10 minutes
  };

  const response = await fetch(`${getApiBaseUrl()}/upload/generate-signed-url`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Failed to generate signed URL');
  }

  return response.json();
};

// Upload file to signed URL
export const uploadFileToSignedUrl = async (file: File, signedUrlData: SignedUrlResponse['data']): Promise<void> => {
  const response = await fetch(signedUrlData.uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': signedUrlData.contentType,
      'x-goog-content-length-range': `0,${signedUrlData.maxFileSize}`
    },
    body: file
  });

  if (!response.ok) {
    throw new Error('Failed to upload file');
  }
};

// Complete file upload flow
export const uploadFile = async (file: File, context: string = 'profile'): Promise<string> => {
  // Step 1: Generate signed URL
  const signedUrlResponse = await generateSignedUrl(file, context);
  
  // Step 2: Upload file to signed URL
  await uploadFileToSignedUrl(file, signedUrlResponse.data);
  
  // Step 3: Return relative path for use in API
  return signedUrlResponse.data.relativePath;
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
