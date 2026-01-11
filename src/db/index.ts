import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import "./schema";

export const sqlite = new Database("rbac.db");
export const db = drizzle(sqlite);

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

    CREATE TABLE IF NOT EXISTS role_path_permission (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      path TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS role_action_permission (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_id INTEGER NOT NULL,
      module TEXT NOT NULL,
      action TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role_id INTEGER,
      phone TEXT,
      status INTEGER NOT NULL DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER,
      is_admin INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS area_pricing_rule (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      area_type TEXT NOT NULL,
      room_size TEXT,
      time_type TEXT NOT NULL,
      start_time_from TEXT NOT NULL,
      base_duration_minutes INTEGER NOT NULL,
      base_price REAL NOT NULL,
      overtime_price_per_hour REAL NOT NULL,
      overtime_rounding TEXT NOT NULL,
      overtime_grace_minutes INTEGER DEFAULT 0,
      gift_tea_amount REAL DEFAULT 0,
      status INTEGER DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS area_resource (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      area_type TEXT NOT NULL,
      room_size TEXT,
      capacity INTEGER,
      status INTEGER DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );
  `);

  console.log("Database initialized successfully");
}
