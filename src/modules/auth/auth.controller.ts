import { Request, Response } from "express";
import { z } from "zod";
import { roleService } from '../role/role.service';
import { userService } from "../user/user.service";
import { authService } from "./auth.service";

const LoginDTO = z.object({
  username: z.string().min(1, "用户名不能为空"),
  password: z.string().min(6, "密码至少 6 位"),
});

export const authController = {
  /** 用户登录 */
  async login(req: Request, res: Response) {
    const parsed = LoginDTO.safeParse(req.body);

    if (!parsed.success) {
      const errors = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res
        .status(400)
        .json({
          message: "参数验证失败",
          data: errors
        });
    }

    const { username, password } = parsed.data;
    const user = await userService.verifyUser(username, password);
    if (!user) {
      return res
        .status(401)
        .json({
          message: "用户名或密码错误",
          data: null
        });
    }

    if (user.status !== 1) {
      return res
        .status(403)
        .json({
          message: "账号已被禁用",
          data: null
        });
    }

    let role: { status: number } | null = null
    let actions: { module: string; action: string; }[] = []
    let paths: string[] = []
    if (user.roleId && user.isAdmin !== 1) {
      try {
        [role, actions, paths] = await Promise.all([
          roleService.getRoleByRoleId(user.roleId),
          roleService.getActionPermissionsByRoleId(user.roleId),
          roleService.getPathPermissionsByRoleId(user.roleId),
        ]);
        if (!role || role.status !== 1) {
          actions = [];
          paths = [];
        }
      } catch (error) {
        console.error('查询权限失败:', error);
      }
    }

    const token = authService.sign(user.id);
    const { passwordHash, ...safeUser } = user;
    const data = {
      token,
      user: safeUser,
      permissions: {
        actions,
        paths,
      },
    }

    res
      .status(200)
      .json({
        message: "登录成功",
        data
      });
  },
};
