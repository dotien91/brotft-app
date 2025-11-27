export interface ITftItem {
  id: string | number;
  apiName: string; // Unique
  name: string;
  enName?: string | null;
  desc?: string | null;
  icon?: string | null;
  associatedTraits?: string[];
  incompatibleTraits?: string[];
  composition?: string[];
  effects?: Record<string, any>;
  tags?: string[];
  unique?: boolean;
  from?: string | null;
  itemId?: string | null;
  disabled?: boolean;
  type?: string | null;
  texture?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftItemsFilters {
  name?: string;
  apiName?: string;
  trait?: string;
  unique?: boolean;
}

export interface ITftItemsSort {
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface ITftItemsQueryParams {
  page?: number;
  limit?: number;
  filters?: ITftItemsFilters;
  sort?: ITftItemsSort[];
}

export interface ITftItemsResponse {
  data: ITftItem[];
  hasNextPage?: boolean;
}

// DTOs for create and update
export interface ICreateTftItemDto {
  apiName: string; // Bắt buộc, unique
  name: string; // Bắt buộc
  enName?: string;
  desc?: string;
  icon?: string;
  associatedTraits?: string[];
  incompatibleTraits?: string[];
  composition?: string[];
  effects?: Record<string, any>;
  tags?: string[];
  unique?: boolean;
  from?: string;
  itemId?: string;
  disabled?: boolean;
  type?: string;
  texture?: string;
}

export interface IUpdateTftItemDto {
  apiName?: string;
  name?: string;
  enName?: string;
  desc?: string;
  icon?: string;
  associatedTraits?: string[];
  incompatibleTraits?: string[];
  composition?: string[];
  effects?: Record<string, any>;
  tags?: string[];
  unique?: boolean;
  from?: string;
  itemId?: string;
  disabled?: boolean;
  type?: string;
  texture?: string;
}

