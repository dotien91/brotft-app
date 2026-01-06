/**
 * Utility functions for MetaTFT CDN image URLs with fallback to apporastudio API
 * Base URL pattern: https://cdn.metatft.com/cdn-cgi/image/width={w},height={h},format=auto/https://cdn.metatft.com/file/metatft/{type}/{key}.{ext}
 * Fallback: https://api.apporastudio.com/images/{type}/{key}.{ext}
 */

import {API_BASE_URL} from '../shared/constants';

/**
 * Generate apporastudio API fallback URL for images
 * @param type - Image type: 'champions', 'championsplashes', 'traits', 'augments', 'items'
 * @param key - Formatted key (e.g., "tft16_tristana")
 * @param extension - File extension (default: "png")
 * @returns Fallback URL from apporastudio API
 */
const getApporastudioFallbackUrl = (
  type: 'champions' | 'championsplashes' | 'traits' | 'augments' | 'items',
  key: string,
  extension: string = 'png',
): string => {
  if (!key) return '';
  return `${API_BASE_URL}/images/${type}/${key}.${extension}`;
};

/**
 * Get URLs with primary (MetaTFT) and fallback (apporastudio)
 * @param primaryUrl - Primary MetaTFT CDN URL
 * @param type - Image type for fallback
 * @param key - Formatted key for fallback
 * @param extension - File extension for fallback (default: "png")
 * @returns Object with primary and fallback URLs
 */
const getUrlsWithFallback = (
  primaryUrl: string,
  type: 'champions' | 'championsplashes' | 'traits' | 'augments' | 'items',
  key: string,
  extension: string = 'png',
): {primary: string; fallback: string} => {
  return {
    primary: primaryUrl,
    fallback: getApporastudioFallbackUrl(type, key, extension),
  };
};

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
 * Get unit avatar URLs with fallback
 * @param apiName - API name from unit
 * @param size - Image size (default: 64)
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getUnitAvatarUrls = (
  apiName?: string | null,
  size: number = 64,
): {primary: string; fallback: string} => {
  const formattedKey = formatApiNameForMetaTft(apiName);
  if (!formattedKey) return {primary: '', fallback: ''};
  
  const primaryUrl = `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'champions', formattedKey, 'png');
};

/**
 * Get unit avatar URL from MetaTFT CDN (primary only, for backward compatibility)
 * @param apiName - API name from unit
 * @param size - Image size (default: 64)
 * @returns Primary avatar URL
 */
export const getUnitAvatarUrl = (
  apiName?: string | null,
  size: number = 64,
): string => {
  return getUnitAvatarUrls(apiName, size).primary;
};

/**
 * Get unit splash art URLs with fallback
 * @param apiName - API name from unit
 * @param width - Image width (default: 768)
 * @param height - Image height (default: 456)
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getUnitSplashUrls = (
  apiName?: string | null,
  width: number = 768,
  height: number = 456,
): {primary: string; fallback: string} => {
  const formattedKey = formatApiNameForMetaTft(apiName);
  if (!formattedKey) return {primary: '', fallback: ''};
  
  const primaryUrl = `https://cdn.metatft.com/cdn-cgi/image/width=${width},height=${height},format=auto/https://cdn.metatft.com/file/metatft/championsplashes/${formattedKey}.jpg`;
  return getUrlsWithFallback(primaryUrl, 'championsplashes', formattedKey, 'jpg');
};

/**
 * Get unit splash art URL from MetaTFT CDN (primary only, for backward compatibility)
 * @param apiName - API name from unit
 * @param width - Image width (default: 768)
 * @param height - Image height (default: 456)
 * @returns Primary splash art URL
 */
export const getUnitSplashUrl = (
  apiName?: string | null,
  width: number = 768,
  height: number = 456,
): string => {
  return getUnitSplashUrls(apiName, width, height).primary;
};

