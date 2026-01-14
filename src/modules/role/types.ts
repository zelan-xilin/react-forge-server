export interface CreateRoleDTO {
  name: string;
  description?: string;
  userId?: number;
}

export interface UpdateRoleDTO {
  name?: string;
  description?: string | null;
  userId?: number;
}

export interface PageQueryDTO {
  name?: string;
  page: number;
  pageSize: number;
}

export interface UpdateRoleData {
  name?: string;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}
