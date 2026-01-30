// ? API
export const API_BASE_URL = __DEV__
  ? 'https://api.apporastudio.com'
  // ? 'http://localhost:3900'
  : 'https://api.apporastudio.com';

// ? AdMob
export const AD_UNIT_IDS = {
  BANNER: __DEV__
    ? 'ca-app-pub-3940256099942544/6300978111' // Test ID
    : 'ca-app-pub-9275414127217585/2913687226', // Production Banner ID
};

// ? Screens
export const SCREENS = {
  HOME_ROOT: 'HomeRoot',
  HOME: 'Home',
  GUIDE: 'Guide',
  SETTINGS: 'Settings',
  DETAIL: 'Detail',
  UNIT_DETAIL: 'UnitDetail',
  TRAITS: 'Traits',
  TRAIT_DETAIL: 'TraitDetail',
  ITEM_DETAIL: 'ItemDetail',
  CHAMPION_DETAIL: 'ChampionDetail',
  PRIVACY: 'Privacy',
  TERMS: 'Terms',
  FEEDBACK: 'Feedback',
  // Legacy screens (kept for compatibility)
  TOOL: 'Tool',
  SEARCH: 'Search',
  NOTIFICATION: 'Notification',
  PROFILE: 'Profile',
};
