import { and, count, desc, eq, inArray, like, ne } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../../db';
import { material } from '../material/material.schema';
import { user } from '../user/user.schema';
import { recipe, recipeItem } from './recipe.schema';
import {
  CreateRecipeDTO,
  RecipeItemVO,
  RecipePageQueryDTO,
  RecipeVO,
  UpdateRecipeDTO,
  UpdateRecipeData,
} from './types';

export const recipeService = {
  /** 新增配方 */
  create(data: CreateRecipeDTO) {
    return db.transaction(tx => {
      const recipeRecord = tx
        .insert(recipe)
        .values({
          name: data.name,
          status: data.status ?? 1,
          description: data.description,
          createdBy: data.userId,
        })
        .returning()
        .get();

      if (data.children.length > 0) {
        tx.insert(recipeItem)
          .values(
            data.children.map(item => ({
              recipeId: recipeRecord.id,
              materialId: item.materialId,
              amount: item.amount,
              createdBy: data.userId,
            })),
          )
          .run();
      }

      return recipeRecord;
    });
  },
  /** 更新配方（全量替换） */
  update(id: number, data: UpdateRecipeDTO) {
    return db.transaction(tx => {
      const updateData: UpdateRecipeData = {
        name: data.name,
        status: data.status,
        description: data.description,
        updatedBy: data.userId,
        updatedAt: new Date(),
      };

      const recipeRecord = tx
        .update(recipe)
        .set(updateData)
        .where(eq(recipe.id, id))
        .returning()
        .get();

      // 全量替换明细
      tx.delete(recipeItem).where(eq(recipeItem.recipeId, id)).run();

      if (data.children.length > 0) {
        tx.insert(recipeItem)
          .values(
            data.children.map(item => ({
              recipeId: id,
              materialId: item.materialId,
              amount: item.amount,
              createdBy: data.userId,
            })),
          )
          .run();
      }

      return recipeRecord;
    });
  },
  /** 删除配方 */
  delete(id: number) {
    return db.transaction(tx => {
      tx.delete(recipeItem).where(eq(recipeItem.recipeId, id)).run();
      tx.delete(recipe).where(eq(recipe.id, id)).run();
    });
  },
  /** 分页查询配方（包含 children） */
  async page(query: RecipePageQueryDTO) {
    const conditions = [];
    if (query.name) {
      conditions.push(like(recipe.name, `%${query.name}%`));
    }

    const totalResult = await db
      .select({ count: count() })
      .from(recipe)
      .where(and(...conditions));

    const total = totalResult[0].count;

    const records = await db
      .select()
      .from(recipe)
      .where(and(...conditions))
      .orderBy(desc(recipe.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    const recipeIds = records.map(r => r.id);

    let children: RecipeItemVO[] = [];

    if (recipeIds.length > 0) {
      children = await db
        .select({
          recipeId: recipeItem.recipeId,
          materialId: recipeItem.materialId,
          materialName: material.name,
          amount: recipeItem.amount,
          recipeUnit: material.recipeUnit,
        })
        .from(recipeItem)
        .leftJoin(material, eq(recipeItem.materialId, material.id))
        .where(
          recipeIds.length === 1
            ? eq(recipeItem.recipeId, recipeIds[0])
            : inArray(recipeItem.recipeId, recipeIds),
        );
    }

    const itemMap = new Map<number, RecipeItemVO[]>();

    for (const item of children) {
      const list = itemMap.get(item.recipeId) ?? [];
      list.push(item);
      itemMap.set(item.recipeId, list);
    }

    const resultRecords: RecipeVO[] = records.map(r => ({
      ...r,
      children: itemMap.get(r.id) ?? [],
    }));

    return {
      total,
      records: resultRecords,
    };
  },

  /** 配方列表（包含 children） */
  async list() {
    const creatorAlias = alias(user, 'creator');
    const updaterAlias = alias(user, 'updater');

    const recipes = await db
      .select({
        id: recipe.id,
        name: recipe.name,
        status: recipe.status,
        description: recipe.description,
        createdBy: recipe.createdBy,
        createdAt: recipe.createdAt,
        updatedBy: recipe.updatedBy,
        updatedAt: recipe.updatedAt,
        creatorName: creatorAlias.username,
        updaterName: updaterAlias.username,
      })
      .from(recipe)
      .leftJoin(creatorAlias, eq(recipe.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(recipe.updatedBy, updaterAlias.id))
      .orderBy(desc(recipe.createdAt));

    const recipeIds = recipes.map(r => r.id);

    let children: RecipeItemVO[] = [];

    if (recipeIds.length > 0) {
      children = await db
        .select({
          recipeId: recipeItem.recipeId,
          materialId: recipeItem.materialId,
          materialName: material.name,
          amount: recipeItem.amount,
          recipeUnit: material.recipeUnit,
        })
        .from(recipeItem)
        .leftJoin(material, eq(recipeItem.materialId, material.id))
        .where(
          recipeIds.length === 1
            ? eq(recipeItem.recipeId, recipeIds[0])
            : inArray(recipeItem.recipeId, recipeIds),
        );
    }

    const itemMap = new Map<number, RecipeItemVO[]>();

    for (const item of children) {
      const list = itemMap.get(item.recipeId) ?? [];
      list.push(item);
      itemMap.set(item.recipeId, list);
    }

    const result: RecipeVO[] = recipes.map(r => ({
      ...r,
      children: itemMap.get(r.id) ?? [],
    }));

    return result;
  },

  /** 验证配方名称是否存在 */
  async isRecipeNameExists(name: string, recipeId?: number) {
    const conditions = [eq(recipe.name, name)];
    if (recipeId !== undefined) {
      conditions.push(ne(recipe.id, recipeId));
    }

    const countResult = await db
      .select({ count: count() })
      .from(recipe)
      .where(and(...conditions));

    return countResult[0].count > 0;
  },
};
