import { useCallback } from 'react';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { cachedApiClient } from '@/api/cachedClient';

/**
 * Hook that triggers global force refresh on BOTH cached API clients.
 * Call triggerForceRefresh() before your data loading to ensure
 * all subsequent API calls bypass the cache for the given duration.
 */
export const useForceRefresh = () => {
  const triggerForceRefresh = useCallback((durationMs: number = 10000) => {
    enhancedCachedClient.enableGlobalForceRefresh(durationMs);
    cachedApiClient.enableGlobalForceRefresh(durationMs);
  }, []);

  return { triggerForceRefresh };
};
