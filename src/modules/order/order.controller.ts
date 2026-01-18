import { Request, Response } from 'express';
import { z } from 'zod';
import {
  salesOrderArea,
  salesOrderPayment,
  salesOrderProduct,
  salesOrderReserved,
} from './order.schema';
import { OrderService } from './order.service';
import { ORDER_STATUS } from './types';

type OrderItemType = 'area' | 'product' | 'payment' | 'reserved';
const deleteTableMap = {
  area: salesOrderArea,
  product: salesOrderProduct,
  payment: salesOrderPayment,
  reserved: salesOrderReserved,
} as const;

const CreateOrderDTO = z.object({
  orderStatus: z.string(),
  openedAt: z.string().nullable().optional(),
  remark: z.string().nullable().optional(),
  createdBy: z.number(),
  createdByName: z.string(),
});
const AddOrderProductDTO = z.object({
  orderNo: z.string().min(1),
  productId: z.number(),
  productName: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
});
const AddOrderPaymentDTO = z.object({
  orderNo: z.string().min(1),
  paymentMethod: z.string(),
  paymentMethodName: z.string(),
  paymentAmount: z.number().min(0),
});

const DeleteOrderDTO = z.object({
  orderNo: z.string().min(1),
  deleteReason: z.string(),
  deletedBy: z.number(),
  deletedByName: z.string(),
});
const DeleteOrderItemDTO = z.object({
  type: z.enum([
    'area',
    'product',
    'payment',
    'reserved',
  ]) as z.ZodType<OrderItemType>,
  ids: z.array(z.number()),
});

const UpdateOrderDTO = z.object({
  orderNo: z.string().min(1),
  orderStatus: z.string().optional(),
  openedAt: z.string().nullable().optional(),
  closedAt: z.string().nullable().optional(),
  actualAmount: z.number().nullable().optional(),
  paymentDifferenceReason: z.string().nullable().optional(),
  remark: z.string().nullable().optional(),
  updatedBy: z.number().optional(),
  updatedByName: z.string().optional(),
});
const UpdateOrderProductDTO = z.object({
  id: z.number(),
  orderNo: z.string().optional(),
  productName: z.string().optional(),
  quantity: z.number().optional(),
  unitPrice: z.number().optional(),
});
const UpdateOrderPaymentDTO = z.object({
  id: z.number(),
  paymentMethod: z.string().optional(),
  paymentMethodName: z.string().optional(),
  paymentAmount: z.number().optional(),
});

const SetOrderAreaDTO = z.object({
  orderNo: z.string().min(1),
  areaId: z.number(),
  areaName: z.string(),
  areaType: z.string(),
  roomSize: z.string().nullable().optional(),
  price: z.number().min(0).optional(),
});
const SetOrderReservedDTO = z.object({
  orderNo: z.string().min(1),
  username: z.string().nullable().optional(),
  contact: z.string().nullable().optional(),
  arriveAt: z.string().nullable().optional(),
});

export const orderController = {
  /** 创建订单 */
  async create(req: Request, res: Response) {
    const parsed = CreateOrderDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await OrderService.createOrder({
      ...parsed.data,
      orderStatus: parsed.data.orderStatus as ORDER_STATUS,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },
  async addProduct(req: Request, res: Response) {
    const parsed = AddOrderProductDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.addOrderProduct(parsed.data);
    res.status(201).json({ message: '添加成功' });
  },
  async addPayment(req: Request, res: Response) {
    const parsed = AddOrderPaymentDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.addOrderPayment(parsed.data);
    res.status(201).json({ message: '添加成功' });
  },

  /** 添加订单区域 */
  async setArea(req: Request, res: Response) {
    const parsed = SetOrderAreaDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      });
    }

    await OrderService.setOrderArea(parsed.data);

    res.status(200).json({
      message: '设置成功',
    });
  },

  /** 添加预定信息 */
  async setReserved(req: Request, res: Response) {
    const parsed = SetOrderReservedDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(i => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      });
    }

    await OrderService.setOrderReserved(parsed.data);

    res.status(200).json({
      message: '设置成功',
    });
  },

  /** 更新订单 */
  async update(req: Request, res: Response) {
    const parsed = UpdateOrderDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.updateOrder({
      ...parsed.data,
      orderStatus: parsed.data.orderStatus as ORDER_STATUS | undefined,
    });
    res.status(200).json({ message: '更新成功' });
  },
  async updateProduct(req: Request, res: Response) {
    const parsed = UpdateOrderProductDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.updateOrderProduct(parsed.data);
    res.status(200).json({ message: '更新成功' });
  },
  async updatePayment(req: Request, res: Response) {
    const parsed = UpdateOrderPaymentDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.updateOrderPayment(parsed.data);
    res.status(200).json({ message: '更新成功' });
  },

  /** 删除订单 */
  async delete(req: Request, res: Response) {
    const parsed = DeleteOrderDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await OrderService.deleteOrder(parsed.data);
    res.status(204).send();
  },
  async deleteItem(req: Request, res: Response) {
    const parsed = DeleteOrderItemDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const { type, ids } = parsed.data;
    const table = deleteTableMap[type];

    await OrderService.deleteById(table, ids);

    res.status(204).send();
  },

  /** 查询订单 */
  async page(req: Request, res: Response) {
    const data = await OrderService.queryOrders({
      orderNo: req.query.orderNo ? req.query.orderNo.toString() : undefined,
      orderStatus: req.query.orderStatus
        ? (req.query.orderStatus.toString().split(',') as ORDER_STATUS[])
        : undefined,

      areaName: req.query.areaName ? req.query.areaName.toString() : undefined,
      areaType: req.query.areaType ? req.query.areaType.toString() : undefined,
      roomSize: req.query.roomSize ? req.query.roomSize.toString() : undefined,

      unboundArea: req.query.unboundArea
        ? req.query.unboundArea === 'true'
        : undefined,

      openedAtFrom: req.query.openedAtFrom?.toString(),
      openedAtTo: req.query.openedAtTo?.toString(),

      reservedUsername: req.query.reservedUsername
        ? req.query.reservedUsername.toString()
        : undefined,
      reservedContact: req.query.reservedContact
        ? req.query.reservedContact.toString()
        : undefined,

      page: Number(req.query.page) || 1,
      pageSize: Number(req.query.pageSize) || 10,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },
};
