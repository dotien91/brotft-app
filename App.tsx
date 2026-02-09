import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import {LogBox, StatusBar, View} from 'react-native';
import LottieView from 'lottie-react-native';
import {QueryClientProvider} from '@tanstack/react-query';
import {isAndroid} from '@freakycoder/react-native-helpers';
import {getLocales} from 'react-native-localize';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Navigation from './src/navigation';
import {queryClient} from '@services/api/react-query';
import useStore from './src/services/zustand/store';
import {translations} from './src/shared/localization';
import {checkAndFetchDataByLocale} from './src/services/api/data';
import LocalStorage from './src/services/local-storage';
import {MobileAds} from 'react-native-google-mobile-ads';
LogBox.ignoreAllLogs();
import ReactNativeIdfaAaid, { AdvertisingInfoResponse } from '@sparkfabrik/react-native-idfa-aaid';

/**
 * Map locale information to app language code
 * Priority: languageCode first, then countryCode as fallback
 * @param locales - Array of locales from getLocales()
 * @returns Language code supported by app
 */
const getLanguageFromLocales = (locales: Array<{languageCode: string; countryCode: string}>): string => {
  if (!locales || locales.length === 0) return 'en';
  
  // Language code mappings (direct language match)
  const languageCodeMap: Record<string, string> = {
    'vi': 'vi',
    'zh': 'zh-CN',
    'zh-CN': 'zh-CN',
    'tr': 'tr-TR',
    'tr-TR': 'tr-TR',
    'ja': 'ja-JP',
    'ja-JP': 'ja-JP',
    'es': 'es-ES',
    'es-ES': 'es-ES',
    'en': 'en',
  };
  
  // Country code mappings (fallback if language code doesn't match)
  const countryCodeMap: Record<string, string> = {
    'VN': 'vi',
    'CN': 'zh-CN',
    'TR': 'tr-TR',
    'JP': 'ja-JP',
    'ES': 'es-ES',
  };
  
  // Get first locale (highest priority)
  const firstLocale = locales[0];
  
  // Try languageCode first
  if (firstLocale.languageCode) {
    const languageCode = firstLocale.languageCode.toLowerCase();
    if (languageCodeMap[languageCode]) {
      return languageCodeMap[languageCode];
    }
  }
  
  // Fallback to countryCode
  if (firstLocale.countryCode) {
    const countryCode = firstLocale.countryCode.toUpperCase();
    if (countryCodeMap[countryCode]) {
      return countryCodeMap[countryCode];
    }
  }
  
  // Default to English
  return 'en';
};

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const language = useStore((state) => state.language);
  const setLanguage = useStore((state) => state.setLanguage);
  const setAdsSdkInitialized = useStore((state) => state.setAdsSdkInitialized);
  const setAdsSdkInitAttempted = useStore((state) => state.setAdsSdkInitAttempted);
  const setHasTrackingPermission = useStore((state) => state.setHasTrackingPermission);
  const [isLanguageReady, setIsLanguageReady] = React.useState(false);
  const lastFetchedLocaleRef = React.useRef<string | null>(null);

  // Request App Tracking Transparency (iOS) when app opens, then init Mobile Ads
  React.useEffect(() => {
    const requestTrackingAndInitAds = async () => {
      if (!isAndroid) {
        try {
          let result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
          if (result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE) {
            result = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
          }
          setHasTrackingPermission(result === RESULTS.GRANTED);
        } catch (e) {
          setHasTrackingPermission(false);
        }
      }
      try {
        await MobileAds().initialize();
        setAdsSdkInitialized(true);
      } catch (error) {
        console.error('AdMob Init Error:', error);
        setAdsSdkInitialized(false);
      } finally {
        setAdsSdkInitAttempted(true);
      }
    };
    requestTrackingAndInitAds();
  }, [setAdsSdkInitialized, setAdsSdkInitAttempted, setHasTrackingPermission]);

  React.useEffect(() => {
    // Check if this is first time app launch (no language preference saved)
    // Zustand persist key is 'store', we check if language was actually saved by user
    const LANGUAGE_FIRST_LAUNCH_KEY = 'language_first_launch_set';
    
    // Check if user has ever set a language preference
    const hasSetLanguageBefore = LocalStorage.getBoolean(LANGUAGE_FIRST_LAUNCH_KEY) ?? false;
    
    if (hasSetLanguageBefore) {
      // User has set language before, use saved preference
      if (language) {
        translations.setLanguage(language);
      } else {
        translations.setLanguage('en');
      }
      setIsLanguageReady(true);
    } else {
      // First time launch - auto-detect from device
      try {
        const locales = getLocales();
        const detectedLanguage = getLanguageFromLocales(locales);
        
        // Set detected language
        setLanguage(detectedLanguage);
        translations.setLanguage(detectedLanguage);
        
        // Mark that language has been set (even if auto-detected)
        LocalStorage.set(LANGUAGE_FIRST_LAUNCH_KEY, true);
        setIsLanguageReady(true);
      } catch (error) {
        // Fallback to English if detection fails
        console.log('Failed to detect device language:', error);
        setLanguage('en');
        translations.setLanguage('en');
        LocalStorage.set(LANGUAGE_FIRST_LAUNCH_KEY, true);
        setIsLanguageReady(true);
      }
    }
  }, []);

  // Check and fetch data by locale on app startup (chỉ gọi 1 lần cho mỗi locale, tránh Strict Mode gọi 2 lần)
  React.useEffect(() => {
    if (!isLanguageReady || !language) return;
    if (lastFetchedLocaleRef.current === language) return;
    lastFetchedLocaleRef.current = language;
    checkAndFetchDataByLocale(language);
  }, [language, isLanguageReady]);

  // Check app version on startup
  // React.useEffect(() => {
  //   // Check version sau khi app đã load xong
  //   const timer = setTimeout(() => {
  //     checkAndForceUpdate();
  //   }, 1500); // Đợi 1.5 giây để app load xong

  //   return () => clearTimeout(timer);
  // }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');
    if (isAndroid) {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }
  }, [isDarkMode]);
  
  // Only render Navigation after language is ready and ad SDK init has completed
  if (!isLanguageReady) {
    // Show loading screen while initializing
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000'}}>
        <LottieView
          source={require('./src/assets/loading.json')}
          style={{width: 44, height: 44}}
          autoPlay
          loop
        />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
