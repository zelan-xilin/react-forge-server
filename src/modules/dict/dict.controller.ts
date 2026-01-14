import { Request, Response } from "express";
import { z } from "zod";
import { STATUS } from "../../types/base";
import { dictService } from "./dict.service";

const CreateDictDTO = z.object({
  label: z.string().min(1).max(100),
  value: z.string().min(1).max(100),
  parentId: z.number().int().positive().nullable().optional(),
  sort: z.number().int().min(0).optional(),
  status: z.number().int().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

const UpdateDictDTO = z.object({
  label: z.string().min(1).max(100).optional(),
  value: z.string().min(1).max(100).optional(),
  parentId: z.number().int().positive().nullable().optional(),
  sort: z.number().int().min(0).optional(),
  status: z.number().int().min(0).max(1).optional(),
  description: z.string().max(200).nullable().optional(),
});

export const dictController = {
  /** 新增字典 */
  async create(req: Request, res: Response) {
    const parsed = CreateDictDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await dictService.create({
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: "创建成功",
      data,
    });
  },

  /** 更新字典 */
  async update(req: Request, res: Response) {
    const parsed = UpdateDictDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await dictService.update(Number(req.params.id), {
      ...parsed.data,
      status: parsed.data.status as STATUS | undefined,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: "更新成功",
      data,
    });
  },

  /** 删除字典 */
  async delete(req: Request, res: Response) {
    await dictService.delete(Number(req.params.id));
    res.status(204).send();
  },

  /** 字典列表 */
  async list(req: Request, res: Response) {
    const data = await dictService.list();
    res.status(200).json({
      message: "查询成功",
      data,
    });
  },

  /** 字典分页 */
  async page(req: Request, res: Response) {
    const query = {
      label: req.query.label as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    };

    const { records, total } = await dictService.page(query);
    res.status(200).json({
      message: "查询成功",
      data: { records, total },
    });
  },

  /** 检查字典名是否存在 */
  async isDictLabelExists(req: Request, res: Response) {
    const label = req.query.label as string;
    const dictId = req.query.dictId ? Number(req.query.dictId) : undefined;
    const exists = await dictService.isDictLabelExists(label, dictId);
    res.status(200).json({
      message: "查询成功",
      data: { exists },
    });
  },

  /** 根据字典ID获取字典 */
  async getDictById(req: Request, res: Response) {
    const data = await dictService.getDictById(Number(req.params.id));

    res.status(200).json({
      message: "查询成功",
      data,
    });
  },
};
