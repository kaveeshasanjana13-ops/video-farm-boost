import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { buildSidebarUrl } from '@/utils/pageNavigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  UserCheck,
  BookOpen,
  School,
  BarChart3,
  User,
  Building2,
  QrCode,
  Award,
  Video,
  FileText,
  Notebook,
  CreditCard,
  Truck,
  IdCard,
  MessageSquare,
  Bell,
  ImageIcon,
  Camera,
  type LucideIcon,
} from 'lucide-react';

interface DashboardItem {
  id: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  color: string; // HSL bg color class
  locked?: boolean;
}

interface DashboardSection {
  title: string;
  items: DashboardItem[];
}

const MobileDashboard = () => {
  const {
    user,
    selectedInstitute,
    selectedClass,
    selectedSubject,
    selectedChild,
    selectedOrganization,
    selectedTransport,
  } = useAuth();
  const userRole = useInstituteRole();
  const navigate = useNavigate();
  const isTuitionInstitute = selectedInstitute?.type === 'tuition_institute';
  const subjectLabel = isTuitionInstitute ? 'Sub Class' : 'Subject';

  const handleNavigate = (itemId: string) => {
    const context = {
      instituteId: selectedInstitute?.id,
      classId: selectedClass?.id,
      subjectId: selectedSubject?.id,
      childId: selectedChild?.id,
      organizationId: selectedOrganization?.id,
      transportId: selectedTransport?.id,
    };

    if (itemId === 'organizations' && !selectedInstitute) {
      window.open('https://org.suraksha.lk/', '_blank');
      return;
    }

    const url = buildSidebarUrl(itemId, context);
    navigate(url);
  };

  // Color palette for cards - using semantic-friendly classes
  const colors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-amber-500',
    'bg-rose-500',
    'bg-cyan-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-sky-500',
    'bg-lime-500',
  ];

  let colorIndex = 0;
  const nextColor = () => colors[colorIndex++ % colors.length];

  const getSections = (): DashboardSection[] => {
    const sections: DashboardSection[] = [];

    // ── MAIN NAVIGATION ──
    if (userRole === 'Student') {
      if (selectedInstitute && !selectedClass) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'select-class', label: 'Select Class', icon: School, description: 'Choose your class', color: nextColor() },
            { id: 'my-attendance', label: 'My Attendance', icon: UserCheck, description: 'View attendance records', color: nextColor() },
            { id: 'institute-lectures', label: 'Institute Lectures', icon: Video, description: 'Watch lectures', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Choose a ${subjectLabel.toLowerCase()}`, color: nextColor() },
            { id: 'my-attendance', label: 'My Attendance', icon: UserCheck, description: 'View attendance records', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Quick Access',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, description: 'Watch & review lectures', color: nextColor() },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, description: 'Free video content', color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, description: 'View & submit homework', color: nextColor() },
            { id: 'exams', label: 'Exams', icon: Award, description: 'Upcoming & past exams', color: nextColor() },
            { id: 'my-attendance', label: 'My Attendance', icon: UserCheck, description: 'Attendance records', color: nextColor() },
            { id: 'subject-payments', label: `${subjectLabel} Payments`, icon: CreditCard, description: 'Payment details', color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'Teacher') {
      if (selectedInstitute && !selectedClass && !selectedSubject) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'institute-subjects', label: `Institute ${subjectLabel}s`, icon: BookOpen, description: `All ${subjectLabel.toLowerCase()}s`, color: nextColor() },
            { id: 'select-class', label: 'Select Class', icon: School, description: 'Choose a class', color: nextColor() },
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Choose a ${subjectLabel.toLowerCase()}`, color: nextColor() },
            { id: 'institute-lectures', label: 'Institute Lectures', icon: Video, description: 'All lectures', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class Management',
          items: [
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Choose a ${subjectLabel.toLowerCase()}`, color: nextColor() },
            { id: 'students', label: 'Students', icon: GraduationCap, description: 'View class students', color: nextColor() },
            { id: 'unverified-students', label: 'Verify Students', icon: UserCheck, description: 'Pending verifications', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily Attendance', icon: UserCheck, description: 'Mark & view attendance', color: nextColor() },
            { id: 'qr-attendance', label: 'Mark Attendance', icon: QrCode, description: 'QR code attendance', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Quick Access',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, description: 'View students', color: nextColor() },
            { id: 'lectures', label: 'Lectures', icon: Video, description: 'Manage lectures', color: nextColor() },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, description: 'Free content', color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, description: 'Manage homework', color: nextColor() },
            { id: 'exams', label: 'Exams', icon: FileText, description: 'Manage exams', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily Attendance', icon: UserCheck, description: 'Mark & view attendance', color: nextColor() },
            { id: 'qr-attendance', label: 'Mark Attendance', icon: QrCode, description: 'QR code scan', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Payments',
          items: [
            { id: 'subject-payments', label: `${subjectLabel} Payments`, icon: CreditCard, description: 'Payment management', color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'InstituteAdmin') {
      if (selectedInstitute && !selectedClass && !selectedSubject) {
        sections.push({
          title: 'Management',
          items: [
            ...(isTuitionInstitute ? [] : [{ id: 'institute-organizations', label: 'Organizations', icon: Building2, description: 'Manage organizations', color: nextColor() }]),
            { id: 'institute-users', label: 'Institute Users', icon: Users, description: 'Manage all users', color: nextColor() },
            { id: 'parents', label: 'Parents', icon: Users, description: 'Parent management', color: nextColor() },
            { id: 'verify-image', label: 'Verify Image', icon: ImageIcon, description: 'Image verification', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Academic',
          items: [
            { id: 'classes', label: 'All Classes', icon: School, description: 'Manage classes', color: nextColor() },
            { id: 'institute-subjects', label: `Institute ${subjectLabel}s`, icon: BookOpen, description: `All ${subjectLabel.toLowerCase()}s`, color: nextColor() },
            { id: 'select-class', label: 'Select Class', icon: School, description: 'Navigate to a class', color: nextColor() },
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Navigate to ${subjectLabel.toLowerCase()}`, color: nextColor() },
            { id: 'institute-lectures', label: 'Institute Lectures', icon: Video, description: 'All lectures', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily Attendance', icon: UserCheck, description: 'Mark & view', color: nextColor() },
            { id: 'qr-attendance', label: 'Mark Attendance', icon: QrCode, description: 'QR code scan', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Payments',
          items: [
            { id: 'institute-payments', label: 'Institute Payments', icon: CreditCard, description: 'Payment management', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Communication',
          items: [
            { id: 'sms', label: 'SMS', icon: MessageSquare, description: 'Send SMS messages', color: nextColor() },
            { id: 'sms-history', label: 'SMS History', icon: MessageSquare, description: 'View sent messages', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class Management',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, description: 'Class students', color: nextColor() },
            { id: 'unverified-students', label: 'Verify Students', icon: UserCheck, description: 'Pending verifications', color: nextColor() },
            { id: 'parents', label: 'Parents', icon: Users, description: 'Student parents', color: nextColor() },
            { id: 'class-subjects', label: `Class ${subjectLabel}s`, icon: BookOpen, description: `Class ${subjectLabel.toLowerCase()}s`, color: nextColor() },
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Navigate to ${subjectLabel.toLowerCase()}`, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily Attendance', icon: UserCheck, description: 'Mark & view', color: nextColor() },
            { id: 'qr-attendance', label: 'Mark Attendance', icon: QrCode, description: 'QR code scan', color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Quick Access',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, description: 'View students', color: nextColor() },
            { id: 'unverified-students', label: 'Verify Students', icon: UserCheck, description: 'Pending verifications', color: nextColor() },
            { id: 'select-subject', label: isTuitionInstitute ? 'Select Sub Class' : 'Select Subject', icon: BookOpen, description: `Change ${subjectLabel.toLowerCase()}`, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Academic',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, description: 'Manage lectures', color: nextColor() },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, description: 'Free content', color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, description: 'Manage homework', color: nextColor() },
            { id: 'exams', label: 'Exams', icon: FileText, description: 'Manage exams', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily Attendance', icon: UserCheck, description: 'Mark & view', color: nextColor() },
            { id: 'qr-attendance', label: 'Mark Attendance', icon: QrCode, description: 'QR code scan', color: nextColor() },
          ],
        });
        sections.push({
          title: 'Payments',
          items: [
            { id: 'subject-payments', label: `${subjectLabel} Payments`, icon: CreditCard, description: 'Payment details', color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'AttendanceMarker') {
      if (selectedInstitute) {
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'attendance-markers', label: 'Attendance Markers', icon: Users, description: 'Manage markers', color: nextColor() },
            ...(!selectedClass ? [{ id: 'select-class', label: 'Select Class', icon: School, description: 'Choose a class', color: nextColor() }] : []),
            { id: 'select-subject', label: 'Select Subject', icon: BookOpen, description: 'Choose a subject', color: nextColor() },
            ...(selectedSubject ? [{ id: 'free-lectures', label: 'Free Lectures', icon: Video, description: 'Free content', color: nextColor() }] : []),
          ],
        });
      }
    }

    // Notifications section (always show when institute is selected)
    if (selectedInstitute) {
      sections.push({
        title: 'Notifications',
        items: [
          { id: 'institute-notifications', label: 'Notifications', icon: Bell, description: 'Institute notifications', color: nextColor() },
        ],
      });
    }

    // Settings section
    const settingsItems: DashboardItem[] = [
      { id: 'profile', label: 'Profile', icon: User, description: 'Your profile', color: nextColor() },
    ];
    if (selectedInstitute && ['Student', 'Teacher', 'InstituteAdmin'].includes(userRole)) {
      settingsItems.push({ id: 'institute-profile', label: 'Institute Profile', icon: IdCard, description: 'Institute profile', color: nextColor() });
    }
    sections.push({ title: 'Account', items: settingsItems });

    return sections;
  };

  const sections = getSections();

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome header */}
      <div className="px-1">
        <h1 className="text-xl font-bold text-foreground">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
        {selectedInstitute && (
          <p className="text-sm text-muted-foreground mt-1">
            {selectedInstitute.shortName || selectedInstitute.name}
            {selectedClass && ` • ${(selectedClass as any).name || 'Class'}`}
            {selectedSubject && ` • ${(selectedSubject as any).name || subjectLabel}`}
          </p>
        )}
      </div>

      {/* Navigation sections */}
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">
            {section.title}
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {section.items.map((item) => (
              <button
                key={item.id}
                onClick={() => !item.locked && handleNavigate(item.id)}
                disabled={item.locked}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-2xl
                  transition-all duration-200 active:scale-95
                  ${item.locked 
                    ? 'opacity-40 cursor-not-allowed' 
                    : 'hover:shadow-md active:shadow-sm'
                  }
                  bg-card border border-border/50 shadow-sm
                `}
              >
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${item.color} text-white shadow-sm
                `}>
                  <item.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-medium text-foreground text-center leading-tight line-clamp-2">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileDashboard;
