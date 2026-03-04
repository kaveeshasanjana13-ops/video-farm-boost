# 🚀 Google Drive Integration - Complete Setup Guide

## ✅ **Status: Implementation COMPLETE**

All code is implemented and ready. You just need to:
1. Run database migrations
2. Configure environment variables
3. Set up Google Cloud OAuth credentials

---

## 📊 **Architecture Overview**

Your system uses **Direct Upload + Token Dispensing** pattern:

```
┌──────────┐                    ┌────────────┐                    ┌──────────┐
│ Frontend │                    │  Backend   │                    │  Google  │
│          │                    │  (NestJS)  │                    │  Drive   │
└────┬─────┘                    └──────┬─────┘                    └────┬─────┘
     │                                 │                                │
     │ 1. Connect Drive (one-time)     │                                │
     ├────────────────────────────────>│                                │
     │                                 │                                │
     │ 2. Redirect to Google OAuth     │                                │
     │<────────────────────────────────┤                                │
     │                                 │                                │
     │ 3. User grants consent          │                                │
     ├─────────────────────────────────┼───────────────────────────────>│
     │                                 │                                │
     │ 4. Google redirects to callback │                                │
     │                                 │<───────────────────────────────┤
     │                                 │                                │
     │ 5. Store encrypted refresh token│                                │
     │<────────────────────────────────┤ (in database, AES-256-GCM)    │
     │                                 │                                │
     │ 6. Request access token         │                                │
     ├────────────────────────────────>│                                │
     │                                 │                                │
     │ 7. Get fresh access token       │                                │
     │<────────────────────────────────┤ (using refresh token)          │
     │                                 │                                │
     │ 8. Upload file DIRECTLY         │                                │
     ├─────────────────────────────────┼───────────────────────────────>│
     │                                 │                                │
     │ 9. Register file metadata       │                                │
     ├────────────────────────────────>│                                │
     │                                 │                                │
     │ 10. Verify file exists          │                                │
     │                                 ├───────────────────────────────>│
     │                                 │<───────────────────────────────┤
     │                                 │                                │
     │ 11. Success response            │                                │
     │<────────────────────────────────┤                                │
```

**Benefits:**
- ✅ Files never pass through your server (saves bandwidth)
- ✅ No server memory pressure from large files
- ✅ Faster uploads (direct to Google)
- ✅ Refresh tokens NEVER exposed to frontend
- ✅ Automatic token refresh every hour
- ✅ One-time OAuth consent per user

---

## 📋 **Step 1: Run Database Migrations**

### **Option A: Manual SQL** (Recommended if you have direct DB access)

```sql
-- Run this SQL file:
-- src/modules/user-drive-access/migrations/001_create_drive_tables.sql

-- Creates two tables:
-- 1. user_drive_tokens → Stores encrypted refresh tokens (one per user)
-- 2. user_drive_files  → Tracks uploaded files (metadata only)
```

Connect to your MySQL database and execute:
```bash
mysql -u your_username -p your_database < src/modules/user-drive-access/migrations/001_create_drive_tables.sql
```

### **Option B: TypeORM Migration** (If you use TypeORM migrations)

Your entities are already defined. TypeORM auto-sync should create tables on next startup if `synchronize: true` in development.

⚠️ **For production:** Always use manual migrations, not auto-sync.

---

## 🔐 **Step 2: Configure Environment Variables**

Add these to your backend `.env` file:

```env
# ============================================================
# GOOGLE CLOUD OAUTH 2.0 Configuration
# ============================================================

# OAuth 2.0 Client ID (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# OAuth 2.0 Client Secret (from Google Cloud Console)
GOOGLE_CLIENT_SECRET=your-client-secret-here

# OAuth Callback URL for Drive connections
# Must match EXACTLY what you configured in Google Cloud Console
GOOGLE_DRIVE_CALLBACK_URI=https://api.yourdomain.com/drive-access/callback

# Frontend URL (for redirects after OAuth)
FRONTEND_URL=https://lms.yourdomain.com

# ============================================================
# DRIVE TOKEN ENCRYPTION
# ============================================================

# 32+ character encryption key for AES-256-GCM
# CRITICAL: Keep this secret! Change invalidates all stored tokens.
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
DRIVE_TOKEN_ENCRYPTION_KEY=your-64-character-hex-string-here
```

