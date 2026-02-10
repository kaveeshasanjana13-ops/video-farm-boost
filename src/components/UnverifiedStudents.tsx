import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, UserCheck, UserX, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { getBaseUrl, getApiHeadersAsync, getCredentialsMode } from '@/contexts/utils/auth.api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getImageUrl } from '@/utils/imageUrlHelper';

interface UnverifiedStudent {
  id: string;
  userId: string;
  studentId: string;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    imageUrl: string;
    dateOfBirth: string;
    gender: string;
  };
}

interface NewUnverifiedStudent {
  id: string;
  name: string;
  phoneNumber: string;
  imageUrl: string;
  userIdByInstitute: string;
  studentUserId: string;
  enrollmentDate: string;
  enrollmentMethod: string;
  isVerified: number;
  isActive: number;
}

interface SubjectUnverifiedStudent {
  instituteId: string;
  classId: string;
  subjectId: string;
  studentId: string;
  studentFirstName: string;
  studentLastName: string;
  studentEmail: string;
  studentImageUrl: string;
  enrollmentMethod: string;
  verificationStatus: string;
  enrolledAt: any;
}

interface InstituteClassUnverifiedResponse {
  message: string;
  classId: string;
  className: string;
  classCode: string;
  instituteId: string;
  students: NewUnverifiedStudent[];
  count: number;
  totalPendingVerifications: number;
}

