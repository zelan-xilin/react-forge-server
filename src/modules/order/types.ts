export type ORDER_STATUS =
  | 'reserved'
  | 'in_progress'
  | 'pending_pay'
  | 'paid'
  | 'cancelled';

/**
 * 创建订单、以及增加订单各个部分的 DTO 类型定义
 */
export interface CreateOrderDTO {
  createdBy: number;
  createdByName: string;
  orderStatus: ORDER_STATUS;
  remark?: string | null;
  openedAt?: string | null;
}
export interface AddOrderAreaDTO {
  orderNo: string;
  areaId: number;
  areaName: string;
  areaType: string;
  roomSize?: string | null;
  price?: number;
}
export interface AddOrderReservedDTO {
  orderNo: string;
  username?: string | null;
  contact?: string | null;
  arriveAt?: string | null;
}
export interface AddOrderProductDTO {
  orderNo: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}
export interface AddOrderPaymentDTO {
  orderNo: string;
  paymentMethod: string;
  paymentMethodName: string;
  paymentAmount: number;
}

/**
 * 更新订单 DTO 类型定义
 */
export interface DeleteOrderDTO {
  orderNo: string;
  deleteReason: string;
  deletedBy: number;
  deletedByName: string;
}

/**
 * 订单查询
 */
export interface OrderPageParams {
  /** 订单信息 */
  orderNo?: string;
  orderStatus?: ORDER_STATUS[];

  /** 订单区域 */
  areaName?: string;
  areaType?: string;
  roomSize?: string;

  /** 是否为散客(即没有固定座位) */
  unboundArea?: boolean;

  /** 订单开启时间 */
  openedAtFrom?: string;
  openedAtTo?: string;

  /** 预定人信息 */
  reservedUsername?: string;
  reservedContact?: string;

  /** 分页 */
  page: number;
  pageSize: number;
}
export interface OrderReservedDTO {
  id: number;
  orderNo: string;

  /** 预定人姓名 */
  username?: string | null;
  /** 预定人联系方式 */
  contact?: string | null;
  /** 预定到店时间 */
  arriveAt?: string | null;
}
export interface OrderAreaDTO {
  id: number;
  orderNo: string;

  /** 订单绑定的区域信息 */
  areaId: number;
  areaName: string;
  areaType: string;
  roomSize?: string | null;

  /** 区域价格 */
  price: number;
}
export interface OrderProductDTO {
  id: number;
  orderNo: string;

  /** 商品信息 */
  productId: number;
  productName: string;

  /** 商品销售数量 */
  quantity: number;

  /** 商品单价 */
  unitPrice: number;

  /** 商品理论应收总价 */
  totalPrice: number;
}
export interface OrderPaymentDTO {
  id: number;
  /** ORD + 时间(YYYYMMDD) + 序列 */
  orderNo: string;

  /** 支付方式记录 */
  paymentMethod: string;
  paymentMethodName: string;
  paidAt: string;

  /** 支付金额 */
  paymentAmount: number;
}
export interface OrderDTO {
  id: number;
  orderNo: string;

  /** 订单流转状态，开单和关闭时间记录 */
  orderStatus: ORDER_STATUS;
  openedAt?: string | null;
  closedAt?: string | null;

  /** 预定人信息 */
  reserved?: OrderReservedDTO | null;

  /** 当前订单绑定的区域信息或者散客(即没有固定座位) */
  area?: OrderAreaDTO | null;

  /** 订单商品信息(可多商品) */
  products?: OrderProductDTO[] | null;

  /** 理论付款 */
  expectedAmount?: number | null;
  /** 实际付款 */
  actualAmount?: number | null;
  /** 实际付款与理论付款差异原因 */
  paymentDifferenceReason?: string | null;
  /** 付款支付方式(支持组合付款) */
  payments?: OrderPaymentDTO[] | null;

  /** 备注信息 */
  remark?: string | null;

  /** 删除状态以及删除原因 */
  isDeleted: 0 | 1;
  deleteReason?: string | null;
  deletedBy?: number | null;
  deletedByName?: string | null;
  deletedAt?: string | null;

  /** 常规信息记录 */
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedBy?: number | null;
  updatedByName?: string | null;
  updatedAt?: string | null;
}

/**
 * 订单更新
 */
export interface UpdateOrderDTO {
  orderNo: string;
  orderStatus?: ORDER_STATUS;
  openedAt?: string | null;
  closedAt?: string | null;
  actualAmount?: number | null;
  paymentDifferenceReason?: string | null;
  remark?: string | null;
  updatedBy?: number;
  updatedByName?: string;
}
export interface UpdateOrderProductDTO {
  id: number;
  orderNo?: string; // 移动到其他订单
  productName?: string;
  quantity?: number;
  unitPrice?: number;
}
export interface UpdateOrderPaymentDTO {
  id: number;
  paymentMethod?: string;
  paymentMethodName?: string;
  paymentAmount?: number;
}
