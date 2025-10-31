import 'react-native-gesture-handler';
import React from 'react';
import {LogBox, StatusBar, useColorScheme} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {QueryClientProvider} from '@tanstack/react-query';
import {isAndroid} from '@freakycoder/react-native-helpers';
import Navigation from './src/navigation';
import {queryClient} from '@services/api/react-query';

LogBox.ignoreAllLogs();

const App = () => {
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  React.useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
    if (isAndroid) {
      StatusBar.setBackgroundColor('rgba(0,0,0,0)');
      StatusBar.setTranslucent(true);
    }

    setTimeout(() => {
      SplashScreen.hide();
    }, 750);
  }, [scheme, isDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
    </QueryClientProvider>
  );
};

export default App;
