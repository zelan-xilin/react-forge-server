import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { dictController } from "./dict.controller";

export const dictRoutes = Router();

dictRoutes.use(authGuard);

/** 新增字典 */
dictRoutes.post("/", permissionGuard("dict:create"), dictController.create);

/** 字典列表 */
dictRoutes.get("/list", permissionGuard("dict:read"), dictController.list);

/** 字典分页 */
dictRoutes.get("/page", permissionGuard("dict:read"), dictController.page);

/** 检查字典名是否存在 */
dictRoutes.get("/exists", dictController.isDictLabelExists);

/** 根据字典ID获取字典 */
dictRoutes.get(
  "/:id",
  permissionGuard("dict:read"),
  dictController.getDictById
);

/** 更新字典 */
dictRoutes.put("/:id", permissionGuard("dict:update"), dictController.update);

/** 删除字典 */
dictRoutes.delete(
  "/:id",
  permissionGuard("dict:delete"),
  dictController.delete
);
