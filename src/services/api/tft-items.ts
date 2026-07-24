import axiosInstance from './axios';
import {TFT_SEASON_ID} from '@shared-constants';
import type {
  ITftItem,
  ITftItemsQueryParams,
  ITftItemsResponse,
} from '@services/models/tft-item';

// Get all TFT items with pagination and filters
export const getTftItems = async (
  params?: ITftItemsQueryParams,
): Promise<ITftItemsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('season_id', params?.season_id ?? TFT_SEASON_ID);

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', Math.min(params.limit, 50).toString());
  }
  if (params?.type) {
    queryParams.append('type', params.type);
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
    if (filters.unique !== undefined) {
      queryParams.append('unique', filters.unique.toString());
    }
  }
  if (params?.sort && params.sort.length > 0) {
    // Only use the first sort item (flat format supports single sort)
    const sortItem = params.sort[0];
    queryParams.append('orderBy', sortItem.orderBy);
    queryParams.append('order', sortItem.order.toLowerCase());
  }
  if (params?.hasComposition !== undefined) {
    queryParams.append('hasComposition', params.hasComposition.toString());
  }
  const response = await axiosInstance.get<ITftItemsResponse>(
    `/tft-items?${queryParams.toString()}`,
  );
  const totalCountHeader = response.headers['x-total-count'] ?? response.headers['X-Total-Count'];
  const total_count = totalCountHeader != null ? parseInt(String(totalCountHeader), 10) : undefined;
  return { ...response.data, ...(total_count !== undefined && !Number.isNaN(total_count) ? { total_count } : {}) };
};

// Get TFT item by ID
export const getTftItemById = async (id: string): Promise<ITftItem | null> => {
  const url = `/tft-items/${encodeURIComponent(id)}?season_id=${encodeURIComponent(TFT_SEASON_ID)}`;
  const response = await axiosInstance.get<ITftItem | null>(url);
  return response.data;
};

// Get TFT item by API name
export const getTftItemByApiName = async (
  apiName: string,
): Promise<ITftItem | null> => {
  const response = await getTftItems({
    season_id: TFT_SEASON_ID,
    page: 1,
    limit: 1,
    filters: {apiName},
  });
  return response.data[0] ?? null;
};
