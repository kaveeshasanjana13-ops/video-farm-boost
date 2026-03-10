import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useNavigate } from 'react-router-dom';
import { buildSidebarUrl } from '@/utils/pageNavigation';
import InstituteCarousel from '@/components/dashboard/InstituteCarousel';
import DashboardQuickNav from '@/components/dashboard/DashboardQuickNav';
import DashboardGrid, { type DashboardItem } from '@/components/dashboard/DashboardGrid';
import MyAttendanceHistoryCard from '@/components/dashboard/MyAttendanceHistoryCard';
import {
  Users, GraduationCap, UserCheck, BookOpen, School,
  User, Building2, QrCode, Award, Video, FileText, Notebook,
  CreditCard, IdCard, MessageSquare, Bell, ImageIcon,
  Calendar, CalendarDays, Clock, Bus, Settings,
} from 'lucide-react';

interface DashboardSection {
  title: string;
  items: DashboardItem[];
}

const DesktopDashboard = () => {
  const {
    user, selectedInstitute, selectedClass, selectedSubject,
    selectedChild, selectedOrganization, selectedTransport,
    setSelectedInstitute,
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

  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-pink-500', 'bg-sky-500', 'bg-lime-500',
  ];
  let colorIndex = 0;
  const nextColor = () => colors[colorIndex++ % colors.length];

  const userType = user?.userType?.toUpperCase() || '';

  const getSections = (): DashboardSection[] => {
    const sections: DashboardSection[] = [];

    // ── PRE-INSTITUTE SELECTION ──
    if (!selectedInstitute) {
      if (userType !== 'USER_WITHOUT_STUDENT') {
        sections.push({
          title: 'My Institutes',
          items: [
            { id: 'select-institute', label: 'Select Institute', icon: School, color: nextColor(), description: 'Choose your school or institute' },
            { id: 'notifications', label: 'Notifications', icon: Bell, color: nextColor(), description: 'Check your updates' },
          ],
        });
      }
      if (userType !== 'USER_WITHOUT_PARENT') {
        sections.push({
          title: 'My Children',
          items: [
            { id: 'my-children', label: 'My Children', icon: Users, color: nextColor(), description: 'View and manage your children' },
          ],
        });
      }
      sections.push({
        title: 'Services',
        items: [
          { id: 'organizations', label: 'Organizations', icon: Building2, color: nextColor(), description: 'Browse organizations' },
          { id: 'transport', label: 'Transport', icon: Bus, color: nextColor(), description: 'Transport services' },
          { id: 'system-payments', label: 'Payments', icon: CreditCard, color: nextColor(), description: 'Manage your payments' },
        ],
      });
      sections.push({
        title: 'My Account',
        items: [
          { id: 'profile', label: 'My Profile', icon: User, color: nextColor(), description: 'View and edit your profile' },
          { id: 'id-cards', label: 'ID Cards', icon: IdCard, color: nextColor(), description: 'Your digital ID cards' },
          { id: 'settings', label: 'Settings', icon: Settings, color: nextColor(), description: 'App preferences' },
        ],
      });
      return sections;
    }

    // ── STUDENT ──
    if (userRole === 'Student') {
      if (!selectedClass) {
        sections.push({
          title: 'Get Started',
          items: [
            { id: 'select-class', label: 'Choose Class', icon: School, color: nextColor(), description: 'Select your class to continue' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "See today's schedule" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'View full calendar' },
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor(), description: 'Check your attendance' },
            { id: 'institute-lectures', label: 'Lectures', icon: Video, color: nextColor(), description: 'Watch available lectures' },
          ],
        });
        sections.push({
          title: 'Fees',
          items: [
            { id: 'institute-payments', label: 'My Fees', icon: CreditCard, color: nextColor(), description: 'View due fees' },
            { id: 'my-submissions', label: 'Payment History', icon: FileText, color: nextColor(), description: 'Past payments & receipts' },
          ],
        });
      } else if (selectedClass && !selectedSubject) {
        sections.push({
          title: 'Get Started',
          items: [
            { id: 'select-subject', label: isTuitionInstitute ? 'Choose Sub Class' : 'Choose Subject', icon: BookOpen, color: nextColor(), description: `Pick a ${subjectLabel.toLowerCase()} to explore` },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "See today's schedule" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'View full calendar' },
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor(), description: 'Check your attendance' },
          ],
        });
        sections.push({
          title: 'Fees',
          items: [
            { id: 'institute-payments', label: 'My Fees', icon: CreditCard, color: nextColor(), description: 'View due fees' },
            { id: 'my-submissions', label: 'Payment History', icon: FileText, color: nextColor(), description: 'Past payments & receipts' },
          ],
        });
      } else if (selectedClass && selectedSubject) {
        sections.push({
          title: 'My Learning',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor(), description: 'Watch class lectures' },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, color: nextColor(), description: 'Free video lessons' },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor(), description: 'View & submit homework' },
            { id: 'exams', label: 'Exams', icon: Award, color: nextColor(), description: 'Upcoming & past exams' },
          ],
        });
        sections.push({
          title: 'My Schedule',
          items: [
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor(), description: 'Your attendance record' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's timetable" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Full calendar view' },
            { id: 'subject-payments', label: 'Fees', icon: CreditCard, color: nextColor(), description: 'Subject fee details' },
          ],
        });
      }

    // ── PARENT ──
    } else if (userRole === 'Parent') {
      if (!selectedClass) {
        sections.push({
          title: 'My Children',
          items: [
            { id: 'my-children', label: 'Children', icon: Users, color: nextColor(), description: 'View your children' },
            { id: 'select-class', label: 'Choose Class', icon: School, color: nextColor(), description: "Select child's class" },
            { id: 'today-dashboard', label: "Today's Activity", icon: CalendarDays, color: nextColor(), description: "What's happening today" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Academic calendar' },
          ],
        });
        sections.push({
          title: 'Fees & Payments',
          items: [
            { id: 'institute-payments', label: 'Due Fees', icon: CreditCard, color: nextColor(), description: 'Outstanding fee payments' },
            { id: 'my-submissions', label: 'Payment History', icon: FileText, color: nextColor(), description: 'Past payments & receipts' },
          ],
        });
      } else if (selectedClass && !selectedSubject) {
        sections.push({
          title: 'My Children',
          items: [
            { id: 'my-children', label: 'Children', icon: Users, color: nextColor(), description: 'View your children' },
            { id: 'select-subject', label: isTuitionInstitute ? 'Choose Sub Class' : 'Choose Subject', icon: BookOpen, color: nextColor(), description: `Select a ${subjectLabel.toLowerCase()}` },
            { id: 'today-dashboard', label: "Today's Activity", icon: CalendarDays, color: nextColor(), description: "What's happening today" },
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor(), description: "Child's attendance record" },
          ],
        });
        sections.push({
          title: 'Fees & Payments',
          items: [
            { id: 'institute-payments', label: 'Due Fees', icon: CreditCard, color: nextColor(), description: 'Outstanding fee payments' },
            { id: 'my-submissions', label: 'Payment History', icon: FileText, color: nextColor(), description: 'Past payments & receipts' },
          ],
        });
      } else if (selectedClass && selectedSubject) {
        sections.push({
          title: "Child's Progress",
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor(), description: 'Class lecture videos' },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor(), description: 'Assigned homework' },
            { id: 'exams', label: 'Exam Results', icon: Award, color: nextColor(), description: 'View exam scores' },
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor(), description: "Child's attendance" },
          ],
        });
        sections.push({
          title: 'Fees & Payments',
          items: [
            { id: 'subject-payments', label: 'Subject Fees', icon: CreditCard, color: nextColor(), description: 'Fees for this subject' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's schedule" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Full calendar view' },
          ],
        });
      }

    // ── TEACHER ──
    } else if (userRole === 'Teacher') {
      if (!selectedClass && !selectedSubject) {
        sections.push({
          title: 'My Classes',
          items: [
            { id: 'institute-subjects', label: `All ${subjectLabel}s`, icon: BookOpen, color: nextColor(), description: `Browse all ${subjectLabel.toLowerCase()}s` },
            { id: 'select-class', label: 'Choose Class', icon: School, color: nextColor(), description: 'Select a class to manage' },
            { id: 'select-subject', label: `Choose ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Pick a ${subjectLabel.toLowerCase()}` },
            { id: 'institute-lectures', label: 'All Lectures', icon: Video, color: nextColor(), description: 'View all uploaded lectures' },
          ],
        });
        sections.push({
          title: 'Schedule',
          items: [
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's teaching schedule" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Full calendar view' },
          ],
        });
      } else if (selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class Overview',
          items: [
            { id: 'select-subject', label: `Choose ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Select a ${subjectLabel.toLowerCase()}` },
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor(), description: 'View enrolled students' },
            { id: 'unverified-students', label: 'Pending Students', icon: UserCheck, color: nextColor(), description: 'Students awaiting approval' },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Mark Daily', icon: UserCheck, color: nextColor(), description: "Take today's attendance" },
            { id: 'qr-attendance', label: 'Scan QR', icon: QrCode, color: nextColor(), description: 'Quick QR attendance' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's overview" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Attendance calendar' },
          ],
        });
      } else if (selectedClass && selectedSubject) {
        sections.push({
          title: 'Teaching',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor(), description: 'View your students' },
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor(), description: 'Manage lecture videos' },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, color: nextColor(), description: 'Free content for students' },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor(), description: 'Assign & review homework' },
            { id: 'exams', label: 'Exams', icon: FileText, color: nextColor(), description: 'Create & grade exams' },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Mark Daily', icon: UserCheck, color: nextColor(), description: "Take today's attendance" },
            { id: 'qr-attendance', label: 'Scan QR', icon: QrCode, color: nextColor(), description: 'Quick QR attendance' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's overview" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Attendance calendar' },
          ],
        });
        sections.push({
          title: 'Fees',
          items: [
            { id: 'subject-payments', label: 'Subject Fees', icon: CreditCard, color: nextColor(), description: 'Manage subject fees' },
          ],
        });
      }

    // ── INSTITUTE ADMIN ──
    } else if (userRole === 'InstituteAdmin') {
      if (!selectedClass && !selectedSubject) {
        sections.push({
          title: 'People',
          items: [
            ...(isTuitionInstitute ? [] : [{ id: 'institute-organizations', label: 'Organizations', icon: Building2, color: nextColor(), description: 'Manage organizations' }]),
            { id: 'institute-users', label: 'All Users', icon: Users, color: nextColor(), description: 'View all institute members' },
            { id: 'parents', label: 'Parents', icon: Users, color: nextColor(), description: 'View parent accounts' },
            { id: 'verify-image', label: 'Verify Photos', icon: ImageIcon, color: nextColor(), description: 'Approve profile photos' },
          ],
        });
        sections.push({
          title: 'Classes & Subjects',
          items: [
            { id: 'classes', label: 'All Classes', icon: School, color: nextColor(), description: 'Manage all classes' },
            { id: 'institute-subjects', label: `All ${subjectLabel}s`, icon: BookOpen, color: nextColor(), description: `View all ${subjectLabel.toLowerCase()}s` },
            { id: 'select-class', label: 'Go to Class', icon: School, color: nextColor(), description: 'Navigate to a class' },
            { id: 'select-subject', label: `Go to ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Open a ${subjectLabel.toLowerCase()}` },
            { id: 'institute-lectures', label: 'All Lectures', icon: Video, color: nextColor(), description: 'View all lecture content' },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's attendance overview" },
            { id: 'daily-attendance', label: 'Mark Daily', icon: UserCheck, color: nextColor(), description: "Take today's attendance" },
            { id: 'qr-attendance', label: 'Scan QR', icon: QrCode, color: nextColor(), description: 'Quick QR attendance' },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'View attendance history' },
          ],
        });
        sections.push({
          title: 'Fees & Messages',
          items: [
            { id: 'institute-payments', label: 'All Fees', icon: CreditCard, color: nextColor(), description: 'Manage institute fees' },
            { id: 'pending-submissions', label: 'Review Payments', icon: Clock, color: nextColor(), description: 'Approve pending payments' },
            { id: 'sms', label: 'Send SMS', icon: MessageSquare, color: nextColor(), description: 'Send messages to users' },
            { id: 'sms-history', label: 'SMS History', icon: MessageSquare, color: nextColor(), description: 'View sent messages' },
          ],
        });
      } else if (selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class Overview',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor(), description: 'View enrolled students' },
            { id: 'unverified-students', label: 'Pending Students', icon: UserCheck, color: nextColor(), description: 'Students awaiting approval' },
            { id: 'parents', label: 'Parents', icon: Users, color: nextColor(), description: 'View parent contacts' },
            { id: 'class-subjects', label: `${subjectLabel}s`, icon: BookOpen, color: nextColor(), description: `Class ${subjectLabel.toLowerCase()}s list` },
            { id: 'select-subject', label: `Go to ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Open a ${subjectLabel.toLowerCase()}` },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Mark Daily', icon: UserCheck, color: nextColor(), description: "Take today's attendance" },
            { id: 'qr-attendance', label: 'Scan QR', icon: QrCode, color: nextColor(), description: 'Quick QR attendance' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's overview" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Attendance calendar' },
          ],
        });
      } else if (selectedClass && selectedSubject) {
        sections.push({
          title: 'Quick Access',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor(), description: 'View enrolled students' },
            { id: 'unverified-students', label: 'Pending Students', icon: UserCheck, color: nextColor(), description: 'Awaiting approval' },
            { id: 'select-subject', label: `Change ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Switch to another ${subjectLabel.toLowerCase()}` },
          ],
        });
        sections.push({
          title: 'Content',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor(), description: 'Manage lecture videos' },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, color: nextColor(), description: 'Free content for students' },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor(), description: 'Assign & review homework' },
            { id: 'exams', label: 'Exams', icon: FileText, color: nextColor(), description: 'Create & grade exams' },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Mark Daily', icon: UserCheck, color: nextColor(), description: "Take today's attendance" },
            { id: 'qr-attendance', label: 'Scan QR', icon: QrCode, color: nextColor(), description: 'Quick QR attendance' },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor(), description: "Today's overview" },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor(), description: 'Attendance calendar' },
          ],
        });
        sections.push({
          title: 'Fees',
          items: [
            { id: 'subject-payments', label: 'Subject Fees', icon: CreditCard, color: nextColor(), description: 'Manage fee collection' },
          ],
        });
      }

    // ── ATTENDANCE MARKER ──
    } else if (userRole === 'AttendanceMarker') {
      if (selectedInstitute) {
        sections.push({
          title: 'Mark Attendance',
          items: [
            { id: 'attendance-markers', label: 'My Markers', icon: Users, color: nextColor(), description: 'Your assigned markers' },
            ...(!selectedClass ? [{ id: 'select-class', label: 'Choose Class', icon: School, color: nextColor(), description: 'Select a class first' }] : []),
            { id: 'select-subject', label: `Choose ${subjectLabel}`, icon: BookOpen, color: nextColor(), description: `Pick a ${subjectLabel.toLowerCase()}` },
            ...(selectedSubject ? [{ id: 'free-lectures', label: 'Free Lectures', icon: Video, color: nextColor(), description: 'Free video content' }] : []),
          ],
        });
      }
    }

    // Notifications — all roles
    if (selectedInstitute) {
      sections.push({
        title: 'Updates',
        items: [
          { id: 'institute-notifications', label: 'Notifications', icon: Bell, color: nextColor(), description: 'Latest updates & alerts' },
        ],
      });
    }

    // Account — all roles
    const accountItems: DashboardItem[] = [
      { id: 'profile', label: 'My Profile', icon: User, color: nextColor(), description: 'View and edit your profile' },
    ];
    if (selectedInstitute && ['Student', 'Teacher', 'InstituteAdmin', 'Parent'].includes(userRole)) {
      accountItems.push({ id: 'institute-profile', label: 'ID Card', icon: IdCard, color: nextColor(), description: 'Your digital ID card' });
    }
    sections.push({ title: 'My Account', items: accountItems });

    return sections;
  };

  const sections = getSections();

  return (
    <div className="p-3 sm:p-6 space-y-5 max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Welcome{user?.firstName || user?.nameWithInitials ? `, ${user?.firstName || user?.nameWithInitials}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {selectedInstitute
            ? selectedInstitute.shortName || selectedInstitute.name
            : 'Select an institute to get started'}
        </p>
      </div>

      {/* Institute carousel slider */}
      <InstituteCarousel onSelectInstitute={(inst) => setSelectedInstitute(inst)} />

      {/* Breadcrumb navigation */}
      {selectedInstitute && (
        <DashboardQuickNav onNavigate={handleNavigate} isTuitionInstitute={isTuitionInstitute} />
      )}

      {/* Attendance card - only shows if API is available */}
      {!selectedInstitute && <MyAttendanceHistoryCard />}

      {/* All sections with card grid */}
      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            {section.title}
          </h2>
          <DashboardGrid items={section.items} onNavigate={handleNavigate} />
        </div>
      ))}
    </div>
  );
};

export default DesktopDashboard;
