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
  const fullUrl = `${axiosInstance.defaults.baseURL}${url}`;

  console.log('🔍 ========== SEARCH COMPOSITIONS BY UNITS ==========');
  console.log('📤 Full URL:', fullUrl);
  console.log('📤 Relative URL:', url);
  console.log('📤 Method: GET');
  console.log('📤 Query Params:', {
    units: dto.units?.join(','),
    searchInAllArrays: dto.searchInAllArrays,
    page: params?.page,
    limit: params?.limit,
    tier: params?.tier,
    queryString: queryParams.toString(),
  });
  console.log('📤 Units array:', dto.units);
  console.log('📤 Units count:', dto.units?.length || 0);

  try {
    console.log('📡 Sending GET request...');
    const response = await axiosInstance.get<ICompositionsResponse>(url);
    
    console.log('✅ ========== SEARCH RESULT ==========');
    console.log('📥 Status:', response.status);
    console.log('📥 Response data:', {
      count: response.data?.data?.length || 0,
      hasNextPage: response.data?.hasNextPage,
      compositions: response.data?.data?.map(c => ({
        id: c.id,
        compId: c.compId,
        name: c.name,
        unitsCount: c.units?.length || 0,
        units: c.units?.map(u => u.championKey || u.championId),
      })),
    });
    console.log('✅ ===========================================');
    
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

