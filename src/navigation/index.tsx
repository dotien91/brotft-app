import React from 'react';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {isReadyRef, navigationRef} from 'react-navigation-helpers';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SCREENS} from '@shared-constants';
import {DarkTheme, LightTheme, palette} from '@theme/themes';
import useStore from '@services/zustand/store';
import {translations} from '../shared/localization';
// ? Screens
import HomeScreen from '@screens/home/HomeScreen';
import DetailScreen from '@screens/detail/DetailScreen';
import UnitDetailScreen from '@screens/unit-detail/UnitDetailScreen';
import GuideScreen from '@screens/guide/GuideScreen';
import ProfileScreen from '@screens/profile/ProfileScreen';
import TraitDetailScreen from '@screens/traits/TraitDetailScreen';
import ItemDetailScreen from '@screens/item-detail/ItemDetailScreen';

// ? If you want to use stack or tab or both
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const Navigation = () => {
  const isDarkMode = useStore((state) => state.isDarkMode);

  React.useEffect((): any => {
    return () => (isReadyRef.current = false);
  }, []);

  const renderTabIcon = (
    route: any,
    focused: boolean,
    color: string,
    size: number,
  ) => {
    let iconName = 'home';
    switch (route.name) {
      case SCREENS.HOME:
        iconName = focused ? 'home' : 'home-outline';
        break;
      case SCREENS.GUIDE:
        iconName = focused ? 'book' : 'book-outline';
        break;
      case SCREENS.SETTINGS:
        iconName = focused ? 'settings' : 'settings-outline';
        break;
      default:
        iconName = focused ? 'home' : 'home-outline';
        break;
    }
    return (
      <Icon
        name={iconName}
        type={IconType.Ionicons}
        size={size}
        color={color}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
