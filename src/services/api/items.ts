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
  if (params?.filters) {
    const {filters} = params;
    if (filters.name) {
      queryParams.append('name', filters.name);
    }
    if (filters.apiName) {
      queryParams.append('apiName', filters.apiName);
    }
    if (filters.set) {
      queryParams.append('set', filters.set);
    }
    if (filters.tag) {
      queryParams.append('tag', filters.tag);
    }
    if (filters.unique !== undefined) {
      queryParams.append('unique', filters.unique.toString());
    }
    if (filters.disabled !== undefined) {
      queryParams.append('disabled', filters.disabled.toString());
    }
    if (filters.status) {
      queryParams.append('status', filters.status);
    }
  }
  if (params?.sort) {
    // Sort is now orderBy and order (flat format)
    // If sort is a string like "name:asc", parse it
    if (typeof params.sort === 'string') {
      const [orderBy, order] = params.sort.split(':');
      if (orderBy) {
        queryParams.append('orderBy', orderBy);
        queryParams.append('order', (order || 'asc').toLowerCase());
      }
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

