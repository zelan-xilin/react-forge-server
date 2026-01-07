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

export const userController = {
  async create(req: Request, res: Response) {
    const parsed = CreateUserDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await userService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.json({ success: true });
  },

  async update(req: Request, res: Response) {
    const parsed = UpdateUserDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await userService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.json({ success: true });
  },

  async delete(req: Request, res: Response) {
    await userService.delete(Number(req.params.id));
    res.json({ success: true });
  },

  async list(req: Request, res: Response) {
    const data = await userService.list();
    res.json(data);
  },

  async page(req: Request, res: Response) {
    const query = {
      username: req.query.username as string | undefined,
      roleId: req.query.roleId ? Number(req.query.roleId) : undefined,
      status: req.query.status ? Number(req.query.status) : undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };

    const data = await userService.page(query);
    res.json(data);
  },

  async validate(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await userService.validate(username, password);
    res.json(user);
  },

  async getUserById(req: Request, res: Response) {
    const data = await userService.getUserById(Number(req.params.id));
    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(data);
  },
};
