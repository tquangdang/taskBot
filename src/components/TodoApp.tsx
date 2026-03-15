"use client";

import { useTodos } from "@/hooks/useTodos";
import {
  TodoInput,
  TodoItem,
  TodoFilters,
  TodoStats,
  EmptyState,
} from "@/components/todos";
import { Chatbot } from "@/components/Chatbot";
import { ScheduleUpload } from "@/components/ScheduleUpload";
import { useAuth } from "@/components/AuthProvider";

export function TodoApp() {
  const { user, signOut } = useAuth();
  const {
    todos,
    filter,
    setFilter,
    stats,
    hydrated,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    refetchTodos,
  } = useTodos();

  if (!hydrated) {
    return (
      <div className="todo-app todo-app--loading">
        <div className="todo-loading-pulse" />
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="todo-app">
      <div className="todo-topbar">
        <div className="todo-topbar-user">
          <span className="todo-user-info" title={user?.email ?? undefined}>
            {user?.displayName ?? user?.email ?? "Signed in"}
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="todo-logout-btn"
            aria-label="Log out"
          >
            Log out
          </button>
        </div>
      </div>

      <header className="todo-header">
        <h1 className="todo-brand">TaskBot</h1>
        <p className="todo-tagline">Tasks, schedule & assistant</p>
      </header>

      <div className="dashboard-grid">
        <section className="todo-main">
          <TodoInput
            onAdd={(text, priority, date, startTime, endTime) => {
              addTodo(text, priority, date, startTime, endTime);
            }}
          />

          <div className="todo-toolbar">
            <TodoFilters current={filter} onChange={setFilter} />
            <TodoStats
              active={stats.active}
              completed={stats.completed}
              onClearCompleted={clearCompleted}
            />
          </div>

          <div className="todo-list-wrap">
            {todos.length === 0 ? (
              <EmptyState filter={filter} />
            ) : (
              <ul className="todo-list">
                {todos.map((todo, i) => (
                  <TodoItem
                    key={todo.displayKey ?? todo.id}
                    todo={todo}
                    index={i}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onUpdate={updateTodo}
                  />
                ))}
              </ul>
            )}
          </div>

          <footer className="todo-footer">
            <span className="todo-footer-dot" />
            <span>{stats.total} total tasks</span>
          </footer>
        </section>

        <aside className="side-panel">
          <Chatbot />
          <ScheduleUpload onUploadSuccess={refetchTodos} />
        </aside>
      </div>
    </div>
  );
}
