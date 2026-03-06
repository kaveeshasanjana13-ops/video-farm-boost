import { apiClient } from './client';
import { enhancedCachedClient } from './enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';

export interface SubjectPayment {
  id: string;
  instituteId: string;
  classId: string;
  subjectId: string;
  createdBy: string;
  title: string;
  description: string;
  targetType: 'PARENTS' | 'STUDENTS';
  priority: 'MANDATORY' | 'OPTIONAL' | 'DONATION';
  amount: string;
  documentUrl?: string;
  lastDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  submissionsCount: number;
  verifiedSubmissionsCount: number;
  pendingSubmissionsCount: number;
  // Student-specific fields for submission status
  mySubmissionStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
  hasSubmitted?: boolean;
}

export interface SubjectPaymentsResponse {
  data: SubjectPayment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SubjectPaymentSubmission {
  id: string;
  paymentId: string;
  userId: string;
  userType: string;
  username: string;
  paymentDate: string;
  receiptUrl: string;
  receiptFilename: string;
  transactionId: string;
  submittedAmount: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  notes?: string;
  uploadedAt: string;
  updatedAt: string;
  // Legacy fields for backward compatibility
  paymentAmount?: number;
  paymentMethod?: string;
  transactionReference?: string;
  receiptFileName?: string;
  receiptFileUrl?: string;
  submitterName?: string;
  verifierName?: string;
  createdAt?: string;
  paymentRemarks?: string;
  lateFeeApplied?: number;
  totalAmountPaid?: number;
  canResubmit?: boolean;
  canDelete?: boolean;
  paymentTitle?: string;
  paymentDescription?: string;
  dueDate?: string;
  priority?: string;
}

export interface SubjectSubmissionsResponse {
  data: SubjectPaymentSubmission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary?: {
    totalSubmissions: number;
    byStatus: {
      pending: number;
      verified: number;
      rejected: number;
    };
    totalAmountSubmitted: number;
    totalAmountVerified: number;
    totalLateFees: number;
  };
}

export interface SubjectPaymentStatsResponse {
  totalSubmissions: number;
  verifiedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  verificationRate: string;
}

export interface SubjectMyStatusResponse {
  hasSubmission: boolean;
  submission?: SubjectPaymentSubmission;
  payment?: SubjectPayment;
}

class SubjectPaymentsApi {
  // Get all subject payments for Admin/Teacher
  async getSubjectPayments(
    instituteId: string, 
    classId: string, 
    subjectId: string,
    page: number = 1,
    limit: number = 50,
    forceRefresh: boolean = false
  ): Promise<SubjectPaymentsResponse> {
    return enhancedCachedClient.get(
      `/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}`,
      { page, limit },
      {
        ttl: CACHE_TTL.SUBJECT_PAYMENTS,
        forceRefresh,
        instituteId,
        classId,
        subjectId
      }
    );
  }

  // Get student's subject payments
  async getMySubjectPayments(
    instituteId: string, 
    classId: string, 
    subjectId: string,
    page: number = 1,
    limit: number = 50,
    forceRefresh: boolean = false
  ): Promise<SubjectPaymentsResponse> {
    return enhancedCachedClient.get(
      `/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}/my-payments`,
      { page, limit },
      {
        ttl: CACHE_TTL.SUBJECT_PAYMENTS,
        forceRefresh,
        instituteId,
        classId,
        subjectId
      }
    );
  }

  // Get payment details
  async getPaymentDetails(
    instituteId: string,
    classId: string,
    subjectId: string,
    paymentId: string
  ): Promise<SubjectPayment> {
    return apiClient.get(`/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}/payment/${paymentId}`);
  }

  // Create subject payment (admin/teacher)
  async createPayment(
    instituteId: string,
    classId: string,
    subjectId: string,
    data: {
      title: string;
      description?: string;
      targetType: 'STUDENTS' | 'PARENTS';
      priority: 'MANDATORY' | 'OPTIONAL' | 'DONATION';
      amount: number;
      documentUrl?: string;
      lastDate: string;
      notes?: string;
    }
  ): Promise<any> {
    return apiClient.post(`/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}`, data);
  }

