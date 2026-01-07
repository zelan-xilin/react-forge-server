import { NextFunction, Request, Response } from "express";
import { roleService } from "modules/role/role.service";
import { userService } from "modules/user/user.service";
import { authService } from "../modules/auth/auth.service";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);

  try {
    const { uid } = authService.verify(token);

    const userData = await userService.getUserById(uid);
    if (!userData) {
      return res.status(401).json({ error: "User not found" });
    }

    let actions: string[] = [];
    if (userData.roleId && userData.isAdmin !== 1) {
      const perms = await roleService.getActionPermissions(userData.roleId);
      actions = perms.map((p) => `${p.module}:${p.action}`);
    }

    req.user = {
      userId: userData.id,
      username: userData.username,
      roleId: userData.roleId,
      status: userData.status,
      isAdmin: userData.isAdmin ?? 0,
      actions,
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}
