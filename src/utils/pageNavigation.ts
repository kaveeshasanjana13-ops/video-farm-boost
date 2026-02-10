import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import React from 'react';

/**
 * 🔗 Page-Based Context Navigation Manager
 * 
 * Manages URL updates when context (institute/class/subject) changes
 * Works with existing page-based navigation system
 */

export const useContextUrlSync = (currentPage: string) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    selectedInstitute, 
    selectedClass, 
    selectedSubject,
    selectedChild,
    selectedOrganization,
    selectedTransport
  } = useAuth();

  // Track if this is initial mount to avoid redirect loops
  const isInitialMount = React.useRef(true);
  // Debounce ref to prevent rapid successive navigations
  const lastNavigatedUrl = React.useRef(location.pathname);
  // Prevent sync when useRouteContext is actively setting selections
  const skipNextSync = React.useRef(false);

  // Track previous selection IDs to only react to actual changes
  const prevSelectionRef = React.useRef({
    instituteId: selectedInstitute?.id,
    classId: selectedClass?.id,
    subjectId: selectedSubject?.id,
    childId: selectedChild?.id,
    organizationId: selectedOrganization?.id,
    transportId: selectedTransport?.id
  });

  useEffect(() => {
    // Skip on initial mount if URL already has context - let useRouteContext handle it
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const hasContext = location.pathname.includes('/institute/') || 
                         location.pathname.includes('/child/') || 
                         location.pathname.includes('/organization/') ||
                         location.pathname.includes('/transport/');
      if (hasContext) {
        return;
      }
    }

    // Check if selections actually changed (not just re-renders)
    const prev = prevSelectionRef.current;
    const currentIds = {
      instituteId: selectedInstitute?.id,
      classId: selectedClass?.id,
      subjectId: selectedSubject?.id,
      childId: selectedChild?.id,
      organizationId: selectedOrganization?.id,
      transportId: selectedTransport?.id
    };

    const selectionChanged = 
      prev.instituteId !== currentIds.instituteId ||
      prev.classId !== currentIds.classId ||
      prev.subjectId !== currentIds.subjectId ||
      prev.childId !== currentIds.childId ||
      prev.organizationId !== currentIds.organizationId ||
      prev.transportId !== currentIds.transportId;

    prevSelectionRef.current = currentIds;

    // If selections didn't change, skip navigation
    if (!selectionChanged) return;

    const context = currentIds;
    
    const derivedPage = extractPageFromUrl(location.pathname);
    const effectivePage = (!currentPage || currentPage.includes('/')) ? derivedPage : currentPage;

    // Skip selection step routes
    if (
      effectivePage.startsWith('select-') ||
      location.pathname.includes('/select-institute') ||
      location.pathname.includes('/select-class') ||
      location.pathname.includes('/select-subject')
    ) {
      return;
    }
    
    const contextUrl = buildSidebarUrl(effectivePage, context);
    
    // Only navigate if URL actually differs AND we haven't just navigated there
    if (location.pathname !== contextUrl && lastNavigatedUrl.current !== contextUrl) {
      const searchParams = new URLSearchParams(location.search);
      const queryString = searchParams.toString();
      const fullUrl = contextUrl + (queryString ? `?${queryString}` : '');
      
      lastNavigatedUrl.current = contextUrl;
      navigate(fullUrl, { replace: true });
    }
  }, [
    currentPage,
    selectedInstitute?.id,
    selectedClass?.id,
    selectedSubject?.id,
    selectedChild?.id,
    selectedOrganization?.id,
    selectedTransport?.id,
    navigate,
    location.pathname
  ]);
};

/**
 * Extract page name from context URL (for component rendering)
 */
export const extractPageFromUrl = (pathname: string): string => {
  // Remove leading slash
  let path = pathname.startsWith('/') ? pathname.slice(1) : pathname;
  
  // Remove context segments
  path = path
    .replace(/^institute\/[^\/]+\/?/, '')
    .replace(/^class\/[^\/]+\/?/, '')
    .replace(/^subject\/[^\/]+\/?/, '')
    .replace(/^child\/[^\/]+\/?/, '')
    .replace(/^organization\/[^\/]+\/?/, '')
    .replace(/^transport\/[^\/]+\/?/, '');
  
  // Handle nested hierarchical routes with IDs
  // These routes should highlight their parent menu item in sidebar
  // homework/:id/submissions -> homework (for sidebar) but return actual page for rendering
  const homeworkSubmissionsMatch = path.match(/^homework\/([^\/]+)\/submissions$/);
  if (homeworkSubmissionsMatch) {
    return 'homework'; // Map to parent for sidebar highlighting
  }
  
  // exam/:id/results -> exams (for sidebar)
  const examResultsMatch = path.match(/^exam\/([^\/]+)\/results$/);
  if (examResultsMatch) {
    return 'exams'; // Map to parent for sidebar highlighting
  }
  
  // exam/:id/create-results -> exams (for sidebar)
  const examCreateResultsMatch = path.match(/^exam\/([^\/]+)\/create-results$/);
  if (examCreateResultsMatch) {
    return 'exams'; // Map to parent for sidebar highlighting
  }
  
  // Map sub-routes to their parent pages (for sidebar highlighting only - NOT for component rendering)
  const subRouteMap: Record<string, string> = {
    'system-payments/create': 'system-payment',
  };
  
  // Check if path matches any sub-route pattern
  if (subRouteMap[path]) {
    return subRouteMap[path];
  }
  
  // Convert URL paths to page IDs
  const urlToPageMap: Record<string, string> = {
    'institutes/users': 'institute-users',
    'institutes/classes': 'institute-classes',
  };
  
  // Check if path matches any special URL pattern
  if (urlToPageMap[path]) {
    return urlToPageMap[path];
  }
  
  // If empty (just subject context with no page), return dashboard
  return path || 'dashboard';
};

