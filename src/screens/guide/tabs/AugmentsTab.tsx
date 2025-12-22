import React, {useMemo, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TextInput,
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
import createStyles from './TabContent.style';

const AugmentsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Applied filters (used for API calls)
  const [appliedStage, setAppliedStage] = useState<string | undefined>(undefined);
  const [appliedTrait, setAppliedTrait] = useState<string | undefined>(undefined);
  const [appliedTier, setAppliedTier] = useState<number | undefined>(undefined);
  const [appliedUnique, setAppliedUnique] = useState<boolean | undefined>(undefined);
  const [appliedSortBy, setAppliedSortBy] = useState<'name' | 'createdAt'>('name');
  const [appliedSortOrder, setAppliedSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Temp filters (for modal, before applying)
  const [tempStage, setTempStage] = useState<string | undefined>(undefined);
  const [tempTrait, setTempTrait] = useState<string | undefined>(undefined);
  const [tempTier, setTempTier] = useState<number | undefined>(undefined);
  const [tempUnique, setTempUnique] = useState<boolean | undefined>(undefined);
  const [tempSortBy, setTempSortBy] = useState<'name' | 'createdAt'>('name');
  const [tempSortOrder, setTempSortOrder] = useState<'asc' | 'desc'>('asc');
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object from applied filters
  const filters = useMemo<ITftAugmentsFilters | undefined>(() => {
    const filterObj: ITftAugmentsFilters = {};
    
    if (debouncedSearchQuery.trim()) {
      filterObj.name = debouncedSearchQuery.trim();
    }
    if (appliedStage) {
      filterObj.stage = appliedStage;
    }
    if (appliedTrait) {
      filterObj.trait = appliedTrait;
    }
    if (appliedTier !== undefined) {
      filterObj.tier = appliedTier;
    }
    if (appliedUnique !== undefined) {
      filterObj.unique = appliedUnique;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
  }, [debouncedSearchQuery, appliedStage, appliedTrait, appliedTier, appliedUnique]);

  // Build sort object from applied sort
  const sort = useMemo<ITftAugmentsSort[] | undefined>(() => {
    if (!appliedSortBy) return undefined;
    return [
      {
        orderBy: appliedSortBy,
        order: appliedSortOrder,
      },
    ];
  }, [appliedSortBy, appliedSortOrder]);

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
        Error loading augments
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );


  // Initialize temp filters when opening modal
  useEffect(() => {
    if (isFilterModalVisible) {
      setTempStage(appliedStage);
      setTempTrait(appliedTrait);
      setTempTier(appliedTier);
      setTempUnique(appliedUnique);
      setTempSortBy(appliedSortBy);
      setTempSortOrder(appliedSortOrder);
    }
  }, [isFilterModalVisible, appliedStage, appliedTrait, appliedTier, appliedUnique, appliedSortBy, appliedSortOrder]);

  const handleApplyFilters = () => {
    setAppliedStage(tempStage);
    setAppliedTrait(tempTrait);
    setAppliedTier(tempTier);
    setAppliedUnique(tempUnique);
    setAppliedSortBy(tempSortBy);
    setAppliedSortOrder(tempSortOrder);
    setIsFilterModalVisible(false);
  };

  const handleClearAllFilters = () => {
    setTempStage(undefined);
    setTempTrait(undefined);
    setTempTier(undefined);
    setTempUnique(undefined);
    setTempSortBy('name');
    setTempSortOrder('asc');
  };

  const handleClearAppliedFilters = () => {
    setSearchQuery('');
    setAppliedStage(undefined);
    setAppliedTrait(undefined);
    setAppliedTier(undefined);
    setAppliedUnique(undefined);
    setAppliedSortBy('name');
    setAppliedSortOrder('asc');
  };

  const hasActiveFilters = appliedStage || appliedTrait || appliedTier !== undefined || appliedUnique !== undefined || searchQuery.trim();
  const hasTempFilters = !!(tempStage || tempTrait || tempTier !== undefined || tempUnique !== undefined);

  // Common stages
  const stages = ['2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: 'Tier',
      type: 'single' as const,
      compact: true, // Enable compact layout for short content
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
      title: 'Stage',
      type: 'single' as const,
      compact: true, // Enable compact layout for short content
      options: stages.map(stage => ({label: stage, value: stage})),
      selected: tempStage,
      onSelect: (value: string | number | boolean) => {
        setTempStage(tempStage === value ? undefined : (value as string));
      },
    },
    {
      title: 'Unique',
      type: 'toggle' as const,
      options: [{label: 'Unique Only', value: true}],
      selected: tempUnique === true,
      onSelect: () => {
        setTempUnique(tempUnique === true ? undefined : true);
      },
    },
    {
      title: 'Sort By',
      type: 'single' as const,
      options: [
        {label: 'Name', value: 'name'},
        {label: 'Date', value: 'createdAt'},
      ],
      selected: tempSortBy,
      onSelect: (value: string | number | boolean) => {
        setTempSortBy(value as 'name' | 'createdAt');
      },
    },
    {
      title: 'Sort Order',
      type: 'single' as const,
      options: [
        {label: 'Ascending', value: 'asc'},
        {label: 'Descending', value: 'desc'},
      ],
      selected: tempSortOrder,
      onSelect: (value: string | number | boolean) => {
        setTempSortOrder(value as 'asc' | 'desc');
      },
    },
  ], [tempStage, tempTier, tempUnique, tempSortBy, tempSortOrder, stages]);

  if (isLoading && augmentsList.length === 0) {
    return renderLoading();
  }

  if (isError && augmentsList.length === 0) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon
          name="search"
          type={IconType.Ionicons}
          color={colors.placeholder}
          size={20}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search augments by name..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}>
            <Icon
              name="close-circle"
              type={IconType.Ionicons}
              color={colors.placeholder}
              size={20}
            />
          </TouchableOpacity>
        )}
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
                {[appliedStage, appliedTrait, appliedTier, appliedUnique !== undefined ? 'Unique' : null].filter(Boolean).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFiltersContent}>
            {appliedStage && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Stage: {appliedStage}</Text>
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
            {appliedTrait && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Trait: {appliedTrait}</Text>
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
            {appliedUnique !== undefined && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Unique</Text>
                <TouchableOpacity
                  onPress={() => setAppliedUnique(undefined)}
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
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

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
          message={filters ? 'No augments found matching your filters' : 'No augments found'}
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
                  No more augments to load
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

