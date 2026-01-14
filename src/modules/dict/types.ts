import { STATUS } from "../../types/base";

export interface DictItemDTO {
  id?: number;
  label: string;
  value: string;
  sort?: number;
  status?: STATUS;
  description?: string | null;
}

export interface CreateDictWithChildrenDTO {
  label: string;
  value: string;
  sort?: number;
  status?: STATUS;
  description?: string | null;
  children?: DictItemDTO[];
  userId?: number;
}

export interface UpdateDictWithChildrenDTO {
  label?: string;
  value?: string;
  sort?: number;
  status?: STATUS;
  description?: string | null;
  children?: DictItemDTO[];
  userId?: number;
}

export interface PageQueryDTO {
  label?: string;
  page: number;
  pageSize: number;
}
