import { Request, Response } from 'express';
import { z } from 'zod';
import { recipeService } from './recipe.service';

const RecipeItemDTO = z.object({
  materialId: z.number().int().positive('物料ID必须为正整数'),
  amount: z.number().min(0, '数量不能小于0'),
});

const CreateRecipeDTO = z.object({
  name: z
    .string()
    .min(1, '配方名称不能为空')
    .max(50, '配方名称不能超过50个字符'),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
  children: z.array(RecipeItemDTO),
});

const UpdateRecipeDTO = z.object({
  name: z
    .string()
    .min(1, '配方名称不能为空')
    .max(50, '配方名称不能超过50个字符'),
  status: z.number().min(0).max(1),
  description: z
    .string()
    .max(200, '描述不能超过200个字符')
    .nullable()
    .optional(),
  children: z.array(RecipeItemDTO),
});

export const recipeController = {
  /** 新增配方 */
  async create(req: Request, res: Response) {
    const parsed = CreateRecipeDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await recipeService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新配方 */
  async update(req: Request, res: Response) {
    const parsed = UpdateRecipeDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await recipeService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除配方 */
  async delete(req: Request, res: Response) {
    await recipeService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 分页查询配方（包含 children） */
  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const name = req.query.name ? String(req.query.name) : undefined;

    const data = await recipeService.page({
      page,
      pageSize,
      name,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 配方列表（包含 children） */
  async list(req: Request, res: Response) {
    const data = await recipeService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 验证配方名称是否存在 */
  async isRecipeNameExists(req: Request, res: Response) {
    const name = String(req.query.name || '');
    const recipeId = req.query.recipeId
      ? Number(req.query.recipeId)
      : undefined;

    const exists = await recipeService.isRecipeNameExists(name, recipeId);

    res.status(200).json({
      message: '查询成功',
      data: { exists },
    });
  },
};
