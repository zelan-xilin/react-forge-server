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
  CreateDictWithChildrenDTO,
  PageQueryDTO,
  UpdateDictWithChildrenDTO,
} from "./types";

export const dictService = {
  /** 新增字典 */
  async createWithChildren(data: CreateDictWithChildrenDTO) {
    return db.transaction(async (tx) => {
      const [parent] = await tx
        .insert(dict)
        .values({
          label: data.label,
          value: data.value,
          parentId: null,
          sort: data.sort,
          status: data.status ?? STATUS.ENABLE,
          description: data.description,
          createdBy: data.userId,
        })
        .returning();

      if (data.children?.length) {
        await tx.insert(dict).values(
          data.children.map((item) => ({
            label: item.label,
            value: item.value,
            parentId: parent.id,
            sort: item.sort,
            status: item.status ?? STATUS.ENABLE,
            description: item.description,
            createdBy: data.userId,
          }))
        );
      }

      return parent;
    });
  },

  /** 更新字典 */
  async updateWithChildren(id: number, data: UpdateDictWithChildrenDTO) {
    return db.transaction(async (tx) => {
      await tx
        .update(dict)
        .set({
          label: data.label,
          value: data.value,
          sort: data.sort,
          status: data.status,
          description: data.description,
          updatedBy: data.userId,
          updatedAt: new Date(),
        })
        .where(eq(dict.id, id));

      if (!data.children) {
        return;
      }

      const existing = await tx
        .select()
        .from(dict)
        .where(eq(dict.parentId, id));

      const incomingIds = new Set<number>();

      for (const item of data.children) {
        if (item.id) {
          incomingIds.add(item.id);
          await tx
            .update(dict)
            .set({
              label: item.label,
              value: item.value,
              sort: item.sort,
              status: item.status,
              description: item.description,
              updatedBy: data.userId,
              updatedAt: new Date(),
            })
            .where(eq(dict.id, item.id));
        } else {
          await tx.insert(dict).values({
            label: item.label,
            value: item.value,
            parentId: id,
            sort: item.sort,
            status: item.status ?? STATUS.ENABLE,
            description: item.description,
            createdBy: data.userId,
          });
        }
      }

      const toDelete = existing
        .filter((i) => !incomingIds.has(i.id))
        .map((i) => i.id);

      if (toDelete.length) {
        await tx.delete(dict).where(inArray(dict.id, toDelete));
      }
    });
  },

  /** 删除字典 */
  async delete(id: number) {
    return db.transaction(async (tx) => {
      const dictToDelete = await tx
        .select({ id: dict.id, parentId: dict.parentId })
        .from(dict)
        .where(eq(dict.id, id))
        .limit(1);

      if (!dictToDelete.length) {
        return 0;
      }

      const item = dictToDelete[0];

      if (item.parentId === null) {
        await tx.delete(dict).where(
          inArray(dict.id, [
            id,
            ...(await tx
              .select({ id: dict.id })
              .from(dict)
              .where(eq(dict.parentId, id))
              .then((res) => res.map((r) => r.id))),
          ])
        );
      } else {
        await tx.delete(dict).where(eq(dict.id, id));
      }
    });
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
