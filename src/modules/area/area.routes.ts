import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { areaController } from './area.controller';

export const areaRoutes = Router();

areaRoutes.use(authGuard);

/** 分页查询区域资源 */
areaRoutes.get('/page', permissionGuard('area:read'), areaController.page);

/** 新增区域资源 */
areaRoutes.post('/', permissionGuard('area:create'), areaController.create);

/** 更新区域资源 */
areaRoutes.put('/:id', permissionGuard('area:update'), areaController.update);

/** 删除区域资源 */
areaRoutes.delete(
  '/:id',
  permissionGuard('area:delete'),
  areaController.delete,
);

/** 区域资源列表 */
areaRoutes.get('/list', permissionGuard('area:read'), areaController.list);

/** 验证区域资源名称是否存在 */
areaRoutes.get(
  '/exists',
  permissionGuard('area:read'),
  areaController.isAreaNameExists,
);
