import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import adminAttendanceApi, { AdminAttendanceRecord } from '@/api/adminAttendance.api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';

function toSriLankaTime(isoStr: string): string {
  try {
    return new Date(isoStr).toLocaleString('en-LK', { timeZone: 'Asia/Colombo' });
  } catch { return isoStr; }
}

function exportToCSV(records: any[], filename: string) {
  const headers = ['Date', 'Student Name', 'Student ID', 'Class', 'Subject', 'Status', 'Marked At', 'Marking Method'];
  const rows = records.map(r => [
    r.date || r.markedAt?.split('T')[0] || '',
    r.studentName || r.userName || '',
    r.studentId || r.userId || '',
    r.className || '',
    r.subjectName || '',
    r.status || '',
    r.markedAt ? toSriLankaTime(r.markedAt) : '',
    r.markingMethod || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function buildPrintTable(records: AdminAttendanceRecord[]): string {
  const rows = records.map((r, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${r.date || r.markedAt?.split('T')[0] || '—'}</td>
      <td>${r.studentName || r.userName || '—'}</td>
      <td>${r.studentId || r.userId || '—'}</td>
      <td>${r.className || '—'}</td>
      <td>${r.subjectName || '—'}</td>
      <td>${r.status || '—'}</td>
      <td>${r.markedAt ? toSriLankaTime(r.markedAt) : '—'}</td>
      <td>${r.markingMethod || '—'}</td>
    </tr>
  `).join('');

  return `
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Student</th>
          <th>Student ID</th>
          <th>Class</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Marked At</th>
          <th>Method</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

const ExportReporting: React.FC = () => {
  const { currentInstituteId, selectedInstitute } = useAuth();
  const [exportType, setExportType] = useState('institute');
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [reportRecords, setReportRecords] = useState<AdminAttendanceRecord[]>([]);

  const handleExport = useCallback(async () => {
    if (!currentInstituteId) return;
    setLoading(true);
    try {
      const records = await adminAttendanceApi.getInstituteAttendanceRange(
        currentInstituteId,
        startDate,
        endDate
      );

      if (!records || records.length === 0) {
        toast.error('No records found for the selected date range');
        setReportRecords([]);
        return;
      }

      setReportRecords(records);
      const instituteName = selectedInstitute?.name?.replace(/\s+/g, '_') || 'institute';
      exportToCSV(records, `attendance_${instituteName}`);
      toast.success(`Exported ${records.length} records`);
    } catch (e: any) {
      toast.error(e.message || 'Export failed');
    } finally {
      setLoading(false);
    }
  }, [currentInstituteId, startDate, endDate, selectedInstitute]);

  const handlePrint = useCallback(() => {
    if (reportRecords.length === 0) {
      toast.error('No report data to print. Please export first.');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const reportHtml = buildPrintTable(reportRecords);
    printWindow.document.write(`
      <html>
        <head>
          <title>Attendance Report — ${selectedInstitute?.name || 'Institute'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            h2 { font-size: 14px; color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: 600; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <h1>Attendance Report — ${selectedInstitute?.name || 'Institute'}</h1>
          <h2>Date Range: ${startDate} — ${endDate}</h2>
          ${reportHtml}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }, [reportRecords, selectedInstitute, startDate, endDate]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          Export & Reporting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Export Type</Label>
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="institute" className="text-xs">Institute-wide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Start Date</Label>
            <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="text-xs" />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="text-xs" />
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={handleExport} disabled={loading}>
            <Download className="h-3 w-3 mr-1" />
            {loading ? 'Exporting...' : 'Export CSV'}
          </Button>
          <Button size="sm" variant="outline" onClick={handlePrint}>
            <Printer className="h-3 w-3 mr-1" />
            Print Report
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          CSV export includes: Date, Student Name, Student ID, Class, Subject, Status, Marked At, Marking Method.
          For large date ranges, the system will automatically split into 5-day windows.
        </p>
      </CardContent>
    </Card>
  );
};

export default ExportReporting;
