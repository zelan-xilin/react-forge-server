import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/* ===========================
 * 订单主表
 * =========================== */
export const salesOrder = sqliteTable('sales_order', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  /** ORD + YYYYMMDD + 序列 */
  orderNo: text('order_no').notNull(),

  /** 订单状态 */
  orderStatus: text('order_status').notNull(),

  /** 开单 / 关单时间 */
  openedAt: integer('opened_at', { mode: 'timestamp' }),
  closedAt: integer('closed_at', { mode: 'timestamp' }),

  /** 理论应收 / 实际实收（元，1 位小数） */
  expectedAmount: real('expected_amount'),
  actualAmount: real('actual_amount'),

  /** 差异原因 */
  paymentDifferenceReason: text('payment_difference_reason'),

  /** 备注 */
  remark: text('remark'),

  /** 删除标记 */
  isDeleted: integer('is_deleted').notNull().default(0),
  deleteReason: text('delete_reason'),
  deletedBy: integer('deleted_by'),
  deletedByName: text('deleted_by_name'),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),

  /** 审计字段 */
  createdBy: integer('created_by').notNull(),
  createdByName: text('created_by_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),

  updatedBy: integer('updated_by'),
  updatedByName: text('updated_by_name'),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

/* ===========================
 * 订单预定信息
 * =========================== */
export const salesOrderReserved = sqliteTable('sales_order_reserved', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderNo: text('order_no').notNull(),

  username: text('username'),
  contact: text('contact'),
  arriveAt: text('arrive_at'),
});

/* ===========================
 * 订单区域绑定
 * =========================== */
export const salesOrderArea = sqliteTable('sales_order_area', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderNo: text('order_no').notNull(),

  areaId: integer('area_id').notNull(),
  areaName: text('area_name').notNull(),
  areaType: text('area_type').notNull(),
  roomSize: text('room_size'),

  price: real('price').notNull().default(0),
});

/* ===========================
 * 订单商品明细
 * =========================== */
export const salesOrderProduct = sqliteTable('sales_order_product', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderNo: text('order_no').notNull(),

  productId: integer('product_id').notNull(),
  productName: text('product_name').notNull(),

  quantity: integer('quantity').notNull(),

  /** 单价 / 小计（元，1 位小数） */
  unitPrice: real('unit_price').notNull(),
  totalPrice: real('total_price').notNull(),
});

/* ===========================
 * 订单支付记录（支持组合支付）
 * =========================== */
export const salesOrderPayment = sqliteTable('sales_order_payment', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  orderNo: text('order_no').notNull(),

  /** 支付方式 */
  paymentMethod: text('payment_method').notNull(),
  paymentMethodName: text('payment_method_name').notNull(),

  /** 支付金额（元，1 位小数） */
  paymentAmount: real('payment_amount').notNull(),

  paidAt: integer('paid_at', { mode: 'timestamp' }),
});
