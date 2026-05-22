/**
 * Enrollments API Service
 */

import API from '../config/api.config';
import { Enrollment, NewEnrollment, MyEnrollmentsResponse } from '../types';

export const getEnrollments = async (page: number = 1): Promise<Enrollment[]> => {
  const response = await API.get<Enrollment[]>('enrollments/', {
    params: { page },
  });
  return response.data;
};

export const getMyEnrollments = async (): Promise<MyEnrollmentsResponse> => {
  const response = await API.get<MyEnrollmentsResponse>(
    'enrollments/my_enrollments/'
  );
  return response.data;
};

export const getEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await API.get<Enrollment>(`enrollments/${id}/`);
  return response.data;
};

export const createEnrollment = async (
  enrollment: NewEnrollment
): Promise<Enrollment> => {
  const response = await API.post<Enrollment>('enrollments/', enrollment);
  return response.data;
};

export const bulkEnroll = async (
  enrollments: Array<{ student_id: number; subject_id: number; section_id?: number }>
): Promise<{ successful: Enrollment[]; failed: any[]; summary: { total: number; successful: number; failed: number } }> => {
  const response = await API.post('enrollments/bulk-enroll/', { enrollments });
  return response.data;
};

export const dropEnrollment = async (id: number): Promise<Enrollment> => {
  const response = await API.post<Enrollment>(
    `enrollments/${id}/drop/`,
    {}
  );
  return response.data;
};
