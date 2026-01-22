import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import './schema';

export const sqlite = new Database(process.env.RBAC_DB_PATH || 'rbac.db');
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
      
      apply_time_start TEXT NOT NULL,                 -- 应用时间起始
      apply_time_end TEXT NOT NULL,                 -- 应用时间结束
      
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

      status INTEGER DEFAULT 1,                   -- 1 启用 / 0 停用
      description TEXT,

      created_by INTEGER,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sales_order (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL UNIQUE, -- ORD + YYYYMMDD + 序列

      order_status TEXT NOT NULL,
      opened_at INTEGER,
      closed_at INTEGER,

      expected_amount REAL, -- 理论金额（元，1 位小数）
      actual_amount REAL, -- 实际金额（元，1 位小数）
      payment_difference_reason TEXT, -- 付款差异原因

      remark TEXT,

      -- 0 正常 / 1 已删除
      is_deleted INTEGER NOT NULL DEFAULT 0,
      delete_reason TEXT,
      deleted_by INTEGER,
      deleted_by_name TEXT,
      deleted_at INTEGER,

      created_by INTEGER NOT NULL,
      created_by_name TEXT NOT NULL,
      created_at INTEGER NOT NULL DEFAULT (unixepoch()),
      updated_by INTEGER,
      updated_by_name TEXT,
      updated_at INTEGER
    );

    CREATE TABLE IF NOT EXISTS sales_order_reserved (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL UNIQUE,

      -- 预定人信息
      username TEXT,
      contact TEXT,
      arrive_at TEXT,

      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sales_order_area (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL UNIQUE,

      -- 区域快照
      area_id INTEGER NOT NULL,
      area_name TEXT NOT NULL,
      area_type TEXT NOT NULL,
      room_size TEXT,

      price REAL NOT NULL DEFAULT 0, -- 价格（元，1 位小数）

      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sales_order_product (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL,

      -- 商品快照
      product_id INTEGER NOT NULL,
      product_name TEXT NOT NULL,

      -- 数量与金额（元，1 位小数）
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      total_price REAL NOT NULL,

      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE TABLE IF NOT EXISTS sales_order_payment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_no TEXT NOT NULL,

      -- 支付方式
      payment_method TEXT NOT NULL,
      payment_method_name TEXT NOT NULL,

      -- 支付信息（元，1 位小数）
      payment_amount REAL NOT NULL,
      paid_at INTEGER,

      created_at INTEGER NOT NULL DEFAULT (unixepoch())
    );

    CREATE INDEX IF NOT EXISTS idx_sales_order_order_no
      ON sales_order(order_no);
    CREATE INDEX IF NOT EXISTS idx_sales_order_status
      ON sales_order(order_status);
    CREATE INDEX IF NOT EXISTS idx_sales_order_opened_at
      ON sales_order(opened_at);
    CREATE INDEX IF NOT EXISTS idx_sales_order_product_order_no
      ON sales_order_product(order_no);
    CREATE INDEX IF NOT EXISTS idx_sales_order_payment_order_no
      ON sales_order_payment(order_no);
    CREATE INDEX IF NOT EXISTS idx_sales_order_area_order_no
      ON sales_order_area(order_no);
    CREATE INDEX IF NOT EXISTS idx_role_path_permission_role_id
      ON role_path_permission(role_id);
    CREATE INDEX IF NOT EXISTS idx_role_action_permission_role_id
      ON role_action_permission(role_id);
    CREATE INDEX IF NOT EXISTS idx_recipe_item_recipe_id
      ON recipe_item(recipe_id);
    CREATE INDEX IF NOT EXISTS idx_recipe_item_material_id
      ON recipe_item(material_id);
  `);

  console.log('Database initialized successfully');
}
