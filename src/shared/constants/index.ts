// ? API
export const API_BASE_URL = __DEV__
  ? 'https://api.apporastudio.com'
  // ? 'http://localhost:3900'
  : 'https://api.apporastudio.com';

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
