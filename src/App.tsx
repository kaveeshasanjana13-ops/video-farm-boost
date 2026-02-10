import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorToaster, Toaster as Sonner } from "@/components/ui/sonner";
import { NotificationToast } from "@/components/notifications/NotificationToast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { useCapacitorConnection } from "@/hooks/useCapacitorConnection";
import CapacitorConnectionError from "@/components/CapacitorConnectionError";
import AppLoadingScreen from "@/components/AppLoadingScreen";
import Index from "./pages/Index";
import QRAttendance from "@/components/QRAttendance";
import RfidAttendance from "@/pages/RFIDAttendance";
import InstituteMarkAttendance from "@/pages/InstituteMarkAttendance";

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
import UpdateHomework from "@/pages/UpdateHomework";
import UpdateLecture from "@/pages/UpdateLecture";
import CardDemo from "@/pages/CardDemo";
import ExamResults from "@/pages/ExamResults";
import CreateExamResults from "@/pages/CreateExamResults";
import ErrorBoundary from "@/components/ErrorBoundary";
import Transport from "@/pages/Transport";
import TransportAttendance from "@/pages/TransportAttendance";
import MyChildren from "@/pages/MyChildren";
import ChildDashboard from "@/pages/ChildDashboard";
import ChildResultsPage from "@/pages/ChildResultsPage";
import ChildAttendancePage from "@/pages/ChildAttendancePage";
import ChildTransportPage from "@/pages/ChildTransportPage";
import CardManagement from "@/pages/CardManagement";
import ProtectedRoute from "@/components/ProtectedRoute";
import GoogleAuthCallback from "@/pages/GoogleAuthCallback";
import ActiveSessionsPage from "@/pages/ActiveSessions";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// MUI Theme with Inter font
const muiTheme = createTheme({
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    fontSize: 14
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        }
      }
    }
  }
});

