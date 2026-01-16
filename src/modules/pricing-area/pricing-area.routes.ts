import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { areaPricingController } from './pricing-area.controller';

export const areaPricingRoutes = Router();

areaPricingRoutes.use(authGuard);

/** 分页查询区域定价 */
areaPricingRoutes.get(
  '/page',
  permissionGuard('area_pricing:read'),
  areaPricingController.page,
);

/** 新增区域定价 */
areaPricingRoutes.post(
  '/',
  permissionGuard('area_pricing:create'),
  areaPricingController.create,
);

/** 更新区域定价 */
areaPricingRoutes.put(
  '/:id',
  permissionGuard('area_pricing:update'),
  areaPricingController.update,
);

/** 删除区域定价 */
areaPricingRoutes.delete(
  '/:id',
  permissionGuard('area_pricing:delete'),
  areaPricingController.delete,
);

/** 区域定价列表 */
areaPricingRoutes.get(
  '/list',
  permissionGuard('area_pricing:read'),
  areaPricingController.list,
);
