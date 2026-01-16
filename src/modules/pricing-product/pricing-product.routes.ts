import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { productPricingController } from './pricing-product.controller';

export const productPricingRoutes = Router();

productPricingRoutes.use(authGuard);

/** 分页查询商品定价 */
productPricingRoutes.get(
  '/page',
  permissionGuard('product_pricing:read'),
  productPricingController.page,
);

/** 新增商品定价 */
productPricingRoutes.post(
  '/',
  permissionGuard('product_pricing:create'),
  productPricingController.create,
);

/** 更新商品定价 */
productPricingRoutes.put(
  '/:id',
  permissionGuard('product_pricing:update'),
  productPricingController.update,
);

/** 删除商品定价 */
productPricingRoutes.delete(
  '/:id',
  permissionGuard('product_pricing:delete'),
  productPricingController.delete,
);

/** 商品定价列表 */
productPricingRoutes.get(
  '/list',
  permissionGuard('product_pricing:read'),
  productPricingController.list,
);
