import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import AttendanceByUserType from './AttendanceByUserType';
import ClassSubjectDrillDown from './ClassSubjectDrillDown';
import AdminDashboardCharts from './AdminDashboardCharts';
import EnhancedAnalyticsCharts from './EnhancedAnalyticsCharts';
import CalendarAttendanceOverlay from './CalendarAttendanceOverlay';
import EventAttendanceView from './EventAttendanceView';
import CalendarDayAttendanceView from './CalendarDayAttendanceView';
import StudentAttendanceLookup from './StudentAttendanceLookup';
import ExportReporting from './ExportReporting';
import AttendanceAlerts from './AttendanceAlerts';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Sparkles, CalendarDays, PartyPopper,
  Eye, Users, GitBranch, GraduationCap, Download,
  Bell, AlertTriangle, Activity
} from 'lucide-react';

const tabGroups = [
  {
    label: 'Analytics',
    tabs: [
      { id: 'analytics', label: 'Analytics', icon: TrendingUp, description: 'Charts & trends' },
      { id: 'advanced', label: 'Advanced', icon: Sparkles, description: 'Deep analytics' },
    ],
  },
  {
    label: 'Calendar',
    tabs: [
      { id: 'calendar', label: 'Calendar', icon: CalendarDays, description: 'Calendar overlay' },
      { id: 'events', label: 'Events', icon: PartyPopper, description: 'Event attendance' },
      { id: 'day-view', label: 'Day View', icon: Eye, description: 'Daily breakdown' },
    ],
  },
  {
    label: 'Drilldowns',
    tabs: [
      { id: 'user-types', label: 'By Type', icon: Users, description: 'User type breakdown' },
      { id: 'drill-down', label: 'Drill-Down', icon: GitBranch, description: 'Class & subject' },
      { id: 'student', label: 'Student', icon: GraduationCap, description: 'Student lookup' },
    ],
  },
  {
    label: 'Tools',
    tabs: [
      { id: 'export', label: 'Export', icon: Download, description: 'Reports & export' },
      { id: 'alerts', label: 'Alerts', icon: Bell, description: 'Alert configuration' },
    ],
  },
];

const allTabs = tabGroups.flatMap(g => g.tabs);

const AdminAttendancePage: React.FC = () => {
  const { currentInstituteId, selectedInstitute } = useAuth();
  const [activeTab, setActiveTab] = useState('analytics');
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(['analytics']));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setVisitedTabs(prev => {
      if (prev.has(tabId)) return prev;
      const next = new Set(prev);
      next.add(tabId);
      return next;
    });
  };

  const activeGroup = tabGroups.find(g => g.tabs.some(t => t.id === activeTab));

  if (!currentInstituteId) {
    return (
      <Card className="border-dashed border-border">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold mb-1">No Institute Selected</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select an institute to load admin attendance dashboards.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">Attendance Monitoring</h1>
              <p className="text-xs text-muted-foreground">{selectedInstitute?.name || 'Institute'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Tab Navigation */}
      <div className="space-y-2">
        <div className="flex items-center rounded-2xl border border-border bg-muted/40 p-1 gap-0.5 overflow-x-auto scrollbar-hide w-full">
          {tabGroups.map((group) => {
            const isGroupActive = group.tabs.some(t => t.id === activeTab);
            const GroupIcon = group.tabs[0].icon;
            return (
              <button
                key={group.label}
                onClick={() => handleTabChange(group.tabs[0].id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200',
                  isGroupActive
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <GroupIcon className="h-4 w-4 shrink-0" />
                <span className={cn('transition-all duration-200', isGroupActive ? 'inline' : 'hidden sm:inline')}>
                  {group.label}
                </span>
              </button>
            );
          })}
        </div>

        {activeGroup && (
          <div className="flex items-center rounded-2xl border border-border bg-muted/40 p-1 gap-0.5 overflow-x-auto scrollbar-hide w-full">
            {activeGroup.tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200',
                    isActive
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span className={cn('transition-all duration-200', isActive ? 'inline' : 'hidden sm:inline')}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Keep visited tabs mounted but hidden to prevent re-fetching APIs */}
      {visitedTabs.has('analytics') && <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}><AdminDashboardCharts /></div>}
      {visitedTabs.has('advanced') && <div style={{ display: activeTab === 'advanced' ? 'block' : 'none' }}><EnhancedAnalyticsCharts /></div>}
      {visitedTabs.has('calendar') && <div style={{ display: activeTab === 'calendar' ? 'block' : 'none' }}><CalendarAttendanceOverlay /></div>}
      {visitedTabs.has('events') && <div style={{ display: activeTab === 'events' ? 'block' : 'none' }}><EventAttendanceView /></div>}
      {visitedTabs.has('day-view') && <div style={{ display: activeTab === 'day-view' ? 'block' : 'none' }}><CalendarDayAttendanceView /></div>}
      {visitedTabs.has('user-types') && <div style={{ display: activeTab === 'user-types' ? 'block' : 'none' }}><AttendanceByUserType /></div>}
      {visitedTabs.has('drill-down') && <div style={{ display: activeTab === 'drill-down' ? 'block' : 'none' }}><ClassSubjectDrillDown /></div>}
      {visitedTabs.has('student') && <div style={{ display: activeTab === 'student' ? 'block' : 'none' }}><StudentAttendanceLookup /></div>}
      {visitedTabs.has('export') && <div style={{ display: activeTab === 'export' ? 'block' : 'none' }}><ExportReporting /></div>}
      {visitedTabs.has('alerts') && <div style={{ display: activeTab === 'alerts' ? 'block' : 'none' }}><AttendanceAlerts /></div>}
    </div>
  );
};

export default AdminAttendancePage;

