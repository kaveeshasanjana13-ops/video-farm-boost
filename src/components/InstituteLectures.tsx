import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { lectureApi, Lecture } from '@/api/lecture.api';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Video, Calendar, Clock, Users, MapPin, ExternalLink, Plus, Edit, Trash2, Play, RefreshCw, BookOpen, Radio } from 'lucide-react';
import { format } from 'date-fns';
import CreateInstituteLectureForm from '@/components/forms/CreateInstituteLectureForm';
import UpdateInstituteLectureForm from '@/components/forms/UpdateInstituteLectureForm';
import DeleteLectureConfirmDialog from '@/components/forms/DeleteLectureConfirmDialog';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useToast } from '@/hooks/use-toast';

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
        title: 'Select Institute',
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
    } catch (error) {
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

  // Stats
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
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border border-border/50 p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Institute Lectures</h1>
                <p className="text-sm text-muted-foreground">{selectedInstitute.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => fetchLectures(page, true)}
              disabled={loading}
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 border-border/50 backdrop-blur-sm"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {isInstituteAdmin && (
              <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-xl gap-2 shadow-sm">
                    <Plus className="h-4 w-4" />
                    New Lecture
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CreateInstituteLectureForm onClose={() => setShowCreateDialog(false)} onSuccess={handleCreateSuccess} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* Stats Row */}
        {lectures.length > 0 && (
          <div className="relative grid grid-cols-3 gap-3 mt-6">
            {[
              { label: 'Scheduled', value: scheduledCount, icon: Calendar },
              { label: 'Live Now', value: ongoingCount, icon: Radio },
              { label: 'Completed', value: completedCount, icon: BookOpen },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-background/60 backdrop-blur-sm border border-border/30">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-none">{value}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      {loading && lectures.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-2xl border border-border/50 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 bg-muted rounded-lg" />
                  <div className="h-4 w-32 bg-muted rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : lectures.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
            <Video className="h-10 w-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Lectures Yet</h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            No institute lectures available at the moment.
            {isInstituteAdmin && ' Create your first lecture to get started.'}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {lectures.map((lecture) => {
              const statusConfig = getStatusConfig(lecture.status);
              return (
                <Card
                  key={lecture.id}
                  className="group relative overflow-hidden rounded-2xl border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Left Icon */}
                      <div className="shrink-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          lecture.lectureType === 'online'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {lecture.lectureType === 'online' ? <Video className="h-6 w-6" /> : <MapPin className="h-6 w-6" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-3">
                        {/* Title Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg line-clamp-1 group-hover:text-primary transition-colors">
                              {lecture.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">{lecture.description}</p>
                            {lecture.subject && (
                              <span className="text-xs font-medium text-primary/80 mt-1 inline-block">
                                {lecture.subject}
                              </span>
                            )}
                          </div>
                          <Badge variant="outline" className={`${statusConfig.className} shrink-0 self-start rounded-lg text-xs font-medium px-2.5 py-0.5`}>
                            {statusConfig.label}
                          </Badge>
                        </div>

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {formatDateTime(lecture.startTime)}
                          </span>
                          {lecture.endTime && (
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-3.5 w-3.5" />
                              → {format(new Date(lecture.endTime), 'HH:mm')}
                            </span>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            {lecture.maxParticipants} max
                          </span>
                          {lecture.venue && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5" />
                              {lecture.venue}
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          {lecture.meetingLink && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinLecture(lecture)}
                              className="rounded-xl gap-1.5 h-8 text-xs shadow-sm"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Join Meeting
                            </Button>
                          )}
                          {lecture.recordingUrl && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewRecording(lecture)}
                              className="rounded-xl gap-1.5 h-8 text-xs border-border/50"
                            >
                              <Play className="h-3.5 w-3.5" />
                              Recording
                            </Button>
                          )}
                          {isInstituteAdmin && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleUpdateClick(lecture)}
                                className="rounded-xl gap-1.5 h-8 text-xs"
                              >
                                <Edit className="h-3.5 w-3.5" />
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(lecture)}
                                className="rounded-xl gap-1.5 h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {totalPages > 1 && (
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

      {/* Recording Dialog */}
      <Dialog open={showRecordingDialog} onOpenChange={setShowRecordingDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <div className="relative bg-black rounded-lg overflow-hidden">
            {recordingLecture && (
              <>
                <div className="aspect-video w-full">
                  <iframe
                    src={recordingLecture.recordingUrl || ''}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4 bg-background">
                  <h3 className="font-semibold">{recordingLecture.title}</h3>
                  <p className="text-sm text-muted-foreground">{recordingLecture.description}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InstituteLectures;
