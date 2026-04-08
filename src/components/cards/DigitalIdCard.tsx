/**
 * DigitalIdCard — matches PDF generator design exactly.
 * Front + back shown side-by-side (large). PDF download via hidden A4 canvas.
 * User photo pulled from global user profile (/auth/me → imageUrl).
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, RefreshCw, IdCard, GraduationCap, Printer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/api/client';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { getApiHeadersAsync } from '@/contexts/utils/auth.api';

// ─── A4 PDF layout constants (72pt = 1 inch) ────────────────────────────────
const INCH = 72;
const A4_W = Math.round(8.27 * INCH);    // 595 pt
const A4_H = Math.round(11.69 * INCH);   // 842 pt
const CARD_W = Math.round(3.37 * INCH);  // 243 pt
const CARD_H = Math.round(2.125 * INCH); // 153 pt
const MARGIN_X = Math.round((A4_W - CARD_W) / 2);
const TITLE_Y = Math.round(0.4 * INCH);
const V_SPACE = Math.round(0.12 * INCH);
const CARDS_START_Y = Math.round(
  TITLE_Y + 0.8 * INCH +
  (A4_H - TITLE_Y - 0.8 * INCH - (CARD_H * 2 + V_SPACE) - 1.2 * INCH) / 2
);
// Max pixel width one card is allowed to reach on screen
const MAX_CARD_PX = 420;

interface CardUserData {
  id: string;
  nameWithInitials: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  imageUrl: string;
  userType: string;
  dateOfBirth: string;
}

const DigitalIdCard: React.FC = () => {
  const { selectedChild, isViewingAsParent } = useAuth();
  const isChildView = !!(isViewingAsParent && selectedChild);
  const { toast } = useToast();

  const [cardData, setCardData] = useState<CardUserData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [photoError, setPhotoError] = useState(false);
  // photoDataUrl: base64 data URL fetched via CORS — used in html2canvas for PDF
  const [photoDataUrl, setPhotoDataUrl] = useState<string>('');
  const previewRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(entries => {
      setContainerWidth(entries[0].contentRect.width);
    });
    obs.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => obs.disconnect();
  }, []);

  const issueDate = new Date().toLocaleDateString('en-GB', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });

  const fetchCardData = useCallback(async () => {
    setLoading(true);
    setPhotoError(false);
    setPhotoDataUrl('');
    try {
      let d: any;
      if (isChildView && selectedChild) {
        const resp = await apiClient.get<any>(`/users/${selectedChild.userId || selectedChild.id}`);
        d = resp?.data || resp;
      } else {
        // Global user profile — always from /auth/me (not institute-specific)
        const resp = await apiClient.get<{ success: boolean; data: any }>('/auth/me');
        d = resp?.data || resp;
      }
      if (d) {
        const cd: CardUserData = {
          id: d.id || d.userId || '',
          nameWithInitials: d.nameWithInitials || `${d.firstName || ''} ${d.lastName || ''}`.trim(),
          firstName: d.firstName || '',
          lastName: d.lastName || '',
          email: d.email || '',
          phone: d.phoneNumber || d.phone || '',
          // Use global user imageUrl from /auth/me, not institute-specific images
          imageUrl: d.imageUrl || '',
          userType: d.userType || '',
          dateOfBirth: d.dateOfBirth || '',
        };
        setCardData(cd);
        // Pre-fetch photo as base64 for PDF/print embedding (try with auth first)
        if (cd.imageUrl) {
          const imgUrl = getImageUrl(cd.imageUrl);
          if (imgUrl) {
            (async () => {
              const toDataUrl = (blob: Blob) => new Promise<string>(res => {
                const reader = new FileReader();
                reader.onloadend = () => res(reader.result as string);
                reader.readAsDataURL(blob);
              });
              try {
                const authHeaders = await getApiHeadersAsync();
                const r = await fetch(imgUrl, { mode: 'cors', credentials: 'include', headers: authHeaders });
                if (r.ok) { setPhotoDataUrl(await toDataUrl(await r.blob())); return; }
              } catch {}
              try {
                const r = await fetch(imgUrl, { mode: 'cors', credentials: 'omit' });
                if (r.ok) { setPhotoDataUrl(await toDataUrl(await r.blob())); }
              } catch {}
            })();
          }
        }
        const qrPayload = JSON.stringify({
          userId: cd.id,
          studentId: cd.id,
          name: cd.nameWithInitials,
          barcodeNumber: cd.id,
          issued: issueDate,
        });
        const qr = await QRCode.toDataURL(qrPayload, {
          width: 300, margin: 1, errorCorrectionLevel: 'M',
        });
        setQrDataUrl(qr);
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to load ID card data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [isChildView, selectedChild?.userId, toast]);

  useEffect(() => { fetchCardData(); }, [fetchCardData]);

  // ─── Responsive scale — must be before any early return (Rules of Hooks) ─
  // Go side-by-side once container is at least 520px (fits 2 reasonable-sized cards)
  const TWO_COL_THRESHOLD = 520;
  const isWide = containerWidth >= TWO_COL_THRESHOLD;
  const PREV = useMemo(() => {
    const slotW = isWide
      ? Math.min((containerWidth - 16) / 2, MAX_CARD_PX)
      : Math.min(containerWidth - 2, MAX_CARD_PX);
    return slotW / CARD_W;
  }, [containerWidth, isWide]);

  // ── Build full A4 HTML — matches backend PDF generator layout exactly ────
  // NOTE: defined before early-returns; formatUserType/photoUrl captured lazily at call time.
  const buildA4PrintHtml = (photoSrc: string, name: string): string => {
    const IN = 25.4;
    const cw = 3.37 * IN, ch = 2.125 * IN;
    const cx = (210 - cw) / 2;
    const titleY = 0.4 * IN;
    const vSpace = 0.12 * IN;
    const cardsH = ch * 2 + vSpace;
    const frontY = titleY + 0.8 * IN + (297 - titleY - 0.8 * IN - cardsH - 1.2 * IN) / 2;
    const backY  = frontY + ch + vSpace;
    const foldY  = frontY + ch + vSpace / 2;
    const foldX1 = cx - IN, foldX2 = cx + cw + IN;
    const cutPad = 0.04 * IN;
    const cutL = cx - cutPad, cutR = cx + cw + cutPad;
    const cutT = frontY - cutPad, cutB = backY + ch + cutPad;
    const footerY = 297 - IN;
    const hh  = 0.5 * IN;
    const lR  = 0.38 * IN / 2;
    const phW = 0.9 * IN, phH = 1.15 * IN;
    const phX = 0.2 * IN, phYi = hh + 0.1 * IN;
    const inX = phX + phW + 0.2 * IN;
    const fW  = cw - inX - 0.15 * IN;
    const lS  = 0.18 * IN;
    const qrSz = 1.2 * IN;
    const qrXi = (cw - qrSz) / 2;
    const qrYi = (ch - qrSz) / 2 - 0.15 * IN;
    const cdId   = cardData?.id || 'N/A';
    const cdName = cardData?.nameWithInitials || 'N/A';
    const photoTag = photoSrc
      ? `<img src="${photoSrc}" style="width:100%;height:100%;object-fit:cover;display:block;">`
      : `<div style="width:100%;height:100%;background:#1E6FBF;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff"><div style="width:5mm;height:5mm;border-radius:50%;background:rgba(255,255,255,.85);margin-bottom:1mm"></div><div style="width:8mm;height:4mm;background:rgba(255,255,255,.65);border-radius:50% 50% 0 0"></div><div style="font-size:1.5mm;margin-top:1mm">NO PHOTO</div></div>`;
    const front = `
<div style="position:absolute;left:${cx}mm;top:${frontY}mm;width:${cw}mm;height:${ch}mm;border-radius:2.5mm;border:0.4mm solid #2C3E50;background:#fff;overflow:hidden;font-family:Helvetica,Arial">
  <div style="position:absolute;top:0;left:0;width:100%;height:${hh}mm;background:#1E6FBF">
    <div style="position:absolute;left:${0.15 * IN - lR}mm;top:50%;transform:translateY(-50%);width:${lR * 2}mm;height:${lR * 2}mm;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:3.5mm;color:#1E6FBF">S</div>
    <div style="position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);text-align:center;color:#fff;font-weight:800;font-size:3.5mm;letter-spacing:0.5mm">SURAKSHA LMS</div>
  </div>
  <div style="position:absolute;left:${phX}mm;top:${phYi}mm;width:${phW}mm;height:${phH}mm;border:0.2mm solid #2C3E50;overflow:hidden;background:#F5F5F5">${photoTag}</div>
  <div style="position:absolute;left:${inX}mm;top:${phYi}mm;width:${fW}mm">
    <div style="font-size:1.5mm;color:#7F8C8D;letter-spacing:0.1mm">USER ID</div>
    <div style="font-size:2.8mm;font-weight:700;color:#2C3E50;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">${cdId}</div>
    <div style="height:0.35mm;background:#1E6FBF;margin:0.8mm 0 ${lS * 0.5}mm"></div>
    <div style="font-size:1.5mm;color:#7F8C8D;letter-spacing:0.1mm">NAME</div>
    <div style="font-size:2.5mm;font-weight:700;color:#2C3E50;line-height:1.2;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${cdName}</div>
    <div style="height:0.35mm;background:#1E6FBF;margin:0.8mm 0 ${lS * 0.5}mm"></div>
    <div style="font-size:1.5mm;color:#7F8C8D;letter-spacing:0.1mm">ISSUE DATE</div>
    <div style="font-size:2.5mm;font-weight:700;color:#2C3E50">${issueDate}</div>
    <div style="height:0.35mm;background:#1E6FBF;margin-top:0.8mm"></div>
  </div>
  <div style="position:absolute;right:2.5mm;bottom:1.5mm;width:${1.5 * IN}mm;border-top:0.2mm solid #7F8C8D;text-align:center;padding-top:0.4mm">
    <span style="font-size:1.3mm;color:#7F8C8D">Authorized Signature</span>
  </div>
</div>`;
    const back = `
<div style="position:absolute;left:${cx}mm;top:${backY}mm;width:${cw}mm;height:${ch}mm;border-radius:2.5mm;border:0.4mm solid #2C3E50;background:#fff;overflow:hidden;transform:rotate(180deg);transform-origin:center center">
  ${qrDataUrl ? `<img src="${qrDataUrl}" style="position:absolute;left:${qrXi}mm;top:${qrYi}mm;width:${qrSz}mm;height:${qrSz}mm;display:block;image-rendering:pixelated;">` : ''}
  <div style="position:absolute;bottom:0;left:0;right:0;height:8mm;display:flex;align-items:center;justify-content:center;gap:1.5mm;flex-wrap:wrap;padding:0 2mm">
    <span style="font-size:1.8mm;color:#7F8C8D">https://suraksha.lk</span>
    <span style="font-size:1.8mm;color:#7F8C8D">·</span>
    <span style="font-size:1.8mm;color:#7F8C8D">surakshalms@gmail.com</span>
    <span style="font-size:1.8mm;color:#7F8C8D">·</span>
    <span style="font-size:1.8mm;color:#7F8C8D">0703300524</span>
  </div>
</div>`;
    return `<!DOCTYPE html><html><head><title>ID Card - ${name}</title>
<style>@page{size:A4 portrait;margin:0}*{box-sizing:border-box;margin:0;padding:0}body{width:210mm;height:297mm;background:#fff;position:relative;overflow:hidden;font-family:Helvetica,Arial,sans-serif}</style>
</head><body>
<div style="position:absolute;top:${titleY + 3.5}mm;left:0;width:210mm;text-align:center;font-size:4.8mm;font-weight:bold;color:#2C3E50;letter-spacing:0.5mm">USER ID CARD</div>
<div style="position:absolute;top:${titleY + 0.25 * IN + 2.5}mm;left:0;width:210mm;text-align:center;font-size:2.8mm;color:#7F8C8D">Print on A4 Paper at 100% Scale</div>
<div style="position:absolute;top:${frontY - 0.25 * IN + 2.5}mm;left:0;width:210mm;text-align:center;font-size:2.8mm;font-weight:bold;color:#2C3E50;letter-spacing:1.5px">FRONT SIDE</div>
${front}
<div style="position:absolute;top:${backY + ch + 0.15 * IN + 2.5}mm;left:0;width:210mm;text-align:center;font-size:2.8mm;font-weight:bold;color:#2C3E50;letter-spacing:1.5px">BACK SIDE</div>
${back}
<div style="position:absolute;left:${foldX1}mm;top:${foldY}mm;width:${foldX2 - foldX1}mm;height:0;border-top:0.3mm dashed #2C3E50"></div>
<div style="position:absolute;left:${foldX1}mm;top:${foldY - 5}mm;font-size:2mm;font-weight:bold;color:#2C3E50">FOLD LINE</div>
<div style="position:absolute;left:${cutL}mm;top:${cutT}mm;width:${cutR - cutL}mm;height:0;border-top:0.2mm dashed #7F8C8D"></div>
<div style="position:absolute;left:${cutL}mm;top:${cutB}mm;width:${cutR - cutL}mm;height:0;border-top:0.2mm dashed #7F8C8D"></div>
<div style="position:absolute;left:${cutL}mm;top:${cutT}mm;width:0;height:${cutB - cutT}mm;border-left:0.2mm dashed #7F8C8D"></div>
<div style="position:absolute;left:${cutR}mm;top:${cutT}mm;width:0;height:${cutB - cutT}mm;border-left:0.2mm dashed #7F8C8D"></div>
<div style="position:absolute;top:${footerY}mm;left:0;width:210mm;text-align:center;font-size:1.8mm;color:#7F8C8D">Card Size: 3.37&quot; × 2.125&quot; (3.37&quot; × 2.125&quot;)</div>
<div style="position:absolute;top:${footerY + 3.5}mm;left:5mm;right:5mm;text-align:center;font-size:1.8mm;color:#7F8C8D">Instructions: 1) Cut rectangle 2) Fold and paste 3) Cut rounded corners 4) Sign by authorized person 5) Laminate</div>
<div style="position:absolute;top:${footerY + 7}mm;left:0;width:210mm;text-align:center;font-size:1.8mm;color:#7F8C8D">Print at 100% scale • Do not use &quot;Fit to Page&quot;</div>
<div style="position:absolute;top:${footerY + 10.5}mm;left:0;width:210mm;text-align:center;font-size:1.8mm;color:#7F8C8D">Generated: ${new Date().toLocaleString()}</div>
<script>var imgs=document.querySelectorAll('img'),n=imgs.length,d=0;function tryP(){d++;if(d>=n){window.focus();window.print();}}if(n===0){setTimeout(function(){window.focus();window.print();},300);}else{imgs.forEach(function(img){if(img.complete){tryP();}else{img.onload=tryP;img.onerror=tryP;}});}</script>
</body></html>`;
  };

  const handlePrint = async () => {
    if (!cardData) return;
    // Use cached base64 photo first; then try fresh fetch with auth; finally fall back to direct URL
    let printPhotoSrc = photoDataUrl;
    if (!printPhotoSrc && photoUrl && !photoError) {
      const toDataUrl = (blob: Blob) => new Promise<string>(res => { const fr = new FileReader(); fr.onloadend = () => res(fr.result as string); fr.readAsDataURL(blob); });
      try {
        const authHeaders = await getApiHeadersAsync();
        const r = await fetch(photoUrl, { mode: 'cors', credentials: 'include', headers: authHeaders });
        if (r.ok) printPhotoSrc = await toDataUrl(await r.blob());
      } catch {}
      if (!printPhotoSrc) printPhotoSrc = photoUrl; // let browser load natively with cookies
    }
    const w = window.open('', '_blank');
    if (!w) { toast({ title: 'Error', description: 'Pop-up blocked. Please allow pop-ups.', variant: 'destructive' }); return; }
    w.document.write(buildA4PrintHtml(printPhotoSrc, cardData.nameWithInitials || 'ID Card'));
    w.document.close();
  };

  const handleDownloadPdf = async () => {
    if (!cardData) return;
    setDownloading(true);
    try {
      // ── Get photo as base64: cached pre-fetch first, then fresh with auth ──
      const toDataUrl = (blob: Blob) => new Promise<string>(res => { const fr = new FileReader(); fr.onloadend = () => res(fr.result as string); fr.readAsDataURL(blob); });
      let photoSrc = photoDataUrl;
      if (!photoSrc && photoUrl && !photoError) {
        try {
          const authHeaders = await getApiHeadersAsync();
          const r = await fetch(photoUrl, { mode: 'cors', credentials: 'include', headers: authHeaders });
          if (r.ok) photoSrc = await toDataUrl(await r.blob());
        } catch {}
        if (!photoSrc) {
          try {
            const r = await fetch(photoUrl, { mode: 'cors', credentials: 'omit' });
            if (r.ok) photoSrc = await toDataUrl(await r.blob());
          } catch {}
        }
      }

      // ── Constants matching backend generator exactly (inches → mm) ─────
      const IN = 25.4;
      const PW = 210, PH = 297;
      const cw = 3.37 * IN, ch = 2.125 * IN;
      const cx = (PW - cw) / 2;
      const titleY = 0.4 * IN;
      const vSpace = 0.12 * IN;
      const cardsH = ch * 2 + vSpace;
      const frontY = titleY + 0.8 * IN + (PH - titleY - 0.8 * IN - cardsH - 1.2 * IN) / 2;
      const backY  = frontY + ch + vSpace;
      const foldY  = frontY + ch + vSpace / 2;
      const foldX1 = cx - IN, foldX2 = cx + cw + IN;
      const cutPad = 0.04 * IN;
      const cutL = cx - cutPad, cutR = cx + cw + cutPad;
      const cutT = frontY - cutPad, cutB = backY + ch + cutPad;
      const hh = 0.5 * IN;
      const lR = 0.38 * IN / 2;
      const lS = 0.18 * IN;
      const phW = 0.9 * IN, phH = 1.15 * IN;
      const phX = cx + 0.2 * IN, phY_f = frontY + hh + 0.1 * IN;
      const inX = phX + phW + 0.2 * IN;
      const fW  = cx + cw - inX - 0.15 * IN;
      const r3  = 2.5;
      const cdId   = cardData.id || 'N/A';
      const cdName = cardData.nameWithInitials || 'N/A';

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      // ── Title & subtitle ────────────────────────────────────────────────
      pdf.setFontSize(16); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text('USER ID CARD', PW / 2, titleY + 3.5, { align: 'center' });
      pdf.setFontSize(9); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('Print on A4 Paper at 100% Scale', PW / 2, titleY + 0.25 * IN + 3, { align: 'center' });

      // ── FRONT SIDE label ────────────────────────────────────────────────
      pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text('FRONT SIDE', PW / 2, frontY - 0.25 * IN + 3, { align: 'center' });

      // ── Front card ──────────────────────────────────────────────────────
      // White card background
      pdf.setFillColor(255, 255, 255);
      pdf.roundedRect(cx, frontY, cw, ch, r3, r3, 'F');
      // Blue header band (rounded top + white rect covering the bottom curve)
      pdf.setFillColor(30, 111, 191);
      pdf.roundedRect(cx, frontY, cw, hh + r3, r3, r3, 'F');
      pdf.setFillColor(255, 255, 255);
      pdf.rect(cx, frontY + hh, cw, r3, 'F');
      // Logo white circle
      const lCX = cx + 0.15 * IN + lR, lCY = frontY + 0.06 * IN + lR;
      pdf.setFillColor(255, 255, 255); pdf.setDrawColor(30, 111, 191); pdf.setLineWidth(0.2);
      pdf.circle(lCX, lCY, lR, 'FD');
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(30, 111, 191);
      pdf.text('S', lCX, lCY + 1.5, { align: 'center' });
      // Organisation name
      pdf.setFontSize(9); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(255, 255, 255);
      pdf.text('SURAKSHA LMS', PW / 2, frontY + hh / 2 + 1.5, { align: 'center', charSpace: 0.8 });
      // Photo box
      if (photoSrc) {
        const fmt = photoSrc.startsWith('data:image/png') ? 'PNG' : 'JPEG';
        try { pdf.addImage(photoSrc, fmt, phX, phY_f, phW, phH); } catch {}
      } else {
        pdf.setFillColor(30, 111, 191); pdf.rect(phX, phY_f, phW, phH, 'F');
        pdf.setFontSize(4); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(255, 255, 255);
        pdf.text('NO PHOTO', phX + phW / 2, phY_f + phH / 2, { align: 'center' });
      }
      pdf.setDrawColor(44, 62, 80); pdf.setLineWidth(0.2);
      pdf.rect(phX, phY_f, phW, phH, 'S');
      // Info fields: USER ID, NAME, ISSUE DATE (exact backend field set)
      const inY = frontY + hh + 0.1 * IN;
      // USER ID
      pdf.setFontSize(6); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('USER ID', inX, inY + 2);
      pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text((pdf.splitTextToSize(cdId, fW) as string[]).slice(0, 1), inX, inY + 0.08 * IN + 3.5);
      pdf.setDrawColor(30, 111, 191); pdf.setLineWidth(0.35);
      pdf.line(inX, inY + 0.22 * IN, inX + fW, inY + 0.22 * IN);
      // NAME
      pdf.setFontSize(6); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('NAME', inX, inY + lS + 0.12 * IN + 2);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text((pdf.splitTextToSize(cdName, fW) as string[]).slice(0, 2), inX, inY + lS + 0.2 * IN + 2.5, { lineHeightFactor: 1.2 });
      pdf.setDrawColor(30, 111, 191); pdf.setLineWidth(0.35);
      pdf.line(inX, inY + lS + 0.52 * IN, inX + fW, inY + lS + 0.52 * IN);
      // ISSUE DATE
      pdf.setFontSize(6); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('ISSUE DATE', inX, inY + 2 * lS + 0.42 * IN + 2);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text(issueDate, inX, inY + 2 * lS + 0.5 * IN + 2.5);
      pdf.setDrawColor(30, 111, 191); pdf.setLineWidth(0.35);
      pdf.line(inX, inY + 2 * lS + 0.64 * IN, inX + fW, inY + 2 * lS + 0.64 * IN);
      // Authorized Signature
      const sigW = 1.5 * IN;
      const sigX = cx + cw - sigW - 0.25 * IN;
      const sigY_f = frontY + ch - 0.16 * IN;
      pdf.setDrawColor(127, 140, 141); pdf.setLineWidth(0.2);
      pdf.line(sigX, sigY_f, sigX + sigW, sigY_f);
      pdf.setFontSize(4.5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('Authorized Signature', sigX + sigW / 2, sigY_f + 2, { align: 'center' });
      // Front card border
      pdf.setDrawColor(44, 62, 80); pdf.setLineWidth(0.4);
      pdf.roundedRect(cx, frontY, cw, ch, r3, r3, 'S');

      // ── BACK SIDE label ─────────────────────────────────────────────────
      pdf.setFontSize(10); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text('BACK SIDE', PW / 2, backY + ch + 0.15 * IN + 3, { align: 'center' });

      // ── Back card ───────────────────────────────────────────────────────
      pdf.setFillColor(255, 255, 255); pdf.setDrawColor(44, 62, 80); pdf.setLineWidth(0.4);
      pdf.roundedRect(cx, backY, cw, ch, r3, r3, 'FD');
      if (qrDataUrl) {
        const qrSz = 1.2 * IN;
        try { pdf.addImage(qrDataUrl, 'PNG', cx + (cw - qrSz) / 2, backY + (ch - qrSz) / 2 - 0.15 * IN, qrSz, qrSz); } catch {}
      }
      pdf.setFontSize(5); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('https://suraksha.lk  ·  surakshalms@gmail.com  ·  0703300524', cx + cw / 2, backY + ch - 0.35 * IN + 2, { align: 'center', maxWidth: cw - 4 });

      // ── Fold line ────────────────────────────────────────────────────────
      pdf.setDrawColor(44, 62, 80); pdf.setLineWidth(0.3);
      pdf.setLineDashPattern([1.5, 1.5], 0);
      pdf.line(foldX1, foldY, foldX2, foldY);
      pdf.setLineDashPattern([], 0);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold'); pdf.setTextColor(44, 62, 80);
      pdf.text('FOLD LINE', foldX1, foldY - 3, { maxWidth: IN });

      // ── Cutting lines ────────────────────────────────────────────────────
      pdf.setDrawColor(127, 140, 141); pdf.setLineWidth(0.2);
      pdf.setLineDashPattern([1, 1.5], 0);
      pdf.line(cutL, cutT, cutR, cutT);
      pdf.line(cutL, cutB, cutR, cutB);
      pdf.line(cutL, cutT, cutL, cutB);
      pdf.line(cutR, cutT, cutR, cutB);
      pdf.setLineDashPattern([], 0);

      // ── Footer ───────────────────────────────────────────────────────────
      const footerY = PH - IN;
      pdf.setFontSize(7); pdf.setFont('helvetica', 'normal'); pdf.setTextColor(127, 140, 141);
      pdf.text('Card Size: 3.37" × 2.125" (3.37" × 2.125")', PW / 2, footerY, { align: 'center' });
      pdf.text('Instructions: 1) Cut rectangle 2) Fold and paste 3) Cut rounded corners 4) Sign by authorized person 5) Laminate', PW / 2, footerY + 3.5, { align: 'center', maxWidth: PW - 20 });
      pdf.text('Print at 100% scale • Do not use "Fit to Page"', PW / 2, footerY + 7, { align: 'center' });
      pdf.text(`Generated: ${new Date().toLocaleString()}`, PW / 2, footerY + 10.5, { align: 'center' });

      const name = cardData.nameWithInitials || 'ID_Card';
      pdf.save(`${name.replace(/\s+/g, '_')}_ID_Card.pdf`);
      toast({ title: 'Downloaded', description: 'ID card PDF saved.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-20 rounded-md" />
          <Skeleton className="h-8 w-28 rounded-md" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-44 w-full rounded-xl" />
          <Skeleton className="h-44 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <IdCard className="h-14 w-14 mx-auto mb-3 opacity-30" />
        <p className="text-base font-medium">No profile data available for ID card.</p>
      </div>
    );
  }

  // Global user profile photo via imageUrlHelper (storage.suraksha.lk)
  const photoUrl = getImageUrl(cardData.imageUrl);
  const formatUserType = (t: string) =>
    t ? t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'Member';

  // ─── PDF hidden A4 canvas constants ──────────────────────────────────────
  const FRONT_Y = CARDS_START_Y;
  const BACK_Y = FRONT_Y + CARD_H + V_SPACE;
  const FOLD_Y = FRONT_Y + CARD_H + Math.round(V_SPACE / 2);
  const FOLD_X1 = MARGIN_X - INCH;
  const FOLD_X2 = MARGIN_X + CARD_W + INCH;
  const CUT_PAD = Math.round(0.04 * INCH);
  const CUT_L = MARGIN_X - CUT_PAD;
  const CUT_R = MARGIN_X + CARD_W + CUT_PAD;
  const CUT_T = FRONT_Y - CUT_PAD;
  const CUT_B = BACK_Y + CARD_H + CUT_PAD;

  // ─── PDF card inner dimension constants ──────────────────────────────────
  const pdf_headerH  = Math.round(0.5  * INCH);  // 36
  const pdf_logoSize = Math.round(0.38 * INCH);  // 27
  const pdf_photoW   = Math.round(0.9  * INCH);  // 65
  const pdf_photoH   = Math.round(1.15 * INCH);  // 83
  const pdf_photoX   = Math.round(0.2  * INCH);  // 14
  const pdf_photoY   = pdf_headerH + Math.round(0.1 * INCH);
  const pdf_infoX    = pdf_photoX + pdf_photoW + Math.round(0.2 * INCH);
  const pdf_infoY    = pdf_headerH + Math.round(0.1 * INCH);
  const pdf_fieldW   = Math.round(1.5 * INCH);   // 108
  const pdf_lineGap  = Math.round(0.18 * INCH);  // 13

  const P  = (v: number) => Math.round(v * PREV);
  const PW = Math.round(CARD_W * PREV);
  const PH = Math.round(CARD_H * PREV);

  const s_headerH  = P(pdf_headerH);
  const s_logoSize = P(pdf_logoSize);
  const s_photoW   = P(pdf_photoW);
  const s_photoH   = P(pdf_photoH);
  const s_photoX   = P(pdf_photoX);
  const s_photoY   = P(pdf_photoY);
  const s_infoX    = P(pdf_infoX);
  const s_infoY    = P(pdf_infoY);
  const s_fieldW   = PW - s_infoX - P(8);

  const C2 = {
    header: '#1E6FBF',
    border: '#2C3E50',
    text: '#2C3E50',
    muted: '#7F8C8D',
    accent: '#1E6FBF',
    white: '#FFFFFF',
    light: '#F5F5F5',
  };

  return (
    <div className="space-y-4" ref={containerRef}>
      {isChildView && (
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Viewing {selectedChild?.user?.nameWithInitials || 'child'}'s digital ID
          </span>
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={fetchCardData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-1.5" />
          Print
        </Button>
        <Button size="sm" onClick={handleDownloadPdf} disabled={downloading}>
          <Download className={`h-4 w-4 mr-1.5 ${downloading ? 'animate-bounce' : ''}`} />
          {downloading ? 'Generating…' : 'Download PDF'}
        </Button>
      </div>

      {/* ── Divider ── */}
      <div className="flex items-center gap-2">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2">ID Card Preview</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          SCREEN PREVIEW — responsive: stacked on mobile, side-by-side on wide
          ════════════════════════════════════════════════════════════════════ */}
      <div ref={previewRef} className={`flex gap-4 ${isWide ? 'flex-row' : 'flex-col'}`}>

          {/* ── FRONT CARD ── */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Front</span>

            <div
              style={{
                position: 'relative',
                width: PW, height: PH,
                borderRadius: P(8),
                border: `${P(1)}px solid ${C2.border}`,
                backgroundColor: C2.white,
                overflow: 'hidden',
                fontFamily: 'Helvetica, Arial, sans-serif',
                boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
              }}
            >
              {/* ── Blue header band ── */}
              <div
                style={{
                  position: 'absolute', top: 0, left: 0, width: PW, height: s_headerH,
                  backgroundColor: C2.header,
                }}
              >
                {/* Logo white circle */}
                <div
                  style={{
                    position: 'absolute',
                    left: P(11), top: '50%', transform: 'translateY(-50%)',
                    width: s_logoSize, height: s_logoSize,
                    borderRadius: '50%',
                    backgroundColor: C2.white,
                    border: `2px solid ${C2.header}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: C2.header, fontSize: P(14),
                  }}
                >S</div>
                {/* Organisation name — centered */}
                <div
                  style={{
                    position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
                    textAlign: 'center',
                    color: C2.white, fontWeight: 800, fontSize: P(13), letterSpacing: 1.5,
                  }}
                >SURAKSHA LMS</div>
              </div>

              {/* ── Photo box (left side, below header) ── */}
              <div
                style={{
                  position: 'absolute',
                  left: s_photoX, top: s_photoY,
                  width: s_photoW, height: s_photoH,
                  border: `${P(1)}px solid ${C2.border}`,
                  overflow: 'hidden',
                  backgroundColor: C2.light,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {photoUrl && !photoError ? (
                  <img
                    src={photoUrl}
                    alt="Photo"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <div
                    style={{
                      backgroundColor: C2.header,
                      width: '100%', height: '100%',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      color: C2.white,
                    }}
                  >
                    {/* Silhouette placeholder */}
                    <div style={{ width: P(22), height: P(22), borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.85)', marginBottom: P(6) }} />
                    <div style={{ width: P(36), height: P(18), backgroundColor: 'rgba(255,255,255,0.65)', borderRadius: '50% 50% 0 0' }} />
                    <div style={{ fontSize: P(6), marginTop: P(4), opacity: 0.9 }}>NO PHOTO</div>
                  </div>
                )}
              </div>

              {/* ── Student info (right of photo) ── */}
              {/* maxHeight = card height − info top − space reserved for signature row */}
              <div style={{ position: 'absolute', left: s_infoX, top: s_infoY, width: s_fieldW, maxHeight: PH - s_infoY - P(28), overflow: 'hidden' }}>

                {/* USER ID */}
                <div style={{ fontSize: P(6), color: C2.muted, marginBottom: P(1), letterSpacing: 0.5 }}>USER ID</div>
                <div style={{ fontSize: P(10), fontWeight: 700, color: C2.text, marginBottom: P(1), fontFamily: 'monospace', overflow: 'hidden', wordBreak: 'break-all', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {cardData.id || 'N/A'}
                </div>
                <div style={{ height: 1.5, backgroundColor: C2.accent, marginBottom: P(3) }} />

                {/* NAME */}
                <div style={{ fontSize: P(6), color: C2.muted, marginBottom: P(1), letterSpacing: 0.5 }}>NAME</div>
                <div style={{ fontSize: P(8), fontWeight: 700, color: C2.text, lineHeight: 1.2, marginBottom: P(1), overflow: 'hidden', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {cardData.nameWithInitials || 'N/A'}
                </div>
                <div style={{ height: 1.5, backgroundColor: C2.accent, marginBottom: P(3) }} />

                {/* ROLE */}
                <div style={{ fontSize: P(6), color: C2.muted, marginBottom: P(1), letterSpacing: 0.5 }}>ROLE</div>
                <div style={{ fontSize: P(8), fontWeight: 700, color: C2.text, marginBottom: P(1), overflow: 'hidden', wordBreak: 'break-word', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                  {formatUserType(cardData.userType)}
                </div>
                <div style={{ height: 1.5, backgroundColor: C2.accent, marginBottom: P(3) }} />

                {/* ISSUE DATE */}
                <div style={{ fontSize: P(6), color: C2.muted, marginBottom: P(1), letterSpacing: 0.5 }}>ISSUE DATE</div>
                <div style={{ fontSize: P(8), fontWeight: 700, color: C2.text, marginBottom: P(1), overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {issueDate}
                </div>
                <div style={{ height: 1.5, backgroundColor: C2.accent }} />
              </div>

              {/* ── Authorized Signature — pinned to bottom-right, below info panel ── */}
              <div
                style={{
                  position: 'absolute',
                  right: P(12), bottom: P(8),
                  width: P(100),
                }}
              >
                <div style={{ borderTop: `1px solid ${C2.muted}` }} />
                <div style={{ fontSize: Math.max(P(5), 7), color: C2.muted, textAlign: 'center', marginTop: P(2) }}>
                  Authorized Signature
                </div>
              </div>
            </div>
          </div>

          {/* ── BACK CARD ── */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Back</span>

            <div
              style={{
                position: 'relative',
                width: PW, height: PH,
                borderRadius: P(8),
                border: `${P(1)}px solid ${C2.border}`,
                backgroundColor: C2.white,
                overflow: 'hidden',
                fontFamily: 'Helvetica, Arial, sans-serif',
                boxShadow: '0 8px 32px rgba(44,62,80,0.18)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {/* QR code */}
              {qrDataUrl && (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  style={{
                    width: P(Math.round(1.1 * INCH)),
                    height: P(Math.round(1.1 * INCH)),
                    imageRendering: 'pixelated',
                    display: 'block',
                  }}
                />
              )}

              {/* Contact footer */}
              <div
                style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  height: P(25),
                  borderTop: `1px solid ${C2.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexWrap: 'wrap', gap: P(4), padding: `0 ${P(6)}px`,
                }}
              >
                <span style={{ fontSize: Math.max(P(7), 8), color: C2.muted }}>https://suraksha.lk</span>
                <span style={{ fontSize: Math.max(P(7), 8), color: C2.muted }}>·</span>
                <span style={{ fontSize: Math.max(P(7), 8), color: C2.muted }}>surakshalms@gmail.com</span>
                <span style={{ fontSize: Math.max(P(7), 8), color: C2.muted }}>·</span>
                <span style={{ fontSize: Math.max(P(7), 8), color: C2.muted }}>0703300524</span>
              </div>
            </div>
          </div>

      </div>

    </div>
  );
};

export default DigitalIdCard;
