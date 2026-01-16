import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const productPricing = sqliteTable('product_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  productId: integer('product_id').notNull(), // 商品ID
  price: real('price').notNull(), // 价格（元）

  ruleApplicationType: text('rule_application_type'), // 收费规则应用类型
  applyTimeStart: text('apply_time_start'), // 应用时间起始

  status: integer('status').notNull().default(1), // 1 启用 / 0 停用
  description: text('description'),

  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
