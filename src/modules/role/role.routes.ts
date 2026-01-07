import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { roleController } from "./role.controller";

export const roleRoutes = Router();

roleRoutes.use(authGuard);

roleRoutes.post("/", permissionGuard("role:create"), roleController.create);

roleRoutes.delete(
  "/:id",
  permissionGuard("role:delete"),
  roleController.delete
);

roleRoutes.put("/:id", permissionGuard("role:update"), roleController.update);

roleRoutes.get("/list", permissionGuard("role:read"), roleController.list);
roleRoutes.get("/page", permissionGuard("role:read"), roleController.page);

roleRoutes.put(
  "/:id/route",
  permissionGuard("role:update"),
  roleController.setPathPermissionsByRoleId
);
roleRoutes.get("/:id/route", roleController.getPathPermissionsByRoleId);

roleRoutes.put(
  "/:id/permission",
  permissionGuard("role:update"),
  roleController.setActionPermissionsByRoleId
);
roleRoutes.get(
  "/:id/permission",
  permissionGuard("role:read"),
  roleController.getActionPermissionsByRoleId
);
