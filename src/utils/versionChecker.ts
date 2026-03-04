// src/utils/versionChecker.ts
//
// Two-tier update strategy:
//
//  1. PATCH / MINOR update  (same major version, new S3 deploy)
//     → Auto-reload silently. User sees a brief "Updating..." banner, then the
//       page reloads with the latest code. No user action required.
//
//  2. MAJOR version bump  (e.g. 1.x.x → 2.x.x)
//     → Show a blocking "Please update from Play Store" screen.
//       This is for breaking native changes that require a new APK.

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // Poll every 5 minutes

// Injected by vite-plugin-version at build time
const CURRENT_HASH  = import.meta.env.VITE_APP_VERSION || '__DEV__';
const CURRENT_MAJOR = parseInt(import.meta.env.VITE_APP_MAJOR || '1', 10);

const VERSION_URL = '/version.json';

let checkIntervalId: ReturnType<typeof setInterval> | null = null;

export type UpdateKind = 'patch' | 'major';

export interface UpdateInfo {
  kind: UpdateKind;
  newSemver: string;
}

interface RemoteVersionJson {
  hash: string;
  semver: string;
  major: number;
  buildTime: string;
}

async function fetchRemoteVersion(): Promise<RemoteVersionJson | null> {
  try {
    // version.json is ~80 bytes, served with no-cache. The ONLY small request.
    const res = await fetch(`${VERSION_URL}?_t=${Date.now()}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null; // Offline — silently retry next interval
  }
}

async function detectUpdate(): Promise<UpdateInfo | null> {
  if (CURRENT_HASH === '__DEV__') return null; // Skip in dev

  const remote = await fetchRemoteVersion();
  if (!remote) return null;

  // Same deploy hash → nothing changed
  if (remote.hash === CURRENT_HASH) return null;

  // Different major → requires Play Store APK update
  if (remote.major > CURRENT_MAJOR) {
    return { kind: 'major', newSemver: remote.semver };
  }

  // Same major, different hash → new S3 deploy (UI/features/images)
  return { kind: 'patch', newSemver: remote.semver };
}

/**
 * Start background version polling.
 *
 * @param onMajorUpdate  Called when a breaking major version is detected.
 *                       Show a "Go to Play Store" screen.
 * @param onPatchUpdate  Called when a silent patch/minor deploy is detected.
 *                       Auto-reload is handled here — show a brief banner.
 */
export function startVersionChecker(callbacks: {
  onMajorUpdate: (info: UpdateInfo) => void;
  onPatchUpdate: (info: UpdateInfo) => void;
}): void {
  if (checkIntervalId) return;

  const run = async () => {
    const update = await detectUpdate();
    if (!update) return;

    stopVersionChecker(); // Stop polling once we have a result

    if (update.kind === 'major') {
      callbacks.onMajorUpdate(update);
    } else {
      callbacks.onPatchUpdate(update);
    }
  };

  // First check: 30s after startup (avoid slowing app load)
  setTimeout(run, 30_000);
  checkIntervalId = setInterval(run, VERSION_CHECK_INTERVAL);
}

export function stopVersionChecker(): void {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }
}

export { CURRENT_HASH, CURRENT_MAJOR };
