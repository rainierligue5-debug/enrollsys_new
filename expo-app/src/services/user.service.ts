/**
 * User API Service
 * Handles admin student user management.
 */

import API from '../config/api.config';
import { AdminStudentUser } from '../types';

export const getStudentUsers = async (): Promise<AdminStudentUser[]> => {
  const response = await API.get<AdminStudentUser[]>('users/students/');
  return response.data;
};

export const getStudentUser = async (id: number): Promise<AdminStudentUser> => {
  const response = await API.get<AdminStudentUser>(`users/students/${id}/`);
  return response.data;
};

export const createStudentUser = async (data: {
  email: string;
  name: string;
  password?: string;
  student_id?: string;
}): Promise<AdminStudentUser> => {
  const response = await API.post<AdminStudentUser>('users/students/', data);
  return response.data;
};

export const updateStudentUser = async (
  id: number,
  data: Partial<{ email: string; name: string; password?: string; student_id?: string | null }> 
): Promise<AdminStudentUser> => {
  const response = await API.patch<AdminStudentUser>(`users/students/${id}/`, data);
  return response.data;
};

export const deleteStudentUser = async (id: number): Promise<void> => {
  await API.delete(`users/students/${id}/`);
};

export const resetStudentPassword = async (id: number): Promise<{ new_password: string; user: AdminStudentUser }> => {
  const response = await API.post<{ new_password: string; user: AdminStudentUser }>(`users/students/${id}/reset-password`, {});
  return response.data;
};
