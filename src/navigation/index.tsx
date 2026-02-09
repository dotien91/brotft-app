import React from 'react';
import Icon, {IconType} from '@shared-components/icon/Icon';
import {isReadyRef, navigationRef} from 'react-navigation-helpers';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, NavigationState} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SCREENS} from '@shared-constants';
import {DarkTheme, LightTheme, palette} from '@theme/themes';
import useStore from '@services/zustand/store';
import {translations} from '../shared/localization';
import {trackScreen} from '@services/api/screen-tracking';
// ? Screens
import HomeScreen from '@screens/home/HomeScreen';
import DetailScreen from '@screens/detail/DetailScreen';
import UnitDetailScreen from '@screens/unit-detail/UnitDetailScreen';
import GuideScreen from '@screens/guide/GuideScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import TraitDetailScreen from '@screens/traits/TraitDetailScreen';
import ItemDetailScreen from '@screens/item-detail/ItemDetailScreen';
import ChampionDetailScreen from '@screens/champion-detail/ChampionDetailScreen';
import PrivacyScreen from '@screens/privacy/PrivacyScreen';
import TermsScreen from '@screens/terms/TermsScreen';
import FeedbackScreen from '@screens/feedback/FeedbackScreen';

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Helper function to get the current route name from navigation state
const getActiveRouteName = (state: NavigationState | undefined): string | undefined => {
  if (!state || typeof state.index !== 'number') {
    return undefined;
  }

  const route = state.routes[state.index];

  if (route.state) {
    // Recursively get the active route name in nested navigators
    return getActiveRouteName(route.state as NavigationState);
  }

  return route.name;
};

// Map screen names to tracking names
const getTrackingScreenName = (routeName: string): string => {
  // Map specific screen names to their tracking names
  const screenNameMap: Record<string, string> = {
    [SCREENS.HOME]: 'home',
    [SCREENS.GUIDE]: 'guide',
    [SCREENS.SETTINGS]: 'settings',
    [SCREENS.DETAIL]: 'detail',
    [SCREENS.UNIT_DETAIL]: 'unit-detail',
    [SCREENS.TRAIT_DETAIL]: 'trait-detail',
    [SCREENS.ITEM_DETAIL]: 'item-detail',
    [SCREENS.CHAMPION_DETAIL]: 'champion-detail',
    [SCREENS.PRIVACY]: 'privacy',
    [SCREENS.TERMS]: 'terms',
    [SCREENS.FEEDBACK]: 'feedback',
    [SCREENS.HOME_ROOT]: 'home', // HomeRoot maps to home
  };

  // Return mapped name if exists, otherwise convert CamelCase to kebab-case
  if (screenNameMap[routeName]) {
    return screenNameMap[routeName];
  }

  // Fallback: convert CamelCase to kebab-case
  return routeName
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '');
};

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const previousRouteNameRef = React.useRef<string | undefined>();

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  // Handle navigation state changes for screen tracking
  const handleNavigationStateChange = React.useCallback(
    (state: NavigationState | undefined) => {
      const currentRouteName = getActiveRouteName(state);

      // Only track if the route name has changed
      if (
        currentRouteName &&
        currentRouteName !== previousRouteNameRef.current
      ) {
        // Map route name to tracking screen name
        const screenName = getTrackingScreenName(currentRouteName);

        // Track the screen view
        trackScreen(screenName).catch(error => {
          // Silently handle errors - tracking shouldn't break the app
          console.warn('Screen tracking error:', error);
        });

        previousRouteNameRef.current = currentRouteName;
      }
    },
    [],
  );

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = 'house';
    // Phosphor supports weights: 'thin', 'light', 'regular', 'bold', 'fill', 'duotone'
    let weight: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' = focused ? 'fill' : 'regular';
    
    switch (route.name) {
      case SCREENS.HOME:
        iconName = 'house'; // Phosphor: House
        break;
      case SCREENS.GUIDE:
        iconName = 'book-open'; // Phosphor: BookOpen (Quyển sách mở)
        break;
      case SCREENS.SETTINGS:
        iconName = 'gear'; // Phosphor: Gear (Bánh răng)
        break;
      default:
        iconName = 'house';
        break;
    }
    
    return (
      <Icon
        name={iconName}
        size={size}
        color={color}
        weight={weight}
      />
    );
  };

  const TabNavigation = () => {
    const currentTheme = isDarkMode ? DarkTheme : LightTheme;
    return (
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) =>
            renderTabIcon(route, focused, color, size),
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: currentTheme.colors.placeholder,
          tabBarStyle: {
            backgroundColor: currentTheme.colors.background,
            borderTopColor: currentTheme.colors.border,
            borderTopWidth: 1,
          },
        })}>
        <Tab.Screen 
          name={SCREENS.HOME} 
          component={HomeScreen}
          options={{tabBarLabel: translations.home}}
        />
        <Tab.Screen 
          name={SCREENS.GUIDE} 
          component={GuideScreen}
          options={{tabBarLabel: translations.guide}}
        />
        <Tab.Screen 
          name={SCREENS.SETTINGS} 
          component={ProfileScreen}
          options={{tabBarLabel: translations.settings}}
        />
      </Tab.Navigator>
    );
  };

  const currentTheme = isDarkMode ? DarkTheme : LightTheme;

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => {
        isReadyRef.current = true;
      }}
      onStateChange={handleNavigationStateChange}
      theme={currentTheme}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={SCREENS.HOME_ROOT} component={TabNavigation} />
        <Stack.Screen name={SCREENS.DETAIL}>
          {props => <DetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.UNIT_DETAIL}>
          {props => <UnitDetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.TRAIT_DETAIL}>
          {props => <TraitDetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.ITEM_DETAIL}>
          {props => <ItemDetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.CHAMPION_DETAIL}>
          {props => <ChampionDetailScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name={SCREENS.PRIVACY} component={PrivacyScreen} />
        <Stack.Screen name={SCREENS.TERMS} component={TermsScreen} />
        <Stack.Screen name={SCREENS.FEEDBACK} component={FeedbackScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;