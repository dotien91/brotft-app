import React, {useState, useMemo, useCallback} from 'react';
import {useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {TabView, TabBar, Route} from 'react-native-tab-view';
import createStyles from './GuideScreen.style';
import UnitsTab from './tabs/UnitsTab';
import TraitsTab from './tabs/TraitsTab';
import ItemsTab from './tabs/ItemsTab';
import AugmentsTab from './tabs/AugmentsTab';
import {translations} from '../../shared/localization';
import useStore from '@services/zustand/store';
import ScreenHeader from '@shared-components/screen-header/ScreenHeader';

const GuideScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const layout = useWindowDimensions();
  const language = useStore((state) => state.language);

  const [index, setIndex] = useState(0);
  const [visitedTabs, setVisitedTabs] = useState<Set<number>>(new Set([0, 1])); // Preload tab 0 and 1
  
  const routes = useMemo(() => [
    {key: 'units', title: translations.units},
    {key: 'items', title: translations.items},
    {key: 'traits', title: translations.traits},
    {key: 'upgrades', title: translations.upgrades},
  ], [language]);

  const handleIndexChange = useCallback((newIndex: number) => {
    setIndex(newIndex);
    setVisitedTabs(prev => new Set([...prev, newIndex]));
  }, []);

  const renderScene = useCallback(({route}: {route: Route}) => {
    const routeIndex = routes.findIndex(r => r.key === route.key);
    const isEnabled = visitedTabs.has(routeIndex);

    switch (route.key) {
      case 'units':
        return <UnitsTab enabled={isEnabled} />;
      case 'items':
        return <ItemsTab enabled={isEnabled} />;
      case 'traits':
        return <TraitsTab enabled={isEnabled} />;
      case 'upgrades':
        return <AugmentsTab enabled={isEnabled} />;
      default:
        return null;
    }
  }, [routes, visitedTabs]);

  const renderTabBar = useCallback((props: any) => {
    const tabWidth = layout.width / routes.length;
    return (
      <TabBar
        {...props}
        scrollEnabled={false}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabBar}
        tabStyle={[styles.tab, {width: tabWidth}]}
        labelStyle={styles.tabLabel}
        activeColor={colors.primary}
        inactiveColor={colors.placeholder}
        pressColor={colors.primary + '20'}
      />
    );
  }, [layout.width, routes.length, styles.tabIndicator, styles.tabBar, styles.tab, styles.tabLabel, colors.primary, colors.placeholder]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={translations.guide} />

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={handleIndexChange}
        initialLayout={{width: layout.width}}
        lazy={true}
        lazyPreloadDistance={1}
      />
    </SafeAreaView>
  );
};

export default GuideScreen;

