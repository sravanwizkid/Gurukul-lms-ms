export interface Student {
  id: number;
  name: string;
  email: string;
  // Add other student properties
}

export interface Teacher {
  id: number;
  name: string;
  email: string;
  // Add other teacher properties
}

export interface DatabaseError {
  code: string;
  message: string;
}

// Auth types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  studentId: number;
  studentClass: number;
  studentLevel: string;
  gurukulType: string;
  token: string;
}

export interface StudentAuth {
  sid: number;
  password_hash: string;
}

export interface StudentMilestone {
  gtype: string;
  class: number;
  level: string;
}

// Topic types
export interface TopicResponse {
  topicId: number;
  topicName: string;
  progress: string;
  isCompleted: boolean;
  isLocked: boolean;
}

// Lesson types
export interface LessonResponse {
  lessonId: number;
  lessonName: string;
  progress: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface Lesson {
  lid: number;
  lname: string;
  tid: number;
}

// KItem types
export type MediaType = 'video' | 'audio' | 'text' | 'image' | 'quiz';
export type KExpType = 'verification' | 'explanation' | 'curiosity' | 'hook';

export interface KItemResponse {
  kitemId: number;
  kitemType: MediaType;
  experienceType: string;
  kurl: string;
  kdesc: string;
  progress: string;
  isCompleted: boolean;
  isLocked: boolean;
}

export interface KItem {
  kid: number;
  ktype: MediaType;
  kexp: KExpType;
  kurl: string;
  kdesc: string;
}

// Subject types
export interface SubjectResponse {
  subjectId: number;
  subjectName: string;
}

// Database types
export interface Journey {
  jid: number;
  subject_id: number;
}

export interface Subject {
  subid: number;
  subname: string;
}

export interface Topic {
  tid: number;
  tname: string;
  subid: number;
} 