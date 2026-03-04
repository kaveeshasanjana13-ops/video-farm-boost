import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import MUITable from '@/components/ui/mui-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomToggle } from '@/components/ui/custom-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RefreshCw, Filter, Plus, Calendar, Clock, FileText, CheckCircle, ExternalLink, BarChart3, Eye, ChevronDown, LayoutList, LayoutGrid } from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateExamForm from '@/components/forms/CreateExamForm';
import { UpdateExamForm } from '@/components/forms/UpdateExamForm';
import CreateResultsForm from '@/components/forms/CreateResultsForm';
import { DataCardView } from '@/components/ui/data-card-view';
import { useTableData } from '@/hooks/useTableData';
import { cachedApiClient } from '@/api/cachedClient';
interface ExamsProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}
const Exams = ({
  apiLevel = 'institute'
}: ExamsProps) => {
  const navigate = useNavigate();
  const {
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    currentInstituteId,
    currentClassId,
    currentSubjectId
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isCreateResultsDialogOpen, setIsCreateResultsDialogOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const userRole = useInstituteRole();

  // Memoize default params to prevent unnecessary re-renders
  const defaultParams = useMemo(() => {
    const params: Record<string, any> = {};

    if (currentInstituteId) {
      params.instituteId = currentInstituteId;
    }
    if (currentClassId) {
      params.classId = currentClassId;
    }
    if (currentSubjectId) {
      params.subjectId = currentSubjectId;
    }

    if (userRole === 'Teacher' && user?.id) {
      params.teacherId = user.id;
    }
    return params;
  }, [currentInstituteId, currentClassId, currentSubjectId, userRole, user?.id]);

  // Enhanced pagination with useTableData hook
  const {
    state: {
      data: examsData,
      loading: isLoading
    },
    pagination,
    actions: {
      refresh,
      updateFilters,
      setPage,
      setLimit
    },
    filters
  } = useTableData({
    endpoint: '/institute-class-subject-exams',
    defaultParams,
    dependencies: [currentInstituteId, currentClassId, currentSubjectId], // Auto-reload on context changes
    pagination: {
      defaultLimit: 50,
      availableLimits: [25, 50, 100]
    },
    autoLoad: true // Enable auto-loading from cache
  });

  // Track if we've attempted to load data at least once - auto-load when context is ready
  const [hasAttemptedLoad, setHasAttemptedLoad] = React.useState(false);

  // Auto-load when context is ready
  React.useEffect(() => {
    if (currentInstituteId && currentClassId && currentSubjectId && !hasAttemptedLoad) {
      setHasAttemptedLoad(true);
      refresh();
    }
  }, [currentInstituteId, currentClassId, currentSubjectId]);

  const handleLoadData = async (forceRefresh = false) => {
    // For students: require all context selections
    if (userRole === 'Student') {
      if (!currentInstituteId || !currentClassId || !currentSubjectId) {
        toast({
          title: "Missing Selection",
          description: "Please select institute, class, and subject to view exams.",
          variant: "destructive"
        });
        return;
      }
    }

    // For InstituteAdmin and Teacher: require at least institute selection
    if (userRole === 'InstituteAdmin' || userRole === 'Teacher') {
      if (!currentInstituteId) {
        toast({
          title: "Selection Required",
          description: "Please select an institute to view exams.",
          variant: "destructive"
        });
        return;
      }
    }
    setHasAttemptedLoad(true);
    
    // Update filters and load data
    updateFilters(defaultParams);    // Trigger data loading using the actions from useTableData
    refresh();
  };
  const handleRefreshData = async () => {
    console.log('Force refreshing exams data...');
    refresh();
    setLastRefresh(new Date());
  };
  const handleCreateExam = async () => {
    setIsCreateDialogOpen(false);
    // Force refresh after creating new exam
    refresh();
  };
  const handleEditExam = (examData: any) => {
    setSelectedExam(examData);
    setIsUpdateDialogOpen(true);
  };
  const handleUpdateExam = () => {
    handleRefreshData();
    setIsUpdateDialogOpen(false);
    setSelectedExam(null);
  };
  const handleViewResults = (examData: any) => {
    // Use context from exam data if available, otherwise use current context
    const instId = examData.instituteId || examData.institute?.id || currentInstituteId;
    const clsId = examData.classId || examData.class?.id || currentClassId;
    const subId = examData.subjectId || examData.subject?.id || currentSubjectId;
    const examId = examData.id;
    
    console.log('View Results clicked:', { examData, instId, clsId, subId, examId });
    
    if (!instId || !clsId || !subId || !examId) {
      toast({
        title: "Missing Context",
        description: "Please select institute, class, and subject first",
        variant: "destructive"
      });
      return;
    }
    
    const url = `/institute/${instId}/class/${clsId}/subject/${subId}/exam/${examId}/results`;
    console.log('Navigating to:', url);
    navigate(url);
  };
  const handleDeleteExam = async (examData: any) => {
    console.log('Deleting exam:', examData);
    try {
      // Use cached client for delete (will clear related cache)
      await cachedApiClient.delete(`/institute-class-subject-exams/${examData.id}`);
      console.log('Exam deleted successfully');
      toast({
        title: "Exam Deleted",
        description: `Exam ${examData.title} has been deleted successfully.`,
        variant: "destructive"
      });

      // Force refresh after deletion
      refresh();
    } catch (error) {
      console.error('Error deleting exam:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete exam. Please try again.",
        variant: "destructive"
      });
    }
  };
  const handleCreateResults = () => {
    console.log('Create results clicked');
    setIsCreateResultsDialogOpen(true);
  };
  const examsColumns = [{
    key: 'title',
    header: 'Title'
  }, {
    key: 'description',
    header: 'Description'
  }, {
    key: 'examType',
    header: 'Type',
    render: (value: string) => <Badge variant={value === 'online' ? 'default' : 'secondary'}>
          {value}
        </Badge>
  }, {
    key: 'durationMinutes',
    header: 'Duration (min)',
    render: (value: number) => `${value} minutes`
  }, {
    key: 'totalMarks',
    header: 'Total Marks'
  }, {
    key: 'passingMarks',
    header: 'Passing Marks'
  }, {
    key: 'scheduleDate',
    header: 'Schedule Date',
    render: (value: string) => value ? new Date(value).toLocaleDateString() : 'Not set'
  }, {
    key: 'startTime',
    header: 'Start Time',
    render: (value: string) => value ? new Date(value).toLocaleString() : 'Not set'
  }, {
    key: 'endTime',
    header: 'End Time',
    render: (value: string) => value ? new Date(value).toLocaleString() : 'Not set'
  }, {
    key: 'venue',
    header: 'Venue'
  }, ...((['InstituteAdmin', 'Teacher', 'Student'] as UserRole[]).includes(userRole) ? [{
    key: 'examLink',
    header: 'Exam Link',
    render: (value: string, row: any) => value ? <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.open(value, '_blank')}>
          <ExternalLink className="h-3 w-3 mr-1" />
          Exam Link
        </Button> : <span className="text-gray-400">No link</span>
  }] : []), {
    key: 'status',
    header: 'Status',
    render: (value: string) => <Badge variant={value === 'scheduled' ? 'default' : value === 'draft' ? 'secondary' : value === 'completed' ? 'outline' : 'destructive'}>
          {value}
        </Badge>
  }, ...((['InstituteAdmin', 'Teacher'] as UserRole[]).includes(userRole) ? [{
    key: 'createResults',
    header: 'Create Results',
    render: (value: any, row: any) => <Button size="sm" variant="outline" onClick={(e) => {
      e.stopPropagation();
      if (!currentInstituteId || !currentClassId || !currentSubjectId) {
        toast({
          title: "Missing Context",
          description: "Please select institute, class, and subject first",
          variant: "destructive"
        });
        return;
      }
      navigate(`/institute/${currentInstituteId}/class/${currentClassId}/subject/${currentSubjectId}/exam/${row.id}/create-results`);
    }} className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Create
        </Button>
  }] : []), {
    key: 'results',
    header: 'View Results',
    render: (value: any, row: any) => <Button size="sm" variant="default" onClick={(e) => {
      e.stopPropagation();
      handleViewResults(row);
    }} className="flex items-center gap-2">
          <Eye className="h-4 w-4" />
          View
        </Button>
  }];
  const canAdd = AccessControl.hasPermission(userRole, 'create-exam');
  const canEdit = userRole === 'Teacher' ? true : AccessControl.hasPermission(userRole, 'edit-exam');
  const canDelete = userRole === 'Teacher' ? true : AccessControl.hasPermission(userRole, 'delete-exam');
  const canView = true; // All users can view exams

  // DEBUG: Log role and institute information
  console.log('🔍 EXAMS DEBUG:', {
    userRole,
    selectedInstitute,
    'selectedInstitute.userRole': selectedInstitute?.userRole,
    'selectedInstitute.instituteUserType': (selectedInstitute as any)?.instituteUserType,
    canAdd,
    canEdit,
    canDelete,
    canView,
    handleEditExam: !!handleEditExam,
    handleViewResults: !!handleViewResults
  });
  const getTitle = () => {
    const contexts = [];
    if (selectedInstitute) {
      contexts.push(selectedInstitute.name);
    }
    if (selectedClass) {
      contexts.push(selectedClass.name);
    }
    if (selectedSubject) {
      contexts.push(selectedSubject.name);
    }
    let title = 'Exams';
    if (contexts.length > 0) {
      title += ` (${contexts.join(' → ')})`;
    }
    return title;
  };

  // Filter the exams based on local filters for mobile view
  const filteredExams = examsData.filter(exam => {
    const matchesSearch = !searchTerm || Object.values(exam).some(value => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || exam.status === statusFilter;
    const matchesType = typeFilter === 'all' || exam.examType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  const shouldShowLoadButton = () => {
    if (userRole === 'Student') {
      return currentInstituteId && currentClassId && currentSubjectId;
    }
    if (userRole === 'InstituteAdmin' || userRole === 'Teacher') {
      return currentInstituteId;
    }
    return true;
  };
  const getLoadButtonMessage = () => {
    if (userRole === 'Student' && (!currentInstituteId || !currentClassId || !currentSubjectId)) {
      return 'Please select institute, class, and subject to view exams.';
    }
    if ((userRole === 'InstituteAdmin' || userRole === 'Teacher') && !currentInstituteId) {
      return 'Please select institute to view exams.';
    }
    return 'Click the button below to load exams data';
  };
  return <div className="container mx-auto px-3 py-4 sm:p-6 space-y-4 sm:space-y-6">
      {!hasAttemptedLoad ? <div className="text-center py-8 sm:py-12">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">
            {getTitle()}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-2">
            {getLoadButtonMessage()}
          </p>
          <Button
            onClick={() => handleLoadData(false)}
            disabled={isLoading || !shouldShowLoadButton()}
            size="lg"
            className="w-full sm:w-auto gap-2"
          >
            {isLoading ? <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading...
              </> : <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>}
          </Button>
        </div> : <>
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold text-foreground truncate">
                  Exams
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 truncate">
                  {selectedInstitute?.name}{selectedClass ? ` → ${selectedClass.name}` : ''}{selectedSubject ? ` → ${selectedSubject.name}` : ''}
                </p>
                {lastRefresh && <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                    Updated: {lastRefresh.toLocaleTimeString()}
                  </p>}
              </div>
            </div>
            
            {/* Action bar */}
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-8 px-2.5 text-xs sm:text-sm sm:h-9 sm:px-3">
                <Filter className="h-3.5 w-3.5 mr-1" />
                Filters
              </Button>
              <Button onClick={handleRefreshData} disabled={isLoading} variant="outline" size="sm" className="h-8 px-2.5 text-xs sm:text-sm sm:h-9 sm:px-3">
                <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          {showFilters && <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-muted/50 rounded-xl border border-border">
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                  Search
                </label>
                <Input placeholder="Search exams..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full h-8 sm:h-9 text-sm" />
              </div>
              
              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                  Status
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-8 sm:h-9 text-sm">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs sm:text-sm font-medium text-muted-foreground mb-1 block">
                  Type
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-8 sm:h-9 text-sm">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setTypeFilter('all');
          }} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>}

           {/* Add Create Buttons for InstituteAdmin and Teacher */}
           {(userRole === 'InstituteAdmin' || userRole === 'Teacher') && canAdd && <div className="flex justify-end">
                <Button onClick={() => setIsCreateDialogOpen(true)} size="sm" className="h-8 text-xs sm:h-9 sm:text-sm">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Create Exam
                </Button>
              </div>}

           {/* View Content */}
          {viewMode === 'card' ? (
            <div className="space-y-2">
              {filteredExams.length === 0 ? (
                <Card className="p-8 text-center"><p className="text-sm text-muted-foreground">No exams found</p></Card>
              ) : (
                filteredExams.map((item: any) => {
                  const isOpen = expandedExam === (item.id || item._id);
                  return (
                    <Collapsible key={item.id || item._id} open={isOpen} onOpenChange={() => setExpandedExam(isOpen ? null : (item.id || item._id))}>
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
                            {item.examLink && (
                              <Button size="sm" variant="destructive" className="h-7 text-xs" onClick={() => window.open(item.examLink, '_blank')}>
                                <ExternalLink className="h-3 w-3 mr-1" />Exam Link
                              </Button>
                            )}
                            <Button size="sm" variant="default" className="h-7 text-xs" onClick={() => handleViewResults(item)}>
                              <Eye className="h-3 w-3 mr-1" />Results
                            </Button>
                            {(userRole === 'InstituteAdmin' || userRole === 'Teacher') && canAdd && (
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
                                if (!currentInstituteId || !currentClassId || !currentSubjectId) {
                                  toast({ title: "Missing Context", description: "Please select institute, class, and subject first", variant: "destructive" });
                                  return;
                                }
                                navigate(`/institute/${currentInstituteId}/class/${currentClassId}/subject/${currentSubjectId}/exam/${item.id}/create-results`);
                              }}>
                                <BarChart3 className="h-3 w-3 mr-1" />Create Results
                              </Button>
                            )}
                            {canEdit && (
                              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleEditExam(item)}>Edit</Button>
                            )}
                            {canDelete && (
                              <Button size="sm" variant="outline" className="h-7 text-xs text-destructive border-destructive/30" onClick={() => handleDeleteExam(item)}>Delete</Button>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
              )}
            </div>
          ) : (
          <MUITable title="" data={examsData} columns={examsColumns.map(col => ({
        id: col.key,
        label: col.header,
        minWidth: 170,
        format: col.render
      }))} onAdd={canAdd ? () => setIsCreateDialogOpen(true) : undefined} onEdit={userRole === 'InstituteAdmin' || userRole === 'Teacher' ? handleEditExam : undefined} onDelete={canDelete ? handleDeleteExam : undefined} onView={undefined} page={pagination.page} rowsPerPage={pagination.limit} totalCount={pagination.totalCount} onPageChange={setPage} onRowsPerPageChange={setLimit} rowsPerPageOptions={[25, 50, 100]} sectionType="exams" allowEdit={userRole === 'InstituteAdmin' || userRole === 'Teacher'} allowDelete={canDelete} />
          )}
        </>}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Exam</DialogTitle>
          </DialogHeader>
          <CreateExamForm onClose={() => setIsCreateDialogOpen(false)} onSuccess={handleCreateExam} />
        </DialogContent>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update Exam</DialogTitle>
          </DialogHeader>
          {selectedExam && <UpdateExamForm exam={selectedExam} onClose={() => setIsUpdateDialogOpen(false)} onSuccess={handleUpdateExam} />}
        </DialogContent>
      </Dialog>

      {/* Create Results Dialog */}
      <Dialog open={isCreateResultsDialogOpen} onOpenChange={setIsCreateResultsDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Results</DialogTitle>
          </DialogHeader>
          <CreateResultsForm onClose={() => setIsCreateResultsDialogOpen(false)} onSuccess={() => {
          setIsCreateResultsDialogOpen(false);
          toast({
            title: "Results Created",
            description: "Exam results have been created successfully."
          });
        }} />
        </DialogContent>
      </Dialog>

    </div>;
};
export default Exams;