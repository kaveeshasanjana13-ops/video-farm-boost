import React, { useState } from 'react';
import MUITable from '@/components/ui/mui-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

import { RefreshCw, Filter, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { AccessControl } from '@/utils/permissions';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import CreateSubjectForm from '@/components/forms/CreateSubjectForm';
import AssignSubjectToClassForm from '@/components/forms/AssignSubjectToClassForm';
import { useTableData } from '@/hooks/useTableData';
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
  instituteType: string | null;
  imgUrl: string | null;
  createdAt: string;
  updatedAt: string;
}
const Subjects = () => {
  const {
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    selectedInstituteType,
    currentInstituteId,
    currentClassId,
    currentSubjectId
  } = useAuth();
  const {
    toast
  } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedSubjectData, setSelectedSubjectData] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const userRole = useInstituteRole();

  // Enhanced pagination with useTableData hook - DISABLE AUTO-LOADING
  const tableData = useTableData<SubjectData>({
    endpoint: '/subjects',
    defaultParams: {
      ...(selectedInstituteType && {
        instituteType: selectedInstituteType
      })
    },
    cacheOptions: {
      ttl: 15, // Cache for 15 minutes
      userId: user?.id,
      role: userRole || 'User',
      instituteId: currentInstituteId || undefined
    },
    dependencies: [], // Remove dependencies to prevent auto-reloading
    pagination: {
      defaultLimit: 50,
      availableLimits: [25, 50, 100]
    },
    autoLoad: true, // Enable auto-loading from cache // DISABLE AUTO-LOADING
  });
  const {
    state: {
      data: subjectsData,
      loading: isLoading
    },
    pagination,
    actions
  } = tableData;
  const dataLoaded = subjectsData.length > 0;
  const isInstituteAdmin = userRole === 'InstituteAdmin';
  const canEdit = AccessControl.hasPermission(userRole, 'edit-subject') && !isInstituteAdmin;
  const canDelete = AccessControl.hasPermission(userRole, 'delete-subject') && !isInstituteAdmin;
  const canCreate = userRole === 'InstituteAdmin';
  const canAssignSubjects = userRole === 'InstituteAdmin' || userRole === 'Teacher';
  const handleLoadData = async () => {
    if (!currentInstituteId) {
      toast({
        title: "Error",
        description: "Please select an institute first.",
        variant: "destructive"
      });
      return;
    }

    // Update filters and reload data
    const newFilters = {
      ...(selectedInstituteType && {
        instituteType: selectedInstituteType
      })
    };
    actions.updateFilters(newFilters);
    actions.refresh();
  };
  const getBaseUrl = () => {
    return import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
  };

  const resolveImageUrl = (url?: string | null) => {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('http')) return url;
    const base = getBaseUrl();
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const subjectsColumns = [{
    id: 'imgUrl',
    key: 'imgUrl',
    header: 'Image',
    format: (value: string | null, row: any) => (
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
        <img
          src={resolveImageUrl(row?.imgUrl || value)}
          alt={row?.name ? `Subject ${row.name}` : 'Subject image'}
          className="w-full h-full object-cover"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
        />
      </div>
    )
  }, {
    key: 'code',
    header: 'Code'
  }, {
    key: 'name',
    header: 'Name'
  }, {
    key: 'description',
    header: 'Description'
  }, {
    key: 'category',
    header: 'Category'
  }, {
    key: 'creditHours',
    header: 'Credit Hours'
  }, {
    key: 'subjectType',
    header: 'Type'
  }, {
    key: 'basketCategory',
    header: 'Basket'
  }, {
    key: 'isActive',
    header: 'Status',
    render: (value: boolean) => <Badge variant={value ? 'default' : 'secondary'}>
          {value ? 'Active' : 'Inactive'}
        </Badge>
  }];
  const handleCreateSubject = async (subjectData: any) => {
    if (!currentInstituteId) {
      toast({
        title: "Error",
        description: "Please select an institute first.",
        variant: "destructive"
      });
      return;
    }
    try {
      toast({
        title: "Subject Created",
        description: `Subject ${subjectData.name} has been created successfully.`
      });
      setIsCreateDialogOpen(false);
      // Refresh data after creation
      actions.refresh();
    } catch (error: any) {
      console.error('Error in handleCreateSubject:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Failed to create subject.",
        variant: "destructive"
      });
    }
  };
  const handleEditSubject = (subject: any) => {
    console.log('Edit subject:', subject);
    setSelectedSubjectData(subject);
    setIsEditDialogOpen(true);
  };
  const handleUpdateSubject = (subjectData: any) => {
    console.log('Updating subject:', subjectData);
    toast({
      title: "Subject Updated",
      description: `Subject ${subjectData.name} has been updated successfully.`
    });
    setIsEditDialogOpen(false);
    setSelectedSubjectData(null);
    // Refresh data after update
    actions.refresh();
  };
  const handleDeleteSubject = (subject: any) => {
    console.log('Delete subject:', subject);
    toast({
      title: "Subject Deleted",
      description: `Subject ${subject.name} has been deleted.`,
      variant: "destructive"
    });
  };
  const handleViewSubject = (subject: any) => {
    console.log('View subject details:', subject);
    toast({
      title: "View Subject",
      description: `Viewing subject: ${subject.name}`
    });
  };
  const getContextTitle = () => {
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
    let title = 'Subjects Management';
    if (contexts.length > 0) {
      title += ` (${contexts.join(' → ')})`;
    }
    return title;
  };
  const customActions = isInstituteAdmin ? [] : [{
    label: 'View',
    action: (subject: any) => handleViewSubject(subject),
    icon: <Eye className="h-3 w-3" />,
    variant: 'outline' as const
  }, ...(canEdit ? [{
    label: 'Edit',
    action: (subject: any) => handleEditSubject(subject),
    icon: <Edit className="h-3 w-3" />,
    variant: 'outline' as const
  }] : []), ...(canDelete ? [{
    label: 'Delete',
    action: (subject: any) => handleDeleteSubject(subject),
    icon: <Trash2 className="h-3 w-3" />,
    variant: 'destructive' as const
  }] : [])];
  return <div className="space-y-6">
      {!dataLoaded ? <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {getContextTitle()}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Click the button below to load subjects data
          </p>
          <Button onClick={handleLoadData} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
            {isLoading ? <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Loading Data...
              </> : <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Load Data
              </>}
          </Button>
        </div> : <>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getContextTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage academic subjects, curriculum planning, and subject assignments
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
              
              {canCreate && <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2" size="sm">
                   <Plus className="h-4 w-4" />
                   <span className="hidden sm:inline">Create Subject</span>
                   <span className="sm:hidden">Create</span>
                 </Button>}
                
                {(userRole === 'InstituteAdmin' || (canAssignSubjects && dataLoaded && subjectsData.length > 0)) && (
                  <Button onClick={() => setIsAssignDialogOpen(true)} style={{ backgroundColor: '#06923E' }} className="hover:opacity-90 text-white flex items-center gap-2" size="sm">
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Assign Subject</span>
                    <span className="sm:hidden">Assign</span>
                  </Button>
                )}
            </div>
            
            <Button onClick={handleLoadData} disabled={isLoading} variant="outline" size="sm">
              <RefreshCw className={`h-4 w-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'Refreshing...' : 'Refresh Data'}</span>
            </Button>
          </div>

          {showFilters && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border mb-6">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Search Subjects
                </label>
                <Input placeholder="Search subjects..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full" />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
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
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  Category
                </label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Core">Core</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                    <SelectItem value="Elective">Elective</SelectItem>
                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>}

          {/* Unified Table View for all devices */}
          <div className="w-full overflow-x-auto">
            <MUITable
              title="Subjects"
              data={subjectsData || []}
              columns={subjectsColumns.map(col => ({
                id: col.key,
                label: col.header,
                minWidth: 170,
                format: col.render || col.format
              }))}
              onEdit={!isInstituteAdmin && canEdit ? handleEditSubject : undefined}
              onDelete={!isInstituteAdmin && canDelete ? handleDeleteSubject : undefined}
              onView={!isInstituteAdmin ? handleViewSubject : undefined}
              page={pagination.page}
              rowsPerPage={pagination.limit}
              totalCount={pagination.totalCount}
              onPageChange={(newPage: number) => actions.setPage(newPage)}
              onRowsPerPageChange={(newLimit: number) => actions.setLimit(newLimit)}
              sectionType="subjects"
              allowEdit={!isInstituteAdmin && canEdit}
              allowDelete={!isInstituteAdmin && canDelete}
            />
          </div>
        </>}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Subject</DialogTitle>
          </DialogHeader>
          <CreateSubjectForm onSubmit={handleCreateSubject} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <CreateSubjectForm initialData={selectedSubjectData} onSubmit={handleUpdateSubject} onCancel={() => {
          setIsEditDialogOpen(false);
          setSelectedSubjectData(null);
        }} />
        </DialogContent>
      </Dialog>

      {/* Assign Subject Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Assign Subjects to Class</DialogTitle>
          </DialogHeader>
          <AssignSubjectToClassForm onSuccess={() => {
          setIsAssignDialogOpen(false);
          toast({
            title: "Success",
            description: "Subjects assigned successfully!"
          });
        }} onCancel={() => setIsAssignDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>;
};
export default Subjects;