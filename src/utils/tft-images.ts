import {API_BASE_URL, TFT_SEASON_ID} from '@shared-constants';

export type TftImageType = 'unit' | 'item';

interface TftImageIdentity {
  season_id?: string | null;
  slug?: string | null;
}

export const getTftImageUrl = (
  type: TftImageType,
  data?: TftImageIdentity | null,
): string => {
  if (!data?.slug) return '';

  const seasonId = data.season_id || TFT_SEASON_ID;
  const setPrefix = `set${seasonId}-`;
  const normalizedSlug = data.slug.toLowerCase().startsWith(setPrefix)
    ? data.slug.slice(setPrefix.length)
    : data.slug;
  const path =
    type === 'unit'
      ? `champions/icons/set${seasonId}`
      : `items/set${seasonId}`;

  return `${API_BASE_URL}/api/images/${path}/${encodeURIComponent(normalizedSlug)}.png`;
};

export const getUnitImageUrl = (unit?: TftImageIdentity | null): string =>
  getTftImageUrl('unit', unit);

export const getItemImageUrl = (item?: TftImageIdentity | null): string =>
  getTftImageUrl('item', item);

export const normalizeTftUnitLookupKey = (
  value?: string | null,
): string => {
  if (!value) return '';

  const filename = value.split('/').pop()?.replace(/\.[^.]+$/, '') || value;
  const normalized = filename
    .toLowerCase()
    .replace(/^tft\d+[_-]?/, '')
    .replace(/^set\d+[_-]?/, '')
    .replace(/[^a-z0-9]/g, '');

  // Composition crawler can include descriptive prefixes that are not part
  // of the canonical Unit slug returned by /tft-units.
  return normalized.replace(/^(the|ancient)/, '');
};

export const getTftUnitLookupKeys = (unit: {
  apiName?: string | null;
  characterName?: string | null;
  championId?: string | null;
  championKey?: string | null;
  name?: string | null;
  slug?: string | null;
  image?: string | null;
}): string[] => {
  const rawKeys = [
    unit.apiName,
    unit.characterName,
    unit.championId,
    unit.championKey,
    unit.name,
    unit.slug,
    unit.image,
  ].filter(Boolean) as string[];

  return Array.from(
    new Set([
      ...rawKeys,
      ...rawKeys.map(normalizeTftUnitLookupKey).filter(Boolean),
    ]),
  );
};
