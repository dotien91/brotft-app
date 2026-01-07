import 'react-native-gesture-handler';
import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {QueryClientProvider} from '@tanstack/react-query';
import {isAndroid} from '@freakycoder/react-native-helpers';
import {getLocales} from 'react-native-localize';
import Navigation from './src/navigation';
import {queryClient} from '@services/api/react-query';
import useStore from './src/services/zustand/store';
import {translations} from './src/shared/localization';
import {checkAndFetchDataByLocale} from './src/services/api/data';
import {checkAndForceUpdate} from '@services/version-check';
import LocalStorage from './src/services/local-storage';
LogBox.ignoreAllLogs();

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

  React.useEffect(() => {
    // Check if this is first time app launch (no language preference saved)
    // Zustand persist key is 'store', we check if language was actually saved by user
    const LANGUAGE_FIRST_LAUNCH_KEY = 'language_first_launch_set';
    
    React.startTransition(() => {
      // Check if user has ever set a language preference
      const hasSetLanguageBefore = LocalStorage.getBoolean(LANGUAGE_FIRST_LAUNCH_KEY) ?? false;
      if (hasSetLanguageBefore) {
        // User has set language before, use saved preference
        if (language) {
          translations.setLanguage(language);

        } else {
          translations.setLanguage('en');
        }
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
        } catch (error) {
          // Fallback to English if detection fails
          console.log('Failed to detect device language:', error);
          setLanguage('en');
          translations.setLanguage('en');
          LocalStorage.set(LANGUAGE_FIRST_LAUNCH_KEY, true);
        }
      }
    });
  }, []);

  // Check and fetch data by locale on app startup
  React.useEffect(() => {
    checkAndFetchDataByLocale(language);
  }, [language]);

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

    // setTimeout(() => {
    //   SplashScreen.hide();
    // }, 750);
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
