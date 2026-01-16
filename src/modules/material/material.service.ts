import { and, count, desc, eq, like, ne } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../../db';
import { user } from '../user/user.schema';
import { material } from './material.schema';
import {
  CreateMaterialDTO,
  PageQueryDTO,
  UpdateMaterialData,
  UpdateMaterialDTO,
} from './types';

export const materialService = {
  /** 新增材料 */
  async create(data: CreateMaterialDTO) {
    const result = await db
      .insert(material)
      .values({
        name: data.name,
        recipeUnit: data.recipeUnit,
        status: data.status,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新材料 */
  async update(id: number, data: UpdateMaterialDTO) {
    const updateData: UpdateMaterialData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.recipeUnit !== undefined) {
      updateData.recipeUnit = data.recipeUnit;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(material)
      .set(updateData)
      .where(eq(material.id, id))
      .returning();

    return result[0];
  },

  /** 删除材料 */
  async delete(id: number) {
    return db.delete(material).where(eq(material.id, id));
  },

  /** 分页查询材料 */
  async page(query: PageQueryDTO) {
    const conditions = [];
    if (query.name) {
      conditions.push(like(material.name, `%${query.name}%`));
    }

    const totalResult = await db
      .select({ count: count() })
      .from(material)
      .where(and(...conditions));
    const total = totalResult[0].count;

    const records = await db
      .select()
      .from(material)
      .where(and(...conditions))
      .orderBy(desc(material.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    return {
      total,
      records,
    };
  },

  /** 材料列表 */
  list() {
    const creatorAlias = alias(user, 'creator');
    const updaterAlias = alias(user, 'updater');
    return db
      .select({
        id: material.id,
        name: material.name,
        recipeUnit: material.recipeUnit,
        status: material.status,
        description: material.description,
        createdBy: material.createdBy,
        createdAt: material.createdAt,
        updatedBy: material.updatedBy,
        updatedAt: material.updatedAt,
        creatorName: creatorAlias.username,
        updaterName: updaterAlias.username,
      })
      .from(material)
      .leftJoin(creatorAlias, eq(material.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(material.updatedBy, updaterAlias.id))
      .orderBy(desc(material.createdAt));
  },

  /** 验证材料名称是否存在 */
  async isMaterialNameExists(name: string, materialId?: number) {
    const conditions = [eq(material.name, name)];
    if (materialId !== undefined) {
      conditions.push(ne(material.id, materialId));
    }
    const countResult = await db
      .select({ count: count() })
      .from(material)
      .where(and(...conditions));
    return countResult[0].count > 0;
  },
};
