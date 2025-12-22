import React, {useMemo, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideAugmentItem from './components/GuideAugmentItem';
import FilterModal from './components/FilterModal';
import AugmentTier from '@shared-components/augment-tier/AugmentTier';
import {useTftAugmentsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftAugmentsFilters, ITftAugmentsSort} from '@services/models/tft-augment';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';

const AugmentsTab: React.FC = () => {
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
  const filters = useMemo<ITftAugmentsFilters | undefined>(() => {
    const filterObj: ITftAugmentsFilters = {};
    
    if (appliedStage) {
      filterObj.stage = appliedStage;
    }
    if (appliedTrait) {
      filterObj.trait = appliedTrait;
    }
    if (appliedTier !== undefined) {
      filterObj.tier = appliedTier;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
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
  } = useTftAugmentsWithPagination(20, filters, sort); // Limit 20 per page

  // Use augments directly from API (already sorted)
  const augmentsList = augments || [];

  const handleItemPress = () => {
    // TODO: Navigate to augment detail screen when available
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingAugments}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  );

  // Initialize temp filters when opening modal
  useEffect(() => {
    if (isFilterModalVisible) {
      setTempStage(appliedStage);
      setTempTrait(appliedTrait);
      setTempTier(appliedTier);
    }
  }, [isFilterModalVisible, appliedStage, appliedTrait, appliedTier]);

  const handleApplyFilters = () => {
    setAppliedStage(tempStage);
    setAppliedTrait(tempTrait);
    setAppliedTier(tempTier);
    setIsFilterModalVisible(false);
  };

  const handleClearAllFilters = () => {
    setTempStage(undefined);
    setTempTrait(undefined);
    setTempTier(undefined);
  };

  const handleClearAppliedFilters = () => {
    setAppliedStage(undefined);
    setAppliedTrait(undefined);
    setAppliedTier(undefined);
  };

  const hasActiveFilters = appliedStage || appliedTrait || appliedTier !== undefined;
  const hasTempFilters = !!(tempStage || tempTrait || tempTier !== undefined);

  // Common stages
  const stages = ['2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: translations.tier,
      type: 'single' as const,
      compact: true,
      options: [
        {
          label: 'Silver I',
          value: 1,
          icon: <AugmentTier tier={1} size={32} showLabel={false} />,
        },
        {
          label: 'Gold II',
          value: 2,
          icon: <AugmentTier tier={2} size={32} showLabel={false} />,
        },
        {
          label: 'Prismatic III',
          value: 3,
          icon: <AugmentTier tier={3} size={32} showLabel={false} />,
        },
      ],
      selected: tempTier,
      onSelect: (value: string | number | boolean) => {
        setTempTier(tempTier === value ? undefined : (value as number));
      },
    },
    {
      title: translations.stage,
      type: 'single' as const,
      compact: true,
      options: stages.map(stage => ({label: stage, value: stage})),
      selected: tempStage,
      onSelect: (value: string | number | boolean) => {
        setTempStage(tempStage === value ? undefined : (value as string));
      },
    },
  ], [tempStage, tempTier, stages]);

  if (isLoading && augmentsList.length === 0) {
    return renderLoading();
  }

  if (isError && augmentsList.length === 0) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {/* Filter Button and Active Filters */}
      <View style={styles.activeFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersContent}>
          <TouchableOpacity
            onPress={() => setIsFilterModalVisible(true)}
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
                  {[appliedStage, appliedTrait, appliedTier].filter(Boolean).length}
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
                  onPress={() => setAppliedTier(undefined)}
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
                  onPress={() => setAppliedStage(undefined)}
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
                  onPress={() => setAppliedTrait(undefined)}
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
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={handleApplyFilters}
        sections={filterSections}
        hasActiveFilters={hasTempFilters}
        onClearAll={handleClearAllFilters}
      />

      {/* Augments List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noAugmentsFoundWithFilters : translations.noAugmentsFound}
        />
      ) : (
        <FlatList
          data={augmentsList}
          renderItem={({item}) => (
            <GuideAugmentItem
              data={item}
              onPress={handleItemPress}
            />
          )}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : !hasMore && augmentsList.length > 0 ? (
              <View style={styles.footerLoader}>
                <Text color={colors.placeholder} style={styles.footerText}>
                  {translations.noMoreAugmentsToLoad}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

export default AugmentsTab;

