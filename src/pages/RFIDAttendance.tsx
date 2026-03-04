import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wifi, ArrowLeft, MapPin, CheckCircle, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { childAttendanceApi } from '@/api/childAttendance.api';
import { buildAttendanceAddress } from '@/utils/attendanceAddress';
import { AttendanceStatus, ALL_ATTENDANCE_STATUSES, ATTENDANCE_STATUS_CONFIG } from '@/types/attendance.types';
import { useTodayCalendarEvents, DEFAULT_EVENT_ID } from '@/hooks/useTodayCalendarEvents';
import EventSelector from '@/components/attendance/EventSelector';

interface LastAttendance {
  rfidCardId: string;
  studentName: string;
  userIdByInstitute: string;
  status: AttendanceStatus;
  timestamp: number;
  imageUrl?: string;
}

const RfidAttendance = () => {
  const { selectedInstitute, selectedClass, selectedSubject, currentInstituteId } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [rfidCardId, setRfidCardId] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [selectedEventId, setSelectedEventId] = useState(DEFAULT_EVENT_ID);
  const [isProcessing, setIsProcessing] = useState(false);
  const [location, setLocation] = useState<string>('');
  const [lastAttendance, setLastAttendance] = useState<LastAttendance | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const inputRef = useRef<HTMLInputElement>(null);
  const clearTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calendarInfo = useTodayCalendarEvents(currentInstituteId, selectedClass?.id?.toString());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const buildAddress = (loc?: string) => buildAttendanceAddress({
    instituteName: selectedInstitute?.name,
    className: selectedClass?.name,
    subjectName: selectedSubject?.name,
    location: loc,
  });

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              setLocation(data.display_name || 'Unknown Location');
            } catch { setLocation('Location detected'); }
          },
          () => setLocation('Gate Scanner - Main Entrance')
        );
      } else {
        setLocation('Gate Scanner - Main Entrance');
      }
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (lastAttendance) {
      if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current);
      clearTimeoutRef.current = setTimeout(() => setLastAttendance(null), 60000);
    }
    return () => { if (clearTimeoutRef.current) clearTimeout(clearTimeoutRef.current); };
  }, [lastAttendance]);

  const handleMarkAttendance = async () => {
    if (!rfidCardId.trim()) {
      toast({ title: "Error", description: "Please enter or scan an RFID card ID", variant: "destructive" });
      return;
    }
    if (!currentInstituteId || !selectedInstitute?.name) {
      toast({ title: "Error", description: "Please select an institute first", variant: "destructive" });
      return;
    }
    if (lastAttendance && lastAttendance.rfidCardId === rfidCardId.trim()) {
      toast({ title: "Duplicate Detected", description: `Attendance already marked for ${lastAttendance.studentName}`, variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    try {
      const markPayload: any = {
        studentCardId: rfidCardId.trim(),
        instituteId: currentInstituteId.toString(),
        instituteName: selectedInstitute.name,
        classId: selectedClass?.id.toString(),
        className: selectedClass?.name,
        subjectId: selectedSubject?.id.toString(),
        subjectName: selectedSubject?.name,
        address: buildAddress(location),
        markingMethod: 'rfid/nfc' as const,
        status: status
      };

      if (selectedEventId !== DEFAULT_EVENT_ID) {
        markPayload.eventId = selectedEventId;
      }

      const result = await childAttendanceApi.markAttendanceByCard(markPayload);
      if (result.success) {
        const studentName = result.name || 'Student';
        setLastAttendance({
          rfidCardId: rfidCardId.trim(),
          studentName,
          userIdByInstitute: rfidCardId.trim(),
          status: result.status || status,
          timestamp: Date.now(),
          imageUrl: result.imageUrl || undefined,
        });
        toast({ title: `✓ ${studentName}`, description: `${status.toUpperCase()} - ${new Date().toLocaleTimeString()}` });
        setRfidCardId('');
        inputRef.current?.focus();
      } else {
        throw new Error(result.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Attendance marking error:', error);
      toast({ title: "Error", description: error instanceof Error ? error.message : 'Failed to mark attendance', variant: "destructive" });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isProcessing) handleMarkAttendance();
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/qr-attendance')} className="flex items-center gap-2 rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Wifi className="h-5 w-5" /> RFID Attendance
            </h1>
          </div>
        </div>

        {/* Current Selection */}
        <Card className="border-primary/20 bg-card shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-1">Current Selection</p>
            <p className="font-semibold text-foreground">Institute: {selectedInstitute?.name || 'Not selected'}</p>
            {location && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {location}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Main Card */}
        <Card className="border shadow-lg">
          <CardContent className="p-0">
            {/* Date/Time */}
            <div className="flex border-b">
              <div className="flex-1 p-4 text-center border-r">
                <p className="text-xs text-muted-foreground mb-1">Date</p>
                <p className="font-semibold text-foreground">{currentTime.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </div>
              <div className="flex-1 p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Time</p>
                <p className="font-semibold text-foreground tabular-nums">{currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</p>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-0">
              {/* Left - Image */}
              <div className="p-6 lg:p-8 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r">
                <div className="relative mb-6">
                  {lastAttendance?.imageUrl ? (
                    <div className="relative">
                      <img src={lastAttendance.imageUrl} alt={`${lastAttendance.studentName} photo`}
                        className={`h-48 w-48 sm:h-56 sm:w-56 rounded-lg object-cover border-4 shadow-lg ${
                          lastAttendance.status === 'present' ? 'border-success' :
                          lastAttendance.status === 'absent' ? 'border-destructive' :
                          lastAttendance.status === 'late' ? 'border-warning' : 'border-muted'
                        }`}
                      />
                      <div className={`absolute -bottom-3 -right-3 rounded-full p-2 shadow-lg ${
                        lastAttendance.status === 'present' ? 'bg-success' :
                        lastAttendance.status === 'absent' ? 'bg-destructive' :
                        lastAttendance.status === 'late' ? 'bg-warning' : 'bg-muted'
                      }`}>
                        <CheckCircle className="h-8 w-8 text-primary-foreground" />
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 w-48 sm:h-56 sm:w-56 border-4 border-destructive rounded-lg flex items-center justify-center bg-muted/30">
                      <User className="h-20 w-20 text-destructive" />
                    </div>
                  )}
                </div>
                {lastAttendance && (
                  <div className="text-center space-y-3">
                    <p className={`text-xl font-bold ${
                      lastAttendance.status === 'present' ? 'text-success' :
                      lastAttendance.status === 'absent' ? 'text-destructive' :
                      lastAttendance.status === 'late' ? 'text-warning' : 'text-muted-foreground'
                    }`}>{lastAttendance.studentName}</p>
                    <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${
                      lastAttendance.status === 'present' ? 'bg-success/10 text-success border-success/20' :
                      lastAttendance.status === 'absent' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                      lastAttendance.status === 'late' ? 'bg-warning/10 text-warning border-warning/20' :
                      'bg-muted/10 text-muted-foreground border-muted/20'
                    }`}>
                      Status: {ATTENDANCE_STATUS_CONFIG[lastAttendance.status]?.label || lastAttendance.status.toUpperCase()}
                    </div>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p>Card ID: <span className="font-medium">{lastAttendance.rfidCardId}</span></p>
                      <p>User ID: <span className="font-medium">{lastAttendance.userIdByInstitute}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right - Inputs */}
              <div className="p-6 lg:p-8 flex flex-col justify-center space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="rfid-card-input" className="text-sm font-medium text-foreground">RFID ID</Label>
                  <Input id="rfid-card-input" ref={inputRef} type="text" placeholder="Scan or enter RFID ID..." value={rfidCardId}
                    onChange={(e) => setRfidCardId(e.target.value)} onKeyPress={handleKeyPress} disabled={isProcessing}
                    className="h-12 text-base border-2 border-input focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0" autoFocus />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status-select" className="text-sm font-medium text-foreground">Status</Label>
                  <Select value={status} onValueChange={(value: AttendanceStatus) => setStatus(value)} disabled={isProcessing}>
                    <SelectTrigger id="status-select" className="h-12 text-base border-2 border-primary"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {ALL_ATTENDANCE_STATUSES.map((s) => (
                        <SelectItem key={s} value={s} className="text-muted-foreground">
                          {ATTENDANCE_STATUS_CONFIG[s].icon} {ATTENDANCE_STATUS_CONFIG[s].label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Event Selector */}
                <EventSelector
                  events={calendarInfo.events}
                  selectedEventId={selectedEventId}
                  onEventChange={setSelectedEventId}
                  loading={calendarInfo.loading}
                  disabled={isProcessing}
                  dayType={calendarInfo.dayType}
                  isAttendanceExpected={calendarInfo.isAttendanceExpected}
                />

                <Button onClick={handleMarkAttendance} disabled={isProcessing || !rfidCardId.trim()} className="w-full font-semibold" size="xl">
                  {isProcessing ? (<><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>) : 'Mark Attendance'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RfidAttendance;
