import { IS_ADMIN, STATUS } from '../../types/base';

export interface CreateUserDTO {
  username: string;
  password: string;
  roleId?: number | null;
  description?: string;
  status?: STATUS;
  userId?: number;
  isAdmin?: IS_ADMIN;
  phone?: string;
}

export interface UpdateUserDTO {
  username?: string;
  password?: string;
  roleId?: number | null;
  status?: STATUS;
  description?: string | null;
  userId?: number;
  isAdmin?: IS_ADMIN;
  phone?: string | null;
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
  roleId?: number | null;
  status?: STATUS;
  phone?: string | null;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
  isAdmin?: IS_ADMIN;
}
