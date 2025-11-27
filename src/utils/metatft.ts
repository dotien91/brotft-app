/**
 * Utility functions for MetaTFT CDN image URLs
 * Base URL pattern: https://cdn.metatft.com/cdn-cgi/image/width={w},height={h},format=auto/https://cdn.metatft.com/file/metatft/{type}/{key}.{ext}
 */

/**
 * Format API name for MetaTFT CDN
 * @param apiName - API name from unit (e.g., "TFT16_Tristana" or "Tristana")
 * @returns Formatted key (e.g., "tft16_tristana")
 */
export const formatApiNameForMetaTft = (apiName?: string | null): string => {
  if (!apiName) return '';
  // If already starts with tft, use as is, otherwise add tft16_ prefix
  const formatted = apiName.startsWith('tft') 
    ? apiName.toLowerCase() 
    : `${apiName.toLowerCase()}`;
  return formatted;
};

/**
 * Get unit avatar URL from MetaTFT CDN
 * @param apiName - API name from unit
 * @param size - Image size (default: 64)
 * @returns Avatar URL
 */
export const getUnitAvatarUrl = (
  apiName?: string | null,
  size: number = 64,
): string => {
  const formattedKey = formatApiNameForMetaTft(apiName);
  if (!formattedKey) return '';
  
  return `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
};

/**
 * Get unit splash art URL from MetaTFT CDN
 * @param apiName - API name from unit
 * @param width - Image width (default: 768)
 * @param height - Image height (default: 456)
 * @returns Splash art URL
 */
export const getUnitSplashUrl = (
  apiName?: string | null,
  width: number = 768,
  height: number = 456,
): string => {
  const formattedKey = formatApiNameForMetaTft(apiName);
  if (!formattedKey) return '';
  
  return `https://cdn.metatft.com/cdn-cgi/image/width=${width},height=${height},format=auto/https://cdn.metatft.com/file/metatft/championsplashes/${formattedKey}.jpg`;
};

/**
 * Get unit ability icon URL from MetaTFT CDN
 * @param apiName - API name from unit
 * @param size - Image size (default: 50)
 * @returns Ability icon URL
 */
export const getUnitAbilityIconUrl = (
  apiName?: string | null,
  size: number = 50,
): string => {
  const formattedKey = formatApiNameForMetaTft(apiName);
  if (!formattedKey) return '';
  
  return `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
};

/**
 * Format trait name for MetaTFT CDN
 * @param traitName - Trait name (e.g., "Darkin Weapon" or "darkinweapon")
 * @returns Formatted trait name (e.g., "darkinweapon")
 */
export const formatTraitNameForMetaTft = (traitName?: string | null): string => {
  if (!traitName) return '';
  // Remove spaces, convert to lowercase
  return traitName.toLowerCase().replace(/\s+/g, '');
};

/**
 * Get trait icon URL from MetaTFT CDN
 * @param traitName - Trait name
 * @param size - Image size (default: 24)
 * @returns Trait icon URL
 */
export const getTraitIconUrl = (
  traitName?: string | null,
  size: number = 24,
): string => {
  const formattedTrait = formatTraitNameForMetaTft(traitName);
  if (!formattedTrait) return '';
  
  return `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/traits/${formattedTrait}.png`;
};

