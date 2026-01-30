import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideAugmentItem from './components/GuideAugmentItem';
import FilterModal from './components/FilterModal';
import AugmentTier from '@shared-components/augment-tier/AugmentTier';
import {useTftAugmentsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftAugmentsFilters, ITftAugmentsSort} from '@services/models/tft-augment';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';
import BannerAdItem from '../../home/components/banner-ad-item/BannerAdItem';

interface AugmentsTabProps {
  enabled?: boolean;
}

const AugmentsTab: React.FC<AugmentsTabProps> = ({enabled = true}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Applied filters (used for API calls)
  const [appliedStage, setAppliedStage] = useState<string | undefined>(undefined);
  const [appliedTrait, setAppliedTrait] = useState<string | undefined>(undefined);
  const [appliedTier, setAppliedTier] = useState<number | undefined>(undefined);
  
  // Temp filters (for modal, before applying)
  const [tempStage, setTempStage] = useState<string | undefined>(undefined);
  const [tempTrait, setTempTrait] = useState<string | undefined>(undefined);
  const [tempTier, setTempTier] = useState<number | undefined>(undefined);
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Build filters object from applied filters
  // Temporarily disabled - always return undefined
  const filters = useMemo<ITftAugmentsFilters | undefined>(() => {
    // Temporarily commented out - filters disabled
    // const filterObj: ITftAugmentsFilters = {};
    // 
    // if (appliedStage) {
    //   filterObj.stage = appliedStage;
    // }
    // if (appliedTrait) {
    //   filterObj.trait = appliedTrait;
    // }
    // if (appliedTier !== undefined) {
    //   filterObj.tier = appliedTier;
    // }

    // // Return undefined if no filters to avoid unnecessary API calls
    // if (Object.keys(filterObj).length === 0) {
    //   return undefined;
    // }

    // return filterObj;
    return undefined;
  }, [appliedStage, appliedTrait, appliedTier]);

  // Default sort (always by name, ascending)
  const sort = useMemo<ITftAugmentsSort[] | undefined>(() => {
    return [
      {
        orderBy: 'name',
        order: 'asc',
      },
    ];
  }, []);

  // Use pagination hook with filters and sort
  const {
    data: augments,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useTftAugmentsWithPagination(20, filters, sort, enabled); // Limit 20 per page

  // Use augments directly from API (already sorted)
  const augmentsList = augments || [];

  const handleItemPress = useCallback(() => {
    // TODO: Navigate to augment detail screen when available
  }, []);

  // Create list items with banner ad as first item
  type ListItem = {type: 'augment'; data: typeof augmentsList[0]} | {type: 'ad'; id: string};
  
  const listItems = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    // Add banner ad as first item
    if (augmentsList.length > 0) {
      result.push({type: 'ad', id: 'ad-first'});
    }
    // Add all augments
    augmentsList.forEach((augment) => {
      result.push({type: 'augment', data: augment});
    });
    return result;
  }, [augmentsList]);

  const renderItem = useCallback(
    ({item}: {item: ListItem}) => {
      if (item.type === 'ad') {
        return <BannerAdItem />;
      }
      return (
        <GuideAugmentItem
          data={item.data}
          onPress={handleItemPress}
        />
      );
    },
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'ad') return item.id;
    return String(item.data.id);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  const ListFooter = useCallback(() => {
    if (isLoadingMore) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      );
    }
    if (!hasMore && augmentsList.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text color={colors.placeholder} style={styles.footerText}>
            {translations.noMoreAugmentsToLoad}
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, augmentsList.length, styles.footerLoader, styles.footerText, colors.primary, colors.placeholder, translations.noMoreAugmentsToLoad]);

  const renderLoading = useCallback(() => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ), [styles.centerContainer, colors.primary]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingAugments}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  ), [styles.centerContainer, styles.centerText, colors.danger, colors.placeholder, error, translations.errorLoadingAugments, translations.somethingWentWrong]);

  // Initialize temp filters when opening modal
  useEffect(() => {
    if (isFilterModalVisible) {
      setTempStage(appliedStage);
      setTempTrait(appliedTrait);
      setTempTier(appliedTier);
    }
  }, [isFilterModalVisible, appliedStage, appliedTrait, appliedTier]);

  const handleApplyFilters = useCallback(() => {
    setAppliedStage(tempStage);
    setAppliedTrait(tempTrait);
    setAppliedTier(tempTier);
    setIsFilterModalVisible(false);
  }, [tempStage, tempTrait, tempTier]);

  const handleClearAllFilters = useCallback(() => {
    setTempStage(undefined);
    setTempTrait(undefined);
    setTempTier(undefined);
  }, []);

  const handleClearAppliedFilters = useCallback(() => {
    setAppliedStage(undefined);
    setAppliedTrait(undefined);
    setAppliedTier(undefined);
  }, []);

  const handleFilterModalOpen = useCallback(() => setIsFilterModalVisible(true), []);
  const handleFilterModalClose = useCallback(() => setIsFilterModalVisible(false), []);

  const handleRemoveStageFilter = useCallback(() => setAppliedStage(undefined), []);
  const handleRemoveTraitFilter = useCallback(() => setAppliedTrait(undefined), []);
  const handleRemoveTierFilter = useCallback(() => setAppliedTier(undefined), []);

  const hasActiveFilters = useMemo(() => appliedStage || appliedTrait || appliedTier !== undefined, [appliedStage, appliedTrait, appliedTier]);
  const hasTempFilters = useMemo(() => !!(tempStage || tempTrait || tempTier !== undefined), [tempStage, tempTrait, tempTier]);

  const activeFiltersCount = useMemo(() => [appliedStage, appliedTrait, appliedTier].filter(Boolean).length, [appliedStage, appliedTrait, appliedTier]);

  // Common stages
  const stages = useMemo(() => ['2-1', '2-2', '3-1', '3-2', '4-1', '4-2'], []);

  const handleTierSelect = useCallback((value: string | number | boolean) => {
    setTempTier(tempTier === value ? undefined : (value as number));
  }, [tempTier]);

  const handleStageSelect = useCallback((value: string | number | boolean) => {
    setTempStage(tempStage === value ? undefined : (value as string));
  }, [tempStage]);

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: translations.tier,
      type: 'single' as const,
      compact: true,
      options: [
        {
          label: translations.silverI || 'Silver I',
          value: 1,
          icon: <AugmentTier tier={1} size={32} showLabel={false} />,
        },
        {
          label: translations.goldII || 'Gold II',
          value: 2,
          icon: <AugmentTier tier={2} size={32} showLabel={false} />,
        },
        {
          label: translations.prismaticIII || 'Prismatic III',
          value: 3,
          icon: <AugmentTier tier={3} size={32} showLabel={false} />,
        },
      ],
      selected: tempTier,
      onSelect: handleTierSelect,
    },
    {
      title: translations.stage,
      type: 'single' as const,
      compact: true,
      options: stages.map(stage => ({label: stage, value: stage})),
      selected: tempStage,
      onSelect: handleStageSelect,
    },
  ], [tempStage, tempTier, stages, handleTierSelect, handleStageSelect, translations.tier, translations.stage]);

  if (isLoading && augmentsList.length === 0) {
    return renderLoading();
  }

  if (isError && augmentsList.length === 0) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {/* Filter Button and Active Filters */}
      {/* Temporarily commented out */}
      {/* <View style={styles.activeFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersContent}>
          <TouchableOpacity
            onPress={handleFilterModalOpen}
            style={[styles.filterButton, hasActiveFilters && {backgroundColor: colors.primary + '20'}]}>
            <Icon
              name="filter"
              type={IconType.Ionicons}
              color={hasActiveFilters ? colors.primary : colors.placeholder}
              size={20}
            />
            {hasActiveFilters && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {!hasActiveFilters && (
            <Text style={styles.allText}>{translations.all}</Text>
          )}
          {hasActiveFilters && (
            <>
            {appliedTier !== undefined && (
              <View style={styles.activeFilterChip}>
                <AugmentTier tier={appliedTier} size={20} active={false} showLabel={true} noBackground={true} />
                <TouchableOpacity
                  onPress={handleRemoveTierFilter}
                  style={styles.activeFilterClose}>
                  <Icon
                    name="close-circle"
                    type={IconType.Ionicons}
                    color={colors.placeholder}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            )}
            {appliedStage && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{translations.stage}: {appliedStage}</Text>
                <TouchableOpacity
                  onPress={handleRemoveStageFilter}
                  style={styles.activeFilterClose}>
                  <Icon
                    name="close-circle"
                    type={IconType.Ionicons}
                    color={colors.placeholder}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            )}
            {appliedTrait && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{translations.trait}: {appliedTrait}</Text>
                <TouchableOpacity
                  onPress={handleRemoveTraitFilter}
                  style={styles.activeFilterClose}>
                  <Icon
                    name="close-circle"
                    type={IconType.Ionicons}
                    color={colors.placeholder}
                    size={16}
                  />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity
              onPress={handleClearAppliedFilters}
              style={styles.clearAllButton}>
              <Text style={styles.clearAllText}>{translations.clearAll}</Text>
            </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </View> */}

      {/* Filter Modal */}
      {/* Temporarily commented out */}
      {/* <FilterModal
        visible={isFilterModalVisible}
        onClose={handleFilterModalClose}
        onApply={handleApplyFilters}
        sections={filterSections}
        hasActiveFilters={hasTempFilters}
        onClearAll={handleClearAllFilters}
      /> */}

      {/* Augments List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noAugmentsFoundWithFilters : translations.noAugmentsFound}
        />
      ) : (
        <FlatList
          data={listItems}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={ListFooter}
          // Performance optimizations
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          updateCellsBatchingPeriod={50}
        />
      )}
    </View>
  );
};

export default AugmentsTab;

