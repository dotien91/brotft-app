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
import {
  getCompositions,
  getCompositionById,
  getCompositionByCompId,
} from '../compositions';
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
import type {
  ICompositionsQueryParams,
  IComposition,
} from '@services/models/composition';

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
  const [isNoData, setIsNoData] = useState(false);

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
        setIsNoData(championsData.data.length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allChampions.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allChampions.length, isError]);

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
    setIsNoData(false);
    refetch();
  };

  return {
    data: allChampions,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isNoData, setIsNoData] = useState(false);

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

  // Track refresh state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Reset when filters change - must run before data effect
  useEffect(() => {
    setPage(1);
    setAllTftUnits([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setIsNoData(false);
  }, [filters]);

  // Refetch when page is set to 1 during refresh
  useEffect(() => {
    if (isRefreshing && page === 1) {
      refetch();
      setIsRefreshing(false);
    }
  }, [page, isRefreshing, refetch]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (tftUnitsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftUnits(tftUnitsData.data);
        setIsNoData(tftUnitsData.data.length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allTftUnits.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allTftUnits.length, isError]);

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
    setAllTftUnits([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setIsNoData(false);
    setIsRefreshing(true);
    setPage(1);
  };

  return {
    data: allTftUnits,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isNoData, setIsNoData] = useState(false);

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
        setIsNoData(tftTraitsData.data.length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allTftTraits.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allTftTraits.length, isError]);

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
    setIsLoadingMore(false);
    setIsNoData(false);
    // Don't call refetch() here - let React Query refetch automatically when page changes
  };

  return {
    data: allTftTraits,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isNoData, setIsNoData] = useState(false);

  const {
    data: tftItemsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useTftItems({page, limit});

  // Refetch when page is set to 1 during refresh
  useEffect(() => {
    if (isRefreshing && page === 1) {
      refetch();
      setIsRefreshing(false);
    }
  }, [page, isRefreshing, refetch]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (tftItemsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftItems(tftItemsData.data);
        setIsNoData(tftItemsData.data.length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allTftItems.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allTftItems.length, isError]);

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
    setAllTftItems([]);
    setHasMore(true);
    setIsLoadingMore(false);
    setIsNoData(false);
    setIsRefreshing(true);
    setPage(1);
  };

  return {
    data: allTftItems,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isNoData, setIsNoData] = useState(false);

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
    setIsNoData(false);
  }, [filters, sort]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    // Only process data if we have tftAugmentsData (even if empty array)
    if (tftAugmentsData !== undefined) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTftAugments(tftAugmentsData.data || []);
        setIsNoData((tftAugmentsData.data || []).length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allTftAugments.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allTftAugments.length, isError]);

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
    setIsNoData(false);
    refetch();
  };

  return {
    data: allTftAugments,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isNoData, setIsNoData] = useState(false);

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
    setIsNoData(false);
  }, [filters]);

  // Handle data accumulation and hasMore state
  useEffect(() => {
    // Only process data if we have traitsData (even if empty array)
    if (traitsData !== undefined) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllTraits(traitsData.data || []);
        setIsNoData((traitsData.data || []).length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allTraits.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allTraits.length, isError]);

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
    setIsNoData(false);
    refetch();
  };

  return {
    data: allTraits,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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
  const [isNoData, setIsNoData] = useState(false);

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
        setIsNoData(itemsData.data.length === 0);
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

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allItems.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allItems.length, isError]);

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
    setIsNoData(false);
    refetch();
  };

  return {
    data: allItems,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
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

// Query keys for compositions
export const compositionKeys = {
  all: ['compositions'] as const,
  lists: () => [...compositionKeys.all, 'list'] as const,
  list: (params?: ICompositionsQueryParams) =>
    [...compositionKeys.lists(), params] as const,
  details: () => [...compositionKeys.all, 'detail'] as const,
  detail: (id: string) => [...compositionKeys.details(), id] as const,
};

// Get compositions with pagination
export const useCompositions = (
  params?: ICompositionsQueryParams,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getCompositions>>,
      Error,
      Awaited<ReturnType<typeof getCompositions>>
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  return createListQueryHook({
    queryKey: compositionKeys.list,
    queryFn: getCompositions,
  })(params, queryOptions);
};

// Hook with pagination handling built-in for compositions
export const useCompositionsWithPagination = (limit: number = 10) => {
  const [page, setPage] = useState(1);
  const [allCompositions, setAllCompositions] = useState<IComposition[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isNoData, setIsNoData] = useState(false);

  const {
    data: compositionsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useCompositions({page, limit}, {
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  // Handle data accumulation and hasMore state
  useEffect(() => {
    if (compositionsData?.data) {
      if (page === 1) {
        // Reset on first load or refresh
        setAllCompositions(compositionsData.data);
        setIsNoData(compositionsData.data.length === 0);
      } else {
        // Append new data when loading more
        setAllCompositions(prev => [...prev, ...compositionsData.data]);
        setIsLoadingMore(false);
      }
      // Update hasMore based on hasNextPage from API
      if (compositionsData.hasNextPage !== undefined) {
        setHasMore(compositionsData.hasNextPage);
      } else {
        // Default to false if hasNextPage is not provided
        setHasMore(false);
      }
    }
  }, [compositionsData, page]);

  // Update isNoData when data changes
  useEffect(() => {
    if (!isLoading && allCompositions.length === 0 && !isError) {
      setIsNoData(true);
    } else {
      setIsNoData(false);
    }
  }, [isLoading, allCompositions.length, isError]);

  const loadMore = () => {
    // Only load more if not currently loading and there's more data available
    const canLoadMore =
      compositionsData?.hasNextPage !== undefined
        ? compositionsData.hasNextPage
        : hasMore;

    if (!isLoadingMore && canLoadMore && compositionsData?.data) {
      setIsLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const refresh = () => {
    setPage(1);
    setAllCompositions([]);
    setHasMore(true);
    setIsNoData(false);
    refetch();
  };

  return {
    data: allCompositions,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
    refresh,
    isRefetching: isRefetching && page === 1,
  };
};

// Get composition by ID
export const useCompositionById = (
  id: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getCompositionById>>,
      Error,
      Awaited<ReturnType<typeof getCompositionById>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: compositionKeys.detail(id),
    queryFn: () => getCompositionById(id),
    enabled: !!id,
    ...queryOptions,
  });
};

// Get composition by compId
export const useCompositionByCompId = (
  compId: string,
  queryOptions?: Omit<
    UseQueryOptions<
      Awaited<ReturnType<typeof getCompositionByCompId>>,
      Error,
      Awaited<ReturnType<typeof getCompositionByCompId>>
    >,
    'queryKey' | 'queryFn' | 'enabled'
  >,
) => {
  return useQuery({
    queryKey: [...compositionKeys.all, 'compId', compId],
    queryFn: () => getCompositionByCompId(compId),
    enabled: !!compId,
    ...queryOptions,
  });
};

