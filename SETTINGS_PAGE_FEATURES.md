# Settings Page - Feature Specification

## Overview
Comprehensive settings page for the Suraksha LMS application, covering user preferences, notifications, accessibility, privacy, and system configuration.

---

## 1. App Version & About
**Storage: Local only (hardcoded/env)**

| Feature | Description | Storage |
|---------|-------------|---------|
| App version number | Display current app version (from `package.json` or env) | Hardcoded |
| Build info | Show build date, environment (dev/prod) | Hardcoded |
| Check for updates | Button to check if newer version available (Capacitor only) | N/A |
| Open source licenses | Link to third-party license info | Static page |
| Contact support | Link to email/WhatsApp support | Hardcoded |

---

## 2. Notifications
**Storage: Mixed (local + DB sync recommended)**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Enable/Disable push notifications | Master toggle for all push notifications | **DB sync** | Should persist across devices |
| Notification sound | Toggle sound on/off for notifications | **Local** | Device-specific preference |
| Sound selection | Choose notification tone | **Local** | Device-specific |
| Vibration | Toggle vibration for notifications | **Local** | Device-specific |
| Quiet hours | Set "Do Not Disturb" time range (e.g., 10 PM - 7 AM) | **DB sync** | User preference across devices |
| Notification categories | Toggle per-category: Attendance, Homework, Exams, Payments, Announcements | **DB sync** | Should sync across devices |
| Already read / unread indicator | Show read/unread badge on notification bell | **DB sync** | Must sync across devices |
| Mark all as read | Button to mark all notifications as read | **DB sync** | Must sync across devices |
| Notification history retention | How long to keep notification history (7/30/90 days) | **DB sync** | Server-side cleanup |
| In-app notification banner | Show/hide floating toast notifications in-app | **Local** | Device-specific UX preference |

---

## 3. Appearance & Display
**Storage: Local only**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Theme mode | Light / Dark / System (currently light-only) | **Local** | Device-specific, instant apply |
| Card view vs Table view | Toggle content display format | **Local** | Already implemented, device preference |
| Text size | Small / Medium / Large / Extra Large | **Local** | Device-specific accessibility |
| Font family | Default / Dyslexia-friendly / Serif | **Local** | Device-specific accessibility |
| Compact mode | Reduce padding/spacing for dense data view | **Local** | Device-specific preference |
| Sidebar collapsed by default | Start with sidebar minimized | **Local** | Device-specific layout |
| Animation/motion | Reduce motion for accessibility | **Local** | Device-specific accessibility |
| Accent color | Choose primary accent color | **Local** | Personal preference |

---

## 4. Language & Region
**Storage: DB sync recommended**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Language | Sinhala / Tamil / English | **DB sync** | User identity preference |
| Date format | DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD | **Local** | Device-specific |
| Time format | 12-hour / 24-hour | **Local** | Device-specific |
| First day of week | Sunday / Monday | **Local** | Regional preference |

---

## 5. Privacy & Security
**Storage: DB sync**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Privacy policy page | Link to full privacy policy | Static page | Legal requirement |
| Terms of service | Link to ToS | Static page | Legal requirement |
| Profile visibility | Who can see my profile (public/institute-only/private) | **DB sync** | Security - must be server-enforced |
| Show phone number | Toggle visibility of phone to others | **DB sync** | Privacy - server-enforced |
| Show email | Toggle visibility of email to others | **DB sync** | Privacy - server-enforced |
| Active sessions | View and manage logged-in devices | **DB sync** | Security feature |
| Change password | Update account password | **DB sync** | Auth system |
| Two-factor auth (2FA) | Enable/disable 2FA | **DB sync** | Security feature |
| Data export | Download my data (GDPR compliance) | **DB sync** | Legal requirement |
| Delete account | Request account deletion | **DB sync** | Legal requirement |

---

## 6. Data & Storage
**Storage: Local only**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Clear cache | Button to clear all cached API data | **Local** | Device-specific cache |
| Cache size display | Show current cache storage usage | **Local** | Device info |
| Auto-clear cache | Set auto-clear interval (never/weekly/monthly) | **Local** | Device preference |
| Offline mode | Enable/disable offline data caching | **Local** | Device-specific |
| Image quality | Low / Medium / High (affects data usage) | **Local** | Device/network preference |
| Auto-download media | Toggle auto-download of images/videos on WiFi | **Local** | Device preference |

---

## 7. Backend Configuration (Admin/Dev only)
**Storage: Local only**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| API Base URL | Main backend endpoint | **Local** | Already implemented, device-specific |
| Attendance Backend URL | Attendance service endpoint | **Local** | Already implemented |
| Connection timeout | Set API timeout duration | **Local** | Network-specific |
| Debug mode | Enable verbose logging | **Local** | Developer tool |

---

## 8. Accessibility
**Storage: Local only**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| High contrast mode | Increase contrast for readability | **Local** | Device-specific |
| Screen reader support | Optimize for screen readers | **Local** | Device-specific |
| Reduce motion | Disable animations | **Local** | Device-specific |
| Large touch targets | Increase button/tap area sizes | **Local** | Device-specific |

---

## 9. Connected Apps & Integrations
**Storage: DB sync**

| Feature | Description | Storage | Reasoning |
|---------|-------------|---------|-----------|
| Google Drive | Connect/disconnect Google Drive | **DB sync** | OAuth tokens server-managed |
| Firebase notifications | FCM token status | **DB sync** | Push token management |
| QR scanner permissions | Camera permission status | **Local** | Device permission |

---

## Implementation Priority

### Phase 1 (MVP) 🔴
- [ ] App version display
- [ ] Text size selector (local)
- [ ] Notification enable/disable toggle
- [ ] Notification sound toggle
- [ ] Privacy policy page link
- [ ] Clear cache button
- [ ] Card/Table view toggle (already done ✅)

### Phase 2 (Enhancement) 🟡
- [ ] Notification categories toggle
- [ ] Quiet hours / DND
- [ ] Language selector
- [ ] Dark mode support
- [ ] Profile visibility settings
- [ ] Active sessions management
- [ ] Cache size display

### Phase 3 (Polish) 🟢
- [ ] Accent color picker
- [ ] Compact mode
- [ ] Reduce motion
- [ ] Font family selector
- [ ] Offline mode toggle
- [ ] Data export
- [ ] 2FA support

---

## Storage Strategy Summary

| Storage Type | When to Use | Examples |
|---|---|---|
| **Local (localStorage)** | Device-specific, instant, no auth needed | Theme, text size, cache, sound |
| **DB Sync (API/Backend)** | Must persist across devices, security-critical | Notification preferences, privacy, language |
| **Hardcoded/Env** | Static info that doesn't change per user | Version, build info, support links |
| **Static Page** | Legal/informational content | Privacy policy, ToS, licenses |

---

## Notes
- All local-only settings should still work offline
- DB-synced settings should have a local fallback/cache
- Settings changes should apply immediately (optimistic UI)
- Consider a "Reset to defaults" option for each section
