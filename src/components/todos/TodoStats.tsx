"use client";

interface TodoStatsProps {
  active: number;
  completed: number;
  onClearCompleted: () => void;
}

export function TodoStats({ active, completed, onClearCompleted }: TodoStatsProps) {
  return (
    <div className="todo-stats">
      <span className="todo-stats-count">
        <strong>{active}</strong> left
      </span>
      {completed > 0 && (
        <button type="button" onClick={onClearCompleted} className="todo-clear-btn">
          Clear completed ({completed})
        </button>
      )}
    </div>
  );
}
