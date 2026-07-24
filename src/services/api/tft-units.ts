import axiosInstance from './axios';
import {TFT_SEASON_ID} from '@shared-constants';
import type {
  ITftUnit,
  ITftUnitsQueryParams,
  ITftUnitsResponse,
} from '@services/models/tft-unit';

// Get all TFT units with pagination and filters
export const getTftUnits = async (
  params?: ITftUnitsQueryParams,
): Promise<ITftUnitsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('season_id', params?.season_id ?? TFT_SEASON_ID);

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.minimal !== undefined) {
    queryParams.append('minimal', params.minimal ? 'true' : 'false');
  }
  if (params?.filters) {
    const {filters} = params;
    if (filters.name) {
      queryParams.append('name', filters.name);
    }
    if (filters.apiName) {
      queryParams.append('apiName', filters.apiName);
    }
    if (filters.trait) {
      queryParams.append('trait', filters.trait);
    }
    if (filters.cost !== undefined) {
      queryParams.append('cost', filters.cost.toString());
    }
    if (filters.role) {
      queryParams.append('role', filters.role);
    }
  }
  if (params?.sort && params.sort.length > 0) {
    // Only use the first sort item (flat format supports single sort)
    const sortItem = params.sort[0];
    queryParams.append('orderBy', sortItem.orderBy);
    queryParams.append('order', sortItem.order.toLowerCase());
  }
  const response = await axiosInstance.get<ITftUnitsResponse>(
    `/tft-units?${queryParams.toString()}`,
  );
  const totalCountHeader = response.headers['x-total-count'] ?? response.headers['X-Total-Count'];
  const total_count = totalCountHeader != null ? parseInt(String(totalCountHeader), 10) : undefined;
  return { ...response.data, ...(total_count !== undefined && !Number.isNaN(total_count) ? { total_count } : {}) };
};

// Get TFT unit by ID
export const getTftUnitById = async (id: string): Promise<ITftUnit | null> => {
  const url = `/tft-units/${encodeURIComponent(id)}?season_id=${encodeURIComponent(TFT_SEASON_ID)}`;
  const response = await axiosInstance.get<ITftUnit | null>(url);
  return response.data;
};

// Get TFT unit by API name
export const getTftUnitByApiName = async (
  apiName: string,
): Promise<ITftUnit | null> => {
  const response = await getTftUnits({
    season_id: TFT_SEASON_ID,
    page: 1,
    limit: 1,
    filters: {apiName},
  });
  return response.data[0] ?? null;
};

// Get TFT units by cost
export const getTftUnitsByCost = async (
  cost: number,
): Promise<ITftUnit[]> => {
  const response = await getTftUnits({
    season_id: TFT_SEASON_ID,
    page: 1,
    limit: 100,
    filters: {cost},
  });
  return response.data;
};
