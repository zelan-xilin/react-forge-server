import { eq } from "drizzle-orm"
import { db } from "../../db"
import { role, rolePermission } from "./role.schema"
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

  async setPermissions(roleId: number, paths: string[]) {
    await db.delete(rolePermission).where(eq(rolePermission.roleId, roleId))

    if (paths.length) {
      await db.insert(rolePermission).values(
        paths.map(p => ({ roleId, path: p }))
      )
    }
  },

  async getPermissions(roleId: number) {
    const list = await db
      .select()
      .from(rolePermission)
      .where(eq(rolePermission.roleId, roleId))

    return list.map(i => i.path)
  },
}
