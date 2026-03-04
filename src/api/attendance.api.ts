/**
 * Unified Attendance API Module
 * 
 * Covers ALL attendance endpoints from the API guide:
 * - Mark attendance (single, bulk, by card, by institute card)
 * - Query attendance (student, institute, class, subject scoped)
 * - Calendar-linked attendance queries (by event, by day, by user type)
 * - Card user lookup
 */

import { attendanceApiClient } from './attendanceClient';
import { getAttendanceUrl, getApiHeaders, getBaseUrl } from '@/contexts/utils/auth.api';
import { attendanceDuplicateChecker } from '@/utils/attendanceDuplicateCheck';
import type {
  AttendanceStatus,
  MarkingMethod,
  AttendanceUserType,
  AttendanceSummary,
  InstituteAttendanceSummary,
  AttendanceRecord,
  AttendancePagination,
  MarkAttendancePayload,
  BulkAttendancePayload,
  MarkByCardPayload,
  BulkCardAttendancePayload,
  MarkByInstituteCardPayload,
  MarkAttendanceResponse,
  BulkAttendanceResponse,
  MarkByCardResponse,
  MarkByInstituteCardResponse,
  CardUserResponse,
  AttendanceQueryResponse,
} from '@/types/attendance.types';

// ═══════════════════════════════════════════════════════════
// Helper: POST with credentials + duplicate check
// ═══════════════════════════════════════════════════════════

