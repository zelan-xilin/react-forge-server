import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { recipeController } from './recipe.controller';

export const recipeRoutes = Router();

recipeRoutes.use(authGuard);

/** 分页查询配方 */
recipeRoutes.get(
  '/page',
  permissionGuard('recipe:read'),
  recipeController.page,
);

/** 新增配方 */
recipeRoutes.post(
  '/',
  permissionGuard('recipe:create'),
  recipeController.create,
);

/** 更新配方 */
recipeRoutes.put(
  '/:id',
  permissionGuard('recipe:update'),
  recipeController.update,
);

/** 删除配方 */
recipeRoutes.delete(
  '/:id',
  permissionGuard('recipe:delete'),
  recipeController.delete,
);

/** 配方列表 */
recipeRoutes.get(
  '/list',
  permissionGuard('recipe:read'),
  recipeController.list,
);

/** 验证配方名称是否存在 */
recipeRoutes.get(
  '/exists',
  permissionGuard('recipe:read'),
  recipeController.isRecipeNameExists,
);
