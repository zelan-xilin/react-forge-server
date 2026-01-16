import { sql } from 'drizzle-orm';
import {
  integer,
  real,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core';

export const recipe = sqliteTable('recipe', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  status: integer('status').notNull().default(1),
  description: text('description'),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const recipeItem = sqliteTable('recipe_item', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  recipeId: integer('recipe_id').notNull(),
  materialId: integer('material_id').notNull(),
  amount: real('amount').notNull(),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const recipeItemRecipeMaterialUnique = uniqueIndex(
  'recipe_item_recipe_id_material_id_unique',
).on(recipeItem.recipeId, recipeItem.materialId);