async function postAttendance<T>(endpoint: string, body: any): Promise<T> {
  let baseUrl = getAttendanceUrl();
  if (!baseUrl) {
    baseUrl = getBaseUrl();
    if (!baseUrl) throw new Error('No API URL configured.');
  }
  const url = `${baseUrl.replace(/\/$/, '')}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { ...getApiHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
  }
  return response.json();
}

// ═══════════════════════════════════════════════════════════
// 2. MARK ATTENDANCE APIs
// ═══════════════════════════════════════════════════════════

const markAttendanceApi = {
  /**
   * 2.1 Mark single student attendance
   * POST /api/attendance/mark
   */
  async markSingle(payload: MarkAttendancePayload): Promise<MarkAttendanceResponse> {
    const userId = localStorage.getItem('userId') || 'unknown';
    const method = (payload.markingMethod || 'manual') as 'manual' | 'qr' | 'barcode' | 'rfid/nfc';

    const isDuplicate = attendanceDuplicateChecker.isDuplicate({
      userId,
      studentId: payload.studentId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    if (isDuplicate) {
      throw new Error('This attendance was already marked recently. Please wait before marking again.');
    }

    const result = await postAttendance<MarkAttendanceResponse>('/api/attendance/mark', payload);

    attendanceDuplicateChecker.recordAttendance({
      userId,
      studentId: payload.studentId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    return result;
  },

  /**
   * 2.2 Mark bulk student attendance
   * POST /api/attendance/mark-bulk
   * Max 100 students per request
   */
  async markBulk(payload: BulkAttendancePayload): Promise<BulkAttendanceResponse> {
    if (payload.students.length > 100) {
      throw new Error('Maximum 100 students per bulk request.');
    }
    return postAttendance<BulkAttendanceResponse>('/api/attendance/mark-bulk', payload);
  },

  /**
   * 2.3 Mark attendance by student card (RFID)
   * POST /api/attendance/mark-by-card
   */
  async markByCard(payload: MarkByCardPayload): Promise<MarkByCardResponse> {
    const userId = localStorage.getItem('userId') || 'unknown';
    const method = payload.markingMethod as 'manual' | 'qr' | 'barcode' | 'rfid/nfc';

    const isDuplicate = attendanceDuplicateChecker.isDuplicate({
      userId,
      studentCardId: payload.studentCardId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    if (isDuplicate) {
      throw new Error('This attendance was already marked recently. Please wait before marking again.');
    }

    const result = await postAttendance<MarkByCardResponse>('/api/attendance/mark-by-card', payload);

    attendanceDuplicateChecker.recordAttendance({
      userId,
      studentCardId: payload.studentCardId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    return result;
  },

  /**
   * 2.4 Mark bulk attendance by student cards
   * POST /api/attendance/mark-bulk-by-card
   */
  async markBulkByCard(payload: BulkCardAttendancePayload): Promise<BulkAttendanceResponse> {
    if (payload.students.length > 100) {
      throw new Error('Maximum 100 students per bulk card request.');
    }
    return postAttendance<BulkAttendanceResponse>('/api/attendance/mark-bulk-by-card', payload);
  },

  /**
   * 2.5 Mark attendance by institute card
   * POST /api/attendance/mark-by-institute-card
   */
  async markByInstituteCard(payload: MarkByInstituteCardPayload): Promise<MarkByInstituteCardResponse> {
    const userId = localStorage.getItem('userId') || 'unknown';
    const method = (payload.markingMethod || 'rfid/nfc') as 'manual' | 'qr' | 'barcode' | 'rfid/nfc';

    const isDuplicate = attendanceDuplicateChecker.isDuplicate({
      userId,
      studentCardId: payload.instituteCardId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    if (isDuplicate) {
      throw new Error('This attendance was already marked recently. Please wait before marking again.');
    }

    const result = await postAttendance<MarkByInstituteCardResponse>(
      '/api/attendance/mark-by-institute-card',
      payload,
    );

    attendanceDuplicateChecker.recordAttendance({
      userId,
      studentCardId: payload.instituteCardId,
      instituteId: payload.instituteId,
      classId: payload.classId,
      subjectId: payload.subjectId,
      status: payload.status,
      method,
    });

    return result;
  },
};

// ═══════════════════════════════════════════════════════════
// 3. QUERY ATTENDANCE APIs
// ═══════════════════════════════════════════════════════════

interface DateRangeParams {
  startDate: string;
  endDate: string;
  page?: number;
  limit?: number;
  status?: AttendanceStatus;
  studentId?: string;
}

const queryAttendanceApi = {
  /**
   * 3.1 Get student attendance records
   * GET /api/attendance/student/:studentId
   */
  async getStudentAttendance(
    studentId: string,
    params: { instituteId: string; startDate: string; endDate: string; page?: number; limit?: number; status?: string },
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/student/${studentId}`,
      params,
      { ttl: 30, useStaleWhileRevalidate: true },
    );
  },

  /**
   * 3.2 Get student attendance by card ID
   * GET /api/attendance/by-cardId/:cardId
   */
  async getAttendanceByCardId(
    cardId: string,
    params?: { startDate?: string; endDate?: string; page?: number; limit?: number },
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/by-cardId/${cardId}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 3.3 Get institute attendance
   * GET /api/attendance/institute/:instituteId
   */
  async getInstituteAttendance(
    instituteId: string,
    params: DateRangeParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/institute/${instituteId}`,
      params as any,
      { ttl: 10, useStaleWhileRevalidate: true },
    );
  },

  /**
   * 3.4 Get class attendance
   * GET /api/attendance/institute/:instituteId/class/:classId
   */
  async getClassAttendance(
    instituteId: string,
    classId: string,
    params: DateRangeParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}`,
      params as any,
      { ttl: 10, useStaleWhileRevalidate: true },
    );
  },

  /**
   * 3.5 Get subject attendance
   * GET /api/attendance/institute/:instituteId/class/:classId/subject/:subjectId
   */
  async getSubjectAttendance(
    instituteId: string,
    classId: string,
    subjectId: string,
    params: DateRangeParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}/subject/${subjectId}`,
      params as any,
      { ttl: 10, useStaleWhileRevalidate: true },
    );
  },

  /**
   * 3.6 Get class-scoped student attendance
   * GET /api/attendance/institute/:instituteId/class/:classId/student/:studentId
   */
  async getClassStudentAttendance(
    instituteId: string,
    classId: string,
    studentId: string,
    params: { startDate: string; endDate: string; page?: number; limit?: number; status?: string },
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}/student/${studentId}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 3.7 Get subject-scoped student attendance
   * GET /api/attendance/institute/:instituteId/class/:classId/subject/:subjectId/student/:studentId
   */
  async getSubjectStudentAttendance(
    instituteId: string,
    classId: string,
    subjectId: string,
    studentId: string,
    params: { startDate: string; endDate: string; page?: number; limit?: number; status?: string },
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}/subject/${subjectId}/student/${studentId}`,
      params,
      { ttl: 30 },
    );
  },
};

