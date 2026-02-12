/**
 * Mapping of item API names to local image require() paths
 * Format: apiName -> require() path
 */

// Import all item images
const itemImages: Record<string, any> = {
  // TFT16 Items
  'tft16_item_bilgewater_bilgeratcutlass': require('@assets/images/items/tft16_item_bilgewater_bilgeratcutlass.png'),
  'tft16_item_bilgewater_blackmarketexplosives': require('@assets/images/items/tft16_item_bilgewater_blackmarketexplosives.png'),
  'tft16_item_bilgewater_captainsbrew': require('@assets/images/items/tft16_item_bilgewater_captainsbrew.png'),
  'tft16_item_bilgewater_deadmansdagger': require('@assets/images/items/tft16_item_bilgewater_deadmansdagger.png'),
  'tft16_item_bilgewater_firstmatesflintlock': require('@assets/images/items/tft16_item_bilgewater_firstmatesflintlock.png'),
  'tft16_item_bilgewater_freebootersfrock': require('@assets/images/items/tft16_item_bilgewater_freebootersfrock.png'),
  'tft16_item_bilgewater_luckyeyepatch': require('@assets/images/items/tft16_item_bilgewater_luckyeyepatch.png'),
  'tft16_item_bilgewater_pileocitrus': require('@assets/images/items/tft16_item_bilgewater_pileocitrus.png'),
  'tft16_item_bilgewateremblemitem': require('@assets/images/items/tft16_item_bilgewateremblemitem.png'),
  'tft16_item_brawleremblemitem': require('@assets/images/items/tft16_item_brawleremblemitem.png'),
  'tft16_item_defenderemblemitem': require('@assets/images/items/tft16_item_defenderemblemitem.png'),
  'tft16_item_demaciaemblemitem': require('@assets/images/items/tft16_item_demaciaemblemitem.png'),
  'tft16_item_freljordemblemitem': require('@assets/images/items/tft16_item_freljordemblemitem.png'),
  'tft16_item_gunslingeremblemitem': require('@assets/images/items/tft16_item_gunslingeremblemitem.png'),
  'tft16_item_invokeremblemitem': require('@assets/images/items/tft16_item_invokeremblemitem.png'),
  'tft16_item_ioniaemblemitem': require('@assets/images/items/tft16_item_ioniaemblemitem.png'),
  'tft16_item_ixtalemblemitem': require('@assets/images/items/tft16_item_ixtalemblemitem.png'),
  'tft16_item_juggernautemblemitem': require('@assets/images/items/tft16_item_juggernautemblemitem.png'),
  'tft16_item_longshotemblemitem': require('@assets/images/items/tft16_item_longshotemblemitem.png'),
  'tft16_item_magusemblemitem': require('@assets/images/items/tft16_item_magusemblemitem.png'),
  'tft16_item_noxusemblemitem': require('@assets/images/items/tft16_item_noxusemblemitem.png'),
  'tft16_item_piltoveremblemitem': require('@assets/images/items/tft16_item_piltoveremblemitem.png'),
  'tft16_item_rapidfireemblemitem': require('@assets/images/items/tft16_item_rapidfireemblemitem.png'),
  'tft16_item_slayeremblemitem': require('@assets/images/items/tft16_item_slayeremblemitem.png'),
  'tft16_item_sorcereremblemitem': require('@assets/images/items/tft16_item_sorcereremblemitem.png'),
  'tft16_item_vanquisheremblemitem': require('@assets/images/items/tft16_item_vanquisheremblemitem.png'),
  'tft16_item_voidemblemitem': require('@assets/images/items/tft16_item_voidemblemitem.png'),
  'tft16_item_wardenemblemitem': require('@assets/images/items/tft16_item_wardenemblemitem.png'),
  'tft16_item_yordleemblemitem': require('@assets/images/items/tft16_item_yordleemblemitem.png'),
  'tft16_item_zaunemblemitem': require('@assets/images/items/tft16_item_zaunemblemitem.png'),
  'tft16_thedarkinaegis': require('@assets/images/items/tft16_thedarkinaegis.png'),
  'tft16_thedarkinbow': require('@assets/images/items/tft16_thedarkinbow.png'),
  'tft16_thedarkinscythe': require('@assets/images/items/tft16_thedarkinscythe.png'),
  'tft16_thedarkinstaff': require('@assets/images/items/tft16_thedarkinstaff.png'),
  // TFT9 Items
  'tft9_item_crownofdemacia': require('@assets/images/items/tft9_item_crownofdemacia.png'),
  'tft9_item_ornnhorizonfocus': require('@assets/images/items/tft9_item_ornnhorizonfocus.png'),
  'tft9_item_ornnhullbreaker': require('@assets/images/items/tft9_item_ornnhullbreaker.png'),
  // TFT7 Items
  'tft7_item_shimmerscalegamblersblade': require('@assets/images/items/tft7_item_shimmerscalegamblersblade.png'),
  'tft7_item_shimmerscalemogulsmail': require('@assets/images/items/tft7_item_shimmerscalemogulsmail.png'),
  // TFT5 Radiant Items
  'tft5_item_adaptivehelmradiant': require('@assets/images/items/tft5_item_adaptivehelmradiant.png'),
  'tft5_item_archangelsstaffradiant': require('@assets/images/items/tft5_item_archangelsstaffradiant.png'),
  'tft5_item_bloodthirsterradiant': require('@assets/images/items/tft5_item_bloodthirsterradiant.png'),
  'tft5_item_bluebuffradiant': require('@assets/images/items/tft5_item_bluebuffradiant.png'),
  'tft5_item_bramblevestradiant': require('@assets/images/items/tft5_item_bramblevestradiant.png'),
  'tft5_item_crownguardradiant': require('@assets/images/items/tft5_item_crownguardradiant.png'),
  'tft5_item_deathbladeradiant': require('@assets/images/items/tft5_item_deathbladeradiant.png'),
  'tft5_item_dragonsclawradiant': require('@assets/images/items/tft5_item_dragonsclawradiant.png'),
  'tft5_item_frozenheartradiant': require('@assets/images/items/tft5_item_frozenheartradiant.png'),
  'tft5_item_gargoylestoneplateradiant': require('@assets/images/items/tft5_item_gargoylestoneplateradiant.png'),
  'tft5_item_giantslayerradiant': require('@assets/images/items/tft5_item_giantslayerradiant.png'),
  'tft5_item_guardianangelradiant': require('@assets/images/items/tft5_item_guardianangelradiant.png'),
  'tft5_item_guinsoosragebladeradiant': require('@assets/images/items/tft5_item_guinsoosragebladeradiant.png'),
  'tft5_item_handofjusticeradiant': require('@assets/images/items/tft5_item_handofjusticeradiant.png'),
  'tft5_item_hextechgunbladeradiant': require('@assets/images/items/tft5_item_hextechgunbladeradiant.png'),
  'tft5_item_infinityedgeradiant': require('@assets/images/items/tft5_item_infinityedgeradiant.png'),
  'tft5_item_ionicsparkradiant': require('@assets/images/items/tft5_item_ionicsparkradiant.png'),
  'tft5_item_jeweledgauntletradiant': require('@assets/images/items/tft5_item_jeweledgauntletradiant.png'),
  'tft5_item_lastwhisperradiant': require('@assets/images/items/tft5_item_lastwhisperradiant.png'),
  'tft5_item_leviathanradiant': require('@assets/images/items/tft5_item_leviathanradiant.png'),
  'tft5_item_morellonomiconradiant': require('@assets/images/items/tft5_item_morellonomiconradiant.png'),
  'tft5_item_nightharvesterradiant': require('@assets/images/items/tft5_item_nightharvesterradiant.png'),
  'tft5_item_quicksilverradiant': require('@assets/images/items/tft5_item_quicksilverradiant.png'),
  'tft5_item_rabadonsdeathcapradiant': require('@assets/images/items/tft5_item_rabadonsdeathcapradiant.png'),
  'tft5_item_rapidfirecannonradiant': require('@assets/images/items/tft5_item_rapidfirecannonradiant.png'),
  'tft5_item_redemptionradiant': require('@assets/images/items/tft5_item_redemptionradiant.png'),
  'tft5_item_runaanshurricaneradiant': require('@assets/images/items/tft5_item_runaanshurricaneradiant.png'),
  'tft5_item_spearofshojinradiant': require('@assets/images/items/tft5_item_spearofshojinradiant.png'),
  'tft5_item_spectralgauntletradiant': require('@assets/images/items/tft5_item_spectralgauntletradiant.png'),
  'tft5_item_statikkshivradiant': require('@assets/images/items/tft5_item_statikkshivradiant.png'),
  'tft5_item_steraksgageradiant': require('@assets/images/items/tft5_item_steraksgageradiant.png'),
  'tft5_item_sunfirecaperadiant': require('@assets/images/items/tft5_item_sunfirecaperadiant.png'),
  'tft5_item_thiefsglovesradiant': require('@assets/images/items/tft5_item_thiefsglovesradiant.png'),
  'tft5_item_titansresolveradiant': require('@assets/images/items/tft5_item_titansresolveradiant.png'),
  'tft5_item_trapclawradiant': require('@assets/images/items/tft5_item_trapclawradiant.png'),
  'tft5_item_warmogsarmorradiant': require('@assets/images/items/tft5_item_warmogsarmorradiant.png'),
  // TFT4 Ornn Items
  'tft4_item_ornndeathsdefiance': require('@assets/images/items/tft4_item_ornndeathsdefiance.png'),
  'tft4_item_ornninfinityforce': require('@assets/images/items/tft4_item_ornninfinityforce.png'),
  'tft4_item_ornnthecollector': require('@assets/images/items/tft4_item_ornnthecollector.png'),
  'tft4_item_ornnzhonyasparadox': require('@assets/images/items/tft4_item_ornnzhonyasparadox.png'),
  // Standard TFT Items
  'tft_item_adaptivehelm': require('@assets/images/items/tft_item_adaptivehelm.png'),
  'tft_item_archangelsstaff': require('@assets/images/items/tft_item_archangelsstaff.png'),
  'tft_item_artifact_aegisofdawn': require('@assets/images/items/tft_item_artifact_aegisofdawn.png'),
  'tft_item_artifact_aegisofdusk': require('@assets/images/items/tft_item_artifact_aegisofdusk.png'),
  'tft_item_artifact_blightingjewel': require('@assets/images/items/tft_item_artifact_blightingjewel.png'),
  'tft_item_artifact_cappajuice': require('@assets/images/items/tft_item_artifact_cappajuice.png'),
  'tft_item_artifact_dawncore': require('@assets/images/items/tft_item_artifact_dawncore.png'),
  'tft_item_artifact_eternalpact': require('@assets/images/items/tft_item_artifact_eternalpact.png'),
  'tft_item_artifact_fishbones': require('@assets/images/items/tft_item_artifact_fishbones.png'),
  'tft_item_artifact_hellfirehatchet': require('@assets/images/items/tft_item_artifact_hellfirehatchet.png'),
  'tft_item_artifact_horizonfocus': require('@assets/images/items/tft_item_artifact_horizonfocus.png'),
  'tft_item_artifact_lightshieldcrest': require('@assets/images/items/tft_item_artifact_lightshieldcrest.png'),
  'tft_item_artifact_lichbane': require('@assets/images/items/tft_item_artifact_lichbane.png'),
  'tft_item_artifact_ludenstempest': require('@assets/images/items/tft_item_artifact_ludenstempest.png'),
  'tft_item_artifact_mittens': require('@assets/images/items/tft_item_artifact_mittens.png'),
  'tft_item_artifact_navoriflickerblades': require('@assets/images/items/tft_item_artifact_navoriflickerblades.png'),
  'tft_item_artifact_prowlersclaw': require('@assets/images/items/tft_item_artifact_prowlersclaw.png'),
  'tft_item_artifact_rapidfirecannon': require('@assets/images/items/tft_item_artifact_rapidfirecannon.png'),
  'tft_item_artifact_seekersarmguard': require('@assets/images/items/tft_item_artifact_seekersarmguard.png'),
  'tft_item_artifact_silvermeredawn': require('@assets/images/items/tft_item_artifact_silvermeredawn.png'),
  'tft_item_artifact_statikkshiv': require('@assets/images/items/tft_item_artifact_statikkshiv.png'),
  'tft_item_artifact_talismanofascension': require('@assets/images/items/tft_item_artifact_talismanofascension.png'),
  'tft_item_artifact_theindomitable': require('@assets/images/items/tft_item_artifact_theindomitable.png'),
  'tft_item_artifact_titanichydra': require('@assets/images/items/tft_item_artifact_titanichydra.png'),
  'tft_item_artifact_voidgauntlet': require('@assets/images/items/tft_item_artifact_voidgauntlet.png'),
  'tft_item_artifact_witsend': require('@assets/images/items/tft_item_artifact_witsend.png'),
  'tft_item_bfsword': require('@assets/images/items/tft_item_bfsword.png'),
  'tft_item_bloodthirster': require('@assets/images/items/tft_item_bloodthirster.png'),
  'tft_item_bluebuff': require('@assets/images/items/tft_item_bluebuff.png'),
  'tft_item_bramblevest': require('@assets/images/items/tft_item_bramblevest.png'),
  'tft_item_chainvest': require('@assets/images/items/tft_item_chainvest.png'),
  'tft_item_crownguard': require('@assets/images/items/tft_item_crownguard.png'),
  'tft_item_deathblade': require('@assets/images/items/tft_item_deathblade.png'),
  'tft_item_dragonsclaw': require('@assets/images/items/tft_item_dragonsclaw.png'),
  'tft_item_forceofnature': require('@assets/images/items/tft_item_forceofnature.png'),
  'tft_item_frozenheart': require('@assets/images/items/tft_item_frozenheart.png'),
  'tft_item_fryingpan': require('@assets/images/items/tft_item_fryingpan.png'),
  'tft_item_gargoylestoneplate': require('@assets/images/items/tft_item_gargoylestoneplate.png'),
  'tft_item_giantsbelt': require('@assets/images/items/tft_item_giantsbelt.png'),
  'tft_item_guardianangel': require('@assets/images/items/tft_item_guardianangel.png'),
  'tft_item_guinsoosrageblade': require('@assets/images/items/tft_item_guinsoosrageblade.png'),
  'tft_item_hextechgunblade': require('@assets/images/items/tft_item_hextechgunblade.png'),
  'tft_item_infinityedge': require('@assets/images/items/tft_item_infinityedge.png'),
  'tft_item_ionicspark': require('@assets/images/items/tft_item_ionicspark.png'),
  'tft_item_jeweledgauntlet': require('@assets/images/items/tft_item_jeweledgauntlet.png'),
  'tft_item_lastwhisper': require('@assets/images/items/tft_item_lastwhisper.png'),
  'tft_item_leviathan': require('@assets/images/items/tft_item_leviathan.png'),
  'tft_item_madredsbloodrazor': require('@assets/images/items/tft_item_madredsbloodrazor.png'),
  'tft_item_morellonomicon': require('@assets/images/items/tft_item_morellonomicon.png'),
  'tft_item_needlesslylargerod': require('@assets/images/items/tft_item_needlesslylargerod.png'),
  'tft_item_negatroncloak': require('@assets/images/items/tft_item_negatroncloak.png'),
  'tft_item_nightharvester': require('@assets/images/items/tft_item_nightharvester.png'),
  'tft_item_powergauntlet': require('@assets/images/items/tft_item_powergauntlet.png'),
  'tft_item_quicksilver': require('@assets/images/items/tft_item_quicksilver.png'),
  'tft_item_rabadonsdeathcap': require('@assets/images/items/tft_item_rabadonsdeathcap.png'),
  'tft_item_rapidfirecannon': require('@assets/images/items/tft_item_rapidfirecannon.png'),
  'tft_item_recurvebow': require('@assets/images/items/tft_item_recurvebow.png'),
  'tft_item_redbuff': require('@assets/images/items/tft_item_redbuff.png'),
  'tft_item_redemption': require('@assets/images/items/tft_item_redemption.png'),
  'tft_item_runaanshurricane': require('@assets/images/items/tft_item_runaanshurricane.png'),
  'tft_item_sparringgloves': require('@assets/images/items/tft_item_sparringgloves.png'),
  'tft_item_spatula': require('@assets/images/items/tft_item_spatula.png'),
  'tft_item_spearofshojin': require('@assets/images/items/tft_item_spearofshojin.png'),
  'tft_item_spectralgauntlet': require('@assets/images/items/tft_item_spectralgauntlet.png'),
  'tft_item_statikkshiv': require('@assets/images/items/tft_item_statikkshiv.png'),
  'tft_item_steraksgage': require('@assets/images/items/tft_item_steraksgage.png'),
  'tft_item_tacticiansring': require('@assets/images/items/tft_item_tacticiansring.png'),
  'tft_item_tacticiansscepter': require('@assets/images/items/tft_item_tacticiansscepter.png'),
  'tft_item_tearofthegoddess': require('@assets/images/items/tft_item_tearofthegoddess.png'),
  'tft_item_thiefsgloves': require('@assets/images/items/tft_item_thiefsgloves.png'),
  'tft_item_titansresolve': require('@assets/images/items/tft_item_titansresolve.png'),
  'tft_item_unstableconcoction': require('@assets/images/items/tft_item_unstableconcoction.png'),
  'tft_item_warmogsarmor': require('@assets/images/items/tft_item_warmogsarmor.png'),
};

