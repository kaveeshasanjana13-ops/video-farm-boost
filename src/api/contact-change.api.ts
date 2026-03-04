import { apiClient } from './client';

export interface OtpRequestResponse {
  success: boolean;
  message: string;
  expiresAt: string;
  remainingAttempts: number;
  totalRequests: number;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  newPhoneNumber?: string;
  newEmail?: string;
}

export const contactChangeApi = {
  requestPhoneOtp: async (phoneNumber: string): Promise<OtpRequestResponse> => {
    return apiClient.post('/users/phone/change/request-otp', { phoneNumber });
  },

  verifyPhoneOtp: async (phoneNumber: string, otpCode: string): Promise<OtpVerifyResponse> => {
    return apiClient.post('/users/phone/change/verify-otp', { phoneNumber, otpCode });
  },

  requestEmailOtp: async (email: string): Promise<OtpRequestResponse> => {
    return apiClient.post('/users/email/change/request-otp', { email });
  },

  verifyEmailOtp: async (email: string, otpCode: string): Promise<OtpVerifyResponse> => {
    return apiClient.post('/users/email/change/verify-otp', { email, otpCode });
  },
};
