import { and, count, desc, eq, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../../db";
import { user } from "../user/user.schema";
import { areaPricingRule, areaResource } from "./area.schema";
import {
  CreateAreaPricingRuleDTO,
  CreateAreaResourceDTO,
  UpdateAreaPricingRuleData,
  UpdateAreaPricingRuleDTO,
  UpdateAreaResourceData,
  UpdateAreaResourceDTO,
} from "./types";

export const areaService = {
  /** 新增区域收费规则 */
  async createAreaPricingRule(data: CreateAreaPricingRuleDTO) {
    const result = await db
      .insert(areaPricingRule)
      .values({
        name: data.name,
        areaType: data.areaType,
        roomSize: data.roomSize,
        timeType: data.timeType,
        startTimeFrom: data.startTimeFrom,
        baseDurationMinutes: data.baseDurationMinutes,
        basePrice: data.basePrice,
        overtimePricePerHour: data.overtimePricePerHour,
        overtimeRounding: data.overtimeRounding,
        overtimeGraceMinutes: data.overtimeGraceMinutes,
        giftTeaAmount: data.giftTeaAmount,
        status: data.status,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新区域收费规则 */
  async updateAreaPricingRule(id: number, data: UpdateAreaPricingRuleDTO) {
    const updateData: UpdateAreaPricingRuleData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.areaType !== undefined) {
      updateData.areaType = data.areaType;
    }
    if (data.roomSize !== undefined) {
      updateData.roomSize = data.roomSize;
    }
    if (data.timeType !== undefined) {
      updateData.timeType = data.timeType;
    }
    if (data.startTimeFrom !== undefined) {
      updateData.startTimeFrom = data.startTimeFrom;
    }
    if (data.baseDurationMinutes !== undefined) {
      updateData.baseDurationMinutes = data.baseDurationMinutes;
    }
    if (data.basePrice !== undefined) {
      updateData.basePrice = data.basePrice;
    }
    if (data.overtimePricePerHour !== undefined) {
      updateData.overtimePricePerHour = data.overtimePricePerHour;
    }
    if (data.overtimeRounding !== undefined) {
      updateData.overtimeRounding = data.overtimeRounding;
    }
    if (data.overtimeGraceMinutes !== undefined) {
      updateData.overtimeGraceMinutes = data.overtimeGraceMinutes;
    }
    if (data.giftTeaAmount !== undefined) {
      updateData.giftTeaAmount = data.giftTeaAmount;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(areaPricingRule)
      .set(updateData)
      .where(eq(areaPricingRule.id, id))
      .returning();

    return result[0];
  },

  /** 删除区域收费规则 */
  async deleteAreaPricingRule(id: number) {
    return db.delete(areaPricingRule).where(eq(areaPricingRule.id, id));
  },

  /** 区域收费规则列表 */
  listAreaPricingRules() {
    const creatorAlias = alias(user, "creator");
    const updaterAlias = alias(user, "updater");
    return db
      .select()
      .from(areaPricingRule)
      .leftJoin(creatorAlias, eq(areaPricingRule.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(areaPricingRule.updatedBy, updaterAlias.id))
      .orderBy(desc(areaPricingRule.createdAt));
  },

  /** 验证区域收费规则名称是否存在 */
  async isAreaPricingRuleNameExists(name: string, areaPricingRuleId?: number) {
    const conditions = [eq(areaPricingRule.name, name)];
    if (areaPricingRuleId !== undefined) {
      conditions.push(ne(areaPricingRule.id, areaPricingRuleId));
    }
    const countResult = await db
      .select({ count: count() })
      .from(areaPricingRule)
      .where(and(...conditions));
    return countResult[0].count > 0;
  },

  /** 新增区域资源 */
  async createAreaResource(data: CreateAreaResourceDTO) {
    const result = await db
      .insert(areaResource)
      .values({
        name: data.name,
        areaType: data.areaType,
        roomSize: data.roomSize,
        capacity: data.capacity,
        status: data.status,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新区域资源 */
  async updateAreaResource(id: number, data: UpdateAreaResourceDTO) {
    const updateData: UpdateAreaResourceData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.areaType !== undefined) {
      updateData.areaType = data.areaType;
    }
    if (data.roomSize !== undefined) {
      updateData.roomSize = data.roomSize;
    }
    if (data.capacity !== undefined) {
      updateData.capacity = data.capacity;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(areaResource)
      .set(updateData)
      .where(eq(areaResource.id, id))
      .returning();

    return result[0];
  },

  /** 删除区域资源 */
  async deleteAreaResource(id: number) {
    return db.delete(areaResource).where(eq(areaResource.id, id));
  },

  /** 区域资源列表 */
  listAreaResources() {
    const creatorAlias = alias(user, "creator");
    const updaterAlias = alias(user, "updater");
    return db
      .select()
      .from(areaResource)
      .leftJoin(creatorAlias, eq(areaResource.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(areaResource.updatedBy, updaterAlias.id))
      .orderBy(desc(areaResource.createdAt));
  },

  /** 验证区域资源名称是否存在 */
  async isAreaResourceNameExists(name: string, areaResourceId?: number) {
    const conditions = [eq(areaResource.name, name)];
    if (areaResourceId !== undefined) {
      conditions.push(ne(areaResource.id, areaResourceId));
    }
    const countResult = await db
      .select({ count: count() })
      .from(areaResource)
      .where(and(...conditions));
    return countResult[0].count > 0;
  },
};
