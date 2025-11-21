import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { cachedApiClient } from '@/api/cachedClient';
import { toast } from 'sonner';

/**
 * Hook to sync URL params with AuthContext
 * Loads institute/class/subject data based on URL and validates access
 */
export const useRouteContext = () => {
  const params = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isValidating, setIsValidating] = useState(true);
  const { 
    selectedInstitute,
    selectedClass,
    selectedSubject,
    selectedChild,
    selectedOrganization,
    selectedTransport,
    setSelectedInstitute,
    setSelectedClass,
    setSelectedSubject,
    user
  } = useAuth();

  useEffect(() => {
    const syncContextFromUrl = async () => {
      if (!user) {
        setIsValidating(false);
        return;
      }

      setIsValidating(true);
      
      // Sync URL params to context
      const urlInstituteId = params.instituteId;
      const urlClassId = params.classId;
      const urlSubjectId = params.subjectId;

      console.log('🔄 [RouteContext] Syncing URL to context:', {
        urlParams: { instituteId: urlInstituteId, classId: urlClassId, subjectId: urlSubjectId },
        currentContext: {
          institute: selectedInstitute?.id,
          class: selectedClass?.id,
          subject: selectedSubject?.id
        }
      });

      try {
        // Load institute if URL has it and context doesn't match
        if (urlInstituteId && selectedInstitute?.id?.toString() !== urlInstituteId) {
          console.log('🏢 [RouteContext] Loading institute from URL:', urlInstituteId);
          const institute = await cachedApiClient.get(`/institutes/${urlInstituteId}`);
          if (institute) {
            console.log('✅ [RouteContext] Institute loaded:', institute.name || institute.instituteName);
            setSelectedInstitute({
              id: institute.id || institute.instituteId,
              name: institute.name || institute.instituteName,
              code: institute.code,
              description: institute.description || institute.address,
              isActive: institute.isActive,
              type: institute.type || institute.instituteType,
              userRole: institute.userRole || institute.instituteUserType
            });
          }
        }

        // Load class if URL has it and context doesn't match
        if (urlClassId && selectedClass?.id?.toString() !== urlClassId && urlInstituteId) {
          console.log('📚 [RouteContext] Loading class from URL:', urlClassId);
          const classData = await cachedApiClient.get(`/institutes/${urlInstituteId}/classes/${urlClassId}`);
          if (classData) {
            console.log('✅ [RouteContext] Class loaded:', classData.name || classData.className);
            setSelectedClass({
              id: classData.id || classData.classId,
              name: classData.name || classData.className,
              code: classData.code || '',
              description: classData.description || '',
              grade: classData.grade,
              specialty: classData.specialty || classData.section || ''
            });
          }
        }

        // Load subject if URL has it and context doesn't match
        if (urlSubjectId && selectedSubject?.id?.toString() !== urlSubjectId && urlClassId) {
          console.log('📖 [RouteContext] Loading subject from URL:', urlSubjectId);
          const subject = await cachedApiClient.get(`/classes/${urlClassId}/subjects/${urlSubjectId}`);
          if (subject) {
            console.log('✅ [RouteContext] Subject loaded:', subject.name || subject.subjectName);
            setSelectedSubject({
              id: subject.id || subject.subjectId,
              name: subject.name || subject.subjectName,
              code: subject.code,
              description: subject.description,
              isActive: subject.isActive
            });
          }
        }
        
        setIsValidating(false);
      } catch (error: any) {
        console.error('❌ [RouteContext] Failed to load context from URL:', error);
        
        // Check if it's a 403/404/401 error
        const status = error.response?.status;
        if (status === 403) {
          toast.error('Access Denied', {
            description: 'You do not have permission to access this resource',
            duration: 5000
          });
          
          // Redirect based on what failed - preserve query params
          const searchParams = new URLSearchParams(location.search);
          const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
          
          if (urlSubjectId && error.config?.url?.includes('subjects')) {
            navigate(`/institute/${urlInstituteId}/class/${urlClassId}/dashboard${queryString}`, { replace: true });
          } else if (urlClassId && error.config?.url?.includes('classes')) {
            navigate(`/institute/${urlInstituteId}/dashboard${queryString}`, { replace: true });
          } else {
            navigate(`/dashboard${queryString}`, { replace: true });
          }
        } else if (status === 404) {
          toast.error('Not Found', {
            description: 'The requested resource does not exist',
            duration: 5000
          });
          navigate('/dashboard', { replace: true });
        } else if (status === 401) {
          toast.error('Authentication Required', {
            description: 'Please log in to access this resource',
            duration: 5000
          });
          navigate('/login', { replace: true });
        }
        
        setIsValidating(false);
      }
    };

    syncContextFromUrl();
  }, [
    params.instituteId,
    params.classId,
    params.subjectId,
    user
  ]);

  return {
    instituteId: params.instituteId,
    classId: params.classId,
    subjectId: params.subjectId,
    childId: params.childId,
    organizationId: params.organizationId,
    transportId: params.transportId,
    isValidating
  };
};
