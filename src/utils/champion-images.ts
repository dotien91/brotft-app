/**
 * Mapping of champion API names to local image require() paths
 * Format: apiName -> require() path
 */

// Import all champion images
const championImages: Record<string, any> = {
  'tft16_aatrox': require('@assets/images/champions/tft16_aatrox.png'),
  'tft16_ahri': require('@assets/images/champions/tft16_ahri.png'),
  'tft16_ambessa': require('@assets/images/champions/tft16_ambessa.png'),
  'tft16_anivia': require('@assets/images/champions/tft16_anivia.png'),
  'tft16_annie': require('@assets/images/champions/tft16_annie.png'),
  'tft16_annietibbers': require('@assets/images/champions/tft16_annietibbers.png'),
  'tft16_aphelios': require('@assets/images/champions/tft16_aphelios.png'),
  'tft16_ashe': require('@assets/images/champions/tft16_ashe.png'),
  'tft16_aurelionsol': require('@assets/images/champions/tft16_aurelionsol.png'),
  'tft16_azir': require('@assets/images/champions/tft16_azir.png'),
  'tft16_bard': require('@assets/images/champions/tft16_bard.png'),
  'tft16_baronnashor': require('@assets/images/champions/tft16_baronnashor.png'),
  'tft16_belveth': require('@assets/images/champions/tft16_belveth.png'),
  'tft16_blitzcrank': require('@assets/images/champions/tft16_blitzcrank.png'),
  'tft16_braum': require('@assets/images/champions/tft16_braum.png'),
  'tft16_briar': require('@assets/images/champions/tft16_briar.png'),
  'tft16_brock': require('@assets/images/champions/tft16_brock.png'),
  'tft16_caitlyn': require('@assets/images/champions/tft16_caitlyn.png'),
  'tft16_chogath': require('@assets/images/champions/tft16_chogath.png'),
  'tft16_darius': require('@assets/images/champions/tft16_darius.png'),
  'tft16_diana': require('@assets/images/champions/tft16_diana.png'),
  'tft16_draven': require('@assets/images/champions/tft16_draven.png'),
  'tft16_drmundo': require('@assets/images/champions/tft16_drmundo.png'),
  'tft16_ekko': require('@assets/images/champions/tft16_ekko.png'),
  'tft16_fiddlesticks': require('@assets/images/champions/tft16_fiddlesticks.png'),
  'tft16_fizz': require('@assets/images/champions/tft16_fizz.png'),
  'tft16_galio': require('@assets/images/champions/tft16_galio.png'),
  'tft16_gangplank': require('@assets/images/champions/tft16_gangplank.png'),
  'tft16_garen': require('@assets/images/champions/tft16_garen.png'),
  'tft16_graves': require('@assets/images/champions/tft16_graves.png'),
  'tft16_gwen': require('@assets/images/champions/tft16_gwen.png'),
  'tft16_illaoi': require('@assets/images/champions/tft16_illaoi.png'),
  'tft16_jarvaniv': require('@assets/images/champions/tft16_jarvaniv.png'),
  'tft16_jhin': require('@assets/images/champions/tft16_jhin.png'),
  'tft16_jinx': require('@assets/images/champions/tft16_jinx.png'),
  'tft16_kaisa': require('@assets/images/champions/tft16_kaisa.png'),
  'tft16_kalista': require('@assets/images/champions/tft16_kalista.png'),
  'tft16_kennen': require('@assets/images/champions/tft16_kennen.png'),
  'tft16_kindred': require('@assets/images/champions/tft16_kindred.png'),
  'tft16_kobuko': require('@assets/images/champions/tft16_kobuko.png'),
  'tft16_kogmaw': require('@assets/images/champions/tft16_kogmaw.png'),
  'tft16_leblanc': require('@assets/images/champions/tft16_leblanc.png'),
  'tft16_leona': require('@assets/images/champions/tft16_leona.png'),
  'tft16_lissandra': require('@assets/images/champions/tft16_lissandra.png'),
  'tft16_loris': require('@assets/images/champions/tft16_loris.png'),
  'tft16_lucian': require('@assets/images/champions/tft16_lucian.png'),
  'tft16_lulu': require('@assets/images/champions/tft16_lulu.png'),
  'tft16_lux': require('@assets/images/champions/tft16_lux.png'),
  'tft16_malzahar': require('@assets/images/champions/tft16_malzahar.png'),
  'tft16_mel': require('@assets/images/champions/tft16_mel.png'),
  'tft16_milio': require('@assets/images/champions/tft16_milio.png'),
  'tft16_missfortune': require('@assets/images/champions/tft16_missfortune.png'),
  'tft16_nasus': require('@assets/images/champions/tft16_nasus.png'),
  'tft16_nautilus': require('@assets/images/champions/tft16_nautilus.png'),
  'tft16_neeko': require('@assets/images/champions/tft16_neeko.png'),
  'tft16_nidalee': require('@assets/images/champions/tft16_nidalee.png'),
  'tft16_orianna': require('@assets/images/champions/tft16_orianna.png'),
  'tft16_ornn': require('@assets/images/champions/tft16_ornn.png'),
  'tft16_poppy': require('@assets/images/champions/tft16_poppy.png'),
  'tft16_qiyana': require('@assets/images/champions/tft16_qiyana.png'),
  'tft16_reksai': require('@assets/images/champions/tft16_reksai.png'),
  'tft16_renekton': require('@assets/images/champions/tft16_renekton.png'),
  'tft16_riftherald': require('@assets/images/champions/tft16_riftherald.png'),
  'tft16_rumble': require('@assets/images/champions/tft16_rumble.png'),
  'tft16_ryze': require('@assets/images/champions/tft16_ryze.png'),
  'tft16_sejuani': require('@assets/images/champions/tft16_sejuani.png'),
  'tft16_seraphine': require('@assets/images/champions/tft16_seraphine.png'),
  'tft16_sett': require('@assets/images/champions/tft16_sett.png'),
  'tft16_shen': require('@assets/images/champions/tft16_shen.png'),
  'tft16_shyvana': require('@assets/images/champions/tft16_shyvana.png'),
  'tft16_singed': require('@assets/images/champions/tft16_singed.png'),
  'tft16_sion': require('@assets/images/champions/tft16_sion.png'),
  'tft16_skarner': require('@assets/images/champions/tft16_skarner.png'),
  'tft16_sona': require('@assets/images/champions/tft16_sona.png'),
  'tft16_swain': require('@assets/images/champions/tft16_swain.png'),
  'tft16_sylas': require('@assets/images/champions/tft16_sylas.png'),
  'tft16_tahmkench': require('@assets/images/champions/tft16_tahmkench.png'),
  'tft16_taric': require('@assets/images/champions/tft16_taric.png'),
  'tft16_teemo': require('@assets/images/champions/tft16_teemo.png'),
  'tft16_thex': require('@assets/images/champions/tft16_thex.png'),
  'tft16_thresh': require('@assets/images/champions/tft16_thresh.png'),
  'tft16_tristana': require('@assets/images/champions/tft16_tristana.png'),
  'tft16_tryndamere': require('@assets/images/champions/tft16_tryndamere.png'),
  'tft16_twistedfate': require('@assets/images/champions/tft16_twistedfate.png'),
  'tft16_vayne': require('@assets/images/champions/tft16_vayne.png'),
  'tft16_veigar': require('@assets/images/champions/tft16_veigar.png'),
  'tft16_vi': require('@assets/images/champions/tft16_vi.png'),
  'tft16_viego': require('@assets/images/champions/tft16_viego.png'),
  'tft16_volibear': require('@assets/images/champions/tft16_volibear.png'),
  'tft16_warwick': require('@assets/images/champions/tft16_warwick.png'),
  'tft16_wukong': require('@assets/images/champions/tft16_wukong.png'),
  'tft16_xerath': require('@assets/images/champions/tft16_xerath.png'),
  'tft16_xinzhao': require('@assets/images/champions/tft16_xinzhao.png'),
  'tft16_yasuo': require('@assets/images/champions/tft16_yasuo.png'),
  'tft16_yone': require('@assets/images/champions/tft16_yone.png'),
  'tft16_yorick': require('@assets/images/champions/tft16_yorick.png'),
  'tft16_yunara': require('@assets/images/champions/tft16_yunara.png'),
  'tft16_zaahen': require('@assets/images/champions/tft16_zaahen.png'),
  'tft16_ziggs': require('@assets/images/champions/tft16_ziggs.png'),
  'tft16_zilean': require('@assets/images/champions/tft16_zilean.png'),
  'tft16_zoe': require('@assets/images/champions/tft16_zoe.png'),
};