/**
 * Format API name for local image lookup
 * @param apiName - API name from item (e.g., "TFT_Item_BFSword", "BFSword", "TFT5_Item_QuicksilverRadiant")
 * @returns Formatted key (e.g., "tft_item_bfsword", "tft5_item_quicksilverradiant")
 */
export const formatItemApiNameForLocal = (apiName?: string | null): string => {
  if (apiName == null || apiName === '') return '';
  // Ensure string (API may return number or other type)
  let formatted = String(apiName).toLowerCase();
  
  // If it already starts with "tft" (any version like tft5, tft16, etc.), keep it as is
  if (formatted.startsWith('tft')) {
    return formatted;
  }
  
  // Otherwise, assume standard tft_item prefix
  formatted = `tft_item_${formatted}`;
  return formatted;
};

/**
 * Get local item image source
 * @param apiName - API name from item
 * @returns Local image require() source or null if not found
 */
export const getItemLocalImage = (apiName?: string | null): any => {
  if (!apiName) return null;
  
  const formattedKey = formatItemApiNameForLocal(apiName);
  return itemImages[formattedKey] || null;
};

/**
 * Get item icon image source (local only, no URL fallback)
 * @param iconPath - Icon path from API (optional)
 * @param apiName - Item API name (e.g., "TFT_Item_BFSword") - preferred
 * @param _size - Image size (default: 48) - not used for local images, kept for compatibility
 * @returns Object with local image source (null if not found)
 */
