import { Request, Response } from 'express';
import { z } from 'zod';
import { roleService } from './role.service';

const CreateRoleDTO = z.object({
  name: z.string().min(1, '角色名不能为空').max(50, '角色名不能超过50个字符'),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
});

const UpdateRoleDTO = z.object({
  name: z.string().min(1).max(50).optional(),
  description: z.string().max(200).nullable().optional(),
});

const SetPathPermissionsByRoleIdDTO = z.object({
  paths: z.array(z.string()),
});

const SetActionPermissionsByRoleIdDTO = z.object({
  permissions: z.array(
    z.object({
      module: z.string(),
      action: z.string(),
    }),
  ),
});

export const roleController = {
  /** 新增角色 */
  async create(req: Request, res: Response) {
    const parsed = CreateRoleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await roleService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新角色 */
  async update(req: Request, res: Response) {
    const parsed = UpdateRoleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await roleService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除角色 */
  async delete(req: Request, res: Response) {
    await roleService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 角色列表 */
  async list(req: Request, res: Response) {
    const data = await roleService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 角色分页 */
  async page(req: Request, res: Response) {
    const query = {
      name: req.query.name as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };
    const data = await roleService.page(query);
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 验证角色名称是否存在 */
  async isRoleNameExists(req: Request, res: Response) {
    const name = String(req.query.name || '');
    const roleId = req.query.roleId ? Number(req.query.roleId) : undefined;
    const exists = await roleService.isRoleNameExists(name, roleId);
    res.status(200).json({
      message: '查询成功',
      data: { exists },
    });
  },

  /** 根据角色ID获取角色 */
  async getRoleByRoleId(req: Request, res: Response) {
    const data = await roleService.getRoleByRoleId(Number(req.params.id));
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 设置角色路径权限 */
  async setPathPermissionsByRoleId(req: Request, res: Response) {
    const parsed = SetPathPermissionsByRoleIdDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await roleService.setPathPermissionsByRoleId(
      Number(req.params.id),
      parsed.data.paths,
    );
    res.status(200).json({
      message: '设置成功',
      data: null,
    });
  },

  /** 获取角色路径权限 */
  async getPathPermissionsByRoleId(req: Request, res: Response) {
    const data = await roleService.getPathPermissionsByRoleId(
      Number(req.params.id),
    );
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 设置角色操作权限 */
  async setActionPermissionsByRoleId(req: Request, res: Response) {
    const parsed = SetActionPermissionsByRoleIdDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await roleService.setActionPermissionsByRoleId(
      Number(req.params.id),
      parsed.data.permissions,
    );
    res.status(200).json({
      message: '设置成功',
      data: null,
    });
  },

  /** 获取角色操作权限 */
  async getActionPermissionsByRoleId(req: Request, res: Response) {
    const data = await roleService.getActionPermissionsByRoleId(
      Number(req.params.id),
    );
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },
};
