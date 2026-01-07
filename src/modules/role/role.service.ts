import { eq } from "drizzle-orm"
import { db } from "../../db"
import { role, roleCrudPermission, roleRoutePermission } from "./role.schema"
import { CreateRoleDTO, PageQueryDTO, UpdateRoleData, UpdateRoleDTO } from "./types"

export const roleService = {
  create(data: CreateRoleDTO) {
    return db.insert(role).values({
      name: data.name,
      description: data.description,
      createdBy: data.userId
    })
  },

  delete(id: number) {
    return db.delete(role).where(eq(role.id, id))
  },

  list() {
    return db.select().from(role)
  },

  page(data: PageQueryDTO) {
    return db
      .select()
      .from(role)
      .where(data.name ? eq(role.name, data.name) : undefined)
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize)
  },

  update(id: number, data: UpdateRoleDTO) {
    const updateData: UpdateRoleData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    }

    if (data.name !== undefined) {
      updateData.name = data.name
    }
    if (data.description !== undefined) {
      updateData.description = data.description
    }

    return db
      .update(role)
      .set(updateData)
      .where(eq(role.id, id))
  },

  async setRoutePermissions(roleId: number, paths: string[]) {
    await db.delete(roleRoutePermission).where(eq(roleRoutePermission.roleId, roleId))

    if (paths.length) {
      await db.insert(roleRoutePermission).values(
        paths.map(p => ({ roleId, path: p }))
      )
    }
  },

  async getRoutePermissions(roleId: number) {
    const list = await db
      .select()
      .from(roleRoutePermission)
      .where(eq(roleRoutePermission.roleId, roleId))
    return list.map(i => i.path)
  },

  async setRoleCrudPermissions(roleId: number, permissions: { module: string; action?: string }[]) {
    await db.delete(roleCrudPermission).where(eq(roleCrudPermission.roleId, roleId))

    if (permissions.length) {
      await db.insert(roleCrudPermission).values(
        permissions.map(p => ({ roleId, module: p.module, action: p.action }))
      )
    }
  },

  async getRoleCrudPermissions(roleId: number) {
    const list = await db
      .select()
      .from(roleCrudPermission)
      .where(eq(roleCrudPermission.roleId, roleId))
    return list.map(i => ({ module: i.module, action: i.action }))
  }
}