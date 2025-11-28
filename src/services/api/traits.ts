import axiosInstance from './axios';
import type {
  ITrait,
  ITraitsQueryParams,
  ITraitsResponse,
} from '@services/models/trait';

// Get all traits with pagination and filters
export const getTraits = async (
  params?: ITraitsQueryParams,
): Promise<ITraitsResponse> => {
  const queryParams = new URLSearchParams();

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }
  if (params?.filters) {
    const {filters} = params;
    if (filters.type !== undefined && filters.type !== null) {
      queryParams.append('filters[type]', filters.type);
    }
    if (filters.name !== undefined && filters.name !== null && filters.name !== '') {
      queryParams.append('filters[name]', filters.name);
    }
    if (filters.key !== undefined && filters.key !== null && filters.key !== '') {
      queryParams.append('filters[key]', filters.key);
    }
    if (filters.set !== undefined && filters.set !== null && filters.set !== '') {
      queryParams.append('filters[set]', filters.set);
    }
  }

  const url = `/origins?${queryParams.toString()}`;
  if (params?.filters) {
  }
  
  const response = await axiosInstance.get<ITraitsResponse>(url);
  
  
  // Handle different response formats
  let responseData = response.data;
  if (response.data) {
    // If response.data is an array directly, wrap it
    if (Array.isArray(response.data)) {
      responseData = { data: response.data };
    }
    // If response.data.data doesn't exist but response.data.results exists
    else if (!response.data.data && response.data.results && Array.isArray(response.data.results)) {
      responseData = { data: response.data.results };
    }
  }
  
  return responseData;
};

// Get trait by ID
export const getTraitById = async (id: string): Promise<ITrait> => {
  const response = await axiosInstance.get<ITrait>(`/origins/${id}`);
  return response.data;
};

