import { and, count, desc, eq, like, ne, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../../db";
import { user } from "../user/user.schema";
import { role, roleActionPermission, rolePathPermission } from "./role.schema";
import {
  CreateRoleDTO,
  PageQueryDTO,
  UpdateRoleData,
  UpdateRoleDTO,
} from "./types";

export const roleService = {
  /** 新增角色 */
  async create(data: CreateRoleDTO) {
    const result = await db
      .insert(role)
      .values({
        name: data.name,
        description: data.description,
        createdBy: data.userId,
      })
      .returning();

    return result[0];
  },

  /** 更新角色 */
  async update(id: number, data: UpdateRoleDTO) {
    const updateData: UpdateRoleData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }

    const result = await db
      .update(role)
      .set(updateData)
      .where(eq(role.id, id))
      .returning();

    return result[0];
  },

  /** 删除角色 */
  async delete(id: number) {
    await db
      .delete(rolePathPermission)
      .where(eq(rolePathPermission.roleId, id));
    await db
      .delete(roleActionPermission)
      .where(eq(roleActionPermission.roleId, id));

    return db.delete(role).where(eq(role.id, id));
  },

  /** 角色列表 */
  list() {
    return db.select().from(role).orderBy(desc(role.createdAt));
  },

  /** 角色分页 */
  async page(data: PageQueryDTO) {
    const conditions = [];

    if (data.name) {
      conditions.push(like(role.name, `%${data.name}%`));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [{ total }] = await db
      .select({ total: count() })
      .from(role)
      .where(whereClause);

    const creatorAlias = alias(user, "creator");
    const updaterAlias = alias(user, "updater");
    const records = await db
      .select({
        id: role.id,
        name: role.name,
        description: role.description,
        createdBy: role.createdBy,
        createdByName: creatorAlias.username,
        createdAt: role.createdAt,
        updatedBy: role.updatedBy,
        updatedByName: updaterAlias.username,
        updatedAt: role.updatedAt,
      })
      .from(role)
      .leftJoin(creatorAlias, eq(role.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(role.updatedBy, updaterAlias.id))
      .where(whereClause)
      .orderBy(desc(role.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    return { records, total };
  },

  /** 验证角色名称是否存在 */
  async isRoleNameExists(name: string, roleId?: number) {
    const conditions = [eq(role.name, name)];
    if (roleId !== undefined) {
      conditions.push(ne(role.id, roleId));
    }
    const countResult = await db
      .select({ count: count() })
      .from(role)
      .where(and(...conditions));
    return countResult[0].count > 0;
  },

  /** 根据角色ID获取角色 */
  async getRoleByRoleId(id: number) {
    const result = await db.select().from(role).where(eq(role.id, id)).limit(1);
    return result[0] || null;
  },

  /** 设置角色路径权限 */
  async setPathPermissionsByRoleId(roleId: number, paths: string[]) {
    await db
      .delete(rolePathPermission)
      .where(eq(rolePathPermission.roleId, roleId));

    if (paths.length) {
      await db
        .insert(rolePathPermission)
        .values(paths.map((p) => ({ roleId, path: p })));
    }
  },

  /** 获取角色路径权限 */
  async getPathPermissionsByRoleId(roleId: number) {
    const records = await db
      .select()
      .from(rolePathPermission)
      .where(eq(rolePathPermission.roleId, roleId));
    return records.map((i) => i.path);
  },

  /** 设置角色操作权限 */
  async setActionPermissionsByRoleId(
    roleId: number,
    permissions: { module: string; action: string }[]
  ) {
    await db
      .delete(roleActionPermission)
      .where(eq(roleActionPermission.roleId, roleId));

    if (permissions.length) {
      await db.insert(roleActionPermission).values(
        permissions.map((p) => ({
          roleId,
          module: p.module,
          action: p.action,
        }))
      );
    }
  },

  /** 获取角色操作权限 */
  async getActionPermissionsByRoleId(roleId: number) {
    const records = await db
      .select()
      .from(roleActionPermission)
      .where(eq(roleActionPermission.roleId, roleId));
    return records.map((i) => ({ module: i.module, action: i.action }));
  },

  /** 统计角色总数，关联账号总数，已关联账号角色总数 */
  async countRolesAndUsers() {
    const [
      roleCountResult,
      associatedUserCountResult,
      associatedRoleCountResult,
    ] = await Promise.all([
      db.select({ roleCount: count() }).from(role),
      db
        .select({ associatedUserCount: count() })
        .from(user)
        .where(sql`role_id IS NOT NULL`),
      db
        .select({ associatedRoleCount: sql`COUNT(DISTINCT role_id)` })
        .from(user)
        .where(sql`role_id IS NOT NULL`),
    ]);

    return {
      roleCount: roleCountResult[0]?.roleCount ?? 0,
      associatedUserCount:
        associatedUserCountResult[0]?.associatedUserCount ?? 0,
      associatedRoleCount:
        associatedRoleCountResult[0]?.associatedRoleCount ?? 0,
    };
  },
};
