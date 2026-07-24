import axiosInstance from './axios';
import {TFT_SEASON_ID} from '@shared-constants';
import type {
  ITftTrait,
  ITftTraitsQueryParams,
  ITftTraitsResponse,
} from '@services/models/tft-trait';

// Get all TFT traits with pagination and filters
export const getTftTraits = async (
  params?: ITftTraitsQueryParams,
): Promise<ITftTraitsResponse> => {
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
    if (filters.type) {
      queryParams.append('type', filters.type);
    }
  }
  if (params?.sort && params.sort.length > 0) {
    // Only use the first sort item (flat format supports single sort)
    const sortItem = params.sort[0];
    queryParams.append('orderBy', sortItem.orderBy);
    queryParams.append('order', sortItem.order.toLowerCase());
  }

  const response = await axiosInstance.get<ITftTraitsResponse>(
    `/tft-traits?${queryParams.toString()}`,
  );
  return response.data;
};

// Get TFT trait by ID
export const getTftTraitById = async (id: string): Promise<ITftTrait | null> => {
  const url = `/tft-traits/${encodeURIComponent(id)}?season_id=${encodeURIComponent(TFT_SEASON_ID)}`;
  const response = await axiosInstance.get<ITftTrait | null>(url);
  return response.data;
};

// Get TFT trait by API name
export const getTftTraitByApiName = async (
  apiName: string,
): Promise<ITftTrait | null> => {
  const response = await getTftTraits({
    season_id: TFT_SEASON_ID,
    page: 1,
    limit: 1,
    filters: {apiName},
  });
  return response.data[0] ?? null;
};
