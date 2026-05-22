/**
 * Students API Service
 */

import API from '../config/api.config';
import { Student, NewStudent } from '../types';

export const getStudents = async (
  page: number = 1,
  search: string = ''
): Promise<Student[]> => {
  const response = await API.get<Student[]>('students/', {
    params: { page, search },
  });
  return response.data;
};

export const getStudent = async (id: number): Promise<Student> => {
  const response = await API.get<Student>(`students/${id}/`);
  return response.data;
};

export const createStudent = async (student: NewStudent): Promise<Student> => {
  const response = await API.post<Student>('students/', student);
  return response.data;
};

export const updateStudent = async (
  id: number,
  student: Partial<Student>
): Promise<Student> => {
  const response = await API.patch<Student>(`students/${id}/`, student);
  return response.data;
};

export const deleteStudent = async (id: number): Promise<void> => {
  await API.delete(`students/${id}/`);
};
