import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const areaPricing = sqliteTable('area_pricing', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  areaType: text('area_type').notNull(), // 区域类型（大厅 / 包间）
  roomSize: text('room_size'), // 包间大小

  applyTimeStart: text('apply_time_start').notNull(), // 应用时间起始（如 HH:mm）
  applyTimeEnd: text('apply_time_end').notNull(), // 应用时间结束（如 HH:mm）

  usageDurationHours: real('usage_duration_hours').notNull(), // 使用时长（小时）
  basePrice: real('base_price').notNull(), // 起步价格（元）

  overtimeHourPrice: real('overtime_hour_price').notNull(), // 超时每小时价格（元）
  overtimeRoundType: text('overtime_round_type').notNull(), // 超时取整方式
  overtimeGraceMinutes: integer('overtime_grace_minutes').default(0), // 超时宽限分钟

  giftTeaAmount: real('gift_tea_amount').default(0), // 赠送茶水金额（元）

  status: integer('status').notNull().default(1), // 1 启用 / 0 停用
  description: text('description'),

  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
