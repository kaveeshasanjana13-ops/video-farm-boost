import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import adminAttendanceApi, { AdminAttendanceRecord } from '@/api/adminAttendance.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Search, User, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const CHART_COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

const StudentAttendanceLookup: React.FC = () => {
  const { currentInstituteId } = useAuth();
  const [studentId, setStudentId] = useState('');
  const [records, setRecords] = useState<AdminAttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setMonth(d.getMonth() - 3);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchStudentAttendance = useCallback(async (targetPage: number) => {
    if (!currentInstituteId || !studentId.trim()) return;

    setLoading(true);
    try {
      const res = await adminAttendanceApi.getStudentAttendance(studentId.trim(), {
        instituteId: currentInstituteId,
        startDate,
        endDate,
        page: targetPage,
        limit: 50,
      });
      setRecords(res?.data || []);
      setTotalPages(res?.pagination?.totalPages || 1);
    } catch (e: any) {
      toast.error(e.message || 'Failed to look up student');
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, studentId, startDate, endDate]);

  const searchStudent = useCallback(async () => {
    if (!currentInstituteId || !studentId.trim()) {
      toast.error('Please enter a student ID');
      return;
    }

    setHasSearched(true);
    setPage(1);
    await fetchStudentAttendance(1);
  }, [currentInstituteId, studentId, fetchStudentAttendance]);

  useEffect(() => {
    if (!hasSearched || page === 1) return;
    fetchStudentAttendance(page);
  }, [hasSearched, page, fetchStudentAttendance]);

  const stats = React.useMemo(() => {
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const left = records.filter(r => ['left', 'left_early', 'left_lately'].includes(r.status)).length;
    const total = records.length;
    const rate = total > 0 ? Math.round((present / total) * 1000) / 10 : 0;
    return { present, absent, late, left, total, rate };
  }, [records]);

  const pieData = [
    { name: 'Present', value: stats.present },
    { name: 'Absent', value: stats.absent },
    { name: 'Late', value: stats.late },
    { name: 'Left', value: stats.left },
  ].filter(d => d.value > 0);

  // Monthly trend
  const monthlyTrend = React.useMemo(() => {
    const byMonth = new Map<string, { present: number; total: number }>();
    for (const r of records) {
      const d = r.date || r.markedAt?.split('T')[0] || '';
      const monthKey = d.substring(0, 7);
      if (!byMonth.has(monthKey)) byMonth.set(monthKey, { present: 0, total: 0 });
      const s = byMonth.get(monthKey)!;
      s.total++;
      if (r.status === 'present') s.present++;
    }
    return Array.from(byMonth.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, val]) => ({
        month: new Date(key + '-01').toLocaleString('en-US', { month: 'short' }),
        rate: val.total > 0 ? Math.round((val.present / val.total) * 1000) / 10 : 0,
      }));
  }, [records]);

  const studentName = records.length > 0 ? (records[0].studentName || records[0].userName || studentId) : '';

  const statusIcon = (s: string) => {
    switch (s) { case 'present': return '✅'; case 'absent': return '❌'; case 'late': return '⏰'; default: return '→'; }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Student Attendance Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <Label className="text-xs">Student ID</Label>
              <Input
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="Enter student ID"
                className="text-xs"
                onKeyDown={e => e.key === 'Enter' && searchStudent()}
              />
            </div>
            <div>
              <Label className="text-xs">From</Label>
              <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-xs" />
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-xs" />
            </div>
            <div className="flex items-end">
              <Button size="sm" onClick={searchStudent} disabled={loading} className="w-full">
                <Search className="h-3 w-3 mr-1" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {records.length > 0 && (
        <>
          {/* Student Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <User className="h-4 w-4" />
                {studentName}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Donut */}
                <div className="w-40 h-40">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value">
                        {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center -mt-[100px]">
                    <div className="text-xl font-bold">{stats.rate}%</div>
                    <div className="text-[10px] text-muted-foreground">rate</div>
                  </div>
                  <div className="h-[60px]" />
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="text-center p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded">
                    <div className="text-lg font-bold text-emerald-600">{stats.present}</div>
                    <div className="text-xs text-muted-foreground">Present</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-lg font-bold text-red-500">{stats.absent}</div>
                    <div className="text-xs text-muted-foreground">Absent</div>
                  </div>
                  <div className="text-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded">
                    <div className="text-lg font-bold text-amber-600">{stats.late}</div>
                    <div className="text-xs text-muted-foreground">Late</div>
                  </div>
                  <div className="text-center p-2 bg-muted rounded">
                    <div className="text-lg font-bold">{stats.total}</div>
                    <div className="text-xs text-muted-foreground">Total</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          {monthlyTrend.length > 1 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                    <Tooltip formatter={(v: number) => `${v}%`} />
                    <Line type="monotone" dataKey="rate" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Records Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-xs">Date</TableHead>
                      <TableHead className="text-xs text-center">Status</TableHead>
                      <TableHead className="text-xs">Class</TableHead>
                      <TableHead className="text-xs">Subject</TableHead>
                      <TableHead className="text-xs">Method</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((r, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-xs">
                          {new Date(r.date || r.markedAt?.split('T')[0] || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </TableCell>
                        <TableCell className="text-xs text-center">{statusIcon(r.status)} {r.status}</TableCell>
                        <TableCell className="text-xs">{r.className || '—'}</TableCell>
                        <TableCell className="text-xs">{r.subjectName || '—'}</TableCell>
                        <TableCell className="text-xs">{r.markingMethod || '—'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</Button>
                  <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default StudentAttendanceLookup;
