export interface CreateUserDTO {
  username: string
  password: string
  roleId?: number
  description?: string
  status?: number
  userId?: number
}

export interface UpdateUserDTO {
  username?: string
  password?: string
  roleId?: number
  status?: number
  description?: string
  userId?: number
}

export interface PageQueryDTO {
  username?: string
  roleId?: number
  status?: number
  page: number
  pageSize: number
}

export interface UpdateUserData {
  username?: string
  passwordHash?: string
  roleId?: number
  status?: number
  description?: string
  updatedBy?: number;
  updatedAt: Date
}
