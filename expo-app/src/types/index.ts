/**
 * Type Definitions
 * Shared types for API responses and state management
 */

// ============== USER ==============

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'student';
  is_active: boolean;
}

export interface AdminStudentUser {
  id: number;
  email: string;
  name: string;
  role: 'student';
  student: number | null;
  student_id?: string | null;
  student_info?: {
    student_id: string;
    name: string;
    email: string;
    course: string;
    year_level: string;
    age?: number | null;
  } | null;
  is_active: boolean;
  date_joined: string;
  temp_password?: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

// ============== STUDENTS ==============

export interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  course: string;
  year_level: string;
  age?: number;
  total_units: number;
  total_subjects: number;
  enrollments?: Enrollment[];
  created_at: string;
  updated_at: string;
}

export interface NewStudent {
  student_id: string;
  name: string;
  email: string;
  course: string;
  year_level: string;
  age?: number;
}

// ============== SUBJECTS ==============

export interface Subject {
  id: number;
  code: string;
  title: string;
  description: string;
  units: number;
  created_at: string;
}

export interface NewSubject {
  code: string;
  title: string;
  description: string;
  units: number;
}

// ============== SECTIONS ==============

export interface Section {
  id: number;
  subject: Subject | number;
  name: string;
  schedule: string;
  time_start: string;
  time_end: string;
  room: string;
  max_capacity: number;
  current_enrollment: number;
  available_capacity: number;
  created_at: string;
}

export interface NewSection {
  subject_id: number;
  name: string;
  schedule: string;
  time_start: string;
  time_end: string;
  room: string;
  max_capacity: number;
}

// ============== ENROLLMENTS ==============

export interface Enrollment {
  id: number;
  student_id: string;
  student_name: string;
  subject: Subject | number;
  section: Section | number;
  status: 'enrolled' | 'dropped' | 'completed';
  enrolled_at: string;
  updated_at: string;
}

export interface NewEnrollment {
  student_id: number;
  subject_id: number;
  section_id?: number;
}

export interface MyEnrollmentsResponse {
  enrollments: Enrollment[];
  total_units: number;
  total_subjects: number;
}

export interface StudentRegistrationData {
  student_id: string;
  name: string;
  email: string;
  course: string;
  year_level: '1st' | '2nd' | '3rd' | '4th';
  age?: number | null;
  password: string;
  re_password: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    email: string;
    name: string;
  };
}

export interface AdminRegistrationData {
  name: string;
  email: string;
  password: string;
  re_password: string;
  admin_image?: string | null;
}
