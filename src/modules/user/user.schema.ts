import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const user = sqliteTable("user", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  roleId: integer("role_id"),
  status: integer("status").notNull().default(1),
  phone: text("phone"),
  description: text("description"),
  createdBy: integer("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer("updated_by"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
  isAdmin: integer("is_admin").default(0),
});