/**
 * Get unit ability icon URLs with fallback
 * Supports multiple formats: tft16_{championName}_r.png (ultimate) or tft16_{championName}_e.png (ability E)
 * @param apiName - API name from unit (e.g., "TFT16_Seraphine" or "Seraphine")
 * @param size - Image size (default: 64)
 * @param suffix - Ability suffix: 'r' for ultimate (default), 'e' for ability E, or null to try both
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getUnitAbilityIconUrls = (
  apiName?: string | null,
  size: number = 64,
  suffix: 'r' | 'e' | null = null,
): {primary: string; fallback: string} => {
  if (!apiName) return {primary: '', fallback: ''};
  
  // Format API name: TFT16_Seraphine -> tft16_seraphine
  // Or Seraphine -> tft16_seraphine (assume TFT16 if no prefix)
  let formattedKey = '';
  if (apiName.toLowerCase().startsWith('tft')) {
    formattedKey = apiName.toLowerCase();
  } else {
    formattedKey = `tft16_${apiName.toLowerCase()}`;
  }
  
  // Use specified suffix or default to 'r' (ultimate)
  const abilitySuffix = suffix || 'r';
  const abilityKey = `${formattedKey}_${abilitySuffix}`;
  
  const primaryUrl = `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/champions/${abilityKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'champions', abilityKey, 'png');
};

/**
 * Get unit ability icon URL from MetaTFT CDN (primary only, for backward compatibility)
 * @param apiName - API name from unit (e.g., "TFT16_Seraphine" or "Seraphine")
 * @param size - Image size (default: 64)
 * @param suffix - Ability suffix: 'r' for ultimate (default), 'e' for ability E, or null to try both
 * @returns Primary ability icon URL
 */
export const getUnitAbilityIconUrl = (
  apiName?: string | null,
  size: number = 64,
  suffix: 'r' | 'e' | null = null,
): string => {
  return getUnitAbilityIconUrls(apiName, size, suffix).primary;
};

/**
 * Parse icon path from API and extract filename
 * Example: "ASSETS/Characters/TFT16_Sona/HUD/Icons2D/TFT16_Sona_Passive_Charged.TFT_Set16.tex"
 * Returns: "TFT16_Sona_Passive_Charged"
 * Example: "ASSETS/Characters/TFT16_Leonar/HUD/Icons2D/TFT16_Leonar.TFT_Set16.tex"
 * Returns: "TFT16_Leonar"
 */
export const parseIconPath = (iconPath?: string | null): string | null => {
  if (!iconPath) return null;
  
  // Extract filename from path (last part after /)
  const parts = iconPath.split('/');
  if (parts.length === 0) return null;
  
  const filename = parts[parts.length - 1];
  if (!filename) return null;
  
  // Remove all extensions (handle multiple dots like .TFT_Set16.tex)
  // Split by dot and take the first part (the actual filename)
  const nameWithoutExt = filename.split('.')[0];
  
  // Also handle case where filename might have .TFT_Set16.tex pattern
  // Remove .TFT_Set16 or similar patterns
  const cleanedName = nameWithoutExt.replace(/\.TFT_Set\d+$/i, '');
  
  return cleanedName || null;
};

/**
 * Get unit ability icon URLs with fallback based on icon path from API
 * Example: "ASSETS/Characters/TFT16_Sona/HUD/Icons2D/TFT16_Sona_Passive_Charged.TFT_Set16.tex"
 * -> Primary: "https://cdn.metatft.com/file/metatft/champions/tft16_sona_passive_charged.png"
 * -> Fallback: "https://api.apporastudio.com/images/champions/tft16_sona_passive_charged.png"
 * @param iconPath - Icon path from API
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs, or null if invalid
 */
export const getUnitAbilityIconUrlsFromPath = (
  iconPath?: string | null,
): {primary: string; fallback: string} | null => {
  if (!iconPath) return null;
  
  // Parse icon path to get filename
  const filename = parseIconPath(iconPath);
  if (!filename) return null;
  
  // Format filename: TFT16_Sona_Passive_Charged -> tft16_sona_passive_charged
  const formattedKey = filename.toLowerCase();
  
  const primaryUrl = `https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'champions', formattedKey, 'png');
};

/**
 * Get unit ability icon URL from MetaTFT CDN based on icon path from API (primary only, for backward compatibility)
 * @param iconPath - Icon path from API
 * @returns Primary ability icon URL or null
 */
export const getUnitAbilityIconUrlFromPath = (
  iconPath?: string | null,
): string | null => {
  const urls = getUnitAbilityIconUrlsFromPath(iconPath);
  return urls ? urls.primary : null;
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
 * Get trait icon URLs with fallback
 * @param traitName - Trait name (e.g., "Huntress" or "TFT16_Huntress")
 * @param _size - Image size (optional, not used for traits - kept for compatibility)
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getTraitIconUrls = (
  traitName?: string | null,
  _size?: number,
): {primary: string; fallback: string} => {
  const formattedTrait = formatTraitNameForMetaTft(traitName);
  if (!formattedTrait) return {primary: '', fallback: ''};
  
  // Remove tft16_ prefix if present
  const cleanTrait = formattedTrait.replace(/^tft\d+_/, '');
  
  const primaryUrl = `https://cdn.metatft.com/file/metatft/traits/${cleanTrait}.png`;
  return getUrlsWithFallback(primaryUrl, 'traits', cleanTrait, 'png');
};

