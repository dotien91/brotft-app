import axiosInstance from './axios';
import type {
  IChampion,
  IChampionsQueryParams,
  IChampionsResponse,
} from '@services/models/champion';

// Get all champions with pagination and filters
export const getChampions = async (
  params?: IChampionsQueryParams,
): Promise<IChampionsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.filters) {
    const {filters} = params;
    if (filters.name) {
      queryParams.append('name', filters.name);
    }
    if (filters.key) {
      queryParams.append('key', filters.key);
    }
    if (filters.cost) {
      queryParams.append('cost', filters.cost.toString());
    }
    if (filters.set) {
      queryParams.append('set', filters.set);
    }
    if (filters.trait) {
      queryParams.append('trait', filters.trait);
    }
  }

  const response = await axiosInstance.get<IChampionsResponse>(
    `/champions?${queryParams.toString()}`,
  );
  return response.data;
};

// Get champion by ID
export const getChampionById = async (id: string): Promise<IChampion> => {
  const response = await axiosInstance.get<IChampion>(`/champions/${id}`);
  return response.data;
};

// Get champion by key
export const getChampionByKey = async (key: string): Promise<IChampion> => {
  const response = await axiosInstance.get<IChampion>(`/champions/key/${key}`);
  return response.data;
};

// Get champions by cost
export const getChampionsByCost = async (
  cost: number,
): Promise<IChampion[]> => {
  const response = await axiosInstance.get<IChampion[]>(
    `/champions/cost/${cost}`,
  );
  return response.data;
};

// Get champions by trait
export const getChampionsByTrait = async (
  traitKey: string,
): Promise<IChampion[]> => {
  const response = await axiosInstance.get<IChampion[]>(
    `/champions/trait/${traitKey}`,
  );
  return response.data;
};

