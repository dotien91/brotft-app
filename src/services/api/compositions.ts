import axiosInstance from './axios';
import {TFT_SEASON_ID} from '@shared-constants';
import type {
  IComposition,
  ICompositionsQueryParams,
  ICompositionsResponse,
  ISearchByUnitsDto,
} from '@services/models/composition';

// Get all compositions with pagination
export const getCompositions = async (
  params?: ICompositionsQueryParams,
): Promise<ICompositionsResponse> => {
  const queryParams = new URLSearchParams();
  const filters = {
    season_id: params?.season_id ?? TFT_SEASON_ID,
    ...(params?.active !== undefined && {active: params.active}),
    ...(params?.tier && {tier: params.tier}),
  };
  queryParams.append('filters', JSON.stringify(filters));

  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const response = await axiosInstance.get<ICompositionsResponse>(
    `/compositions?${queryParams.toString()}`,
  );
  return response.data;
};

// Get composition by ID
export const getCompositionById = async (
  id: string,
): Promise<IComposition> => {
  const response = await axiosInstance.get<IComposition>(
    `/compositions/${id}?season_id=${encodeURIComponent(TFT_SEASON_ID)}`,
  );
  return response.data;
};

// Get composition by compId
export const getCompositionByCompId = async (
  compId: string,
): Promise<IComposition> => {
  const filters = JSON.stringify({
    season_id: TFT_SEASON_ID,
    compId,
  });
  const queryParams = new URLSearchParams({
    page: '1',
    limit: '1',
    filters,
  });
  const response = await axiosInstance.get<ICompositionsResponse>(
    `/compositions?${queryParams.toString()}`,
  );
  const composition = response.data.data[0];
  if (!composition) {
    throw new Error(`Composition not found: ${compId}`);
  }
  return composition;
};

// Search compositions by units (GET method with query params)
export const searchCompositionsByUnits = async (
  dto: ISearchByUnitsDto,
  params?: ICompositionsQueryParams,
): Promise<ICompositionsResponse> => {
  const queryParams = new URLSearchParams();
  const filters = {
    season_id: params?.season_id ?? TFT_SEASON_ID,
    units: dto.units.join(','),
    ...(dto.searchInAllArrays !== undefined && {
      searchInAllArrays: dto.searchInAllArrays,
    }),
    ...(params?.tier && {tier: params.tier}),
  };
  queryParams.append('filters', JSON.stringify(filters));

  // Add pagination params
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  const url = `/compositions?${queryParams.toString()}`;
  const response = await axiosInstance.get<ICompositionsResponse>(url);
  return response.data;
};

// Định nghĩa DTO cho Search V2
export interface ISearchV2Dto {
  units?: string[];
  items?: string[];
  augments?: string[];
  searchInAllArrays?: boolean;
}

/**
 * Advanced Search V2 (POST method)
 */
export const searchCompositionsV2 = async (
  searchData: ISearchV2Dto,
  params?: { page?: number; limit?: number }
): Promise<ICompositionsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('season_id', TFT_SEASON_ID);
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const url = `/compositions/search-v2?${queryParams.toString()}`;
  const response = await axiosInstance.post<ICompositionsResponse>(url, searchData);
  return response.data;
};
