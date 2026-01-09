import { IS_ADMIN, STATUS } from "../../types/base";

export interface CreateUserDTO {
  username: string;
  password: string;
  roleId?: number;
  description?: string;
  status?: STATUS;
  userId?: number;
  isAdmin?: IS_ADMIN
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
  roleId?: number;
  status?: STATUS;
  description?: string;
  userId?: number;
  isAdmin?: IS_ADMIN
}

export interface PageQueryDTO {
  username?: string;
  roleId?: number;
  status?: STATUS;
  page: number;
  pageSize: number;
}

export interface UpdateUserData {
  username?: string;
  passwordHash?: string;
  roleId?: number;
  status?: STATUS;
  description?: string;
  updatedBy?: number;
  updatedAt: Date;
  isAdmin?: IS_ADMIN
}
