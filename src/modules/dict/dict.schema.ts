import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const dict = sqliteTable("dict", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  label: text("label").notNull(),
  value: text("value").notNull(),
  parentId: integer("parent_id"),
  sort: integer("sort").default(99),
  status: integer("status").notNull().default(1),
  description: text("description"),
  createdBy: integer("created_by"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer("updated_by"),
  updatedAt: integer("updated_at", { mode: "timestamp" }),
});