/**
 * Get trait icon URL from MetaTFT CDN (primary only, for backward compatibility)
 * @param traitName - Trait name (e.g., "Huntress" or "TFT16_Huntress")
 * @param _size - Image size (optional, not used for traits - kept for compatibility)
 * @returns Primary trait icon URL
 */
export const getTraitIconUrl = (
  traitName?: string | null,
  _size?: number,
): string => {
  return getTraitIconUrls(traitName, _size).primary;
};

/**
 * Get augment icon URLs with fallback based on icon path from API
 * Example: "ASSETS/Maps/TFT/Icons/Augments/Hexcore/ChaosMagic_II.TFT_Set16.tex"
 * -> Primary: "https://cdn.metatft.com/file/metatft/augments/chaosmagic_ii.png"
 * -> Fallback: "https://api.apporastudio.com/images/augments/chaosmagic_ii.png"
 * @param iconPath - Icon path from API
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs, or null if invalid
 */
export const getAugmentIconUrlsFromPath = (
  iconPath?: string | null,
): {primary: string; fallback: string} | null => {
  if (!iconPath) return null;
  
  // Parse icon path to get filename
  const filename = parseIconPath(iconPath);
  if (!filename) return null;
  
  // Format filename: ChaosMagic_II -> chaosmagic_ii
  const formattedKey = filename.toLowerCase();
  
  const primaryUrl = `https://cdn.metatft.com/file/metatft/augments/${formattedKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'augments', formattedKey, 'png');
};

/**
 * Get augment icon URL from MetaTFT CDN based on icon path from API (primary only, for backward compatibility)
 * @param iconPath - Icon path from API
 * @returns Primary augment icon URL or null
 */
export const getAugmentIconUrlFromPath = (
  iconPath?: string | null,
): string | null => {
  const urls = getAugmentIconUrlsFromPath(iconPath);
  return urls ? urls.primary : null;
};

/**
 * Get augment icon URLs with fallback from augment name
 * Example: "bestfriends1" -> Primary: "https://cdn.metatft.com/file/metatft/augments/bestfriends1.png"
 * @param augmentName - Augment name (e.g., "bestfriends1", "backup-bows")
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getAugmentIconUrlsFromName = (
  augmentName?: string | null,
): {primary: string; fallback: string} => {
  if (!augmentName) return {primary: '', fallback: ''};
  
  // Format name: "bestfriends1" -> "bestfriends1"
  // "backup-bows" -> "backup-bows"
  const formattedKey = augmentName.toLowerCase();
  
  const primaryUrl = `https://cdn.metatft.com/file/metatft/augments/${formattedKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'augments', formattedKey, 'png');
};

/**
 * Get augment icon URL from augment name (primary only, for backward compatibility)
 * @param augmentName - Augment name (e.g., "bestfriends1", "backup-bows")
 * @returns Primary augment icon URL
 */
export const getAugmentIconUrlFromName = (
  augmentName?: string | null,
): string => {
  return getAugmentIconUrlsFromName(augmentName).primary;
};

/**
 * Get item icon URLs with fallback based on icon path from API
 * Example: "ASSETS/Maps/TFT/Icons/Items/Hexcore/TFT_Item_BFSword.TFT_Set13.tex"
 * -> Primary: "https://cdn.metatft.com/file/metatft/items/tft_item_bfsword.png"
 * -> Fallback: "https://api.apporastudio.com/images/items/tft_item_bfsword.png"
 * @param iconPath - Icon path from API
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") for fallback
 * @returns Object with primary (MetaTFT) and fallback (apporastudio) URLs
 */
export const getItemIconUrlsFromPath = (
  iconPath?: string | null,
  apiName?: string | null,
): {primary: string; fallback: string} => {
  let formattedKey = '';

  // Fallback to apiName if iconPath parsing fails
  if (apiName) {
    formattedKey = apiName.toLowerCase();
  } else {
    // Try to parse icon path to get filename
    const filename = parseIconPath(iconPath);
    if (filename) {
      // Format filename: TFT_Item_BFSword -> tft_item_bfsword
      formattedKey = filename.toLowerCase();
    }
  }

  if (!formattedKey) {
    return {primary: '', fallback: ''};
  }

  const primaryUrl = `https://cdn.metatft.com/file/metatft/items/${formattedKey}.png`;
  return getUrlsWithFallback(primaryUrl, 'items', formattedKey, 'png');
};

