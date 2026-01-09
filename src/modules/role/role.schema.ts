import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const role = sqliteTable("role", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdBy: integer("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer("updated_by"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});

export const rolePathPermission = sqliteTable("role_path_permission", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roleId: integer("role_id").notNull(),
  path: text("path").notNull(),
});

export const roleActionPermission = sqliteTable("role_action_permission", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  roleId: integer("role_id").notNull(),
  module: text("module").notNull(),
  action: text("action").notNull(),
});
