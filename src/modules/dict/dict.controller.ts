import { Request, Response } from 'express';
import { z } from 'zod';
import { STATUS } from '../../types/base';
import { dictService } from './dict.service';

const DictSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

const DictItemSchema = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  sort: z.number().int().min(0).optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

const CheckDictUniqueDTO = z.object({
  label: z.string().max(100),
  value: z.string().max(100),
  dictId: z.number().int().positive().optional(),
});

const CheckItemUniqueDTO = z.object({
  dictId: z.number().int().positive(),
  label: z.string().max(100),
  value: z.string().max(100),
  itemId: z.number().int().positive().optional(),
});

export const dictController = {
  async createDict(req: Request, res: Response) {
    const parsed = DictSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await dictService.createDict({
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  async updateDict(req: Request, res: Response) {
    const parsed = DictSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await dictService.updateDict(Number(req.params.id), {
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.json({
      message: '更新成功',
      data: null,
    });
  },

  async deleteDict(req: Request, res: Response) {
    await dictService.deleteDict(Number(req.params.id));
    res.status(204).send();
  },

  async pageDict(req: Request, res: Response) {
    const { records, total } = await dictService.pageDict({
      label: req.query.label as string,
      page: Number(req.query.page || 1),
      pageSize: Number(req.query.pageSize || 10),
    });

    res.json({
      message: '查询成功',
      data: { records, total },
    });
  },

  async listDict(req: Request, res: Response) {
    const data = await dictService.listDict();
    res.json({
      message: '查询成功',
      data,
    });
  },

  async getDictById(req: Request, res: Response) {
    const data = await dictService.getDictById(Number(req.params.id));
    if (!data) {
      return res.status(404).json({
        message: '字典不存在',
        data: null,
      });
    }

    res.json({
      message: '查询成功',
      data,
    });
  },

  async checkDictUnique(req: Request, res: Response) {
    const query = {
      dictId: req.query.dictId ? Number(req.query.dictId) : undefined,
      label: req.query.label as string,
      value: req.query.value as string,
    };

    const parsed = CheckDictUniqueDTO.safeParse(query);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        errors: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const result = await dictService.checkDictUnique(
      query.label,
      query.value,
      query.dictId,
    );

    res.json({
      message: '查询成功',
      data: result,
    });
  },

  async createItem(req: Request, res: Response) {
    const parsed = DictItemSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const data = await dictService.createItem({
      parentId: Number(req.params.dictId),
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: '创建成功',
      data,
    });
  },

  async updateItem(req: Request, res: Response) {
    const parsed = DictItemSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        data: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    await dictService.updateItem(Number(req.params.itemId), {
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.json({
      message: '更新成功',
      data: null,
    });
  },

  async deleteItem(req: Request, res: Response) {
    await dictService.deleteItem(Number(req.params.itemId));
    res.status(204).send();
  },

  async checkItemUnique(req: Request, res: Response) {
    const query = {
      dictId: Number(req.query.dictId),
      label: req.query.label as string,
      value: req.query.value as string,
      itemId: req.query.itemId ? Number(req.query.itemId) : undefined,
    };
    const parsed = CheckItemUniqueDTO.safeParse(query);
    if (!parsed.success) {
      return res.status(400).json({
        message: '参数验证失败',
        errors: parsed.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    const result = await dictService.checkItemUnique(
      query.dictId,
      query.label,
      query.value,
      query.itemId,
    );

    res.json({
      message: '查询成功',
      data: result,
    });
  },
};
