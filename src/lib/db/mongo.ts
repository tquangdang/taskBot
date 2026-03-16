import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME;

if (!uri) {
  throw new Error("MONGODB_URI is not set");
}

if (!dbName) {
  throw new Error("MONGODB_DB_NAME is not set");
}

let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (!client) {
    client = new MongoClient(uri as string);
    await client.connect();
  }

  db = client.db(dbName as string);
  return db;
}