### **Generate Encryption Key:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ☁️ **Step 3: Google Cloud Console Setup**

### **3.1. Create/Access Google Cloud Project**

1. Go to: https://console.cloud.google.com/
2. Select or create a project (e.g., "LMS Suraksha")

### **3.2. Enable Required APIs**

Go to: https://console.cloud.google.com/apis/library

Enable these APIs:
- ✅ **Google Drive API** → Required for file operations
- ✅ **Google+ API** (or People API) → Required for user profile info

### **3.3. Create OAuth 2.0 Credentials**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. Configure the **OAuth consent screen**:
   - User Type: **External** or **Internal**
   - App name: **"LMS Suraksha"**
   - Scopes: Add **"drive.file"**, **"email"**, **"profile"**
4. Create **OAuth Client ID:**
   - Application type: **Web application**
   - **Authorized redirect URIs:**
     ```
     https://api.yourdomain.com/drive-access/callback
     ```
5. Copy the **Client ID** and **Client Secret** into your `.env`

### **3.4. OAuth Consent Screen Scopes**

- `https://www.googleapis.com/auth/drive.file` ✅
- `openid` ✅
- `email` ✅
- `profile` ✅

---

## 🧪 **Step 4: Test the Integration**

### **Check Connection Status:**
```http
GET /drive-access/status
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Initiate Connection:**
```http
GET /drive-access/connect?returnUrl=/homework
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Get Access Token:**
```http
GET /drive-access/token
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 📱 **Frontend Components**

| Component | File | Purpose |
|-----------|------|---------|
| Drive Service | `src/services/driveService.ts` | API calls to backend |
| Token Cache | `src/lib/driveTokenCache.ts` | Caches access tokens with 5-min buffer |
| Upload Logic | `src/lib/driveUpload.ts` | Simple + resumable uploads |
| Upload Hook | `src/hooks/useDriveUpload.ts` | React hook for upload state |
| Callback Hook | `src/hooks/useDriveCallback.ts` | Handles OAuth redirect params |
| Connected Apps UI | `src/components/ConnectedApps.tsx` | Settings page Drive management |
| Drive Uploader | `src/components/forms/GoogleDriveUploader.tsx` | File picker + upload widget |
| Auth Callback Page | `src/pages/GoogleAuthCallback.tsx` | OAuth callback route |

---

## ⚙️ **Production Deployment Checklist**

- [ ] Generate strong `DRIVE_TOKEN_ENCRYPTION_KEY` (32 bytes, random)
- [ ] Set all Google OAuth env vars in production
- [ ] Run database migrations on production DB
- [ ] Verify redirect URIs match production domain exactly
- [ ] Enable Google Drive API and People API in Google Cloud
- [ ] Test OAuth flow end-to-end
- [ ] Monitor `user_drive_tokens` table for `consecutive_failures` > 3
- [ ] Backup encryption key securely

---

## 🔒 **Security**

✅ Refresh tokens encrypted at rest (AES-256-GCM)
✅ Refresh tokens NEVER sent to frontend
✅ Access tokens short-lived (~1 hour)
✅ Scoped to `drive.file` only
✅ One connection per user (unique constraint)
✅ Auto-disconnect after 5 consecutive failures

---

## 🐛 **Troubleshooting**

| Error | Cause | Fix |
|-------|-------|-----|
| "No refresh token received" | User already consented | Revoke at https://myaccount.google.com/permissions and reconnect |
| "Invalid grant" | Refresh token expired/revoked | Disconnect and reconnect |
| "redirect_uri_mismatch" | URI mismatch | Verify `GOOGLE_DRIVE_CALLBACK_URI` matches Google Console |
| "Encryption key must be 32+ chars" | Missing env var | Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
