import { NextRequest, NextResponse } from "next/server";
import { verifyBearerToken } from "@/lib/firebase/admin";
import { getTodosForUser, replaceTodosForUser } from "@/lib/db/todos";
import type { TodoDoc } from "@/lib/db/types";

type Action =
  | "init"
  | "add"
  | "toggle"
  | "delete"
  | "update"
  | "clearCompleted";

interface TodoActionPayload {
  action: Action;
  todo?: {
    id?: string;
    text?: string;
    priority?: "low" | "medium" | "high";
    date?: string;
    startTime?: string;
    endTime?: string;
  };
  id?: string;
}

export async function GET(req: NextRequest) {
  const userId = await verifyBearerToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await getTodosForUser(userId);
  return NextResponse.json(todos);
}

export async function POST(req: NextRequest) {
  const userId = await verifyBearerToken(req.headers.get("authorization"));
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as TodoActionPayload;
  const { action } = body;

  if (!action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  const current = await getTodosForUser(userId);

  let next: TodoDoc[] = current;

  if (action === "add") {
    const text = body.todo?.text?.trim();
    const priority = body.todo?.priority ?? "medium";
    const { date, startTime, endTime } = body.todo ?? {};
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    const now = Date.now();
    next = [
      ...current,
      {
        userId,
        text,
        date,
        startTime,
        endTime,
        priority,
        completed: false,
        createdAt: now,
      },
    ];
  } else if (action === "toggle") {
    const id = body.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    next = current.map((t) =>
      t._id?.toString() === id
        ? {
            ...t,
            completed: !t.completed,
            completedAt: !t.completed ? Date.now() : undefined,
          }
        : t
    );
  } else if (action === "delete") {
    const id = body.id;
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    next = current.filter((t) => t._id?.toString() !== id);
  } else if (action === "update") {
    const id = body.id;
    const { text, priority, date, startTime, endTime } = body.todo ?? {};
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    next = current.map((t) =>
      t._id?.toString() === id
        ? {
            ...t,
            text: text?.trim() ?? t.text,
            priority: priority ?? t.priority,
            date: date ?? t.date,
            startTime: startTime ?? t.startTime,
            endTime: endTime ?? t.endTime,
          }
        : t
    );
  } else if (action === "clearCompleted") {
    next = current.filter((t) => !t.completed);
  } else if (action === "init") {
    // simply return current
    return NextResponse.json(current);
  }

  await replaceTodosForUser(
    userId,
    next.map((t) => ({
      ...(t._id != null && { _id: t._id }),
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

  const saved = await getTodosForUser(userId);
  return NextResponse.json(saved);
}

