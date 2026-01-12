import bcrypt from "bcryptjs";
import { and, count, desc, eq, like, ne } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../../db";
import { IS_ADMIN, STATUS } from "../../types/base";
import { role } from "../role/role.schema";
import {
  CreateUserDTO,
  PageQueryDTO,
  UpdateUserData,
  UpdateUserDTO,
} from "./types";
import { user } from "./user.schema";

export const userService = {
  /** 新增用户 */
  async create(data: CreateUserDTO) {
    const hash = await bcrypt.hash(data.password, 10);
    const result = await db
      .insert(user)
      .values({
        username: data.username,
        passwordHash: hash,
        roleId: data.roleId,
        phone: data.phone,
        description: data.description,
        createdBy: data.userId,
        status: data.status ?? STATUS.ENABLE,
        isAdmin: data.isAdmin ?? IS_ADMIN.NO,
      })
      .returning();

    return result[0];
  },

  /** 更新用户 */
  async update(id: number, data: UpdateUserDTO) {
    const updateData: UpdateUserData = {
      updatedBy: data.userId,
      updatedAt: new Date(),
    };

    if (data.username !== undefined) {
      updateData.username = data.username;
    }
    if (data.password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }
    if (data.roleId !== undefined) {
      updateData.roleId = data.roleId;
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.isAdmin !== undefined) {
      updateData.isAdmin = data.isAdmin;
    }
    if (data.phone !== undefined) {
      updateData.phone = data.phone;
    }

    const result = await db
      .update(user)
      .set(updateData)
      .where(eq(user.id, id))
      .returning();

    return result[0];
  },

  /** 删除用户 */
  async delete(id: number) {
    return db.delete(user).where(eq(user.id, id));
  },

  /** 用户列表 */
  async list() {
    return db.select().from(user).orderBy(desc(user.createdAt));
  },

  /** 用户分页 */
  async page(data: PageQueryDTO) {
    const conditions = [];

    if (data.username) {
      conditions.push(like(user.username, `%${data.username}%`));
    }
    if (data.roleId !== undefined) {
      conditions.push(eq(user.roleId, data.roleId));
    }
    if (data.status !== undefined) {
      conditions.push(eq(user.status, data.status));
    }

    const whereClause = conditions.length ? and(...conditions) : undefined;

    const [{ total }] = await db
      .select({ total: count() })
      .from(user)
      .where(whereClause);

    const creatorAlias = alias(user, "creator");
    const updaterAlias = alias(user, "updater");
    const records = await db
      .select({
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash,
        roleId: user.roleId,
        roleName: role.name,
        status: user.status,
        description: user.description,
        createdBy: user.createdBy,
        createdByName: creatorAlias.username,
        createdAt: user.createdAt,
        updatedBy: user.updatedBy,
        updatedByName: updaterAlias.username,
        updatedAt: user.updatedAt,
        isAdmin: user.isAdmin,
        phone: user.phone,
      })
      .from(user)
      .leftJoin(role, eq(user.roleId, role.id))
      .leftJoin(creatorAlias, eq(user.createdBy, creatorAlias.id))
      .leftJoin(updaterAlias, eq(user.updatedBy, updaterAlias.id))
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    return { records, total };
  },

  /** 检查用户名是否存在 */
  async isUsernameExists(username: string, userId?: number) {
    const conditions = [eq(user.username, username)];
    if (userId !== undefined) {
      conditions.push(ne(user.id, userId));
    }
    const result = await db
      .select({ count: count() })
      .from(user)
      .where(and(...conditions));
    return result[0].count > 0;
  },

  /** 查看用户是否存在 */
  async verifyUser(username: string, password: string) {
    const u = await db.select().from(user).where(eq(user.username, username));
    if (!u[0]) {
      return null;
    }

    const ok = await bcrypt.compare(password, u[0].passwordHash);
    return ok ? u[0] : null;
  },

  /** 根据用户ID获取用户 */
  async getUserByUserId(id: number) {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return result[0] || null;
  },
};
