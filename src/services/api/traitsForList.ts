import axiosInstance from './axios';
import type {
  ITrait,
  ITraitsQueryParams,
  ITraitsResponse,
} from '@services/models/trait';
import {API_BASE_URL} from '@shared-constants';

// Adapter function for useListData hook
// This function wraps getTraits to match useListData expected format
export const getTraitsForList = async (params: any): Promise<any> => {
  try {
    const queryParams = new URLSearchParams();

    // Convert page from string to number if needed
    const page = params.page ? Number(params.page) : params.page;
    const limit = params.limit || 20;

    if (page) {
      queryParams.append('page', page.toString());
    }
    if (limit) {
      queryParams.append('limit', limit.toString());
    }

    // Handle filters
    if (params.filters) {
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
    console.log('[getTraitsForList] API call:', url);
    console.log('[getTraitsForList] Full URL:', `${API_BASE_URL}/api/v1${url}`);
    console.log('[getTraitsForList] Params:', JSON.stringify(params, null, 2));

    const response = await axiosInstance.get<ITraitsResponse>(url);
    
    console.log('[getTraitsForList] Response status:', response.status);
    console.log('[getTraitsForList] Response headers:', response.headers);
    console.log('[getTraitsForList] Response data:', JSON.stringify(response.data, null, 2));
    console.log('[getTraitsForList] Response data.data:', response.data?.data);
    console.log('[getTraitsForList] Response data.data type:', typeof response.data?.data);
    console.log('[getTraitsForList] Response data.data isArray:', Array.isArray(response.data?.data));
    console.log('[getTraitsForList] Response data.data length:', response.data?.data?.length);

    // Handle different response formats
    console.log('response.data', response.data);
    let data = [];
    if (response.data) {
      // If response.data is an array directly
      if (Array.isArray(response.data)) {
        data = response.data;
      }
      // If response.data.data exists and is an array
      else if (response.data.data && Array.isArray(response.data.data)) {
        data = response.data.data;
      }
      // If response.data.results exists (alternative format)
      else if (response.data.results && Array.isArray(response.data.results)) {
        data = response.data.results;
      }
    }

    console.log('[getTraitsForList] Extracted data:', data);
    console.log('[getTraitsForList] Extracted data length:', data.length);

    // Return format expected by useListData
    return {
      data: data,
      isError: false,
      headers: {
        'x-total-count': response.headers?.['x-total-count'] || data.length || 0,
      },
    };
  } catch (error: any) {
    console.error('[getTraitsForList] Error:', error);
    return {
      data: [],
      isError: true,
      headers: {},
    };
  }
};

