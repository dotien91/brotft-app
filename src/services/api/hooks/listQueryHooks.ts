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
import {
  getTftUnits,
  getTftUnitById,
  getTftUnitByApiName,
  getTftUnitsByCost,
} from '../tft-units';
import {
  getTftTraits,
  getTftTraitById,
  getTftTraitByApiName,
} from '../tft-traits';
import {
  getTftItems,
  getTftItemById,
  getTftItemByApiName,
} from '../tft-items';
import {
  getTftAugments,
  getTftAugmentById,
  getTftAugmentByApiName,
} from '../tft-augments';
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
import type {
  ITftUnitsQueryParams,
  ITftUnitsFilters,
  ITftUnit,
} from '@services/models/tft-unit';
import type {
  ITftTraitsQueryParams,
  ITftTrait,
} from '@services/models/tft-trait';
import type {
  ITftItemsQueryParams,
  ITftItem,
} from '@services/models/tft-item';
import type {
  ITftAugmentsQueryParams,
  ITftAugmentsFilters,
  ITftAugmentsSort,
  ITftAugment,
} from '@services/models/tft-augment';

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

// ============= TFT UNITS HOOKS =============

// Query keys for TFT units
export const tftUnitKeys = {
  all: ['tft-units'] as const,
  lists: () => [...tftUnitKeys.all, 'list'] as const,
  list: (params?: ITftUnitsQueryParams) =>
    [...tftUnitKeys.lists(), params] as const,
  details: () => [...tftUnitKeys.all, 'detail'] as const,
  detail: (id: string) => [...tftUnitKeys.details(), id] as const,
  byApiName: (apiName: string) => [...tftUnitKeys.all, 'apiName', apiName] as const,
  byCost: (cost: number) => [...tftUnitKeys.all, 'cost', cost] as const,
};

