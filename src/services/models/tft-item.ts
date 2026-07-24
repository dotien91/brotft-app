export type TftItemType =
  | 'basic'
  | 'combined'
  | 'radiant'
  | 'elusive'
  | 'consumable'
  | 'artifact';

export const TFT_ITEM_TYPE_LABELS: Record<TftItemType, string> = {
  basic: 'Basic',
  combined: 'Combined',
  radiant: 'Radiant',
  elusive: 'Non-Craftable',
  consumable: 'Consumable',
  artifact: 'Artifact',
};

export interface ITftItem {
  id: string | number;
  season_id?: string;
  slug?: string;
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
  type?: TftItemType | null;
  tier?: string | null;
  texture?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftItemsFilters {
  season_id?: string;
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
  season_id?: string;
  type?: TftItemType;
  page?: number;
  limit?: number;
  filters?: ITftItemsFilters;
  sort?: ITftItemsSort[];
  hasComposition?: boolean;
}

export interface ITftItemsResponse {
  data: ITftItem[];
  hasNextPage?: boolean;
  total_count?: number;
}

// DTOs for create and update
export interface ICreateTftItemDto {
  season_id?: string;
  slug?: string;
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
  type?: TftItemType;
  texture?: string;
}

export interface IUpdateTftItemDto {
  season_id?: string;
  slug?: string;
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
  type?: TftItemType;
  texture?: string;
}
