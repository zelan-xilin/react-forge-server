import { and, count, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../../db';
import { user } from '../user/user.schema';
import { areaPricing } from './pricing-area.schema';
import {
  AreaPricingPageQueryDTO,
  CreateAreaPricingDTO,
  UpdateAreaPricingData,
  UpdateAreaPricingDTO,
} from './types';

export const areaPricingService = {
  /**
   * area
   */
  /** 新增区域定价 */
  async create(data: CreateAreaPricingDTO) {
    const result = await db
      .insert(areaPricing)
      .values({
        areaType: data.areaType,
        roomSize: data.roomSize,
        ruleApplicationType: data.ruleApplicationType,
        applyTimeStart: data.applyTimeStart,
        usageDurationHours: data.usageDurationHours,
        basePrice: data.basePrice,
        overtimeHourPrice: data.overtimeHourPrice,
        overtimeRoundType: data.overtimeRoundType,
        overtimeGraceMinutes: data.overtimeGraceMinutes,
        giftTeaAmount: data.giftTeaAmount,
        status: data.status,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新区域定价 */
  async update(id: number, data: UpdateAreaPricingDTO) {
    const updateData: UpdateAreaPricingData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.areaType !== undefined) {
      updateData.areaType = data.areaType;
    }
    if (data.roomSize !== undefined) {
      updateData.roomSize = data.roomSize;
    }
    if (data.ruleApplicationType !== undefined) {
      updateData.ruleApplicationType = data.ruleApplicationType;
    }
    if (data.applyTimeStart !== undefined) {
      updateData.applyTimeStart = data.applyTimeStart;
    }
    if (data.usageDurationHours !== undefined) {
      updateData.usageDurationHours = data.usageDurationHours;
    }
    if (data.basePrice !== undefined) {
      updateData.basePrice = data.basePrice;
    }
    if (data.overtimeHourPrice !== undefined) {
      updateData.overtimeHourPrice = data.overtimeHourPrice;
    }
    if (data.overtimeRoundType !== undefined) {
      updateData.overtimeRoundType = data.overtimeRoundType;
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
      .update(areaPricing)
      .set(updateData)
      .where(eq(areaPricing.id, id))
      .returning();

    return result[0];
  },

  /** 删除区域定价 */
  async delete(id: number) {
    return db.delete(areaPricing).where(eq(areaPricing.id, id));
  },

  /** 分页查询区域定价 */
  async page(query: AreaPricingPageQueryDTO) {
    const conditions = [];
    if (query.areaType) {
      conditions.push(eq(areaPricing.areaType, query.areaType));
    }
    if (query.roomSize) {
      conditions.push(eq(areaPricing.roomSize, query.roomSize));
    }

    const totalResult = await db
      .select({ count: count() })
      .from(areaPricing)
      .where(and(...conditions));
    const total = totalResult[0].count;

    const records = await db
      .select()
      .from(areaPricing)
      .where(and(...conditions))
      .orderBy(desc(areaPricing.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    return {
      total,
      records,
    };
  },

  /** 区域定价列表（带创建者、更新者） */
  list() {
    const creatorAlias = alias(user, 'creator');
    const updaterAlias = alias(user, 'updater');
    return db
      .select({
        id: areaPricing.id,
        areaType: areaPricing.areaType,
        roomSize: areaPricing.roomSize,
        ruleApplicationType: areaPricing.ruleApplicationType,
        applyTimeStart: areaPricing.applyTimeStart,
        usageDurationHours: areaPricing.usageDurationHours,
        basePrice: areaPricing.basePrice,
        overtimeHourPrice: areaPricing.overtimeHourPrice,
        overtimeRoundType: areaPricing.overtimeRoundType,
        overtimeGraceMinutes: areaPricing.overtimeGraceMinutes,
        giftTeaAmount: areaPricing.giftTeaAmount,
        status: areaPricing.status,
        description: areaPricing.description,
        createdBy: areaPricing.createdBy,
        createdAt: areaPricing.createdAt,
        updatedBy: areaPricing.updatedBy,
        updatedAt: areaPricing.updatedAt,
        creatorName: creatorAlias.username,
        updaterName: updaterAlias.username,
      })
      .from(areaPricing)
      .leftJoin(creatorAlias, eq(areaPricing.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(areaPricing.updatedBy, updaterAlias.id))
      .orderBy(desc(areaPricing.createdAt));
  },
};
