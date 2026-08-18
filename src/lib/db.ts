import fs from "fs/promises";
import path from "path";

// In Next.js App Router, process.cwd() is the root of the application (where package.json is)
const dbPath = path.join(process.cwd(), "src/data/db.json");

export type DbData = {
  users: Array<Record<string, unknown>>;
  venues: Array<Record<string, unknown>>;
  bookings: Array<Record<string, unknown>>;
  customers: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export async function getDbData(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbPath, "utf-8");
    return JSON.parse(data) as DbData;
  } catch (error) {
    console.error("Error reading DB:", error);
    return { users: [], venues: [], bookings: [], customers: [] };
  }
}

export async function saveDbData(data: DbData): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing DB:", error);
  }
}
