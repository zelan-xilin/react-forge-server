import { Request, Response } from 'express';
import { z } from 'zod';
import { materialService } from './material.service';

const CreateMaterialDTO = z.object({
  name: z
    .string()
    .min(1, '材料名称不能为空')
    .max(50, '材料名称不能超过50个字符'),
  recipeUnit: z.string().min(1, '配方单位不能为空'),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
});

const UpdateMaterialDTO = z.object({
  name: z
    .string()
    .min(1, '材料名称不能为空')
    .max(50, '材料名称不能超过50个字符')
    .optional(),
  recipeUnit: z.string().optional(),
  status: z.number().min(0).max(1).optional(),
  description: z
    .string()
    .max(200, '描述不能超过200个字符')
    .nullable()
    .optional(),
});

export const materialController = {
  /** 新增材料 */
  async create(req: Request, res: Response) {
    const parsed = CreateMaterialDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await materialService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新材料 */
  async update(req: Request, res: Response) {
    const parsed = UpdateMaterialDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await materialService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除材料 */
  async delete(req: Request, res: Response) {
    await materialService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 分页查询材料 */
  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const name = req.query.name ? String(req.query.name) : undefined;

    const data = await materialService.page({
      page,
      pageSize,
      name,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 材料列表 */
  async list(req: Request, res: Response) {
    const data = await materialService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 验证材料名称是否存在 */
  async isMaterialNameExists(req: Request, res: Response) {
    const name = String(req.query.name || '');
    const materialId = req.query.materialId
      ? Number(req.query.materialId)
      : undefined;
    const exists = await materialService.isMaterialNameExists(name, materialId);
    res.status(200).json({
      message: '查询成功',
      data: { exists },
    });
  },
};
