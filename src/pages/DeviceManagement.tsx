import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { systemAdminDeviceApi, instituteDeviceApi } from '@/api/deviceManagement.api';
import type {
  AttendanceDevice,
  DeviceConfig,
  DeviceEventBinding,
  DeviceSession,
  DeviceAuditEntry,
  DeviceDetail,
  DeviceStats,
  DeviceType,
  DeviceStatus,
  DeviceAuditAction,
  RegisterDevicePayload,
  UpdateDeviceConfigPayload,
  BindEventPayload,
  ALL_DEVICE_TYPES,
  ALL_DEVICE_STATUSES,
  DEVICE_TYPE_CONFIG,
  DEVICE_STATUS_CONFIG,
} from '@/types/device.types';
import {
  ALL_DEVICE_TYPES as DEVICE_TYPES,
  ALL_DEVICE_STATUSES as DEVICE_STATUSES,
  DEVICE_TYPE_CONFIG as TYPE_CONFIG,
  DEVICE_STATUS_CONFIG as STATUS_CONFIG,
  ALL_ALLOWED_STATUS_MODES,
} from '@/types/device.types';
import {
  Plus, RefreshCw, Search, Settings2, Tablet, Shield, ShieldOff,
  Power, PowerOff, Link, Unlink, Play, Square, Clock, FileText,
  Activity, ChevronRight, AlertTriangle, Trash2, Building2, ArrowLeftRight,
} from 'lucide-react';


// ── Helpers ──────────────────────────────────────────────────

function StatusBadge({ status }: { status: DeviceStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={`${cfg.bgColor} ${cfg.color} border`}>
      {cfg.label}
    </Badge>
  );
}

function TypeIcon({ type }: { type: DeviceType }) {
  const cfg = TYPE_CONFIG[type];
  return <span title={cfg.label}>{cfg.icon}</span>;
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleString();
}

// ══════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════

