import { getDb } from "./mongo";
import type { DayOfWeek, Schedule, ScheduleEntry } from "./types";

const COLLECTION = "schedules";

export async function getAllScheduleForUser(userId: string): Promise<Schedule> {
  const db = await getDb();
  return db.collection<ScheduleEntry>(COLLECTION).find({ userId }).toArray();
}

export async function getScheduleByDayForUser(
  userId: string,
  dayOfWeek: DayOfWeek
): Promise<Schedule> {
  const db = await getDb();
  return db
    .collection<ScheduleEntry>(COLLECTION)
    .find({ userId, dayOfWeek })
    .toArray();
}

export async function upsertScheduleForUser(
  userId: string,
  entries: Omit<ScheduleEntry, "userId" | "_id">[]
): Promise<void> {
  const db = await getDb();
  const col = db.collection<ScheduleEntry>(COLLECTION);

  await col.deleteMany({ userId });

  if (!entries.length) return;

  await col.insertMany(entries.map((e) => ({ ...e, userId })));
}

