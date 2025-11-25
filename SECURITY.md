# Suraksha LMS - Security & Configuration Guide

## 🔒 Security Best Practices

This document outlines the security measures implemented in the Suraksha LMS frontend application.

## Environment Variables

### Overview
All sensitive configuration data is managed through environment variables. **NEVER** hardcode sensitive information in source code.

### Variable Prefix
All environment variables exposed to the frontend must be prefixed with `VITE_` to be accessible in the Vite build process.

### Configuration Files

1. **`.env.production`** - Main configuration template (committed to repo)
2. **`.env`** - Local copy for actual use (NEVER commit to repo)

### Setup Instructions

#### Setup:
```bash
# Copy the environment template
cp .env.production .env

# Edit .env with your specific configuration if needed
# For production deployment, set variables in your platform's dashboard
```

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://api.suraksha.lk` |
| `VITE_JWT_TOKEN` | JWT authentication token | `your_secure_token_here` |
| `VITE_APP_URL` | Frontend application URL | `https://suraksha.lk` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_LOGO_URL` | Company logo URL | `https://suraksha.lk/assets/logos/surakshalms-logo.png` |
| `VITE_SUPPORT_EMAIL` | Support email address | `service@suraksha.lk` |
| `VITE_LEGAL_EMAIL` | Legal email address | `legal@suraksha.lk` |
| `VITE_FINANCIAL_EMAIL` | Financial email address | `financialsupport@suraksha.lk` |
| `VITE_SUPPORT_PHONE` | Support phone number | `+94703300524` |
| `VITE_ENABLE_ANALYTICS` | Enable analytics tracking | `false` |
| `VITE_ENABLE_DEBUG` | Enable debug mode | `false` |
| `VITE_MAX_FILE_SIZE` | Maximum file upload size (bytes) | `10485760` (10MB) |

## Security Architecture

### 1. Configuration Management

```typescript
// ✅ CORRECT - Using environment variables
import { env } from '@/config/env';

const apiUrl = env.apiBaseUrl;
const token = env.jwtToken;

// ❌ WRONG - Hardcoded values
const apiUrl = 'https://api.example.com';
const token = 'hardcoded_token_123';
```

### 2. API Communication

All API calls use the centralized configuration:

```typescript
import { env } from '@/config/env';

const response = await fetch(`${env.apiBaseUrl}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${env.jwtToken}`,
    'Content-Type': 'application/json',
  },
});
```

### 3. Sensitive Data Protection

#### Never Commit:
- `.env` files (except `.env.example`)
- API keys or tokens
- Database credentials
- Private keys
- User data

#### Always Use:
- Environment variables for all configuration
- Secure token management
- HTTPS for all communications
- Input validation and sanitization

### 4. Git Security

The `.gitignore` file is configured to prevent committing sensitive files:

```gitignore
# Environment variables - NEVER commit these!
.env
.env.local
.env.*.local
```

## Deployment Configuration

### Vercel
```bash
# Add environment variables in Vercel dashboard
# Settings > Environment Variables
VITE_API_BASE_URL=https://api.suraksha.lk
VITE_JWT_TOKEN=your_production_token
# ... add all required variables
```

### Netlify
```bash
# Add environment variables in Netlify dashboard
# Site settings > Build & deploy > Environment
VITE_API_BASE_URL=https://api.suraksha.lk
VITE_JWT_TOKEN=your_production_token
# ... add all required variables
```

### Google Cloud Run / Firebase
```bash
# Use gcloud or Firebase CLI
gcloud run deploy --set-env-vars VITE_API_BASE_URL=https://api.suraksha.lk
```

### Docker
```dockerfile
# Use environment variables in docker-compose.yml
services:
  frontend:
    environment:
      - VITE_API_BASE_URL=${API_BASE_URL}
      - VITE_JWT_TOKEN=${JWT_TOKEN}
```

## Code Organization

### Configuration Files Location
```
src/
├── config/
│   ├── env.ts           # Environment variable management
│   └── constants.ts     # Application constants
└── lib/
    └── api.ts           # API utility functions
```

### Usage Pattern

```typescript
// 1. Import configuration
import { env } from '@/config/env';
import { CONTACT, URLS } from '@/config/constants';

// 2. Use in components
function Component() {
  return (
    <div>
      <img src={env.logoUrl} alt="Logo" />
      <a href={`mailto:${CONTACT.supportEmail}`}>Support</a>
    </div>
  );
}

// 3. Use in API calls
async function fetchData() {
  const response = await fetch(`${env.apiBaseUrl}/data`);
  return response.json();
}
```

## Security Checklist

### Before Committing Code:
- [ ] No hardcoded API URLs
- [ ] No hardcoded tokens or keys
- [ ] No sensitive data in code
- [ ] `.env` files not committed (except `.env.example`)
- [ ] All URLs use environment variables
- [ ] All emails use environment variables
- [ ] Constants imported from config files

### Before Deploying:
- [ ] Production environment variables configured
- [ ] Secure JWT token set
- [ ] HTTPS enabled
- [ ] Debug mode disabled
- [ ] Analytics configured (if needed)
- [ ] Error reporting configured
- [ ] API endpoints verified

### Regular Maintenance:
- [ ] Rotate JWT tokens regularly
- [ ] Review environment variables
- [ ] Update dependencies
- [ ] Review security logs
- [ ] Test error handling

## Token Management

### Development Token
The development token is included in `.env.development` for convenience but should be:
- Rotated regularly
- Never used in production
- Limited in scope and permissions

### Production Token
Production tokens must be:
- Stored securely in deployment platform
- Rotated regularly (recommended: monthly)
- Limited to necessary permissions
- Monitored for unusual activity

### Best Practices
```typescript
// ✅ CORRECT - Token from environment
const token = env.jwtToken;

// ❌ WRONG - Hardcoded token
const token = 'wvIcy1X3xreEL9CkT6KzFGqbsaHUZPVBYN0oiSDQR5pM2tudOl84gnjW7mJfhA';

// ✅ CORRECT - Conditional token validation
if (!env.jwtToken && env.env === 'production') {
  throw new Error('JWT token is required in production');
}
```

## Validation & Type Safety

All environment variables are validated on application startup:

```typescript
// Automatic validation in src/config/env.ts
const validateEnv = (): void => {
  const required = ['VITE_API_BASE_URL', 'VITE_JWT_TOKEN', 'VITE_APP_URL'];
  const missing = required.filter(key => !import.meta.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};
```

## Troubleshooting

### Environment Variables Not Loading
1. Restart development server after changing `.env`
2. Verify variables are prefixed with `VITE_`
3. Check for syntax errors in `.env` file
4. Clear cache: `rm -rf node_modules/.vite`

### Production Deployment Issues
1. Verify all required variables are set in deployment platform
2. Check variable names match exactly (case-sensitive)
3. Ensure no trailing spaces in values
4. Test with production build locally: `npm run build && npm run preview`

## Contact & Support

For security concerns or questions:
- **Security Email**: security@suraksha.lk
- **Support**: service@suraksha.lk
- **Phone**: +94 70 330 0524

## Additional Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)
- [React Security Best Practices](https://react.dev/learn/security)

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0  
**Maintained by**: Suraksha LMS Development Team
