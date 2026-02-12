import { useQuery } from '@tanstack/react-query';
import { searchCompositionsV2, ISearchV2Dto } from '@services/api/compositions';

/**
 * Hook dùng cho tìm kiếm thông minh
 * @param searchData Dữ liệu tìm kiếm (units, items, augments)
 * @param enabled Cho phép gọi API hay không (mặc định false để tránh spam khi chưa chọn gì)
 */
export const useSmartSearchCompositions = (
  searchData: ISearchV2Dto,
  enabled: boolean = false
) => {
  return useQuery({
    // Query key bao gồm tất cả các filter để cache dữ liệu chính xác
    queryKey: ['compositions', 'search-v2', searchData],
    queryFn: () => searchCompositionsV2(searchData, { page: 1, limit: 50 }),
    enabled: enabled && (
      (searchData.units?.length ?? 0) > 0 || 
      (searchData.items?.length ?? 0) > 0 || 
      (searchData.augments?.length ?? 0) > 0
    ),
    staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    retry: 1,
  });
};