import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BarChart3, QrCode, Smartphone, Wifi, Building2, GraduationCap, BookOpen, Lock } from 'lucide-react';

const SelectAttendanceMarkType = () => {
  const navigate = useNavigate();
  const { selectedInstitute, selectedClass, selectedSubject, currentInstituteId } = useAuth();

  const instituteId = currentInstituteId || selectedInstitute?.id;

  const goBack = () => {
    if (instituteId) {
      navigate(`/institute/${instituteId}/dashboard`);
      return;
    }
    navigate('/dashboard');
  };

  const buildAttendanceUrl = (page: string) => {
    let base = `/institute/${instituteId}`;
    if (selectedClass?.id) {
      base += `/class/${selectedClass.id}`;
      if (selectedSubject?.id) {
        base += `/subject/${selectedSubject.id}`;
      }
    }
    return `${base}/${page}`;
  };

  const goToQr = (method: 'qr' | 'barcode') => {
    if (!instituteId) { navigate('/select-institute'); return; }
    navigate(`${buildAttendanceUrl('qr-attendance')}?method=${method}`);
  };

  const goToRfid = () => {
    if (!instituteId) { navigate('/select-institute'); return; }
    navigate(buildAttendanceUrl('rfid'));
  };

  const goToInstituteCard = () => {
    if (!instituteId) { navigate('/select-institute'); return; }
    navigate(buildAttendanceUrl('institute-mark-attendance'));
  };

  const goToCloseAttendance = () => {
    if (!instituteId) { navigate('/select-institute'); return; }
    navigate(buildAttendanceUrl('close-attendance'));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Sticky Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={goBack} className="shrink-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Select Scanning Method</h1>
            <p className="text-sm text-muted-foreground">Choose how you want to mark attendance</p>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Current Selection */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Current Selection
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <span className={`font-semibold text-base ${selectedInstitute ? 'text-foreground' : 'text-muted-foreground italic'}`}>
                {selectedInstitute?.name || 'No institute selected'}
              </span>
            </div>
            {selectedClass && (
              <div className="flex items-center gap-3 pl-4 ml-1 border-l-2 border-primary/30">
                <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium text-foreground">{selectedClass.name}</span>
              </div>
            )}
            {selectedSubject && (
              <div className="flex items-center gap-3 pl-4 ml-5 border-l-2 border-primary/20">
                <div className="h-7 w-7 rounded-md bg-primary/5 flex items-center justify-center shrink-0">
                  <BookOpen className="h-4 w-4 text-primary/70" />
                </div>
                <span className="font-medium text-foreground">{selectedSubject.name}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scanning Methods */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Scanning Methods</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: <QrCode className="h-10 w-10 text-cyan-500" />, label: 'QR Code', desc: 'Scan student QR code cards with the camera', onClick: () => goToQr('qr'), hover: 'hover:border-cyan-500/50' },
              { icon: <BarChart3 className="h-10 w-10 text-blue-500" />, label: 'Barcode', desc: 'Scan 1D barcode cards with a barcode scanner', onClick: () => goToQr('barcode'), hover: 'hover:border-blue-500/50' },
              { icon: <Smartphone className="h-10 w-10 text-violet-500" />, label: 'RFID / NFC', desc: 'Tap RFID or NFC cards to mark attendance', onClick: goToRfid, hover: 'hover:border-violet-500/50' },
              { icon: <Wifi className="h-10 w-10 text-emerald-500" />, label: 'Institute Card', desc: 'Mark attendance using institute-issued card IDs', onClick: goToInstituteCard, hover: 'hover:border-emerald-500/50' },
            ].map((m) => (
              <button
                key={m.label}
                onClick={m.onClick}
                className={`group relative flex flex-col items-start gap-4 p-6 rounded-xl border border-border bg-card text-left transition-all duration-200 hover:shadow-md ${m.hover} hover:bg-card/80`}
              >
                <div className="p-3 rounded-xl bg-muted/60 group-hover:bg-muted transition-colors">{m.icon}</div>
                <div>
                  <p className="font-semibold text-base text-foreground">{m.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Close Attendance */}
        <div>
          <h2 className="text-base font-semibold text-foreground mb-4">Session Management</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={goToCloseAttendance}
              className="group relative flex flex-col items-start gap-4 p-6 rounded-xl border border-destructive/30 bg-destructive/5 text-left transition-all duration-200 hover:shadow-md hover:border-destructive/50 hover:bg-destructive/10"
            >
              <div className="p-3 rounded-xl bg-destructive/10 group-hover:bg-destructive/20 transition-colors">
                <Lock className="h-10 w-10 text-destructive" />
              </div>
              <div>
                <p className="font-semibold text-base text-foreground">Close Attendance</p>
                <p className="text-sm text-muted-foreground mt-1">Choose a scope, event, and date to close the session and mark absent students</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectAttendanceMarkType;
