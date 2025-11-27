import axiosInstance from './axios';
import type {
  IItem,
  IItemsQueryParams,
  IItemsResponse,
} from '@services/models/item';

// Get all items with pagination and filters
export const getItems = async (
  params?: IItemsQueryParams,
): Promise<IItemsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.sort) {
    queryParams.append('sort', params.sort);
  }
  if (params?.filters) {
    const {filters} = params;
    if (filters.name) {
      queryParams.append('filters[name]', filters.name);
    }
    if (filters.apiName) {
      queryParams.append('filters[apiName]', filters.apiName);
    }
    if (filters.set) {
      queryParams.append('filters[set]', filters.set);
    }
  }

  const response = await axiosInstance.get<IItemsResponse>(
    `/items?${queryParams.toString()}`,
  );
  return response.data;
};

// Get item by ID
export const getItemById = async (id: string): Promise<IItem> => {
  const response = await axiosInstance.get<IItem>(`/items/${id}`);
  return response.data;
};

// Get item by API name
export const getItemByApiName = async (apiName: string): Promise<IItem> => {
  const response = await axiosInstance.get<IItem>(`/items/api-name/${apiName}`);
  return response.data;
};

