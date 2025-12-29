import axiosInstance from './axios';
import type {
  ITftAugment,
  ITftAugmentsQueryParams,
  ITftAugmentsResponse,
  ICreateTftAugmentDto,
  IUpdateTftAugmentDto,
} from '@services/models/tft-augment';

// Get all TFT augments with pagination and filters
export const getTftAugments = async (
  params?: ITftAugmentsQueryParams,
): Promise<ITftAugmentsResponse> => {
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
  return response.data;
};

// Get TFT augment by ID
export const getTftAugmentById = async (id: string): Promise<ITftAugment | null> => {
  try {
    const url = `/tft-augments/${encodeURIComponent(id)}`;
    const response = await axiosInstance.get<ITftAugment | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get TFT augment by API name
export const getTftAugmentByApiName = async (
  apiName: string,
): Promise<ITftAugment | null> => {
  try {
    const url = `/tft-augments/api-name/${encodeURIComponent(apiName)}`;
    const response = await axiosInstance.get<ITftAugment | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Create TFT augment
export const createTftAugment = async (
  data: ICreateTftAugmentDto,
): Promise<ITftAugment> => {
  const response = await axiosInstance.post<ITftAugment>(`/tft-augments`, data);
  return response.data;
};

// Update TFT augment
export const updateTftAugment = async (
  id: string,
  data: IUpdateTftAugmentDto,
): Promise<ITftAugment | null> => {
  const response = await axiosInstance.patch<ITftAugment | null>(
    `/tft-augments/${id}`,
    data,
  );
  return response.data;
};

// Delete TFT augment
export const deleteTftAugment = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tft-augments/${id}`);
};









