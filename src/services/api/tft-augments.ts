import axiosInstance from './axios';
import {TFT_SEASON_ID} from '@shared-constants';
import type {
  ITftAugment,
  ITftAugmentsQueryParams,
  ITftAugmentsResponse,
} from '@services/models/tft-augment';

// Get all TFT augments with pagination and filters
export const getTftAugments = async (
  params?: ITftAugmentsQueryParams,
): Promise<ITftAugmentsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('season_id', params?.season_id ?? TFT_SEASON_ID);

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
    if (filters.apiName) {
      queryParams.append('apiName', filters.apiName);
    }
    if (filters.trait) {
      queryParams.append('trait', filters.trait);
    }
    if (filters.stage) {
      queryParams.append('stage', filters.stage);
    }
    if (filters.tier !== undefined) {
      queryParams.append('tier', filters.tier.toString());
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

  const response = await axiosInstance.get<ITftAugmentsResponse>(
    `/tft-augments?${queryParams.toString()}`,
  );
  const totalCountHeader = response.headers['x-total-count'] ?? response.headers['X-Total-Count'];
  const total_count = totalCountHeader != null ? parseInt(String(totalCountHeader), 10) : undefined;
  return { ...response.data, ...(total_count !== undefined && !Number.isNaN(total_count) ? { total_count } : {}) };
};

// Get TFT augment by ID
export const getTftAugmentById = async (id: string): Promise<ITftAugment | null> => {
  const url = `/tft-augments/${encodeURIComponent(id)}?season_id=${encodeURIComponent(TFT_SEASON_ID)}`;
  const response = await axiosInstance.get<ITftAugment | null>(url);
  return response.data;
};

// Get TFT augment by API name
export const getTftAugmentByApiName = async (
  apiName: string,
): Promise<ITftAugment | null> => {
  const response = await getTftAugments({
    season_id: TFT_SEASON_ID,
    page: 1,
    limit: 1,
    filters: {apiName},
  });
  return response.data[0] ?? null;
};







