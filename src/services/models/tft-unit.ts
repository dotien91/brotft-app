export interface IAbilityVariable {
  name: string;
  value: number | number[]; // Có thể là số đơn hoặc array [1⭐, 2⭐, 3⭐]
}

export interface IAbility {
  desc?: string | null;
  icon?: string | null;
  name?: string | null;
  variables?: IAbilityVariable[];
  tooltipElements?: any[];
  calculations?: Record<string, any>;
}

export interface IUnitStats {
  armor?: number | null;
  attackSpeed?: number | null;
  critChance?: number | null;
  critMultiplier?: number | null;
  damage?: number | null;
  hp?: number | null;
  initialMana?: number | null;
  magicResist?: number | null;
  mana?: number | null;
  range?: number | null;
}

export interface ITftUnit {
  id: string | number;
  season_id?: string;
  slug?: string;
  apiName: string; // Unique
  name: string;
  enName?: string | null;
  characterName?: string | null;
  cost?: number | null;
  icon?: string | null;
  squareIcon?: string | null;
  tileIcon?: string | null;
  role?: string | null;
  ability?: IAbility | null;
  stats?: IUnitStats | null;
  traits?: string[];
  popularItems?: string[];
  tier?: string | null; // S, A, B, C, D
  needUnlock?: boolean; // Flag từ API: tướng này có điều kiện unlock đặc biệt
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftUnitsFilters {
  season_id?: string;
  name?: string;
  apiName?: string;
  trait?: string;
  cost?: number;
  role?: string;
}

export interface ITftUnitsSort {
  orderBy: string;
  order: 'ASC' | 'DESC';
}

export interface ITftUnitsQueryParams {
  season_id?: string;
  page?: number;
  limit?: number;
  minimal?: boolean;
  filters?: ITftUnitsFilters;
  sort?: ITftUnitsSort[];
}

export interface ITftUnitsResponse {
  data: ITftUnit[];
  hasNextPage?: boolean;
  total_count?: number;
}

// DTOs for create and update
export interface ICreateTftUnitDto {
  season_id?: string;
  slug?: string;
  apiName: string; // Bắt buộc, unique
  name: string; // Bắt buộc
  enName?: string;
  characterName?: string;
  cost?: number;
  icon?: string;
  squareIcon?: string;
  tileIcon?: string;
  role?: string;
  ability?: IAbility;
  stats?: IUnitStats;
  traits?: string[];
  popularItems?: string[];
}

export interface IUpdateTftUnitDto {
  season_id?: string;
  slug?: string;
  apiName?: string;
  name?: string;
  enName?: string;
  characterName?: string;
  cost?: number;
  icon?: string;
  squareIcon?: string;
  tileIcon?: string;
  role?: string;
  ability?: IAbility;
  stats?: IUnitStats;
  traits?: string[];
  popularItems?: string[];
}
