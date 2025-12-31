import 'react-native-gesture-handler';
import React from 'react';
import {LogBox, StatusBar} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {QueryClientProvider} from '@tanstack/react-query';
import {isAndroid} from '@freakycoder/react-native-helpers';
import Navigation from './src/navigation';
import {queryClient} from '@services/api/react-query';
import useStore from './src/services/zustand/store';
import {translations} from './src/shared/localization';
import {checkAndFetchDataByLocale} from './src/services/api/data';
import {checkAndForceUpdate} from '@services/version-check';

LogBox.ignoreAllLogs();

const App = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const language = useStore((state) => state.language);

  React.useEffect(() => {
    // Load language from store
    if (language) {
      translations.setLanguage(language);
    }
  }, []);

  // Check and fetch data by locale on app startup
  React.useEffect(() => {
    checkAndFetchDataByLocale(language);
  }, [language]);

  // Check app version on startup
  React.useEffect(() => {
    // Check version sau khi app đã load xong
    const timer = setTimeout(() => {
      checkAndForceUpdate();
    }, 1500); // Đợi 1.5 giây để app load xong

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    if (isAndroid) {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
