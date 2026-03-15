"use client";

import { TodoApp } from "@/components/TodoApp";
import { LandingPage } from "@/components/LandingPage";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="todo-app todo-app--loading">
        <div className="todo-loading-pulse" />
        <span>Checking session...</span>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }

  return <TodoApp />;
}
