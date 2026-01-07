import { Request, Response } from "express";
import { z } from "zod";
import { roleService } from "./role.service";

const CreateRoleDTO = z.object({
  name: z.string().min(1, "角色名不能为空").max(50, "角色名不能超过50个字符"),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

const UpdateRoleDTO = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).optional(),
});

const SetPathPermissionsDTO = z.object({
  paths: z.array(z.string()),
});

const SetActionPermissionsDTO = z.object({
  permissions: z.array(
    z.object({
      module: z.string(),
      action: z.string(),
    })
  ),
});

export const roleController = {
  async create(req: Request, res: Response) {
    const parsed = CreateRoleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await roleService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.json({ success: true });
  },

  async update(req: Request, res: Response) {
    const parsed = UpdateRoleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await roleService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.json({ success: true });
  },

  async delete(req: Request, res: Response) {
    await roleService.delete(Number(req.params.id));
    res.json({ success: true });
  },

  async list(req: Request, res: Response) {
    const data = await roleService.list();
    res.json(data);
  },

  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const name =
      typeof req.query.name === "string" && req.query.name
        ? req.query.name
        : undefined;
    const data = await roleService.page({ name, page, pageSize });
    res.json(data);
  },

  async setPathPermissions(req: Request, res: Response) {
    const parsed = SetPathPermissionsDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await roleService.setPathPermissions(
      Number(req.params.id),
      parsed.data.paths
    );
    res.json({ success: true });
  },

  async getPathPermissions(req: Request, res: Response) {
    const data = await roleService.getPathPermissions(Number(req.params.id));
    res.json(data);
  },

  async setActionPermissions(req: Request, res: Response) {
    const parsed = SetActionPermissionsDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        errors: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    await roleService.setActionPermissions(
      Number(req.params.id),
      parsed.data.permissions
    );
    res.json({ success: true });
  },

  async getActionPermissions(req: Request, res: Response) {
    const data = await roleService.getActionPermissions(Number(req.params.id));
    res.json(data);
  },
};
