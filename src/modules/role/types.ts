export interface CreateRoleDTO {
  name: string;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateRoleDTO {
  name?: string;
  status?: number;
  description?: string;
  userId?: number;
}

export interface PageQueryDTO {
  name?: string;
  status?: number;
  page: number;
  pageSize: number;
}

export interface UpdateRoleData {
  name?: string;
  status?: number;
  description?: string;
  updatedBy?: number;
  updatedAt: Date;
}
