import { apiClient, ApiResponse } from './client';
import { enhancedCachedClient } from './enhancedCachedClient';
import { CACHE_TTL } from '@/config/cacheTTL';
import { getBaseUrl } from '@/contexts/utils/auth.api';
export interface InstitutePayment {
  id: string;
  instituteId: string;
  paymentType: string;
  description: string;
  amount: number;
  dueDate: string;
  targetType: 'PARENTS' | 'STUDENTS' | 'BOTH';
  priority: 'MANDATORY' | 'OPTIONAL' | 'DONATION';
  status: 'ACTIVE' | 'INACTIVE' | 'COMPLETED' | 'EXPIRED';
  paymentInstructions?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch?: string;
  };
  lateFeeAmount?: number;
  lateFeeAfterDays?: number;
  reminderDaysBefore?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creatorName: string;
  autoReminderEnabled: boolean;
  notes?: string;
  totalSubmissions: number;
  verifiedSubmissions: number;
  pendingSubmissions: number;
  rejectedSubmissions: number;
  // Student-specific fields for submission status
  mySubmissionStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
  hasSubmitted?: boolean;
}

export interface PaymentSubmission {
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
  verifiedBy: string | null;
  verifiedAt: string | null;
  rejectionReason: string | null;
  notes: string;
  uploadedAt: string;
  updatedAt: string;
}

export interface MyPaymentSubmission {
  id: string;
  paymentId: string;
  paymentType: string;
  description: string;
  dueDate: string;
  priority: string;
  paymentAmount: number;
  paymentMethod: string;
  transactionReference: string;
  paymentDate: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
  verifiedAt: string | null;
  rejectionReason: string | null;
  lateFeeApplied: number;
  totalAmountPaid: number;
  receiptFileName: string;
  receiptFileUrl: string;
  receiptFileSize: number;
  receiptFileType: string;
  paymentRemarks: string;
  createdAt: string;
  canResubmit: boolean;
  canDelete: boolean;
  daysSinceSubmission: number;
}

