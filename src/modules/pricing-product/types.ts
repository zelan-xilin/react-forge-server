export interface CreateProductPricingDTO {
  productId: number;
  price: number;
  ruleApplicationType?: string | null;
  applyTimeStart?: string | null;
  status?: number;
  description?: string;
  userId?: number; // 创建人
}

export interface UpdateProductPricingDTO {
  productId?: number;
  price?: number;
  ruleApplicationType?: string | null;
  applyTimeStart?: string | null;
  status?: number;
  description?: string | null;
  userId?: number; // 更新人
}

export interface UpdateProductPricingData {
  productId?: number;
  price?: number;
  ruleApplicationType?: string | null;
  applyTimeStart?: string | null;
  status?: number;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}

export interface ProductPricingPageQueryDTO {
  productId?: number;
  page: number;
  pageSize: number;
}
