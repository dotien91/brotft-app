import {useQuery} from '@tanstack/react-query';
import {
  getChampions,
  getChampionById,
  getChampionByKey,
  getChampionsByCost,
  getChampionsByTrait,
} from '../champions';
import type {IChampionsQueryParams} from '@services/models/champion';

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

// Get all champions with pagination and filters
export const useChampions = (params?: IChampionsQueryParams) => {
  return useQuery({
    queryKey: championKeys.list(params),
    queryFn: () => getChampions(params),
  });
};

// Get champion by ID
export const useChampionById = (id: string) => {
  return useQuery({
    queryKey: championKeys.detail(id),
    queryFn: () => getChampionById(id),
    enabled: !!id,
  });
};

// Get champion by key
export const useChampionByKey = (key: string) => {
  return useQuery({
    queryKey: championKeys.byKey(key),
    queryFn: () => getChampionByKey(key),
    enabled: !!key,
  });
};

// Get champions by cost
export const useChampionsByCost = (cost: number) => {
  return useQuery({
    queryKey: championKeys.byCost(cost),
    queryFn: () => getChampionsByCost(cost),
    enabled: !!cost && cost >= 1 && cost <= 5,
  });
};

// Get champions by trait
export const useChampionsByTrait = (traitKey: string) => {
  return useQuery({
    queryKey: championKeys.byTrait(traitKey),
    queryFn: () => getChampionsByTrait(traitKey),
    enabled: !!traitKey,
  });
};

