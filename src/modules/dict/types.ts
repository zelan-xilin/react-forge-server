import { STATUS } from '../../types/base';

export interface DictDTO {
  id?: number;
  label: string;
  value: string;
  status?: STATUS;
  description?: string | null;
}

export interface DictItemDTO {
  id?: number;
  parentId: number;
  label: string;
  value: string;
  sort?: number;
  status?: STATUS;
  description?: string | null;
}

export interface DictPageQueryDTO {
  label?: string;
  page: number;
  pageSize: number;
}
