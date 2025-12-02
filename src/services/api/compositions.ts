import axiosInstance from './axios';
import type {
  IComposition,
  ICompositionsQueryParams,
  ICompositionsResponse,
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

