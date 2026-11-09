import { promises as fs } from "fs";
import path from "path";
import type { Database } from "./types";
import { getSupabase } from "./supabase";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");
const ROW_ID = "main";
const TABLE = "site_data";

let writeQueue: Promise<unknown> = Promise.resolve();

async function readLocal(): Promise<Database> {
  const raw = await fs.readFile(DB_PATH, "utf8");
  return JSON.parse(raw) as Database;
}

async function writeLocal(db: Database): Promise<void> {
  const payload = JSON.stringify(db, null, 2);
  writeQueue = writeQueue.then(() => fs.writeFile(DB_PATH, payload, "utf8"));
  await writeQueue;
}

export async function getDb(): Promise<Database> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("data")
      .eq("id", ROW_ID)
      .maybeSingle();
    if (error) throw error;
    if (data?.data) return data.data as Database;
    // Seed from local file on first run.
    const seed = await readLocal().catch(() => null);
    if (seed) {
      await supabase.from(TABLE).upsert({ id: ROW_ID, data: seed });
      return seed;
    }
    throw new Error("No site data available");
  }
  return readLocal();
}

export async function saveDb(db: Database): Promise<Database> {
  const supabase = getSupabase();
  if (supabase) {
    const { error } = await supabase
      .from(TABLE)
      .upsert({ id: ROW_ID, data: db, updated_at: new Date().toISOString() });
    if (error) throw error;
    return db;
  }
  await writeLocal(db);
  return db;
}

export async function updateDb(
  updater: (db: Database) => Database | Promise<Database>,
): Promise<Database> {
  const db = await getDb();
  const next = await updater(db);
  return saveDb(next);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}
