import { Request, Response } from 'express';
import { z } from 'zod';
import { areaPricingService } from './pricing-area.service';

const CreateAreaPricingDTO = z.object({
  areaType: z.string().min(1, '区域类型不能为空'),
  roomSize: z.string().nullable().optional(),
  applyTimeStart: z.string().min(1, '应用时间起始不能为空'),
  applyTimeEnd: z.string().min(1, '应用时间结束不能为空'),
  usageDurationHours: z.number().min(0, '使用时长必须大于0'),
  basePrice: z.number().min(0, '起步价格必须大于等于0'),
  overtimeHourPrice: z.number().min(0, '超时每小时价格必须大于等于0'),
  overtimeRoundType: z.string().min(1, '超时取整方式不能为空'),
  overtimeGraceMinutes: z.number().min(0).optional(),
  giftTeaAmount: z.number().min(0).optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
});

const UpdateAreaPricingDTO = z.object({
  areaType: z.string().optional(),
  roomSize: z.string().nullable().optional(),
  applyTimeStart: z.string().optional(),
  applyTimeEnd: z.string().optional(),
  usageDurationHours: z.number().min(0).optional(),
  basePrice: z.number().min(0).optional(),
  overtimeHourPrice: z.number().min(0).optional(),
  overtimeRoundType: z.string().optional(),
  overtimeGraceMinutes: z.number().min(0).optional(),
  giftTeaAmount: z.number().min(0).optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

export const areaPricingController = {
  /** 新增区域定价 */
  async create(req: Request, res: Response) {
    const parsed = CreateAreaPricingDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await areaPricingService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新区域定价 */
  async update(req: Request, res: Response) {
    const parsed = UpdateAreaPricingDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await areaPricingService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除区域定价 */
  async delete(req: Request, res: Response) {
    await areaPricingService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 分页查询区域定价 */
  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const areaType = req.query.areaType
      ? String(req.query.areaType)
      : undefined;

    const data = await areaPricingService.page({
      page,
      pageSize,
      areaType,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 区域定价列表 */
  async list(req: Request, res: Response) {
    const data = await areaPricingService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },
};
