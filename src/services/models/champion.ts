export interface IChampion {
  id: string;
  key: string;
  name: string;
  cost: number;
  set: string;
  traits: string[];
  description?: string;
  imageUrl?: string;
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

