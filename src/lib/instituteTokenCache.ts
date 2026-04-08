import { instituteDriveApi, InstituteDriveTokenResponse } from '@/api/instituteDriveAccess.api';

// Per-institute token cache
const cachedTokens = new Map<string, { token: InstituteDriveTokenResponse; fetchedAt: number }>();
const tokenPromises = new Map<string, Promise<InstituteDriveTokenResponse>>();

const BUFFER_MS = 5 * 60 * 1000; // 5-minute expiry buffer

/**
 * Get a valid institute Drive access token.
 * Caches per-institute and auto-refreshes before expiry.
 */
export async function getValidInstituteToken(
  instituteId: string,
): Promise<InstituteDriveTokenResponse> {
  const cached = cachedTokens.get(instituteId);
  if (cached) {
    const expiresAt = new Date(cached.token.expiresAt).getTime();
    if (expiresAt - Date.now() > BUFFER_MS) {
      return cached.token;
    }
  }

  // Coalesce concurrent requests for the same institute
  const existing = tokenPromises.get(instituteId);
  if (existing) return existing;

  const promise = instituteDriveApi
    .getToken(instituteId)
    .then((token) => {
      cachedTokens.set(instituteId, { token, fetchedAt: Date.now() });
      tokenPromises.delete(instituteId);
      return token;
    })
    .catch((err) => {
      tokenPromises.delete(instituteId);
      cachedTokens.delete(instituteId);
      throw err;
    });

  tokenPromises.set(instituteId, promise);
  return promise;
}

export function clearInstituteTokenCache(instituteId?: string) {
  if (instituteId) {
    cachedTokens.delete(instituteId);
    tokenPromises.delete(instituteId);
  } else {
    cachedTokens.clear();
    tokenPromises.clear();
  }
}
