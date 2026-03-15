import { getDb } from "./mongo";
import type { TodoDoc } from "./types";

const COLLECTION = "todos";

export async function getTodosForUser(userId: string): Promise<TodoDoc[]> {
  const db = await getDb();
  return db.collection<TodoDoc>(COLLECTION).find({ userId }).toArray();
}

/** Pass documents with optional _id so Mongo preserves ids and client stays in sync. */
export async function replaceTodosForUser(
  userId: string,
  todos: (Omit<TodoDoc, "userId">)[]
): Promise<void> {
  const db = await getDb();
  const col = db.collection<TodoDoc>(COLLECTION);

  await col.deleteMany({ userId });
  if (!todos.length) return;

  await col.insertMany(todos.map((t) => ({ ...t, userId })));
}

