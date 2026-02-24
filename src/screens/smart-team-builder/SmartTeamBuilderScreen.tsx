import React, { useState, useMemo, useCallback } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@react-navigation/native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { getCachedUnits, getCachedItems, getCachedAugments } from '@services/api/data';
import { useSmartSearchCompositions } from './useSmartTeam';
import BackButton from '@shared-components/back-button/BackButton';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {
  SmartBuilderUnitsTab,
  SmartBuilderItemsTab,
  SmartBuilderAugmentsTab,
  SelectedHeroesSection,
  SelectedItemsSection,
  SelectedAugmentsSection,
  RecommendedTeamsSection,
} from './components';
import { translations } from '../../shared/localization';

const SmartTeamBuilderScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  
  // --- STATE LƯU TRỮ LỰA CHỌN ---
  const [selectedUnitApiNames, setSelectedUnitApiNames] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedAugmentApiNames, setSelectedAugmentApiNames] = useState<string[]>([]);

  const routes: Route[] = useMemo(
    () => [
      { key: 'units', title: translations.units },
      { key: 'items', title: translations.items },
      { key: 'augments', title: translations.augments },
    ],
    [],
  );

  // --- LẤY DỮ LIỆU TỪ LOCAL CACHE ---
  const localUnitsMap = useMemo(() => {
    const cached = getCachedUnits();
    return cached ? Object.values(cached) : [];
  }, []);

  const localItemsMap = useMemo(() => {
    const cached = typeof getCachedItems === 'function' ? getCachedItems() : null;
    return cached ? Object.values(cached) : [];
  }, []);

  const localAugmentsMap = useMemo(() => {
    const cached = typeof getCachedAugments === 'function' ? getCachedAugments() : null;
    return cached ? Object.values(cached) : [];
  }, []);

  // --- GỌI API TÌM KIẾM ĐỘI HÌNH ---
  const searchParams = useMemo(() => {
    if (selectedUnitApiNames.length === 0 && selectedItemIds.length === 0 && selectedAugmentApiNames.length === 0) return null;
    return {
      units: selectedUnitApiNames,
      items: selectedItemIds,
      augments: selectedAugmentApiNames,
      searchInAllArrays: true,
    };
  }, [selectedUnitApiNames, selectedItemIds, selectedAugmentApiNames]);

  const { data: searchResponse, isLoading: isSearching, isFetching } = useSmartSearchCompositions(
    searchParams ?? { units: [], items: [], augments: [], searchInAllArrays: true },
    true,
  );
  const matchedTeams: any[] = useMemo(() => {
    const r = searchResponse as any;
    return (Array.isArray(r?.data) ? r.data : Array.isArray(r) ? r : []) as any[];
  }, [searchResponse]);

  // --- CÁC HÀM TOGGLE (CHỌN/BỎ CHỌN) ---
  const handleToggleUnit = useCallback((apiName: string) => {
    setSelectedUnitApiNames((prev) =>
      prev.includes(apiName) ? prev.filter((id) => id !== apiName) : [...prev, apiName]
    );
  }, []);

  const handleToggleItem = useCallback((itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  }, []);

  const handleToggleAugment = useCallback((apiName: string) => {
    setSelectedAugmentApiNames((prev) =>
      prev.includes(apiName) ? prev.filter((id) => id !== apiName) : [...prev, apiName]
    );
  }, []);

  // --- RENDER TỪNG TAB ---
  const renderScene = useCallback(
    ({ route }: { route: Route }) => {
      switch (route.key) {
        case 'units':
          return (
            <SmartBuilderUnitsTab
              selectedUnitApiNames={selectedUnitApiNames}
              onToggleUnit={handleToggleUnit}
            />
          );
        case 'items':
          return (
            <SmartBuilderItemsTab
              selectedItemIds={selectedItemIds}
              onToggleItem={handleToggleItem}
            />
          );
        case 'augments':
          return (
            <SmartBuilderAugmentsTab
              selectedAugmentIds={selectedAugmentApiNames}
              onToggleAugment={handleToggleAugment}
            />
          );
        default:
          return null;
      }
    },
    [selectedUnitApiNames, handleToggleUnit, selectedItemIds, handleToggleItem, selectedAugmentApiNames, handleToggleAugment],
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
        swipeEnabled={false}
      />
    ),
    [colors, tabWidth],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <BackButton />
        <Text style={[styles.headerTitle, { color: colors.text }]}>{translations.smartBuilder}</Text>
        <View style={{ width: 40 }} />
      </View>


      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
     
      <View style={{ height: 240 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          renderTabBar={renderTabBar}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          lazy={true}
          swipeEnabled={false}
        />
      </View>
        <SelectedHeroesSection
          selectedUnitApiNames={selectedUnitApiNames}
          localUnitsMap={localUnitsMap}
          onToggleUnit={handleToggleUnit}
        />
        <SelectedItemsSection
          selectedItemIds={selectedItemIds}
          localItemsMap={localItemsMap}
          onToggleItem={handleToggleItem}
        />
        <SelectedAugmentsSection
          selectedAugmentApiNames={selectedAugmentApiNames}
          localAugmentsMap={localAugmentsMap}
          onToggleAugment={handleToggleAugment}
        />
        <RecommendedTeamsSection
          matchedTeams={matchedTeams}
          isSearching={isSearching}
          isFetching={isFetching}
          hasSelection={selectedUnitApiNames.length > 0 || selectedItemIds.length > 0 || selectedAugmentApiNames.length > 0}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, borderBottomWidth: 1 },
  headerTitle: { fontSize: 16, fontWeight: 'bold' },
  tabBar: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1 },
  tab: { paddingHorizontal: 0 },
  tabLabel: { fontSize: 14, fontWeight: '600', textTransform: 'none' as const },
  tabIndicator: { height: 3, borderRadius: 2 },
  divider: { height: 4, opacity: 0.15 },
  resultsContainer: { flex: 1, paddingTop: 6 },
});

export default SmartTeamBuilderScreen;