const DeviceManagement = () => {
  const { user, selectedInstitute } = useAuth();
  const userRole = useInstituteRole();
  const { toast } = useToast();

  const normalizedBaseRole = `${user?.role || user?.userType || ''}`.toUpperCase();
  const isSystemAdmin = ['SYSTEMADMIN', 'SYSTEM_ADMIN', 'SUPERADMIN', 'SUPER_ADMIN'].includes(normalizedBaseRole);
  const instituteId = selectedInstitute?.id;

  const [devices, setDevices] = useState<AttendanceDevice[]>([]);
  const [stats, setStats] = useState<DeviceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Detail view
  const [selectedDevice, setSelectedDevice] = useState<DeviceDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('info');

  // Dialogs
  const [registerOpen, setRegisterOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [bindOpen, setBindOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);

  // Detail sub-data
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [deviceAudit, setDeviceAudit] = useState<DeviceAuditEntry[]>([]);
  const [deviceBindings, setDeviceBindings] = useState<DeviceEventBinding[]>([]);
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | null>(null);

  // ── Load Devices ──────────────────────────────────────────

  const loadDevices = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: 20 };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.deviceType = typeFilter;

      let res;
      if (isSystemAdmin) {
        res = await systemAdminDeviceApi.list(params);
      } else if (instituteId) {
        res = await instituteDeviceApi.list(instituteId, params);
      } else {
        setLoading(false);
        return;
      }

      setDevices(res.data || []);
      setTotalPages(res.pagination?.totalPages || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to load devices', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, typeFilter, isSystemAdmin, instituteId]);

  const loadStats = useCallback(async () => {
    if (!isSystemAdmin) return;
    try {
      const s = await systemAdminDeviceApi.getStats();
      setStats(s);
    } catch { /* silent */ }
  }, [isSystemAdmin]);

  useEffect(() => { loadDevices(); }, [loadDevices]);
  useEffect(() => { loadStats(); }, [loadStats]);

  // ── Open Detail ───────────────────────────────────────────

  const openDetail = async (device: AttendanceDevice) => {
    try {
      let detail: DeviceDetail;
      if (isSystemAdmin) {
        detail = await systemAdminDeviceApi.getDetail(device.id);
      } else {
        detail = await instituteDeviceApi.getDetail(instituteId!, device.id);
      }
      setSelectedDevice(detail);
      setDeviceConfig(detail.config);
      setDetailTab('info');
      setDetailOpen(true);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // ── Load Detail Sub-data ──────────────────────────────────

  const loadSessions = async (deviceId: string) => {
    try {
      const s = isSystemAdmin
        ? await systemAdminDeviceApi.getSessions(deviceId)
        : await instituteDeviceApi.listSessions(instituteId!, deviceId);
      setDeviceSessions(Array.isArray(s) ? s : []);
    } catch { setDeviceSessions([]); }
  };

  const loadAudit = async (deviceId: string) => {
    try {
      const a = isSystemAdmin
        ? await systemAdminDeviceApi.getAudit(deviceId)
        : await instituteDeviceApi.getAudit(instituteId!, deviceId);
      setDeviceAudit(Array.isArray(a) ? a : []);
    } catch { setDeviceAudit([]); }
  };

  const loadBindings = async (deviceId: string) => {
    try {
      const b = isSystemAdmin
        ? await systemAdminDeviceApi.getBindings(deviceId)
        : await instituteDeviceApi.getBindings(instituteId!, deviceId);
      setDeviceBindings(Array.isArray(b) ? b : []);
    } catch { setDeviceBindings([]); }
  };

  useEffect(() => {
    if (!selectedDevice) return;
    const id = selectedDevice.device.id;
    if (detailTab === 'sessions') loadSessions(id);
    if (detailTab === 'audit') loadAudit(id);
    if (detailTab === 'bindings') loadBindings(id);
  }, [detailTab, selectedDevice]);

  // ── Actions ───────────────────────────────────────────────

  const toggleEnable = async (device: AttendanceDevice) => {
    try {
      if (device.isEnabled) {
        isSystemAdmin
          ? await systemAdminDeviceApi.disable(device.id)
          : await instituteDeviceApi.disable(instituteId!, device.id);
        toast({ title: 'Device disabled' });
      } else {
        isSystemAdmin
          ? await systemAdminDeviceApi.enable(device.id)
          : await instituteDeviceApi.enable(instituteId!, device.id);
        toast({ title: 'Device enabled' });
      }
      loadDevices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleBlock = async (deviceId: string, reason: string) => {
    try {
      await systemAdminDeviceApi.block(deviceId, reason);
      toast({ title: 'Device blocked' });
      setBlockOpen(false);
      loadDevices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUnblock = async (deviceId: string) => {
    try {
      await systemAdminDeviceApi.unblock(deviceId);
      toast({ title: 'Device unblocked' });
      loadDevices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (deviceId: string) => {
    if (!confirm('Delete this device? This cannot be undone.')) return;
    try {
      await systemAdminDeviceApi.delete(deviceId);
      toast({ title: 'Device deleted' });
      setDetailOpen(false);
      loadDevices();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleUnbindEvent = async (deviceId: string) => {
    try {
      if (isSystemAdmin) {
        await systemAdminDeviceApi.unbindEvent(deviceId);
      } else {
        await instituteDeviceApi.unbindEvent(instituteId!, deviceId);
      }
      toast({ title: 'Event unbound' });
      // Refresh detail
      if (selectedDevice) openDetail(selectedDevice.device);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  const handleEndSession = async (deviceId: string, token: string) => {
    try {
      if (isSystemAdmin) {
        // System admin doesn't have end session — use institute route
      }
      await instituteDeviceApi.endSession(instituteId!, deviceId, token);
      toast({ title: 'Session ended' });
      loadSessions(deviceId);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
  };

  // ══════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════

  return (
      <div className="container max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Device Management</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSystemAdmin ? 'Manage all attendance devices across institutes' : 'Manage your institute\'s attendance devices'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { loadDevices(); loadStats(); }}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {isSystemAdmin && (
              <Button size="sm" onClick={() => setRegisterOpen(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Register Device
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards (System Admin) */}
        {isSystemAdmin && stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Card><CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-foreground">{stats.totalDevices}</p>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-primary">{stats.activeDevices}</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-destructive">{stats.blockedDevices}</p>
              <p className="text-xs text-muted-foreground">Blocked</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-accent-foreground">{stats.unassignedDevices}</p>
              <p className="text-xs text-muted-foreground">Unassigned</p>
            </CardContent></Card>
            <Card><CardContent className="pt-4 pb-3 text-center">
              <p className="text-2xl font-bold text-secondary-foreground">{stats.totalActiveSessions}</p>
              <p className="text-xs text-muted-foreground">Sessions</p>
            </CardContent></Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={v => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {DEVICE_STATUSES.map(s => (
                <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={v => { setTypeFilter(v); setPage(1); }}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {DEVICE_TYPES.map(t => (
                <SelectItem key={t} value={t}>{TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Device List */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : devices.length === 0 ? (
              <div className="text-center py-12">
                <Tablet className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No devices found</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {devices.map(device => (
                  <div
                    key={device.id}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => openDetail(device)}
                  >
                    <div className="text-2xl"><TypeIcon type={device.deviceType} /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-foreground truncate">{device.deviceName}</span>
                        <StatusBadge status={device.status} />
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 space-x-3">
                        <span>UID: {device.deviceUid}</span>
                        {device.instituteName && <span>• {device.instituteName}</span>}
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={e => { e.stopPropagation(); toggleEnable(device); }}
                        title={device.isEnabled ? 'Disable' : 'Enable'}
                      >
                        {device.isEnabled ? <Power className="h-4 w-4 text-primary" /> : <PowerOff className="h-4 w-4 text-muted-foreground" />}
                      </Button>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
            <span className="text-sm text-muted-foreground self-center">Page {page} of {totalPages}</span>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
          </div>
        )}

        {/* ══════ DETAIL DIALOG ══════ */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedDevice && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <TypeIcon type={selectedDevice.device.deviceType} />
                    {selectedDevice.device.deviceName}
                    <StatusBadge status={selectedDevice.device.status} />
                  </DialogTitle>
                  <DialogDescription>UID: {selectedDevice.device.deviceUid}</DialogDescription>
                </DialogHeader>

                <Tabs value={detailTab} onValueChange={setDetailTab}>
                  <TabsList className="w-full grid grid-cols-5">
                    <TabsTrigger value="info">Info</TabsTrigger>
                    <TabsTrigger value="config">Config</TabsTrigger>
                    <TabsTrigger value="bindings">Bindings</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="audit">Audit</TabsTrigger>
                  </TabsList>

                  {/* ── INFO TAB ── */}
                  <TabsContent value="info" className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{TYPE_CONFIG[selectedDevice.device.deviceType].label}</span></div>
                      <div><span className="text-muted-foreground">Status:</span> <StatusBadge status={selectedDevice.device.status} /></div>
                      <div><span className="text-muted-foreground">Institute:</span> <span className="font-medium">{selectedDevice.device.instituteName || 'Unassigned'}</span></div>
                      <div><span className="text-muted-foreground">Enabled:</span> <span className="font-medium">{selectedDevice.device.isEnabled ? 'Yes' : 'No'}</span></div>
                      <div><span className="text-muted-foreground">IP:</span> <span>{selectedDevice.device.ipAddress || '—'}</span></div>
                      <div><span className="text-muted-foreground">Firmware:</span> <span>{selectedDevice.device.firmwareVersion || '—'}</span></div>
                      <div><span className="text-muted-foreground">Last Heartbeat:</span> <span>{fmtDate(selectedDevice.device.lastHeartbeatAt)}</span></div>
                      <div><span className="text-muted-foreground">Last Activity:</span> <span>{fmtDate(selectedDevice.device.lastActivityAt)}</span></div>
                      <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <span>{selectedDevice.device.description || '—'}</span></div>
                      <div><span className="text-muted-foreground">Active Sessions:</span> <span className="font-medium">{selectedDevice.activeSessions}</span></div>
                      <div><span className="text-muted-foreground">Active Binding:</span> <span className="font-medium">{selectedDevice.activeBinding?.eventName || 'None'}</span></div>
                    </div>

                    <Separator />

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => toggleEnable(selectedDevice.device)}>
                        {selectedDevice.device.isEnabled ? <><PowerOff className="h-3.5 w-3.5 mr-1" /> Disable</> : <><Power className="h-3.5 w-3.5 mr-1" /> Enable</>}
                      </Button>
                      {selectedDevice.activeBinding ? (
                        <Button variant="outline" size="sm" onClick={() => handleUnbindEvent(selectedDevice.device.id)}>
                          <Unlink className="h-3.5 w-3.5 mr-1" /> Unbind Event
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" onClick={() => setBindOpen(true)}>
                          <Link className="h-3.5 w-3.5 mr-1" /> Bind Event
                        </Button>
                      )}
                      {isSystemAdmin && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => setAssignOpen(true)}>
                            <Building2 className="h-3.5 w-3.5 mr-1" /> {selectedDevice.device.instituteId ? 'Change Institute' : 'Assign'}
                          </Button>
                          {selectedDevice.device.status === 'BLOCKED' ? (
                            <Button variant="outline" size="sm" onClick={() => handleUnblock(selectedDevice.device.id)}>
                              <ShieldOff className="h-3.5 w-3.5 mr-1" /> Unblock
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" className="text-destructive" onClick={() => setBlockOpen(true)}>
                              <Shield className="h-3.5 w-3.5 mr-1" /> Block
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedDevice.device.id)}>
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" onClick={() => { setDeviceConfig(selectedDevice.config); setConfigOpen(true); }}>
                        <Settings2 className="h-3.5 w-3.5 mr-1" /> Config
                      </Button>
                    </div>
                  </TabsContent>

                  {/* ── CONFIG TAB ── */}
                  <TabsContent value="config" className="space-y-3">
                    {deviceConfig && (
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-muted-foreground">Max Sessions:</span> <span className="font-medium">{deviceConfig.maxSessions}</span></div>
                        <div><span className="text-muted-foreground">Rate (min):</span> <span className="font-medium">{deviceConfig.rateLimitPerMinute}/min</span></div>
                        <div><span className="text-muted-foreground">Rate (hr):</span> <span className="font-medium">{deviceConfig.rateLimitPerHour}/hr</span></div>
                        <div><span className="text-muted-foreground">Status Mode:</span> <Badge variant="outline">{deviceConfig.allowedStatusMode}</Badge></div>
                        {deviceConfig.allowedStatusList && (
                          <div className="col-span-2"><span className="text-muted-foreground">Allowed Statuses:</span> <span>{deviceConfig.allowedStatusList.join(', ')}</span></div>
                        )}
                        <div><span className="text-muted-foreground">Auto Status:</span> <span>{deviceConfig.autoStatus || '—'}</span></div>
                        <div><span className="text-muted-foreground">Require Location:</span> <span>{deviceConfig.requireLocation ? 'Yes' : 'No'}</span></div>
                        <div><span className="text-muted-foreground">Require Photo:</span> <span>{deviceConfig.requirePhoto ? 'Yes' : 'No'}</span></div>
                        <div><span className="text-muted-foreground">Operating Hours:</span> <span>{deviceConfig.operatingStartTime || '—'} – {deviceConfig.operatingEndTime || '—'}</span></div>
                        {deviceConfig.allowedIpRanges && (
                          <div className="col-span-2"><span className="text-muted-foreground">IP Ranges:</span> <span>{deviceConfig.allowedIpRanges.join(', ')}</span></div>
                        )}
                      </div>
                    )}
                    <Button size="sm" onClick={() => setConfigOpen(true)}>
                      <Settings2 className="h-3.5 w-3.5 mr-1" /> Edit Config
                    </Button>
                  </TabsContent>

                  {/* ── BINDINGS TAB ── */}
                  <TabsContent value="bindings" className="space-y-2">
                    {deviceBindings.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No binding history</p>
                    ) : (
                      deviceBindings.map(b => (
                        <div key={b.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Link className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{b.eventName || `Event #${b.eventId}`}</span>
                              <Badge variant={b.isActive ? 'default' : 'secondary'} className="text-xs">
                                {b.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Bound: {fmtDate(b.boundAt)} {b.unboundAt && `• Unbound: ${fmtDate(b.unboundAt)}`}
                            </p>
                            {b.statusOverride && <p className="text-xs text-muted-foreground">Override: {b.statusOverride}</p>}
                            {b.notes && <p className="text-xs text-muted-foreground">{b.notes}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>

                  {/* ── SESSIONS TAB ── */}
                  <TabsContent value="sessions" className="space-y-2">
                    {deviceSessions.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No active sessions</p>
                    ) : (
                      deviceSessions.map(s => (
                        <div key={s.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">Session {s.sessionToken.slice(0, 8)}…</div>
                            <p className="text-xs text-muted-foreground">
                              Started: {fmtDate(s.startedAt)} • Marks: {s.marksCount}
                              {s.expiresAt && ` • Expires: ${fmtDate(s.expiresAt)}`}
                            </p>
                          </div>
                          {s.isActive && !isSystemAdmin && (
                            <Button variant="outline" size="sm" onClick={() => handleEndSession(selectedDevice.device.id, s.sessionToken)}>
                              <Square className="h-3.5 w-3.5 mr-1" /> End
                            </Button>
                          )}
                        </div>
                      ))
                    )}
                  </TabsContent>

                  {/* ── AUDIT TAB ── */}
                  <TabsContent value="audit" className="space-y-2">
                    {deviceAudit.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-6">No audit entries</p>
                    ) : (
                      deviceAudit.map(a => (
                        <div key={a.id} className="flex items-start gap-3 p-3 border rounded-lg">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">{a.action}</Badge>
                              <span className="text-xs text-muted-foreground">{fmtDate(a.createdAt)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">By: {a.performedBy}</p>
                            {a.details && (
                              <pre className="text-xs text-muted-foreground mt-1 bg-muted/50 p-2 rounded overflow-x-auto">
                                {JSON.stringify(a.details, null, 2)}
                              </pre>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </TabsContent>
                </Tabs>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* ══════ REGISTER DIALOG ══════ */}
        <RegisterDeviceDialog
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
          onSuccess={() => { setRegisterOpen(false); loadDevices(); loadStats(); }}
        />

        {/* ══════ CONFIG DIALOG ══════ */}
        <ConfigDialog
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          config={deviceConfig}
          deviceId={selectedDevice?.device.id || ''}
          isSystemAdmin={isSystemAdmin}
          instituteId={instituteId}
          onSuccess={() => {
            setConfigOpen(false);
            if (selectedDevice) openDetail(selectedDevice.device);
          }}
        />

        {/* ══════ BIND EVENT DIALOG ══════ */}
        <BindEventDialog
          open={bindOpen}
          onClose={() => setBindOpen(false)}
          deviceId={selectedDevice?.device.id || ''}
          isSystemAdmin={isSystemAdmin}
          instituteId={instituteId}
          onSuccess={() => {
            setBindOpen(false);
            if (selectedDevice) openDetail(selectedDevice.device);
          }}
        />

        {/* ══════ ASSIGN DIALOG ══════ */}
        <AssignDialog
          open={assignOpen}
          onClose={() => setAssignOpen(false)}
          device={selectedDevice?.device || null}
          onSuccess={() => {
            setAssignOpen(false);
            loadDevices();
            if (selectedDevice) openDetail(selectedDevice.device);
          }}
        />

        {/* ══════ BLOCK DIALOG ══════ */}
        <BlockDialog
          open={blockOpen}
          onClose={() => setBlockOpen(false)}
          deviceId={selectedDevice?.device.id || ''}
          onBlock={handleBlock}
        />
      </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SUB-DIALOGS
// ══════════════════════════════════════════════════════════════

function RegisterDeviceDialog({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess: () => void }) {
  const { toast } = useToast();
  const [form, setForm] = useState<RegisterDevicePayload>({ deviceUid: '', deviceName: '', deviceType: 'TABLET' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.deviceUid || !form.deviceName) {
      toast({ title: 'Required', description: 'Device UID and Name are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      await systemAdminDeviceApi.register(form);
      toast({ title: 'Device registered' });
      onSuccess();
      setForm({ deviceUid: '', deviceName: '', deviceType: 'TABLET' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Device</DialogTitle>
          <DialogDescription>Add a new attendance marking device to the system.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Device UID *</Label>
            <Input value={form.deviceUid} onChange={e => setForm(f => ({ ...f, deviceUid: e.target.value }))} placeholder="DEVICE-SN-00129" />
          </div>
          <div>
            <Label>Device Name *</Label>
            <Input value={form.deviceName} onChange={e => setForm(f => ({ ...f, deviceName: e.target.value }))} placeholder="Front Gate Tablet" />
          </div>
          <div>
            <Label>Device Type</Label>
            <Select value={form.deviceType} onValueChange={v => setForm(f => ({ ...f, deviceType: v as DeviceType }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DEVICE_TYPES.map(t => (
                  <SelectItem key={t} value={t}>{TYPE_CONFIG[t].icon} {TYPE_CONFIG[t].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Institute ID (optional)</Label>
            <Input value={form.instituteId || ''} onChange={e => setForm(f => ({ ...f, instituteId: e.target.value || undefined }))} placeholder="109" />
          </div>
          <div>
            <Label>Institute Name</Label>
            <Input value={form.instituteName || ''} onChange={e => setForm(f => ({ ...f, instituteName: e.target.value || undefined }))} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value || undefined }))} placeholder="Samsung Galaxy Tab A8 at main entrance" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Registering...' : 'Register'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfigDialog({ open, onClose, config, deviceId, isSystemAdmin, instituteId, onSuccess }: {
  open: boolean; onClose: () => void; config: DeviceConfig | null; deviceId: string; isSystemAdmin: boolean; instituteId?: string; onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<UpdateDeviceConfigPayload>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (config) {
      setForm({
        maxSessions: config.maxSessions,
        rateLimitPerMinute: config.rateLimitPerMinute,
        rateLimitPerHour: config.rateLimitPerHour,
        allowedStatusMode: config.allowedStatusMode,
        allowedStatusList: config.allowedStatusList || undefined,
        autoStatus: config.autoStatus || undefined,
        requireLocation: !!config.requireLocation,
        requirePhoto: !!config.requirePhoto,
        operatingStartTime: config.operatingStartTime || undefined,
        operatingEndTime: config.operatingEndTime || undefined,
      });
    }
  }, [config]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isSystemAdmin) {
        await systemAdminDeviceApi.updateConfig(deviceId, form);
      } else {
        const { maxSessions, rateLimitPerMinute, rateLimitPerHour, allowedIpRanges, ...allowed } = form;
        await instituteDeviceApi.updateConfig(instituteId!, deviceId, allowed);
      }
      toast({ title: 'Config updated' });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Device Configuration</DialogTitle>
          <DialogDescription>Update device operating parameters.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {isSystemAdmin && (
            <>
              <div>
                <Label>Max Sessions (1-10)</Label>
                <Input type="number" min={1} max={10} value={form.maxSessions || ''} onChange={e => setForm(f => ({ ...f, maxSessions: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Rate Limit / Minute</Label>
                <Input type="number" min={1} max={200} value={form.rateLimitPerMinute || ''} onChange={e => setForm(f => ({ ...f, rateLimitPerMinute: Number(e.target.value) }))} />
              </div>
              <div>
                <Label>Rate Limit / Hour</Label>
                <Input type="number" min={1} max={5000} value={form.rateLimitPerHour || ''} onChange={e => setForm(f => ({ ...f, rateLimitPerHour: Number(e.target.value) }))} />
              </div>
            </>
          )}
          <div>
            <Label>Allowed Status Mode</Label>
            <Select value={form.allowedStatusMode || 'ANY'} onValueChange={v => setForm(f => ({ ...f, allowedStatusMode: v as any }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {ALL_ALLOWED_STATUS_MODES.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.allowedStatusMode === 'ONLY' && (
            <div>
              <Label>Allowed Statuses (comma-separated)</Label>
              <Input
                value={(form.allowedStatusList || []).join(', ')}
                onChange={e => setForm(f => ({ ...f, allowedStatusList: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))}
                placeholder="present, late"
              />
            </div>
          )}
          <div>
            <Label>Auto Status</Label>
            <Input value={form.autoStatus || ''} onChange={e => setForm(f => ({ ...f, autoStatus: e.target.value || undefined }))} placeholder="present" />
          </div>
          <div className="flex items-center justify-between">
            <Label>Require Location</Label>
            <Switch checked={!!form.requireLocation} onCheckedChange={v => setForm(f => ({ ...f, requireLocation: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label>Require Photo</Label>
            <Switch checked={!!form.requirePhoto} onCheckedChange={v => setForm(f => ({ ...f, requirePhoto: v }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Operating Start</Label>
              <Input type="time" value={form.operatingStartTime || ''} onChange={e => setForm(f => ({ ...f, operatingStartTime: e.target.value || undefined }))} />
            </div>
            <div>
              <Label>Operating End</Label>
              <Input type="time" value={form.operatingEndTime || ''} onChange={e => setForm(f => ({ ...f, operatingEndTime: e.target.value || undefined }))} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BindEventDialog({ open, onClose, deviceId, isSystemAdmin, instituteId, onSuccess }: {
  open: boolean; onClose: () => void; deviceId: string; isSystemAdmin: boolean; instituteId?: string; onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [form, setForm] = useState<BindEventPayload>({ eventId: 0 });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.eventId) {
      toast({ title: 'Required', description: 'Event ID is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (isSystemAdmin) {
        await systemAdminDeviceApi.bindEvent(deviceId, form);
      } else {
        await instituteDeviceApi.bindEvent(instituteId!, deviceId, form);
      }
      toast({ title: 'Event bound' });
      onSuccess();
      setForm({ eventId: 0 });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Bind Event to Device</DialogTitle>
          <DialogDescription>Lock this device to a specific calendar event. All attendance marks will auto-tag with this event.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Event ID *</Label>
            <Input type="number" value={form.eventId || ''} onChange={e => setForm(f => ({ ...f, eventId: Number(e.target.value) }))} />
          </div>
          <div>
            <Label>Event Name</Label>
            <Input value={form.eventName || ''} onChange={e => setForm(f => ({ ...f, eventName: e.target.value || undefined }))} placeholder="Parents Meeting" />
          </div>
          <div>
            <Label>Calendar Day ID</Label>
            <Input type="number" value={form.calendarDayId || ''} onChange={e => setForm(f => ({ ...f, calendarDayId: Number(e.target.value) || undefined }))} />
          </div>
          <div>
            <Label>Status Override</Label>
            <Input value={form.statusOverride || ''} onChange={e => setForm(f => ({ ...f, statusOverride: e.target.value || undefined }))} placeholder="present" />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={form.notes || ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value || undefined }))} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Binding...' : 'Bind Event'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AssignDialog({ open, onClose, device, onSuccess }: {
  open: boolean; onClose: () => void; device: AttendanceDevice | null; onSuccess: () => void;
}) {
  const { toast } = useToast();
  const [instId, setInstId] = useState('');
  const [instName, setInstName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!device) return;
    if (!instId) {
      toast({ title: 'Required', description: 'Institute ID is required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      if (device.instituteId) {
        await systemAdminDeviceApi.changeInstitute(device.id, { instituteId: instId, instituteName: instName });
      } else {
        await systemAdminDeviceApi.assign(device.id, { instituteId: instId, instituteName: instName });
      }
      toast({ title: device.instituteId ? 'Institute changed' : 'Device assigned' });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleUnassign = async () => {
    if (!device) return;
    setSaving(true);
    try {
      await systemAdminDeviceApi.unassign(device.id);
      toast({ title: 'Device unassigned' });
      onSuccess();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{device?.instituteId ? 'Change / Unassign Institute' : 'Assign to Institute'}</DialogTitle>
          <DialogDescription>Assign this device to an institute or change its assignment.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Institute ID *</Label>
            <Input value={instId} onChange={e => setInstId(e.target.value)} placeholder="109" />
          </div>
          <div>
            <Label>Institute Name</Label>
            <Input value={instName} onChange={e => setInstName(e.target.value)} placeholder="Suraksha Academy" />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          {device?.instituteId && (
            <Button variant="destructive" size="sm" onClick={handleUnassign} disabled={saving}>
              Unassign
            </Button>
          )}
          <div className="flex-1" />
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function BlockDialog({ open, onClose, deviceId, onBlock }: {
  open: boolean; onClose: () => void; deviceId: string; onBlock: (id: string, reason: string) => void;
}) {
  const [reason, setReason] = useState('');
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" /> Block Device
          </DialogTitle>
          <DialogDescription>Blocked devices cannot mark attendance. This action can be reversed.</DialogDescription>
        </DialogHeader>
        <div>
          <Label>Reason</Label>
          <Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Suspected tampering" />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => onBlock(deviceId, reason)}>Block Device</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeviceManagement;
