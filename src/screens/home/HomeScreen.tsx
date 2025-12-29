import React, {useMemo, useCallback, useState} from 'react';
import {FlatList, View, ActivityIndicator, ScrollView, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {
  useCompositionsWithPagination,
  useSearchCompositionsByUnits,
  useTftUnitsWithPagination,
} from '@services/api/hooks/listQueryHooks';
import type {IComposition} from '@services/models/composition';
import EmptyList from '@shared-components/empty-list/EmptyList';
import TeamCard from './components/team-card/TeamCard';
import UnitFilterModal from './components/unit-filter-modal/UnitFilterModal';
import {translations} from '../../shared/localization';
import UnitAvatar from '@shared-components/unit-avatar';

const ITEM_HEIGHT = 120; // Giả sử card của bạn cao 120px, hãy điều chỉnh cho đúng

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Fetch all units to get unit details (name, cost) for selected units
  const {data: allUnits} = useTftUnitsWithPagination(1000);

  // Build search DTO
  const searchDto = useMemo(() => {
    console.log('🏠 HomeScreen - Building search DTO:', {
      selectedUnits,
      selectedUnitsLength: selectedUnits.length,
    });
    if (selectedUnits.length === 0) {
      console.log('🏠 HomeScreen - No units selected, returning null');
      return null;
    }
    const dto = {
      units: selectedUnits,
      searchInAllArrays: true,
    };
    console.log('🏠 HomeScreen - Search DTO created:', JSON.stringify(dto, null, 2));
    return dto;
  }, [selectedUnits]);

  // Fetch compositions from API or search by units
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

  // Use search results if filtering, otherwise use all compositions
  const compositions = searchDto ? searchCompositions : allCompositions;
  const isLoading = searchDto ? isLoadingSearch : isLoadingAll;
  const isError = searchDto ? isErrorSearch : isErrorAll;
  const error = searchDto ? errorSearch : errorAll;
  const refresh = searchDto ? refreshSearch : refreshAll;
  const isRefetching = searchDto ? isRefetchingSearch : isRefetchingAll;

  // Debug logging
  React.useEffect(() => {
    if (searchDto) {
      console.log('🏠 HomeScreen - Filter active:', {
        selectedUnits,
        searchCompositionsCount: searchCompositions?.length || 0,
        isLoadingSearch,
        isErrorSearch,
        errorSearch: errorSearch?.message,
      });
    }
  }, [searchDto, selectedUnits, searchCompositions, isLoadingSearch, isErrorSearch, errorSearch]);
  
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

  // Normalize apiName to championKey format (same as in modal)
  const normalizeToChampionKey = useCallback((apiName: string): string => {
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    normalized = normalized.toLowerCase();
    return normalized;
  }, []);

  const renderSelectedUnits = () => {
    if (selectedUnits.length === 0) return null;

    return (
      <View style={styles.selectedUnitsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedUnitsScroll}>
          <RNBounceable
            onPress={handleClearFilter}
            style={styles.clearFilterButton}>
            <View style={styles.clearFilterButtonContent}>
              <Icon
                name="close-circle"
                type={IconType.Ionicons}
                color={colors.primary}
                size={20}
              />
              <Text style={styles.clearFilterButtonText} numberOfLines={1}>
                {translations.clearAll}
              </Text>
            </View>
          </RNBounceable>
          {selectedUnits.map((unitKey, index) => {
            // Find unit by matching championKey
            const unit = allUnits?.find(u => {
              const championKey = normalizeToChampionKey(u.apiName);
              return championKey === unitKey;
            });

            const apiName = unit?.apiName || unitKey;

            return (
              <RNBounceable
                key={`${unitKey}-${index}`}
                onPress={() => handleRemoveUnit(unitKey)}
                style={styles.selectedUnitChip}>
                <View style={styles.selectedUnitAvatarContainer}>
                  <UnitAvatar apiName={apiName} hexSize={46} />
                  <View style={styles.selectedUnitRemoveIcon}>
                    <Icon
                      name="close-circle"
                      type={IconType.Ionicons}
                      color={colors.placeholder}
                      size={20}
                    />
                  </View>
                </View>
              </RNBounceable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderTeamCard = useCallback(
    ({item}: {item: IComposition}) => (
      <TeamCard composition={item} onPress={handleTeamPress} />
    ),
    [handleTeamPress],
  );

  // Memoize Header để tránh re-render không cần thiết
  const ListHeader = useMemo(() => (
    <View>
      <View style={styles.headerContainer}>
        <Image
          source={require('@assets/images/home-cover.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.welcomeText}>{translations.welcomeToTftBuddy}</Text>
        </View>
      </View>
      <View style={styles.sectionTitleContainer}>
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Đội hình</Text>
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
        {renderSelectedUnits()}
      </View>
    </View>
  ), [styles, selectedUnits, allUnits, colors.primary, colors.text, colors.placeholder, colors.background, handleClearFilter, handleRemoveUnit, normalizeToChampionKey]);

  const ListFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary]);

  const ListEmpty = useCallback(() => {
    if (isLoading) return <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />;
    if (isNoData) return <EmptyList message={translations.noCompositionsFound} />;
    return null;
  }, [isLoading, isNoData, colors.primary]);

  // Handler load more tối ưu
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        {ListHeader}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text h4 color={colors.danger}>{translations.errorLoadingCompositions}</Text>
          <Text color={colors.placeholder} style={{marginTop: 8, marginBottom: 16}}>
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
            <Text color="#fff" style={{fontWeight: '600'}}>{translations.retry}</Text>
          </RNBounceable>
        </View>
      </SafeAreaView>
    );
  }

  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={['top']}>
        <FlatList
          data={compositions}
          renderItem={renderTeamCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          // Performance props
          initialNumToRender={7}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true} // Giải phóng bộ nhớ cho item ngoài màn hình
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
          getItemLayout={getItemLayout}
        />
        <UnitFilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApply={handleApplyFilter}
          selectedUnits={selectedUnits}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;