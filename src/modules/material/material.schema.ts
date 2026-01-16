import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const material = sqliteTable('material', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  recipeUnit: text('recipe_unit').notNull(),
  status: integer('status').notNull().default(1),
  description: text('description'),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
