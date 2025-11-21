
import { useEffect } from "react";
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import QRAttendance from '@/components/QRAttendance';
import RFIDAttendance from '@/pages/RFIDAttendance';
import InstituteMarkAttendance from '@/pages/InstituteMarkAttendance';

import NotFound from "./pages/NotFound";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import PaymentSubmissions from "./pages/PaymentSubmissions";
import MySubmissions from "./pages/MySubmissions";
import InstitutePayments from "./pages/InstitutePayments";
import SubjectPayments from "./pages/SubjectPayments";
import SubjectSubmissions from "./pages/SubjectSubmissions";
import SubjectPaymentSubmissions from "./pages/SubjectPaymentSubmissions";
import PaymentSubmissionsPage from "./pages/PaymentSubmissionsPage";
import HomeworkSubmissions from "./pages/HomeworkSubmissions";
import HomeworkSubmissionDetails from "./pages/HomeworkSubmissionDetails";
import { AuthProvider } from "@/contexts/AuthContext";
import UpdateHomework from '@/pages/UpdateHomework';
import UpdateLecture from '@/pages/UpdateLecture';
import CardDemo from '@/pages/CardDemo';
import ExamResults from '@/pages/ExamResults';
import CreateExamResults from '@/pages/CreateExamResults';
import ErrorBoundary from '@/components/ErrorBoundary';
import Transport from '@/pages/Transport';
import TransportAttendance from '@/pages/TransportAttendance';
import MyChildren from '@/pages/MyChildren';
import ChildDashboard from '@/pages/ChildDashboard';
import ChildResultsPage from '@/pages/ChildResultsPage';
import ChildAttendancePage from '@/pages/ChildAttendancePage';
import ChildTransportPage from '@/pages/ChildTransportPage';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Force light mode
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('theme', 'light');
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Main Dashboard Route */}
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Index />} />
              
              {/* Context-Aware Institute Routes - ALL go through Index/AppContent */}
              <Route path="/institutes" element={<Index />} />
              <Route path="/institute/:instituteId/*" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/*" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/*" element={<Index />} />
              
              <Route path="/institutes/users" element={<Index />} />
              <Route path="/institute-users" element={<Index />} />
              <Route path="/institutes/classes" element={<Index />} />
              <Route path="/verify-image" element={<Index />} />
              
              {/* Organization Routes */}
              <Route path="/organizations" element={<Index />} />
              <Route path="/organization/:organizationId/*" element={<Index />} />
              <Route path="/institute-organizations" element={<Index />} />
              
              {/* User Management Routes */}
              <Route path="/users" element={<Index />} />
              <Route path="/students" element={<Index />} />
              <Route path="/unverified-students" element={<Index />} />
              <Route path="/enroll-class" element={<Index />} />
              <Route path="/enroll-subject" element={<Index />} />
              <Route path="/teachers" element={<Index />} />
              <Route path="/parents" element={<Index />} />
              
              {/* Academic Routes */}
              <Route path="/classes" element={<Index />} />
              <Route path="/subjects" element={<Index />} />
              <Route path="/grades" element={<Index />} />
              <Route path="/grading" element={<Index />} />
              <Route path="/grades-table" element={<Index />} />
              <Route path="/create-grade" element={<Index />} />
              <Route path="/assign-grade-classes" element={<Index />} />
              <Route path="/view-grade-classes" element={<Index />} />
              
              {/* Attendance Routes */}
              <Route path="/attendance" element={<Index />} />
              <Route path="/my-attendance" element={<Index />} />
              <Route path="/daily-attendance" element={<Index />} />
              
              <Route path="/attendance-markers" element={<Index />} />
              <Route path="/qr-attendance" element={<Index />} />
              <Route path="/rfid-attendance" element={<RFIDAttendance />} />
              <Route path="/institute-mark-attendance" element={<Index />} />
              
              {/* Academic Content Routes */}
              <Route path="/lectures" element={<Index />} />
              <Route path="/institute-lectures" element={<Index />} />
              <Route path="/live-lectures" element={<Index />} />
              <Route path="/free-lectures" element={<Index />} />
              <Route path="/homework" element={<Index />} />
                <Route path="/homework/update/:homeworkId" element={<UpdateHomework />} />
                <Route path="/lecture/update/:lectureId" element={<UpdateLecture />} />
              <Route path="/homework-submissions" element={<Index />} />
              <Route path="/homework-submissions/:homeworkId" element={<HomeworkSubmissions />} />
              <Route path="/homework/:homeworkId/submissions" element={<HomeworkSubmissionDetails />} />
              <Route path="/exams" element={<Index />} />
          <Route path="/exams/:examId/results" element={<ExamResults />} />
          <Route path="/exams/:examId/create-results" element={<CreateExamResults />} />
              <Route path="/results" element={<Index />} />
              
              {/* Selection Routes */}
              <Route path="/select-institute" element={<Index />} />
              <Route path="/select-class" element={<Index />} />
              <Route path="/select-subject" element={<Index />} />
              <Route path="/parent-children" element={<Index />} />
              
              {/* Parent Child Routes */}
              <Route path="/child-attendance" element={<Index />} />
              <Route path="/child-results" element={<Index />} />
              
              {/* Teacher Specific Routes */}
              <Route path="/teacher-students" element={<Index />} />
              <Route path="/teacher-homework" element={<Index />} />
              <Route path="/teacher-exams" element={<Index />} />
              <Route path="/teacher-lectures" element={<Index />} />
              
              {/* Settings and Profile Routes */}
              <Route path="/profile" element={<Index />} />
              <Route path="/settings" element={<Index />} />
              <Route path="/appearance" element={<Index />} />
              <Route path="/institute-details" element={<Index />} />
              <Route path="/institute-profile" element={<Index />} />
              <Route path="/gallery" element={<Index />} />
              <Route path="/sms" element={<Index />} />
              <Route path="/sms-history" element={<Index />} />
              
              {/* Transport Routes */}
              <Route path="/transport" element={<Transport />} />
              <Route path="/transport/:transportId/*" element={<TransportAttendance />} />
              <Route path="/transport/:transportId/attendance" element={<TransportAttendance />} />
              
              {/* Child Routes */}
              <Route path="/my-children" element={<MyChildren />} />
              <Route path="/child/:childId/*" element={<ChildDashboard />} />
              <Route path="/child/:childId/dashboard" element={<ChildDashboard />} />
              <Route path="/child/:childId/results" element={<ChildResultsPage />} />
              <Route path="/child/:childId/attendance" element={<ChildAttendancePage />} />
              <Route path="/child/:childId/transport" element={<ChildTransportPage />} />
              
              {/* Demo Routes */}
              <Route path="/card-demo" element={<CardDemo />} />
              
              {/* Payment Routes */}
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/create" element={<CreatePayment />} />
              <Route path="/payment-submissions/:paymentId" element={<PaymentSubmissions />} />
              <Route path="/payment-submissions" element={<PaymentSubmissionsPage />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
              <Route path="/institute-payments" element={<Index />} />
              <Route path="/subject-payments" element={<Index />} />
              <Route path="/subject-submissions" element={<SubjectSubmissions />} />
              <Route path="/subject-pay-submission" element={<SubjectPaymentSubmissions />} />
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
