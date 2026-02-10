import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Handle Google Drive OAuth callback redirect params.
 * After backend OAuth callback, user is redirected back with query params:
 * ?drive_connected=true&google_email=user@gmail.com
 * or ?drive_connected=false&error=some_error
 */
export function useDriveCallback(onSuccess?: (email: string) => void) {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const driveConnected = searchParams.get('drive_connected');
    if (!driveConnected) return;

    const success = driveConnected === 'true';
    const googleEmail = searchParams.get('google_email') || '';
    const error = searchParams.get('error') || '';

    if (success) {
      console.log(`✅ Google Drive connected: ${googleEmail}`);
      onSuccess?.(googleEmail);
    } else {
      console.error(`❌ Google Drive connection failed: ${error}`);
    }

    // Clean up URL params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('drive_connected');
    newParams.delete('google_email');
    newParams.delete('error');
    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams, onSuccess]);
}
