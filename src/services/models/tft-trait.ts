export interface ITftTraitEffectVariableMatch {
  match?: string;
  type?: string;
  multiplier?: string | number | null;
  full_match?: string;
  hash?: string;
  value?: string | number;
  [key: string]: any;
}

export interface ITftTraitEffect {
  maxUnits?: number;
  minUnits?: number;
  style?: number;
  variables?: Record<string, any>;
  variableMatches?: ITftTraitEffectVariableMatch[];
}

export interface ITftTraitUnit {
  unit: string;
  unit_cost?: number;
}

export interface ITftTrait {
  id: string | number;
  apiName: string; // Unique
  name: string;
  enName?: string | null;
  desc?: string | null;
  icon?: string | null;
  effects?: ITftTraitEffect[];
  units?: ITftTraitUnit[];
  unitProperties?: Record<string, any>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftTraitsFilters {
  name?: string;
  apiName?: string;
  type?: 'origin' | 'class';
}

export interface ITftTraitsSort {
  orderBy: string;
  order: 'asc' | 'desc';
}

export interface ITftTraitsQueryParams {
  page?: number;
  limit?: number;
  filters?: ITftTraitsFilters;
  sort?: ITftTraitsSort[];
}

export interface ITftTraitsResponse {
  data: ITftTrait[];
  hasNextPage?: boolean;
}

// DTOs for create and update
export interface ICreateTftTraitDto {
  apiName: string; // Bắt buộc, unique
  name: string; // Bắt buộc
  enName?: string;
  desc?: string;
  icon?: string;
  effects?: ITftTraitEffect[];
  units?: ITftTraitUnit[];
  unitProperties?: Record<string, any>;
}

export interface IUpdateTftTraitDto {
  apiName?: string;
  name?: string;
  enName?: string;
  desc?: string;
  icon?: string;
  effects?: ITftTraitEffect[];
  units?: ITftTraitUnit[];
  unitProperties?: Record<string, any>;
}

