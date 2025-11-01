import {useState, useEffect} from 'react';
import {useQuery, type UseQueryOptions} from '@tanstack/react-query';
import {
  getChampions,
  getChampionById,
  getChampionByKey,
  getChampionsByCost,
  getChampionsByTrait,
} from '../champions';
import type {
  IChampionsQueryParams,
  IChampion,
} from '@services/models/champion';

// Query keys
export const championKeys = {
  all: ['champions'] as const,
  lists: () => [...championKeys.all, 'list'] as const,
  list: (params?: IChampionsQueryParams) =>
    [...championKeys.lists(), params] as const,
  details: () => [...championKeys.all, 'detail'] as const,
  detail: (id: string) => [...championKeys.details(), id] as const,
  byKey: (key: string) => [...championKeys.all, 'key', key] as const,
  byCost: (cost: number) => [...championKeys.all, 'cost', cost] as const,
  byTrait: (traitKey: string) =>
    [...championKeys.all, 'trait', traitKey] as const,
};

// Generic hook factory for list queries (with required params)
export const createListQueryHook = <
  TParams = undefined,
  TResponse = unknown,
  TData = unknown,
>(options: {
  queryKey: (params: TParams) => readonly unknown[];
  queryFn: (params: TParams) => Promise<TResponse>;
  enabled?: (params: TParams) => boolean;
  transform?: (response: TResponse) => TData;
}) => {
  return (
    params: TParams,
    queryOptions?: Omit<
      UseQueryOptions<TResponse, Error, TData>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery<TResponse, Error, TData>({
      queryKey: options.queryKey(params),
      queryFn: () => options.queryFn(params),
      enabled:
        options.enabled !== undefined ? options.enabled(params) : true,
      ...queryOptions,
      ...(options.transform && {
        select: (data: TResponse) => options.transform!(data) as TData,
      }),
    });
  };
};

// Generic hook factory for optional params list queries
export const createOptionalListQueryHook = <
  TParams = undefined,
  TResponse = unknown,
  TData = unknown,
>(options: {
  queryKey: (params?: TParams) => readonly unknown[];
  queryFn: (params?: TParams) => Promise<TResponse>;
  enabled?: (params?: TParams) => boolean;
  transform?: (response: TResponse) => TData;
}) => {
  return (
    params?: TParams,
    queryOptions?: Omit<
      UseQueryOptions<TResponse, Error, TData>,
      'queryKey' | 'queryFn'
    >,
  ) => {
    return useQuery<TResponse, Error, TData>({
      queryKey: options.queryKey(params),
      queryFn: () => options.queryFn(params),
      enabled:
        options.enabled !== undefined ? options.enabled(params) : true,
      ...queryOptions,
      ...(options.transform && {
        select: (data: TResponse) => options.transform!(data) as TData,
      }),
    });
  };
};

// Get all champions with pagination and filters
export const useChampions = (
  params?: IChampionsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getChampions>>,
      Error,
      Awaited<ReturnType<typeof getChampions>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    IChampionsQueryParams,
    Awaited<ReturnType<typeof getChampions>>,
    Awaited<ReturnType<typeof getChampions>>
  >({
    queryKey: championKeys.list,
    queryFn: getChampions,
  })(params, queryOptions);
};

// Hook with pagination handling built-in
export const useChampionsWithPagination = (limit: number = 10) => {
  const [page, setPage] = useState(1);
  const [allChampions, setAllChampions] = useState<IChampion[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: championsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useChampions({page, limit});

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (championsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllChampions(championsData.data);
      } else {
        // Append new data when loading more
        setAllChampions(prev => [...prev, ...championsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (championsData.hasNextPage !== undefined) {
        setHasMore(championsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [championsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      championsData?.hasNextPage !== undefined
        ? championsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && championsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllChampions([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allChampions,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    isRefetching: isRefetching && page === 1,
  };
};

// Get champion by ID
export const useChampionById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getChampionById>>,
      Error,
      Awaited<ReturnType<typeof getChampionById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: championKeys.detail(id),
    queryFn: () => getChampionById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get champion by key
export const useChampionByKey = (
  key: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getChampionByKey>>,
      Error,
      Awaited<ReturnType<typeof getChampionByKey>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: championKeys.byKey(key),
    queryFn: () => getChampionByKey(key),
    enabled: !!key,
    ...queryOptions,
  });
};

// Get champions by cost
export const useChampionsByCost = (
  cost: number,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getChampionsByCost>>,
      Error,
      Awaited<ReturnType<typeof getChampionsByCost>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return createListQueryHook({
    queryKey: championKeys.byCost,
    queryFn: getChampionsByCost,
    enabled: (cost?: number) => !!cost && cost >= 1 && cost <= 5,
  })(cost, queryOptions);
};

// Get champions by trait
export const useChampionsByTrait = (
  traitKey: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getChampionsByTrait>>,
      Error,
      Awaited<ReturnType<typeof getChampionsByTrait>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return createListQueryHook({
    queryKey: championKeys.byTrait,
    queryFn: getChampionsByTrait,
    enabled: (traitKey?: string) => !!traitKey,
  })(traitKey, queryOptions);
};

