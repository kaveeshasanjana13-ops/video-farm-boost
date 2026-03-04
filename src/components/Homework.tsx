import React, { useState, useEffect } from 'react';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useRefreshWithCooldown } from '@/hooks/useRefreshWithCooldown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Filter, Plus, Calendar, Clock, BookOpen, FileText, Upload, ExternalLink, BarChart3, Eye, Edit, Users, CheckCircle, AlertCircle, MessageSquare, Download, ChevronDown, ChevronUp, LayoutGrid, Table2 } from 'lucide-react';
import Paper from '@mui/material/Paper';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTablePagination from '@mui/material/TablePagination';
import MuiTableRow from '@mui/material/TableRow';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateHomeworkForm from '@/components/forms/CreateHomeworkForm';
import UpdateHomeworkForm from '@/components/forms/UpdateHomeworkForm';
import SubmitHomeworkForm from '@/components/forms/SubmitHomeworkForm';
import HomeworkDetailsDialog from '@/components/forms/HomeworkDetailsDialog';
import { useNavigate } from 'react-router-dom';
import { homeworkApi } from '@/api/homework.api';
import { cn } from '@/lib/utils';
import { CustomToggle } from '@/components/ui/custom-toggle';

interface HomeworkProps {
  apiLevel?: 'institute' | 'class' | 'subject';
}

