import * as SQLite from "expo-sqlite";
import { MedicationExplanation } from "./types";

export const DB_NAME = "bulafacil.db";

export async function initDb(db: SQLite.SQLiteDatabase) {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY NOT NULL,
      created_at INTEGER NOT NULL,
      medication_name TEXT NOT NULL,
      profile_name TEXT NOT NULL DEFAULT 'Eu',
      photo_uri TEXT,
      explanation_json TEXT NOT NULL
    );
  `);
}

export interface StoredScan {
  id: string;
  createdAt: number;
  medicationName: string;
  profileName: string;
  photoUri: string | null;
  explanation: MedicationExplanation;
}

export async function saveScan(
  db: SQLite.SQLiteDatabase,
  entry: { id: string; medicationName: string; profileName: string; photoUri: string | null; explanation: MedicationExplanation }
) {
  await db.runAsync(
    `INSERT INTO scans (id, created_at, medication_name, profile_name, photo_uri, explanation_json) VALUES (?, ?, ?, ?, ?, ?)`,
    entry.id,
    Date.now(),
    entry.medicationName,
    entry.profileName,
    entry.photoUri,
    JSON.stringify(entry.explanation)
  );
}

export async function listScans(db: SQLite.SQLiteDatabase, limit?: number): Promise<StoredScan[]> {
  const rows = await db.getAllAsync<any>(
    `SELECT * FROM scans ORDER BY created_at DESC ${limit ? "LIMIT ?" : ""}`,
    ...(limit ? [limit] : [])
  );
  return rows.map(rowToStoredScan);
}

export async function getScan(db: SQLite.SQLiteDatabase, id: string): Promise<StoredScan | null> {
  const row = await db.getFirstAsync<any>(`SELECT * FROM scans WHERE id = ?`, id);
  return row ? rowToStoredScan(row) : null;
}

export async function countScans(db: SQLite.SQLiteDatabase): Promise<number> {
  const row = await db.getFirstAsync<{ count: number }>(`SELECT COUNT(*) as count FROM scans`);
  return row?.count ?? 0;
}

export async function deleteOldestScansBeyond(db: SQLite.SQLiteDatabase, keep: number) {
  await db.runAsync(
    `DELETE FROM scans WHERE id NOT IN (SELECT id FROM scans ORDER BY created_at DESC LIMIT ?)`,
    keep
  );
}

export async function listProfileNames(db: SQLite.SQLiteDatabase): Promise<string[]> {
  const rows = await db.getAllAsync<{ profile_name: string }>(
    `SELECT DISTINCT profile_name FROM scans ORDER BY profile_name ASC`
  );
  const names = rows.map((r) => r.profile_name);
  return names.includes("Eu") ? names : ["Eu", ...names];
}

function rowToStoredScan(row: any): StoredScan {
  return {
    id: row.id,
    createdAt: row.created_at,
    medicationName: row.medication_name,
    profileName: row.profile_name,
    photoUri: row.photo_uri,
    explanation: JSON.parse(row.explanation_json),
  };
}
