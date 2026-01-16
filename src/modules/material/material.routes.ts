import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { materialController } from './material.controller';

export const materialRoutes = Router();

materialRoutes.use(authGuard);

/** 分页查询材料 */
materialRoutes.get(
  '/page',
  permissionGuard('material:read'),
  materialController.page,
);

/** 新增材料 */
materialRoutes.post(
  '/',
  permissionGuard('material:create'),
  materialController.create,
);

/** 更新材料 */
materialRoutes.put(
  '/:id',
  permissionGuard('material:update'),
  materialController.update,
);

/** 删除材料 */
materialRoutes.delete(
  '/:id',
  permissionGuard('material:delete'),
  materialController.delete,
);

/** 材料列表 */
materialRoutes.get(
  '/list',
  permissionGuard('material:read'),
  materialController.list,
);

/** 验证材料名称是否存在 */
materialRoutes.get(
  '/exists',
  permissionGuard('material:read'),
  materialController.isMaterialNameExists,
);
