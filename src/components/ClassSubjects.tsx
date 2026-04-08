import React, { useState, useMemo } from 'react';
import MUITable from '@/components/ui/mui-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getImageUrl } from '@/utils/imageUrlHelper';

import { RefreshCw, Filter, UserPlus, UserMinus, Settings, Copy, Lock, Unlock, KeyRound, ChevronDown, BookOpen, ChevronsDownUp, ChevronsUpDown, LayoutGrid, Table2, Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useViewMode } from '@/hooks/useViewMode';
import { EmptyState } from '@/components/ui/EmptyState';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useTableData } from '@/hooks/useTableData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TeacherSelectorDialog } from '@/components/dialogs/TeacherSelectorDialog';
import { instituteApi } from '@/api/institute.api';
import { SUBJECT_TYPE_OPTIONS, BASKET_CATEGORY_OPTIONS } from '@/api/subjects.api';
import { getErrorMessage } from '@/api/apiError';
import { useNavigate } from 'react-router-dom';

interface TeacherInfo {
  id: string;
  firstName: string;
  lastName: string;
  nameWithInitials?: string;
  email: string;
  imageUrl?: string;
}

interface SubjectData {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  creditHours: number;
  isActive: boolean;
  subjectType: string;
  basketCategory: string;
  instituteId: string;
  imgUrl: string | null;
  createdAt: string;
  updatedAt: string;
  teacherId?: string;
  teacher?: TeacherInfo | null;
  classId?: string;
  subjectId?: string;
  enrollmentEnabled?: boolean;
  enrollmentKey?: string;
}

