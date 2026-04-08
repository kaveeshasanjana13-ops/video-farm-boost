import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { School, ChevronLeft, Building2 } from 'lucide-react';
import DashboardClassCards from './DashboardClassCards';
import DashboardSubjectCards from './DashboardSubjectCards';
import FeaturesSection from './FeaturesSection';
import { AttendanceFeedWidget } from './DashboardWidgets';

const ClassDashboardView = () => {
  const { selectedInstitute, selectedClass, setSelectedClass } = useAuth();
  const navigate = useNavigate();

  const handleBackToInstitute = () => {
    setSelectedClass(null);
    if (selectedInstitute) {
      navigate(`/institute/${selectedInstitute.id}/dashboard`);
    } else {
      navigate('/dashboard');
    }
  };

  if (!selectedInstitute || !selectedClass) return null;

  return (
    <div className="space-y-4 pb-24 sm:pb-12">
      {/* Breadcrumb */}
      <div className="px-2 pt-2">
        <button
          onClick={handleBackToInstitute}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <Building2 className="h-3 w-3" />
          <span className="truncate max-w-[160px]">{selectedInstitute.shortName || selectedInstitute.name}</span>
        </button>
      </div>

      {/* Class header */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <School className="h-6 w-6 text-emerald-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-bold text-foreground truncate">
              {selectedClass.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {selectedInstitute.name}
            </p>
          </div>
        </div>
      </div>

      {/* Class switcher (compact - switch between classes) */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <DashboardClassCards compact />
      </div>

      {/* Subjects picker */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <DashboardSubjectCards />
      </div>

      {/* Quick Access Features */}
      <div className="mx-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
        <FeaturesSection level="class" />
      </div>

      {/* My Attendance */}
      <div className="mx-2">
        <AttendanceFeedWidget filterInstituteId={selectedInstitute.id} />
      </div>
    </div>
  );
};

export default ClassDashboardView;
