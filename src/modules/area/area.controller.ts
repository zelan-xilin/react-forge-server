import { Request, Response } from 'express';
import { z } from 'zod';
import { areaService } from './area.service';

const CreateAreaDTO = z.object({
  name: z
    .string()
    .min(1, '区域名称不能为空')
    .max(50, '区域名称不能超过50个字符'),
  areaType: z.string().min(1, '区域类型不能为空'),
  roomSize: z.string().nullable().optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
});

const UpdateAreaDTO = z.object({
  name: z
    .string()
    .min(1, '区域名称不能为空')
    .max(50, '区域名称不能超过50个字符')
    .optional(),
  areaType: z.string().optional(),
  roomSize: z.string().nullable().optional(),
  status: z.number().min(0).max(1).optional(),
  description: z
    .string()
    .max(200, '描述不能超过200个字符')
    .nullable()
    .optional(),
});

export const areaController = {
  /** 新增区域 */
  async create(req: Request, res: Response) {
    const parsed = CreateAreaDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新区域 */
  async update(req: Request, res: Response) {
    const parsed = UpdateAreaDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除区域 */
  async delete(req: Request, res: Response) {
    await areaService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 分页查询区域 */
  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const name = req.query.name ? String(req.query.name) : undefined;

    const data = await areaService.page({
      page,
      pageSize,
      name,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 区域列表 */
  async list(req: Request, res: Response) {
    const data = await areaService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 验证区域名称是否存在 */
  async isAreaNameExists(req: Request, res: Response) {
    const name = String(req.query.name || '');
    const areaId = req.query.areaId ? Number(req.query.areaId) : undefined;
    const exists = await areaService.isAreaNameExists(name, areaId);
    res.status(200).json({
      message: '查询成功',
      data: { exists },
    });
  },
};
