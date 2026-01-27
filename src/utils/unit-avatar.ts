import {getChampionLocalImage} from './champion-images';
import {getUnitAvatarUrls} from './metatft';

export interface IUnitAvatar {
  local: any | null;
  uri: string;
  primary: string;
  fallback: string;
}

/**
 * Get unit avatar (local require() if available, otherwise MetaTFT CDN with fallback)
 * @param apiName - unit API name (e.g. "TFT16_Tristana" or "Tristana")
 * @param size - desired image size (width/height)
 */
export const getUnitAvatar = (apiName?: string | null, size: number = 64): IUnitAvatar => {
  const local = getChampionLocalImage(apiName) || null;
  const urls = getUnitAvatarUrls(apiName, size);
  const uri = local ? '' : (urls.primary || urls.fallback || '');

  return {
    local,
    uri,
    primary: urls.primary,
    fallback: urls.fallback,
  };
};

export default getUnitAvatar;
