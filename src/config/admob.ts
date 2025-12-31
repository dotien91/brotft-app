/**
 * AdMob Configuration
 * 
 * App ID: ca-app-pub-9275414127217585~1389409109
 * Ad Unit ID: ca-app-pub-9275414127217585/2594679567
 */

export const ADMOB_CONFIG = {
  // App ID (đã được cấu hình trong AndroidManifest.xml và Info.plist)
  APP_ID: 'ca-app-pub-9275414127217585~1389409109',
  
  // Ad Unit IDs
  AD_UNIT_IDS: {
    // Banner Ad Unit ID
    BANNER: 'ca-app-pub-9275414127217585/2594679567',
    
    // Test Ad Unit IDs (sử dụng khi test)
    TEST_BANNER: 'ca-app-pub-3940256099942544/6300978111',
    TEST_INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
    TEST_REWARDED: 'ca-app-pub-3940256099942544/5224354917',
  },
} as const;

// Sử dụng test ads trong development mode
export const USE_TEST_ADS = __DEV__;

