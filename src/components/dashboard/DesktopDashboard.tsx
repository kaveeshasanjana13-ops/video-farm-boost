import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useNavigate } from 'react-router-dom';
import { buildSidebarUrl } from '@/utils/pageNavigation';
import InstituteCarousel from '@/components/dashboard/InstituteCarousel';
import { instituteClassesApi } from '@/api/instituteClasses.api';
import { subjectsApi } from '@/api/subjects.api';
import { studentAttendanceApi } from '@/api/studentAttendance.api';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  Users, GraduationCap, UserCheck, BookOpen, School,
  MessageSquare, Video, Calendar, ChevronRight,
  QrCode, Clock, TrendingUp, TrendingDown, Notebook,
  FileText, Award, Bell, User, IdCard, Loader2,
} from 'lucide-react';

const DesktopDashboard = () => {
  const {
    user, selectedInstitute, selectedClass, selectedSubject,
    selectedChild, selectedOrganization, selectedTransport,
    setSelectedInstitute,
  } = useAuth();
  const userRole = useInstituteRole();
  const navigate = useNavigate();
  const isTuitionInstitute = selectedInstitute?.type === 'tuition_institute';
  const subjectLabel = isTuitionInstitute ? 'Sub Class' : 'Subject';

  // Real data state
  const [classCount, setClassCount] = useState<number | null>(null);
  const [subjectCount, setSubjectCount] = useState<number | null>(null);
  const [attendanceRate, setAttendanceRate] = useState<number | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<any>(null);
  const [weeklyAttendance, setWeeklyAttendance] = useState<number[]>([]);
  const [lastWeekRate, setLastWeekRate] = useState<number | null>(null);
  const [loading, setLoading] = useState({ classes: true, subjects: true, attendance: true });

  const instituteId = selectedInstitute?.id;

  // Fetch classes count
  useEffect(() => {
    if (!instituteId) return;
    setLoading(l => ({ ...l, classes: true }));

    const fetchClasses = async () => {
      try {
        if (userRole === 'Teacher' && user?.id) {
          const result = await instituteClassesApi.getByInstituteAndTeacher(instituteId, user.id);
          const classes = (result as any)?.data || (result as any) || [];
          setClassCount(Array.isArray(classes) ? classes.length : 0);
        } else if (userRole === 'Student' && user?.id) {
          // Students: use student endpoint /institute-classes/{instituteId}/student/{userId}
          const result = await enhancedCachedClient.get<any>(`/institute-classes/${instituteId}/student/${user.id}?page=1&limit=50`, undefined, {
            ttl: 15,
            userId: user.id,
            instituteId,
          });
          const classes = (result as any)?.data || (result as any) || [];
          setClassCount(Array.isArray(classes) ? classes.length : 0);
        } else {
          const result = await instituteClassesApi.getByInstitute(instituteId);
          const classes = (result as any)?.data || (result as any) || [];
          setClassCount(Array.isArray(classes) ? classes.length : 0);
        }
      } catch (e) {
        console.error('Failed to fetch classes:', e);
        setClassCount(0);
      } finally {
        setLoading(l => ({ ...l, classes: false }));
      }
    };
    fetchClasses();
  }, [instituteId, userRole, user?.id]);

  // Fetch subjects count
  useEffect(() => {
    if (!instituteId) return;
    setLoading(l => ({ ...l, subjects: true }));

    const fetchSubjects = async () => {
      try {
        const result = await subjectsApi.getAll(instituteId);
        const subjects = (result as any)?.data || (result as any) || [];
        setSubjectCount(Array.isArray(subjects) ? subjects.length : 0);
      } catch (e) {
        console.error('Failed to fetch subjects:', e);
        setSubjectCount(0);
      } finally {
        setLoading(l => ({ ...l, subjects: false }));
      }
    };
    fetchSubjects();
  }, [instituteId]);

  // Fetch attendance data (role-based)
  useEffect(() => {
    if (!instituteId) return;
    setLoading(l => ({ ...l, attendance: true }));

    // Lock attendance to today's date only - no yesterday or tomorrow
    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const startDate = todayStr;
    const endDate = todayStr;
    const lastWeekStart = format(startOfWeek(subDays(today, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd');
    const lastWeekEnd = format(endOfWeek(subDays(today, 7), { weekStartsOn: 1 }), 'yyyy-MM-dd');

    const fetchAttendance = async () => {
      try {
        if (userRole === 'Student' && user?.id) {
          // Student: get own attendance
          const result = await studentAttendanceApi.getInstituteAttendance({
            studentId: user.id,
            instituteId,
            startDate,
            endDate,
            limit: 100,
          });
          setAttendanceSummary(result.summary);
          const total = (result.summary?.totalPresent || 0) + (result.summary?.totalAbsent || 0) + (result.summary?.totalLate || 0);
          setAttendanceRate(total > 0 ? Math.round(((result.summary?.totalPresent || 0) / total) * 100) : null);

          // Last week for comparison
          const lastResult = await studentAttendanceApi.getInstituteAttendance({
            studentId: user.id,
            instituteId,
            startDate: lastWeekStart,
            endDate: lastWeekEnd,
            limit: 100,
          });
          const lastTotal = (lastResult.summary?.totalPresent || 0) + (lastResult.summary?.totalAbsent || 0) + (lastResult.summary?.totalLate || 0);
          setLastWeekRate(lastTotal > 0 ? Math.round(((lastResult.summary?.totalPresent || 0) / lastTotal) * 100) : null);
        } else {
          // Admin/Teacher: get institute-wide attendance
          const result = await enhancedCachedClient.get<any>(
            `/api/attendance/institute/${instituteId}?startDate=${startDate}&endDate=${endDate}&page=1&limit=100`,
            undefined,
            { ttl: 10, useStaleWhileRevalidate: true, instituteId }
          );
          const summary = (result as any)?.summary;
          setAttendanceSummary(summary);
          const rate = summary?.attendanceRate;
          setAttendanceRate(rate != null ? Math.round(rate) : null);

          // Last week
          const lastResult = await enhancedCachedClient.get<any>(
            `/api/attendance/institute/${instituteId}?startDate=${lastWeekStart}&endDate=${lastWeekEnd}&page=1&limit=100`,
            undefined,
            { ttl: 10, useStaleWhileRevalidate: true, instituteId }
          );
          const lastSummary = (lastResult as any)?.summary;
          setLastWeekRate(lastSummary?.attendanceRate != null ? Math.round(lastSummary.attendanceRate) : null);
        }
      } catch (e) {
        console.error('Failed to fetch attendance:', e);
        setAttendanceRate(null);
      } finally {
        setLoading(l => ({ ...l, attendance: false }));
      }
    };
    fetchAttendance();
  }, [instituteId, userRole, user?.id, selectedClass?.id]);

  const attendanceDiff = useMemo(() => {
    if (attendanceRate == null || lastWeekRate == null) return null;
    return attendanceRate - lastWeekRate;
  }, [attendanceRate, lastWeekRate]);

  const handleNavigate = (itemId: string) => {
    const context = {
      instituteId: selectedInstitute?.id,
      classId: selectedClass?.id,
      subjectId: selectedSubject?.id,
      childId: selectedChild?.id,
      organizationId: selectedOrganization?.id,
      transportId: selectedTransport?.id,
    };
    if (itemId === 'organizations' && !selectedInstitute) {
      window.open('https://org.suraksha.lk/', '_blank');
      return;
    }
    const url = buildSidebarUrl(itemId, context);
    navigate(url);
  };

  // Quick action items - only Select Class and Calendar View for all roles
  const getQuickActions = () => {
    return [
      { id: 'select-class', label: 'Select Class', icon: School, desc: 'Choose a class' },
      { id: 'calendar-view', label: 'Calendar View', icon: Calendar, desc: 'Full calendar view' },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            {userRole === 'Student'
              ? 'Your academic overview'
              : `Overview of ${selectedInstitute?.shortName || selectedInstitute?.name || 'your institute'}`}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
      </div>

      {/* Institute carousel */}
      <InstituteCarousel onSelectInstitute={(inst) => setSelectedInstitute(inst)} />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* Academic Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Academic</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleNavigate(userRole === 'Student' ? 'select-class' : 'classes')}
              className="bg-muted/40 hover:bg-muted rounded-xl p-4 text-left transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <School className="h-4 w-4 text-primary" />
                <p className="text-xs text-muted-foreground">Active Classes</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {loading.classes ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  classCount ?? '—'
                )}
              </p>
            </button>
            <button
              onClick={() => handleNavigate('institute-subjects')}
              className="bg-muted/40 hover:bg-muted rounded-xl p-4 text-left transition-colors group"
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4 text-orange-500" />
                <p className="text-xs text-muted-foreground">{subjectLabel}s</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {loading.subjects ? (
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                ) : (
                  subjectCount ?? '—'
                )}
              </p>
            </button>
          </div>
          {/* Quick nav */}
          <div className="flex gap-2">
            <button
              onClick={() => handleNavigate('select-class')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-xs font-medium text-primary"
            >
              <School className="h-3.5 w-3.5" />
              Go to Class
            </button>
            <button
              onClick={() => handleNavigate('select-subject')}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors text-xs font-medium text-primary"
            >
              <BookOpen className="h-3.5 w-3.5" />
              Go to {subjectLabel}
            </button>
          </div>
        </div>

        {/* Daily Attendance Card - Pie Chart */}
        <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/10">
                <UserCheck className="h-5 w-5 text-emerald-500" />
              </div>
              <h3 className="font-semibold text-foreground">
                {userRole === 'Student' ? 'My Attendance' : 'Daily Attendance'}
              </h3>
            </div>
          </div>

          {loading.attendance ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : attendanceSummary ? (
            <>
              {/* Mini Pie Chart */}
              <div className="flex items-center gap-4">
                <div className="w-28 h-28 relative shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(() => {
                          const p = attendanceSummary.totalPresent || 0;
                          const a = attendanceSummary.totalAbsent || 0;
                          const l = attendanceSummary.totalLate || 0;
                          const total = p + a + l;
                          if (total === 0) return [{ name: 'No Data', value: 1, color: 'hsl(var(--muted))' }];
                          return [
                            { name: 'Present', value: p, color: 'hsl(142 71% 45%)' },
                            { name: 'Absent', value: a, color: 'hsl(var(--destructive))' },
                            { name: 'Late', value: l, color: 'hsl(45 93% 47%)' },
                          ].filter(d => d.value > 0);
                        })()}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={48}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="hsl(var(--card))"
                      >
                        {(() => {
                          const p = attendanceSummary.totalPresent || 0;
                          const a = attendanceSummary.totalAbsent || 0;
                          const l = attendanceSummary.totalLate || 0;
                          const total = p + a + l;
                          if (total === 0) return <Cell fill="hsl(var(--muted))" />;
                          return [
                            { name: 'Present', value: p, color: 'hsl(142 71% 45%)' },
                            { name: 'Absent', value: a, color: 'hsl(var(--destructive))' },
                            { name: 'Late', value: l, color: 'hsl(45 93% 47%)' },
                          ].filter(d => d.value > 0).map((entry, i) => (
                            <Cell key={i} fill={entry.color} />
                          ));
                        })()}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-foreground">
                      {attendanceRate != null ? `${attendanceRate}%` : '—'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(142 71% 45%)' }} />
                    <span className="text-xs text-muted-foreground flex-1">Present</span>
                    <span className="text-sm font-semibold text-foreground">{attendanceSummary.totalPresent || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                    <span className="text-xs text-muted-foreground flex-1">Absent</span>
                    <span className="text-sm font-semibold text-foreground">{attendanceSummary.totalAbsent || 0}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'hsl(45 93% 47%)' }} />
                    <span className="text-xs text-muted-foreground flex-1">Late</span>
                    <span className="text-sm font-semibold text-foreground">{attendanceSummary.totalLate || 0}</span>
                  </div>
                  {attendanceDiff != null && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${
                      attendanceDiff >= 0 ? 'text-emerald-500' : 'text-destructive'
                    }`}>
                      {attendanceDiff >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {attendanceDiff > 0 ? '+' : ''}{attendanceDiff}% vs last week
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-6">No data today</p>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={() => handleNavigate(userRole === 'Student' ? 'my-attendance' : 'daily-attendance')}
              className="flex-1 text-center text-xs text-primary font-medium hover:underline py-1"
            >
              View Details
            </button>
            {userRole !== 'Student' && (
              <button
                onClick={() => handleNavigate('qr-attendance')}
                className="flex-1 text-center text-xs text-primary font-medium hover:underline py-1"
              >
                QR Mark
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions + Messages side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quick Actions */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => handleNavigate(action.id)}
                className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                    <action.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-medium text-foreground truncate">{action.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto shrink-0 group-hover:text-primary transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        {(userRole === 'InstituteAdmin' || userRole === 'Teacher') && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Messages
            </h2>
            <div className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/10">
                  <MessageSquare className="h-5 w-5 text-violet-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">SMS Notifications</h3>
                  <p className="text-xs text-muted-foreground">Send to students & parents</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleNavigate('sms')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 transition-colors text-xs font-medium text-violet-600 dark:text-violet-400"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Send SMS
                </button>
                <button
                  onClick={() => handleNavigate('sms-history')}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-xs font-medium text-foreground"
                >
                  SMS History
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DesktopDashboard;
