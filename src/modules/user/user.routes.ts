import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { userController } from "./user.controller";

export const userRoutes = Router();

userRoutes.use(authGuard);

userRoutes.post(
  "/",
  permissionGuard("user:create"),
  userController.create
);

userRoutes.put(
  "/:id",
  permissionGuard("user:update"),
  userController.update
);

userRoutes.delete(
  "/:id",
  permissionGuard("user:delete"),
  userController.delete
);

userRoutes.get(
  "/list",
  permissionGuard("user:read"),
  userController.list);
userRoutes.get(
  "/page",
  permissionGuard("user:read"),
  userController.page);
userRoutes.get(
  "/:id",
  permissionGuard("user:read"),
  userController.getUserByUserId
);
