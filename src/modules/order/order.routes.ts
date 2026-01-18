import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { orderController } from './order.controller';

export const orderRoutes = Router();

orderRoutes.use(authGuard);

/** 分页查询订单 */
orderRoutes.get('/page', permissionGuard('order:read'), orderController.page);

/** 创建订单 */
orderRoutes.post('/', permissionGuard('order:create'), orderController.create);

/** 更新订单 */
orderRoutes.put('/', permissionGuard('order:update'), orderController.update);

/** 删除订单（逻辑删除） */
orderRoutes.delete(
  '/',
  permissionGuard('order:delete'),
  orderController.delete,
);
/** 删除订单子项（区域 / 商品 / 支付 / 预定） */
orderRoutes.delete(
  '/item',
  permissionGuard('order:update'),
  orderController.deleteItem,
);

/** 设置订单区域（覆盖式） */
orderRoutes.post(
  '/area',
  permissionGuard('order:update'),
  orderController.setArea,
);

/** 设置订单预定信息（覆盖式） */
orderRoutes.post(
  '/reserved',
  permissionGuard('order:update'),
  orderController.setReserved,
);

/** 添加订单商品 */
orderRoutes.post(
  '/product',
  permissionGuard('order:update'),
  orderController.addProduct,
);

/** 更新订单商品 */
orderRoutes.put(
  '/product',
  permissionGuard('order:update'),
  orderController.updateProduct,
);

/** 添加支付记录 */
orderRoutes.post(
  '/payment',
  permissionGuard('order:update'),
  orderController.addPayment,
);

/** 更新支付记录 */
orderRoutes.put(
  '/payment',
  permissionGuard('order:update'),
  orderController.updatePayment,
);
