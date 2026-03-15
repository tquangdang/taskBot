import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTodosForUser } from "@/lib/db/todos";
import type { TodoDoc } from "@/lib/db/types";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTodoContext(todos: TodoDoc[]): string {
  if (!todos.length) return "The user has no tasks yet.";
  const withDate = todos.filter((t) => t.date);
  if (!withDate.length) return "The user has tasks but none are scheduled with a date.";
  const byDate: Record<string, TodoDoc[]> = {};
  for (const t of withDate) {
    byDate[t.date!] ??= [];
    byDate[t.date!].push(t);
  }
  const lines: string[] = [];
  for (const date of Object.keys(byDate).sort()) {
    const list = byDate[date];
    const d = new Date(date);
    const dayName = DAY_NAMES[d.getDay()] ?? date;
    for (const t of list) {
      const time = [t.startTime, t.endTime].filter(Boolean).join("–") || "no time";
      const status = t.completed ? " (completed)" : "";
      lines.push(`- ${date} (${dayName}) ${time}: ${t.text}${status}`);
    }
  }
  return lines.length ? lines.join("\n") : "No scheduled tasks.";
}

/**
 * Ask Gemini for a response using the user's tasks as context.
 * Returns null if GEMINI_API_KEY is not set or the request fails.
 */
export async function askGemini(
  question: string,
  userId: string
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey?.trim()) return null;

  const todos = await getTodosForUser(userId);
  const context = formatTodoContext(todos);

  const systemPrompt = `You are a helpful assistant for a task and schedule app called TaskBot. The user can ask about their tasks, what they have on a certain day, today, tomorrow, or their week. Use ONLY the following context about the user's tasks. If the context says they have no tasks or no scheduled tasks, say so in a friendly way. Keep answers concise and natural.

Format your reply so it is easy to read: use line breaks between days, and use bullet points (•) for each task with the time and title (e.g. "• 09:00–10:00 — Math homework"). Do not output one long run-on paragraph.

User's tasks (date, day, time, title, completed):
${context}`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });
    const result = await model.generateContent(question.trim());
    const response = result.response;
    const text = response.text();
    return text?.trim() ?? null;
  } catch {
    return null;
  }
}
