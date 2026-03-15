"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Todo, TodoFilter, TodoPriority } from "@/lib/todos/types";
import { authedFetch } from "@/lib/api/client";

function mapTodoFromApi(t: any): Todo {
  return {
    id: t._id?.toString?.() ?? "",
    text: t.text,
    date: t.date,
    startTime: t.startTime,
    endTime: t.endTime,
    completed: t.completed,
    priority: t.priority,
    createdAt: t.createdAt,
    completedAt: t.completedAt,
  };
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [hydrated, setHydrated] = useState(false);
  const mutationIdRef = useRef(0);
  const addInFlightRef = useRef(false);

  const loadTodos = useCallback(async () => {
    try {
      const res = await authedFetch("/api/todos", { method: "GET" });
      if (!res.ok) throw new Error("Failed to load todos");
      const data = (await res.json()) as any[];
      setTodos(data.map(mapTodoFromApi));
    } catch {
      setTodos([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await authedFetch("/api/todos", { method: "GET" });
        if (!res.ok) throw new Error("Failed to load todos");
        const data = (await res.json()) as any[];
        if (cancelled) return;
        setTodos(data.map(mapTodoFromApi));
      } catch {
        setTodos([]);
      } finally {
        if (!cancelled) setHydrated(true);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const refetchTodos = useCallback(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = useCallback(
    (
      text: string,
      priority: TodoPriority = "medium",
      date?: string,
      startTime?: string,
      endTime?: string
    ) => {
    if (addInFlightRef.current) return;

    setTodos((prev) => [
      ...prev,
      {
        id: `temp-${Math.random().toString(36).slice(2, 8)}`,
        text: text.trim(),
        date,
        startTime,
        endTime,
        completed: false,
        priority,
        createdAt: Date.now(),
      },
    ]);

    addInFlightRef.current = true;
    const id = ++mutationIdRef.current;

    authedFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        todo: { text, priority, date, startTime, endTime },
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        addInFlightRef.current = false;
        if (id !== mutationIdRef.current) return;
        const serverList = (data ?? []).map(mapTodoFromApi);
        setTodos((prev) => {
          const withoutTemp = prev.filter((t) => !t.id.startsWith("temp-"));
          const tempItems = prev.filter((t) => t.id.startsWith("temp-"));
          const existingIds = new Set(withoutTemp.map((t) => t.id));
          const newFromServer = serverList.filter((s: Todo) => !existingIds.has(s.id));
          if (newFromServer.length === 0) return prev;
          const merged = newFromServer.map((item: Todo, i: number) => ({
            ...item,
            displayKey: tempItems[i]?.id ?? item.id,
          }));
          return [...withoutTemp, ...merged];
        });
      })
      .catch(() => {
        addInFlightRef.current = false;
      });
  },
  []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : undefined,
            }
          : t
      )
    );

    authedFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ action: "toggle", id }),
    }).catch(() => {});
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));

    authedFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ action: "delete", id }),
    }).catch(() => {});
  }, []);

  const updateTodo = useCallback((id: string, updates: Partial<Pick<Todo, "text" | "priority">>) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );

    authedFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        id,
        todo: {
          text: updates.text,
          priority: updates.priority,
        },
      }),
    }).catch(() => {});
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));

    const id = ++mutationIdRef.current;
    authedFetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ action: "clearCompleted" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (id !== mutationIdRef.current) return;
        setTodos((data ?? []).map(mapTodoFromApi));
      })
      .catch(() => {});
  }, []);

  const filtered =
    filter === "active"
      ? todos.filter((t) => !t.completed)
      : filter === "completed"
        ? todos.filter((t) => t.completed)
        : todos;

  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return {
    todos: filtered,
    allTodos: todos,
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
  };
}
