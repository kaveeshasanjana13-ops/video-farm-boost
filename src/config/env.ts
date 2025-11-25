/**
 * Environment Configuration for Suraksha LMS
 * 
 * This module provides a type-safe way to access environment variables.
 * All environment variables are prefixed with VITE_ to be exposed to the client.
 * 
 * @security NEVER hardcode sensitive data. Always use environment variables.
 */

interface EnvConfig {
  // API Configuration
  apiBaseUrl: string;
  apiTimeout: number;
  jwtToken: string;

  // Application URLs
  appUrl: string;
  logoUrl: string;

  // Contact Information
  supportEmail: string;
  legalEmail: string;
  financialEmail: string;
  supportPhone: string;

  // Company Information
  companyName: string;
  companyRegistration: string;
  companyAddress: string;

  // Feature Flags
  enableAnalytics: boolean;
  enableDebug: boolean;
  enableErrorReporting: boolean;

  // Upload Configuration
  maxFileSize: number;
  allowedFileTypes: string[];

  // OTP Configuration
  otpExpiryMinutes: number;
  otpMaxAttempts: number;

  // Environment
  env: 'development' | 'production' | 'staging';
}

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, defaultValue: string = ''): string => {
  return import.meta.env[key] || defaultValue;
};

/**
 * Get boolean environment variable
 */
const getEnvBool = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined || value === null) return defaultValue;
  return value === 'true' || value === true;
};

/**
 * Get number environment variable
 */
const getEnvNumber = (key: string, defaultValue: number = 0): number => {
  const value = import.meta.env[key];
  if (value === undefined || value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Get array environment variable (comma-separated)
 */
const getEnvArray = (key: string, defaultValue: string[] = []): string[] => {
  const value = import.meta.env[key];
  if (!value) return defaultValue;
  return value.split(',').map((item: string) => item.trim());
};

/**
 * Validate required environment variables
 */
const validateEnv = (): void => {
  const required = [
    'VITE_API_BASE_URL',
    'VITE_JWT_TOKEN',
    'VITE_APP_URL',
  ];

  const missing = required.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

// Validate environment on module load
if (import.meta.env.MODE !== 'test') {
  validateEnv();
}

/**
 * Environment configuration object
 * All values are read from environment variables with sensible defaults
 */
export const env: EnvConfig = {
  // API Configuration
  apiBaseUrl: getEnvVar('VITE_API_BASE_URL', 'https://lms-923357517997.europe-west1.run.app'),
  apiTimeout: getEnvNumber('VITE_API_TIMEOUT', 30000),
  jwtToken: getEnvVar('VITE_JWT_TOKEN'),

  // Application URLs
  appUrl: getEnvVar('VITE_APP_URL', 'https://suraksha.lk'),
  logoUrl: getEnvVar('VITE_LOGO_URL', 'https://suraksha.lk/assets/logos/surakshalms-logo.png'),

  // Contact Information
  supportEmail: getEnvVar('VITE_SUPPORT_EMAIL', 'service@suraksha.lk'),
  legalEmail: getEnvVar('VITE_LEGAL_EMAIL', 'legal@suraksha.lk'),
  financialEmail: getEnvVar('VITE_FINANCIAL_EMAIL', 'financialsupport@suraksha.lk'),
  supportPhone: getEnvVar('VITE_SUPPORT_PHONE', '+94703300524'),

  // Company Information
  companyName: getEnvVar('VITE_COMPANY_NAME', 'SURAKSHA LEARNING MANAGEMENT SYSTEM (PVT) LTD'),
  companyRegistration: getEnvVar('VITE_COMPANY_REGISTRATION', 'PV 00342747'),
  companyAddress: getEnvVar('VITE_COMPANY_ADDRESS', '188/79 The Finans Waththa, Wilimbula, Henegama, Sri Lanka'),

  // Feature Flags
  enableAnalytics: getEnvBool('VITE_ENABLE_ANALYTICS', false),
  enableDebug: getEnvBool('VITE_ENABLE_DEBUG', import.meta.env.DEV),
  enableErrorReporting: getEnvBool('VITE_ENABLE_ERROR_REPORTING', import.meta.env.PROD),

  // Upload Configuration
  maxFileSize: getEnvNumber('VITE_MAX_FILE_SIZE', 10485760), // 10MB default
  allowedFileTypes: getEnvArray('VITE_ALLOWED_FILE_TYPES', ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']),

  // OTP Configuration
  otpExpiryMinutes: getEnvNumber('VITE_OTP_EXPIRY_MINUTES', 10),
  otpMaxAttempts: getEnvNumber('VITE_OTP_MAX_ATTEMPTS', 3),

  // Environment
  env: (getEnvVar('VITE_ENV', import.meta.env.MODE) as EnvConfig['env']) || 'development',
};

/**
 * Check if running in development mode
 */
export const isDevelopment = (): boolean => {
  return env.env === 'development' || import.meta.env.DEV;
};

/**
 * Check if running in production mode
 */
export const isProduction = (): boolean => {
  return env.env === 'production' || import.meta.env.PROD;
};

/**
 * Log environment info (only in development)
 */
if (isDevelopment() && env.enableDebug) {
  console.log('🔧 Suraksha LMS Environment Configuration:', {
    env: env.env,
    apiBaseUrl: env.apiBaseUrl,
    appUrl: env.appUrl,
    mode: import.meta.env.MODE,
  });
}

export default env;
