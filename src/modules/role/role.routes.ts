import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { roleController } from "./role.controller";

export const roleRoutes = Router();

roleRoutes.use(authGuard);

/** 新增角色 */
roleRoutes.post(
  "/",
  permissionGuard("role:create"),
  roleController.create
);

/** 更新角色 */
roleRoutes.put(
  "/:id",
  permissionGuard("role:update"),
  roleController.update
);

/** 删除角色 */
roleRoutes.delete(
  "/:id",
  permissionGuard("role:delete"),
  roleController.delete
);

/** 角色列表 */
roleRoutes.get(
  "/list",
  permissionGuard("role:read"),
  roleController.list
);

/** 角色分页 */
roleRoutes.get(
  "/page",
  permissionGuard("role:read"),
  roleController.page
);


/** 验证角色名称是否存在 */
roleRoutes.get(
  "/exists",
  roleController.isRoleNameExists
);

/** 根据角色ID获取角色 */
roleRoutes.get(
  "/:id",
  permissionGuard("role:read"),
  roleController.getRoleByRoleId
);

/** 设置角色路径权限 */
roleRoutes.put(
  "/:id/path",
  permissionGuard("role:update"),
  roleController.setPathPermissionsByRoleId
);

/** 获取角色路径权限 */
roleRoutes.get(
  "/:id/path",
  permissionGuard("role:read"),
  roleController.getPathPermissionsByRoleId
);

/** 设置角色操作权限 */
roleRoutes.put(
  "/:id/action",
  permissionGuard("role:update"),
  roleController.setActionPermissionsByRoleId
);

/** 获取角色操作权限 */
roleRoutes.get(
  "/:id/action",
  permissionGuard("role:read"),
  roleController.getActionPermissionsByRoleId
);
