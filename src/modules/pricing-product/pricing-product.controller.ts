import { Request, Response } from 'express';
import { z } from 'zod';
import { productPricingService } from './pricing-product.service';

const CreateProductPricingDTO = z.object({
  productId: z.number().min(1, '商品ID不能为空'),
  price: z.number().min(0, '价格必须大于等于0'),
  ruleApplicationType: z.string().nullable().optional(),
  applyTimeStart: z.string().nullable().optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, '描述不能超过200个字符').optional(),
});

const UpdateProductPricingDTO = z.object({
  productId: z.number().optional(),
  price: z.number().min(0).optional(),
  ruleApplicationType: z.string().nullable().optional(),
  applyTimeStart: z.string().nullable().optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

export const productPricingController = {
  /** 新增商品定价 */
  async create(req: Request, res: Response) {
    const parsed = CreateProductPricingDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await productPricingService.create({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  /** 更新商品定价 */
  async update(req: Request, res: Response) {
    const parsed = UpdateProductPricingDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await productPricingService.update(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: '更新成功',
      data,
    });
  },

  /** 删除商品定价 */
  async delete(req: Request, res: Response) {
    await productPricingService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 分页查询商品定价 */
  async page(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const productId = req.query.productId
      ? Number(req.query.productId)
      : undefined;

    const data = await productPricingService.page({
      page,
      pageSize,
      productId,
    });

    res.status(200).json({
      message: '查询成功',
      data,
    });
  },

  /** 商品定价列表 */
  async list(req: Request, res: Response) {
    const data = await productPricingService.list();
    res.status(200).json({
      message: '查询成功',
      data,
    });
  },
};
