import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { userController } from "./user.controller";

export const userRoutes = Router();

userRoutes.use(authGuard);

/** 新增用户 */
userRoutes.post(
  "/",
  permissionGuard("user:create"),
  userController.create
);

/** 更新用户 */
userRoutes.put(
  "/:id",
  permissionGuard("user:update"),
  userController.update
);

/** 删除用户 */
userRoutes.delete(
  "/:id",
  permissionGuard("user:delete"),
  userController.delete
);

/** 用户列表 */
userRoutes.get(
  "/list",
  permissionGuard("user:read"),
  userController.list);

/** 用户分页 */
userRoutes.get(
  "/page",
  permissionGuard("user:read"),
  userController.page);

/** 检查用户名是否存在 */
userRoutes.get(
  "/exists",
  userController.isUsernameExists
);

/** 查看用户是否存在 */
userRoutes.get(
  "/verify",
  userController.verifyUser
);

/** 根据用户ID获取用户 */
userRoutes.get(
  "/:id",
  permissionGuard("user:read"),
  userController.getUserByUserId
);
