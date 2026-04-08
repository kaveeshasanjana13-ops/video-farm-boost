import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useToast } from '@/hooks/use-toast';
import { useTableData } from '@/hooks/useTableData';
import { cachedApiClient } from '@/api/cachedClient';
import { AccessControl } from '@/utils/permissions';
import { getImageUrl } from '@/utils/imageUrlHelper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DashboardSubjectCards from '@/components/dashboard/DashboardSubjectCards';
import FeaturesSection from '@/components/dashboard/FeaturesSection';
import { AttendanceFeedWidget } from '@/components/dashboard/DashboardWidgets';
import CreateLectureForm from '@/components/forms/CreateLectureForm';
import UpdateLectureForm from '@/components/forms/UpdateLectureForm';
import CreateExamForm from '@/components/forms/CreateExamForm';
import { UpdateExamForm } from '@/components/forms/UpdateExamForm';
import VideoPreviewDialog from '@/components/VideoPreviewDialog';
import DeleteConfirmDialog from '@/components/forms/DeleteConfirmDialog';
import {
  Video, FileText, RefreshCw, Plus, ExternalLink,
  ChevronDown, BarChart3, Eye, Calendar, Loader2,
  ChevronLeft, BookOpen, School, Building2 } from
'lucide-react';

const SubjectDashboard = () => {
  const navigate = useNavigate();
  const { user, selectedInstitute, selectedClass, selectedSubject, setSelectedSubject, setSelectedClass, currentInstituteId, currentClassId, currentSubjectId } = useAuth();
  const userRole = useInstituteRole();
  const { toast } = useToast();

  // View mode toggles — read from global setting
  const [lecturesViewMode, setLecturesViewMode] = useState<'card' | 'table'>(() =>
    (localStorage.getItem('viewMode') as 'card' | 'table') || 'card'
  );
  const [examsViewMode, setExamsViewMode] = useState<'card' | 'table'>(() =>
    (localStorage.getItem('viewMode') as 'card' | 'table') || 'card'
  );

  // Lecture dialogs
  const [isCreateLectureOpen, setIsCreateLectureOpen] = useState(false);
  const [isEditLectureOpen, setIsEditLectureOpen] = useState(false);
  const [selectedLecture, setSelectedLecture] = useState<any>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [videoPreviewTitle, setVideoPreviewTitle] = useState('');

  // Exam dialogs
  const [isCreateExamOpen, setIsCreateExamOpen] = useState(false);
  const [isEditExamOpen, setIsEditExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);

  // Expanded card tracking
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any; type: string }>({ open: false, item: null, type: '' });
  const [isDeleting, setIsDeleting] = useState(false);

  const lectureParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (currentInstituteId) params.instituteId = currentInstituteId;
    if (currentClassId) params.classId = currentClassId;
    if (currentSubjectId) params.subjectId = currentSubjectId;
    if (userRole === 'Teacher' && user?.id) params.instructorId = user.id;
    return params;
  }, [currentInstituteId, currentClassId, currentSubjectId, userRole, user?.id]);

  const examParams = useMemo(() => {
    const params: Record<string, any> = {};
    if (currentInstituteId) params.instituteId = currentInstituteId;
    if (currentClassId) params.classId = currentClassId;
    if (currentSubjectId) params.subjectId = currentSubjectId;
    if (userRole === 'Teacher' && user?.id) params.teacherId = user.id;
    return params;
  }, [currentInstituteId, currentClassId, currentSubjectId, userRole, user?.id]);

  // Lectures data
  const lecturesTable = useTableData({
    endpoint: '/institute-class-subject-lectures',
    defaultParams: lectureParams,
    dependencies: [currentInstituteId, currentClassId, currentSubjectId],
    pagination: { defaultLimit: 50, availableLimits: [25, 50, 100] },
    autoLoad: true
  });

  // Exams data
  const examsTable = useTableData({
    endpoint: '/institute-class-subject-exams',
    defaultParams: examParams,
    dependencies: [currentInstituteId, currentClassId, currentSubjectId],
    pagination: { defaultLimit: 50, availableLimits: [25, 50, 100] },
    autoLoad: true
  });

  const lectures = lecturesTable.state.data;
  const exams = examsTable.state.data;

  const canAdd = ['InstituteAdmin', 'Teacher'].includes(userRole);
  const canEdit = userRole === 'Teacher' || AccessControl.hasPermission(userRole, 'edit-lecture');
  const canDelete = userRole === 'Teacher' || AccessControl.hasPermission(userRole, 'delete-lecture');

  const getContextTitle = () => {
    const parts = [];
    if (selectedInstitute) parts.push(selectedInstitute.name);
    if (selectedClass) parts.push(selectedClass.name);
    if (selectedSubject) parts.push(selectedSubject.name);
    return parts.length > 0 ? `(${parts.join(' → ')})` : '';
  };

  // ── Lecture handlers ──
  const handleEditLecture = (l: any) => {setSelectedLecture(l);setIsEditLectureOpen(true);};
  const handleDeleteLecture = (l: any) => {
    setDeleteDialog({ open: true, item: l, type: 'lecture' });
  };
  const confirmDelete = async () => {
    if (!deleteDialog.item) return;
    setIsDeleting(true);
    try {
      // Data loaded from /institute-class-subject-lectures — use PATCH to soft-deactivate (DELETE is SUPERADMIN-only)
      await cachedApiClient.patch(`/institute-class-subject-lectures/${deleteDialog.item.id}`, { isActive: false });
      toast({ title: "Deleted", description: `Lecture "${deleteDialog.item.title}" deleted.`, variant: "destructive" });
      setDeleteDialog({ open: false, item: null, type: '' });
      lecturesTable.actions.refresh();
    } catch {
      toast({ title: "Failed", description: "Could not delete lecture.", variant: "destructive" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRecordingClick = (url: string, title: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com')) {
      setVideoPreviewUrl(url);setVideoPreviewTitle(title);
    } else {window.open(url, '_blank');}
  };

  // ── Exam handlers ──
  const handleEditExam = (e: any) => {setSelectedExam(e);setIsEditExamOpen(true);};
  const handleViewResults = (exam: any) => {
    const instId = exam.instituteId || currentInstituteId;
    const clsId = exam.classId || currentClassId;
    const subId = exam.subjectId || currentSubjectId;
    if (!instId || !clsId || !subId) {toast({ title: "Missing Context", description: "Select institute, class, and subject first", variant: "destructive" });return;}
    navigate(`/institute/${instId}/class/${clsId}/subject/${subId}/exam/${exam.id}/results`);
  };
  const handleCreateResults = (exam: any) => {
    if (!currentInstituteId || !currentClassId || !currentSubjectId) {toast({ title: "Missing Context", description: "Select institute, class, and subject first", variant: "destructive" });return;}
    navigate(`/institute/${currentInstituteId}/class/${currentClassId}/subject/${currentSubjectId}/exam/${exam.id}/create-results`);
  };

  // ── Table columns ──
  const lectureColumns = [
  { key: 'title', header: 'Title' },
  { key: 'lectureType', header: 'Type', render: (v: string) => <Badge variant="outline">{v}</Badge> },
  { key: 'startTime', header: 'Start', render: (v: string) => v ? new Date(v).toLocaleString() : 'N/A' },
  { key: 'endTime', header: 'End', render: (v: string) => v ? new Date(v).toLocaleString() : 'N/A' },
  { key: 'status', header: 'Status', render: (v: string) => <Badge variant={v === 'scheduled' ? 'default' : v === 'completed' ? 'secondary' : 'destructive'}>{v}</Badge> },
  { key: 'meetingLink', header: 'Join', render: (v: string) => v ? <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(v, '_blank')}><ExternalLink className="h-3 w-3 mr-1" />Join</Button> : <span className="text-muted-foreground">—</span> },
  { key: 'recordingUrl', header: 'Recording', render: (v: string, row: any) => {const url = v || row.recordingUrl || row.recording_url;return url ? <Button size="sm" onClick={() => handleRecordingClick(url, row.title)}><Video className="h-3 w-3 mr-1" />View</Button> : <span className="text-muted-foreground">—</span>;} }];


  const examColumns = [
  { key: 'title', header: 'Title' },
  { key: 'examType', header: 'Type', render: (v: string) => <Badge variant={v === 'online' ? 'default' : 'secondary'}>{v}</Badge> },
  { key: 'scheduleDate', header: 'Date', render: (v: string) => v ? new Date(v).toLocaleDateString() : 'N/A' },
  { key: 'totalMarks', header: 'Total Marks' },
  { key: 'status', header: 'Status', render: (v: string) => <Badge variant={v === 'scheduled' ? 'default' : v === 'completed' ? 'outline' : v === 'draft' ? 'secondary' : 'destructive'}>{v}</Badge> },
  ...(canAdd ? [{ key: 'createResults', header: 'Create Results', render: (_: any, row: any) => <Button size="sm" variant="outline" onClick={() => handleCreateResults(row)}><BarChart3 className="h-3 w-3 mr-1" />Create</Button> }] : []),
  { key: 'results', header: 'Results', render: (_: any, row: any) => <Button size="sm" variant="default" onClick={() => handleViewResults(row)}><Eye className="h-3 w-3 mr-1" />View</Button> }];


  if (!selectedInstitute || !selectedClass || !selectedSubject) {
    return (
      <div className="container mx-auto p-4 sm:p-6 text-center py-8 sm:py-12">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h2 className="text-2xl font-bold mb-4">Subject Dashboard</h2>
        <p className="text-muted-foreground">Please select an institute, class, and subject to view the dashboard.</p>
      </div>);

  }

  const contextTitle = getContextTitle();

  // ── Expandable Card Item ──
  const LectureCard = ({ item }: {item: any;}) => {
    const isOpen = expandedLecture === item.id;
    const recUrl = item.recordingUrl || item.recording_url;
    return (
      <Collapsible open={isOpen} onOpenChange={() => setExpandedLecture(isOpen ? null : item.id)}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.startTime ? new Date(item.startTime).toLocaleDateString() : 'No date'}
                  {' • '}
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">{item.lectureType}</Badge>
                  {' '}
                  <Badge variant={item.status === 'scheduled' ? 'default' : item.status === 'completed' ? 'secondary' : 'destructive'} className="text-[10px] px-1.5 py-0">{item.status}</Badge>
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardContent>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-2 border-x border-b rounded-b-2xl bg-muted/30">
            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            {item.venue && <p className="text-xs"><span className="font-medium">Venue:</span> {item.venue}</p>}
            <p className="text-xs"><span className="font-medium">Start:</span> {item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A'}</p>
            <p className="text-xs"><span className="font-medium">End:</span> {item.endTime ? new Date(item.endTime).toLocaleString() : 'N/A'}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {item.meetingLink &&
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs" onClick={() => window.open(item.meetingLink, '_blank')}>
                  <ExternalLink className="h-3 w-3 mr-1" />Join
                </Button>
              }
              {recUrl &&
              <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleRecordingClick(recUrl, item.title)}>
                  <Video className="h-3 w-3 mr-1" />Recording
                </Button>
              }
              {canEdit &&
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleEditLecture(item)}>Edit</Button>
              }
              {canDelete &&
              <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => handleDeleteLecture(item)}>Delete</Button>
              }
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>);

  };

  const ExamCard = ({ item }: {item: any;}) => {
    const isOpen = expandedExam === item.id;
    return (
      <Collapsible open={isOpen} onOpenChange={() => setExpandedExam(isOpen ? null : item.id)}>
        <CollapsibleTrigger asChild>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.scheduleDate ? new Date(item.scheduleDate).toLocaleDateString() : 'No date'}
                  {' • '}
                  <Badge variant={item.examType === 'online' ? 'default' : 'secondary'} className="text-[10px] px-1.5 py-0">{item.examType}</Badge>
                  {' '}
                  <Badge variant={item.status === 'scheduled' ? 'default' : item.status === 'completed' ? 'outline' : 'destructive'} className="text-[10px] px-1.5 py-0">{item.status}</Badge>
                </p>
              </div>
              <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardContent>
          </Card>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-4 pb-4 pt-1 space-y-2 border-x border-b rounded-b-2xl bg-muted/30">
            {item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
            <p className="text-xs"><span className="font-medium">Total Marks:</span> {item.totalMarks || 'N/A'}</p>
            <p className="text-xs"><span className="font-medium">Passing Marks:</span> {item.passingMarks || 'N/A'}</p>
            <p className="text-xs"><span className="font-medium">Duration:</span> {item.durationMinutes ? `${item.durationMinutes} min` : 'N/A'}</p>
            {item.venue && <p className="text-xs"><span className="font-medium">Venue:</span> {item.venue}</p>}
            <p className="text-xs"><span className="font-medium">Start:</span> {item.startTime ? new Date(item.startTime).toLocaleString() : 'N/A'}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              {item.examLink &&
              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => window.open(item.examLink, '_blank')}>
                  <ExternalLink className="h-3 w-3 mr-1" />Exam Link
                </Button>
              }
              <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleViewResults(item)}>
                <Eye className="h-3 w-3 mr-1" />Results
              </Button>
              {canAdd &&
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleCreateResults(item)}>
                  <BarChart3 className="h-3 w-3 mr-1" />Create Results
                </Button>
              }
              {canEdit &&
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleEditExam(item)}>Edit</Button>
              }
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>);

  };

  return (
    <div className="space-y-4 pb-24 sm:pb-12">
      {/* Breadcrumb */}
      <div className="px-2 pt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
        <button
          onClick={() => { setSelectedSubject(null); setSelectedClass(null); if (selectedInstitute) navigate(`/institute/${selectedInstitute.id}/dashboard`); }}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <Building2 className="h-3 w-3" />
          <span className="truncate max-w-[100px]">{selectedInstitute?.shortName || selectedInstitute?.name}</span>
        </button>
        <span>/</span>
        <button
          onClick={() => { setSelectedSubject(null); if (selectedInstitute && selectedClass) navigate(`/institute/${selectedInstitute.id}/class/${selectedClass.id}/dashboard`); }}
          className="hover:text-foreground transition-colors flex items-center gap-1 truncate max-w-[100px]"
        >
          <School className="h-3 w-3" />
          {selectedClass?.name}
        </button>
      </div>

      {/* Subject header */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl shrink-0 overflow-hidden">
            {((selectedSubject as any).imgUrl || (selectedSubject as any).image || (selectedSubject as any).thumbnail) ? (
              <img
                src={getImageUrl((selectedSubject as any).imgUrl || (selectedSubject as any).image || (selectedSubject as any).thumbnail)}
                alt={selectedSubject.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-violet-500/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-violet-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground truncate">{selectedSubject.name}</h2>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-muted-foreground truncate">{selectedClass?.name}</span>
              {(selectedSubject as any).code && (
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                  {(selectedSubject as any).code}
                </span>
              )}
              {(selectedSubject as any).type && (
                <span className="text-[10px] bg-violet-500/10 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded">
                  {(selectedSubject as any).type}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subject switcher */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <DashboardSubjectCards />
      </div>

      {/* Quick Access Features */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <FeaturesSection level="subject" />
      </div>

      {/* Lectures */}
      <div className="mx-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Video className="h-4 w-4 text-blue-500" />
            Lectures
            {lectures.length > 0 && <span className="text-xs font-normal text-muted-foreground">({lectures.length})</span>}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={lecturesTable.actions.refresh} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {canAdd && (
              <Button size="sm" className="h-7 text-xs" onClick={() => setIsCreateLectureOpen(true)}>
                <Plus className="h-3 w-3 mr-1" />Add
              </Button>
            )}
          </div>
        </div>
        <div className="px-4 pb-4">
          {lecturesTable.state.loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : lectures.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No lectures yet</p>
              {canAdd && (
                <Button size="sm" variant="outline" className="mt-3 h-7 text-xs" onClick={() => setIsCreateLectureOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add Lecture
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {lectures.map((l: any) => <LectureCard key={l.id} item={l} />)}
            </div>
          )}
        </div>
      </div>

      {/* Exams */}
      <div className="mx-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <FileText className="h-4 w-4 text-rose-500" />
            Exams
            {exams.length > 0 && <span className="text-xs font-normal text-muted-foreground">({exams.length})</span>}
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={examsTable.actions.refresh} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            {canAdd && (
              <Button size="sm" className="h-7 text-xs" onClick={() => setIsCreateExamOpen(true)}>
                <Plus className="h-3 w-3 mr-1" />Add
              </Button>
            )}
          </div>
        </div>
        <div className="px-4 pb-4">
          {examsTable.state.loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : exams.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No exams yet</p>
              {canAdd && (
                <Button size="sm" variant="outline" className="mt-3 h-7 text-xs" onClick={() => setIsCreateExamOpen(true)}>
                  <Plus className="h-3 w-3 mr-1" />Add Exam
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {exams.map((e: any) => <ExamCard key={e.id} item={e} />)}
            </div>
          )}
        </div>
      </div>

      {/* My Attendance */}
      <div className="mx-2">
        <AttendanceFeedWidget filterInstituteId={selectedInstitute.id} />
      </div>

      {/* Create Lecture Dialog */}
      <Dialog open={isCreateLectureOpen} onOpenChange={setIsCreateLectureOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Lecture</DialogTitle>
          </DialogHeader>
          <CreateLectureForm
            onClose={() => setIsCreateLectureOpen(false)}
            onSuccess={() => { setIsCreateLectureOpen(false); lecturesTable.actions.refresh(); }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Lecture Dialog */}
      <Dialog open={isEditLectureOpen} onOpenChange={setIsEditLectureOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Lecture</DialogTitle>
          </DialogHeader>
          {selectedLecture && (
            <UpdateLectureForm
              lecture={selectedLecture}
              onClose={() => setIsEditLectureOpen(false)}
              onSuccess={() => { setIsEditLectureOpen(false); lecturesTable.actions.refresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Exam Dialog */}
      <Dialog open={isCreateExamOpen} onOpenChange={setIsCreateExamOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Exam</DialogTitle>
          </DialogHeader>
          <CreateExamForm
            onClose={() => setIsCreateExamOpen(false)}
            onSuccess={() => { setIsCreateExamOpen(false); examsTable.actions.refresh(); }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Exam Dialog */}
      <Dialog open={isEditExamOpen} onOpenChange={setIsEditExamOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Exam</DialogTitle>
          </DialogHeader>
          {selectedExam && (
            <UpdateExamForm
              exam={selectedExam}
              onClose={() => setIsEditExamOpen(false)}
              onSuccess={() => { setIsEditExamOpen(false); examsTable.actions.refresh(); }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Video Preview */}
      <VideoPreviewDialog
        open={!!videoPreviewUrl}
        onOpenChange={(open) => { if (!open) { setVideoPreviewUrl(null); setVideoPreviewTitle(''); } }}
        url={videoPreviewUrl || ''}
        title={videoPreviewTitle}
      />
      <DeleteConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
        itemName={deleteDialog.item?.title || ''}
        itemType={deleteDialog.type}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );







































































































































};

export default SubjectDashboard;