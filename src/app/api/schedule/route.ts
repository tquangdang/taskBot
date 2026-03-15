import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/firebase/admin";
import { getTodosForUser, replaceTodosForUser } from "@/lib/db/todos";
import type { TodoDoc } from "@/lib/db/types";

interface UploadEntry {
  text: string;
  date: string; // YYYY-MM-DD
  startTime?: string;
  endTime?: string;
  priority?: "low" | "medium" | "high";
}

export async function GET(req: NextRequest) {
  const userId = await verifyBearerToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await getTodosForUser(userId);
  const dated = todos.filter((t) => t.date);
  return NextResponse.json(dated);
}

export async function POST(req: NextRequest) {
  const userId = await verifyBearerToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as UploadEntry[];
  if (!Array.isArray(body)) {
    return NextResponse.json({ error: "Expected array" }, { status: 400 });
  }

  const now = Date.now();
  const base: Omit<TodoDoc, "_id" | "userId">[] = [];

  for (const row of body) {
    const text = row.text?.trim();
    const date = row.date?.trim();
    const startTime = row.startTime?.trim();
    const endTime = row.endTime?.trim();
    const priority = row.priority ?? "medium";

    if (!text || !date) continue;

    base.push({
      text,
      date,
      startTime,
      endTime,
      completed: false,
      priority,
      createdAt: now,
    });
  }

  // Merge with existing non-dated tasks, replace dated ones
  const existing = await getTodosForUser(userId);
  const undated = existing.filter((t) => !t.date);

  await replaceTodosForUser(
    userId,
    [...undated, ...base].map((t) => ({
      text: t.text,
      date: t.date,
      startTime: t.startTime,
      endTime: t.endTime,
      completed: t.completed,
      priority: t.priority,
      createdAt: t.createdAt,
      completedAt: t.completedAt,
    }))
  );

  return NextResponse.json({ ok: true, count: base.length });
}