/**
 * Get sidebar highlight page (maps sub-pages to their parent menu items)
 */
export const getSidebarHighlightPage = (pathname: string): string => {
  const basePage = extractPageFromUrl(pathname);
  
  // Map pages to their sidebar parent for highlighting
  const sidebarParentMap: Record<string, string> = {
    'rfid-attendance': 'qr-attendance',
    'institute-mark-attendance': 'qr-attendance',
    'select-institute': 'dashboard', // Highlight 'Select Institutes' (dashboard) when on select-institute page
  };
  
  return sidebarParentMap[basePage] || basePage;
};

/**
 * Parse context IDs from URL
 */
export const parseContextIds = (pathname: string): {
  instituteId?: string;
  classId?: string;
  subjectId?: string;
  childId?: string;
  organizationId?: string;
  transportId?: string;
} => {
  const parts = pathname.split('/').filter(Boolean);
  const context: any = {};
  
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const value = parts[i + 1];
    
    if (key === 'institute') context.instituteId = value;
    else if (key === 'class') context.classId = value;
    else if (key === 'subject') context.subjectId = value;
    else if (key === 'child') context.childId = value;
    else if (key === 'organization') context.organizationId = value;
    else if (key === 'transport') context.transportId = value;
  }
  
  return context;
};

/**
 * Build URL for sidebar navigation
 */
export const buildSidebarUrl = (
  page: string,
  context: {
    instituteId?: string | number;
    classId?: string | number;
    subjectId?: string | number;
    childId?: string | number;
    organizationId?: string | number;
    transportId?: string | number;
  }
): string => {
  // Convert page IDs to URL paths
  const pageToUrlMap: Record<string, string> = {
    'institute-users': 'institutes/users',
    'institute-classes': 'institutes/classes',
  };

  // Get the actual URL path for the page
  const pagePath = pageToUrlMap[page] || page;

  // Pages that must ALWAYS be global (no institute/class/subject prefix)
  // These are dedicated top-level routes like "/id-cards".
  const globalPages = new Set(['id-cards', 'card-demo']);
  if (globalPages.has(page)) {
    return `/${pagePath}`;
  }

  let url = '';

  // Handle special dashboard case
  if (page === 'dashboard' && !context.childId && !context.organizationId && !context.transportId && !context.instituteId) {
    return '/dashboard';
  }
  
  if (context.childId) {
    url = `/child/${context.childId}`;
    if (page !== 'dashboard') url += `/${pagePath}`;
  } else if (context.organizationId) {
    url = `/organization/${context.organizationId}`;
    if (page !== 'dashboard') url += `/${pagePath}`;
  } else if (context.transportId) {
    url = `/transport/${context.transportId}`;
    if (page !== 'dashboard') url += `/${pagePath}`;
  } else if (context.instituteId) {
    // Special handling for selection flows
    if (page === 'select-class') {
      // Stay at institute level: /institute/:id/select-class
      url = `/institute/${context.instituteId}/select-class`;
    } else if (page === 'select-subject') {
      // Use institute + class, but no subject yet: /institute/:id/class/:classId/select-subject
      url = `/institute/${context.instituteId}`;
      if (context.classId) {
        url += `/class/${context.classId}/select-subject`;
      } else {
        // Fallback: if no class yet, stay at institute level
        url += '/select-class';
      }
    } else {
      url = `/institute/${context.instituteId}`;
      
      if (context.classId) {
        url += `/class/${context.classId}`;
        
        // Some pages are class-scoped (must NOT include subject in the URL)
        const classScopedPages = new Set(['parents']);

        if (context.subjectId && !classScopedPages.has(page)) {
          url += `/subject/${context.subjectId}`;
        }
      }
      
      // Always append /dashboard for dashboard page when context is present
      if (page === 'dashboard') {
        url += '/dashboard';
      } else {
        url += `/${pagePath}`;
      }
    }
  } else {
    url = `/${pagePath}`;
  }
  
  return url;
};

export default {
  useContextUrlSync,
  extractPageFromUrl,
  getSidebarHighlightPage,
  parseContextIds,
  buildSidebarUrl
};