const UnverifiedStudents = () => {
  const { user, selectedInstitute, selectedClass, selectedSubject } = useAuth();
  const userRole = useInstituteRole();
  const [students, setStudents] = useState<(UnverifiedStudent | NewUnverifiedStudent | SubjectUnverifiedStudent)[]>([]);
  const [loading, setLoading] = useState(false);
  const [verifyingIds, setVerifyingIds] = useState<Set<string>>(new Set());
  const [hasData, setHasData] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [limit, setLimit] = useState(50);
  const [rowsPerPageOptions] = useState([25, 50, 100]);
  const [previewImage, setPreviewImage] = useState<{ url: string; name: string } | null>(null);

  const fetchUnverifiedStudents = async (page: number = 0, forceRefresh = false) => {
    if (!selectedInstitute || !selectedClass) return;
    
    setLoading(true);
    try {
      let endpoint = '';
      
      if (selectedSubject) {
        endpoint = `/institute-class-subject-students/unverified-students/${selectedInstitute.id}/${selectedClass.id}/${selectedSubject.id}`;
      } else {
        endpoint = `/institute-classes/${selectedClass.id}/unverified-students?limit=${limit}&page=${page + 1}`;
      }

      const data = await enhancedCachedClient.get(
        endpoint,
        {},
        {
          ttl: CACHE_TTL.UNVERIFIED_STUDENTS,
          forceRefresh,
          userId: user?.id,
          role: userRole,
          instituteId: selectedInstitute.id,
          classId: selectedClass.id,
          ...(selectedSubject ? { subjectId: selectedSubject.id } : {})
        }
      );
      
      if (selectedSubject) {
        const subjectStudents = Array.isArray(data) ? data : [];
        setStudents(subjectStudents);
        setTotalCount(subjectStudents.length);
        setTotalPages(1);
      } else {
        const responseData = data as InstituteClassUnverifiedResponse;
        const unverifiedStudents = responseData.students.filter(student => student.isVerified === 0);
        setStudents(unverifiedStudents);
        setTotalCount(responseData.totalPendingVerifications);
        setTotalPages(Math.ceil(responseData.totalPendingVerifications / limit));
        setCurrentPage(page);
      }
      
      setHasData(true);
    } catch (error) {
      console.error('Error fetching unverified students:', error);
      toast({
        title: "Error",
        description: "Failed to load unverified students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedInstitute && selectedClass) {
      fetchUnverifiedStudents(0, false);
    }
  }, [selectedInstitute?.id, selectedClass?.id, selectedSubject?.id, limit]);

  const handleVerifyStudent = async (studentIdentifier: string, approve: boolean) => {
    if (!selectedInstitute || !selectedClass) return;

    setVerifyingIds(prev => new Set(prev).add(studentIdentifier));
    
    try {
      const headers = await getApiHeadersAsync();
      let endpoint = '';
      let method = 'POST';
      let requestBody: any = {};
      
      if (selectedSubject) {
        const basePath = approve ? 'verify-enrollment' : 'reject-enrollment';
        endpoint = `${getBaseUrl()}/institute-class-subject-students/${basePath}/${selectedInstitute.id}/${selectedClass.id}/${selectedSubject.id}/${studentIdentifier}`;
        method = 'PATCH';
        requestBody = {};
      } else {
        endpoint = `${getBaseUrl()}/institutes/${selectedInstitute.id}/classes/${selectedClass.id}/students/verify-students`;
        method = 'POST';
        requestBody = {
          verifications: [
            {
              studentUserId: studentIdentifier,
              approve: approve,
              notes: approve ? "Approved by admin" : "Rejected by admin"
            }
          ]
        };
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        credentials: getCredentialsMode(),
        ...(Object.keys(requestBody).length > 0 ? { body: JSON.stringify(requestBody) } : {})
      };

      const response = await fetch(endpoint, fetchOptions);

      if (!response.ok) {
        throw new Error('Failed to verify student');
      }

      toast({
        title: approve ? "Student Approved" : "Student Rejected",
        description: `Student has been ${approve ? 'approved' : 'rejected'} successfully`
      });

      fetchUnverifiedStudents(currentPage);
    } catch (error) {
      console.error('Error verifying student:', error);
      toast({
        title: "Error",
        description: "Failed to verify student",
        variant: "destructive"
      });
    } finally {
      setVerifyingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(studentIdentifier);
        return newSet;
      });
    }
  };

  const getStudentKey = (student: UnverifiedStudent | NewUnverifiedStudent | SubjectUnverifiedStudent): string => {
    if ('studentId' in student && 'studentFirstName' in student) {
      return student.studentId;
    }
    if ('studentUserId' in student && student.studentUserId) {
      return student.studentUserId;
    }
    return student.id;
  };

  const getStudentId = (student: UnverifiedStudent | NewUnverifiedStudent | SubjectUnverifiedStudent): string => {
    if ('studentFirstName' in student) {
      return student.studentId;
    }
    if ('userIdByInstitute' in student) {
      return student.userIdByInstitute;
    }
    if ('studentId' in student) {
      return (student as UnverifiedStudent).studentId;
    }
    return (student as any).id || '';
  };

  const getStudentUser = (student: UnverifiedStudent | NewUnverifiedStudent | SubjectUnverifiedStudent) => {
    if ('studentFirstName' in student) {
      return {
        firstName: student.studentFirstName,
        lastName: student.studentLastName,
        email: student.studentEmail || 'N/A',
        phone: 'N/A',
        imageUrl: student.studentImageUrl || ''
      };
    }
    if ('user' in student && student.user) {
      return student.user;
    }
    if ('name' in student) {
      const nameParts = student.name.split(' ');
      return {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: 'N/A',
        phone: student.phoneNumber || 'N/A',
        imageUrl: student.imageUrl || ''
      };
    }
    return {
      firstName: 'Unknown',
      lastName: 'Student',
      email: 'N/A',
      phone: 'N/A',
      imageUrl: ''
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEnrollmentMethodBadge = (method: string) => {
    if (method === 'self_enrollment' || method === 'self_enrolled') {
      return <Badge variant="outline" className="text-blue-600 border-blue-200">Self Enrolled</Badge>;
    }
    return <Badge variant="outline" className="text-purple-600 border-purple-200">Teacher Assigned</Badge>;
  };

  const getContextTitle = () => {
    if (selectedSubject) {
      return `Unverified Students - ${selectedSubject.name}`;
    }
    return `Unverified Students - ${selectedClass?.name}`;
  };

  if (!['InstituteAdmin', 'Teacher'].includes(userRole)) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          You don't have permission to view unverified students.
        </AlertDescription>
      </Alert>
    );
  }

  if (!selectedInstitute || !selectedClass) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please select an institute and class to view unverified students.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{getContextTitle()}</h1>
          <p className="text-muted-foreground">
            {selectedSubject 
              ? `Students pending verification for ${selectedClass?.name} - ${selectedSubject.name}`
              : `Students pending verification for ${selectedClass?.name}`
            }
          </p>
        </div>
        <Button 
          onClick={() => fetchUnverifiedStudents(0, true)}
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {hasData ? (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ height: 'calc(100vh - 280px)' }}>
            <Table stickyHeader aria-label="unverified students table">
              <TableHead>
                <TableRow>
                  <TableCell>Avatar</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Join Date</TableCell>
                  <TableCell>Enrollment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                    const userData = getStudentUser(student);
                    const studentKey = getStudentKey(student);
                    const isNewStudent = 'enrollmentDate' in student;
                    const isSubjectStudent = 'studentFirstName' in student;
                    
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={studentKey}>
                        {/* Avatar - clickable */}
                        <TableCell>
                          <div 
                            className="cursor-pointer"
                            onClick={() => {
                              const imgUrl = userData.imageUrl;
                              if (imgUrl) {
                                setPreviewImage({ 
                                  url: getImageUrl(imgUrl), 
                                  name: `${userData.firstName} ${userData.lastName}` 
                                });
                              }
                            }}
                          >
                            <Avatar className="h-10 w-10 hover:ring-2 hover:ring-primary transition-all">
                              <AvatarImage src={getImageUrl(userData.imageUrl)} alt={userData.firstName} />
                              <AvatarFallback>
                                {userData.firstName[0]}{userData.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        </TableCell>
                        {/* Name */}
                        <TableCell>
                          <div>
                            <div className="font-medium">{userData.firstName} {userData.lastName}</div>
                            <div className="text-sm text-muted-foreground">ID: {getStudentId(student)}</div>
                          </div>
                        </TableCell>
                        {/* Join Date */}
                        <TableCell>
                          {isNewStudent ? (
                            <div className="text-sm">{formatDate((student as NewUnverifiedStudent).enrollmentDate)}</div>
                          ) : isSubjectStudent && (student as SubjectUnverifiedStudent).enrolledAt ? (
                            <div className="text-sm">{formatDate((student as SubjectUnverifiedStudent).enrolledAt)}</div>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        {/* Enrollment Method */}
                        <TableCell>
                          {isNewStudent ? (
                            getEnrollmentMethodBadge((student as NewUnverifiedStudent).enrollmentMethod)
                          ) : isSubjectStudent ? (
                            getEnrollmentMethodBadge((student as SubjectUnverifiedStudent).enrollmentMethod)
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        {/* Active/Inactive Status */}
                        <TableCell>
                          {isNewStudent ? (
                            <Badge variant={(student as NewUnverifiedStudent).isActive ? 'default' : 'secondary'}>
                              {(student as NewUnverifiedStudent).isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          ) : 'isActive' in student ? (
                            <Badge variant={(student as UnverifiedStudent).isActive ? 'default' : 'secondary'}>
                              {(student as UnverifiedStudent).isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        {/* Verification Status */}
                        <TableCell>
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            {isSubjectStudent ? (student as SubjectUnverifiedStudent).verificationStatus : 'Pending Verification'}
                          </Badge>
                        </TableCell>
                        {/* Actions */}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleVerifyStudent(studentKey, true)}
                              disabled={verifyingIds.has(studentKey)}
                              style={{ backgroundColor: '#28A158', color: 'white' }}
                              className="hover:opacity-90"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleVerifyStudent(studentKey, false)}
                              disabled={verifyingIds.has(studentKey)}
                              style={{ backgroundColor: '#CF0F0F', color: 'white' }}
                              className="hover:opacity-90"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                {students.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <div className="text-center py-8 text-muted-foreground">
                        No unverified students found
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={totalCount}
            rowsPerPage={limit}
            page={currentPage}
            onPageChange={(event: unknown, newPage: number) => {
              fetchUnverifiedStudents(newPage);
            }}
            onRowsPerPageChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const newLimit = parseInt(event.target.value, 10);
              setLimit(newLimit);
              setCurrentPage(0);
              fetchUnverifiedStudents(0);
            }}
          />
        </Paper>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Click "Load Students" to fetch unverified students
        </div>
      )}

      {/* Avatar Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-lg p-0">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle>{previewImage?.name}</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            {previewImage && (
              <img 
                src={previewImage.url} 
                alt={previewImage.name}
                className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnverifiedStudents;
