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
  or,
} from 'drizzle-orm';
import { db } from '../../db';
import { STATUS } from '../../types/base';
import { dict } from './dict.schema';
import { DictDTO, DictItemDTO, DictPageQueryDTO } from './types';

function buildChildrenMap(children: DictItemDTO[]) {
  const map = new Map<number, DictItemDTO[]>();

  for (const child of children) {
    if (!map.has(child.parentId)) {
      map.set(child.parentId, []);
    }
    map.get(child.parentId)!.push(child);
  }

  return map;
}

async function resolveSortForParent(parentId: number | null, sort?: number) {
  if (sort !== 0) {
    return sort;
  }

  const whereClause =
    parentId === null ? isNull(dict.parentId) : eq(dict.parentId, parentId);
  const rows = await db
    .select({ sort: dict.sort })
    .from(dict)
    .where(whereClause)
    .orderBy(desc(dict.sort))
    .limit(1);
  const maxSort = rows.length ? (rows[0].sort ?? 0) : 0;
  return maxSort + 1;
}

export const dictService = {
  async createDict(data: DictDTO & { userId?: number }) {
    const existing = await db
      .select()
      .from(dict)
      .where(
        and(
          isNull(dict.parentId),
          or(eq(dict.label, data.label), eq(dict.value, data.value)),
        ),
      )
      .limit(1);

    if (existing.length) {
      return existing;
    }

    return db
      .insert(dict)
      .values({
        label: data.label,
        value: data.value,
        parentId: null,
        status: data.status ?? STATUS.ENABLE,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();
  },

  async updateDict(id: number, data: Partial<DictDTO> & { userId?: number }) {
    await db
      .update(dict)
      .set({
        label: data.label,
        value: data.value,
        status: data.status,
        description: data.description,
        updatedBy: data.userId,
        updatedAt: new Date(),
      })
      .where(eq(dict.id, id));
  },

  async deleteDict(id: number) {
    await db.delete(dict).where(eq(dict.id, id));
    await db.delete(dict).where(eq(dict.parentId, id));
  },

  async pageDict(data: DictPageQueryDTO) {
    const conditions = [isNull(dict.parentId)];

    if (data.label) {
      conditions.push(like(dict.label, `%${data.label}%`));
    }

    const where = and(...conditions);

    const [{ total }] = await db
      .select({ total: count() })
      .from(dict)
      .where(where);

    const parents = await db
      .select()
      .from(dict)
      .where(where)
      .orderBy(desc(dict.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    if (!parents.length) {
      return { records: [], total };
    }

    const parentIds = parents.map(p => p.id);

    const children = await db
      .select()
      .from(dict)
      .where(inArray(dict.parentId, parentIds))
      .orderBy(asc(dict.sort), asc(dict.id));

    const childrenMap = buildChildrenMap(children as DictItemDTO[]);

    const records = parents.map(p => ({
      ...p,
      children: childrenMap.get(p.id) ?? [],
    }));

    return { records, total };
  },
  async listDict() {
    const parents = await db
      .select()
      .from(dict)
      .where(isNull(dict.parentId))
      .orderBy(desc(dict.createdAt));

    if (!parents.length) {
      return [];
    }

    const parentIds = parents.map(p => p.id);

    const children = await db
      .select()
      .from(dict)
      .where(inArray(dict.parentId, parentIds))
      .orderBy(asc(dict.sort));

    const childrenMap = buildChildrenMap(children as DictItemDTO[]);

    return parents.map(p => ({
      ...p,
      children: childrenMap.get(p.id) ?? [],
    }));
  },

  async getDictById(id: number) {
    const parent = await db
      .select()
      .from(dict)
      .where(and(eq(dict.id, id), isNull(dict.parentId)))
      .limit(1);

    if (!parent.length) {
      return null;
    }

    const children = await db
      .select()
      .from(dict)
      .where(eq(dict.parentId, id))
      .orderBy(asc(dict.sort));

    return {
      ...parent[0],
      children,
    };
  },
  async checkDictUnique(label: string, value: string, dictId?: number) {
    const conditions = [
      isNull(dict.parentId),
      or(eq(dict.label, label), eq(dict.value, value)),
    ];

    if (dictId) {
      conditions.push(ne(dict.id, dictId));
    }

    const rows = await db
      .select({
        label: dict.label,
        value: dict.value,
      })
      .from(dict)
      .where(and(...conditions));

    return {
      labelExists: rows.some(r => r.label === label),
      valueExists: rows.some(r => r.value === value),
    };
  },

  async createItem(data: DictItemDTO & { userId?: number }) {
    const sort = await resolveSortForParent(data.parentId ?? null, data.sort);

    return db
      .insert(dict)
      .values({
        parentId: data.parentId,
        label: data.label,
        value: data.value,
        sort: sort,
        status: data.status ?? STATUS.ENABLE,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();
  },

  async updateItem(
    id: number,
    data: Partial<DictItemDTO> & { userId?: number },
  ) {
    let newSort = data.sort;
    if (newSort === 0) {
      let parentId: number | null | undefined = data.parentId;
      if (parentId === undefined) {
        const existing = await db
          .select({ parentId: dict.parentId })
          .from(dict)
          .where(eq(dict.id, id))
          .limit(1);
        parentId = existing.length ? existing[0].parentId : null;
      }
      newSort = await resolveSortForParent(parentId ?? null, 0);
    }

    await db
      .update(dict)
      .set({
        label: data.label,
        value: data.value,
        sort: newSort,
        status: data.status,
        description: data.description,
        updatedBy: data.userId,
        updatedAt: new Date(),
      })
      .where(eq(dict.id, id));
  },

  async deleteItem(id: number) {
    await db.delete(dict).where(eq(dict.id, id));
  },

  async checkItemUnique(
    dictId: number,
    label: string,
    value: string,
    itemId?: number,
  ) {
    const conditions = [
      eq(dict.parentId, dictId),
      or(eq(dict.label, label), eq(dict.value, value)),
    ];

    if (itemId) {
      conditions.push(ne(dict.id, itemId));
    }

    const rows = await db
      .select({
        label: dict.label,
        value: dict.value,
      })
      .from(dict)
      .where(and(...conditions));

    return {
      labelExists: rows.some(r => r.label === label),
      valueExists: rows.some(r => r.value === value),
    };
  },
};
