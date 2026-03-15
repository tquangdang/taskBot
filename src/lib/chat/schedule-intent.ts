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
] as const;

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^\w\s]/g, " ");
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  const dayName = DAY_NAMES[d.getDay()];
  return `${dayName} ${dateStr}`;
}

function isSameDate(a: string, b: string): boolean {
  return a === b;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatTodos(entries: TodoDoc[]): string {
  if (!entries.length) return "You don't have any tasks scheduled.";

  const byDate: Record<string, TodoDoc[]> = {};
  for (const t of entries) {
    if (!t.date) continue;
    byDate[t.date] ??= [];
    byDate[t.date].push(t);
  }

  const dates = Object.keys(byDate).sort();
  const blocks: string[] = [];

  for (const date of dates) {
    const list = byDate[date];
    const dayHeader = formatDateLabel(date);
    const taskLines = list.map((t) => {
      const timePart =
        t.startTime && t.endTime
          ? `${t.startTime}–${t.endTime}`
          : t.startTime || t.endTime || "";
      return `• ${timePart ? `${timePart} — ` : ""}${t.text}`;
    });
    blocks.push(`${dayHeader}\n${taskLines.join("\n")}`);
  }

  return blocks.join("\n\n");
}

export async function answerScheduleQuestion(
  question: string,
  userId: string
): Promise<string> {
  const q = normalize(question);
  const todos = await getTodosForUser(userId);
  const dated = todos.filter((t) => t.date);

  if (!dated.length) {
    return "I don't see any dated tasks yet. Try creating tasks with a date and time, or upload them via CSV.";
  }

  // Explicit weekday: "monday", "tuesday", etc.
  const explicitDay = DAY_NAMES.find((d) => q.includes(d.toLowerCase()));
  if (explicitDay) {
    const matches = dated.filter((t) => {
      if (!t.date) return false;
      const d = new Date(t.date);
      if (Number.isNaN(d.getTime())) return false;
      return DAY_NAMES[d.getDay()] === explicitDay;
    });
    if (!matches.length) {
      return `You don't have any tasks on ${explicitDay}.`;
    }
    return formatTodos(matches);
  }

  // "today"
  if (q.includes("today")) {
    const todayStr = toIsoDate(new Date());
    const matches = dated.filter((t) => t.date && isSameDate(t.date, todayStr));
    if (!matches.length) {
      return "You don't have any tasks today.";
    }
    return `Here’s your schedule for today (${formatDateLabel(todayStr)}):\n\n${formatTodos(
      matches
    )}`;
  }

  // "tomorrow"
  if (q.includes("tomorrow")) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = toIsoDate(tomorrow);
    const matches = dated.filter(
      (t) => t.date && isSameDate(t.date, tomorrowStr)
    );
    if (!matches.length) {
      return "You don't have any tasks tomorrow.";
    }
    return `Here’s your schedule for tomorrow (${formatDateLabel(
      tomorrowStr
    )}):\n\n${formatTodos(matches)}`;
  }

  // "week" / "schedule" / "all"
  if (q.includes("week") || q.includes("schedule") || q.includes("all")) {
    return `Here’s your scheduled task list:\n\n${formatTodos(dated)}`;
  }

  return "I can answer questions like 'What do I have today?', 'What do I have tomorrow?', 'What do I have on Monday?' or 'Show me my schedule for the week.'";
}


