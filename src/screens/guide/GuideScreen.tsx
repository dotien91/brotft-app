import React, {useState, useMemo} from 'react';
import {View, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@react-navigation/native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideScreen.style';
import UnitsTab from './tabs/UnitsTab';
import TraitsTab from './tabs/TraitsTab';
import ItemsTab from './tabs/ItemsTab';
import AugmentsTab from './tabs/AugmentsTab';
import {translations} from '../../shared/localization';
import useStore from '@services/zustand/store';

const renderScene = SceneMap({
  units: UnitsTab,
  traits: TraitsTab,
  items: ItemsTab,
  upgrades: AugmentsTab,
});

const GuideScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const layout = useWindowDimensions();
  const language = useStore((state) => state.language);

  const [index, setIndex] = useState(0);
  const routes = useMemo(() => [
    {key: 'units', title: translations.units},
    {key: 'traits', title: translations.traits},
    {key: 'items', title: translations.items},
    {key: 'upgrades', title: translations.upgrades},
  ], [language]);

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      scrollEnabled
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      tabStyle={styles.tab}
      labelStyle={styles.tabLabel}
      activeColor={colors.primary}
      inactiveColor={colors.placeholder}
      pressColor={colors.primary + '20'}
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text h2 bold color={colors.text} style={styles.headerTitle}>
          {translations.guide}
        </Text>
      </View>

      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
      />
    </SafeAreaView>
  );
};

export default GuideScreen;

