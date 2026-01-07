import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import './schema'

export const sqlite = new Database("rbac.db")
export const db = drizzle(sqlite)

export function initDb() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS role (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS role_permission (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      path TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role_id INTEGER,
      status INTEGER NOT NULL DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );
  `);

  console.log("Database initialized successfully");
}