// Get all TFT units with pagination and filters
export const useTftUnits = (
  params?: ITftUnitsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftUnits>>,
      Error,
      Awaited<ReturnType<typeof getTftUnits>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    ITftUnitsQueryParams,
    Awaited<ReturnType<typeof getTftUnits>>,
    Awaited<ReturnType<typeof getTftUnits>>
  >({
    queryKey: tftUnitKeys.list,
    queryFn: getTftUnits,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for TFT units
export const useTftUnitsWithPagination = (
  limit: number = 10,
  filters?: ITftUnitsFilters,
) => {
  const [page, setPage] = useState(1);
  const [allTftUnits, setAllTftUnits] = useState<ITftUnit[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Create params object - ensure filters object identity changes when filters change
  const queryParams = useMemo(() => {
    const params: ITftUnitsQueryParams = {
      page,
      limit,
      filters: filters
        ? {
            name: filters.name || undefined,
            apiName: filters.apiName || undefined,
            trait: filters.trait || undefined,
            cost: filters.cost !== undefined ? filters.cost : undefined,
            role: filters.role || undefined,
          }
        : undefined,
    };
    return params;
  }, [page, limit, filters]);

  const {
    data: tftUnitsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTftUnits(queryParams, {
    // Ensure query refetches when filters change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to refetch on filter change
  });

  // Reset when filters change - must run before data effect
  useEffect(() => {
    setPage(1);
    setAllTftUnits([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [filters]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (tftUnitsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftUnits(tftUnitsData.data);
      } else {
        // Append new data when loading more
        setAllTftUnits(prev => [...prev, ...tftUnitsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (tftUnitsData.hasNextPage !== undefined) {
        setHasMore(tftUnitsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [tftUnitsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      tftUnitsData?.hasNextPage !== undefined
        ? tftUnitsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && tftUnitsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllTftUnits([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allTftUnits,
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

// Get TFT unit by ID
export const useTftUnitById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftUnitById>>,
      Error,
      Awaited<ReturnType<typeof getTftUnitById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftUnitKeys.detail(id),
    queryFn: () => getTftUnitById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get TFT unit by API name
export const useTftUnitByApiName = (
  apiName: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftUnitByApiName>>,
      Error,
      Awaited<ReturnType<typeof getTftUnitByApiName>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftUnitKeys.byApiName(apiName),
    queryFn: () => getTftUnitByApiName(apiName),
    enabled: !!apiName,
    ...queryOptions,
  });
};

// Get TFT units by cost
export const useTftUnitsByCost = (
  cost: number,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftUnitsByCost>>,
      Error,
      Awaited<ReturnType<typeof getTftUnitsByCost>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return createListQueryHook({
    queryKey: tftUnitKeys.byCost,
    queryFn: getTftUnitsByCost,
    enabled: (cost?: number) => !!cost && cost >= 1 && cost <= 5,
  })(cost, queryOptions);
};

// ============= TFT TRAITS HOOKS =============

// Query keys for TFT traits
export const tftTraitKeys = {
  all: ['tft-traits'] as const,
  lists: () => [...tftTraitKeys.all, 'list'] as const,
  list: (params?: ITftTraitsQueryParams) =>
    [...tftTraitKeys.lists(), params] as const,
  details: () => [...tftTraitKeys.all, 'detail'] as const,
  detail: (id: string) => [...tftTraitKeys.details(), id] as const,
  byApiName: (apiName: string) => [...tftTraitKeys.all, 'apiName', apiName] as const,
};

// Get all TFT traits with pagination and filters
export const useTftTraits = (
  params?: ITftTraitsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftTraits>>,
      Error,
      Awaited<ReturnType<typeof getTftTraits>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    ITftTraitsQueryParams,
    Awaited<ReturnType<typeof getTftTraits>>,
    Awaited<ReturnType<typeof getTftTraits>>
  >({
    queryKey: tftTraitKeys.list,
    queryFn: getTftTraits,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for TFT traits
export const useTftTraitsWithPagination = (limit: number = 20) => {
  const [page, setPage] = useState(1);
  const [allTftTraits, setAllTftTraits] = useState<ITftTrait[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: tftTraitsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTftTraits({page, limit});

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (tftTraitsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftTraits(tftTraitsData.data);
      } else {
        // Append new data when loading more
        setAllTftTraits(prev => [...prev, ...tftTraitsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (tftTraitsData.hasNextPage !== undefined) {
        setHasMore(tftTraitsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [tftTraitsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      tftTraitsData?.hasNextPage !== undefined
        ? tftTraitsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && tftTraitsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllTftTraits([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allTftTraits,
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

// Get TFT trait by ID
export const useTftTraitById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftTraitById>>,
      Error,
      Awaited<ReturnType<typeof getTftTraitById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftTraitKeys.detail(id),
    queryFn: () => getTftTraitById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get TFT trait by API name
export const useTftTraitByApiName = (
  apiName: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftTraitByApiName>>,
      Error,
      Awaited<ReturnType<typeof getTftTraitByApiName>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftTraitKeys.byApiName(apiName),
    queryFn: () => getTftTraitByApiName(apiName),
    enabled: !!apiName,
    ...queryOptions,
  });
};

// ============= TFT ITEMS HOOKS =============

// Query keys for TFT items
export const tftItemKeys = {
  all: ['tft-items'] as const,
  lists: () => [...tftItemKeys.all, 'list'] as const,
  list: (params?: ITftItemsQueryParams) =>
    [...tftItemKeys.lists(), params] as const,
  details: () => [...tftItemKeys.all, 'detail'] as const,
  detail: (id: string) => [...tftItemKeys.details(), id] as const,
  byApiName: (apiName: string) => [...tftItemKeys.all, 'apiName', apiName] as const,
};

// Get all TFT items with pagination and filters
export const useTftItems = (
  params?: ITftItemsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftItems>>,
      Error,
      Awaited<ReturnType<typeof getTftItems>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    ITftItemsQueryParams,
    Awaited<ReturnType<typeof getTftItems>>,
    Awaited<ReturnType<typeof getTftItems>>
  >({
    queryKey: tftItemKeys.list,
    queryFn: getTftItems,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for TFT items
export const useTftItemsWithPagination = (limit: number = 20) => {
  const [page, setPage] = useState(1);
  const [allTftItems, setAllTftItems] = useState<ITftItem[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const {
    data: tftItemsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTftItems({page, limit});

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (tftItemsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftItems(tftItemsData.data);
      } else {
        // Append new data when loading more
        setAllTftItems(prev => [...prev, ...tftItemsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (tftItemsData.hasNextPage !== undefined) {
        setHasMore(tftItemsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [tftItemsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      tftItemsData?.hasNextPage !== undefined
        ? tftItemsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && tftItemsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllTftItems([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allTftItems,
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

// Get TFT item by ID
export const useTftItemById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftItemById>>,
      Error,
      Awaited<ReturnType<typeof getTftItemById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftItemKeys.detail(id),
    queryFn: () => getTftItemById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get TFT item by API name
export const useTftItemByApiName = (
  apiName: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftItemByApiName>>,
      Error,
      Awaited<ReturnType<typeof getTftItemByApiName>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftItemKeys.byApiName(apiName),
    queryFn: () => getTftItemByApiName(apiName),
    enabled: !!apiName,
    ...queryOptions,
  });
};

// ============= TFT AUGMENTS HOOKS =============

// Query keys for TFT augments
export const tftAugmentKeys = {
  all: ['tft-augments'] as const,
  lists: () => [...tftAugmentKeys.all, 'list'] as const,
  list: (params?: ITftAugmentsQueryParams) =>
    [...tftAugmentKeys.lists(), params] as const,
  details: () => [...tftAugmentKeys.all, 'detail'] as const,
  detail: (id: string) => [...tftAugmentKeys.details(), id] as const,
  byApiName: (apiName: string) => [...tftAugmentKeys.all, 'apiName', apiName] as const,
};

// Get all TFT augments with pagination and filters
export const useTftAugments = (
  params?: ITftAugmentsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftAugments>>,
      Error,
      Awaited<ReturnType<typeof getTftAugments>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createOptionalListQueryHook<
    ITftAugmentsQueryParams,
    Awaited<ReturnType<typeof getTftAugments>>,
    Awaited<ReturnType<typeof getTftAugments>>
  >({
    queryKey: tftAugmentKeys.list,
    queryFn: getTftAugments,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for TFT augments
export const useTftAugmentsWithPagination = (
  limit: number = 20,
  filters?: ITftAugmentsFilters,
  sort?: ITftAugmentsSort[],
) => {
  const [page, setPage] = useState(1);
  const [allTftAugments, setAllTftAugments] = useState<ITftAugment[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Create params object - ensure filters object identity changes when filters change
  const queryParams = useMemo(() => {
    const params: ITftAugmentsQueryParams = {
      page,
      limit,
      filters: filters
        ? {
            ...(filters.name && {name: filters.name}),
            ...(filters.apiName && {apiName: filters.apiName}),
            ...(filters.trait && {trait: filters.trait}),
            ...(filters.stage && {stage: filters.stage}),
            ...(filters.unique !== undefined && {unique: filters.unique}),
          }
        : undefined,
      sort,
    };
    return params;
  }, [page, limit, filters, sort]);

  const {
    data: tftAugmentsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTftAugments(queryParams, {
    // Ensure query refetches when filters change
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always consider data stale to refetch on filter change
  });

  // Reset when filters or sort change - must run before data effect
  useEffect(() => {
    setPage(1);
    setAllTftAugments([]);
    setHasMore(true);
    setIsLoadingMore(false);
  }, [filters, sort]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    // Only process data if we have tftAugmentsData (even if empty array)
    if (tftAugmentsData !== undefined) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftAugments(tftAugmentsData.data || []);
      } else {
        // Append new data when loading more
        setAllTftAugments(prev => [...prev, ...(tftAugmentsData.data || [])]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (tftAugmentsData.hasNextPage !== undefined) {
        setHasMore(tftAugmentsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [tftAugmentsData, page]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      tftAugmentsData?.hasNextPage !== undefined
        ? tftAugmentsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && tftAugmentsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllTftAugments([]);
    setHasMore(true);
    refetch();
  };

  return {
    data: allTftAugments,
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

// Get TFT augment by ID
export const useTftAugmentById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftAugmentById>>,
      Error,
      Awaited<ReturnType<typeof getTftAugmentById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftAugmentKeys.detail(id),
    queryFn: () => getTftAugmentById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get TFT augment by API name
export const useTftAugmentByApiName = (
  apiName: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getTftAugmentByApiName>>,
      Error,
      Awaited<ReturnType<typeof getTftAugmentByApiName>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: tftAugmentKeys.byApiName(apiName),
    queryFn: () => getTftAugmentByApiName(apiName),
    enabled: !!apiName,
    ...queryOptions,
  });
};

// ============= TRAITS HOOKS (Legacy) =============

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
      console.log('[traitKeys.list] serializedParams:', serializedParams);
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

