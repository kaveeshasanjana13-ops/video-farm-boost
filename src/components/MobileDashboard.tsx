import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInstituteRole } from '@/hooks/useInstituteRole';
import { useNavigate } from 'react-router-dom';
import { buildSidebarUrl } from '@/utils/pageNavigation';
import useEmblaCarousel from 'embla-carousel-react';
import DashboardQuickNav from '@/components/dashboard/DashboardQuickNav';
import DashboardSectionPills from '@/components/dashboard/DashboardSectionPills';
import DashboardGrid, { type DashboardItem } from '@/components/dashboard/DashboardGrid';
import {
  Users, GraduationCap, UserCheck, BookOpen, School,
  User, Building2, QrCode, Award, Video, FileText, Notebook,
  CreditCard, IdCard, MessageSquare, Bell, ImageIcon,
  Calendar, CalendarDays, Clock, type LucideIcon,
} from 'lucide-react';

interface DashboardSection {
  title: string;
  items: DashboardItem[];
}

const MobileDashboard = () => {
  const {
    user, selectedInstitute, selectedClass, selectedSubject,
    selectedChild, selectedOrganization, selectedTransport,
  } = useAuth();
  const userRole = useInstituteRole();
  const navigate = useNavigate();
  const isTuitionInstitute = selectedInstitute?.type === 'tuition_institute';
  const subjectLabel = isTuitionInstitute ? 'Sub Class' : 'Subject';

  const [activeSection, setActiveSection] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', loop: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveSection(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  const scrollToSection = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
    setActiveSection(index);
  }, [emblaApi]);

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

  // Color palette
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500',
    'bg-rose-500', 'bg-cyan-500', 'bg-indigo-500', 'bg-teal-500',
    'bg-orange-500', 'bg-pink-500', 'bg-sky-500', 'bg-lime-500',
  ];
  let colorIndex = 0;
  const nextColor = () => colors[colorIndex++ % colors.length];

  const getSections = (): DashboardSection[] => {
    const sections: DashboardSection[] = [];

    if (userRole === 'Student') {
      if (selectedInstitute && !selectedClass) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'select-class', label: 'Select Class', icon: School, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
            { id: 'my-attendance', label: 'My Attendance', icon: UserCheck, color: nextColor() },
            { id: 'institute-lectures', label: 'Lectures', icon: Video, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Finance',
          items: [
            { id: 'institute-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
            { id: 'my-submissions', label: 'My Submissions', icon: FileText, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'select-subject', label: isTuitionInstitute ? 'Sub Class' : 'Subject', icon: BookOpen, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
            { id: 'my-attendance', label: 'My Attendance', icon: UserCheck, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Finance',
          items: [
            { id: 'institute-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
            { id: 'my-submissions', label: 'My Submissions', icon: FileText, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Learning',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor() },
            { id: 'free-lectures', label: 'Free Lectures', icon: Video, color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor() },
            { id: 'exams', label: 'Exams', icon: Award, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Schedule',
          items: [
            { id: 'my-attendance', label: 'Attendance', icon: UserCheck, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
            { id: 'subject-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'Teacher') {
      if (selectedInstitute && !selectedClass && !selectedSubject) {
        sections.push({
          title: 'Navigation',
          items: [
            { id: 'institute-subjects', label: `${subjectLabel}s`, icon: BookOpen, color: nextColor() },
            { id: 'select-class', label: 'Select Class', icon: School, color: nextColor() },
            { id: 'select-subject', label: subjectLabel, icon: BookOpen, color: nextColor() },
            { id: 'institute-lectures', label: 'Lectures', icon: Video, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Schedule',
          items: [
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class',
          items: [
            { id: 'select-subject', label: subjectLabel, icon: BookOpen, color: nextColor() },
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor() },
            { id: 'unverified-students', label: 'Verify', icon: UserCheck, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily', icon: UserCheck, color: nextColor() },
            { id: 'qr-attendance', label: 'QR Mark', icon: QrCode, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Teaching',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor() },
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor() },
            { id: 'free-lectures', label: 'Free', icon: Video, color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor() },
            { id: 'exams', label: 'Exams', icon: FileText, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily', icon: UserCheck, color: nextColor() },
            { id: 'qr-attendance', label: 'QR Mark', icon: QrCode, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Payments',
          items: [
            { id: 'subject-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'InstituteAdmin') {
      if (selectedInstitute && !selectedClass && !selectedSubject) {
        sections.push({
          title: 'Management',
          items: [
            ...(isTuitionInstitute ? [] : [{ id: 'institute-organizations', label: 'Orgs', icon: Building2, color: nextColor() }]),
            { id: 'institute-users', label: 'Users', icon: Users, color: nextColor() },
            { id: 'parents', label: 'Parents', icon: Users, color: nextColor() },
            { id: 'verify-image', label: 'Verify', icon: ImageIcon, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Academic',
          items: [
            { id: 'classes', label: 'Classes', icon: School, color: nextColor() },
            { id: 'institute-subjects', label: `${subjectLabel}s`, icon: BookOpen, color: nextColor() },
            { id: 'select-class', label: 'Go Class', icon: School, color: nextColor() },
            { id: 'select-subject', label: `Go ${subjectLabel}`, icon: BookOpen, color: nextColor() },
            { id: 'institute-lectures', label: 'Lectures', icon: Video, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'daily-attendance', label: 'Daily', icon: UserCheck, color: nextColor() },
            { id: 'qr-attendance', label: 'QR Mark', icon: QrCode, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Finance & SMS',
          items: [
            { id: 'institute-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
            { id: 'pending-submissions', label: 'Pending', icon: Clock, color: nextColor() },
            { id: 'sms', label: 'SMS', icon: MessageSquare, color: nextColor() },
            { id: 'sms-history', label: 'SMS Log', icon: MessageSquare, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && !selectedSubject) {
        sections.push({
          title: 'Class',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor() },
            { id: 'unverified-students', label: 'Verify', icon: UserCheck, color: nextColor() },
            { id: 'parents', label: 'Parents', icon: Users, color: nextColor() },
            { id: 'class-subjects', label: `${subjectLabel}s`, icon: BookOpen, color: nextColor() },
            { id: 'select-subject', label: `Go ${subjectLabel}`, icon: BookOpen, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily', icon: UserCheck, color: nextColor() },
            { id: 'qr-attendance', label: 'QR Mark', icon: QrCode, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
      } else if (selectedInstitute && selectedClass && selectedSubject) {
        sections.push({
          title: 'Quick Access',
          items: [
            { id: 'students', label: 'Students', icon: GraduationCap, color: nextColor() },
            { id: 'unverified-students', label: 'Verify', icon: UserCheck, color: nextColor() },
            { id: 'select-subject', label: `Change ${subjectLabel}`, icon: BookOpen, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Academic',
          items: [
            { id: 'lectures', label: 'Lectures', icon: Video, color: nextColor() },
            { id: 'free-lectures', label: 'Free', icon: Video, color: nextColor() },
            { id: 'homework', label: 'Homework', icon: Notebook, color: nextColor() },
            { id: 'exams', label: 'Exams', icon: FileText, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'daily-attendance', label: 'Daily', icon: UserCheck, color: nextColor() },
            { id: 'qr-attendance', label: 'QR Mark', icon: QrCode, color: nextColor() },
            { id: 'today-dashboard', label: 'Today', icon: CalendarDays, color: nextColor() },
            { id: 'calendar-view', label: 'Calendar', icon: Calendar, color: nextColor() },
          ],
        });
        sections.push({
          title: 'Payments',
          items: [
            { id: 'subject-payments', label: 'Payments', icon: CreditCard, color: nextColor() },
          ],
        });
      }
    } else if (userRole === 'AttendanceMarker') {
      if (selectedInstitute) {
        sections.push({
          title: 'Attendance',
          items: [
            { id: 'attendance-markers', label: 'Markers', icon: Users, color: nextColor() },
            ...(!selectedClass ? [{ id: 'select-class', label: 'Class', icon: School, color: nextColor() }] : []),
            { id: 'select-subject', label: 'Subject', icon: BookOpen, color: nextColor() },
            ...(selectedSubject ? [{ id: 'free-lectures', label: 'Free', icon: Video, color: nextColor() }] : []),
          ],
        });
      }
    }

    // Notifications
    if (selectedInstitute) {
      sections.push({
        title: 'Notifications',
        items: [
          { id: 'institute-notifications', label: 'Notifications', icon: Bell, color: nextColor() },
        ],
      });
    }

    // Account
    const accountItems: DashboardItem[] = [
      { id: 'profile', label: 'Profile', icon: User, color: nextColor() },
    ];
    if (selectedInstitute && ['Student', 'Teacher', 'InstituteAdmin'].includes(userRole)) {
      accountItems.push({ id: 'institute-profile', label: 'ID Card', icon: IdCard, color: nextColor() });
    }
    sections.push({ title: 'Account', items: accountItems });

    return sections;
  };

  const sections = getSections();
  const sectionTitles = sections.map(s => s.title);

  // Reset active section when sections change
  useEffect(() => {
    setActiveSection(0);
    emblaApi?.scrollTo(0);
  }, [userRole, selectedInstitute?.id, selectedClass?.id, selectedSubject?.id]);

  return (
    <div className="space-y-3 pb-4">
      {/* Welcome + context breadcrumbs */}
      <div className="px-1">
        <h1 className="text-lg font-bold text-foreground">
          Welcome{user?.firstName ? `, ${user.firstName}` : ''}
        </h1>
      </div>

      {/* Context breadcrumb navigation */}
      <DashboardQuickNav
        onNavigate={handleNavigate}
        isTuitionInstitute={isTuitionInstitute}
      />

      {/* Section pills for quick jump */}
      {sections.length > 1 && (
        <DashboardSectionPills
          sections={sectionTitles}
          activeIndex={activeSection}
          onSelect={scrollToSection}
        />
      )}

      {/* Swipeable sections */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {sections.map((section, i) => (
            <div key={section.title} className="min-w-0 shrink-0 grow-0 basis-full px-0.5">
              <div className="flex items-center justify-between mb-2 px-0.5">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.title}
                </h2>
                <span className="text-[10px] text-muted-foreground/60">
                  {i + 1}/{sections.length}
                </span>
              </div>
              <DashboardGrid items={section.items} onNavigate={handleNavigate} />
            </div>
          ))}
        </div>
      </div>

      {/* Dot indicators */}
      {sections.length > 1 && (
        <div className="flex justify-center gap-1">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToSection(i)}
              className={`rounded-full transition-all duration-200 ${
                i === activeSection
                  ? 'w-5 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MobileDashboard;
