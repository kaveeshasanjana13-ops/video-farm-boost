import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import SubjectDashboard from '@/pages/SubjectDashboard';
import ParentChildrenSelector from './ParentChildrenSelector';
import { Users } from 'lucide-react';

import MobileDashboard from './MobileDashboard';
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const {
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    selectedChild,
    isViewingAsParent
  } = useAuth();

  const userRole = useInstituteRole();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Check URL path as fallback for subject-level context
  const isSubjectLevelUrl = /\/subject\/[^/]+/.test(location.pathname);
  const hasSubjectContext = (selectedSubject && selectedClass && selectedInstitute) || isSubjectLevelUrl;
  
  console.log('🎯 Dashboard - Institute Role:', userRole, 'from instituteUserType:', selectedInstitute?.userRole, 'isViewingAsParent:', isViewingAsParent, 'hasSubjectContext:', hasSubjectContext, 'selectedSubject:', !!selectedSubject, 'isSubjectLevelUrl:', isSubjectLevelUrl);

  // Parent viewing child's subject dashboard - show view-only banner
  if (isViewingAsParent && selectedChild && hasSubjectContext) {
    return (
      <div className="space-y-4">
        {/* View-only banner */}
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Viewing as Parent
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                You are viewing {selectedChild.user?.firstName || (selectedChild as any).name || 'your child'}'s information. Submissions are disabled in view-only mode.
              </p>
            </div>
          </div>
        </div>
        <SubjectDashboard />
      </div>
    );
  }

  // Subject-level dashboard
  if (hasSubjectContext) {
    return <MobileDashboard />;
  }

  // Special handling for Parent role - child selector
  if (userRole === 'Parent' && !selectedChild) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Select Your Child
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Choose a child to view their academic information, attendance, and results.
          </p>
        </div>
        <ParentChildrenSelector />
      </div>
    );
  }

  // For all roles - show dashboard grid
  return <MobileDashboard />;
};
export default Dashboard;
