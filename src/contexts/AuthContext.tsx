
import React, { createContext, useState, useContext, useMemo, useCallback, useRef } from 'react';
import { 
  User, 
  Institute, 
  Class, 
  Subject, 
  Child, 
  Organization,
  LoginCredentials, 
  AuthContextType 
} from './types/auth.types';
import { loginUser, validateToken, logoutUser } from './utils/auth.api';
import { mapUserData } from './utils/user.utils';
import { Institute as ApiInstitute } from '@/api/institute.api';
import { cachedApiClient } from '@/api/cachedClient';
import { apiCache } from '@/utils/apiCache';
import { useAuthAutoRefresh } from '@/hooks/useAuthAutoRefresh';
import { secureCache } from '@/utils/secureCache';
import { attendanceDuplicateChecker } from '@/utils/attendanceDuplicateCheck';
import { attendanceApiClient } from '@/api/attendanceClient';
import { enhancedCachedClient } from '@/api/enhancedCachedClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedInstitute, setSelectedInstituteState] = useState<Institute | null>(null);
  const [selectedClass, setSelectedClassState] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubjectState] = useState<Subject | null>(null);
  const [selectedChild, setSelectedChildState] = useState<Child | null>(null);
  const [selectedOrganization, setSelectedOrganizationState] = useState<Organization | null>(null);
  const [selectedTransport, setSelectedTransportState] = useState<{ id: string; vehicleNumber: string; bookhireId: string } | null>(null);
  const [selectedInstituteType, setSelectedInstituteType] = useState<string | null>(null);
  const [selectedClassGrade, setSelectedClassGrade] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to show loading on init
  const [isInitialized, setIsInitialized] = useState(false);
  const [isViewingAsParent, setIsViewingAsParentState] = useState(false); // Parent viewing child's data

  // ✅ Keep session alive (web + mobile) by refreshing access token before expiry.
  useAuthAutoRefresh(isInitialized && !!user);

  // Public variables for current IDs - no localStorage sync
  const [currentInstituteId, setCurrentInstituteId] = useState<string | null>(null);
  const [currentClassId, setCurrentClassId] = useState<string | null>(null);
  const [currentSubjectId, setCurrentSubjectId] = useState<string | null>(null);
  const [currentChildId, setCurrentChildId] = useState<string | null>(null);
  const [currentOrganizationId, setCurrentOrganizationId] = useState<string | null>(null);
  const [currentTransportId, setCurrentTransportId] = useState<string | null>(null);

  // Use ref to access latest user in event handlers without re-subscribing
  const userRef = useRef(user);
  userRef.current = user;

  // Listen for token refresh events from API clients
  React.useEffect(() => {
    const handleRefreshSuccess = (event: Event) => {
      const customEvent = event as CustomEvent;
      const { user: refreshedUser } = customEvent.detail;
      console.log('🔄 Token refreshed, updating AuthContext user data');
      
      const currentUser = userRef.current;
      if (refreshedUser && currentUser) {
        setUser(prev => prev ? {
          ...prev,
          nameWithInitials: refreshedUser.nameWithInitials || prev.nameWithInitials,
          name: refreshedUser.nameWithInitials || prev.name,
          email: refreshedUser.email || prev.email,
          imageUrl: refreshedUser.imageUrl || prev.imageUrl,
          userType: refreshedUser.userType || prev.userType,
        } : prev);
        console.log('✅ AuthContext user updated after token refresh (nameWithInitials)');
      }
    };
    
    const handleRefreshFailed = () => {
      console.error('❌ Token refresh failed, logging out...');
      if (userRef.current) {
        logoutUser().then(() => {
          apiCache.clearAllCache();
          setUser(null);
        });
      }
    };
    
    window.addEventListener('auth:refresh-success', handleRefreshSuccess);
    window.addEventListener('auth:refresh-failed', handleRefreshFailed);
    
    return () => {
      window.removeEventListener('auth:refresh-success', handleRefreshSuccess);
      window.removeEventListener('auth:refresh-failed', handleRefreshFailed);
    };
  }, []); // Stable effect — uses refs for latest state

  const fetchUserInstitutes = async (userId: string, forceRefresh = false): Promise<Institute[]> => {
    try {
      console.log('Fetching user institutes from backend API:', { userId, forceRefresh });
      
      const apiInstitutesResponse = await cachedApiClient.get<
        ApiInstitute[] | { data?: ApiInstitute[]; meta?: any }
      >(
        `/users/${userId}/institutes`, 
        undefined, 
        { 
          forceRefresh,
          ttl: 60,
          useStaleWhileRevalidate: false
        }
      );
      
      console.log('Raw API institutes response:', apiInstitutesResponse);

      // The backend sometimes returns a wrapped shape: { data: [...], meta: {...} }
      // Normalize it to a plain array for downstream mapping.
      const apiInstitutes = Array.isArray(apiInstitutesResponse)
        ? apiInstitutesResponse
        : Array.isArray(apiInstitutesResponse?.data)
          ? apiInstitutesResponse.data
          : [];
      
      // Ensure apiInstitutes is an array and filter out any undefined/null values
      const validInstitutes = Array.isArray(apiInstitutes)
        ? apiInstitutes.filter((institute: any) => institute && (institute.id || institute.instituteId))
        : [];
      
      // Map API response to AuthContext Institute type with safe property access
      const institutes = validInstitutes.map((institute: any): Institute => ({
        id: institute.instituteId || institute.id || '',
        name: institute.instituteName || institute.name || 'Unknown Institute',
        code: institute.code || '',
        description: `${institute.instituteAddress || institute.address || ''}, ${institute.instituteCity || institute.city || ''}`.trim() || 'No description available',
        isActive: institute.instituteIsActive !== undefined ? institute.instituteIsActive : (institute.isActive !== undefined ? institute.isActive : true),
        type: institute.instituteType || institute.type,
        instituteUserType: institute.instituteUserType, // Preserve raw API value
        userRole: institute.instituteUserType, // Keep for backward compatibility
        userIdByInstitute: institute.userIdByInstitute,
        shortName: institute.instituteShortName || institute.name || 'Unknown Institute',
        instituteUserImageUrl: institute.instituteUserImageUrl || institute.userImageUrl || institute.imageUrl || '',
        logo: institute.logoUrl || institute.instituteLogo || ''
      }));

      console.log('Mapped institutes:', institutes);
      return institutes;
    } catch (error) {
      console.error('Error fetching user institutes:', error);
      return [];
    }
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      console.log('Starting login process...');
      
      const data = await loginUser(credentials);
      console.log('Login response received:', data);

      // Map user data WITHOUT fetching institutes (lazy load later)
      console.log('✅ User logged in successfully');
      const mappedUser = mapUserData(data.user, []); // Empty institutes initially
      setUser(mappedUser);
      
      // Fetch institutes in background (non-blocking)
      fetchUserInstitutes(data.user.id, true).then(institutes => {
        const updatedUser = mapUserData(data.user, institutes);
        setUser(updatedUser);
        console.log('🏢 Institutes loaded:', institutes.length);
      }).catch(error => {
        console.error('Error loading institutes (non-blocking):', error);
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Manual method to load user institutes - only called when user clicks
  const loadUserInstitutes = async (): Promise<Institute[]> => {
    if (!user?.id) {
      throw new Error('No user found');
    }
    
    setIsLoading(true);
    try {
      const institutes = await fetchUserInstitutes(user.id, true);
      
      // Update user with institutes
      const updatedUser = { ...user, institutes };
      setUser(updatedUser);
      
      return institutes;
    } catch (error) {
      console.error('Error loading user institutes:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('Logging out user...');
    
    // Get current userId before clearing state
    const currentUserId = user?.id;
    
    // Clear backend session and localStorage
    await logoutUser();
    
    // 🧹 ALWAYS CLEAR ALL CACHE ON LOGOUT (Security & Fresh Start)
    console.log('🧹 Clearing ALL cache on logout...');
    await apiCache.clearAllCache();
    
    // Clear secureCache (IndexedDB) used by enhancedCachedClient
    await secureCache.clearAllCache();
    console.log('✅ SecureCache (IndexedDB) cleared');
    
    // Clear attendance duplicate records
    attendanceDuplicateChecker.clearAll();
    
    // Clear all pending API requests (regular + attendance + enhanced)
    cachedApiClient.clearPendingRequests();
    attendanceApiClient.clearPendingRequests();
    enhancedCachedClient.clearPendingRequests();
    
    console.log('✅ All cache, pending requests, and duplicate records cleared');
    
    // Clear all state
    setUser(null);
    setSelectedInstituteState(null);
    setSelectedClassState(null);
    setSelectedSubjectState(null);
    setSelectedChildState(null);
    setSelectedOrganizationState(null);
    setSelectedTransportState(null);
    setSelectedInstituteType(null);
    setSelectedClassGrade(null);
    
    setCurrentInstituteId(null);
    setCurrentClassId(null);
    setCurrentSubjectId(null);
    setCurrentChildId(null);
    setCurrentOrganizationId(null);
    setCurrentTransportId(null);
    
    console.log('✅ User logged out successfully and cache cleared');
  };

  const setSelectedInstitute = useCallback((institute: Institute | any | null) => {
    const previousInstituteId = currentInstituteId;

    // Normalize various possible payload shapes into our Institute type
    const normalized = institute
      ? {
          id: institute.id || institute.instituteId || '',
          name: institute.name || institute.instituteName || 'Unknown Institute',
          code: institute.code || institute.instituteCode || institute.id || '',
          description:
            institute.description ||
            `${institute.address || institute.instituteAddress || ''}, ${
              institute.city || institute.instituteCity || ''
            }`.trim(),
          isActive:
            typeof institute.isActive === 'boolean'
              ? institute.isActive
              : typeof institute.instituteIsActive === 'boolean'
              ? institute.instituteIsActive
              : true,
          type: institute.type || institute.instituteType,
          instituteUserType: institute.instituteUserType,
          userRole: institute.userRole || institute.instituteUserType,
          userIdByInstitute: institute.userIdByInstitute,
          shortName:
            institute.shortName || institute.instituteShortName || institute.name || 'Unknown',
          // CRITICAL: prefer logoUrl over imageUrl (imageUrl is NOT profile image)
          instituteUserImageUrl: institute.instituteUserImageUrl || institute.userImageUrl || institute.imageUrl || '',
          logo: institute.logo || institute.logoUrl || institute.instituteLogo || ''
        }
      : null;

    setSelectedInstituteState(normalized);
    setCurrentInstituteId(normalized?.id || null);
    setSelectedInstituteType(normalized?.type || null);

    // Clear institute-specific cache when switching institutes
    if (previousInstituteId && previousInstituteId !== normalized?.id) {
      console.log(`🔄 Switching institute, clearing old cache for institute: ${previousInstituteId}`);
      // Note: This helps ensure fresh data when switching between institutes
      // The cache will be rebuilt with new institute context
    }

    // Clear dependent selections
    setSelectedClassState(null);
    setSelectedSubjectState(null);
    setSelectedClassGrade(null);
    setCurrentClassId(null);
    setCurrentSubjectId(null);
  }, [currentInstituteId]);

  const setSelectedClass = useCallback((classData: Class | null) => {
    setSelectedClassState(classData);
    setCurrentClassId(classData?.id || null);
    setSelectedClassGrade(classData?.grade ?? null);
    
    // Clear dependent selections
    setSelectedSubjectState(null);
    setCurrentSubjectId(null);
  }, []);

  const setSelectedSubject = useCallback((subject: Subject | null) => {
    setSelectedSubjectState(subject);
    setCurrentSubjectId(subject?.id || null);
  }, []);

  const setSelectedChild = useCallback((child: Child | null, viewAsParent = false) => {
    setSelectedChildState(child);
    setCurrentChildId(child?.id || null);
    setIsViewingAsParentState(viewAsParent);
    
    // Clear dependent selections when selecting a child for parent viewing
    if (viewAsParent && child) {
      setSelectedInstituteState(null);
      setSelectedClassState(null);
      setSelectedSubjectState(null);
      setCurrentInstituteId(null);
      setCurrentClassId(null);
      setCurrentSubjectId(null);
    }
  }, []);

  const setSelectedOrganization = useCallback((organization: Organization | null) => {
    setSelectedOrganizationState(organization);
    setCurrentOrganizationId(organization?.id || null);
  }, []);

  const setSelectedTransport = useCallback((transport: { id: string; vehicleNumber: string; bookhireId: string } | null) => {
    setSelectedTransportState(transport);
    setCurrentTransportId(transport?.id || null);
  }, []);

  // Method to refresh user data from backend - only called manually
  const refreshUserData = async (forceRefresh = true) => {
    if (!user) return;
    
    console.log('Refreshing user data from backend...', { forceRefresh });
    setIsLoading(true);
    
    try {
      const institutes = await fetchUserInstitutes(user.id, true);
      const mappedUser = mapUserData(user, institutes);
      setUser(mappedUser);
      
      console.log('User data refreshed successfully from backend');
    } catch (error) {
      console.error('Error refreshing user data:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Manual token validation - only called when user clicks a button
  const validateUserToken = async () => {
    setIsLoading(true);
    try {
      console.log('Validating token with backend...');
      const userData = await validateToken();
      
      const mappedUser = mapUserData(userData, []);
      setUser(mappedUser);
      
      console.log('Token validation successful, user restored from backend');
    } catch (error) {
      console.error('Error validating token:', error);
      console.log('Clearing invalid session');
      await logout();
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 CRITICAL: Auto-restore session on mount
  // On web, access token is memory-only, so we ALWAYS attempt a cookie-based
  // refresh to restore the session after page load / browser restart.
  React.useEffect(() => {
    const initializeAuth = async () => {
      try {
        // validateToken will try memory token first, then cookie refresh
        const userData = await validateToken();
        const institutes = await fetchUserInstitutes(userData.id, true);
        const mappedUser = mapUserData(userData, institutes);
        setUser(mappedUser);
      } catch {
        // No valid session — user needs to login
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };

    initializeAuth();

    // Listen for logout from other tabs (BroadcastChannel)
    const handleOtherTabLogout = () => {
      setUser(null);
    };
    window.addEventListener('auth:logged-out-other-tab', handleOtherTabLogout);
    return () => {
      window.removeEventListener('auth:logged-out-other-tab', handleOtherTabLogout);
    };
  }, []); // Run once on mount

  const value = useMemo(() => ({
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    selectedChild,
    selectedOrganization,
    selectedTransport,
    selectedInstituteType,
    selectedClassGrade,
    currentInstituteId,
    currentClassId,
    currentSubjectId,
    currentChildId,
    currentOrganizationId,
    currentTransportId,
    isViewingAsParent,
    login,
    logout,
    setSelectedInstitute,
    setSelectedClass,
    setSelectedSubject,
    setSelectedChild,
    setSelectedOrganization,
    setSelectedTransport,
    loadUserInstitutes,
    refreshUserData,
    validateUserToken,
    isAuthenticated: !!user,
    isLoading,
    isInitialized
  }), [
    user, selectedInstitute, selectedClass, selectedSubject,
    selectedChild, selectedOrganization, selectedTransport,
    selectedInstituteType, selectedClassGrade,
    currentInstituteId, currentClassId, currentSubjectId,
    currentChildId, currentOrganizationId, currentTransportId,
    isViewingAsParent, isLoading, isInitialized,
    setSelectedInstitute, setSelectedClass, setSelectedSubject,
    setSelectedChild, setSelectedOrganization, setSelectedTransport
  ]);

  // Show loading state during initialization
  if (!isInitialized) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Re-export types for backward compatibility
export type { User, UserRole } from './types/auth.types';
