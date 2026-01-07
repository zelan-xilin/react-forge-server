import { Router } from "express"
import { authGuard } from "../../middleware/auth.guard"
import { userController } from "./user.controller"

export const userRoutes = Router()

userRoutes.use(authGuard)

userRoutes.post("/", userController.create)

userRoutes.put("/:id", userController.update)

userRoutes.delete("/:id", userController.delete)

userRoutes.get("/list", userController.list)
userRoutes.get("/page", userController.page)
userRoutes.get("/:id", userController.getById)