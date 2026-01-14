import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  isNull,
  like,
  ne,
} from "drizzle-orm";
import { db } from "../../db";
import { STATUS } from "../../types/base";
import { dict } from "../dict/dict.schema";
import {
  CreateDictDTO,
  PageQueryDTO,
  UpdateDictData,
  UpdateDictDTO,
} from "./types";

export const dictService = {
  /** 新增字典 */
  async create(data: CreateDictDTO) {
    const result = await db
      .insert(dict)
      .values({
        label: data.label,
        value: data.value,
        parentId: data.parentId,
        sort: data.sort,
        description: data.description,
        status: data.status ?? STATUS.ENABLE,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新字典 */
  async update(id: number, data: UpdateDictDTO) {
    const updateData: UpdateDictData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.label !== undefined) {
      updateData.label = data.label;
    }
    if (data.value !== undefined) {
      updateData.value = data.value;
    }
    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId;
    }
    if (data.sort !== undefined) {
      updateData.sort = data.sort;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(dict)
      .set(updateData)
      .where(eq(dict.id, id))
      .returning();

    return result[0];
  },

  /** 删除字典 */
  async delete(id: number) {
    return db.delete(dict).where(eq(dict.id, id));
  },

  /** 字典列表 */
  async list() {
    const parents = await db
      .select({
        id: dict.id,
        label: dict.label,
        value: dict.value,
        parentId: dict.parentId,
        sort: dict.sort,
        status: dict.status,
        description: dict.description,
        createdAt: dict.createdAt,
        updatedAt: dict.updatedAt,
      })
      .from(dict)
      .where(isNull(dict.parentId))
      .orderBy(desc(dict.createdAt));

    if (!parents.length) {
      return [];
    }

    const parentIds = parents.map((p) => p.id);

    const children = await db
      .select({
        id: dict.id,
        label: dict.label,
        value: dict.value,
        parentId: dict.parentId,
        sort: dict.sort,
        status: dict.status,
        description: dict.description,
        createdAt: dict.createdAt,
        updatedAt: dict.updatedAt,
      })
      .from(dict)
      .where(inArray(dict.parentId, parentIds))
      .orderBy(asc(dict.sort), asc(dict.id));

    const childrenMap = new Map<number, any[]>();

    for (const child of children) {
      if (!childrenMap.has(child.parentId!)) {
        childrenMap.set(child.parentId!, []);
      }
      childrenMap.get(child.parentId!)!.push(child);
    }

    return parents.map((parent) => ({
      ...parent,
      children: childrenMap.get(parent.id) ?? [],
    }));
  },

  /** 字典分页 */
  async page(data: PageQueryDTO) {
    const conditions = [isNull(dict.parentId)];
    if (data.label) {
      conditions.push(like(dict.label, `%${data.label}%`));
    }
    const whereClause = and(...conditions);

    const [{ total }] = await db
      .select({ total: count() })
      .from(dict)
      .where(whereClause);

    const parents = await db
      .select({
        id: dict.id,
        label: dict.label,
        value: dict.value,
        parentId: dict.parentId,
        sort: dict.sort,
        status: dict.status,
        description: dict.description,
        createdBy: dict.createdBy,
        createdAt: dict.createdAt,
        updatedBy: dict.updatedBy,
        updatedAt: dict.updatedAt,
      })
      .from(dict)
      .where(whereClause)
      .orderBy(desc(dict.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    const parentIds = parents.map((p) => p.id);
    const children = parentIds.length
      ? await db
          .select({
            id: dict.id,
            label: dict.label,
            value: dict.value,
            parentId: dict.parentId,
            sort: dict.sort,
            status: dict.status,
            description: dict.description,
            createdBy: dict.createdBy,
            createdAt: dict.createdAt,
            updatedBy: dict.updatedBy,
            updatedAt: dict.updatedAt,
          })
          .from(dict)
          .where(inArray(dict.parentId, parentIds))
          .orderBy(asc(dict.sort), asc(dict.id))
      : [];

    const childrenMap = new Map<number, any[]>();

    for (const child of children) {
      if (!childrenMap.has(child.parentId!)) {
        childrenMap.set(child.parentId!, []);
      }
      childrenMap.get(child.parentId!)!.push(child);
    }

    const records = parents.map((parent) => ({
      ...parent,
      children: childrenMap.get(parent.id) ?? [],
    }));

    return { records, total };
  },

  /** 检查字典名是否存在 */
  async isDictLabelExists(label: string, dictId?: number) {
    const conditions = [eq(dict.label, label), isNull(dict.parentId)];

    if (dictId !== undefined) {
      conditions.push(ne(dict.id, dictId));
    }

    const [{ count: total }] = await db
      .select({ count: count() })
      .from(dict)
      .where(and(...conditions));

    return total > 0;
  },

  /** 根据字典ID获取字典 */
  async getDictById(id: number) {
    const result = await db.select().from(dict).where(eq(dict.id, id)).limit(1);
    return result[0] || null;
  },
};
