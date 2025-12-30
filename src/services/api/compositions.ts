import axiosInstance from './axios';
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
  const response = await axiosInstance.get<IComposition>(`/compositions/${id}`);
  return response.data;
};

// Get composition by compId
export const getCompositionByCompId = async (
  compId: string,
): Promise<IComposition> => {
  const response = await axiosInstance.get<IComposition>(
    `/compositions/compId/${compId}`,
  );
  return response.data;
};

// Search compositions by units (GET method with query params)
export const searchCompositionsByUnits = async (
  dto: ISearchByUnitsDto,
  params?: ICompositionsQueryParams,
): Promise<ICompositionsResponse> => {
  const queryParams = new URLSearchParams();

  // Add units as comma-separated string
  if (dto.units && dto.units.length > 0) {
    queryParams.append('units', dto.units.join(','));
  }

  // Add searchInAllArrays if provided
  if (dto.searchInAllArrays !== undefined) {
    queryParams.append('searchInAllArrays', dto.searchInAllArrays.toString());
  }

  // Add pagination params
  if (params?.page) {
    queryParams.append('page', params.page.toString());
  }
  if (params?.limit) {
    queryParams.append('limit', params.limit.toString());
  }

  // Add tier if provided in params
  if (params?.tier) {
    queryParams.append('tier', params.tier);
  }

  const url = `/compositions?${queryParams.toString()}`;

  try {
    const response = await axiosInstance.get<ICompositionsResponse>(url);
    return response.data;
  } catch (error: any) {
    console.error('❌ ========== SEARCH ERROR ==========');
    console.error('❌ Error message:', error?.message);
    console.error('❌ Error response status:', error?.response?.status);
    console.error('❌ Error response data:', error?.response?.data);
    console.error('❌ Error response headers:', error?.response?.headers);
    console.error('❌ Full error:', JSON.stringify(error, null, 2));
    console.error('❌ ===========================================');
    throw error;
  }
};

