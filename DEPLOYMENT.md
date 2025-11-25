# Suraksha LMS - Deployment Guide

## 🚀 Deployment Instructions

This guide provides step-by-step instructions for deploying the Suraksha LMS frontend to various platforms.

## Prerequisites

Before deploying, ensure you have:
- [ ] All required environment variables configured
- [ ] Production API endpoint ready
- [ ] Production JWT token generated
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate configured (HTTPS)

## Environment Variables Setup

### Required for Production

```bash
VITE_API_BASE_URL=https://your-production-api.com
VITE_JWT_TOKEN=your_secure_production_token
VITE_APP_URL=https://suraksha.lk
VITE_LOGO_URL=https://suraksha.lk/assets/logos/surakshalms-logo.png
VITE_SUPPORT_EMAIL=service@suraksha.lk
VITE_LEGAL_EMAIL=legal@suraksha.lk
VITE_FINANCIAL_EMAIL=financialsupport@suraksha.lk
VITE_SUPPORT_PHONE=+94703300524
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENV=production
```

## Platform-Specific Instructions

### 1. Vercel (Recommended)

#### Via CLI:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Via Dashboard:
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure environment variables:
   - Go to Settings > Environment Variables
   - Add all required variables
6. Deploy

#### Build Configuration:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

---

### 2. Netlify

#### Via CLI:
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Via Dashboard:
1. Push code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Add environment variables in Site Settings > Build & deploy > Environment
7. Deploy

#### netlify.toml Configuration:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### 3. Google Cloud Run

#### Setup:
```bash
# 1. Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ARG VITE_JWT_TOKEN
ARG VITE_APP_URL
ENV VITE_API_BASE_URL=\$VITE_API_BASE_URL
ENV VITE_JWT_TOKEN=\$VITE_JWT_TOKEN
ENV VITE_APP_URL=\$VITE_APP_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
EOF

# 2. Create nginx.conf
cat > nginx.conf << EOF
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# 3. Build and deploy
gcloud builds submit --tag gcr.io/PROJECT_ID/suraksha-lms
gcloud run deploy suraksha-lms \
  --image gcr.io/PROJECT_ID/suraksha-lms \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --set-env-vars VITE_API_BASE_URL=https://api.suraksha.lk,VITE_JWT_TOKEN=your_token
```

---

### 4. AWS S3 + CloudFront

#### Setup:
```bash
# 1. Build the application
npm run build

# 2. Create S3 bucket
aws s3 mb s3://suraksha-lms-frontend

# 3. Upload files
aws s3 sync dist/ s3://suraksha-lms-frontend --delete

# 4. Configure S3 for static website hosting
aws s3 website s3://suraksha-lms-frontend \
  --index-document index.html \
  --error-document index.html

# 5. Create CloudFront distribution
# (Use AWS Console or CLI)

# 6. Update environment variables
# Use AWS Systems Manager Parameter Store or Secrets Manager
```

#### Automated Deployment Script:
```bash
#!/bin/bash
# deploy.sh

# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://suraksha-lms-frontend \
  --delete \
  --cache-control max-age=31536000,public

# Upload index.html separately (no cache)
aws s3 cp dist/index.html s3://suraksha-lms-frontend/index.html \
  --cache-control no-cache,no-store,must-revalidate

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
```

---

### 5. Docker Deployment

#### Dockerfile:
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_JWT_TOKEN
ARG VITE_APP_URL
ARG VITE_LOGO_URL
ARG VITE_SUPPORT_EMAIL
ARG VITE_LEGAL_EMAIL
ARG VITE_FINANCIAL_EMAIL
ARG VITE_SUPPORT_PHONE
ARG VITE_ENABLE_ANALYTICS=true
ARG VITE_ENABLE_DEBUG=false
ARG VITE_ENV=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_JWT_TOKEN=$VITE_JWT_TOKEN
ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_LOGO_URL=$VITE_LOGO_URL
ENV VITE_SUPPORT_EMAIL=$VITE_SUPPORT_EMAIL
ENV VITE_LEGAL_EMAIL=$VITE_LEGAL_EMAIL
ENV VITE_FINANCIAL_EMAIL=$VITE_FINANCIAL_EMAIL
ENV VITE_SUPPORT_PHONE=$VITE_SUPPORT_PHONE
ENV VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS
ENV VITE_ENABLE_DEBUG=$VITE_ENABLE_DEBUG
ENV VITE_ENV=$VITE_ENV

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml:
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - VITE_API_BASE_URL=${API_BASE_URL}
        - VITE_JWT_TOKEN=${JWT_TOKEN}
        - VITE_APP_URL=${APP_URL}
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Build and Run:
```bash
# Build image
docker build \
  --build-arg VITE_API_BASE_URL=https://api.suraksha.lk \
  --build-arg VITE_JWT_TOKEN=your_token \
  --build-arg VITE_APP_URL=https://suraksha.lk \
  -t suraksha-lms-frontend .

# Run container
docker run -d \
  -p 8080:8080 \
  --name suraksha-lms \
  suraksha-lms-frontend

# Or use docker-compose
docker-compose up -d
```

---

## Post-Deployment Checklist

After deployment, verify:

- [ ] Application loads correctly
- [ ] All pages are accessible
- [ ] API calls work properly
- [ ] Environment variables are correctly set
- [ ] SSL/HTTPS is working
- [ ] Custom domain is configured
- [ ] Analytics are tracking (if enabled)
- [ ] Error reporting is working
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] OTP verification works
- [ ] Mobile responsiveness
- [ ] Browser compatibility

## Performance Optimization

### 1. Enable Compression
Ensure your server/CDN enables gzip/brotli compression

### 2. Set Cache Headers
```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location / {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

### 3. Enable HTTP/2
Configure your server to use HTTP/2 for better performance

### 4. Use CDN
Consider using a CDN for static assets:
- Cloudflare
- AWS CloudFront
- Google Cloud CDN

## Monitoring & Logging

### 1. Set up monitoring:
- Application performance monitoring (APM)
- Error tracking (e.g., Sentry)
- Analytics (if enabled)
- Uptime monitoring

### 2. Configure logging:
- Application logs
- Access logs
- Error logs

## Security Hardening

### 1. HTTP Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### 2. HTTPS Only
Redirect all HTTP traffic to HTTPS

### 3. Rate Limiting
Implement rate limiting to prevent abuse

## Rollback Procedure

If issues occur after deployment:

### Vercel/Netlify:
1. Go to Deployments
2. Find previous working deployment
3. Click "Publish" to rollback

### Docker:
```bash
# Stop current container
docker stop suraksha-lms

# Run previous version
docker run -d -p 8080:8080 suraksha-lms-frontend:previous-tag
```

### S3/CloudFront:
```bash
# Restore from backup
aws s3 sync s3://suraksha-lms-backup/ s3://suraksha-lms-frontend/

# Invalidate cache
aws cloudfront create-invalidation --distribution-id ID --paths "/*"
```

## Continuous Integration/Deployment (CI/CD)

### GitHub Actions Example:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      env:
        VITE_API_BASE_URL: ${{ secrets.VITE_API_BASE_URL }}
        VITE_JWT_TOKEN: ${{ secrets.VITE_JWT_TOKEN }}
        VITE_APP_URL: ${{ secrets.VITE_APP_URL }}
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Support

For deployment assistance:
- **Email**: devops@suraksha.lk
- **Phone**: +94 70 330 0524
- **Documentation**: See SECURITY.md for more details

---

**Last Updated**: November 25, 2025  
**Version**: 1.0.0
