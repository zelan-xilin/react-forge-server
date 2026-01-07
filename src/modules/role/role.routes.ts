import { Router } from "express"
import { authGuard } from "../../middleware/auth.guard"
import { roleController } from "./role.controller"

export const roleRoutes = Router()

roleRoutes.use(authGuard)

roleRoutes.post("/", roleController.create)

roleRoutes.delete("/:id", roleController.delete)

roleRoutes.put("/:id", roleController.update)

roleRoutes.get("/list", roleController.list)
roleRoutes.get("/page", roleController.page)

roleRoutes.put("/:id/permissions", roleController.setPermissions)
roleRoutes.get("/:id/permissions", roleController.getPermissions)
