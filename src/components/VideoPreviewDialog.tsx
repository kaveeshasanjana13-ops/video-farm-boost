import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { X, GripHorizontal } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface WatermarkData {
  id: string;
  text: string;
  top: number;
  left: number;
  opacity: number;
}

interface VideoPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  title?: string;
}

const MIN_W = 280;
const MIN_H = 200;
const DEFAULT_W = 700;
const DEFAULT_H = 450;

const VideoPreviewDialog = ({ open, onOpenChange, url, title }: VideoPreviewDialogProps) => {
  const { user } = useAuth();
  // Floating panel position and size
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  // While dragging or resizing, we render a transparent layer over the iframe
  // so it doesn't steal pointer events
  const [interacting, setInteracting] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPX: number; startPY: number } | null>(null);
  const resizeRef = useRef<{
    handle: string;
    startX: number; startY: number;
    startW: number; startH: number;
    startPX: number; startPY: number;
  } | null>(null);

  const [watermarks, setWatermarks] = useState<WatermarkData[]>([]);
  const [userInfo, setUserInfo] = useState({
    ip: '',
    location: '',
    timestamp: new Date().toLocaleString()
  });

  const getEmbedUrl = (url: string): string | null => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube-nocookie.com/embed/${youtubeMatch[1]}`;
    }

    // Google Drive URL patterns
    if (url.includes('drive.google.com')) {
      const driveFileIdRegexA = /\/file\/d\/([^\/]+)/;
      const driveFileIdRegexB = /[?&]id=([^&]+)/; // alternative share format
      const driveMatch = url.match(driveFileIdRegexA) || url.match(driveFileIdRegexB);
      if (driveMatch) {
        return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
      }
      // Already a preview URL
      if (url.includes('/preview')) {
        return url;
      }
    }

    return null;
  };

  const embedUrl = useMemo(() => getEmbedUrl(url), [url]);
  const [loaded, setLoaded] = useState(false);
  const [fallback, setFallback] = useState(false);

  const loadedRef = React.useRef(false);

  // Fallback if iframe doesn't load (common when provider blocks embedding)
  useEffect(() => {
    setLoaded(false);
    setFallback(false);
    loadedRef.current = false;
    if (!embedUrl) return;
    const t = window.setTimeout(() => {
      if (!loadedRef.current) setFallback(true);
    }, 2500);
    return () => window.clearTimeout(t);
  }, [embedUrl, open]);

  const shouldUseIframe = !!embedUrl && !fallback;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleSelectStart = (e: React.SyntheticEvent) => {
    e.preventDefault();
    return false;
  };

  // Fetch user IP and location
  useEffect(() => {
    if (!open) return;
    
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => {
        setUserInfo(prev => ({ ...prev, ip: data.ip }));
        return fetch(`https://ipapi.co/${data.ip}/json/`);
      })
      .then(res => res.json())
      .then(data => {
        setUserInfo(prev => ({ 
          ...prev, 
          location: `${data.city || ''}, ${data.country_name || ''}`.trim()
        }));
      })
      .catch(() => {});
  }, [open]);

  // Generate random watermarks
  useEffect(() => {
    if (!open) return;

    const generateWatermark = () => {
      const infoParts = [
        userInfo.ip,
        userInfo.location,
        user?.email || 'User',
        new Date().toLocaleTimeString(),
        `ID: ${user?.id?.substring(0, 8) || 'XXXX'}`
      ].filter(Boolean);

      const randomInfo = infoParts[Math.floor(Math.random() * infoParts.length)];
      
      return {
        id: Math.random().toString(36),
        text: randomInfo,
        top: Math.random() * 80 + 10,
        left: Math.random() * 80 + 10,
        opacity: Math.random() * 0.3 + 0.1
      };
    };

    const interval = setInterval(() => {
      // Randomly show watermarks (30% chance every interval)
      if (Math.random() > 0.7) {
        setWatermarks(prev => {
          const newMarks = [...prev, generateWatermark()];
          return newMarks.slice(-3); // Keep max 3 watermarks
        });

        // Remove watermark after random duration
        setTimeout(() => {
          setWatermarks(prev => prev.slice(1));
        }, Math.random() * 5000 + 3000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [open, userInfo, user]);

  // Simplified recording detection - removed aggressive checks

  // Block keyboard shortcuts for DevTools
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // F12
    if (e.keyCode === 123) {
      e.preventDefault();
      toast({ title: "Action blocked", variant: "destructive" });
      return false;
    }
    // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) {
      e.preventDefault();
      toast({ title: "Action blocked", variant: "destructive" });
      return false;
    }
    // Ctrl+U (view source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      toast({ title: "Action blocked", variant: "destructive" });
      return false;
    }
    // Ctrl+S (save)
    if (e.ctrlKey && e.keyCode === 83) {
      e.preventDefault();
      toast({ title: "Action blocked", variant: "destructive" });
      return false;
    }
  }, []);

  const blockContextMenu = useCallback((e: Event) => { e.preventDefault(); }, []);
  const blockCopy = useCallback((e: ClipboardEvent) => { e.preventDefault(); }, []);
  const blockDrag = useCallback((e: DragEvent) => { e.preventDefault(); }, []);

  // DevTools detection removed - was causing false positives

  // Block keyboard shortcuts when dialog is open
  useEffect(() => {
    if (!open) return;

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', blockContextMenu as EventListener);
    document.addEventListener('copy', blockCopy as EventListener);
    document.addEventListener('dragstart', blockDrag as EventListener);

    // Disable text selection globally
    document.body.style.userSelect = 'none';
    ;(document.body.style as any).webkitUserSelect = 'none';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', blockContextMenu as EventListener);
      document.removeEventListener('copy', blockCopy as EventListener);
      document.removeEventListener('dragstart', blockDrag as EventListener);
      document.body.style.userSelect = '';
      ;(document.body.style as any).webkitUserSelect = '';
    };
  }, [open, handleKeyDown, blockContextMenu, blockCopy, blockDrag]);

  // ── Centre & size the panel whenever it opens ─────────────────
  useEffect(() => {
    if (!open) return;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(DEFAULT_W, vw - 24);
    const h = Math.min(DEFAULT_H, vh - 80);
    setSize({ w, h });
    setPos({ x: Math.max(0, (vw - w) / 2), y: Math.max(0, (vh - h) / 2) });
  }, [open]);

  // ── Global pointermove / pointerup for dragging & resizing ────
  useEffect(() => {
    if (!open) return;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
    const onMove = (cx: number, cy: number) => {
      if (dragRef.current) {
        const { startX, startY, startPX, startPY } = dragRef.current;
        const maxX = Math.max(0, window.innerWidth - size.w);
        const maxY = Math.max(0, window.innerHeight - size.h);
        setPos({
          x: clamp(startPX + (cx - startX), 0, maxX),
          y: clamp(startPY + (cy - startY), 0, maxY),
        });
      }
      if (resizeRef.current) {
        const { handle, startX, startY, startW, startH, startPX, startPY } = resizeRef.current;
        const dx = cx - startX;
        const dy = cy - startY;
        let nw = startW, nh = startH, nx = startPX, ny = startPY;
        if (handle.includes('e')) nw = Math.max(MIN_W, startW + dx);
        if (handle.includes('s')) nh = Math.max(MIN_H, startH + dy);
        if (handle.includes('w')) { nw = Math.max(MIN_W, startW - dx); nx = startPX + (startW - nw); }
        if (handle.includes('n')) { nh = Math.max(MIN_H, startH - dy); ny = startPY + (startH - nh); }

        const maxW = window.innerWidth;
        const maxH = window.innerHeight;
        nw = clamp(nw, MIN_W, maxW);
        nh = clamp(nh, MIN_H, maxH);
        const maxX = Math.max(0, window.innerWidth - nw);
        const maxY = Math.max(0, window.innerHeight - nh);
        nx = clamp(nx, 0, maxX);
        ny = clamp(ny, 0, maxY);

        setSize({ w: nw, h: nh });
        setPos({ x: nx, y: ny });
      }
    };
    const onUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      setInteracting(false);
    };
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
      if (dragRef.current || resizeRef.current) {
        e.preventDefault();
      }
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onPointerMove = (e: PointerEvent) => onMove(e.clientX, e.clientY);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onUp);
    document.addEventListener('touchcancel', onUp);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onTouchMove);
      document.removeEventListener('touchend', onUp);
      document.removeEventListener('touchcancel', onUp);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);
    };
  }, [open, size.w]);

  // ── Start drag (called from title-bar pointer/touch events) ───
  const startDrag = useCallback((cx: number, cy: number) => {
    dragRef.current = { startX: cx, startY: cy, startPX: pos.x, startPY: pos.y };
    setInteracting(true);
  }, [pos]);

  const handleTitlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const handleTitleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    if (!t) return;
    e.preventDefault();
    e.stopPropagation();
    startDrag(t.clientX, t.clientY);
  };

  // ── Start resize (called from edge/corner handles) ────────────
  const startResize = (handle: string) => (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
    resizeRef.current = { handle, startX: cx, startY: cy, startW: size.w, startH: size.h, startPX: pos.x, startPY: pos.y };
    setInteracting(true);
  };

  if (!open) return null;

  return (
    <>
      {/* Dimmed backdrop — click closes the panel */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
        onClick={() => onOpenChange(false)}
      />

      {/* ── Floating draggable + resizable panel ── */}
      <div
        className="fixed z-50 flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden"
        style={{ left: pos.x, top: pos.y, width: size.w, height: size.h }}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      >
        {/* Title bar — drag handle */}
        <div
          className="flex items-center justify-between pl-3 pr-2 py-2 border-b border-border bg-muted/40 shrink-0 select-none touch-none"
          style={{ cursor: interacting ? 'grabbing' : 'grab' }}
          onPointerDown={handleTitlePointerDown}
          onMouseDown={handleTitleMouseDown}
          onTouchStart={handleTitleTouchStart}
        >
          <div className="flex items-center gap-2 min-w-0">
            <GripHorizontal className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-sm font-semibold truncate">{title || 'Video Preview'}</span>
          </div>
          <button
            className="shrink-0 ml-2 p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onOpenChange(false); }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video content — block mousedown/touchstart so clicks here never trigger the title-bar drag */}
        <div
          className="flex-1 p-2.5 overflow-hidden relative"
          onMouseDown={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
          onContextMenu={handleContextMenu}
          onDragStart={handleDragStart}
        >
          {shouldUseIframe ? (
            <div
              className="relative w-full h-full rounded-lg overflow-hidden select-none"
              style={{ userSelect: 'none' }}
              onContextMenu={handleContextMenu}
            >
              <iframe
                src={embedUrl!}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => { loadedRef.current = true; setLoaded(true); }}
                allowFullScreen
                style={{ border: 'none', pointerEvents: interacting ? 'none' : 'auto' }}
              />
              {/* Transparent shield while dragging/resizing so the iframe doesn't eat pointer events */}
              {interacting && <div className="absolute inset-0 z-20" />}
              {/* Security overlay */}
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
              />
              {/* Watermarks */}
              {watermarks.map(mark => (
                <div
                  key={mark.id}
                  className="absolute z-30 text-foreground font-mono text-xs pointer-events-none select-none"
                  style={{
                    top: `${mark.top}%`,
                    left: `${mark.left}%`,
                    opacity: mark.opacity,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                    userSelect: 'none',
                  }}
                >
                  {mark.text}
                </div>
              ))}
            </div>
          ) : embedUrl ? (
            <div
              className="relative w-full h-full rounded-lg overflow-hidden select-none"
              style={{ userSelect: 'none' }}
              onContextMenu={handleContextMenu}
            >
              <iframe
                src={embedUrl!}
                title={title || 'Video Preview'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                onLoad={() => { loadedRef.current = true; setLoaded(true); }}
                allowFullScreen
                style={{ border: 'none', pointerEvents: interacting ? 'none' : 'auto' }}
              />
              {interacting && <div className="absolute inset-0 z-20" />}
              {!loaded && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted rounded-lg">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-primary" />
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
              <p className="text-muted-foreground text-sm">Unable to preview this video format</p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
                Open in new tab
              </a>
            </div>
          )}
        </div>

        {/* ── Resize handles (edges + corners) ── */}
        {/* Right edge */}
        <div className="absolute right-0 top-10 bottom-4 w-2 cursor-ew-resize z-40 hover:bg-primary/10 transition-colors"
          onPointerDown={startResize('e')} />
        {/* Left edge */}
        <div className="absolute left-0 top-10 bottom-4 w-2 cursor-ew-resize z-40 hover:bg-primary/10 transition-colors"
          onPointerDown={startResize('w')} />
        {/* Bottom edge */}
        <div className="absolute bottom-0 left-4 right-4 h-2 cursor-ns-resize z-40 hover:bg-primary/10 transition-colors"
          onPointerDown={startResize('s')} />
        {/* Top edge (below title bar) */}
        <div className="absolute top-10 left-4 right-4 h-1 cursor-ns-resize z-40"
          onPointerDown={startResize('n')} />
        {/* Bottom-right corner — with visual grip icon */}
        <div className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-50 flex items-end justify-end pr-0.5 pb-0.5"
          onPointerDown={startResize('se')}>
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-muted-foreground/50" fill="none">
            <path d="M9 1L1 9M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        {/* Bottom-left corner */}
        <div className="absolute bottom-0 left-0 w-5 h-5 cursor-nesw-resize z-50"
          onPointerDown={startResize('sw')} />
        {/* Top-right corner */}
        <div className="absolute top-10 right-0 w-4 h-4 cursor-nesw-resize z-50"
          onPointerDown={startResize('ne')} />
        {/* Top-left corner */}
        <div className="absolute top-10 left-0 w-4 h-4 cursor-nwse-resize z-50"
          onPointerDown={startResize('nw')} />
      </div>
    </>
  );
};

export default VideoPreviewDialog;
