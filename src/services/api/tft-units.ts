import axiosInstance from './axios';
import type {
  ITftUnit,
  ITftUnitsQueryParams,
  ITftUnitsResponse,
  ICreateTftUnitDto,
  IUpdateTftUnitDto,
} from '@services/models/tft-unit';

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
  return response.data;
};

// Get TFT unit by ID
export const getTftUnitById = async (id: string): Promise<ITftUnit | null> => {
  try {
    const url = `/tft-units/${encodeURIComponent(id)}`;
    const response = await axiosInstance.get<ITftUnit | null>(url);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

// Get TFT unit by API name
export const getTftUnitByApiName = async (
  apiName: string,
): Promise<ITftUnit | null> => {
  try {
    const url = `/tft-units/api-name/${encodeURIComponent(apiName)}`;
    const response = await axiosInstance.get<ITftUnit | null>(url);
    return response.data;
  } catch (error: any) {
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