export const getItemIconImageSource = (
  iconPath?: string | null,
  apiName?: string | null,
  _size: number = 48,
): {local: any; uri: string} => {
  if (apiName) {
    const localImage = getItemLocalImage(apiName);
    if (localImage) {
      return {
        local: localImage,
        uri: '', // No URL fallback
      };
    }
  }
  
  // Try to parse iconPath if apiName didn't work
  if (iconPath) {
    // Parse icon path/URL to get filename
    // Example 1: "ASSETS/Maps/TFT/Icons/Items/Hexcore/TFT_Item_BFSword.TFT_Set13.tex"
    // -> "TFT_Item_BFSword"
    // Example 2: "https://cdn.metatft.com/.../tft5_item_quicksilverradiant.png"
    // -> "tft5_item_quicksilverradiant"
    let pathToParse = iconPath;
    
    // Remove query string and fragment if present (e.g., "?v=1" or "#anchor")
    const queryIndex = pathToParse.indexOf('?');
    if (queryIndex !== -1) {
      pathToParse = pathToParse.substring(0, queryIndex);
    }
    const fragmentIndex = pathToParse.indexOf('#');
    if (fragmentIndex !== -1) {
      pathToParse = pathToParse.substring(0, fragmentIndex);
    }
    
    // Split by '/' and get the last part (filename)
    const parts = pathToParse.split('/');
    if (parts.length > 0) {
      const filename = parts[parts.length - 1];
      if (filename) {
        // Remove extension (e.g., ".png", ".tex")
        const nameWithoutExt = filename.split('.')[0];
        const localImage = getItemLocalImage(nameWithoutExt);
        if (localImage) {
          return {
            local: localImage,
            uri: '', // No URL fallback
          };
        }
      }
    }
  }
  
  // No local image found
  return {
    local: null,
    uri: '', // No URL fallback
  };
};