  // Update subject payment
  async updatePayment(
    instituteId: string,
    classId: string,
    subjectId: string,
    paymentId: string,
    data: Record<string, any>
  ): Promise<any> {
    return apiClient.patch(`/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}/payment/${paymentId}`, data);
  }

  // List payments by class (all subjects)
  async getPaymentsByClass(
    instituteId: string,
    classId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SubjectPaymentsResponse> {
    return apiClient.get(`/institute-class-subject-payments/institute/${instituteId}/class/${classId}/payments`, { page, limit });
  }

  // List payments by institute (all classes)
  async getPaymentsByInstitute(
    instituteId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<SubjectPaymentsResponse> {
    return apiClient.get(`/institute-class-subject-payments/institute/${instituteId}/payments`, { page, limit });
  }

  // Get enrolled users for a class/subject
  async getEnrolledUsers(
    instituteId: string,
    classId: string,
    subjectId: string
  ): Promise<any> {
    return apiClient.get(`/institute-class-subject-payments/institute/${instituteId}/class/${classId}/subject/${subjectId}/enrolled-users`);
  }

  // Get student's subject payment submissions
  async getMySubjectSubmissions(
    instituteId: string, 
    classId: string, 
    subjectId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<SubjectSubmissionsResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/institute/${instituteId}/class/${classId}/subject/${subjectId}/my-submissions`, { page, limit });
  }

  // Get all submissions for a specific subject payment (admin/teacher)
  async getSubjectPaymentSubmissions(
    instituteId: string, 
    classId: string, 
    subjectId: string,
    paymentId: string
  ): Promise<SubjectSubmissionsResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/institute/${instituteId}/class/${classId}/subject/${subjectId}/payment/${paymentId}/submissions`);
  }

  // Get all submissions (admin/teacher) with status filter
  async getAllSubmissions(
    instituteId: string,
    classId: string,
    subjectId: string,
    params?: { page?: number; limit?: number; status?: string }
  ): Promise<SubjectSubmissionsResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/institute/${instituteId}/class/${classId}/subject/${subjectId}/all-submissions`, params);
  }

  // Get submission statistics
  async getSubmissionStats(
    instituteId: string,
    classId: string,
    subjectId: string
  ): Promise<SubjectPaymentStatsResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/institute/${instituteId}/class/${classId}/subject/${subjectId}/stats`);
  }

  // Get payment submissions by payment ID only
  async getPaymentSubmissions(
    paymentId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<SubjectSubmissionsResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/payment/${paymentId}/submissions`, { page, limit });
  }

  // Check my submission status for a payment
  async getMySubmissionStatus(paymentId: string): Promise<SubjectMyStatusResponse> {
    return apiClient.get(`/institute-class-subject-payment-submissions/payment/${paymentId}/my-status`);
  }

  // Verify payment submission (admin/teacher)
  async verifyPaymentSubmission(submissionId: string, data: {
    status: 'VERIFIED' | 'REJECTED';
    rejectionReason?: string;
    notes?: string;
  }): Promise<{ success: boolean; message: string }> {
    return apiClient.patch(`/institute-class-subject-payment-submissions/submission/${submissionId}/verify`, data);
  }

  // Submit payment (student/parent)
  async submitPayment(paymentId: string, data: {
    paymentDate: string;
    submittedAmount: number;
    transactionId?: string;
    notes?: string;
    receiptUrl: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      submissionId: string;
      status: string;
    };
  }> {
    return apiClient.post(`/institute-class-subject-payment-submissions/payment/${paymentId}/submit`, data);
  }

  // Get submission details
  async getSubmissionDetails(submissionId: string): Promise<any> {
    return apiClient.get(`/institute-class-subject-payment-submissions/submission/${submissionId}`);
  }

  // Delete submission (student/parent - pending only)
  async deleteSubmission(submissionId: string): Promise<{ success: boolean; message: string }> {
    return apiClient.patch(`/institute-class-subject-payment-submissions/submission/${submissionId}/delete`, {});
  }
}

export const subjectPaymentsApi = new SubjectPaymentsApi();