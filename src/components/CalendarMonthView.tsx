import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  ChevronLeft, ChevronRight, Calendar, Loader2, Clock, MapPin,
  UserCheck, Users, Award, BookOpen, Star, AlertTriangle, CalendarDays
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import calendarApi from '@/api/calendar.api';
import type { CalendarDay, CalendarEvent, CalendarDayType } from '@/types/calendar.types';
import { DAY_TYPE_META } from '@/components/calendar/calendarTheme';

// Day type color configuration
const DAY_TYPE_COLORS: Record<CalendarDayType, { dot: string; bg: string; text: string; label: string }> = DAY_TYPE_META as Record<CalendarDayType, { dot: string; bg: string; text: string; label: string }>;

const formatTime = (time: string | undefined | null): string => {
  if (!time) return '';
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h = hours % 12 || 12;
  return `${h}:${minutes} ${ampm}`;
};

const CalendarMonthView = () => {
  const { currentInstituteId } = useAuth();
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-indexed
  const [dayMap, setDayMap] = useState<Map<string, CalendarDay>>(new Map());
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);
  const [dayEvents, setDayEvents] = useState<CalendarEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [showDayDetail, setShowDayDetail] = useState(false);

  const fetchMonthDays = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;

      const res = await calendarApi.getDays(currentInstituteId, {
        startDate,
        endDate,
        limit: 400,
      });

      const map = new Map<string, CalendarDay>();
      const days = Array.isArray(res?.data) ? res.data : [];
      for (const day of days) {
        map.set(day.calendarDate, day);
      }
      setDayMap(map);
    } catch (error) {
      console.error('Failed to load calendar days:', error);
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, year, month]);

  useEffect(() => {
    fetchMonthDays();
  }, [fetchMonthDays]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (month === 1) { setMonth(12); setYear(y => y - 1); }
      else setMonth(m => m - 1);
    } else {
      if (month === 12) { setMonth(1); setYear(y => y + 1); }
      else setMonth(m => m + 1);
    }
  };

  // Build calendar grid
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(year, month, 0).getDate();

    const cells: (CalendarDay | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push(dayMap.get(dateStr) || ({ calendarDate: dateStr, dayType: 'REGULAR', isAttendanceExpected: true } as CalendarDay));
    }
    // Pad to fill last row
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [dayMap, year, month]);

  // Month summary stats
  const monthStats = useMemo(() => {
    const stats = { working: 0, holidays: 0, weekends: 0, exams: 0, special: 0 };
    dayMap.forEach(day => {
      if (day.dayType === 'WEEKEND') stats.weekends++;
      else if (['PUBLIC_HOLIDAY', 'INSTITUTE_HOLIDAY'].includes(day.dayType)) stats.holidays++;
      else if (day.dayType === 'EXAM_DAY') stats.exams++;
      else if (day.dayType === 'SPECIAL_EVENT') stats.special++;
      else if (day.isAttendanceExpected) stats.working++;
    });
    return stats;
  }, [dayMap]);

  const handleDayClick = async (day: CalendarDay) => {
    setSelectedDay(day);
    setShowDayDetail(true);
    setDayEvents([]);

    if (day.id && currentInstituteId) {
      setLoadingEvents(true);
      try {
        const res = await calendarApi.getDayEvents(currentInstituteId, day.id);
        setDayEvents(Array.isArray(res?.data) ? res.data : []);
      } catch (err) {
        console.warn('Failed to load events:', err);
      } finally {
        setLoadingEvents(false);
      }
    }
  };

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = new Date().toISOString().split('T')[0];
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {monthName}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(DAY_TYPE_COLORS).filter(([key]) => !['STAFF_ONLY', 'CANCELLED'].includes(key)).map(([key, config]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className={`w-2.5 h-2.5 rounded-full ${config.dot}`} />
                {config.label}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                {/* Week day headers */}
                {weekDays.map(d => (
                  <div key={d} className="bg-muted p-1.5 sm:p-2 text-center text-xs font-medium text-muted-foreground">
                    {d}
                  </div>
                ))}

                {/* Calendar cells */}
                {calendarCells.map((day, i) => {
                  if (!day) {
                    return <div key={`empty-${i}`} className="bg-card p-1.5 sm:p-2 min-h-[48px] sm:min-h-[64px]" />;
                  }

                  const dayNum = parseInt(day.calendarDate.split('-')[2]);
                  const isToday = day.calendarDate === today;
                  const config = DAY_TYPE_COLORS[day.dayType] || DAY_TYPE_COLORS.REGULAR;

                  return (
                    <button
                      key={day.calendarDate}
                      onClick={() => day.id && handleDayClick(day)}
                      className={`
                        bg-card p-1 sm:p-2 min-h-[48px] sm:min-h-[64px] text-left transition-colors
                        hover:bg-accent/50 cursor-pointer relative
                        ${isToday ? 'ring-2 ring-primary ring-inset' : ''}
                      `}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`
                          text-xs sm:text-sm font-medium
                          ${isToday ? 'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center' : config.text}
                        `}>
                          {dayNum}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 mt-0.5`} />
                      </div>
                      {day.title && (
                        <p className="text-[9px] sm:text-[10px] leading-tight text-muted-foreground mt-0.5 line-clamp-2">
                          {day.title}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Month Summary */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-4">
                <div className="text-center p-2 rounded-lg bg-emerald-500/10">
                  <div className="text-lg font-bold text-emerald-600">{monthStats.working}</div>
                  <div className="text-[10px] text-muted-foreground">Working</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-red-500/10">
                  <div className="text-lg font-bold text-red-500">{monthStats.holidays}</div>
                  <div className="text-[10px] text-muted-foreground">Holidays</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-blue-500/10">
                  <div className="text-lg font-bold text-blue-500">{monthStats.weekends}</div>
                  <div className="text-[10px] text-muted-foreground">Weekends</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-purple-500/10">
                  <div className="text-lg font-bold text-purple-500">{monthStats.exams}</div>
                  <div className="text-[10px] text-muted-foreground">Exams</div>
                </div>
                <div className="text-center p-2 rounded-lg bg-cyan-500/10">
                  <div className="text-lg font-bold text-cyan-500">{monthStats.special}</div>
                  <div className="text-[10px] text-muted-foreground">Special</div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Day Detail Dialog */}
      <Dialog open={showDayDetail} onOpenChange={setShowDayDetail}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              {selectedDay && new Date(selectedDay.calendarDate + 'T12:00:00').toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>

          {selectedDay && (
            <div className="space-y-4">
              {/* Day Info */}
              <div className="flex flex-wrap gap-2">
                <Badge className={`${DAY_TYPE_COLORS[selectedDay.dayType]?.bg || ''} ${DAY_TYPE_COLORS[selectedDay.dayType]?.text || ''} border`}>
                  {selectedDay.dayType.replace(/_/g, ' ')}
                </Badge>
                <Badge variant={selectedDay.isAttendanceExpected ? 'default' : 'secondary'}>
                  {selectedDay.isAttendanceExpected ? '✅ Attendance Expected' : '❌ No Attendance'}
                </Badge>
              </div>

              {selectedDay.startTime && selectedDay.endTime && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatTime(selectedDay.startTime)} — {formatTime(selectedDay.endTime)}
                </div>
              )}

              {selectedDay.title && (
                <p className="text-sm font-medium">{selectedDay.title}</p>
              )}

              {/* Events */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Events</h4>
                {loadingEvents ? (
                  <div className="flex items-center gap-2 py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Loading events...</span>
                  </div>
                ) : dayEvents.length > 0 ? (
                  <div className="space-y-2">
                    {dayEvents.map(event => (
                      <div key={event.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{event.title}</span>
                          {event.isDefault && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">Default</Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                          {event.startTime && event.endTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(event.startTime)} — {formatTime(event.endTime)}
                            </span>
                          )}
                          <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">
                            {event.status}
                          </Badge>
                          {event.isMandatory && (
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4">Mandatory</Badge>
                          )}
                          {event.venue && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {event.venue}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground py-2">No events for this day.</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalendarMonthView;
