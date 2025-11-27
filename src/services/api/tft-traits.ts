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
      queryParams.append('filters[name]', filters.name);
    }
    if (filters.apiName) {
      queryParams.append('filters[apiName]', filters.apiName);
    }
  }
  if (params?.sort) {
    params.sort.forEach((sortItem, index) => {
      queryParams.append(`sort[${index}][orderBy]`, sortItem.orderBy);
      queryParams.append(`sort[${index}][order]`, sortItem.order);
    });
  }

  const url = `/tft-traits?${queryParams.toString()}`;
  console.log('[getTftTraits] Calling API:', url);
  const response = await axiosInstance.get<ITftTraitsResponse>(url);
  console.log('[getTftTraits] Response:', {
    dataCount: response.data?.data?.length,
    hasNextPage: response.data?.hasNextPage,
  });
  return response.data;
};

// Get TFT trait by ID
export const getTftTraitById = async (id: string): Promise<ITftTrait | null> => {
  try {
    console.log('[getTftTraitById] Calling API with id:', id);
    const url = `/tft-traits/${encodeURIComponent(id)}`;
    const fullUrl = `http://localhost:3000/api/v1${url}`;
    console.log('[getTftTraitById] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftTrait | null>(url);
    
    console.log('[getTftTraitById] Response status:', response.status);
    console.log('[getTftTraitById] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
      } : null,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftTraitById] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
    throw error;
  }
};

// Get TFT trait by API name
export const getTftTraitByApiName = async (
  apiName: string,
): Promise<ITftTrait | null> => {
  try {
    console.log('[getTftTraitByApiName] Calling API with apiName:', apiName);
    const url = `/tft-traits/api-name/${encodeURIComponent(apiName)}`;
    const fullUrl = `http://localhost:3000/api/v1${url}`;
    console.log('[getTftTraitByApiName] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftTrait | null>(url);
    
    console.log('[getTftTraitByApiName] Response status:', response.status);
    console.log('[getTftTraitByApiName] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
      } : null,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftTraitByApiName] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
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

