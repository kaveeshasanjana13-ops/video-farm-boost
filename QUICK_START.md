# 🚀 Quick Start Guide - Suraksha LMS

## For Developers

### 1️⃣ Initial Setup (First Time)
```bash
# Clone repository
git clone <repository-url>
cd stark-single-page

# Install dependencies
npm install

# Setup environment variables
cp .env.production .env

# Start development server
npm run dev
```

### 2️⃣ Daily Development
```bash
# Start dev server
npm run dev

# Build for testing
npm run build

# Preview production build
npm run preview
```

### 3️⃣ Before Committing
```bash
# Check for build errors
npm run build

# Lint code
npm run lint

# NEVER commit .env files!
```

---

## For DevOps/Deployment

### 1️⃣ Environment Variables Setup

**Required Variables:**
```bash
VITE_API_BASE_URL=https://your-api.com
VITE_JWT_TOKEN=your_secure_token
VITE_APP_URL=https://suraksha.lk
```

**Optional Variables:**
```bash
VITE_LOGO_URL=https://suraksha.lk/assets/logos/surakshalms-logo.png
VITE_SUPPORT_EMAIL=service@suraksha.lk
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG=false
```

### 2️⃣ Quick Deploy

**Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Docker:**
```bash
docker build -t suraksha-lms --build-arg VITE_API_BASE_URL=https://api.com --build-arg VITE_JWT_TOKEN=token .
docker run -d -p 8080:8080 suraksha-lms
```

### 3️⃣ Verify Deployment
- ✅ App loads
- ✅ API calls work
- ✅ HTTPS enabled
- ✅ No console errors

---

## 📁 Project Structure

```
stark-single-page/
├── src/
│   ├── config/
│   │   ├── env.ts           # 🔐 Environment configuration
│   │   └── constants.ts     # 📋 App constants
│   ├── lib/
│   │   └── api.ts          # 🌐 API utilities
│   ├── components/          # ⚛️ React components
│   └── pages/              # 📄 Page components
├── .env.development        # 🛠️ Dev environment (safe to commit)
├── .env.production         # 🚀 Production template
├── .env.example           # 📝 Template
├── .env                   # 🔒 Local config (DO NOT COMMIT!)
├── SECURITY.md            # 🔐 Security guide
├── DEPLOYMENT.md          # 🚀 Deployment guide
└── README.md              # 📖 Main docs
```

---

## 🔐 Security Checklist

### ✅ DO:
- ✅ Use environment variables for all config
- ✅ Import from `@/config/env` and `@/config/constants`
- ✅ Keep `.env` out of version control
- ✅ Rotate tokens regularly
- ✅ Use HTTPS in production

### ❌ DON'T:
- ❌ Hardcode URLs in components
- ❌ Hardcode tokens or keys
- ❌ Commit `.env` files
- ❌ Use development tokens in production
- ❌ Expose sensitive data in logs

---

## 🔧 Common Tasks

### Add New Environment Variable
```typescript
// 1. Add to .env files
VITE_NEW_VAR=value

// 2. Add to src/config/env.ts interface
interface EnvConfig {
  newVar: string;
}

// 3. Add to export
export const env: EnvConfig = {
  newVar: getEnvVar('VITE_NEW_VAR', 'default'),
};

// 4. Use in code
import { env } from '@/config/env';
console.log(env.newVar);
```

### Use API Endpoint
```typescript
import { env } from '@/config/env';

const response = await fetch(`${env.apiBaseUrl}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${env.jwtToken}`,
  },
});
```

### Use Constants
```typescript
import { CONTACT, URLS } from '@/config/constants';

<a href={`mailto:${CONTACT.supportEmail}`}>Support</a>
<img src={URLS.logo} alt="Logo" />
```

---

## 🆘 Troubleshooting

### Issue: Environment variables not loading
**Solution:**
```bash
# Restart dev server after .env changes
# Ctrl+C to stop
npm run dev
```

### Issue: Build fails
**Solution:**
```bash
# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

### Issue: Missing environment variables
**Solution:**
```bash
# Check .env file exists
cat .env

# Copy from template if missing
cp .env.development .env
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `README.md` | Project overview & setup |
| `SECURITY.md` | Security guidelines (detailed) |
| `DEPLOYMENT.md` | Deployment instructions (all platforms) |
| `IMPLEMENTATION_SUMMARY.md` | What was changed & why |
| `QUICK_START.md` | This file - quick reference |

---

## 💡 Tips

1. **Development**: Use `.env.development` values
2. **Production**: Set variables in deployment platform
3. **Testing**: Use `npm run build` before deploying
4. **Security**: Read `SECURITY.md` for best practices
5. **Help**: Check documentation or contact support

---

## 📞 Support

- **Email**: service@suraksha.lk
- **Phone**: +94 70 330 0524
- **Security**: security@suraksha.lk

---

## ✅ Pre-Deployment Checklist

- [ ] All environment variables set
- [ ] Build successful (`npm run build`)
- [ ] No hardcoded URLs or tokens
- [ ] HTTPS configured
- [ ] Domain configured
- [ ] Monitoring enabled
- [ ] Backup plan ready

---

**Quick Start Guide v1.0**  
**Last Updated**: November 25, 2025
