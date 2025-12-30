export interface ITftAugmentVariableMatch {
  match?: string;
  type?: string;
  multiplier?: string | number | null;
  full_match?: string;
  hash?: string;
  value?: string | number;
  [key: string]: any;
}

export interface ITftAugment {
  id: string | number;
  apiName: string; // Unique
  name: string;
  enName?: string | null;
  desc?: string | null;
  icon?: string | null;
  trait?: string | null;
  stage?: string | null; // e.g., "2-1", "3-2"
  tier?: number | null; // 1 = Silver, 2 = Gold, 3 = Prismatic
  unique?: boolean;
  effects?: Record<string, any>;
  variableMatches?: ITftAugmentVariableMatch[];
  tags?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftAugmentsFilters {
  name?: string;
  apiName?: string;
  trait?: string;
  stage?: string;
  tier?: number; // 1 = Silver, 2 = Gold, 3 = Prismatic
  unique?: boolean;
}

export interface ITftAugmentsSort {
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface ITftAugmentsQueryParams {
  page?: number;
  limit?: number;
  filters?: ITftAugmentsFilters;
  sort?: ITftAugmentsSort[];
}

export interface ITftAugmentsResponse {
  data: ITftAugment[];
  hasNextPage?: boolean;
  page?: number;
  limit?: number;
}

// DTOs for create and update
export interface ICreateTftAugmentDto {
  apiName: string; // Bắt buộc, unique
  name: string; // Bắt buộc
  enName?: string;
  desc?: string;
  icon?: string;
  trait?: string;
  stage?: string;
  tier?: number; // 1 = Silver, 2 = Gold, 3 = Prismatic
  unique?: boolean;
  effects?: Record<string, any>;
  variableMatches?: ITftAugmentVariableMatch[];
  tags?: string[];
}

export interface IUpdateTftAugmentDto {
  apiName?: string;
  name?: string;
  enName?: string;
  desc?: string;
  icon?: string;
  trait?: string;
  stage?: string;
  tier?: number; // 1 = Silver, 2 = Gold, 3 = Prismatic
  unique?: boolean;
  effects?: Record<string, any>;
  variableMatches?: ITftAugmentVariableMatch[];
  tags?: string[];
}