/**
 * Format API name for local image lookup
 * @param apiName - API name from unit (e.g., "TFT16_Tristana" or "Tristana")
 * @returns Formatted key (e.g., "tft16_tristana")
 */
export const formatApiNameForLocal = (apiName?: string | null): string => {
  if (!apiName) return '';
  // Format: TFT16_Tristana -> tft16_tristana
  // Or Tristana -> tft16_tristana (assume TFT16 if no prefix)
  let formatted = apiName.toLowerCase();
  if (!formatted.startsWith('tft')) {
    formatted = `tft16_${formatted}`;
  }
  return formatted;
};

/**
 * Get local champion image source
 * @param apiName - API name from unit
 * @returns Local image require() source or null if not found
 */
export const getChampionLocalImage = (apiName?: string | null): any => {
  if (!apiName) return null;
  
  const formattedKey = formatApiNameForLocal(apiName);
  return championImages[formattedKey] || null;
};

/**
 * Get unit avatar image source (local only, no URL fallback)
 * @param apiName - API name from unit
 * @param _size - Image size (default: 64) - not used for local images, kept for compatibility
 * @returns Object with local image source (null if not found)
 */
export const getUnitAvatarImageSource = (
  apiName?: string | null,
  _size: number = 64,
): {local: any; uri: string} => {
  const localImage = getChampionLocalImage(apiName);
  
  // No URL fallback - only use local images
  return {
    local: localImage,
    uri: '', // Empty string - no URL fallback
  };
};

