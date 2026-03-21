import React, { useState, useMemo, useCallback, useRef } from 'react';
import { View, ScrollView, StyleSheet, StatusBar, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { TabView, TabBar, Route } from 'react-native-tab-view';
import { getCachedUnits, getCachedItems, getCachedAugments } from '@services/api/data';
import { useSmartSearchCompositions } from './useSmartTeam';
import Text from '@shared-components/text-wrapper/TextWrapper';
import ScreenHeader from '@shared-components/screen-header/ScreenHeader';
import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '@shared-constants';
import useStore from '@services/zustand/store';
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
import { palette } from '@theme/themes';
import Icon from '@shared-components/icon/Icon';

/** Đếm số lần chọn/bỏ filter (unit/item/augment) trong phiên app — reset khi thoát app / reload. */
let smartBuilderSessionFilterCount = 0;
/** Hiển thị interstitial mỗi N lần filter trong cùng session (lần 5, 10, …). */
const INTERSTITIAL_EVERY_N_SMART_BUILDER_FILTERS = 5;

const SmartTeamBuilderScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const layout = useWindowDimensions();
  const adsSdkInitAttempted = useStore((state) => state.adsSdkInitAttempted);
  const adsSdkInitialized = useStore((state) => state.adsSdkInitialized);
  const hasTrackingPermission = useStore((state) => state.hasTrackingPermission);

  const [index, setIndex] = useState(0);

  // --- STATE LƯU TRỮ LỰA CHỌN ---
  const [selectedUnitApiNames, setSelectedUnitApiNames] = useState<string[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedAugmentApiNames, setSelectedAugmentApiNames] = useState<string[]>([]);

  const interstitial = useMemo(() => {
    return InterstitialAd.createForAdRequest(AD_UNIT_IDS.INTERSTITIAL, {
      requestNonPersonalizedAdsOnly: !hasTrackingPermission,
    });
  }, [hasTrackingPermission]);

  const isInterstitialLoadedRef = useRef(false);
  const isInterstitialLoadingRef = useRef(false);
  const pendingShowRef = useRef(false);

  const requestLoadInterstitial = useCallback(() => {
    if (!adsSdkInitAttempted || !adsSdkInitialized) return;
    if (isInterstitialLoadingRef.current || isInterstitialLoadedRef.current) return;
    isInterstitialLoadingRef.current = true;
    interstitial.load();
  }, [adsSdkInitAttempted, adsSdkInitialized, interstitial]);

  const maybeShowInterstitial = useCallback(() => {
    if (!adsSdkInitAttempted || !adsSdkInitialized) return;

    if (isInterstitialLoadedRef.current) {
      pendingShowRef.current = false;
      interstitial.show();
      return;
    }

    pendingShowRef.current = true;
    requestLoadInterstitial();
  }, [adsSdkInitAttempted, adsSdkInitialized, interstitial, requestLoadInterstitial]);

  useFocusEffect(
    useCallback(() => {
      isInterstitialLoadedRef.current = false;
      isInterstitialLoadingRef.current = false;
      pendingShowRef.current = false;

      if (!adsSdkInitAttempted || !adsSdkInitialized) {
        return;
      }

      const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
        isInterstitialLoadedRef.current = true;
        isInterstitialLoadingRef.current = false;
        if (pendingShowRef.current) {
          pendingShowRef.current = false;
          interstitial.show();
        }
      });

      const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
        isInterstitialLoadedRef.current = false;
        requestLoadInterstitial();
      });

      const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, () => {
        isInterstitialLoadedRef.current = false;
        isInterstitialLoadingRef.current = false;
        pendingShowRef.current = false;
      });

      requestLoadInterstitial();

      return () => {
        unsubscribeLoaded();
        unsubscribeClosed();
        unsubscribeError();
      };
    }, [adsSdkInitAttempted, adsSdkInitialized, interstitial, requestLoadInterstitial]),
  );

  const onFilterAction = useCallback(() => {
    smartBuilderSessionFilterCount += 1;
    const nextCount = smartBuilderSessionFilterCount;
    if (nextCount % INTERSTITIAL_EVERY_N_SMART_BUILDER_FILTERS === 0) {
      maybeShowInterstitial();
    }
  }, [maybeShowInterstitial]);

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
    onFilterAction();
  }, [onFilterAction]);

  const handleToggleItem = useCallback((itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
    onFilterAction();
  }, [onFilterAction]);

  const handleToggleAugment = useCallback((apiName: string) => {
    setSelectedAugmentApiNames((prev) =>
      prev.includes(apiName) ? prev.filter((id) => id !== apiName) : [...prev, apiName]
    );
    onFilterAction();
  }, [onFilterAction]);

  const hasSelection = selectedUnitApiNames.length > 0 || selectedItemIds.length > 0 || selectedAugmentApiNames.length > 0;
  const handleClearAll = useCallback(() => {
    setSelectedUnitApiNames([]);
    setSelectedItemIds([]);
    setSelectedAugmentApiNames([]);
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
      <ScreenHeader title={translations.smartBuilder} />

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
        <View style={{ height: 12 }} />
        <View style={styles.selectionWrapper}>
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
        {hasSelection ? (
          <TouchableOpacity
            onPress={handleClearAll}
            style={styles.clearAllBtn}
            activeOpacity={0.7}
          >
            <Icon name="trash" color={colors.danger || palette.danger} size={14} />
            <Text style={[styles.clearAllText, { color: colors.danger || palette.danger }]}>
              {translations.clearAll}
            </Text>
          </TouchableOpacity>
        ) : null}
        </View>
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
  clearAllBtn: {
    alignSelf: 'flex-end', // Đẩy nút sang góc phải
    marginHorizontal: 16,
    marginTop: 4,          // Giảm khoảng cách trên
    marginBottom: 8,       // Giảm khoảng cách dưới
    paddingVertical: 4,    // Giảm padding
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 10,
  },
  clearAllText: { 
    fontSize: 12,          // Chữ nhỏ lại một chút để thanh thoát hơn
    fontWeight: '500',
    marginLeft: 6,         // Khoảng cách giữa icon và chữ
    textDecorationLine: 'underline' 
  },
  selectionWrapper: {
    position: 'relative',
  },

  tabBar: { elevation: 0, shadowOpacity: 0, borderBottomWidth: 1 },
  tab: { paddingHorizontal: 0 },
  tabLabel: { fontSize: 14, fontWeight: '600', textTransform: 'none' as const },
  tabIndicator: { height: 3, borderRadius: 2 },
  resultsContainer: { flex: 1, paddingTop: 6 },
});

export default SmartTeamBuilderScreen;