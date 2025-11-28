export interface IItemImage {
  id: string;
  path: string;
}

export interface IItem {
  id?: string;
  _id?: string;
  apiName: string;
  name: string;
  enName?: string;
  desc?: string;
  description?: string;
  icon?: string;
  imageUrl?: string;
  image?: IItemImage;
  composition?: string[];
  components?: string[];
  componentDetails?: IItem[];
  effects?: Record<string, any>;
  stats?: Record<string, any>;
  variableMatches?: Array<{
    match?: string;
    full_match?: string;
    value?: string | number;
    type?: string;
    multiplier?: number | null;
    hash?: string;
    key?: string;
    name?: string;
    [key: string]: any;
  }>;
  associatedTraits?: string[];
  incompatibleTraits?: string[];
  tags?: string[];
  unique?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string | null;
}

export interface IItemsFilters {
  name?: string;
  apiName?: string;
  set?: string;
}

export interface IItemsQueryParams {
  page?: number;
  limit?: number;
  filters?: IItemsFilters;
  sort?: string;
}

export interface IItemsResponse {
  data: IItem[];
  hasNextPage?: boolean;
}

