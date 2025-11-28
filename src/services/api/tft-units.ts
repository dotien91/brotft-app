import axiosInstance from './axios';
import type {
  ITftUnit,
  ITftUnitsQueryParams,
  ITftUnitsResponse,
  ICreateTftUnitDto,
  IUpdateTftUnitDto,
} from '@services/models/tft-unit';
import {API_BASE_URL} from '@shared-constants';

// Get all TFT units with pagination and filters
export const getTftUnits = async (
  params?: ITftUnitsQueryParams,
): Promise<ITftUnitsResponse> => {
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
    if (filters.cost !== undefined) {
      queryParams.append('filters[cost]', filters.cost.toString());
    }
    if (filters.role) {
      queryParams.append('filters[role]', filters.role);
    }
  }
  if (params?.sort) {
    params.sort.forEach((sortItem, index) => {
      queryParams.append(`sort[${index}][orderBy]`, sortItem.orderBy);
      queryParams.append(`sort[${index}][order]`, sortItem.order);
    });
  }

  const response = await axiosInstance.get<ITftUnitsResponse>(
    `/tft-units?${queryParams.toString()}`,
  );
  console.log('response', response.data);
  return response.data;
};

// Get TFT unit by ID
export const getTftUnitById = async (id: string): Promise<ITftUnit | null> => {
  try {
    console.log('[getTftUnitById] Calling API with id:', id);
    const url = `/tft-units/${encodeURIComponent(id)}`;
    const fullUrl = `${API_BASE_URL}/api/v1${url}`;
    console.log('[getTftUnitById] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftUnit | null>(url);
    
    console.log('[getTftUnitById] Response status:', response.status);
    console.log('[getTftUnitById] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
        cost: response.data.cost,
      } : null,
      fullData: response.data,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftUnitById] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
    throw error;
  }
};

// Get TFT unit by API name
export const getTftUnitByApiName = async (
  apiName: string,
): Promise<ITftUnit | null> => {
  try {
    console.log('[getTftUnitByApiName] Calling API with apiName:', apiName);
    const url = `/tft-units/api-name/${encodeURIComponent(apiName)}`;
    const fullUrl = `${API_BASE_URL}/api/v1${url}`;
    console.log('[getTftUnitByApiName] Full URL:', fullUrl);
    
    const response = await axiosInstance.get<ITftUnit | null>(url);
    
    console.log('[getTftUnitByApiName] Response status:', response.status);
    console.log('[getTftUnitByApiName] Response data:', {
      hasData: !!response.data,
      data: response.data ? {
        id: response.data.id,
        name: response.data.name,
        apiName: response.data.apiName,
        cost: response.data.cost,
      } : null,
      fullData: response.data,
    });
    
    return response.data;
  } catch (error: any) {
    console.error('[getTftUnitByApiName] Error:', {
      message: error?.message,
      response: error?.response?.data,
      status: error?.response?.status,
      url: error?.config?.url,
    });
    throw error;
  }
};

// Get TFT units by cost
export const getTftUnitsByCost = async (
  cost: number,
): Promise<ITftUnit[]> => {
  const response = await axiosInstance.get<ITftUnit[]>(
    `/tft-units/cost/${cost}`,
  );
  return response.data;
};

// Create TFT unit
export const createTftUnit = async (
  data: ICreateTftUnitDto,
): Promise<ITftUnit> => {
  const response = await axiosInstance.post<ITftUnit>(`/tft-units`, data);
  return response.data;
};

// Update TFT unit
export const updateTftUnit = async (
  id: string,
  data: IUpdateTftUnitDto,
): Promise<ITftUnit | null> => {
  const response = await axiosInstance.patch<ITftUnit | null>(
    `/tft-units/${id}`,
    data,
  );
  return response.data;
};

// Delete TFT unit
export const deleteTftUnit = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/tft-units/${id}`);
};

