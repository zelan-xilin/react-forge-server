import { STATUS } from "../../types/base";

export interface CreateDictDTO {
  label: string;
  value: string;
  parentId?: number | null;
  sort?: number;
  status?: STATUS;
  description?: string | null;
  userId?: number;
}

export interface UpdateDictDTO {
  label?: string;
  value?: string;
  parentId?: number | null;
  sort?: number;
  status?: STATUS;
  description?: string | null;
  userId?: number;
}

export interface PageQueryDTO {
  label?: string;
  page: number;
  pageSize: number;
}

export interface UpdateDictData {
  label?: string;
  value?: string;
  parentId?: number | null;
  sort?: number;
  status?: STATUS;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}
