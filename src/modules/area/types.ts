export interface CreateAreaDTO {
  name: string;
  areaType: string;
  roomSize?: string | null;
  status?: number;
  description?: string;
  userId?: number;
}

export interface UpdateAreaDTO {
  name?: string;
  areaType?: string;
  roomSize?: string | null;
  status?: number;
  description?: string | null;
  userId?: number;
}

export interface UpdateAreaData {
  name?: string;
  areaType?: string;
  roomSize?: string | null;
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
