import { Router } from 'express';
import { authGuard } from '../../middleware/auth.guard';
import { permissionGuard } from '../../middleware/permission.guard';
import { dictController } from './dict.controller';

export const dictRoutes = Router();
dictRoutes.use(authGuard);

dictRoutes.post('/', permissionGuard('dict:create'), dictController.createDict);

dictRoutes.get(
  '/exists',
  permissionGuard('dict:read'),
  dictController.checkDictUnique,
);

dictRoutes.get('/page', permissionGuard('dict:read'), dictController.pageDict);
dictRoutes.get('/list', permissionGuard('dict:read'), dictController.listDict);

dictRoutes.get(
  '/:id',
  permissionGuard('dict:read'),
  dictController.getDictById,
);

dictRoutes.put(
  '/:id',
  permissionGuard('dict:update'),
  dictController.updateDict,
);

dictRoutes.delete(
  '/:id',
  permissionGuard('dict:delete'),
  dictController.deleteDict,
);

dictRoutes.get(
  '/items/exists',
  permissionGuard('dict:read'),
  dictController.checkItemUnique,
);

dictRoutes.post(
  '/:dictId/items',
  permissionGuard('dict:create'),
  dictController.createItem,
);

dictRoutes.put(
  '/items/:itemId',
  permissionGuard('dict:update'),
  dictController.updateItem,
);

dictRoutes.delete(
  '/items/:itemId',
  permissionGuard('dict:delete'),
  dictController.deleteItem,
);
