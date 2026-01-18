import { and, eq, inArray, sql } from 'drizzle-orm';
import { db } from '../../db';
import {
  salesOrder,
  salesOrderArea,
  salesOrderPayment,
  salesOrderProduct,
  salesOrderReserved,
} from './order.schema';
import type {
  AddOrderAreaDTO,
  AddOrderPaymentDTO,
  AddOrderProductDTO,
  AddOrderReservedDTO,
  CreateOrderDTO,
  DeleteOrderDTO,
  OrderDTO,
  OrderPageParams,
  UpdateOrderDTO,
  UpdateOrderPaymentDTO,
  UpdateOrderProductDTO,
} from './types';

function getTodayPrefix() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}
async function generateOrderNo() {
  const datePrefix = getTodayPrefix();
  const prefix = `ORD${datePrefix}`;

  const result = db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(salesOrder)
    .where(sql`${salesOrder.orderNo} like ${`${prefix}%`}`)
    .get();

  const seq = (result?.count ?? 0) + 1;

  return `${prefix}${String(seq).padStart(4, '0')}`;
}

export const OrderService = {
  /** 创建订单 */
  async createOrder(dto: CreateOrderDTO) {
    const orderNo = await generateOrderNo();

    const result = await db
      .insert(salesOrder)
      .values({
        ...dto,
        orderNo,
        openedAt: dto.openedAt ? new Date(dto.openedAt) : undefined,
        closedAt: undefined,
      })
      .returning();

    return result[0];
  },
  async addOrderProduct(dto: AddOrderProductDTO) {
    await db.insert(salesOrderProduct).values({
      ...dto,
      totalPrice: dto.quantity * dto.unitPrice,
    });
  },
  async addOrderPayment(dto: AddOrderPaymentDTO) {
    await db.insert(salesOrderPayment).values({
      ...dto,
      paidAt: new Date(),
    });
  },

  /** 预定人绑定 */
  async setOrderReserved(dto: AddOrderReservedDTO) {
    const exists = db
      .select({ id: salesOrderReserved.id })
      .from(salesOrderReserved)
      .where(eq(salesOrderReserved.orderNo, dto.orderNo))
      .get();

    if (exists) {
      await db
        .update(salesOrderReserved)
        .set(dto)
        .where(eq(salesOrderReserved.orderNo, dto.orderNo));
    } else {
      await db.insert(salesOrderReserved).values(dto);
    }
  },

  /** 区域绑定 */
  async setOrderArea(dto: AddOrderAreaDTO) {
    const exists = db
      .select({ id: salesOrderArea.id })
      .from(salesOrderArea)
      .where(eq(salesOrderArea.orderNo, dto.orderNo))
      .get();

    if (exists) {
      await db
        .update(salesOrderArea)
        .set(dto)
        .where(eq(salesOrderArea.orderNo, dto.orderNo));
    } else {
      await db.insert(salesOrderArea).values(dto);
    }
  },

  /** 逻辑删除订单（子表不动） */
  async deleteOrder(dto: DeleteOrderDTO) {
    await db
      .update(salesOrder)
      .set({
        isDeleted: 1,
        deleteReason: dto.deleteReason,
        deletedBy: dto.deletedBy,
        deletedByName: dto.deletedByName,
        deletedAt: sql`unixepoch()`,
      })
      .where(eq(salesOrder.orderNo, dto.orderNo));
  },
  async deleteById(
    table:
      | typeof salesOrderArea
      | typeof salesOrderProduct
      | typeof salesOrderReserved
      | typeof salesOrderPayment,
    ids: number[],
  ) {
    await db.delete(table).where(inArray(table.id, ids));
  },

  /** 数据更新 */
  async updateOrder(dto: UpdateOrderDTO) {
    const { orderNo, ...patch } = dto;

    await db
      .update(salesOrder)
      .set({
        ...patch,
        updatedAt: sql`unixepoch()`,
        openedAt: patch.openedAt ? new Date(patch.openedAt) : undefined,
        closedAt: patch.closedAt ? new Date(patch.closedAt) : undefined,
      })
      .where(eq(salesOrder.orderNo, orderNo));
  },
  async updateOrderProduct(dto: UpdateOrderProductDTO) {
    const { id, quantity, unitPrice, ...rest } = dto;

    const updateData: Partial<UpdateOrderProductDTO> & {
      totalPrice?: number;
      updatedAt: number;
    } = { ...rest, updatedAt: Date.now() };

    if (quantity !== undefined || unitPrice !== undefined) {
      const product = db
        .select()
        .from(salesOrderProduct)
        .where(eq(salesOrderProduct.id, id))
        .get();

      if (!product) {
        return;
      }

      const q = quantity ?? product.quantity;
      const p = unitPrice ?? product.unitPrice;

      updateData.quantity = q;
      updateData.unitPrice = p;
      updateData.totalPrice = q * p;
    }

    await db
      .update(salesOrderProduct)
      .set(updateData)
      .where(eq(salesOrderProduct.id, id));
  },
  async updateOrderPayment(dto: UpdateOrderPaymentDTO) {
    const { id, ...patch } = dto;
    await db
      .update(salesOrderPayment)
      .set({
        ...patch,
      })
      .where(eq(salesOrderPayment.id, id));
  },

  async queryOrders(params: OrderPageParams) {
    const where = [];
    where.push(eq(salesOrder.isDeleted, 0));

    if (params.orderNo !== undefined) {
      where.push(eq(salesOrder.orderNo, params.orderNo));
    }
    if (params.orderStatus?.length) {
      where.push(inArray(salesOrder.orderStatus, params.orderStatus));
    }
    if (params.openedAtFrom !== undefined) {
      where.push(
        sql`${salesOrder.openedAt} >= ${Date.parse(params.openedAtFrom) / 1000}`,
      );
    }
    if (params.openedAtTo !== undefined) {
      where.push(
        sql`${salesOrder.openedAt} <= ${Date.parse(params.openedAtTo) / 1000}`,
      );
    }

    // ---------- 区域条件 ----------
    if (
      params.areaName ||
      params.areaType ||
      params.roomSize ||
      params.unboundArea !== undefined
    ) {
      where.push(
        sql`exists (
      select 1 from ${salesOrderArea}
      where ${salesOrderArea.orderNo} = ${salesOrder.orderNo}
      ${
        params.areaName
          ? sql`and ${salesOrderArea.areaName} like ${'%' + params.areaName + '%'}`
          : sql``
      }
      ${
        params.areaType
          ? sql`and ${salesOrderArea.areaType} = ${params.areaType}`
          : sql``
      }
      ${
        params.roomSize
          ? sql`and ${salesOrderArea.roomSize} = ${params.roomSize}`
          : sql``
      }
    )`,
      );

      if (params.unboundArea === true) {
        where.push(
          sql`not exists (
        select 1 from ${salesOrderArea}
        where ${salesOrderArea.orderNo} = ${salesOrder.orderNo}
      )`,
        );
      }
    }

    // ---------- 预定人条件 ----------
    if (params.reservedUsername || params.reservedContact) {
      where.push(
        sql`exists (
      select 1 from ${salesOrderReserved}
      where ${salesOrderReserved.orderNo} = ${salesOrder.orderNo}
      ${
        params.reservedUsername
          ? sql`and ${salesOrderReserved.username} like ${'%' + params.reservedUsername + '%'}`
          : sql``
      }
      ${
        params.reservedContact
          ? sql`and ${salesOrderReserved.contact} like ${'%' + params.reservedContact + '%'}`
          : sql``
      }
    )`,
      );
    }

    // 计算总数
    const totalResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(salesOrder)
      .where(and(...where))
      .get();
    const total = Number(totalResult?.count ?? 0);

    // ---------- 查询订单（分页） ----------
    const orders = await db
      .select()
      .from(salesOrder)
      .where(and(...where))
      .limit(params.pageSize)
      .offset((params.page - 1) * params.pageSize);

    if (!orders.length) {
      return {
        total,
        records: [],
      };
    }

    const orderNos = orders.map(o => o.orderNo);

    const [areas, reserved, products, payments] = await Promise.all([
      db
        .select()
        .from(salesOrderArea)
        .where(inArray(salesOrderArea.orderNo, orderNos)),
      db
        .select()
        .from(salesOrderReserved)
        .where(inArray(salesOrderReserved.orderNo, orderNos)),
      db
        .select()
        .from(salesOrderProduct)
        .where(inArray(salesOrderProduct.orderNo, orderNos)),
      db
        .select()
        .from(salesOrderPayment)
        .where(inArray(salesOrderPayment.orderNo, orderNos)),
    ]);

    const records = orders.map(order => ({
      ...order,
      area: areas.find(a => a.orderNo === order.orderNo) ?? null,
      reserved: reserved.find(r => r.orderNo === order.orderNo) ?? null,
      products: products.filter(p => p.orderNo === order.orderNo),
      payments: payments.filter(p => p.orderNo === order.orderNo),
    })) as unknown as OrderDTO[];

    return {
      total,
      records,
    };
  },
};
