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
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
}

export interface ITftUnitsFilters {
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
  page?: number;
  limit?: number;
  filters?: ITftUnitsFilters;
  sort?: ITftUnitsSort[];
}

export interface ITftUnitsResponse {
  data: ITftUnit[];
  hasNextPage?: boolean;
}

// DTOs for create and update
export interface ICreateTftUnitDto {
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
}

export interface IUpdateTftUnitDto {
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
}

