"use client";

import { useState, useRef, useEffect } from "react";
import type { Todo, TodoPriority } from "@/lib/todos/types";

const PRIORITY_COLORS: Record<TodoPriority, string> = {
  low: "todo-item-priority-badge--low",
  medium: "todo-item-priority-badge--medium",
  high: "todo-item-priority-badge--high",
};

interface TodoItemProps {
  todo: Todo;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: { text?: string; priority?: TodoPriority }) => void;
}

export function TodoItem({ todo, index, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) onUpdate(todo.id, { text: trimmed });
    if (!trimmed) setEditText(todo.text);
    setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") {
      setEditText(todo.text);
      setEditing(false);
    }
  };

  const scheduleLabel =
    todo.date && (todo.startTime || todo.endTime)
      ? `${todo.date}${
          todo.startTime ? ` ${todo.startTime}` : ""
        }${todo.endTime ? `–${todo.endTime}` : ""}`
      : todo.date || "";

  return (
    <li
      className={`todo-item ${todo.completed ? "todo-item--completed" : ""}`}
      style={{ animationDelay: `${index * 45}ms` }}
    >
      <div className="todo-item-check-wrap">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`todo-item-check ${todo.completed ? "todo-item-check--checked" : ""}`}
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed && (
            <svg className="todo-item-check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      <div className="todo-item-body">
        {editing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="todo-item-edit-input"
          />
        ) : (
          <>
            <span
              className="todo-item-text"
              onDoubleClick={() => setEditing(true)}
            >
              {todo.text}
            </span>
            {scheduleLabel && (
              <span className="todo-item-schedule">
                {scheduleLabel}
              </span>
            )}
            <span className={`todo-item-priority-badge ${PRIORITY_COLORS[todo.priority]}`}>
              {todo.priority}
            </span>
          </>
        )}
      </div>

      <button
        type="button"
        onClick={() => onDelete(todo.id)}
        className="todo-item-delete"
        aria-label="Delete"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
