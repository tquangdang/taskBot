"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import { authedFetch } from "@/lib/api/client";
import type { ChatMessage } from "@/lib/chat/types";

function createMessage(
  role: "user" | "bot",
  content: string
): ChatMessage {
  return {
    id: Math.random().toString(36).slice(2, 11),
    role,
    content,
    createdAt: Date.now(),
  };
}

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage(
      "bot",
      "Hi! I’m your TaskBot assistant. Ask me about your tasks—e.g. “What do I have today?” or “What’s on my schedule this week?”"
    ),
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages.length]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMsg = createMessage("user", question);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await authedFetch("/api/chat/schedule", {
        method: "POST",
        body: JSON.stringify({ question }),
      });
      const json = await res.json();
      const answer =
        json?.answer ??
        json?.error ??
        "Sorry, something went wrong while fetching your schedule.";

      const botMsg = createMessage("bot", answer);
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg = createMessage(
        "bot",
        "Sorry, I couldn't reach the server. Please try again."
      );
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="chat-shell">
      <div className="chat-header">
        <h2>TaskBot assistant</h2>
        <p>Ask me about your tasks and schedule.</p>
      </div>

      <div className="chat-messages" ref={listRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`chat-bubble chat-bubble--${m.role}`}
          >
            <div className="chat-bubble-content">{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder='e.g. "What do I have today?"'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

