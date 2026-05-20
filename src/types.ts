import { Subject, Question, Badge } from "./data";

export type Screen = 
  | "LOGIN" 
  | "DASHBOARD" 
  | "SYLLABUS" 
  | "QUIZ" 
  | "STRENGTH" 
  | "TUTOR" 
  | "LEADERBOARD" 
  | "PROFILE" 
  | "SETTINGS" 
  | "ADMIN";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  attachmentUrl?: string;
  attachmentName?: string;
}

export interface QuizResult {
  date: string;
  subjectId: string;
  score: number;
  total: number;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  subjectId: string;
  status: "analyzing" | "completed" | "failed";
  questionsExtracted: number;
  uploadedAt: string;
  summary?: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "achievement" | "study_goal" | "streak" | "upload" | "system";
  timestamp: string;
  read: boolean;
}

export interface UserSettings {
  studyGoalMinutes: number;
  voiceName: string;
  soundEffects: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  examDate: string;
}

export interface ActiveUserSession {
  id: string;
  name: string;
  level: number;
  points: number;
  activeNow: boolean;
  avatarSeed: string;
  streak: number;
}
