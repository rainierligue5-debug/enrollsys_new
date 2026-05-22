/**
 * Sections API Service
 */

import API from '../config/api.config';
import { Section, NewSection } from '../types';

export const getSections = async (page: number = 1): Promise<Section[]> => {
  const response = await API.get<Section[]>('sections/', { params: { page } });
  return response.data;
};

export const getSection = async (id: number): Promise<Section> => {
  const response = await API.get<Section>(`sections/${id}/`);
  return response.data;
};

export const createSection = async (section: NewSection): Promise<Section> => {
  const response = await API.post<Section>('sections/', section);
  return response.data;
};

export const updateSection = async (
  id: number,
  section: Partial<Section>
): Promise<Section> => {
  const response = await API.patch<Section>(`sections/${id}/`, section);
  return response.data;
};

export const deleteSection = async (id: number): Promise<void> => {
  await API.delete(`sections/${id}/`);
};
