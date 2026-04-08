import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, X, Copy, Check } from 'lucide-react';
import { AddressCoordinates } from '@/types/attendance.types';
import { useState } from 'react';

interface AttendanceLocationViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  studentName?: string;
  studentId?: string;
  address?: AddressCoordinates;
  location?: string;
  date?: string;
  status?: string;
  className?: string;
  instituteName?: string;
  markingTime?: string;
  markingMethod?: string;
}

export const AttendanceLocationViewer: React.FC<AttendanceLocationViewerProps> = ({
  open,
  onOpenChange,
  studentName,
  studentId,
  address,
  location,
  date,
  status,
  className,
  instituteName,
  markingTime,
  markingMethod,
}) => {
  const [copiedCoord, setCopiedCoord] = useState(false);

  const hasCoordinates = address?.latitude && address?.longitude;

  const handleOpenGoogleMaps = () => {
    if (!hasCoordinates) {
      alert('Location coordinates not available');
      return;
    }
    const mapsUrl = `https://www.google.com/maps?q=${address.latitude},${address.longitude}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCoordinates = () => {
    if (!hasCoordinates) return;
    const coordText = `${address.latitude.toFixed(6)}, ${address.longitude.toFixed(6)}`;
    navigator.clipboard.writeText(coordText).then(() => {
      setCopiedCoord(true);
      setTimeout(() => setCopiedCoord(false), 2000);
    });
  };

  const handleOpenAppleMaps = () => {
    if (!hasCoordinates) {
      alert('Location coordinates not available');
      return;
    }
    const appleMapsUrl = `maps://maps.apple.com/?q=${address.latitude},${address.longitude}`;
    window.open(appleMapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[88vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-3 pr-10">
            <div className="p-2 rounded-xl bg-primary/10">
              <MapPin className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-bold text-base leading-tight">Attendance Location Details</p>
              <p className="text-xs text-muted-foreground font-normal">{studentName || 'Attendance record'}</p>
            </div>
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" className="absolute right-4 top-4">
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Attendance Summary</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {studentName && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50 col-span-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Student</span>
                  <span className="text-sm font-semibold">{studentName}</span>
                </div>
              )}
              {studentId && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Student ID</span>
                  <span className="text-xs font-mono font-bold text-primary">{studentId}</span>
                </div>
              )}
              {status && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-green-600 dark:text-green-400">Status</span>
                  <span className="text-xs font-semibold capitalize text-green-700 dark:text-green-300">{status}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Location</p>
            <div className="space-y-3">
              {location && (
                <div className="p-3.5 rounded-xl bg-muted/60 border border-border/50">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">Display Address</p>
                  <p className="text-sm break-words leading-6">{location}</p>
                </div>
              )}

              {hasCoordinates && (
                <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">GPS Coordinates</p>
                      <p className="text-sm font-mono font-bold text-primary">
                        {address.latitude.toFixed(6)}, {address.longitude.toFixed(6)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCopyCoordinates}
                      className="h-8 px-3"
                    >
                      {copiedCoord ? <Check className="h-3.5 w-3.5 mr-1.5" /> : <Copy className="h-3.5 w-3.5 mr-1.5" />}
                      {copiedCoord ? 'Copied' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button size="sm" onClick={handleOpenGoogleMaps} className="sm:flex-1 h-9">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Open in Google Maps
                    </Button>
                    <Button size="sm" onClick={handleOpenAppleMaps} variant="outline" className="sm:flex-1 h-9">
                      <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      Open in Apple Maps
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Marking Details</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {instituteName && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Institute</span>
                  <span className="text-xs font-medium">{instituteName}</span>
                </div>
              )}
              {className && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Class</span>
                  <span className="text-xs font-medium">{className}</span>
                </div>
              )}
              {date && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Date</span>
                  <span className="text-xs font-medium">{new Date(date).toLocaleDateString()}</span>
                </div>
              )}
              {markingTime && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Marked At</span>
                  <span className="text-xs font-medium">{markingTime}</span>
                </div>
              )}
              {markingMethod && (
                <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Method</span>
                  <span className="text-xs font-medium capitalize">{markingMethod}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AttendanceLocationViewer;
