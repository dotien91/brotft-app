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
