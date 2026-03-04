import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import adminAttendanceApi from '@/api/adminAttendance.api';
import { normalizeAttendanceSummary } from '@/types/attendance.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PieChart, Pie, Cell,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, Activity } from 'lucide-react';
import { toast } from 'sonner';

const CHART_COLORS = {
  present: 'hsl(var(--chart-1))',
  absent: 'hsl(var(--chart-2))',
  late: 'hsl(var(--chart-3))',
  left: 'hsl(var(--chart-4))',
};

const AdminDashboardCharts: React.FC = () => {
  const { currentInstituteId } = useAuth();
  const [todayStats, setTodayStats] = useState<{ present: number; absent: number; late: number; left: number; total: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCharts = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      // Load today's data - use summary from response
      const today = new Date().toISOString().split('T')[0];
      const todayRes = await adminAttendanceApi.getInstituteAttendance(
        currentInstituteId,
        { startDate: today, endDate: today, limit: 100 },
        { ttl: 60 }
      );
      
      const todayRecords = todayRes?.data || [];
      const todaySummary = normalizeAttendanceSummary(todayRes?.summary);
      
      if (todayRecords.length > 0) {
        // Use individual records if available
        setTodayStats({
          present: todayRecords.filter(r => r.status === 'present').length,
          absent: todayRecords.filter(r => r.status === 'absent').length,
          late: todayRecords.filter(r => r.status === 'late').length,
          left: todayRecords.filter(r => ['left', 'left_early', 'left_lately'].includes(r.status)).length,
          total: todayRecords.length,
        });
      } else if (todaySummary.totalPresent > 0 || todaySummary.totalAbsent > 0 || todaySummary.totalLate > 0) {
        // Fall back to summary data
        const left = todaySummary.totalLeft + todaySummary.totalLeftEarly + todaySummary.totalLeftLately;
        const total = todaySummary.totalPresent + todaySummary.totalAbsent + todaySummary.totalLate + left;
        setTodayStats({
          present: todaySummary.totalPresent,
          absent: todaySummary.totalAbsent,
          late: todaySummary.totalLate,
          left,
          total,
        });
      } else {
        setTodayStats({ present: 0, absent: 0, late: 0, left: 0, total: 0 });
      }

    } catch (e: any) {
      toast.error(e.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId]);

  useEffect(() => { loadCharts(); }, [loadCharts]);

  const todayRate = todayStats && todayStats.total > 0
    ? Math.round((todayStats.present / todayStats.total) * 1000) / 10
    : 0;

  const pieData = todayStats ? [
    { name: 'Present', value: todayStats.present, color: CHART_COLORS.present },
    { name: 'Absent', value: todayStats.absent, color: CHART_COLORS.absent },
    { name: 'Late', value: todayStats.late, color: CHART_COLORS.late },
    { name: 'Left', value: todayStats.left, color: CHART_COLORS.left },
  ].filter(d => d.value > 0) : [];

  const getHeatColor = (rate: number) => {
    if (rate >= 90) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
    if (rate >= 85) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
    if (rate >= 80) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
  };

  return (
    <div className="w-full">
      <Card className="w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Today's Live Attendance
            </CardTitle>
            <Button variant="outline" size="sm" onClick={loadCharts} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
            </div>
          ) : todayStats && todayStats.total > 0 ? (
            <div className="flex flex-col items-center gap-8 w-full">
              {/* Pie Chart - Bigger */}
              <div className="w-64 h-64 sm:w-72 sm:h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      dataKey="value"
                      labelLine={false}
                    >
                      {pieData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center -mt-[155px] sm:-mt-[165px]">
                  <div className="text-4xl font-bold text-foreground">{todayRate}%</div>
                  <div className="text-sm text-muted-foreground">Attendance</div>
                </div>
                <div className="h-[90px] sm:h-[100px]" />
              </div>

              {/* Stats - Full Width */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div className="p-5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-center">
                  <div className="text-3xl font-bold text-emerald-600">{todayStats.present}</div>
                  <div className="text-sm text-muted-foreground mt-1">Present</div>
                </div>
                <div className="p-5 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
                  <div className="text-3xl font-bold text-red-500">{todayStats.absent}</div>
                  <div className="text-sm text-muted-foreground mt-1">Absent</div>
                </div>
                <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                  <div className="text-3xl font-bold text-amber-600">{todayStats.late}</div>
                  <div className="text-sm text-muted-foreground mt-1">Late</div>
                </div>
                <div className="p-5 rounded-xl bg-muted text-center">
                  <div className="text-3xl font-bold text-foreground">{todayStats.total}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Records</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No attendance data for today</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCharts;
