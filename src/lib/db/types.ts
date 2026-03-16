/**
 * Schedule & todo database types
 */

export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface ScheduleEntry {
  _id?: string;
  id?: string;
  userId?: string;
  courseName: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" 24h
  endTime: string;
  room: string;
  instructor?: string;
}

export type Schedule = ScheduleEntry[];

export interface TodoDoc {
  _id?: string;
  userId: string;
  text: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: number;
  completedAt?: number;
}
