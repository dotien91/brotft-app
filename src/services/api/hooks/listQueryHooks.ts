import {useState, useEffect, useMemo} from 'react';
import {useQuery, type UseQueryOptions} from '@tanstack/react-query';
import {
  getChampions,
  getChampionById,
  getChampionByKey,
  getChampionsByCost,
  getChampionsByTrait,
} from '../champions';
import {getTraits, getTraitById} from '../traits';
import {getItems, getItemById, getItemByApiName} from '../items';
import type {
  IChampionsQueryParams,
  IChampion,
} from '@services/models/champion';
import type {
  ITraitsQueryParams,
  ITraitsFilters,
  ITrait,
} from '@services/models/trait';
import type {
  IItemsQueryParams,
  IItemsFilters,
  IItem,
} from '@services/models/item';

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

// ============= TRAITS HOOKS =============

// Query keys for traits
export const traitKeys = {
  all: ['traits'] as const,
  lists: () => [...traitKeys.all, 'list'] as const,
  list: (params?: ITraitsQueryParams) => {
    // Serialize params to ensure queryKey changes when filters change
    const serializedParams = params
      ? {
          page: params.page,
          limit: params.limit,
          filters: params.filters
            ? {
                type: params.filters.type || null,
                name: params.filters.name || null,
                key: params.filters.key || null,
                set: params.filters.set || null,
              }
            : null,
        }
      : undefined;
    return [...traitKeys.lists(), serializedParams] as const;
  },
  details: () => [...traitKeys.all, 'detail'] as const,
  detail: (id: string) => [...traitKeys.details(), id] as const,
};

// Get all traits with pagination and filters
export const useTraits = (
  params?: ITraitsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTraits>>,
      Error,
      Awaited<ReturnType<typeof getTraits>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    ITraitsQueryParams,
    Awaited<ReturnType<typeof getTraits>>,
    Awaited<ReturnType<typeof getTraits>>
  >({
    queryKey: traitKeys.list,
    queryFn: getTraits,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for traits
export const useTraitsWithPagination = (
  limit: number = 10,
  filters?: ITraitsFilters,
) => {
  const [page, setPage] = useState(1);
  const [allTraits, setAllTraits] = useState<ITrait[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Create params object - ensure filters object identity changes when filters change
  const queryParams = useMemo(() => {
    const params = {
      page,
      limit,
      filters: filters
        ? {
            type: filters.type || null,
            name: filters.name || null,
            key: filters.key || null,
            set: filters.set || null,
          }
        : undefined,
    };
    console.log('[useTraitsWithPagination] Creating queryParams with filters:', filters);
    console.log('[useTraitsWithPagination] queryParams:', JSON.stringify(params, null, 2));
    return params;
  }, [page, limit, filters]);

  const {
    data: traitsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTraits(queryParams, {
    // Ensure query refetches when filters change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to refetch on filter change
  });

  // Reset when filters change - must run before data effect
  useEffect(() => {
    setPage(1);
    setAllTraits([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [filters]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    // Only process data if we have traitsData (even if empty array)
    if (traitsData !== undefined) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTraits(traitsData.data || []);
      } else {
        // Append new data when loading more
        setAllTraits(prev => [...prev, ...(traitsData.data || [])]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (traitsData.hasNextPage !== undefined) {
        setHasMore(traitsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [traitsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      traitsData?.hasNextPage !== undefined
        ? traitsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && traitsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllTraits([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allTraits,
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

// Get trait by ID
export const useTraitById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTraitById>>,
      Error,
      Awaited<ReturnType<typeof getTraitById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: traitKeys.detail(id),
    queryFn: () => getTraitById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// ============= ITEMS HOOKS =============

// Query keys for items
export const itemKeys = {
  all: ['items'] as const,
  lists: () => [...itemKeys.all, 'list'] as const,
  list: (params?: IItemsQueryParams) =>
    [...itemKeys.lists(), params] as const,
  details: () => [...itemKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemKeys.details(), id] as const,
  byApiName: (apiName: string) => [...itemKeys.all, 'apiName', apiName] as const,
};

// Get all items with pagination and filters
export const useItems = (
  params?: IItemsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getItems>>,
      Error,
      Awaited<ReturnType<typeof getItems>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    IItemsQueryParams,
    Awaited<ReturnType<typeof getItems>>,
    Awaited<ReturnType<typeof getItems>>
  >({
    queryKey: itemKeys.list,
    queryFn: getItems,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for items
export const useItemsWithPagination = (limit: number = 20) => {
  const [page, setPage] = useState(1);
  const [allItems, setAllItems] = useState<IItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: itemsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useItems({page, limit});

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (itemsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllItems(itemsData.data);
      } else {
        // Append new data when loading more
        setAllItems(prev => [...prev, ...itemsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (itemsData.hasNextPage !== undefined) {
        setHasMore(itemsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [itemsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      itemsData?.hasNextPage !== undefined
        ? itemsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && itemsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllItems([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allItems,
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

// Get item by ID
export const useItemById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getItemById>>,
      Error,
      Awaited<ReturnType<typeof getItemById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: itemKeys.detail(id),
    queryFn: () => getItemById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get item by API name
export const useItemByApiName = (
  apiName: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getItemByApiName>>,
      Error,
      Awaited<ReturnType<typeof getItemByApiName>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: itemKeys.byApiName(apiName),
    queryFn: () => getItemByApiName(apiName),
    enabled: !!apiName,
    ...queryOptions,
  });
};

