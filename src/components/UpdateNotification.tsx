// src/components/UpdateNotification.tsx
//
// PATCH update → auto-reloads the app silently (brief "Updating app..." banner)
// MAJOR update → blocking screen: "Please update from Play Store"
import React, { useEffect, useState } from 'react';
import { startVersionChecker, UpdateInfo } from '@/utils/versionChecker';

type State = 'idle' | 'reloading' | 'major';

const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=lk.suraksha.lms';

const UpdateNotification: React.FC = () => {
  const [state, setState] = useState<State>('idle');
  const [majorInfo, setMajorInfo] = useState<UpdateInfo | null>(null);

  useEffect(() => {
    startVersionChecker({
      // PATCH / MINOR → show "Updating..." for 2s then reload
      onPatchUpdate: () => {
        setState('reloading');
        setTimeout(() => window.location.reload(), 2000);
      },

      // MAJOR → block UI, force Play Store update
      onMajorUpdate: (info) => {
        setMajorInfo(info);
        setState('major');
      },
    });
  }, []);

  // ── Patch: silent "Updating app..." banner ──────────────────────────────────
  if (state === 'reloading') {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1976D2] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-800 font-semibold text-sm">Updating app…</p>
          <p className="text-gray-400 text-xs">Loading latest version</p>
        </div>
      </div>
    );
  }

  // ── Major: blocking Play Store prompt ───────────────────────────────────────
  if (state === 'major' && majorInfo) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#0f172a]/80 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-[#E3F2FD] flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1976D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </div>

          <div>
            <h2 className="text-gray-900 font-bold text-lg mb-1">Update Required</h2>
            <p className="text-gray-500 text-sm">
              Version <span className="font-semibold text-[#1976D2]">{majorInfo.newSemver}</span> is
              available and requires a Play Store update to continue.
            </p>
          </div>

          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noreferrer"
            className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white font-semibold py-3 px-6 rounded-xl text-sm transition-colors text-center block no-underline"
          >
            Update on Play Store
          </a>

          <p className="text-gray-400 text-xs">
            You must update to keep using Suraksha LMS.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default UpdateNotification;
