/**
 * Subjects API Service
 */

import API from '../config/api.config';
import { Subject, NewSubject } from '../types';

export const getSubjects = async (page: number = 1): Promise<Subject[]> => {
  const response = await API.get<Subject[]>('subjects/', { params: { page } });
  return response.data;
};

export const getSubject = async (id: number): Promise<Subject> => {
  const response = await API.get<Subject>(`subjects/${id}/`);
  return response.data;
};

export const createSubject = async (subject: NewSubject): Promise<Subject> => {
  const response = await API.post<Subject>('subjects/', subject);
  return response.data;
};

export const updateSubject = async (
  id: number,
  subject: Partial<Subject>
): Promise<Subject> => {
  const response = await API.patch<Subject>(`subjects/${id}/`, subject);
  return response.data;
};

export const deleteSubject = async (id: number): Promise<void> => {
  await API.delete(`subjects/${id}/`);
};
