
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
              
              {/* 🛡️ HIERARCHICAL INSTITUTE ROUTES - Full Context in URL */}
              <Route path="/institutes" element={<Index />} />
              
              {/* Institute Level */}
              <Route path="/institute/:instituteId" element={<Index />} />
              <Route path="/institute/:instituteId/dashboard" element={<Index />} />
              <Route path="/institute/:instituteId/details" element={<Index />} />
              <Route path="/institute/:instituteId/profile" element={<Index />} />
              <Route path="/institute/:instituteId/users" element={<Index />} />
              <Route path="/institute/:instituteId/classes" element={<Index />} />
              <Route path="/institute/:instituteId/students" element={<Index />} />
              <Route path="/institute/:instituteId/unverified-students" element={<Index />} />
              <Route path="/institute/:instituteId/teachers" element={<Index />} />
              <Route path="/institute/:instituteId/gallery" element={<Index />} />
              <Route path="/institute/:instituteId/payments" element={<Index />} />
              <Route path="/institute/:instituteId/verify-image" element={<Index />} />
              <Route path="/institute/:instituteId/sms" element={<Index />} />
              <Route path="/institute/:instituteId/sms-history" element={<Index />} />
              <Route path="/institute/:instituteId/attendance-markers" element={<Index />} />
              <Route path="/institute/:instituteId/lectures" element={<Index />} />
              <Route path="/institute/:instituteId/institute-lectures" element={<Index />} />
              <Route path="/institute/:instituteId/organizations" element={<Index />} />
              <Route path="/institute/:instituteId/grades" element={<Index />} />
              <Route path="/institute/:instituteId/grading" element={<Index />} />
              <Route path="/institute/:instituteId/parents" element={<Index />} />
              <Route path="/institute/:instituteId/settings" element={<Index />} />
              
              {/* Class Level */}
              <Route path="/institute/:instituteId/class/:classId" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/dashboard" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/students" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subjects" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/attendance" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/my-attendance" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/daily-attendance" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/qr-attendance" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/rfid-attendance" element={<RFIDAttendance />} />
              <Route path="/institute/:instituteId/class/:classId/mark-attendance" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/enroll-subject" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/lectures" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/homework" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/exams" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/results" element={<Index />} />
              
              {/* Subject Level */}
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/dashboard" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/lectures" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/live-lectures" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/homework" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/exams" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/results" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/payments" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/submissions" element={<SubjectSubmissions />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/payment-submissions" element={<SubjectPaymentSubmissions />} />
              
              {/* Lecture Detail */}
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/lecture/:lectureId" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/lecture/:lectureId/update" element={<UpdateLecture />} />
              
              {/* Homework Detail */}
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/homework/:homeworkId" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/homework/:homeworkId/update" element={<UpdateHomework />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/homework/:homeworkId/submissions" element={<HomeworkSubmissionDetails />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/homework-submissions" element={<Index />} />
              
              {/* Exam Detail */}
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/exam/:examId" element={<Index />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/exam/:examId/results" element={<ExamResults />} />
              <Route path="/institute/:instituteId/class/:classId/subject/:subjectId/exam/:examId/create-results" element={<CreateExamResults />} />
              
              {/* Organization Routes */}
              <Route path="/organizations" element={<Index />} />
              <Route path="/organization/:organizationId" element={<Index />} />
              <Route path="/organization/:organizationId/dashboard" element={<Index />} />
              <Route path="/organization/:organizationId/members" element={<Index />} />
              <Route path="/organization/:organizationId/courses" element={<Index />} />
              <Route path="/organization/:organizationId/lectures" element={<Index />} />
              
              {/* Global User Management (SuperAdmin only) */}
              <Route path="/users" element={<Index />} />
              
              {/* Parent Child Routes */}
              <Route path="/my-children" element={<MyChildren />} />
              <Route path="/child/:childId/dashboard" element={<ChildDashboard />} />
              <Route path="/child/:childId/attendance" element={<ChildAttendancePage />} />
              <Route path="/child/:childId/results" element={<ChildResultsPage />} />
              <Route path="/child/:childId/transport" element={<ChildTransportPage />} />
              
              {/* Transport Routes */}
              <Route path="/transport" element={<Transport />} />
              <Route path="/transport/:transportId" element={<TransportAttendance />} />
              <Route path="/transport/:transportId/attendance" element={<TransportAttendance />} />
              
              {/* Global Settings & Profile */}
              <Route path="/profile" element={<Index />} />
              <Route path="/settings" element={<Index />} />
              <Route path="/appearance" element={<Index />} />
              
              {/* Legacy Payment Routes (to be migrated to hierarchical) */}
              <Route path="/payments" element={<Payments />} />
              <Route path="/payments/create" element={<CreatePayment />} />
              <Route path="/payment-submissions/:paymentId" element={<PaymentSubmissions />} />
              <Route path="/payment-submissions" element={<PaymentSubmissionsPage />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
              
              {/* Special Routes */}
              <Route path="/card-demo" element={<CardDemo />} />
              <Route path="/grades" element={<Index />} />
              <Route path="/grading" element={<Index />} />
              
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
