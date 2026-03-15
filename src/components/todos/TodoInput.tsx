"use client";

import { useState, useRef, useEffect } from "react";
import type { TodoPriority } from "@/lib/todos/types";

const PRIORITIES: { value: TodoPriority; label: string; color: string }[] = [
  { value: "low", label: "Low", color: "todo-priority-low" },
  { value: "medium", label: "Med", color: "todo-priority-medium" },
  { value: "high", label: "High", color: "todo-priority-high" },
];

interface TodoInputProps {
  onAdd: (
    text: string,
    priority: TodoPriority,
    date?: string,
    startTime?: string,
    endTime?: string
  ) => void;
  placeholder?: string;
}

export function TodoInput({ onAdd, placeholder = "What needs to be done?" }: TodoInputProps) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed) {
      onAdd(
        trimmed,
        priority,
        date || undefined,
        startTime || undefined,
        endTime || undefined
      );
      setText("");
      setPriority("medium");
      setDate("");
      setStartTime("");
      setEndTime("");
    }
  };

  useEffect(() => {
    if (focused && inputRef.current) inputRef.current.focus();
  }, [focused]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`todo-input-wrap ${focused ? "todo-input-wrap--focused" : ""}`}
    >
      <div className="todo-input-inner">
        <div className="todo-input-title-row">
          <label className="todo-field">
            <span className="todo-field-label">Task</span>
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              className="todo-input"
              aria-label="New todo"
            />
          </label>
        </div>
        <div className="todo-input-actions">
          <div className="todo-input-meta">
            <div className="todo-priority-group">
              <span className="todo-meta-label">Priority</span>
              <div className="todo-priority-pills" role="group" aria-label="Priority">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`todo-priority-pill ${p.color} ${priority === p.value ? "todo-priority-pill--active" : ""}`}
                    title={p.label}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="todo-schedule-fields">
              <div className="todo-field">
                <span className="todo-meta-label">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="todo-field todo-time-range">
                <span className="todo-meta-label">Time</span>
                <div className="todo-time-inputs">
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <span className="todo-schedule-separator">–</span>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="todo-add-btn" disabled={!text.trim()} aria-label="Add todo">
            Add
          </button>
        </div>
      </div>
    </form>
  );
}