const Homework = ({ apiLevel = 'institute' }: HomeworkProps) => {
  const navigate = useNavigate();
  const { user, selectedInstitute, selectedClass, selectedSubject, currentInstituteId, currentClassId, currentSubjectId, isViewingAsParent, selectedChild } = useAuth();
  const instituteRole = useInstituteRole();
  const { toast } = useToast();
  const { refresh, isRefreshing, canRefresh, cooldownRemaining } = useRefreshWithCooldown(10);
  
  // DEBUG: Log role and institute information
  console.log('🔍 HOMEWORK DEBUG:', {
    instituteRole,
    selectedInstitute,
    'selectedInstitute.userRole': selectedInstitute?.userRole,
    'selectedInstitute.instituteUserType': (selectedInstitute as any)?.instituteUserType
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [selectedHomeworkData, setSelectedHomeworkData] = useState<any>(null);
  const [homeworkData, setHomeworkData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode] = useState<'card' | 'table'>(() => {
    return (localStorage.getItem('viewMode') as 'card' | 'table') || 'card';
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Track current context to prevent unnecessary reloads
  const contextKey = `${currentInstituteId}-${currentClassId}-${currentSubjectId}`;
  const [lastLoadedContext, setLastLoadedContext] = useState<string>('');

  // Auto-load homework when subject is selected
  useEffect(() => {
    if (currentInstituteId && currentClassId && currentSubjectId && contextKey !== lastLoadedContext) {
      setLastLoadedContext(contextKey);
      handleLoadData(false); // Auto-load from cache
    }
  }, [contextKey]);

  const buildQueryParams = () => {
    const userRole = instituteRole;
    const params: Record<string, any> = {
      page: page + 1, // MUI pagination is 0-based, API is 1-based
      limit: rowsPerPage,
      userId: user?.id,
      role: userRole
    };

    // Add context-aware filtering
    if (currentInstituteId) {
      params.instituteId = currentInstituteId;
    }

    if (currentClassId) {
      params.classId = currentClassId;
    }

    if (currentSubjectId) {
      params.subjectId = currentSubjectId;
    }

    // For Teachers, add teacherId parameter
    if (userRole === 'Teacher' && user?.id) {
      params.teacherId = user.id;
    }

    // For students, include submissions and references in one call
    if (userRole === 'Student') {
      params.includeSubmissions = true;
      params.includeReferences = true;
    } else if (userRole === 'InstituteAdmin' || userRole === 'Teacher') {
      params.includeReferences = true;
    }

    // Add filter parameters
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    return params;
  };

  const handleLoadData = async (forceRefresh = false) => {
    const userRole = instituteRole;
    const params = buildQueryParams();
    
    if (userRole === 'Student') {
      // For students: require all context
      if (!currentInstituteId || !currentClassId || !currentSubjectId) {
        toast({
          title: "Missing Selection",
          description: "Please select institute, class, and subject to view homework.",
          variant: "destructive"
        });
        return;
      }
    } else if (userRole === 'InstituteAdmin' || userRole === 'Teacher') {
      // For InstituteAdmin and Teacher: require context
      if (!currentInstituteId || !currentClassId || !currentSubjectId) {
        toast({
          title: "Missing Selection",
          description: "Please select institute, class, and subject to view homework.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    console.log(`📚 Loading homework with secure caching - Role: ${userRole}`, { forceRefresh, context: params });
    console.log(`Current context - Institute: ${selectedInstitute?.name}, Class: ${selectedClass?.name}, Subject: ${selectedSubject?.name}`);
    
    try {
      // Use enhanced homework API with automatic caching
      const result = await homeworkApi.getHomework(params, forceRefresh);

      console.log('✅ Homework loaded successfully:', result);
      
      // Handle both array response and paginated response
      const homework = Array.isArray(result) ? result : (result as any)?.data || [];
      const total = Array.isArray(result) ? result.length : (result as any)?.meta?.total || homework.length;
      
      setHomeworkData(homework);
      setTotalCount(total);
      setDataLoaded(true);
      setLastRefresh(new Date());
      
      if (forceRefresh) {
        toast({
          title: "Data Refreshed",
          description: `Successfully refreshed ${homework.length} homework assignments.`
        });
      }
    } catch (error) {
      console.error('❌ Failed to load homework:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load homework data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshData = async () => {
    console.log('Force refreshing homework data...');
    await refresh(async () => {
      await handleLoadData(true);
    }, {
      successMessage: 'Homework data refreshed successfully'
    });
  };

  const handleCreateHomework = async () => {
    setIsCreateDialogOpen(false);
    // Force refresh after creating new homework
    await handleLoadData(true);
  };

  const handleEditHomework = async (homeworkData: any) => {
    console.log('Opening update homework dialog:', homeworkData);
    setSelectedHomeworkData(homeworkData);
    setIsEditDialogOpen(true);
  };

  const handleUpdateHomework = async () => {
    setIsEditDialogOpen(false);
    setSelectedHomeworkData(null);
    // Force refresh after updating homework
    await handleLoadData(true);
  };

  const handleDeleteHomework = async (homeworkData: any) => {
    console.log('🗑️ Deleting homework:', homeworkData);
    
    try {
      setIsLoading(true);
      
      // Use homework API with automatic cache invalidation
      await homeworkApi.deleteHomework(homeworkData.id, {
        instituteId: currentInstituteId,
        classId: currentClassId,
        subjectId: currentSubjectId
      });

      console.log('✅ Homework deleted successfully');
      
      toast({
        title: "Homework Deleted",
        description: `Homework ${homeworkData.title} has been deleted successfully.`,
        variant: "destructive"
      });
      
      // Force refresh after deletion
      await handleLoadData(true);
      
    } catch (error) {
      console.error('❌ Error deleting homework:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete homework. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewHomework = (homeworkData: any) => {
    console.log('View homework:', homeworkData);
    setSelectedHomeworkData(homeworkData);
    setIsViewDialogOpen(true);
  };

  const handleSubmitHomework = (homeworkData: any) => {
    console.log('Submit homework:', homeworkData);
    setSelectedHomeworkData(homeworkData);
    setIsSubmitDialogOpen(true);
  };

  const handleViewSubmissions = (homeworkData: any) => {
    console.log('View homework submissions:', homeworkData);
    
    // 🛡️ SECURE: Use full hierarchical URL
    if (!currentInstituteId || !currentClassId || !currentSubjectId) {
      toast({
        title: "Missing Context",
        description: "Please select institute, class, and subject first",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/institute/${currentInstituteId}/class/${currentClassId}/subject/${currentSubjectId}/homework/${homeworkData.id}/submissions`);
  };

  const handleSubmissionSuccess = async () => {
    setIsSubmitDialogOpen(false);
    setSelectedHomeworkData(null);
    toast({
      title: "Submission Successful",
      description: "Your homework has been submitted successfully!"
    });
    // Force refresh after successful submission
    await handleLoadData(true);
  };

  const canAdd = AccessControl.hasPermission(instituteRole, 'create-homework');
  const canEdit = instituteRole === 'Teacher' ? true : AccessControl.hasPermission(instituteRole, 'edit-homework');
  const canDelete = instituteRole === 'Teacher' ? true : AccessControl.hasPermission(instituteRole, 'delete-homework');
  const isStudent = instituteRole === 'Student';
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getTitle = () => {
    const contexts = [];
    if (selectedInstitute) contexts.push(selectedInstitute.name);
    if (selectedClass) contexts.push(selectedClass.name);
    if (selectedSubject) contexts.push(selectedSubject.name);
    let title = 'Homework';
    if (contexts.length > 0) title += ` (${contexts.join(' → ')})`;
    return title;
  };

  const filteredHomework = homeworkData.filter(homework => {
    const matchesSearch = !searchTerm || 
      Object.values(homework).some(value => 
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    const isActive = homework.isActive !== undefined ? homework.isActive : true;
    // Students should only see active homework
    if (isStudent && !isActive) return false;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && isActive) ||
      (statusFilter === 'inactive' && !isActive);
    return matchesSearch && matchesStatus;
  });

  const getSubmissionStatus = (hw: any) => {
    const submissions = hw.mySubmissions || [];
    if (submissions.length === 0) return 'not_submitted';
    const latest = submissions[0];
    if (latest.isCorrected || latest.teacherCorrectionFileUrl || latest.remarks) return 'corrected';
    return 'submitted';
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {!dataLoaded ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">{getTitle()}</h2>
          <p className="text-muted-foreground mb-6">
            {instituteRole === 'Student' && (!currentInstituteId || !currentClassId || !currentSubjectId)
              ? 'Please select institute, class, and subject to view homework.'
              : 'Click the button below to load homework data'}
          </p>
          <Button 
            onClick={() => handleLoadData(false)} 
            disabled={isLoading || (instituteRole === 'Student' && (!currentInstituteId || !currentClassId || !currentSubjectId))}
          >
            {isLoading ? (
              <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Loading Data...</>
            ) : (
              <><RefreshCw className="h-4 w-4 mr-2" /> Load Data</>
            )}
          </Button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold">{getTitle()}</h1>
              {lastRefresh && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Last refreshed: {lastRefresh.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="h-4 w-4 mr-1" /> Filters
              </Button>
              <Button 
                onClick={handleRefreshData} 
                disabled={isLoading || isRefreshing || !canRefresh}
                variant="outline"
                size="sm"
                title={!canRefresh ? `Please wait ${cooldownRemaining} seconds` : 'Refresh data'}
              >
                {isLoading || isRefreshing ? (
                  <><RefreshCw className="h-4 w-4 mr-1 animate-spin" /> Refreshing...</>
                ) : !canRefresh ? (
                  <><RefreshCw className="h-4 w-4 mr-1" /> Wait ({cooldownRemaining}s)</>
                ) : (
                  <><RefreshCw className="h-4 w-4 mr-1" /> Refresh</>
                )}
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl border">
              <div>
                <label className="text-sm font-medium mb-1 block">Search Homework</label>
                <Input placeholder="Search homework..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              {!isStudent && (
              <div>
                <label className="text-sm font-medium mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              )}
              <div className="flex items-end col-span-1 sm:col-span-2">
                <Button variant="outline" onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} className="w-full">
                  Clear Filters
                </Button>
              </div>
            </div>
          )}

          {/* Create Button */}
          {(instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher') && canAdd && (
            <div className="flex justify-end">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-1" /> Create Homework
              </Button>
            </div>
          )}

          {/* Homework List */}
          {filteredHomework.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-1">No Homework Found</h3>
              <p className="text-muted-foreground text-sm">No homework assignments match your criteria.</p>
            </div>
          ) : viewMode === 'table' ? (
            <Paper sx={{ width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 96px)' }}>
              <MuiTableContainer sx={{ flex: 1, overflow: 'auto' }}>
                <MuiTable stickyHeader aria-label="homework table">
                  <MuiTableHead>
                    <MuiTableRow>
                      <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Title</MuiTableCell>
                      <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Start Date</MuiTableCell>
                      <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Due Date</MuiTableCell>
                      <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Teacher</MuiTableCell>
                      {isStudent && <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Status</MuiTableCell>}
                      <MuiTableCell sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Active</MuiTableCell>
                      {(instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher') && (
                        <MuiTableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Submissions</MuiTableCell>
                      )}
                      <MuiTableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'hsl(var(--muted))', color: 'hsl(var(--foreground))', borderBottom: '1px solid hsl(var(--border))' }}>Actions</MuiTableCell>
                    </MuiTableRow>
                  </MuiTableHead>
                  <MuiTableBody>
                    {filteredHomework
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((hw) => {
                      const status = isStudent ? getSubmissionStatus(hw) : null;
                      return (
                        <MuiTableRow hover key={hw.id}>
                          <MuiTableCell sx={{ fontWeight: 500, maxWidth: 200 }}>{hw.title}</MuiTableCell>
                          <MuiTableCell>{hw.startDate ? new Date(hw.startDate).toLocaleDateString() : '-'}</MuiTableCell>
                          <MuiTableCell>{hw.endDate ? new Date(hw.endDate).toLocaleDateString() : '-'}</MuiTableCell>
                          <MuiTableCell>{hw.teacher?.name || '-'}</MuiTableCell>
                          {isStudent && (
                            <MuiTableCell>
                              {status === 'not_submitted' && <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-xs">Pending</Badge>}
                              {status === 'submitted' && <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-xs">Submitted</Badge>}
                              {status === 'corrected' && <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30 text-xs">Corrected</Badge>}
                            </MuiTableCell>
                          )}
                          <MuiTableCell>
                            <Badge variant={hw.isActive ? 'default' : 'secondary'} className="text-xs">{hw.isActive ? 'Active' : 'Inactive'}</Badge>
                          </MuiTableCell>
                          {(instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher') && (
                            <MuiTableCell align="center">
                              <Button size="sm" variant="outline" onClick={() => handleViewSubmissions(hw)} title="View Submissions">
                                <Users className="h-4 w-4 mr-1" /> View Submissions
                              </Button>
                            </MuiTableCell>
                          )}
                          <MuiTableCell align="center">
                            <div className="flex items-center justify-center gap-1">
                              <Button size="sm" variant="ghost" onClick={() => handleViewHomework(hw)} title="View"><Eye className="h-4 w-4" /></Button>
                              {(instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher') && (
                                <>
                                  {canEdit && <Button size="sm" variant="ghost" onClick={() => handleEditHomework(hw)} title="Edit"><Edit className="h-4 w-4" /></Button>}
                                  {canDelete && <Button size="sm" variant="destructive" onClick={() => handleDeleteHomework(hw)} title="Delete" className="h-8 px-3 text-xs">Delete</Button>}
                                </>
                              )}
                              {isStudent && !isViewingAsParent && <Button size="sm" variant="ghost" onClick={() => handleSubmitHomework(hw)} title="Submit"><Upload className="h-4 w-4" /></Button>}
                            </div>
                          </MuiTableCell>
                        </MuiTableRow>
                      );
                    })}
                    {filteredHomework.length === 0 && (
                      <MuiTableRow>
                        <MuiTableCell colSpan={isStudent ? 8 : 8} align="center">
                          <div className="py-8 text-muted-foreground text-sm">No records found</div>
                        </MuiTableCell>
                      </MuiTableRow>
                    )}
                  </MuiTableBody>
                </MuiTable>
              </MuiTableContainer>
              <MuiTablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={filteredHomework.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
                sx={{ flexShrink: 0, borderTop: '1px solid hsl(var(--border))' }}
              />
            </Paper>
          ) : (
            <div className="space-y-2">
              {filteredHomework.map((hw) => {
                const isExpanded = expandedId === hw.id;
                const status = isStudent ? getSubmissionStatus(hw) : null;
                
                return (
                  <Card 
                    key={hw.id} 
                    className={cn(
                      "rounded-xl border transition-all duration-200 overflow-hidden",
                      isExpanded && "ring-1 ring-primary/20 shadow-md"
                    )}
                  >
                    <button
                      onClick={() => toggleExpand(hw.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                          <BookOpen className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{hw.title}</h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            {hw.endDate && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Due: {new Date(hw.endDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {isStudent && status === 'not_submitted' && (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 dark:bg-amber-950/30 text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" /> Pending
                          </Badge>
                        )}
                        {isStudent && status === 'submitted' && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50 dark:bg-blue-950/30 text-xs">
                            <Clock className="h-3 w-3 mr-1" /> Submitted
                          </Badge>
                        )}
                        {isStudent && status === 'corrected' && (
                          <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 dark:bg-green-950/30 text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" /> Corrected
                          </Badge>
                        )}
                        {!hw.isActive && (
                          <Badge variant="secondary" className="text-xs">Inactive</Badge>
                        )}
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <CardContent className="px-4 pb-4 pt-0 space-y-4 border-t">
                        {hw.description && (
                          <p className="text-sm text-muted-foreground pt-3">{hw.description}</p>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                          {hw.startDate && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Start Date</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{new Date(hw.startDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {hw.endDate && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Due Date</span>
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{new Date(hw.endDate).toLocaleDateString()}</span>
                            </div>
                          )}
                          {hw.teacher && (
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Teacher</span>
                              <span>{hw.teacher.name || 'N/A'}</span>
                            </div>
                          )}
                        </div>

                        {isStudent && (hw.mySubmissions || []).length > 0 && (() => {
                          const latest = hw.mySubmissions[0];
                          return (
                            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
                              <h4 className="text-xs font-medium uppercase tracking-wide text-muted-foreground">My Submission</h4>
                              <div className="flex flex-wrap gap-2">
                                {(latest.fileUrl || latest.driveViewUrl) && (
                                  <Button size="sm" variant="outline" className="text-xs h-7 border-green-500 text-green-700 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-950" onClick={() => window.open(latest.fileUrl || latest.driveViewUrl, '_blank')}>
                                    <Eye className="h-3 w-3 mr-1" /> My File
                                  </Button>
                                )}
                                {latest.teacherCorrectionFileUrl && (
                                  <Button size="sm" variant="outline" className="text-xs h-7 border-red-500 text-red-700 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950" onClick={() => window.open(latest.teacherCorrectionFileUrl, '_blank')}>
                                    <Download className="h-3 w-3 mr-1" /> Correction
                                  </Button>
                                )}
                              </div>
                              {latest.remarks && (
                                <p className="text-xs text-muted-foreground flex items-start gap-1">
                                  <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />{latest.remarks}
                                </p>
                              )}
                            </div>
                          );
                        })()}

                        {hw.referenceLink && (
                          <Button size="sm" variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-700 dark:hover:bg-blue-950" onClick={() => window.open(hw.referenceLink, '_blank')}>
                            <FileText className="h-3 w-3 mr-1" /> References
                          </Button>
                        )}

                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                          <Button size="sm" variant="outline" onClick={() => handleViewHomework(hw)}>
                            <Eye className="h-3 w-3 mr-1" /> Details
                          </Button>
                          {(instituteRole === 'InstituteAdmin' || instituteRole === 'Teacher') && (
                            <>
                              <Button size="sm" variant="outline" onClick={() => handleViewSubmissions(hw)}>
                                <Users className="h-3 w-3 mr-1" /> Submissions
                              </Button>
                              {canEdit && (
                                <Button size="sm" variant="outline" onClick={() => handleEditHomework(hw)}>
                                  <Edit className="h-3 w-3 mr-1" /> Edit
                                </Button>
                              )}
                              {canDelete && (
                                <Button size="sm" variant="destructive" onClick={() => handleDeleteHomework(hw)}>
                                  Delete
                                </Button>
                              )}
                            </>
                          )}
                          {isStudent && !isViewingAsParent && (() => {
                            const hasSubmission = (hw.mySubmissions || []).length > 0;
                            if (hasSubmission) {
                              const latest = hw.mySubmissions[0];
                              const status = latest.status || (latest.teacherCorrectionFileUrl ? 'Corrected' : 'Submitted');
                              return (
                                <Badge variant="secondary" className="text-xs h-7 px-3 flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                  <CheckCircle className="h-3 w-3" /> {status}
                                </Badge>
                              );
                            }
                            return (
                              <Button size="sm" onClick={() => handleSubmitHomework(hw)}>
                                <Upload className="h-3 w-3 mr-1" /> Submit
                              </Button>
                            );
                          })()}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Homework</DialogTitle>
          </DialogHeader>
          <CreateHomeworkForm 
            onSuccess={handleCreateHomework}
            onClose={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Homework</DialogTitle>
          </DialogHeader>
          {selectedHomeworkData && (
            <UpdateHomeworkForm 
              homework={selectedHomeworkData}
              onSuccess={handleUpdateHomework}
              onClose={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit Homework</DialogTitle>
          </DialogHeader>
          {selectedHomeworkData && (
            <SubmitHomeworkForm 
              homework={selectedHomeworkData}
              onSuccess={handleSubmissionSuccess}
              onClose={() => setIsSubmitDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Homework Details Dialog */}
      <HomeworkDetailsDialog
        isOpen={isViewDialogOpen}
        onClose={() => {
          setIsViewDialogOpen(false);
          setSelectedHomeworkData(null);
        }}
        homework={selectedHomeworkData}
      />

    </div>
  );
};

export default Homework;