export interface InstitutePaymentsResponse {
  success: boolean;
  message: string;
  data: {
    payments: InstitutePayment[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface StudentPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    payments: InstitutePayment[];
    userRole: string;
    instituteId: string;
    totalApplicable: number;
    pendingPayments: number;
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface PaymentSubmissionsResponse {
  success: boolean;
  message: string;
  data: {
    submissions: PaymentSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface MySubmissionsResponse {
  success: boolean;
  message: string;
  data: {
    submissions: MyPaymentSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    summary: {
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
  };
}

export interface PaymentStatsResponse {
  success: boolean;
  data: {
    totalPayments: number;
    activePayments: number;
    completedPayments: number;
    expiredPayments: number;
    totalExpectedAmount: number;
    totalCollectedAmount: number;
    collectionPercentage: string;
    submissionStats: {
      totalSubmissions: number;
      pendingSubmissions: number;
      verifiedSubmissions: number;
      rejectedSubmissions: number;
    };
  };
}

export interface MySummaryResponse {
  success: boolean;
  data: {
    totalApplicable: number;
    totalPaid: number;
    totalPending: number;
    totalRejected: number;
    totalAmountDue: number;
    totalAmountPaid: number;
    outstandingBalance: number;
  };
}

export interface PendingSubmissionsResponse {
  success: boolean;
  data: {
    submissions: PaymentSubmission[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

export interface CreatePaymentRequest {
  paymentType: string;
  description: string;
  amount: number;
  dueDate: string;
  targetType: 'PARENTS' | 'STUDENTS' | 'BOTH';
  priority: 'MANDATORY' | 'OPTIONAL' | 'DONATION';
  paymentInstructions?: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
    branch?: string;
  };
  lateFeeAmount?: number;
  lateFeeAfterDays?: number;
  reminderDaysBefore?: number;
  autoReminderEnabled?: boolean;
  notes?: string;
}

export interface VerifySubmissionRequest {
  status: 'VERIFIED' | 'REJECTED';
  rejectionReason?: string;
  notes?: string;
}

export interface SubmitPaymentRequest {
  paymentAmount: number;
  paymentMethod: 'BANK_TRANSFER' | 'ONLINE_PAYMENT' | 'CASH_DEPOSIT' | 'UPI' | 'CHEQUE';
  transactionReference?: string;
  paymentDate: string;
  paymentRemarks?: string;
  lateFeeApplied?: number;
  receiptUrl: string;
}

class InstitutePaymentsApi {
  // Get all institute payments (admin/teacher view)
  async getInstitutePayments(instituteId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
    targetType?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<InstitutePaymentsResponse> {
    return apiClient.get(`/institute-payments/institute/${instituteId}`, params);
  }

  // Get student/parent's applicable payments
  async getStudentPayments(instituteId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    priority?: string;
  }): Promise<StudentPaymentsResponse> {
    return apiClient.get(`/institute-payments/institute/${instituteId}/my-payments`, params);
  }

  // Get payment statistics (admin/teacher)
  async getPaymentStats(instituteId: string): Promise<PaymentStatsResponse> {
    return apiClient.get(`/institute-payments/institute/${instituteId}/stats`);
  }

  // Get student/parent payment summary
  async getMySummary(instituteId: string): Promise<MySummaryResponse> {
    return apiClient.get(`/institute-payments/institute/${instituteId}/my-summary`);
  }

  // Update a payment
  async updatePayment(instituteId: string, paymentId: string, data: Partial<CreatePaymentRequest>): Promise<any> {
    return apiClient.patch(`/institute-payments/institute/${instituteId}/payment/${paymentId}`, data);
  }

  // Get payment submissions for a specific payment (admin/teacher)
  async getPaymentSubmissions(
    instituteId: string, 
    paymentId: string, 
    params?: {
      page?: number;
      limit?: number;
      status?: string;
      paymentMethod?: string;
      paymentDateFrom?: string;
      paymentDateTo?: string;
      submissionDateFrom?: string;
      submissionDateTo?: string;
      amountFrom?: number;
      amountTo?: number;
      studentName?: string;
      search?: string;
      hasLateFee?: boolean;
      hasAttachment?: boolean;
      sortBy?: string;
      sortOrder?: string;
    }
  ): Promise<PaymentSubmissionsResponse> {
    return apiClient.get(`/institute-payment-submissions/institute/${instituteId}/payment/${paymentId}/submissions`, params);
  }

  // Get pending submissions across all payments (admin/teacher)
  async getPendingSubmissions(instituteId: string, params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<PendingSubmissionsResponse> {
    return apiClient.get(`/institute-payment-submissions/institute/${instituteId}/pending-submissions`, params);
  }

  // Get student's own submissions
  async getMySubmissions(instituteId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    paymentDateFrom?: string;
    paymentDateTo?: string;
  }): Promise<MySubmissionsResponse> {
    return apiClient.get(`/institute-payment-submissions/institute/${instituteId}/my-submissions`, params);
  }

  // Get submissions for a specific student (admin/parent)
  async getStudentSubmissions(instituteId: string, studentId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaymentSubmissionsResponse> {
    return apiClient.get(`/institute-payment-submissions/institute/${instituteId}/student/${studentId}/submissions`, params);
  }

  // Get submission details
  async getSubmissionDetails(instituteId: string, submissionId: string): Promise<any> {
    return apiClient.get(`/institute-payment-submissions/institute/${instituteId}/submission/${submissionId}`);
  }

  // Create a new payment (admin/teacher)
  async createPayment(instituteId: string, data: CreatePaymentRequest): Promise<any> {
    return apiClient.post(`/institute-payments/institute/${instituteId}`, data);
  }

  // Verify/reject a payment submission (admin/teacher)
  async verifySubmissionDetailed(instituteId: string, submissionId: string, data: VerifySubmissionRequest): Promise<any> {
    return apiClient.patch(`/institute-payment-submissions/institute/${instituteId}/submission/${submissionId}/verify`, data);
  }

  // Submit a payment (student/parent)
  async submitPayment(instituteId: string, paymentId: string, data: SubmitPaymentRequest): Promise<any> {
    return apiClient.post(`/institute-payment-submissions/institute/${instituteId}/payment/${paymentId}/submit`, data);
  }

  // Legacy verify method (backward compatibility)
  async verifySubmission(submissionId: string): Promise<any> {
    return apiClient.patch(`/institute-payment-submissions/${submissionId}/verify`);
  }
}

export const institutePaymentsApi = new InstitutePaymentsApi();