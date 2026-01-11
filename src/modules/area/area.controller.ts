import { Request, Response } from "express";
import { z } from "zod";
import { areaService } from "./area.service";

const CreateAreaPricingRuleDTO = z.object({
  name: z.string().min(1, "角色名不能为空").max(50, "角色名不能超过50个字符"),
  areaType: z.string().min(1, "区域类型不能为空"),
  roomSize: z.string().max(20, "包间大小不能超过20个字符").optional(),
  timeType: z.string().min(1, "时间类型不能为空"),
  startTimeFrom: z.string().min(1, "开始计费时间不能为空"),
  baseDurationMinutes: z.number().min(1, "基础时长必须大于0"),
  basePrice: z.number().min(0, "基础价格不能为负数"),
  overtimePricePerHour: z.number().min(0, "超时每小时价格不能为负数"),
  overtimeRounding: z.string().min(1, "超时取整方式不能为空"),
  overtimeGraceMinutes: z.number().min(0, "超时宽限分钟不能为负数").optional(),
  giftTeaAmount: z.number().min(0, "赠送茶水金额不能为负数").optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

const UpdateAreaPricingRuleDTO = z.object({
  name: z
    .string()
    .min(1, "角色名不能为空")
    .max(50, "角色名不能超过50个字符")
    .optional(),
  areaType: z.string().min(1, "区域类型不能为空").optional(),
  roomSize: z.string().max(20, "包间大小不能超过20个字符").optional(),
  timeType: z.string().min(1, "时间类型不能为空").optional(),
  startTimeFrom: z.string().min(1, "开始计费时间不能为空").optional(),
  baseDurationMinutes: z.number().min(1, "基础时长必须大于0").optional(),
  basePrice: z.number().min(0, "基础价格不能为负数").optional(),
  overtimePricePerHour: z
    .number()
    .min(0, "超时每小时价格不能为负数")
    .optional(),
  overtimeRounding: z.string().min(1, "超时取整方式不能为空").optional(),
  overtimeGraceMinutes: z.number().min(0, "超时宽限分钟不能为负数").optional(),
  giftTeaAmount: z.number().min(0, "赠送茶水金额不能为负数").optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

const CerateAreaResourceDTO = z.object({
  name: z
    .string()
    .min(1, "资源名称不能为空")
    .max(50, "资源名称不能超过50个字符"),
  areaType: z.string().min(1, "区域类型不能为空"),
  roomSize: z.string().max(20, "包间大小不能超过20个字符").optional(),
  capacity: z.number().min(0, "容量不能为负数").optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

const UpdateAreaResourceDTO = z.object({
  name: z
    .string()
    .min(1, "资源名称不能为空")
    .max(50, "资源名称不能超过50个字符")
    .optional(),
  areaType: z.string().min(1, "区域类型不能为空").optional(),
  roomSize: z.string().max(20, "包间大小不能超过20个字符").optional(),
  capacity: z.number().min(0, "容量不能为负数").optional(),
  status: z.number().min(0).max(1).optional(),
  description: z.string().max(200, "描述不能超过200个字符").optional(),
});

export const areaController = {
  /** 新增区域收费规则 */
  async createAreaPricingRule(req: Request, res: Response) {
    const parsed = CreateAreaPricingRuleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.createAreaPricingRule({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: "创建成功",
      data,
    });
  },

  /** 更新区域收费规则 */
  async updateAreaPricingRule(req: Request, res: Response) {
    const parsed = UpdateAreaPricingRuleDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.updateAreaPricingRule(
      Number(req.params.id),
      {
        ...parsed.data,
        userId: req.user?.userId,
      }
    );

    res.status(200).json({
      message: "更新成功",
      data,
    });
  },

  /** 删除区域收费规则 */
  async deleteAreaPricingRule(req: Request, res: Response) {
    await areaService.deleteAreaPricingRule(Number(req.params.id));
    res.status(204).send();
  },

  /** 区域收费规则列表 */
  async listAreaPricingRules(req: Request, res: Response) {
    const data = await areaService.listAreaPricingRules();
    res.status(200).json({
      message: "查询成功",
      data,
    });
  },

  /** 验证区域收费规则名称是否存在 */
  async isAreaPricingRuleNameExists(req: Request, res: Response) {
    const name = String(req.query.name || "");
    const areaPricingRuleId = req.query.areaPricingRuleId
      ? Number(req.query.areaPricingRuleId)
      : undefined;
    const exists = await areaService.isAreaPricingRuleNameExists(
      name,
      areaPricingRuleId
    );
    res.status(200).json({
      message: "查询成功",
      data: { exists },
    });
  },

  /** 新增区域资源 */
  async createAreaResource(req: Request, res: Response) {
    const parsed = CerateAreaResourceDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.createAreaResource({
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(201).json({
      message: "创建成功",
      data,
    });
  },

  /** 更新区域资源 */
  async updateAreaResource(req: Request, res: Response) {
    const parsed = UpdateAreaResourceDTO.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "参数验证失败",
        data: parsed.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await areaService.updateAreaResource(Number(req.params.id), {
      ...parsed.data,
      userId: req.user?.userId,
    });

    res.status(200).json({
      message: "更新成功",
      data,
    });
  },

  /** 删除区域资源 */
  async deleteAreaResource(req: Request, res: Response) {
    await areaService.deleteAreaResource(Number(req.params.id));
    res.status(204).send();
  },

  /** 区域资源列表 */
  async listAreaResources(req: Request, res: Response) {
    const data = await areaService.listAreaResources();
    res.status(200).json({
      message: "查询成功",
      data,
    });
  },

  /** 验证区域资源名称是否存在 */
  async isAreaResourceNameExists(req: Request, res: Response) {
    const name = String(req.query.name || "");
    const areaResourceId = req.query.areaResourceId
      ? Number(req.query.areaResourceId)
      : undefined;
    const exists = await areaService.isAreaResourceNameExists(
      name,
      areaResourceId
    );
    res.status(200).json({
      message: "查询成功",
      data: { exists },
    });
  },
};
