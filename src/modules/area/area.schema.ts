import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const areaPricingRule = sqliteTable('area_pricing_rule', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  areaType: text('area_type').notNull(), // 'private_room' | 'hall_seat' | 'balcony'
  roomSize: text('room_size'), // 'large' | 'medium' | 'small' | null
  timeType: text('time_type').notNull(), // 'day' | 'night'
  startTimeFrom: text('start_time_from').notNull(), // 判断开始计费时间，如 '18:00'
  baseDurationMinutes: integer('base_duration_minutes').notNull(),
  basePrice: real('base_price').notNull(),
  overtimePricePerHour: real('overtime_price_per_hour').notNull(),
  overtimeRounding: text('overtime_rounding').notNull(), // 'ceil' | 'exact'
  overtimeGraceMinutes: integer('overtime_grace_minutes').notNull().default(0),
  giftTeaAmount: real('gift_tea_amount').notNull().default(0),
  status: integer('status').notNull().default(1), // 1 启用 / 0 停用
  description: text('description'),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const areaResource = sqliteTable('area_resource', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(), // 包间001 / A-03
  areaType: text('area_type').notNull(), // 'private_room' | 'hall_seat' | 'balcony'
  roomSize: text('room_size'), // 'large' | 'medium' | 'small' | null
  capacity: integer('capacity'),
  status: integer('status').notNull().default(1), // 1 启用 / 0 停用
  description: text('description'),
  createdBy: integer('created_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedBy: integer('updated_by'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});
