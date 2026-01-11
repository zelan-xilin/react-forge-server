import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { permissionGuard } from "../../middleware/permission.guard";
import { areaController } from "./area.controller";

export const areaRoutes = Router();

areaRoutes.use(authGuard);

/** 新增区域收费规则 */
areaRoutes.post(
  "/rule",
  permissionGuard("area-pricing-rule:create"),
  areaController.createAreaPricingRule
);

/** 更新区域收费规则 */
areaRoutes.put(
  "/rule/:id",
  permissionGuard("area-pricing-rule:update"),
  areaController.updateAreaPricingRule
);

/** 删除区域收费规则 */
areaRoutes.delete(
  "/rule/:id",
  permissionGuard("area-pricing-rule:delete"),
  areaController.deleteAreaPricingRule
);

/** 区域收费规则列表 */
areaRoutes.get(
  "/rule/list",
  permissionGuard("area-pricing-rule:read"),
  areaController.listAreaPricingRules
);

/** 验证区域收费规则名称是否存在 */
areaRoutes.get(
  "/rule/exists",
  permissionGuard("area-pricing-rule:read"),
  areaController.isAreaPricingRuleNameExists
);

/** 新增区域资源 */
areaRoutes.post(
  "/resource",
  permissionGuard("area-resource:create"),
  areaController.createAreaResource
);

/** 更新区域资源 */
areaRoutes.put(
  "/resource/:id",
  permissionGuard("area-resource:update"),
  areaController.updateAreaResource
);

/** 删除区域资源 */
areaRoutes.delete(
  "/resource/:id",
  permissionGuard("area-resource:delete"),
  areaController.deleteAreaResource
);

/** 区域资源列表 */
areaRoutes.get(
  "/resource/list",
  permissionGuard("area-resource:read"),
  areaController.listAreaResources
);

/** 验证区域资源名称是否存在 */
areaRoutes.get(
  "/resource/exists",
  permissionGuard("area-resource:read"),
  areaController.isAreaResourceNameExists
);
