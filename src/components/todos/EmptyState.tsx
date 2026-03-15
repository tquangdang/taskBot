"use client";

import type { TodoFilter } from "@/lib/todos/types";

interface EmptyStateProps {
  filter: TodoFilter;
}

const messages: Record<TodoFilter, { title: string; subtitle: string }> = {
  all: { title: "No tasks yet", subtitle: "Add one above to get started" },
  active: { title: "All clear", subtitle: "No active tasks right now" },
  completed: { title: "No completed tasks", subtitle: "Complete some to see them here" },
};

export function EmptyState({ filter }: EmptyStateProps) {
  const { title, subtitle } = messages[filter];
  return (
    <div className="todo-empty">
      <div className="todo-empty-icon">
        <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="12" y="16" width="40" height="36" rx="4" />
          <path d="M20 16V12a4 4 0 014-4h16a4 4 0 014 4v4" />
          <path d="M24 28h16M24 36h12" />
        </svg>
      </div>
      <p className="todo-empty-title">{title}</p>
      <p className="todo-empty-subtitle">{subtitle}</p>
    </div>
  );
}
