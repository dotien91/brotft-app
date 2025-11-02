import type {ITrait} from './trait';

export interface IChampionImage {
  id: string;
  path: string;
}

export interface IChampion {
  id: string;
  key: string;
  name: string;
  cost: number;
  set: string;
  traits: string[];
  traitDetails?: ITrait[];
  origins?: ITrait[];
  description?: string;
  imageUrl?: string;
  image?: IChampionImage;
  abilityName?: string;
  abilityDescription?: string;
  health?: number;
  armor?: number;
  magicResist?: number;
  attackDamage?: number;
  attackSpeed?: number;
  attackRange?: number;
  startingMana?: number;
  maxMana?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface IChampionsFilters {
  name?: string;
  key?: string;
  cost?: number;
  set?: string;
  trait?: string;
}

export interface IChampionsQueryParams {
  page?: number;
  limit?: number;
  filters?: IChampionsFilters;
}

export interface IChampionsResponse {
  data: IChampion[];
  hasNextPage?: boolean;
}

