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
 * Supports multiple formats: tft16_{championName}_r.png (ultimate) or tft16_{championName}_e.png (ability E)
 * @param apiName - API name from unit (e.g., "TFT16_Seraphine" or "Seraphine")
 * @param size - Image size (default: 64)
 * @param suffix - Ability suffix: 'r' for ultimate (default), 'e' for ability E, or null to try both
 * @returns Ability icon URL (tries _r first, then _e if suffix is null)
 */
export const getUnitAbilityIconUrl = (
  apiName?: string | null,
  size: number = 64,
  suffix: 'r' | 'e' | null = null,
): string => {
  if (!apiName) return '';
  
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
  
  return `https://cdn.metatft.com/cdn-cgi/image/width=${size},height=${size},format=auto/https://cdn.metatft.com/file/metatft/champions/${abilityKey}.png`;
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
  
  console.log('[parseIconPath] iconPath:', iconPath, 'filename:', filename, 'cleanedName:', cleanedName);
  
  return cleanedName || null;
};

/**
 * Get unit ability icon URL from MetaTFT CDN based on icon path from API
 * Example: "ASSETS/Characters/TFT16_Sona/HUD/Icons2D/TFT16_Sona_Passive_Charged.TFT_Set16.tex"
 * -> "https://cdn.metatft.com/file/metatft/champions/tft16_sona_passive_charged.png"
 * @param iconPath - Icon path from API
 * @returns Ability icon URL
 */
export const getUnitAbilityIconUrlFromPath = (
  iconPath?: string | null,
): string | null => {
  if (!iconPath) return null;
  
  // Parse icon path to get filename
  const filename = parseIconPath(iconPath);
  if (!filename) return null;
  
  // Format filename: TFT16_Sona_Passive_Charged -> tft16_sona_passive_charged
  const formattedKey = filename.toLowerCase();
  
  const url = `https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
  
  console.log('[getUnitAbilityIconUrlFromPath] iconPath:', iconPath, 'filename:', filename, 'formattedKey:', formattedKey, 'URL:', url);
  
  return url;
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
 * @param traitName - Trait name (e.g., "Huntress" or "TFT16_Huntress")
 * @param _size - Image size (optional, not used for traits - kept for compatibility)
 * @returns Trait icon URL (direct URL without CDN optimization)
 */
export const getTraitIconUrl = (
  traitName?: string | null,
  _size?: number,
): string => {
  const formattedTrait = formatTraitNameForMetaTft(traitName);
  if (!formattedTrait) return '';
  
  // Remove tft16_ prefix if present
  const cleanTrait = formattedTrait.replace(/^tft\d+_/, '');
  
  return `https://cdn.metatft.com/file/metatft/traits/${cleanTrait}.png`;
};

/**
 * Get augment icon URL from MetaTFT CDN based on icon path from API
 * Example: "ASSETS/Maps/TFT/Icons/Augments/Hexcore/ChaosMagic_II.TFT_Set16.tex"
 * -> "https://cdn.metatft.com/file/metatft/augments/chaosmagic_ii.png"
 * @param iconPath - Icon path from API
 * @returns Augment icon URL
 */
export const getAugmentIconUrlFromPath = (
  iconPath?: string | null,
): string | null => {
  if (!iconPath) return null;
  
  // Parse icon path to get filename
  const filename = parseIconPath(iconPath);
  if (!filename) return null;
  
  // Format filename: ChaosMagic_II -> chaosmagic_ii
  const formattedKey = filename.toLowerCase();
  
  const url = `https://cdn.metatft.com/file/metatft/augments/${formattedKey}.png`;
  
  if (__DEV__) {
    console.log('[getAugmentIconUrlFromPath] iconPath:', iconPath, 'filename:', filename, 'formattedKey:', formattedKey, 'URL:', url);
  }
  
  return url;
};

/**
 * Get item icon URL from MetaTFT CDN or Data Dragon based on icon path from API
 * Example: "ASSETS/Maps/TFT/Icons/Items/Hexcore/TFT_Item_BFSword.TFT_Set13.tex"
 * -> "https://cdn.metatft.com/file/metatft/items/tft_item_bfsword.png"
 * Or fallback to Data Dragon: "https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/TFT_Item_BFSword.png"
 * @param iconPath - Icon path from API
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") for fallback
 * @returns Item icon URL
 */
export const getItemIconUrlFromPath = (
  iconPath?: string | null,
  apiName?: string | null,
): string => {
  if (iconPath) {
    // If icon is a full URL
    if (iconPath.startsWith('http')) {
      return iconPath;
    }
    
    // If icon is a path starting with /, it's a relative path from API
    if (iconPath.startsWith('/')) {
      // This would need API_BASE_URL, but we don't have it here
      // So we'll try to parse it as a MetaTFT path
    }
    
    // Try to parse icon path to get filename
    const filename = parseIconPath(iconPath);
    if (filename) {
      // Format filename: TFT_Item_BFSword -> tft_item_bfsword
      const formattedKey = filename.toLowerCase();
      const metatftUrl = `https://cdn.metatft.com/file/metatft/items/${formattedKey}.png`;
      return metatftUrl;
    }
  }
  
  // Fallback to Data Dragon using apiName
  if (apiName) {
    return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${apiName}.png`;
  }
  
  // Last resort: return empty string
  return '';
};

