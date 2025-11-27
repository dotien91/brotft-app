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
      queryParams.append('filters[name]', filters.name);
    }
    if (filters.apiName) {
      queryParams.append('filters[apiName]', filters.apiName);
    }
    if (filters.trait) {
      queryParams.append('filters[trait]', filters.trait);
    }
    if (filters.unique !== undefined) {
      queryParams.append('filters[unique]', filters.unique.toString());
    }
  }
  if (params?.sort) {
    params.sort.forEach((sortItem, index) => {
      queryParams.append(`sort[${index}][orderBy]`, sortItem.orderBy);
      queryParams.append(`sort[${index}][order]`, sortItem.order);
    });
  }

  const url = `/tft-items?${queryParams.toString()}`;
  console.log('[getTftItems] Calling API:', url);
  const response = await axiosInstance.get<ITftItemsResponse>(url);
  console.log('[getTftItems] Response:', {
    dataCount: response.data?.data?.length,
    hasNextPage: response.data?.hasNextPage,
  });
  return response.data;
};

// Get TFT item by ID
export const getTftItemById = async (id: string): Promise<ITftItem | null> => {
  try {
    console.log('[getTftItemById] Calling API with id:', id);
    const url = `/tft-items/${encodeURIComponent(id)}`;
    const fullUrl = `http://localhost:3000/api/v1${url}`;
    console.log('[getTftItemById] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftItem | null>(url);
    
    console.log('[getTftItemById] Response status:', response.status);
    console.log('[getTftItemById] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
      } : null,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftItemById] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
    throw error;
  }
};

// Get TFT item by API name
export const getTftItemByApiName = async (
  apiName: string,
): Promise<ITftItem | null> => {
  try {
    console.log('[getTftItemByApiName] Calling API with apiName:', apiName);
    const url = `/tft-items/api-name/${encodeURIComponent(apiName)}`;
    const fullUrl = `http://localhost:3000/api/v1${url}`;
    console.log('[getTftItemByApiName] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftItem | null>(url);
    
    console.log('[getTftItemByApiName] Response status:', response.status);
    console.log('[getTftItemByApiName] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
      } : null,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftItemByApiName] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
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

