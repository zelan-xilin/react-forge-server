export interface CreateAreaPricingDTO {
  areaType: string; // 区域类型
  roomSize?: string; // 包间大小
  ruleApplicationType: string; // 收费规则应用类型
  applyTimeStart: string; // 应用时间起始（如 HH:mm）
  usageDurationHours: number; // 使用时长（小时）
  basePrice: number; // 起步价格（元）
  overtimeHourPrice: number; // 超时每小时价格（元）
  overtimeRoundType: string; // 超时取整方式
  overtimeGraceMinutes?: number; // 超时宽限分钟
  giftTeaAmount?: number; // 赠送茶水金额
  status?: number; // 1 启用 / 0 停用
  description?: string;
  userId?: number; // 创建人
}

export interface UpdateAreaPricingDTO {
  areaType?: string;
  roomSize?: string | null;
  ruleApplicationType?: string;
  applyTimeStart?: string;
  usageDurationHours?: number;
  basePrice?: number;
  overtimeHourPrice?: number;
  overtimeRoundType?: string;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status?: number;
  description?: string | null;
  userId?: number; // 更新人
}

export interface UpdateAreaPricingData {
  areaType?: string;
  roomSize?: string | null;
  ruleApplicationType?: string;
  applyTimeStart?: string;
  usageDurationHours?: number;
  basePrice?: number;
  overtimeHourPrice?: number;
  overtimeRoundType?: string;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status?: number;
  description?: string | null;
  updatedBy?: number;
  updatedAt: Date;
}

export interface AreaPricingPageQueryDTO {
  areaType?: string;
  roomSize?: string;
  page: number;
  pageSize: number;
}
