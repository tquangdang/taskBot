import type { Schedule, ScheduleEntry } from "./types";

/**
 * Class schedule – database (in-memory).
 * Replace this with a real DB (e.g. SQLite, Postgres) when needed.
 */
const schedule: Schedule = [
  {
    id: "1",
    courseName: "Mathematics",
    dayOfWeek: "Monday",
    startTime: "08:00",
    endTime: "09:30",
    room: "Room 101",
    instructor: "Mr. Smith",
  },
  {
    id: "2",
    courseName: "English",
    dayOfWeek: "Monday",
    startTime: "10:00",
    endTime: "11:00",
    room: "Room 205",
    instructor: "Ms. Johnson",
  },
  {
    id: "3",
    courseName: "Physics",
    dayOfWeek: "Tuesday",
    startTime: "09:00",
    endTime: "10:30",
    room: "Lab 1",
    instructor: "Dr. Williams",
  },
  {
    id: "4",
    courseName: "History",
    dayOfWeek: "Wednesday",
    startTime: "08:00",
    endTime: "09:00",
    room: "Room 102",
    instructor: "Mr. Brown",
  },
  {
    id: "5",
    courseName: "Computer Science",
    dayOfWeek: "Thursday",
    startTime: "14:00",
    endTime: "15:30",
    room: "Lab 2",
    instructor: "Ms. Davis",
  },
  {
    id: "6",
    courseName: "Physical Education",
    dayOfWeek: "Friday",
    startTime: "11:00",
    endTime: "12:00",
    room: "Gym",
  },
];

export function getAllSchedule(): Schedule {
  return [...schedule];
}

export function getScheduleByDay(dayOfWeek: ScheduleEntry["dayOfWeek"]): Schedule {
  return schedule.filter((entry) => entry.dayOfWeek === dayOfWeek);
}

export function getScheduleEntry(id: string): ScheduleEntry | undefined {
  return schedule.find((entry) => entry.id === id);
}

export { schedule };
