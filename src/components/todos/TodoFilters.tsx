"use client";

import type { TodoFilter } from "@/lib/todos/types";

const FILTERS: { value: TodoFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
];

interface TodoFiltersProps {
  current: TodoFilter;
  onChange: (filter: TodoFilter) => void;
}

export function TodoFilters({ current, onChange }: TodoFiltersProps) {
  return (
    <div className="todo-filters" role="tablist">
      {FILTERS.map((f) => (
        <button
          key={f.value}
          type="button"
          role="tab"
          aria-selected={current === f.value}
          onClick={() => onChange(f.value)}
          className={`todo-filter-pill ${current === f.value ? "todo-filter-pill--active" : ""}`}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
