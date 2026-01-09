import { and, count, desc, eq, like, ne } from "drizzle-orm";
import { db } from "../../db";
import { role, roleActionPermission, rolePathPermission } from "./role.schema";
import {
  CreateRoleDTO,
  PageQueryDTO,
  UpdateRoleData,
  UpdateRoleDTO,
} from "./types";

export const roleService = {
  /** 新增角色 */
  create(data: CreateRoleDTO) {
    return db.insert(role).values({
      name: data.name,
      description: data.description,
      createdBy: data.userId,
    });
  },

  /** 更新角色 */
  update(id: number, data: UpdateRoleDTO) {
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

    return db.update(role).set(updateData).where(eq(role.id, id));
  },

  /** 删除角色 */
  delete(id: number) {
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

    const list = await db
      .select()
      .from(role)
      .where(whereClause)
      .orderBy(desc(role.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    return { list, total };
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
    const list = await db
      .select()
      .from(rolePathPermission)
      .where(eq(rolePathPermission.roleId, roleId));
    return list.map((i) => i.path);
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
    const list = await db
      .select()
      .from(roleActionPermission)
      .where(eq(roleActionPermission.roleId, roleId));
    return list.map((i) => ({ module: i.module, action: i.action }));
  },
};
