import axiosInstance from './axios';
import type {
  ITftTrait,
  ITftTraitsQueryParams,
  ITftTraitsResponse,
  ICreateTftTraitDto,
  IUpdateTftTraitDto,
} from '@services/models/tft-trait';

// Get all TFT traits with pagination and filters
export const getTftTraits = async (
  params?: ITftTraitsQueryParams,
): Promise<ITftTraitsResponse> => {
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
  try {
    const url = `/tft-traits/${encodeURIComponent(id)}`;
    const response = await axiosInstance.get<ITftTrait | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get TFT trait by API name
export const getTftTraitByApiName = async (
  apiName: string,
): Promise<ITftTrait | null> => {
  try {
    const url = `/tft-traits/api-name/${encodeURIComponent(apiName)}`;
    const response = await axiosInstance.get<ITftTrait | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Create TFT trait
export const createTftTrait = async (
  data: ICreateTftTraitDto,
): Promise<ITftTrait> => {
  const response = await axiosInstance.post<ITftTrait>(`/tft-traits`, data);
  return response.data;
};

// Update TFT trait
export const updateTftTrait = async (
  id: string,
  data: IUpdateTftTraitDto,
): Promise<ITftTrait | null> => {
  const response = await axiosInstance.patch<ITftTrait | null>(
    `/tft-traits/${id}`,
    data,
  );
  return response.data;
};

// Delete TFT trait
export const deleteTftTrait = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tft-traits/${id}`);
};

