export type TodoPriority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  /** Stable key for React list (avoids remount when temp id is replaced by server id) */
  displayKey?: string;
  text: string;
  /** Optional schedule-style metadata */
  date?: string; // "YYYY-MM-DD"
  startTime?: string; // "HH:mm"
  endTime?: string; // "HH:mm"
  completed: boolean;
  priority: TodoPriority;
  createdAt: number;
  completedAt?: number;
}

export type TodoFilter = "all" | "active" | "completed";
