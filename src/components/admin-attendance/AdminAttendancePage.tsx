import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import AttendanceByUserType from './AttendanceByUserType';
import ClassSubjectDrillDown from './ClassSubjectDrillDown';
import AdminDashboardCharts from './AdminDashboardCharts';
import EnhancedAnalyticsCharts from './EnhancedAnalyticsCharts';
import EventAttendanceView from './EventAttendanceView';
import CalendarDayAttendanceView from './CalendarDayAttendanceView';
import StudentAttendanceLookup from './StudentAttendanceLookup';
import ExportReporting from './ExportReporting';
import AttendanceAlerts from './AttendanceAlerts';
import { cn } from '@/lib/utils';
import {
  TrendingUp, Sparkles, PartyPopper,
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
    label: 'Events',
    tabs: [
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
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <AlertTriangle className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1 text-foreground">No Institute Selected</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Select an institute to load attendance dashboards.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Modern Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">Attendance</h1>
            <p className="text-[11px] sm:text-xs text-muted-foreground">{selectedInstitute?.name || 'Institute'}</p>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="space-y-2">
        {/* Primary Group Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl bg-muted/50 backdrop-blur-sm border border-border/50 overflow-x-auto scrollbar-hide">
          {tabGroups.map((group) => {
            const isGroupActive = group.tabs.some(t => t.id === activeTab);
            const GroupIcon = group.tabs[0].icon;
            return (
              <button
                key={group.label}
                onClick={() => handleTabChange(group.tabs[0].id)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 min-w-fit',
                  isGroupActive
                    ? 'bg-card text-foreground shadow-md border border-border/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                )}
              >
                <GroupIcon className={cn('h-4 w-4 shrink-0 transition-colors', isGroupActive && 'text-primary')} />
                <span className={cn('transition-all duration-200', isGroupActive ? 'inline' : 'hidden sm:inline')}>
                  {group.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary Sub-Tabs */}
        {activeGroup && activeGroup.tabs.length > 1 && (
          <div className="flex gap-1 p-0.5 rounded-xl bg-muted/30 border border-border/30 overflow-x-auto scrollbar-hide">
            {activeGroup.tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-medium transition-all duration-300 min-w-fit',
                    isActive
                      ? 'bg-card text-foreground shadow-sm border border-border/40'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5 shrink-0', isActive && 'text-primary')} />
                  <span className={cn('transition-all duration-200', isActive ? 'inline' : 'hidden sm:inline')}>
                    {tab.label}
                  </span>
                  {isActive && <span className="text-[10px] text-muted-foreground hidden md:inline ml-0.5">— {tab.description}</span>}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {visitedTabs.has('analytics') && <div style={{ display: activeTab === 'analytics' ? 'block' : 'none' }}><AdminDashboardCharts /></div>}
        {visitedTabs.has('advanced') && <div style={{ display: activeTab === 'advanced' ? 'block' : 'none' }}><EnhancedAnalyticsCharts /></div>}
        {visitedTabs.has('events') && <div style={{ display: activeTab === 'events' ? 'block' : 'none' }}><EventAttendanceView /></div>}
        {visitedTabs.has('day-view') && <div style={{ display: activeTab === 'day-view' ? 'block' : 'none' }}><CalendarDayAttendanceView /></div>}
        {visitedTabs.has('user-types') && <div style={{ display: activeTab === 'user-types' ? 'block' : 'none' }}><AttendanceByUserType /></div>}
        {visitedTabs.has('drill-down') && <div style={{ display: activeTab === 'drill-down' ? 'block' : 'none' }}><ClassSubjectDrillDown /></div>}
        {visitedTabs.has('student') && <div style={{ display: activeTab === 'student' ? 'block' : 'none' }}><StudentAttendanceLookup /></div>}
        {visitedTabs.has('export') && <div style={{ display: activeTab === 'export' ? 'block' : 'none' }}><ExportReporting /></div>}
        {visitedTabs.has('alerts') && <div style={{ display: activeTab === 'alerts' ? 'block' : 'none' }}><AttendanceAlerts /></div>}
      </div>
    </div>
  );
};

export default AdminAttendancePage;
