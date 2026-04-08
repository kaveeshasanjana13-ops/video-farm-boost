// Suraksha LMS - Main Entry Point
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// ─── Stale-bundle / chunk-load recovery ──────────────────────────────────────
// On Capacitor Android, the WebView can cache an old index.html that references
// chunk hashes from a previous build. If those chunks are missing the WebView
// silently fails to boot and shows a white screen. Catch the error and reload
// so the fresh index.html (and its matching chunks) are served instead.
// We guard with a rate-limit flag so we never loop-reload on genuine errors.
const RELOAD_TS_KEY = '__lms_last_chunk_reload';
const isChunkError = (msg: string) =>
  msg.includes('Failed to fetch dynamically imported module') ||
  msg.includes('ChunkLoadError') ||
  msg.includes('Loading chunk') ||
  msg.includes('Loading CSS chunk') ||
  msg.includes('Failed to load module script');

window.addEventListener('error', (e) => {
  if (isChunkError(e.message ?? '')) {
    const lastReload = Number(sessionStorage.getItem(RELOAD_TS_KEY) ?? 0);
    if (Date.now() - lastReload > 10_000) {
      sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()));
      window.location.reload();
    }
  }
}, true);

window.addEventListener('unhandledrejection', (e) => {
  const msg = String((e.reason as Error)?.message ?? e.reason ?? '');
  if (isChunkError(msg)) {
    const lastReload = Number(sessionStorage.getItem(RELOAD_TS_KEY) ?? 0);
    if (Date.now() - lastReload > 10_000) {
      e.preventDefault();
      sessionStorage.setItem(RELOAD_TS_KEY, String(Date.now()));
      window.location.reload();
    }
  }
});
// ─────────────────────────────────────────────────────────────────────────────

// ─── Keyboard / Input Scroll Fix (Capacitor Android) ────────────────────────
// On Android WebView the browser does not always auto-scroll to keep a focused
// input above the on-screen keyboard. We listen for focus on any input/textarea
// and manually call scrollIntoView so the field is always visible.
// A short delay lets the keyboard finish animating before we scroll.
window.addEventListener('focusin', (e) => {
  const el = e.target as HTMLElement | null;
  if (!el) return;
  const tag = el.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    setTimeout(() => {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 400);
  }
}, true);
// ─────────────────────────────────────────────────────────────────────────────

// ─── Visual Viewport Tracking (keyboard-aware height) ───────────────────────
// Sets a CSS custom property --visual-vh that reflects the ACTUAL visible area.
// When the on-screen keyboard opens, visualViewport.height shrinks while
// window.innerHeight and dvh may not. Dialogs/sheets use this to stay visible.
const updateVisualVh = () => {
  const vh = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;
  document.documentElement.style.setProperty('--visual-vh', `${vh}px`);
};
updateVisualVh();
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', updateVisualVh);
  window.visualViewport.addEventListener('scroll', updateVisualVh);
} else {
  window.addEventListener('resize', updateVisualVh);
}
// ─────────────────────────────────────────────────────────────────────────────

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root element not found");
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