const ClassSubjects = () => {
  const {
    user,
    selectedInstitute,
    selectedClass,
    currentInstituteId,
    currentClassId
  } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subjectTypeFilter, setSubjectTypeFilter] = useState('all');
  const [basketCategoryFilter, setBasketCategoryFilter] = useState('all');
  const userRole = useInstituteRole();

  // Image preview state
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Teacher assignment state
  const [isTeacherSelectorOpen, setIsTeacherSelectorOpen] = useState(false);
  const [selectedSubjectForTeacher, setSelectedSubjectForTeacher] = useState<{
    subjectId: string;
    instituteId: string;
    classId: string;
  } | null>(null);
  const [isAssigningTeacher, setIsAssigningTeacher] = useState(false);
  const [isUnassigningTeacher, setIsUnassigningTeacher] = useState(false);
  const [showUnassignConfirm, setShowUnassignConfirm] = useState(false);
  const [subjectToUnassign, setSubjectToUnassign] = useState<SubjectData | null>(null);

  // Fetch class subjects - only when class is selected
  const endpoint = currentInstituteId && currentClassId
    ? `/institutes/${currentInstituteId}/classes/${currentClassId}/subjects`
    : '';

  const tableData = useTableData<SubjectData>({
    endpoint,
    defaultParams: {
      ...(currentInstituteId && { instituteId: currentInstituteId }),
    },
    cacheOptions: {
      ttl: 15,
      userId: user?.id,
      role: userRole || 'User',
      instituteId: currentInstituteId || undefined,
      classId: currentClassId || undefined
    },
    dependencies: [currentInstituteId, currentClassId],
    pagination: {
      defaultLimit: 10,
      availableLimits: [10, 25, 50, 100]
    },
    autoLoad: !!(currentInstituteId && currentClassId),
  });

  const {
    state: { data: subjectsData, loading: isLoading },
    pagination,
    actions
  } = tableData;
  
  // Transform nested API response to flattened structure for table
  const transformedData = useMemo(() => subjectsData.map((item: any) => {
    if (item.subject) {
      return {
        ...item.subject,
        teacher: item.teacher,
        teacherId: item.teacherId,
        instituteId: item.instituteId,
        classId: item.classId,
        subjectId: item.subjectId || item.subject?.id,
        enrollmentEnabled: item.enrollmentEnabled,
        enrollmentKey: item.enrollmentKey
      };
    }
    return {
      ...item,
      teacher: item.teacher || null,
      teacherId: item.teacherId || null,
      subjectId: item.id,
      enrollmentEnabled: item.enrollmentEnabled || false,
      enrollmentKey: item.enrollmentKey || null
    };
  }), [subjectsData]);
  
  const isInstituteAdmin = userRole === 'InstituteAdmin';
  const isTeacher = userRole === 'Teacher';
  const { viewMode, setViewMode } = useViewMode();

  // Client-side filtering — all filtering is done here, no server re-fetch on filter change
  const filteredSubjects = useMemo(() => {
    return transformedData.filter((subject: SubjectData) => {
      // Search filter
      if (searchTerm.trim()) {
        const s = searchTerm.toLowerCase();
        const matches =
          subject.name?.toLowerCase().includes(s) ||
          subject.code?.toLowerCase().includes(s) ||
          subject.description?.toLowerCase().includes(s);
        if (!matches) return false;
      }
      // Status filter — coerce to boolean in case API returns string
      if (statusFilter !== 'all') {
        const active = subject.isActive === true || (subject.isActive as any) === 'true';
        if (statusFilter === 'active' && !active) return false;
        if (statusFilter === 'inactive' && active) return false;
      }
      // Category filter — case-insensitive match
      if (categoryFilter !== 'all') {
        if (!subject.category || subject.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
      }
      // Subject type filter
      if (subjectTypeFilter !== 'all') {
        if (subject.subjectType !== subjectTypeFilter) return false;
      }
      // Basket category filter
      if (basketCategoryFilter !== 'all') {
        if (subject.basketCategory !== basketCategoryFilter) return false;
      }
      return true;
    });
  }, [transformedData, searchTerm, statusFilter, categoryFilter, subjectTypeFilter, basketCategoryFilter]);
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const CARD_INITIAL_SHOW = 6;
  const [showAllCards, setShowAllCards] = useState(false);

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return '/placeholder.svg';
    return getImageUrl(url);
  };

  const handleAssignTeacher = (subject: SubjectData) => {
    if (!currentInstituteId || !currentClassId) {
      toast({
        title: "Error",
        description: "Please select a class first to assign teachers to subjects",
        variant: "destructive"
      });
      return;
    }
    setSelectedSubjectForTeacher({
      subjectId: subject.subjectId || subject.id,
      instituteId: subject.instituteId || currentInstituteId,
      classId: subject.classId || currentClassId
    });
    setIsTeacherSelectorOpen(true);
  };

  const handleUnassignTeacher = (subject: SubjectData) => {
    if (!currentInstituteId || !currentClassId) {
      toast({
        title: "Error",
        description: "Please select a class first to manage subject teachers",
        variant: "destructive"
      });
      return;
    }
    setSubjectToUnassign(subject);
    setShowUnassignConfirm(true);
  };

  const confirmUnassignTeacher = async () => {
    if (!subjectToUnassign || isUnassigningTeacher) return;

    try {
      setIsUnassigningTeacher(true);
      await instituteApi.unassignTeacherFromSubject(
        subjectToUnassign.instituteId || currentInstituteId || '',
        subjectToUnassign.classId || currentClassId || '',
        subjectToUnassign.subjectId || subjectToUnassign.id
      );
      toast({
        title: "Success",
        description: "Teacher unassigned successfully"
      });
      setShowUnassignConfirm(false);
      setSubjectToUnassign(null);
      actions.refresh();
    } catch (error: any) {
      console.error('Error unassigning teacher:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error, 'Failed to unassign teacher'),
        variant: "destructive"
      });
    } finally {
      setIsUnassigningTeacher(false);
    }
  };

  const handleTeacherSelect = async (teacherId: string) => {
    if (!selectedSubjectForTeacher || isAssigningTeacher) return;

    try {
      setIsAssigningTeacher(true);
      await instituteApi.assignTeacherToSubject(
        selectedSubjectForTeacher.instituteId,
        selectedSubjectForTeacher.classId,
        selectedSubjectForTeacher.subjectId,
        teacherId
      );
      toast({
        title: "Success",
        description: "Teacher assigned successfully"
      });
      actions.refresh();
    } catch (error: any) {
      console.error('Error assigning teacher:', error);
      toast({
        title: "Error",
        description: getErrorMessage(error, 'Failed to assign teacher'),
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsAssigningTeacher(false);
    }
  };

  const handleManageEnrollment = (subject: SubjectData) => {
    const params = new URLSearchParams({
      instituteId: subject.instituteId || currentInstituteId || '',
      classId: subject.classId || currentClassId || '',
      subjectId: subject.subjectId || subject.id,
      subjectName: subject.name,
      className: selectedClass?.name || ''
    });
    navigate(`/enrollment-management?${params.toString()}`);
  };

  const copyEnrollmentKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      toast({
        title: "Copied",
        description: "Enrollment key copied to clipboard"
      });
    } catch (error: any) {
      toast({
        title: "Copy Failed",
        description: getErrorMessage(error, 'Failed to copy enrollment key'),
        variant: "destructive"
      });
    }
  };

  // Enrollment key dialog state
  const [enrollmentKeyDialog, setEnrollmentKeyDialog] = useState<{
    open: boolean;
    loading: boolean;
    subjectName: string;
    subjectInstituteId: string;
    subjectClassId: string;
    subjectId: string;
    editOnly: boolean;
    data: { subjectId: string; enrollmentEnabled: boolean; enrollmentKey: string | null; requiresVerification?: boolean } | null;
  }>({ open: false, loading: false, subjectName: '', subjectInstituteId: '', subjectClassId: '', subjectId: '', editOnly: false, data: null });

  const [enrollmentKeyEdit, setEnrollmentKeyEdit] = useState<{
    enabled: boolean;
    key: string;
    saving: boolean;
  }>({ enabled: false, key: '', saving: false });

  const handleFetchEnrollmentKey = async (subject: SubjectData) => {
    const instituteId = subject.instituteId || currentInstituteId || '';
    const classId = subject.classId || currentClassId || '';
    const subjectId = subject.subjectId || subject.id;

    setEnrollmentKeyDialog({ open: true, loading: true, subjectName: subject.name, subjectInstituteId: instituteId, subjectClassId: classId, subjectId, editOnly: false, data: null });

    try {
      const { tokenStorageService } = await import('@/services/tokenStorageService');
      const token = await tokenStorageService.getAccessToken();
      const { getBaseUrl } = await import('@/contexts/utils/auth.api');
      const response = await fetch(
        `${getBaseUrl()}/institutes/${instituteId}/classes/${classId}/subjects/${subjectId}/enrollment-key`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch enrollment key');
      const data = await response.json();
      setEnrollmentKeyDialog(prev => ({ ...prev, loading: false, data }));
      setEnrollmentKeyEdit({ enabled: data.enrollmentEnabled, key: data.enrollmentKey || '', saving: false });
    } catch (error: any) {
      console.error('Error fetching enrollment key:', error);
      toast({ title: "Error", description: getErrorMessage(error, 'Failed to fetch enrollment key'), variant: "destructive" });
      setEnrollmentKeyDialog(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleUpdateEnrollmentKeyDirect = async (subject: SubjectData) => {
    const instituteId = subject.instituteId || currentInstituteId || '';
    const classId = subject.classId || currentClassId || '';
    const subjectId = subject.subjectId || subject.id;

    setEnrollmentKeyDialog({ open: true, loading: true, subjectName: subject.name, subjectInstituteId: instituteId, subjectClassId: classId, subjectId, editOnly: true, data: null });

    try {
      const { tokenStorageService } = await import('@/services/tokenStorageService');
      const token = await tokenStorageService.getAccessToken();
      const { getBaseUrl } = await import('@/contexts/utils/auth.api');
      const response = await fetch(
        `${getBaseUrl()}/institutes/${instituteId}/classes/${classId}/subjects/${subjectId}/enrollment-key`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      if (!response.ok) throw new Error('Failed to fetch enrollment key');
      const data = await response.json();
      setEnrollmentKeyDialog(prev => ({ ...prev, loading: false, data }));
      // Start with empty key so the user must type a new one intentionally
      setEnrollmentKeyEdit({ enabled: data.enrollmentEnabled, key: '', saving: false });
    } catch (error: any) {
      console.error('Error fetching enrollment key:', error);
      toast({ title: "Error", description: getErrorMessage(error, 'Failed to fetch enrollment key'), variant: "destructive" });
      setEnrollmentKeyDialog(prev => ({ ...prev, open: false, loading: false }));
    }
  };

  const handleUpdateEnrollmentKey = async () => {
    const { subjectInstituteId, subjectClassId, subjectId } = enrollmentKeyDialog;
    if (!subjectInstituteId || !subjectClassId || !subjectId) return;
    setEnrollmentKeyEdit(prev => ({ ...prev, saving: true }));
    try {
      const { tokenStorageService } = await import('@/services/tokenStorageService');
      const token = await tokenStorageService.getAccessToken();
      const { getBaseUrl } = await import('@/contexts/utils/auth.api');
      const body: { enrollmentEnabled: boolean; enrollmentKey?: string } = { enrollmentEnabled: enrollmentKeyEdit.enabled };
      if (enrollmentKeyEdit.enabled && enrollmentKeyEdit.key.trim()) {
        body.enrollmentKey = enrollmentKeyEdit.key.trim();
      }
      const response = await fetch(
        `${getBaseUrl()}/institutes/${subjectInstituteId}/classes/${subjectClassId}/subjects/${subjectId}/enrollment-key`,
        {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        }
      );
      if (!response.ok) throw new Error('Failed to update enrollment key');
      const data = await response.json();
      setEnrollmentKeyEdit(prev => ({ ...prev, saving: false, key: data.enrollmentKey || '' }));
      toast({ title: "Updated", description: "Enrollment key updated successfully" });
      setEnrollmentKeyDialog(prev => ({ ...prev, open: false }));
      actions.refresh();
    } catch (error: any) {
      console.error('Error updating enrollment key:', error);
      toast({ title: "Error", description: getErrorMessage(error, 'Failed to update enrollment key'), variant: "destructive" });
      setEnrollmentKeyEdit(prev => ({ ...prev, saving: false }));
    }
  };

  const subjectsColumns = [
    {
      id: 'imgUrl',
      key: 'imgUrl',
      header: 'Image',
      format: (value: string | null, row: any) => (
        <div 
          className="w-16 h-16 rounded-lg overflow-hidden bg-muted cursor-pointer hover:ring-2 hover:ring-primary transition-all"
          onClick={() => {
            const imgUrl = row?.imgUrl || value;
            if (imgUrl) {
              setPreviewImage({ url: resolveImageUrl(imgUrl), title: `${row?.name || 'Subject'} - Subject Image` });
            }
          }}
        >
          <img
            src={resolveImageUrl(row?.imgUrl || value)}
            alt={row?.name ? `Subject ${row.name}` : 'Subject image'}
            className="w-full h-full object-cover"
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
          />
        </div>
      )
    },
    {
      key: 'code',
      header: 'Code'
    },
    {
      key: 'name',
      header: 'Name',
      format: (value: string | null) => value || <span className="text-muted-foreground italic">No name</span>
    },
    {
      key: 'description',
      header: 'Description',
      format: (value: string | null) => value || <span className="text-muted-foreground italic">No description</span>
    },
    {
      key: 'category',
      header: 'Category',
      format: (value: string | null) => value || <span className="text-muted-foreground italic">N/A</span>
    },
    {
      key: 'creditHours',
      header: 'Credit Hours',
      format: (value: number | null) => value !== null && value !== undefined ? value : <span className="text-muted-foreground italic">N/A</span>
    },
    {
      key: 'subjectType',
      header: 'Type',
      format: (value: string | null) => {
        if (!value) return <span className="text-muted-foreground italic">N/A</span>;
        const option = SUBJECT_TYPE_OPTIONS.find(o => o.value === value);
        const isBasket = value.includes('BASKET');
        return (
          <Badge variant={isBasket ? 'outline' : 'secondary'} className={isBasket ? 'border-purple-500 text-purple-700 dark:text-purple-300' : ''}>
            {option?.label || value}
          </Badge>
        );
      }
    },
    {
      key: 'basketCategory',
      header: 'Basket',
      format: (value: string | null, row: SubjectData) => {
        if (!value || !row.subjectType?.includes('BASKET')) {
          return <span className="text-muted-foreground italic">—</span>;
        }
        const option = BASKET_CATEGORY_OPTIONS.find(o => o.value === value);
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-700 dark:text-blue-300">
            {option?.label || value}
          </Badge>
        );
      }
    },
    {
      key: 'teacher',
      header: 'Teacher',
      format: (value: TeacherInfo | null) => (
        <div className="min-w-[180px]">
          {value ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={getImageUrl(value.imageUrl)} alt={value.firstName ? `${value.firstName} ${value.lastName}` : 'Teacher'} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                  {value.firstName?.[0] || 'T'}{value.lastName?.[0] || 'R'}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">
                  {value.nameWithInitials || `${value.firstName} ${value.lastName}`}
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  {value.email}
                </div>
              </div>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">No teacher assigned</span>
          )}
        </div>
      )
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (value: boolean) => (
        <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
      )
    },
    {
      key: 'enrollmentKey',
      header: 'Enrollment Key',
      format: (value: any, row: SubjectData) => (
        <div className="min-w-[100px] flex flex-col gap-1">
          <Button
            size="sm"
            className="h-8 px-3 hover:opacity-90"
            style={{ backgroundColor: '#28A158', color: 'white' }}
            onClick={() => handleFetchEnrollmentKey(row)}
          >
            <KeyRound className="h-4 w-4 mr-1" />
            Code
          </Button>
          {(isInstituteAdmin || isTeacher) && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 px-3 border-primary text-primary hover:bg-primary/10"
              onClick={() => handleUpdateEnrollmentKeyDirect(row)}
            >
              <Lock className="h-4 w-4 mr-1" />
              Update Key
            </Button>
          )}
        </div>
      )
    },
    ...(isInstituteAdmin ? [{
      key: 'teacherActions',
      header: 'Actions',
      format: (value: any, row: SubjectData) => (
        <div className="flex items-center gap-2">
          {row.teacher ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleUnassignTeacher(row)}
              disabled={isUnassigningTeacher || isAssigningTeacher}
              className="h-8 px-3"
              title="Remove teacher"
            >
              {isUnassigningTeacher && subjectToUnassign?.id === row.id ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <UserMinus className="h-4 w-4 mr-1" />
              )}
              {isUnassigningTeacher && subjectToUnassign?.id === row.id ? 'Removing...' : 'Remove'}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAssignTeacher(row)}
              disabled={isUnassigningTeacher || isAssigningTeacher}
              className="h-8 px-3"
              title="Assign teacher"
            >
              {isAssigningTeacher && selectedSubjectForTeacher?.subjectId === (row.subjectId || row.id) ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <UserPlus className="h-4 w-4 mr-1" />
              )}
              {isAssigningTeacher && selectedSubjectForTeacher?.subjectId === (row.subjectId || row.id) ? 'Assigning...' : 'Assign'}
            </Button>
          )}
        </div>
      )
    }] : [])
  ];

  const getContextTitle = () => {
    const contexts = [];
    if (selectedInstitute) {
      contexts.push(selectedInstitute.name);
    }
    if (selectedClass) {
      contexts.push(selectedClass.name);
    }
    let title = 'Class Subjects';
    if (contexts.length > 0) {
      title += ` (${contexts.join(' → ')})`;
    }
    return title;
  };

  // Show message if no class is selected
  if (!currentClassId) {
    return (
      <div className="space-y-6">
        <div className="text-center sm:text-left flex-1">
          <h1 className="text-3xl font-bold text-foreground mb-2">Class Subjects</h1>
          <p className="text-muted-foreground">Please select a class first to view and manage class subjects.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left flex-1">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {getContextTitle()}
        </h1>
        <p className="text-muted-foreground">
          View and manage subjects assigned to this class. Assign or unassign teachers for each subject.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Persistent search bar */}
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search subjects..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-9 pr-8 h-9"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 relative"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {(statusFilter !== 'all' || categoryFilter !== 'all' || subjectTypeFilter !== 'all' || basketCategoryFilter !== 'all') && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center font-bold">
                {[statusFilter !== 'all', categoryFilter !== 'all', subjectTypeFilter !== 'all', basketCategoryFilter !== 'all'].filter(Boolean).length}
              </span>
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={() => actions.refresh()} disabled={isLoading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          {/* Active filter chips */}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {statusFilter === 'active' ? 'Active' : 'Inactive'}
              <button onClick={() => setStatusFilter('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {categoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {categoryFilter}
              <button onClick={() => setCategoryFilter('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {subjectTypeFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {subjectTypeFilter}
              <button onClick={() => setSubjectTypeFilter('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
          {basketCategoryFilter !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
              {basketCategoryFilter}
              <button onClick={() => setBasketCategoryFilter('all')}><X className="h-3 w-3" /></button>
            </span>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 shrink-0">
          <button onClick={() => setViewMode('card')} className={`p-2 rounded-md transition-colors ${viewMode === 'card' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Card View"><LayoutGrid className="h-4 w-4" /></button>
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`} title="Table View"><Table2 className="h-4 w-4" /></button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border mb-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Status
            </label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Category
            </label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Languages">Languages</SelectItem>
                <SelectItem value="Arts">Arts</SelectItem>
                <SelectItem value="Commerce">Commerce</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Humanities">Humanities</SelectItem>
                <SelectItem value="Religion">Religion</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Subject Type
            </label>
            <Select value={subjectTypeFilter} onValueChange={setSubjectTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Subject Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {SUBJECT_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              Basket Category
            </label>
            <Select value={basketCategoryFilter} onValueChange={setBasketCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Basket Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Baskets</SelectItem>
                {BASKET_CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Card / Table View */}
      {viewMode === 'card' ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.length === 0 ? (
              <div className="col-span-full">
                {isLoading ? (
                  <div className="flex justify-center py-16"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                ) : (
                  <EmptyState icon={BookOpen} title="No Subjects Found" description="No subjects match your current filters." />
                )}
              </div>
            ) : (showAllCards ? filteredSubjects : filteredSubjects.slice(0, CARD_INITIAL_SHOW)).map((subject: SubjectData) => {
              const sid = subject.subjectId || subject.id;
              const imgUrl = resolveImageUrl(subject.imgUrl);
              const isBasket = subject.subjectType?.includes('BASKET');
              const typeOption = SUBJECT_TYPE_OPTIONS.find(o => o.value === subject.subjectType);
              const basketOption = BASKET_CATEGORY_OPTIONS.find(o => o.value === subject.basketCategory);
              const hasLongDesc = (subject.description?.length || 0) > 120;
              const isDescExpanded = expandedSubjectId === sid;

              return (
                <Card key={sid} className="overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col">
                  {/* Image banner */}
                  <div
                    className="relative h-32 bg-muted overflow-hidden cursor-pointer"
                    onClick={() => { if (subject.imgUrl) setPreviewImage({ url: imgUrl, title: `${subject.name} - Subject Image` }); }}
                  >
                    <img src={imgUrl} alt={subject.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }} />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <Badge variant={subject.isActive ? 'default' : 'secondary'} className={`text-xs ${subject.isActive ? 'bg-green-600' : 'bg-gray-500'}`}>
                        {subject.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Card body — always visible */}
                  <div className="p-4 flex-1 flex flex-col gap-2">
                    <div>
                      <h3 className="font-semibold text-base truncate">{subject.name}</h3>
                      <p className="text-xs text-muted-foreground font-mono">{subject.code}</p>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap gap-1">
                      {subject.category && <Badge variant="outline" className="text-[10px]">{subject.category}</Badge>}
                      {subject.subjectType && (
                        <Badge variant={isBasket ? 'outline' : 'secondary'} className={`text-[10px] ${isBasket ? 'border-purple-500 text-purple-700 dark:text-purple-300' : ''}`}>
                          {typeOption?.label || subject.subjectType}
                        </Badge>
                      )}
                      {subject.basketCategory && (
                        <Badge variant="outline" className="text-[10px] border-blue-500 text-blue-700 dark:text-blue-300">
                          {basketOption?.label || subject.basketCategory}
                        </Badge>
                      )}
                    </div>

                    {/* Info grid — always visible */}
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs mt-1">
                      {subject.creditHours != null && <div className="text-muted-foreground">Credits: <span className="text-foreground font-medium">{subject.creditHours}</span></div>}
                      <div className="text-muted-foreground">Type: <span className="text-foreground font-medium">{typeOption?.label || subject.subjectType || 'N/A'}</span></div>
                    </div>

                    {/* Description — with expand/collapse for long text */}
                    {subject.description && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <p className={!isDescExpanded && hasLongDesc ? 'line-clamp-2' : ''}>
                          {subject.description}
                        </p>
                        {hasLongDesc && (
                          <button
                            className="text-primary text-[10px] font-medium mt-0.5 hover:underline"
                            onClick={() => setExpandedSubjectId(isDescExpanded ? null : sid)}
                          >
                            {isDescExpanded ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Teacher — always visible */}
                    <div className="flex items-center gap-2 py-2 px-3 bg-muted/40 rounded-lg mt-1">
                      {subject.teacher ? (
                        <>
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={getImageUrl(subject.teacher.imageUrl)} />
                            <AvatarFallback className="text-[10px]">{subject.teacher.firstName?.[0]}{subject.teacher.lastName?.[0]}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium truncate">{subject.teacher.nameWithInitials || `${subject.teacher.firstName} ${subject.teacher.lastName}`}</p>
                            <p className="text-[10px] text-muted-foreground truncate">{subject.teacher.email}</p>
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No teacher assigned</p>
                      )}
                    </div>

                    {/* Action buttons — always visible */}
                    <div className="flex flex-col gap-1.5 mt-auto pt-2 border-t">
                      <Button size="sm" className="w-full h-7 text-xs" style={{ backgroundColor: '#28A158', color: 'white' }} onClick={() => handleFetchEnrollmentKey(subject)}>
                        <KeyRound className="h-3 w-3 mr-1.5" />Enrollment Key
                      </Button>
                      {(isInstituteAdmin || isTeacher) && (
                        <Button size="sm" variant="outline" className="w-full h-7 text-xs border-primary text-primary hover:bg-primary/10" onClick={() => handleUpdateEnrollmentKeyDirect(subject)}>
                          <Lock className="h-3 w-3 mr-1.5" />Update Key
                        </Button>
                      )}
                      {isInstituteAdmin && (
                        subject.teacher ? (
                          <Button size="sm" variant="destructive" className="w-full h-7 text-xs" onClick={() => handleUnassignTeacher(subject)} disabled={isUnassigningTeacher}>
                            <UserMinus className="h-3 w-3 mr-1.5" />Remove Teacher
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" className="w-full h-7 text-xs" onClick={() => handleAssignTeacher(subject)} disabled={isAssigningTeacher}>
                            <UserPlus className="h-3 w-3 mr-1.5" />Assign Teacher
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Show More / Show Less toggle */}
          {filteredSubjects.length > CARD_INITIAL_SHOW && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAllCards(!showAllCards)}
                className="gap-1.5"
              >
                {showAllCards ? (
                  <><ChevronsDownUp className="h-4 w-4" />Show Less ({CARD_INITIAL_SHOW} of {filteredSubjects.length})</>
                ) : (
                  <><ChevronsUpDown className="h-4 w-4" />Show All ({filteredSubjects.length} subjects)</>
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
      <div className="w-full overflow-x-auto">
        <MUITable
          title="Class Subjects"
          data={filteredSubjects}
          columns={subjectsColumns.map(col => ({
            id: col.key,
            label: col.header,
            minWidth: 170,
            format: col.render || col.format
          }))}
          page={pagination.page}
          rowsPerPage={pagination.limit}
          totalCount={pagination.totalCount}
          onPageChange={(newPage: number) => actions.setPage(newPage)}
          onRowsPerPageChange={(newLimit: number) => actions.setLimit(newLimit)}
          sectionType="class-subjects"
        />
      </div>
      )}

      {/* Teacher Selector Dialog */}
      <TeacherSelectorDialog
        isOpen={isTeacherSelectorOpen}
        onClose={() => {
          if (!isAssigningTeacher) {
            setIsTeacherSelectorOpen(false);
            setSelectedSubjectForTeacher(null);
          }
        }}
        onSelect={handleTeacherSelect}
        title="Assign Subject Teacher"
        description="Select a teacher to assign to this subject"
      />

      {/* Unassign Teacher Confirmation Dialog */}
      <AlertDialog open={showUnassignConfirm} onOpenChange={(open) => !isUnassigningTeacher && setShowUnassignConfirm(open)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Teacher Assignment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{subjectToUnassign?.teacher?.nameWithInitials || `${subjectToUnassign?.teacher?.firstName} ${subjectToUnassign?.teacher?.lastName}`}</strong> from teaching <strong>{subjectToUnassign?.name}</strong>?
              <br /><br />
              This will unassign the teacher from this subject but will not delete any related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUnassigningTeacher}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnassignTeacher}
              disabled={isUnassigningTeacher}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isUnassigningTeacher ? 'Removing...' : 'Remove Teacher'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-2xl p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{previewImage?.title}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {previewImage && (
              <img 
                src={previewImage.url} 
                alt={previewImage.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Enrollment Key — View Code Dialog */}
      <Dialog open={enrollmentKeyDialog.open && !enrollmentKeyDialog.editOnly} onOpenChange={(open) => !open && setEnrollmentKeyDialog(prev => ({ ...prev, open: false }))}>
        <DialogContent className="p-6 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Enrollment Code</DialogTitle>
          </DialogHeader>
          {enrollmentKeyDialog.loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : enrollmentKeyDialog.data ? (
            <div className="space-y-4 mt-1">
              {/* Code display card */}
              <div className="p-5 bg-muted/50 rounded-2xl text-center">
                <div className="text-sm text-muted-foreground mb-2">Subject Enrollment Code</div>
                <div className="text-4xl font-extrabold font-mono tracking-widest">
                  {enrollmentKeyDialog.data.enrollmentKey
                    ? enrollmentKeyDialog.data.enrollmentKey
                    : <span className="tracking-normal text-muted-foreground text-2xl">No code set</span>}
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3 px-4 border-l-4 border-blue-500 bg-muted/30 rounded-r-lg">
                  <span className="text-sm font-medium text-foreground">Subject ID</span>
                  <span className="text-3xl font-extrabold font-mono">{enrollmentKeyDialog.data.subjectId}</span>
                </div>
                <div className="flex items-center justify-between py-3 px-4 border-l-4 border-blue-500 bg-muted/30 rounded-r-lg">
                  <span className="text-sm font-medium text-foreground">Enrollment Enabled</span>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${
                    enrollmentKeyDialog.data.enrollmentEnabled ? 'bg-blue-500' : 'bg-gray-400'
                  }`}>
                    {enrollmentKeyDialog.data.enrollmentEnabled ? 'Yes' : 'No'}
                  </span>
                </div>
                {enrollmentKeyDialog.data.requiresVerification !== undefined && (
                  <div className="flex items-center justify-between py-3 px-4 border-l-4 border-blue-500 bg-muted/30 rounded-r-lg">
                    <span className="text-sm font-medium text-foreground">Requires Verification</span>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full text-white ${
                      enrollmentKeyDialog.data.requiresVerification ? 'bg-blue-500' : 'bg-gray-400'
                    }`}>
                      {enrollmentKeyDialog.data.requiresVerification ? 'Yes' : 'No'}
                    </span>
                  </div>
                )}
              </div>

              {/* Copy button */}
              <Button
                onClick={() => enrollmentKeyDialog.data?.enrollmentKey && copyEnrollmentKey(enrollmentKeyDialog.data.enrollmentKey)}
                disabled={!enrollmentKeyDialog.data.enrollmentKey}
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Code
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Enrollment Key — Update Dialog */}
      <Dialog open={enrollmentKeyDialog.open && enrollmentKeyDialog.editOnly} onOpenChange={(open) => !open && setEnrollmentKeyDialog(prev => ({ ...prev, open: false }))}>
        <DialogContent className="p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <KeyRound className="h-6 w-6 text-primary" />
              Update Enrollment Key
            </DialogTitle>
            <p className="text-sm text-muted-foreground pt-1">{enrollmentKeyDialog.subjectName}</p>
          </DialogHeader>
          {enrollmentKeyDialog.loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <RefreshCw className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading current settings...</p>
            </div>
          ) : enrollmentKeyDialog.data ? (
            <div className="space-y-6 mt-4">
              {/* Current key reference */}
              {enrollmentKeyDialog.data.enrollmentKey && (
                <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border border-border rounded-xl">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Current Key</p>
                    <p className="text-xl font-extrabold font-mono tracking-widest mt-0.5">{enrollmentKeyDialog.data.enrollmentKey}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyEnrollmentKey(enrollmentKeyDialog.data!.enrollmentKey!)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Enable / Disable toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/20">
                <div>
                  <Label htmlFor="enroll-enabled-u" className="text-base font-semibold cursor-pointer">Enable Enrollment</Label>
                  <p className="text-xs text-muted-foreground mt-0.5">Allow students to enroll using a key</p>
                </div>
                <Switch
                  id="enroll-enabled-u"
                  checked={enrollmentKeyEdit.enabled}
                  onCheckedChange={(checked) => setEnrollmentKeyEdit(prev => ({ ...prev, enabled: checked }))}
                  className="scale-125"
                />
              </div>

              {/* Key input */}
              <div className="space-y-2">
                <Label htmlFor="enroll-key-u" className="text-base font-semibold">
                  Enrollment Key
                </Label>
                <p className="text-xs text-muted-foreground -mt-1">Leave empty to allow open (keyless) enrollment</p>
                <Input
                  id="enroll-key-u"
                  value={enrollmentKeyEdit.key}
                  onChange={(e) => setEnrollmentKeyEdit(prev => ({ ...prev, key: e.target.value.toUpperCase() }))}
                  placeholder="e.g. MATH2026"
                  className="font-mono text-xl tracking-widest h-14 text-center uppercase placeholder:normal-case placeholder:tracking-normal placeholder:text-sm"
                  disabled={!enrollmentKeyEdit.enabled}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={() => setEnrollmentKeyDialog(prev => ({ ...prev, open: false }))}
                  disabled={enrollmentKeyEdit.saving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateEnrollmentKey}
                  disabled={enrollmentKeyEdit.saving}
                  className="flex-1 h-12 text-base font-semibold"
                >
                  {enrollmentKeyEdit.saving ? (
                    <><RefreshCw className="h-5 w-5 mr-2 animate-spin" />Saving...</>
                  ) : (
                    <><KeyRound className="h-5 w-5 mr-2" />Save Changes</>
                  )}
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassSubjects;
