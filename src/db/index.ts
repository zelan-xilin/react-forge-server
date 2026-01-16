import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import './schema';

export const sqlite = new Database('rbac.db');
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

    CREATE TABLE IF NOT EXISTS dict (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      value TEXT NOT NULL,
      parent_id INTEGER,
      sort INTEGER DEFAULT 99,
      status INTEGER NOT NULL DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS area (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      area_type TEXT NOT NULL,
      room_size TEXT,
      status INTEGER DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS material (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      recipe_unit TEXT NOT NULL,
      status INTEGER DEFAULT 1,
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS recipe (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      status INTEGER DEFAULT 1,        -- 1 启用 / 0 停用
      description TEXT,
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS recipe_item (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_id INTEGER NOT NULL,
      material_id INTEGER NOT NULL,
      amount REAL NOT NULL, 
      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER,

      UNIQUE (recipe_id, material_id)
    );

    CREATE TABLE IF NOT EXISTS area_pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      area_type TEXT NOT NULL,                  -- 区域类型（如：大厅 / 包间）
      room_size TEXT,                        -- 包间大小
      
      rule_application_type TEXT NOT NULL,      -- 收费规则应用类型
      apply_time_start TEXT NOT NULL,                 -- 应用时间起始
      
      usage_duration_hours REAL NOT NULL,             -- 使用时长（小时，起步时长）
      base_price REAL NOT NULL,              -- 起步价格（元）
      
      overtime_hour_price REAL NOT NULL,              -- 超时每小时价格（元）
      overtime_round_type TEXT NOT NULL,     -- 超时取整方式
      overtime_grace_minutes INTEGER DEFAULT 0,  -- 超时宽限分钟
      
      gift_tea_amount REAL DEFAULT 0,         -- 赠送茶水金额（元）

      status INTEGER DEFAULT 1,                  -- 1 启用 / 0 停用
      description TEXT,

      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS product_pricing (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      product_id INTEGER NOT NULL,               -- 商品ID
      price REAL NOT NULL,                     -- 价格（元）
      
      rule_application_type TEXT,      -- 收费规则应用类型
      apply_time_start TEXT,                 -- 应用时间起始

      status INTEGER DEFAULT 1,                   -- 1 启用 / 0 停用
      description TEXT,

      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );
  `);

  console.log('Database initialized successfully');
}
