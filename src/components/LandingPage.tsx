"use client";

import { AuthForm } from "@/components/AuthForm";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <a href="/" className="landing-logo">
          TaskBot
        </a>
        <a href="#sign-in" className="landing-cta-nav">
          Sign in
        </a>
      </nav>

      <section className="landing-hero">
        <span className="landing-badge">Tasks · Schedule · AI assistant</span>
        <h1 className="landing-hero-title">
          Your tasks, one place.
          <br />
          <span className="landing-hero-highlight">Ask anything.</span>
        </h1>
        <p className="landing-hero-sub">
          TaskBot keeps your to-dos and schedule in sync. Add tasks, set priorities and times, upload from CSV, and chat with your personal schedule assistant.
        </p>
        <a href="#sign-in" className="landing-cta-primary">
          Get started — it&apos;s free
        </a>
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <span className="landing-feature-icon landing-feature-icon--green">
            <CheckIcon />
          </span>
          <h3 className="landing-feature-title">Tasks & schedule</h3>
          <p className="landing-feature-desc">
            Add tasks with priority and optional date and time. Filter by All, Active, or Completed.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-icon landing-feature-icon--blue">
            <ChatIcon />
          </span>
          <h3 className="landing-feature-title">AI schedule assistant</h3>
          <p className="landing-feature-desc">
            Ask &quot;What do I have today?&quot; or &quot;When is my next task?&quot; and get answers from your schedule.
          </p>
        </div>
        <div className="landing-feature">
          <span className="landing-feature-icon landing-feature-icon--accent">
            <UploadIcon />
          </span>
          <h3 className="landing-feature-title">CSV import</h3>
          <p className="landing-feature-desc">
            Bulk-upload tasks from a spreadsheet. Columns: text, date, startTime, endTime, priority.
          </p>
        </div>
      </section>

      <section className="landing-preview-wrap">
        <h2 className="landing-preview-heading">See it in action</h2>
        <div className="landing-preview-browser">
          <div className="landing-preview-browser-bar">
            <span className="landing-preview-dot" />
            <span className="landing-preview-dot" />
            <span className="landing-preview-dot" />
          </div>
          <div className="landing-preview-dashboard">
            <section className="landing-preview-left">
              <div className="todo-input-wrap landing-preview-input">
                <div className="todo-input-inner">
                  <div className="todo-field">
                    <span className="todo-field-label">Task</span>
                    <input
                      className="todo-input"
                      readOnly
                      value="What needs to be done?"
                    />
                  </div>
                  <div className="todo-input-actions">
                    <div className="todo-priority-pills">
                      <span className="todo-priority-pill todo-priority-low">Low</span>
                      <span className="todo-priority-pill todo-priority-medium todo-priority-pill--active">Med</span>
                      <span className="todo-priority-pill todo-priority-high">High</span>
                    </div>
                    <button type="button" className="todo-add-btn" disabled>Add</button>
                  </div>
                </div>
              </div>
              <div className="todo-toolbar">
                <div className="todo-filters">
                  <span className="todo-filter-pill">All</span>
                  <span className="todo-filter-pill todo-filter-pill--active">Active</span>
                  <span className="todo-filter-pill">Completed</span>
                </div>
                <span className="todo-stats"><span className="todo-stats-count"><strong>2</strong> left</span></span>
              </div>
              <ul className="todo-list landing-preview-list">
                <li className="todo-item">
                  <span className="todo-item-check-wrap">
                    <span className="todo-item-check todo-item-check--checked">
                      <CheckIcon className="todo-item-check-icon" />
                    </span>
                  </span>
                  <div className="todo-item-body">
                    <span className="todo-item-text">Morning workout</span>
                    <span className="todo-item-priority-badge todo-item-priority-badge--low">Low</span>
                  </div>
                </li>
                <li className="todo-item">
                  <span className="todo-item-check-wrap"><span className="todo-item-check" /></span>
                  <div className="todo-item-body">
                    <span className="todo-item-text">Review project docs</span>
                    <span className="todo-item-priority-badge todo-item-priority-badge--medium">Med</span>
                  </div>
                </li>
                <li className="todo-item">
                  <span className="todo-item-check-wrap"><span className="todo-item-check" /></span>
                  <div className="todo-item-body">
                    <span className="todo-item-text">Team standup 10am</span>
                    <span className="todo-item-priority-badge todo-item-priority-badge--high">High</span>
                  </div>
                </li>
              </ul>
            </section>
            <aside className="landing-preview-right">
              <div className="chat-shell landing-preview-chat">
                <div className="chat-header">
                  <h2>TaskBot assistant</h2>
                  <p>Ask me about your tasks and schedule.</p>
                </div>
                <div className="chat-messages landing-preview-chat-messages">
                  <div className="chat-bubble chat-bubble--bot">
                    <div className="chat-bubble-content">Try: &quot;What do I have today?&quot; or &quot;When is my next task?&quot;</div>
                  </div>
                  <div className="chat-bubble chat-bubble--user">
                    <div className="chat-bubble-content">What do I have next week?</div>
                  </div>
                  <div className="chat-bubble chat-bubble--bot">
                    <div className="chat-bubble-content">
                      Here&apos;s your schedule for next week:
                      <br />• Mon — Morning workout, Review docs
                      <br />• Tue — Team standup
                    </div>
                  </div>
                </div>
                <div className="chat-input-row">
                  <input type="text" readOnly placeholder="e.g. 'What do I have today?'" />
                  <button type="button" disabled>Send</button>
                </div>
              </div>
              <div className="upload-shell landing-preview-upload">
                <h3>Upload schedule (CSV)</h3>
                <p className="upload-subtitle">Columns: text, date, startTime, endTime, priority</p>
                <label className="upload-input"><span>Choose CSV file</span><input type="file" disabled /></label>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="sign-in" className="landing-auth-section">
        <h2 className="landing-auth-heading">Create your account</h2>
        <p className="landing-auth-sub">Sign in with email or Google to start using TaskBot.</p>
        <div className="landing-auth">
          <AuthForm />
        </div>
      </section>

      <footer className="landing-footer">
        <span className="landing-footer-logo">TaskBot</span>
        <span className="landing-footer-tagline">Tasks, schedule & assistant</span>
      </footer>
    </div>
  );
}