// ═══════════════════════════════════════════════════════════
// 4. CALENDAR-LINKED ATTENDANCE QUERIES
// ═══════════════════════════════════════════════════════════

interface CalendarAttendanceParams {
  date?: string;
  classId?: string;
  subjectId?: string;
  userType?: string;
  eventId?: string;
  startDate?: string;
  endDate?: string;
}

const calendarAttendanceApi = {
  /**
   * 4.1 Get attendance by event
   * GET /api/attendance/calendar/institute/:instituteId/event/:eventId
   */
  async getByEvent(
    instituteId: string,
    eventId: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/event/${eventId}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 4.2 Get attendance by calendar day
   * GET /api/attendance/calendar/institute/:instituteId/calendar-day/:calendarDayId
   */
  async getByCalendarDay(
    instituteId: string,
    calendarDayId: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/calendar-day/${calendarDayId}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 4.3 Get attendance by user type (institute-wide)
   * GET /api/attendance/calendar/institute/:instituteId/user-type/:userType
   */
  async getByUserType(
    instituteId: string,
    userType: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/user-type/${userType}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 4.4 Get attendance by user type (class-scoped)
   * GET /api/attendance/calendar/institute/:instituteId/class/:classId/user-type/:userType
   */
  async getByUserTypeClass(
    instituteId: string,
    classId: string,
    userType: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/class/${classId}/user-type/${userType}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 4.5 Get attendance by user type (subject-scoped)
   * GET /api/attendance/calendar/institute/:instituteId/class/:classId/subject/:subjectId/user-type/:userType
   */
  async getByUserTypeSubject(
    instituteId: string,
    classId: string,
    subjectId: string,
    userType: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/class/${classId}/subject/${subjectId}/user-type/${userType}`,
      params,
      { ttl: 30 },
    );
  },

  /**
   * 4.6 Get student attendance at specific event
   * GET /api/attendance/calendar/institute/:instituteId/student/:studentId/event/:eventId
   */
  async getStudentEventAttendance(
    instituteId: string,
    studentId: string,
    eventId: string,
    params?: CalendarAttendanceParams,
  ): Promise<AttendanceQueryResponse> {
    return attendanceApiClient.get<AttendanceQueryResponse>(
      `/api/attendance/calendar/institute/${instituteId}/student/${studentId}/event/${eventId}`,
      params,
      { ttl: 30 },
    );
  },
};

// ═══════════════════════════════════════════════════════════
// 5. CARD USER LOOKUP APIs
// ═══════════════════════════════════════════════════════════

const cardUserApi = {
  /**
   * 5.1 Get institute user by card ID
   * GET /api/attendance/institute-card-user
   */
  async getByInstituteCard(
    instituteCardId: string,
    instituteId: string,
  ): Promise<CardUserResponse> {
    return attendanceApiClient.get<CardUserResponse>(
      '/api/attendance/institute-card-user',
      { instituteCardId, instituteId },
      { ttl: 60 },
    );
  },

  /**
   * 5.2 Get card user (class context)
   * GET /api/attendance/institute/:instituteId/class/:classId/card-user
   */
  async getByInstituteCardClass(
    instituteId: string,
    classId: string,
    instituteCardId: string,
  ): Promise<CardUserResponse> {
    return attendanceApiClient.get<CardUserResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}/card-user`,
      { instituteCardId },
      { ttl: 60 },
    );
  },

  /**
   * 5.3 Get card user (subject context)
   * GET /api/attendance/institute/:instituteId/class/:classId/subject/:subjectId/card-user
   */
  async getByInstituteCardSubject(
    instituteId: string,
    classId: string,
    subjectId: string,
    instituteCardId: string,
  ): Promise<CardUserResponse> {
    return attendanceApiClient.get<CardUserResponse>(
      `/api/attendance/institute/${instituteId}/class/${classId}/subject/${subjectId}/card-user`,
      { instituteCardId },
      { ttl: 60 },
    );
  },
};

// ═══════════════════════════════════════════════════════════
// UNIFIED EXPORT
// ═══════════════════════════════════════════════════════════

export const attendanceApi = {
  mark: markAttendanceApi,
  query: queryAttendanceApi,
  calendar: calendarAttendanceApi,
  cardUser: cardUserApi,
};

export default attendanceApi;
