"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "./AuthProvider";

export function AuthForm() {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, loading } =
    useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err?.message ?? "Google sign-in failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <header className="auth-header">
          <h1 className="auth-title">TaskBot</h1>
          <p className="auth-subtitle">
            Sign in to manage your tasks and schedule.
          </p>
        </header>

        <div className="auth-toggle">
          <button
            type="button"
            className={`auth-toggle-btn ${
              mode === "login" ? "auth-toggle-btn--active" : ""
            }`}
            onClick={() => setMode("login")}
            disabled={submitting || loading}
          >
            Log in
          </button>
          <button
            type="button"
            className={`auth-toggle-btn ${
              mode === "signup" ? "auth-toggle-btn--active" : ""
            }`}
            onClick={() => setMode("signup")}
            disabled={submitting || loading}
          >
            Sign up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting || loading}
            />
          </label>

          <label className="auth-field">
            <span>Password</span>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting || loading}
            />
          </label>

          {error && <p className="auth-error">{error}</p>}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting || loading}
          >
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <div className="auth-divider">
          <span />
          <p>or</p>
          <span />
        </div>

        <button
          type="button"
          className="auth-google"
          onClick={handleGoogle}
          disabled={submitting || loading}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
}

