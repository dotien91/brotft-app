import React, {useMemo, useCallback, useState} from 'react';
import {View, ActivityIndicator} from 'react-native'; // Bỏ FlatList
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {
  useCompositionsWithPagination,
  useSearchCompositionsByUnits,
} from '@services/api/hooks/listQueryHooks';
import type {IComposition} from '@services/models/composition';
import EmptyList from '@shared-components/empty-list/EmptyList';
import TeamCard from './components/team-card/TeamCard';
import UnitFilterModal from './components/unit-filter-modal/UnitFilterModal';
import HomeHeaderCover from './components/home-header-cover/HomeHeaderCover';
import SelectedUnitsFilter from './components/selected-units-filter/SelectedUnitsFilter';
import BannerAdItem from './components/banner-ad-item/BannerAdItem';
import {translations} from '../../shared/localization';
import {FlashList} from '@shopify/flash-list'; // 1. Import FlashList

const ITEM_HEIGHT = 190;
const AD_INTERVAL = 4;

type ListItem =
  | {type: 'composition'; data: IComposition}
  | {type: 'ad'; id: string};

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Build search DTO
  const searchDto = useMemo(() => {
    if (selectedUnits.length === 0) {
      return null;
    }
    return {
      units: selectedUnits,
      searchInAllArrays: true,
    };
  }, [selectedUnits]);

  // Fetch compositions logic (Giữ nguyên)
  const {
    data: allCompositions,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refresh: refreshAll,
    isRefetching: isRefetchingAll,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useCompositionsWithPagination(10);

  const {
    data: searchCompositions,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
    refresh: refreshSearch,
    isRefetching: isRefetchingSearch,
  } = useSearchCompositionsByUnits(searchDto, 10);

  const compositions = searchDto ? searchCompositions : allCompositions;
  const isLoading = searchDto ? isLoadingSearch : isLoadingAll;
  const isError = searchDto ? isErrorSearch : isErrorAll;
  const error = searchDto ? errorSearch : errorAll;
  const refresh = searchDto ? refreshSearch : refreshAll;
  const isRefetching = searchDto ? isRefetchingSearch : isRefetchingAll;

  const handleTeamPress = useCallback((comp: IComposition) => {
    NavigationService.push(SCREENS.DETAIL, {compId: comp.compId});
  }, []);

  const handleApplyFilter = useCallback((units: string[]) => {
    setSelectedUnits(units);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedUnits([]);
  }, []);

  const handleRemoveUnit = useCallback((unitKey: string) => {
    setSelectedUnits(prev => prev.filter(u => u !== unitKey));
  }, []);

  const listData = useMemo<ListItem[]>(() => {
    if (!compositions || compositions.length === 0) return [];

    const result: ListItem[] = [];
    compositions.forEach((comp, index) => {
      result.push({type: 'composition', data: comp});
      if (index % 4 === 0) {
        result.push({type: 'ad', id: `ad-${index}`});
      }
    });

    return result;
  }, [compositions]);

  const renderItem = useCallback(
    ({item}: {item: ListItem}) => {
      if (item.type === 'ad') {
        return <BannerAdItem height={ITEM_HEIGHT} />;
      }
      return <TeamCard composition={item.data} onPress={handleTeamPress} />;
    },
    [handleTeamPress],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'ad') return item.id;
    return item.data.name.toString();
  }, []);

  const ListHeader = useMemo(
    () => (
      <View>
        <HomeHeaderCover />
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>
              {translations.compositionsSection}
            </Text>
            <View style={styles.filterContainer}>
              <RNBounceable
                onPress={() => setIsFilterModalVisible(true)}
                style={styles.filterButton}>
                <Icon
                  name="filter"
                  type={IconType.Ionicons}
                  color={colors.text}
                  size={20}
                />
                <Text style={styles.filterButtonText}>
                  {translations.filterByUnits}
                </Text>
              </RNBounceable>
            </View>
          </View>
          <SelectedUnitsFilter
            selectedUnits={selectedUnits}
            onRemoveUnit={handleRemoveUnit}
            onClearAll={handleClearFilter}
          />
        </View>
      </View>
    ),
    [
      styles,
      selectedUnits,
      colors.text,
      handleClearFilter,
      handleRemoveUnit,
      translations,
    ],
  );

  const ListFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary]);

  const ListEmpty = useCallback(() => {
    if (isLoading)
      return (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{marginTop: 50}}
        />
      );
    if (isNoData)
      return <EmptyList message={translations.noCompositionsFound} />;
    return null;
  }, [isLoading, isNoData, colors.primary, translations]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  // Error State Render
  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        {ListHeader}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text h4 color={colors.danger}>
            {translations.errorLoadingCompositions}
          </Text>
          <Text
            color={colors.placeholder}
            style={{marginTop: 8, marginBottom: 16}}>
            {error?.message || translations.somethingWentWrong}
          </Text>
          <RNBounceable
            onPress={refresh}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}>
            <Text color="#fff" style={{fontWeight: '600'}}>
              {translations.retry}
            </Text>
          </RNBounceable>
        </View>
      </SafeAreaView>
    );
  }

  // 4. Render FlashList
  return (
    <>
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        
        // --- FlashList Props quan trọng ---
        estimatedItemSize={ITEM_HEIGHT} // Giúp FlashList tính toán scroll mượt mà
        
        // Components
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        
        // Actions
        refreshing={isRefetching}
        onRefresh={refresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
      />
      <UnitFilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilter}
        selectedUnits={selectedUnits}
      />
    </>
  );
};

export default HomeScreen;