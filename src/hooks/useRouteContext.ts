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
        },
        userHasInstitutes: user?.institutes?.length || 0
      });

      try {
        // STEP 1: Auto-select institute from URL if available
        if (urlInstituteId) {
          // Only set if not already selected OR if different institute
          if (!selectedInstitute || selectedInstitute.id?.toString() !== urlInstituteId) {
            console.log('🏢 [RouteContext] Auto-selecting institute from URL:', urlInstituteId);
            
            // Check if user has institutes loaded
            if (!user?.institutes || user.institutes.length === 0) {
              console.error('❌ [RouteContext] User has no institutes loaded');
              toast.error('No Access', {
                description: 'You do not have access to any institutes',
                duration: 5000
              });
              navigate('/dashboard', { replace: true });
              setIsValidating(false);
              return;
            }
            
            const institute = user.institutes.find(
              inst => inst.id?.toString() === urlInstituteId
            );
            
            if (!institute) {
              console.error('❌ [RouteContext] User does not have access to institute:', urlInstituteId);
              toast.error('Access Denied', {
                description: 'You do not have access to this institute',
                duration: 5000
              });
              navigate('/dashboard', { replace: true });
              setIsValidating(false);
              return;
            }
            
            console.log('✅ [RouteContext] Auto-selected institute:', institute.name);
            setSelectedInstitute(institute);
            
            // Clear dependent selections when changing institute
            if (selectedClass && !urlClassId) setSelectedClass(null);
            if (selectedSubject && !urlSubjectId) setSelectedSubject(null);
          }
        }

        // STEP 2: Auto-select class from URL if available
        if (urlClassId && urlInstituteId) {
          // Only load if not already selected OR if different class
          if (!selectedClass || selectedClass.id?.toString() !== urlClassId) {
            console.log('📚 [RouteContext] Auto-selecting class from URL:', urlClassId);
            
            try {
              const classData = await cachedApiClient.get(`/institutes/${urlInstituteId}/classes/${urlClassId}`);
              if (classData) {
                console.log('✅ [RouteContext] Auto-selected class:', classData.name || classData.className);
                setSelectedClass({
                  id: classData.id || classData.classId,
                  name: classData.name || classData.className,
                  code: classData.code || '',
                  description: classData.description || '',
                  grade: classData.grade,
                  specialty: classData.specialty || classData.section || ''
                });
                
                // Clear dependent selection when changing class
                if (selectedSubject && !urlSubjectId) setSelectedSubject(null);
              }
            } catch (error: any) {
              console.error('❌ Failed to load class:', error);
              if (error.response?.status === 403 || error.response?.status === 404) {
                toast.error('Class Not Found', {
                  description: 'The requested class does not exist or you don\'t have access',
                  duration: 5000
                });
                navigate(`/institute/${urlInstituteId}/dashboard`, { replace: true });
                setIsValidating(false);
                return;
              }
              throw error;
            }
          }
        }

        // STEP 3: Auto-select subject from URL if available
        if (urlSubjectId && urlClassId && urlInstituteId) {
          // Only load if not already selected OR if different subject
          if (!selectedSubject || selectedSubject.id?.toString() !== urlSubjectId) {
            console.log('📖 [RouteContext] Auto-selecting subject from URL:', urlSubjectId);
            
            try {
              const subject = await cachedApiClient.get(`/classes/${urlClassId}/subjects/${urlSubjectId}`);
              if (subject) {
                console.log('✅ [RouteContext] Auto-selected subject:', subject.name || subject.subjectName);
                setSelectedSubject({
                  id: subject.id || subject.subjectId,
                  name: subject.name || subject.subjectName,
                  code: subject.code,
                  description: subject.description,
                  isActive: subject.isActive
                });
              }
            } catch (error: any) {
              console.error('❌ Failed to load subject:', error);
              if (error.response?.status === 403 || error.response?.status === 404) {
                toast.error('Subject Not Found', {
                  description: 'The requested subject does not exist or you don\'t have access',
                  duration: 5000
                });
                navigate(`/institute/${urlInstituteId}/class/${urlClassId}/dashboard`, { replace: true });
                setIsValidating(false);
                return;
              }
              throw error;
            }
          }
        }
        
        console.log('✅ [RouteContext] Context sync complete');
        setIsValidating(false);
      } catch (error: any) {
        console.error('❌ [RouteContext] Critical error during context sync:', error);
        
        toast.error('Error', {
          description: 'Failed to load page context',
          duration: 5000
        });
        
        navigate('/dashboard', { replace: true });
        setIsValidating(false);
      }
    };

    syncContextFromUrl();
  }, [
    params.instituteId,
    params.classId,
    params.subjectId,
    user?.id,
    user?.institutes?.length // Re-run when institutes are loaded
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
