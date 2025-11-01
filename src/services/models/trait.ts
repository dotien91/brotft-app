import type {IChampion} from './champion';

export interface ITraitTier {
  count: number;
  effect: string;
}

export interface ITrait {
  id: string;
  name: string;
  key: string;
  type: 'origin' | 'class';
  description: string;
  tiers: ITraitTier[];
  champions: string[];
  championDetails?: IChampion[];
  set: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ITraitsFilters {
  type?: 'origin' | 'class' | null;
  name?: string | null;
  key?: string | null;
  set?: string | null;
}

export interface ITraitsQueryParams {
  page?: number;
  limit?: number;
  filters?: ITraitsFilters;
}

export interface ITraitsResponse {
  data: ITrait[];
  hasNextPage?: boolean;
}

