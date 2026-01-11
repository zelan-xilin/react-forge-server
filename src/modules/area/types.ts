export interface CreateAreaPricingRuleDTO {
  areaType: string;
  roomSize?: string;
  timeType: string;
  startTimeFrom: string;
  baseDurationMinutes: number;
  basePrice: number;
  overtimePricePerHour: number;
  overtimeRounding: string;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateAreaPricingRuleDTO {
  areaType?: string;
  roomSize?: string;
  timeType?: string;
  startTimeFrom?: string;
  baseDurationMinutes?: number;
  basePrice?: number;
  overtimePricePerHour?: number;
  overtimeRounding?: string;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateAreaPricingRuleData {
  areaType?: string;
  roomSize?: string;
  timeType?: string;
  startTimeFrom?: string;
  baseDurationMinutes?: number;
  basePrice?: number;
  overtimePricePerHour?: number;
  overtimeRounding?: string;
  overtimeGraceMinutes?: number;
  giftTeaAmount?: number;
  status?: number;
  description?: string;
  updatedBy?: number;
  updatedAt: Date;
}

export interface CreateAreaResourceDTO {
  name: string;
  areaType: string;
  roomSize?: string;
  capacity?: number;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateAreaResourceDTO {
  name?: string;
  areaType?: string;
  roomSize?: string;
  capacity?: number;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateAreaResourceData {
  name?: string;
  areaType?: string;
  roomSize?: string;
  capacity?: number;
  status?: number;
  description?: string;
  updatedBy?: number;
  updatedAt: Date;
}
