export interface CreateMaterialDTO {
  name: string;
  recipeUnit: string;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateMaterialDTO {
  name?: string;
  recipeUnit?: string;
  status?: number;
  description?: string | null;
  userId?: number;
}

export interface UpdateMaterialData {
  name?: string;
  recipeUnit?: string;
  status?: number;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}

export interface PageQueryDTO {
  name?: string;
  page: number;
  pageSize: number;
}
