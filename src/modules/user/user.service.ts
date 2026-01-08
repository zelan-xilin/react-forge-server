import bcrypt from "bcryptjs";
import { and, count, desc, eq, like } from "drizzle-orm";
import { db } from "../../db";
import {
  CreateUserDTO,
  PageQueryDTO,
  UpdateUserData,
  UpdateUserDTO,
} from "./types";
import { user } from "./user.schema";

export const userService = {
  async create(data: CreateUserDTO) {
    const hash = await bcrypt.hash(data.password, 10);
    return db.insert(user).values({
      username: data.username,
      passwordHash: hash,
      roleId: data.roleId,
      description: data.description,
      createdBy: data.userId,
      status: data.status ?? 1,
    });
  },

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

    return db.update(user).set(updateData).where(eq(user.id, id));
  },

  async delete(id: number) {
    return db.delete(user).where(eq(user.id, id));
  },

  async list() {
    return db.select().from(user).orderBy(desc(user.createdAt));
  },

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

    const list = await db
      .select()
      .from(user)
      .where(whereClause)
      .orderBy(desc(user.createdAt))
      .limit(data.pageSize)
      .offset((data.page - 1) * data.pageSize);

    return { list, total };
  },

  async validate(username: string, password: string) {
    const u = await db.select().from(user).where(eq(user.username, username));
    if (!u[0]) return null;
    const ok = await bcrypt.compare(password, u[0].passwordHash);
    return ok ? u[0] : null;
  },

  async getUserByUserId(id: number) {
    const result = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return result[0] || null;
  },
};
