import { and, count, desc, eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/sqlite-core';
import { db } from '../../db';
import { recipe } from '../recipe/recipe.schema';
import { user } from '../user/user.schema';
import { productPricing } from './pricing-product.schema';
import {
  CreateProductPricingDTO,
  ProductPricingPageQueryDTO,
  UpdateProductPricingData,
  UpdateProductPricingDTO,
} from './types';

export const productPricingService = {
  /** 新增商品定价 */
  async create(data: CreateProductPricingDTO) {
    const result = await db
      .insert(productPricing)
      .values({
        productId: data.productId,
        price: data.price,
        status: data.status,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新商品定价 */
  async update(id: number, data: UpdateProductPricingDTO) {
    const updateData: UpdateProductPricingData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.productId !== undefined) {
      updateData.productId = data.productId;
    }
    if (data.price !== undefined) {
      updateData.price = data.price;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(productPricing)
      .set(updateData)
      .where(eq(productPricing.id, id))
      .returning();

    return result[0];
  },

  /** 删除商品定价 */
  async delete(id: number) {
    return db.delete(productPricing).where(eq(productPricing.id, id));
  },

  /** 分页查询商品定价 */
  async page(query: ProductPricingPageQueryDTO) {
    const conditions = [];
    if (query.productId !== undefined) {
      conditions.push(eq(productPricing.productId, query.productId));
    }

    const totalResult = await db
      .select({ count: count() })
      .from(productPricing)
      .where(and(...conditions));
    const total = totalResult[0].count;

    const creatorAlias = alias(user, 'creator');
    const updaterAlias = alias(user, 'updater');
    const productAlias = alias(recipe, 'product');
    const records = await db
      .select({
        id: productPricing.id,
        productId: productPricing.productId,
        productName: productAlias.name,
        price: productPricing.price,
        status: productPricing.status,
        description: productPricing.description,
        createdBy: productPricing.createdBy,
        createdAt: productPricing.createdAt,
        updatedBy: productPricing.updatedBy,
        updatedAt: productPricing.updatedAt,
        creatorName: creatorAlias.username,
        updaterName: updaterAlias.username,
      })
      .from(productPricing)
      .leftJoin(creatorAlias, eq(productPricing.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(productPricing.updatedBy, updaterAlias.id))
      .leftJoin(productAlias, eq(productPricing.productId, productAlias.id))
      .where(and(...conditions))
      .orderBy(desc(productPricing.createdAt))
      .limit(query.pageSize)
      .offset((query.page - 1) * query.pageSize);

    return {
      total,
      records,
    };
  },

  /** 商品定价列表（带创建者、更新者） */
  list() {
    const creatorAlias = alias(user, 'creator');
    const updaterAlias = alias(user, 'updater');
    const productAlias = alias(recipe, 'product');
    return db
      .select({
        id: productPricing.id,
        productId: productPricing.productId,
        productName: productAlias.name,
        price: productPricing.price,
        status: productPricing.status,
        description: productPricing.description,
        createdBy: productPricing.createdBy,
        createdAt: productPricing.createdAt,
        updatedBy: productPricing.updatedBy,
        updatedAt: productPricing.updatedAt,
        creatorName: creatorAlias.username,
        updaterName: updaterAlias.username,
      })
      .from(productPricing)
      .leftJoin(creatorAlias, eq(productPricing.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(productPricing.updatedBy, updaterAlias.id))
      .leftJoin(productAlias, eq(productPricing.productId, productAlias.id))
      .orderBy(desc(productPricing.createdAt));
  },
};
