export interface RecipeItemDTO {
  materialId: number;
  amount: number;
}

export interface CreateRecipeDTO {
  name: string;
  status?: number; // 默认 1
  description?: string;
  children: RecipeItemDTO[]; // 全量物料明细
  userId?: number; // -> createdBy
}

export interface UpdateRecipeDTO {
  name: string;
  status: number;
  description?: string | null;
  children: RecipeItemDTO[]; // 全量替换
  userId?: number; // -> updatedBy
}

export interface UpdateRecipeData {
  name: string;
  status: number;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}

export interface RecipePageQueryDTO {
  name?: string;
  page: number;
  pageSize: number;
}

export interface RecipeItemVO {
  recipeId: number;
  materialId: number;
  materialName: string | null;
  amount: number;
  recipeUnit: string | null;
}

export interface RecipeVO {
  id: number;
  name: string;
  status: number;
  description: string | null;
  createdBy: number | null;
  createdAt: Date;
  updatedBy: number | null;
  updatedAt: Date | null;
  creatorName?: string | null;
  updaterName?: string | null;
  children: RecipeItemVO[];
}
