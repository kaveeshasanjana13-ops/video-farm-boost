/**
 * Application Constants for Suraksha LMS
 * 
 * This module provides centralized constants used throughout the application.
 * Values are derived from environment configuration where applicable.
 * 
 * @security All sensitive values should come from environment variables
 */

import { env } from '@/config/env';

/**
 * Company Information
 */
export const COMPANY = {
  name: env.companyName,
  registration: env.companyRegistration,
  address: env.companyAddress,
} as const;

/**
 * Contact Information
 */
export const CONTACT = {
  supportEmail: env.supportEmail,
  legalEmail: env.legalEmail,
  financialEmail: env.financialEmail,
  supportPhone: env.supportPhone,
} as const;

/**
 * Application URLs
 */
export const URLS = {
  app: env.appUrl,
  logo: env.logoUrl,
  api: env.apiBaseUrl,
} as const;

/**
 * File Upload Configuration
 */
export const UPLOAD = {
  maxFileSize: env.maxFileSize,
  maxFileSizeMB: Math.floor(env.maxFileSize / (1024 * 1024)),
  allowedFileTypes: env.allowedFileTypes,
  allowedExtensions: ['jpg', 'jpeg', 'png', 'pdf'],
} as const;

/**
 * OTP Configuration
 */
export const OTP = {
  expiryMinutes: env.otpExpiryMinutes,
  maxAttempts: env.otpMaxAttempts,
} as const;

/**
 * Validation Patterns
 */
export const VALIDATION = {
  // Sri Lankan NIC patterns
  nicOld: /^[0-9]{9}[vVxX]$/,
  nicNew: /^[0-9]{12}$/,
  
  // Phone number pattern (Sri Lanka)
  phone: /^(\+94|0)?[0-9]{9}$/,
  
  // Email pattern
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // Postal code (Sri Lanka)
  postalCode: /^[0-9]{5}$/,
  
  // Birth certificate number
  birthCertificate: /^[0-9]{6,10}$/,
} as const;

/**
 * User Types
 */
export const USER_TYPES = {
  STUDENT: 'USER_WITHOUT_PARENT',
  PARENT: 'USER_WITHOUT_STUDENT',
  TEACHER: 'TEACHER',
  INSTITUTE_ADMIN: 'INSTITUTE_ADMIN',
} as const;

/**
 * Blood Groups
 */
export const BLOOD_GROUPS = [
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-',
  'Unknown',
] as const;

/**
 * Education Levels
 */
export const EDUCATION_LEVELS = [
  'Primary Education',
  'O-Level',
  'A-Level',
  'Diploma',
  'Bachelor\'s Degree',
  'Master\'s Degree',
  'Doctorate',
  'Other',
] as const;

/**
 * Genders
 */
export const GENDERS = [
  'Male',
  'Female',
  'Other',
] as const;

/**
 * Form Step Names
 */
export const FORM_STEPS = {
  STUDENT: {
    PERSONAL_INFO: 'Personal Information',
    LOCATION: 'Location Details',
    PARENT_INFO: 'Parent Information',
    ADDITIONAL: 'Additional Information',
    VERIFICATION: 'Verification',
    REVIEW: 'Review & Submit',
  },
  PARENT: {
    PERSONAL_INFO: 'Personal Information',
    LOCATION: 'Location Details',
    PROFESSIONAL: 'Professional Information',
    VERIFICATION: 'Verification',
    REVIEW: 'Review & Submit',
  },
  TEACHER: {
    PERSONAL_INFO: 'Personal Information',
    LOCATION: 'Location Details',
    QUALIFICATIONS: 'Qualifications',
    VERIFICATION: 'Verification',
    REVIEW: 'Review & Submit',
  },
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_NIC: 'Please enter a valid NIC number',
  INVALID_POSTAL_CODE: 'Please enter a valid postal code',
  FILE_TOO_LARGE: `File size must be less than ${Math.floor(env.maxFileSize / (1024 * 1024))}MB`,
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  VERIFICATION_FAILED: 'Verification failed. Please try again.',
  OTP_EXPIRED: 'OTP has expired. Please request a new one.',
  OTP_INVALID: 'Invalid OTP. Please check and try again.',
  MAX_ATTEMPTS_REACHED: 'Maximum attempts reached. Please try again later.',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  REGISTRATION_COMPLETE: 'Registration completed successfully!',
  VERIFICATION_COMPLETE: 'Verification completed successfully!',
  FILE_UPLOADED: 'File uploaded successfully!',
  OTP_SENT: 'OTP sent successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
} as const;

/**
 * Feature Flags
 */
export const FEATURES = {
  enableAnalytics: env.enableAnalytics,
  enableDebug: env.enableDebug,
  enableErrorReporting: env.enableErrorReporting,
} as const;

export default {
  COMPANY,
  CONTACT,
  URLS,
  UPLOAD,
  OTP,
  VALIDATION,
  USER_TYPES,
  BLOOD_GROUPS,
  EDUCATION_LEVELS,
  GENDERS,
  FORM_STEPS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES,
};
