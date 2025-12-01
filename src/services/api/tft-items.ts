import axiosInstance from './axios';
import type {
  ITftItem,
  ITftItemsQueryParams,
  ITftItemsResponse,
  ICreateTftItemDto,
  IUpdateTftItemDto,
} from '@services/models/tft-item';

// Get all TFT items with pagination and filters
export const getTftItems = async (
  params?: ITftItemsQueryParams,
): Promise<ITftItemsResponse> => {
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

  const response = await axiosInstance.get<ITftItemsResponse>(
    `/tft-items?${queryParams.toString()}`,
  );
  return response.data;
};

// Get TFT item by ID
export const getTftItemById = async (id: string): Promise<ITftItem | null> => {
  try {
    const url = `/tft-items/${encodeURIComponent(id)}`;
    const response = await axiosInstance.get<ITftItem | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get TFT item by API name
export const getTftItemByApiName = async (
  apiName: string,
): Promise<ITftItem | null> => {
  try {
    const url = `/tft-items/api-name/${encodeURIComponent(apiName)}`;
    const response = await axiosInstance.get<ITftItem | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Create TFT item
export const createTftItem = async (
  data: ICreateTftItemDto,
): Promise<ITftItem> => {
  const response = await axiosInstance.post<ITftItem>(`/tft-items`, data);
  return response.data;
};

// Update TFT item
export const updateTftItem = async (
  id: string,
  data: IUpdateTftItemDto,
): Promise<ITftItem | null> => {
  const response = await axiosInstance.patch<ITftItem | null>(
    `/tft-items/${id}`,
    data,
  );
  return response.data;
};

// Delete TFT item
export const deleteTftItem = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tft-items/${id}`);
};

