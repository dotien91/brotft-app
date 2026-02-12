import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import Text from '@shared-components/text-wrapper/TextWrapper';

import { useSmartSearchCompositions } from './useSmartTeam';

import BackButton from '@shared-components/back-button/BackButton';
import { UnitsTabContent, ItemsTabContent, AugmentsTabContent } from './components';

const SmartTeamBuilderScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [selectedUnitApiNames, setSelectedUnitApiNames] = useState<string[]>([]);

  const routes: Route[] = useMemo(
    () => [
      { key: 'units', title: 'Units' },
      { key: 'items', title: 'Items' },
      { key: 'augments', title: 'Augments' },
    ],
    [],
  );

  const searchParams = useMemo(
    () => ({ units: selectedUnitApiNames, searchInAllArrays: true }),
    [selectedUnitApiNames],
  );
  const { data: searchResponse, isLoading: isSearching, isFetching } = useSmartSearchCompositions(
    searchParams,
    selectedUnitApiNames.length > 0,
  );
  const matchedTeams = useMemo(() => searchResponse?.data || [], [searchResponse]);

  const handleToggleUnit = useCallback((apiName: string) => {
    setSelectedUnitApiNames((prev) =>
      prev.includes(apiName) ? prev.filter((id) => id !== apiName) : [...prev, apiName]
    );
  }, []);

  const renderScene = useCallback(
    ({ route }: { route: Route }) => {
      switch (route.key) {
        case 'units':
          return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scene}>
              <UnitsTabContent
                selectedUnitApiNames={selectedUnitApiNames}
                onToggleUnit={handleToggleUnit}
                matchedTeams={matchedTeams}
                isSearching={isSearching}
                isFetching={isFetching}
              />
            </ScrollView>
          );
        case 'items':
          return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scene}>
              <ItemsTabContent />
            </ScrollView>
          );
        case 'augments':
          return (
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scene}>
              <AugmentsTabContent />
            </ScrollView>
          );
        default:
          return null;
      }
    },
    [selectedUnitApiNames, handleToggleUnit, matchedTeams, isSearching, isFetching],
  );

  const tabWidth = layout.width / routes.length;

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        scrollEnabled={false}
        indicatorStyle={[styles.tabIndicator, { backgroundColor: colors.primary }]}
        style={[styles.tabBar, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
        tabStyle={[styles.tab, { width: tabWidth }]}
        labelStyle={[styles.tabLabel, { color: colors.text }]}
        activeColor={colors.primary}
        inactiveColor={colors.placeholder}
        pressColor={colors.primary + '20'}
      />
    ),
    [colors.background, colors.border, colors.primary, colors.placeholder, colors.text, tabWidth],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <BackButton />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Smart Builder</Text>
        <View style={{ width: 40 }} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  scene: { flex: 1 },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
  tab: { paddingHorizontal: 0 },
  tabLabel: { fontSize: 14, fontWeight: '600', textTransform: 'none' as const },
  tabIndicator: { height: 3, borderRadius: 2 },
});

export default SmartTeamBuilderScreen;