import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { lectureApi, Lecture } from '@/api/lecture.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, Plus, Edit, Trash2, Play, RefreshCw, BookOpen, ChevronDown, LayoutGrid, Table2 } from 'lucide-react';
import { format } from 'date-fns';
import CreateInstituteLectureForm from '@/components/forms/CreateInstituteLectureForm';
import UpdateInstituteLectureForm from '@/components/forms/UpdateInstituteLectureForm';
import DeleteLectureConfirmDialog from '@/components/forms/DeleteLectureConfirmDialog';
import VideoPreviewDialog from '@/components/VideoPreviewDialog';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useToast } from '@/hooks/use-toast';
import MUITable from '@/components/ui/mui-table';
import { useViewMode } from '@/hooks/useViewMode';
import { EmptyState } from '@/components/ui/EmptyState';

const InstituteLectures = () => {
  const { selectedInstitute, user } = useAuth();
  const effectiveRole = useInstituteRole();
  const { toast } = useToast();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [lectureToDelete, setLectureToDelete] = useState<Lecture | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showRecordingDialog, setShowRecordingDialog] = useState(false);
  const [recordingLecture, setRecordingLecture] = useState<Lecture | null>(null);

  const fetchLectures = async (pageNum: number = 1, forceRefresh: boolean = false) => {
    if (!selectedInstitute?.id) {
      toast({
        title: 'Institutes',
        description: 'Please select an institute first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await lectureApi.getInstituteLectures({
        instituteId: selectedInstitute.id,
        page: pageNum,
        limit: 10,
        userId: user?.id,
        role: effectiveRole
      }, forceRefresh);

      let lecturesData: Lecture[] = [];
      if (Array.isArray(response)) {
        lecturesData = response;
      } else if (response.data && Array.isArray(response.data)) {
        lecturesData = response.data;
      } else if (response && Array.isArray((response as any).lectures)) {
        lecturesData = (response as any).lectures;
      }

      setLectures(lecturesData);
      setTotalPages(Math.ceil(lecturesData.length / 10));
    } catch (error: any) {
      console.error('Error fetching institute lectures:', error);
      toast({
        title: 'Failed to load lectures',
        description: 'Failed to load institute lectures.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInstitute?.id) {
      fetchLectures(1);
    }
  }, [selectedInstitute?.id]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'scheduled': return { label: 'Scheduled', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' };
      case 'ongoing': return { label: 'Live Now', className: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 animate-pulse' };
      case 'completed': return { label: 'Completed', className: 'bg-primary/10 text-primary border-primary/20' };
      case 'cancelled': return { label: 'Cancelled', className: 'bg-destructive/10 text-destructive border-destructive/20' };
      case 'postponed': return { label: 'Postponed', className: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20' };
      default: return { label: status, className: 'bg-muted text-muted-foreground border-border' };
    }
  };

  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return 'Not scheduled';
    return format(new Date(dateString), 'MMM dd, yyyy • HH:mm');
  };

  const handleJoinLecture = (lecture: Lecture) => {
    if (lecture.meetingLink) {
      window.open(lecture.meetingLink, '_blank');
    } else {
      toast({ title: 'Meeting link not available', description: 'This lecture does not have a meeting link.', variant: 'destructive' });
    }
  };

  const handleViewRecording = (lecture: Lecture) => {
    if (lecture.recordingUrl) {
      setRecordingLecture(lecture);
      setShowRecordingDialog(true);
    } else {
      toast({ title: 'Recording not available', description: 'This lecture does not have a recording.', variant: 'destructive' });
    }
  };

  const handleCreateSuccess = async () => { setShowCreateDialog(false); await fetchLectures(page); };
  const handleUpdateSuccess = async () => { setShowUpdateDialog(false); setSelectedLecture(null); await fetchLectures(page); };
  const handleUpdateClick = (lecture: Lecture) => { setSelectedLecture(lecture); setShowUpdateDialog(true); };
  const handleDeleteClick = (lecture: Lecture) => { setLectureToDelete(lecture); setShowDeleteDialog(true); };

  const handleDeleteConfirm = async () => {
    if (!lectureToDelete) return;
    setIsDeleting(true);
    try {
      await lectureApi.deleteInstituteLecturePermanent(lectureToDelete.id, { instituteId: selectedInstitute?.id });
      setLectures(prev => prev.filter(l => l.id !== lectureToDelete.id));
      toast({ title: 'Delete Success', description: `${lectureToDelete.title} has been deleted successfully.`, variant: 'success' });
      setShowDeleteDialog(false);
      setLectureToDelete(null);
    } catch (error: any) {
      console.error('Error deleting lecture:', error);
      toast({ title: 'Delete Failed', description: error?.response?.data?.message || 'Failed to delete lecture.', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const isInstituteAdmin = effectiveRole === 'InstituteAdmin';
  const { viewMode } = useViewMode();
  const [pageViewMode, setPageViewMode] = useState<'card' | 'table'>(viewMode);
  const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);
  const scheduledCount = lectures.filter(l => l.status === 'scheduled').length;
  const ongoingCount = lectures.filter(l => l.status === 'ongoing').length;
  const completedCount = lectures.filter(l => l.status === 'completed').length;

  if (!selectedInstitute) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Institute Lectures</h2>
          <p className="text-sm text-muted-foreground">Please select an institute to view lectures</p>
        </div>
      </div>
    );
  }

  if (!effectiveRole || !['InstituteAdmin', 'Teacher', 'Student'].includes(effectiveRole)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto">
            <BookOpen className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold">Access Denied</h2>
          <p className="text-sm text-muted-foreground">You don't have permission to view institute lectures</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:gap-3">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">Institute Lectures</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
            Manage all lectures for {selectedInstitute.name}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button
            onClick={() => fetchLectures(page, true)}
            disabled={loading}
            variant="outline"
            size="sm"
            className="h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
          >
            <RefreshCw className={`h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button onClick={() => setPageViewMode('card')} className={`p-1.5 transition-colors ${pageViewMode === 'card' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`} title="Card view"><LayoutGrid className="h-4 w-4" /></button>
            <button onClick={() => setPageViewMode('table')} className={`p-1.5 transition-colors ${pageViewMode === 'table' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`} title="Table view"><Table2 className="h-4 w-4" /></button>
          </div>
          {isInstituteAdmin && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3">
                    <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 sm:mr-1.5" />
                    New Lecture
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogTitle className="sr-only">Create Lecture</DialogTitle>
                  <DialogDescription className="sr-only">Form to create a new institute lecture</DialogDescription>
                  <CreateInstituteLectureForm onClose={() => setShowCreateDialog(false)} onSuccess={handleCreateSuccess} />
                </DialogContent>
              </Dialog>
            )}
        </div>
      </div>

      {/* Stats */}
      {lectures.length > 0 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {[
            { label: 'Scheduled', value: scheduledCount },
            { label: 'Live Now', value: ongoingCount },
            { label: 'Completed', value: completedCount },
          ].map(({ label, value }) => (
            <Card key={label}>
              <CardContent className="p-2.5 sm:p-4">
                <div className="text-lg sm:text-xl font-bold">{value}</div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Content */}
      {loading && lectures.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-xl border border-border/50 p-4 animate-pulse">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-muted rounded-lg" />
                  <div className="h-4 w-32 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Lectures Yet"
          description={`No institute lectures available at the moment.${isInstituteAdmin ? ' Create your first lecture to get started.' : ''}`}
        />
      ) : (
        <>
          {pageViewMode === 'table' ? (
            <MUITable
              title=""
              data={lectures}
              columns={[
                { id: 'title', label: 'Title', minWidth: 200, format: (val: string, row: any) => <div><div className="font-medium">{val}</div>{row.description && <div className="text-xs text-muted-foreground line-clamp-1">{row.description}</div>}</div> },
                { id: 'status', label: 'Status', minWidth: 120, format: (val: string) => { const cfg = getStatusConfig(val); return <Badge variant="outline" className={cfg.className}>{cfg.label}</Badge>; } },
                { id: 'lectureType', label: 'Type', minWidth: 100, format: (val: string) => <Badge variant="secondary" className="capitalize">{val}</Badge> },
                { id: 'startTime', label: 'Start Time', minWidth: 170, format: (val: string) => val ? formatDateTime(val) : '—' },
                { id: 'endTime', label: 'End Time', minWidth: 110, format: (val: string) => val ? format(new Date(val), 'HH:mm') : '—' },
                { id: 'venue', label: 'Venue', minWidth: 120, format: (val: string) => val || '—' },
                { id: 'id', label: 'Actions', minWidth: 220, format: (_: any, row: any) => (
                  <div className="flex flex-wrap items-center gap-1">
                    {row.meetingLink && (
                      <Button size="sm" onClick={() => handleJoinLecture(row)} className="h-7 text-xs rounded-lg gap-1">
                        <ExternalLink className="h-3 w-3" />Join
                      </Button>
                    )}
                    {row.recordingUrl && (
                      <Button size="sm" variant="outline" onClick={() => handleViewRecording(row)} className="h-7 text-xs rounded-lg gap-1">
                        <Play className="h-3 w-3" />Recording
                      </Button>
                    )}
                    {isInstituteAdmin && (
                      <>
                        <Button size="sm" variant="ghost" onClick={() => handleUpdateClick(row)} className="h-7 text-xs rounded-lg gap-1">
                          <Edit className="h-3 w-3" />Edit
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteClick(row)} className="h-7 text-xs rounded-lg gap-1 text-destructive hover:text-destructive">
                          <Trash2 className="h-3 w-3" />Delete
                        </Button>
                      </>
                    )}
                  </div>
                )},
              ]}
              page={0}
              rowsPerPage={lectures.length || 10}
              totalCount={lectures.length}
              onPageChange={() => {}}
              onRowsPerPageChange={() => {}}
              allowAdd={false}
              allowEdit={false}
              allowDelete={false}
            />
          ) : (
            <div className="space-y-3">
            {lectures.map((lecture) => {
              const statusConfig = getStatusConfig(lecture.status);
              const isExpanded = expandedLectureId === lecture.id;
              return (
                <Card
                  key={lecture.id}
                  className="hover:shadow-md transition-shadow"
                >
                  {/* Always-visible header */}
                  <div
                    className="p-3 sm:p-4 flex items-center gap-2 cursor-pointer select-none"
                    onClick={() => setExpandedLectureId(isExpanded ? null : lecture.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate">{lecture.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{formatDateTime(lecture.startTime)}</p>
                    </div>
                    <Badge variant="outline" className={`${statusConfig.className} shrink-0 text-xs font-medium px-2 py-0.5`}>
                      {statusConfig.label}
                    </Badge>
                    {lecture.meetingLink && (
                      <Button
                        size="sm"
                        className="shrink-0 h-7 text-xs px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={(e) => { e.stopPropagation(); handleJoinLecture(lecture); }}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />Join
                      </Button>
                    )}
                    {lecture.recordingUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="shrink-0 h-7 text-xs px-2.5"
                        onClick={(e) => { e.stopPropagation(); handleViewRecording(lecture); }}
                      >
                        <Play className="h-3 w-3 mr-1" />Rec
                      </Button>
                    )}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  {/* Expandable body */}
                  {isExpanded && (
                    <div className="px-4 sm:px-5 pb-5 border-t pt-4 space-y-4">
                      {lecture.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed">{lecture.description}</p>
                      )}
                      {/* Schedule & Details */}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Schedule &amp; Details</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Start</span>
                            <span className="text-xs font-medium">{formatDateTime(lecture.startTime)}</span>
                          </div>
                          {lecture.endTime && (
                            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">End</span>
                              <span className="text-xs font-medium">{format(new Date(lecture.endTime), 'HH:mm')}</span>
                            </div>
                          )}
                          {lecture.maxParticipants && (
                            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Capacity</span>
                              <span className="text-xs font-medium">{lecture.maxParticipants} participants</span>
                            </div>
                          )}
                          {lecture.venue && (
                            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-muted/60 border border-border/50">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Venue</span>
                              <span className="text-xs font-medium">{lecture.venue}</span>
                            </div>
                          )}
                          {lecture.subject && (
                            <div className="flex flex-col gap-0.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
                              <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/60">Subject</span>
                              <span className="text-xs font-semibold text-primary">{lecture.subject}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {isInstituteAdmin && (
                        <div className="flex gap-2 pt-1 border-t">
                          <Button size="sm" variant="outline" className="flex-1 h-8" onClick={() => handleUpdateClick(lecture)}>
                            <Edit className="h-3 w-3 mr-1.5" />Edit
                          </Button>
                          <Button size="sm" variant="destructive" className="flex-1 h-8" onClick={() => handleDeleteClick(lecture)}>
                            <Trash2 className="h-3 w-3 mr-1.5" />Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
          )}

          {pageViewMode !== 'table' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 pt-2">
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading} className="rounded-xl">
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading} className="rounded-xl">
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Update Dialog */}
      {selectedLecture && (
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="sr-only">Update Lecture</DialogTitle>
            <DialogDescription className="sr-only">Form to update an existing institute lecture</DialogDescription>
            <UpdateInstituteLectureForm
              lecture={selectedLecture}
              onClose={() => { setShowUpdateDialog(false); setSelectedLecture(null); }}
              onSuccess={handleUpdateSuccess}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <DeleteLectureConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        lectureTitle={lectureToDelete?.title || ''}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      {/* Recording Dialog - draggable & resizable */}
      <VideoPreviewDialog
        open={showRecordingDialog}
        onOpenChange={setShowRecordingDialog}
        url={recordingLecture?.recordingUrl || ''}
        title={recordingLecture?.title ?? 'Lecture Recording'}
      />
    </div>
  );
};

export default InstituteLectures;