/**
 * Get item icon URL from MetaTFT CDN (primary only, for backward compatibility)
 * @param iconPath - Icon path from API
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") for fallback
 * @returns Primary item icon URL
 */
export const getItemIconUrlFromPath = (
  iconPath?: string | null,
  apiName?: string | null,
): string => {
  return getItemIconUrlsFromPath(iconPath, apiName).primary;
};

/**
 * Helper to wrap MetaTFT URL with CDN optimization
 */
const wrapWithCDN = (url: string, size: number): string => {
  // If already CDN-optimized, return as is
  if (url.includes('cdn-cgi/image')) {
    return url;
  }
  // If it's a MetaTFT file URL, wrap it with CDN
  if (url.includes('cdn.metatft.com/file/metatft')) {
    return `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/${url}`;
  }
  return url;
};

/**
 * Get item image URLs with CDN optimization and fallback
 * @param icon - Icon path or URL from API (optional)
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") - preferred
 * @param name - Item name as fallback (optional)
 * @param size - Image size for CDN optimization (default: 48)
 * @returns Object with primary (MetaTFT CDN-optimized) and fallback (apporastudio) URLs
 */
export const getItemImageUrlsWithCDN = (
  icon?: string | null,
  apiName?: string | null,
  name?: string | null,
  size: number = 48,
): {primary: string; fallback: string} => {
  // Helper to get MetaTFT URL from apiName
  const getMetaTftUrlFromApiName = (itemApiName: string): string => {
    // Format apiName: TFT_Item_BFSword -> tft_item_bfsword
    const formattedKey = itemApiName.toLowerCase();
    return `https://cdn.metatft.com/file/metatft/items/${formattedKey}.png`;
  };
  
  let formattedKey = '';
  
  // Try icon field first (from API)
  if (icon) {
    // If icon is already a full URL (CDN-optimized or MetaTFT)
    if (icon.startsWith('http')) {
      // Chỉ dùng nếu là MetaTFT URL
      if (icon.includes('cdn.metatft.com')) {
        const primaryUrl = wrapWithCDN(icon, size);
        // Extract key from URL for fallback
        const urlMatch = icon.match(/metatft\/items\/([^\.]+)\./);
        if (urlMatch && urlMatch[1]) {
          formattedKey = urlMatch[1];
          return getUrlsWithFallback(primaryUrl, 'items', formattedKey, 'png');
        }
        // If can't extract key, return primary only
        return {primary: primaryUrl, fallback: ''};
      }
      // Nếu không phải MetaTFT, bỏ qua và dùng apiName
    } else {
      // If icon is a path, use getItemIconUrlsFromPath utility
      const urls = getItemIconUrlsFromPath(icon, apiName || undefined);
      if (urls.primary && urls.primary.includes('cdn.metatft.com')) {
        return {
          primary: wrapWithCDN(urls.primary, size),
          fallback: urls.fallback,
        };
      }
    }
  }
  
  // Luôn dùng apiName để tạo MetaTFT URL
  if (apiName) {
    formattedKey = apiName.toLowerCase();
    const baseUrl = getMetaTftUrlFromApiName(apiName);
    const primaryUrl = wrapWithCDN(baseUrl, size);
    return getUrlsWithFallback(primaryUrl, 'items', formattedKey, 'png');
  }
  
  // Last resort: nếu không có apiName, thử từ name
  if (name) {
    formattedKey = name.toLowerCase().replace(/\s+/g, '_');
    const baseUrl = `https://cdn.metatft.com/file/metatft/items/${formattedKey}.png`;
    const primaryUrl = wrapWithCDN(baseUrl, size);
    return getUrlsWithFallback(primaryUrl, 'items', formattedKey, 'png');
  }
  
  // Return empty if nothing
  return {primary: '', fallback: ''};
};

/**
 * Get item image URL with CDN optimization (primary only, for backward compatibility)
 * @param icon - Icon path or URL from API (optional)
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") - preferred
 * @param name - Item name as fallback (optional)
 * @param size - Image size for CDN optimization (default: 48)
 * @returns Primary CDN-optimized MetaTFT item icon URL
 */
export const getItemImageUrlWithCDN = (
  icon?: string | null,
  apiName?: string | null,
  name?: string | null,
  size: number = 48,
): string => {
  return getItemImageUrlsWithCDN(icon, apiName, name, size).primary;
};