const App = () => {
  const { isOnline, isLoading, retry } = useCapacitorConnection();

  useEffect(() => {
    // Force light mode
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.setItem('theme', 'light');
    
    // Hide splash screen after app is ready
    if (Capacitor.isNativePlatform()) {
      import('@capacitor/splash-screen').then(({ SplashScreen }) => {
        setTimeout(() => {
          SplashScreen.hide();
        }, 500);
      }).catch((err) => {
        console.warn('SplashScreen module not available:', err);
      });
    }
  }, []);

  // Handle Android back button - MUST be before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      let listenerHandle: any = null;
      
      const setupListener = async () => {
        listenerHandle = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            // If at root, exit the app
            CapacitorApp.exitApp();
          }
        });
      };
      
      setupListener();

      return () => {
        if (listenerHandle) {
          listenerHandle.remove();
        }
      };
    }
  }, []);

  // Show connection error page only when definitively offline (not during loading)
  // IMPORTANT: This must be AFTER all hooks to comply with Rules of Hooks
  if (Capacitor.isNativePlatform() && !isLoading && !isOnline) {
    return <CapacitorConnectionError onRetry={retry} />;
  }

  return (
    <ErrorBoundary>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Toaster />
              <Sonner />
              <ErrorToaster />
              <NotificationToast />
              <Routes>
                {/* Main Routes - All handled by Index/AppContent */}
                <Route path="/" element={<Index />} />

                {/* Google Drive OAuth - backend redirects back here with query params */}
                <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

                {/* Hierarchical Routes with Context */}
                <Route path="/institute/:instituteId/*" element={<Index />} />
                <Route path="/organization/:organizationId/*" element={<Index />} />
                <Route path="/child/:childId/*" element={<Index />} />
                <Route path="/transport/:transportId/*" element={<Index />} />

                {/* Common Routes handled by Index/AppContent */}
                <Route path="/dashboard" element={<Index />} />
                <Route path="/profile" element={<Index />} />
                <Route path="/settings" element={<Index />} />
                <Route path="/appearance" element={<Index />} />
                <Route path="/institutes" element={<Index />} />
                <Route path="/organizations" element={<Index />} />
                <Route path="/qr-attendance" element={<Index />} />
                <Route path="/rfid-attendance" element={<Index />} />
                <Route path="/sms-history" element={<Index />} />
                <Route path="/enrollment-management" element={<Index />} />
                <Route path="/students" element={<Index />} />
                <Route path="/teachers" element={<Index />} />
                <Route path="/parents" element={<Index />} />
                <Route path="/users" element={<Index />} />

                {/* Selection Routes */}
                <Route path="/select-institute" element={<Index />} />
                <Route path="/select-class" element={<Index />} />
                <Route path="/select-subject" element={<Index />} />

                {/* Additional pages handled by AppContent */}
                <Route path="/classes" element={<Index />} />
                <Route path="/subjects" element={<Index />} />
                <Route path="/attendance" element={<Index />} />
                <Route path="/daily-attendance" element={<Index />} />
                <Route path="/lectures" element={<Index />} />
                <Route path="/free-lectures" element={<Index />} />
                <Route path="/live-lectures" element={<Index />} />
                <Route path="/institute-lectures" element={<Index />} />
                <Route path="/homework" element={<Index />} />
                <Route path="/homework-submissions" element={<Index />} />
                <Route path="/exams" element={<Index />} />
                <Route path="/results" element={<Index />} />
                <Route path="/grades" element={<Index />} />
                <Route path="/grading" element={<Index />} />
                <Route path="/institute-details" element={<Index />} />
                <Route path="/institute-profile" element={<Index />} />
                <Route path="/institute-users" element={<Index />} />
                <Route path="/institute-payments" element={<Index />} />
                <Route path="/institute-subjects" element={<Index />} />
                <Route path="/institute-organizations" element={<Index />} />
                <Route path="/institute-mark-attendance" element={<Index />} />
                <Route path="/subject-payments" element={<Index />} />
                <Route path="/subject-submissions" element={<Index />} />
                <Route path="/subject-pay-submission" element={<Index />} />
                <Route path="/my-submissions" element={<Index />} />
                <Route path="/sms" element={<Index />} />
                <Route path="/notifications" element={<Index />} />
                <Route path="/institute-notifications" element={<Index />} />
                <Route path="/setup-guide" element={<Index />} />
                <Route path="/verify-image" element={<Index />} />
                <Route path="/enroll-class" element={<Index />} />
                <Route path="/enroll-subject" element={<Index />} />
                <Route path="/my-attendance" element={<Index />} />
                <Route path="/attendance-markers" element={<Index />} />
                <Route path="/unverified-students" element={<Index />} />
                <Route path="/class-subjects" element={<Index />} />
                <Route path="/teacher-students" element={<Index />} />
                <Route path="/teacher-homework" element={<Index />} />
                <Route path="/teacher-exams" element={<Index />} />
                <Route path="/teacher-lectures" element={<Index />} />

                {/* Dedicated Page Routes (must be protected) */}
                <Route
                  path="/my-children"
                  element={
                    <ProtectedRoute>
                      <MyChildren />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transport"
                  element={
                    <ProtectedRoute>
                      <Transport />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/system-payment"
                  element={
                    <ProtectedRoute>
                      <Payments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/system-payments/create"
                  element={
                    <ProtectedRoute>
                      <CreatePayment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-submissions/:paymentId"
                  element={
                    <ProtectedRoute>
                      <PaymentSubmissions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment-submissions"
                  element={
                    <ProtectedRoute>
                      <PaymentSubmissionsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/my-submissions"
                  element={
                    <ProtectedRoute>
                      <MySubmissions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/card-demo"
                  element={
                    <ProtectedRoute>
                      <CardDemo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/id-cards"
                  element={
                    <ProtectedRoute>
                      <CardManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sessions"
                  element={
                    <ProtectedRoute>
                      <ActiveSessionsPage />
                    </ProtectedRoute>
                  }
                />

                {/* Catch-all - Show 404 for unknown paths */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

