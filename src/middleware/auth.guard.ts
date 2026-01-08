import { NextFunction, Request, Response } from "express";
import { authService } from "../modules/auth/auth.service";
import { roleService } from "../modules/role/role.service";
import { userService } from "../modules/user/user.service";

export async function authGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({
        message: "未登录，请先登录",
        data: null
      });
  }

  try {
    const { uid } = authService.verify(token);

    const userData = await userService.getUserByUserId(uid);
    if (!userData) {
      return res
        .status(401)
        .json({
          message: "用户不存在",
          data: null
        });
    }

    let actions: string[] = [];
    if (userData.roleId && userData.isAdmin !== 1) {
      const perms = await roleService.getActionPermissionsByRoleId(
        userData.roleId
      );
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
    res
      .status(401)
      .json({
        message: "无效的登录状态，请重新登录",
        data: null
      });
  }
}
