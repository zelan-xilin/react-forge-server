import { Request, Response } from "express";
import { z } from "zod";
import { userService } from "./user.service";

const CreateUserDTO = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符")
    .max(50, "用户名不能超过50个字符"),
  password: z
    .string()
    .min(6, "密码至少6个字符")
    .max(100, "密码不能超过100个字符"),
  roleId: z.number().int().positive("角色ID必须为正整数").optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
  status: z.number().int().min(0).max(1).optional(),
});

const UpdateUserDTO = z.object({
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(6).max(100).optional(),
  roleId: z.number().int().positive().optional(),
  status: z.number().int().min(0).max(1).optional(),
  description: z.string().max(200).optional(),
});

const ValidateCredentialsDTO = z.object({
  username: z
    .string()
    .min(3, "用户名至少3个字符"),
  password: z
    .string()
    .min(6, "密码至少6个字符"),
});

export const userController = {
  /** 新增用户 */
  async create(req: Request, res: Response) {
    const parsed = CreateUserDTO.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          message: "参数验证失败",
          data: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
    }

    await userService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res
      .status(201)
      .json({
        message: "创建成功",
        data: null
      });
  },

  /** 更新用户 */
  async update(req: Request, res: Response) {
    const parsed = UpdateUserDTO.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({
          message: "参数验证失败",
          data: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
    }

    await userService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res
      .status(200)
      .json({
        message: "更新成功",
        data: null
      });
  },

  /** 删除用户 */
  async delete(req: Request, res: Response) {
    await userService.delete(Number(req.params.id));
    res
      .status(204)
      .send()
  },

  /** 用户列表 */
  async list(req: Request, res: Response) {
    const data = await userService.list();
    const safeList = data.map(({ passwordHash, ...rest }) => rest);
    res
      .status(200)
      .json({
        message: "查询成功",
        data: safeList
      });
  },

  /** 用户分页 */
  async page(req: Request, res: Response) {
    const query = {
      username: req.query.username as string | undefined,
      roleId: req.query.roleId ? Number(req.query.roleId) : undefined,
      status: req.query.status ? Number(req.query.status) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };

    const { list, total } = await userService.page(query);
    const safeList = list.map(({ passwordHash, ...rest }) => rest);
    res
      .status(200)
      .json({
        message: "查询成功",
        data: { list: safeList, total }
      });
  },

  /** 检查用户名是否存在 */
  async isUsernameExists(req: Request, res: Response) {
    const username = req.query.username as string;
    const userId = req.query.userId ? Number(req.query.userId) : undefined;
    const exists = await userService.isUsernameExists(username, userId);

    res
      .status(200)
      .json({
        message: "查询成功",
        data: { exists }
      });
  },

  /** 查看用户是否存在 */
  async verifyUser(req: Request, res: Response) {
    const parsed = ValidateCredentialsDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
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

    const { passwordHash, ...safeUser } = user;
    res
      .status(200)
      .json({
        message: "验证成功",
        data: safeUser
      });
  },

  /** 根据用户ID获取用户 */
  async getUserByUserId(req: Request, res: Response) {
    const data = await userService.getUserByUserId(Number(req.params.id));

    if (!data) {
      return res
        .status(404)
        .json({
          message: "用户不存在"
        });
    }

    const { passwordHash, ...safeUser } = data;
    res
      .status(200)
      .json({
        message: "查询成功",
        data: safeUser
      });
  },
};
