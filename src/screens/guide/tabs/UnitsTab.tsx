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
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideUnitItem from './components/GuideUnitItem';
import FilterModal from './components/FilterModal';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnitsFilters} from '@services/models/tft-unit';
import {SCREENS} from '@shared-constants';
import UnitCost from '@shared-components/unit-cost/UnitCost';
import EmptyList from '@shared-components/empty-list/EmptyList';
import createStyles from './TabContent.style';

const UnitsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Applied filters (used for API calls)
  const [appliedCost, setAppliedCost] = useState<number | undefined>(undefined);
  const [appliedTrait, setAppliedTrait] = useState<string | undefined>(undefined);
  const [appliedRole, setAppliedRole] = useState<string | undefined>(undefined);
  
  // Temp filters (for modal, before applying)
  const [tempCost, setTempCost] = useState<number | undefined>(undefined);
  const [tempTrait, setTempTrait] = useState<string | undefined>(undefined);
  const [tempRole, setTempRole] = useState<string | undefined>(undefined);
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Initialize temp filters when opening modal
  useEffect(() => {
    if (isFilterModalVisible) {
      setTempCost(appliedCost);
      setTempTrait(appliedTrait);
      setTempRole(appliedRole);
    }
  }, [isFilterModalVisible, appliedCost, appliedTrait, appliedRole]);

  const handleApplyFilters = () => {
    setAppliedCost(tempCost);
    setAppliedTrait(tempTrait);
    setAppliedRole(tempRole);
    setIsFilterModalVisible(false);
  };

  const handleClearAllFilters = () => {
    setTempCost(undefined);
    setTempTrait(undefined);
    setTempRole(undefined);
  };

  const handleClearAppliedFilters = () => {
    setSearchQuery('');
    setAppliedCost(undefined);
    setAppliedTrait(undefined);
    setAppliedRole(undefined);
  };

  // Build filters object from applied filters
  const filters = useMemo<ITftUnitsFilters | undefined>(() => {
    const filterObj: ITftUnitsFilters = {};
    
    if (debouncedSearchQuery.trim()) {
      filterObj.name = debouncedSearchQuery.trim();
    }
    if (appliedCost !== undefined) {
      filterObj.cost = appliedCost;
    }
    if (appliedTrait) {
      filterObj.trait = appliedTrait;
    }
    if (appliedRole) {
      filterObj.role = appliedRole;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
  }, [debouncedSearchQuery, appliedCost, appliedTrait, appliedRole]);

  // Use pagination hook with filters
  const {
    data: units,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
  } = useTftUnitsWithPagination(20, filters); // Limit 20 per page

  const handleItemPress = (unitId?: string | number) => {
    NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unitId)});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.centerText}>
        Loading units...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        Error loading units
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );


  const hasActiveFilters = appliedCost !== undefined || appliedTrait || appliedRole || searchQuery.trim();
  const hasTempFilters = !!(tempCost !== undefined || tempTrait || tempRole);

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: 'Cost',
      type: 'single' as const,
      compact: true, // Enable compact layout for short content
      options: [1, 2, 3, 4, 5].map(cost => ({label: `Cost ${cost}`, value: cost})),
      selected: tempCost,
      onSelect: (value: string | number | boolean) => {
        setTempCost(tempCost === value ? undefined : (value as number));
      },
    },
  ], [tempCost]);

  // Ensure units is always an array
  const unitsList = units || [];

  if (isLoading && unitsList.length === 0) {
    return renderLoading();
  }

  if (isError && unitsList.length === 0) {
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
          placeholder="Search units by name..."
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
                {[appliedCost, appliedTrait, appliedRole].filter(Boolean).length}
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
            {appliedCost !== undefined && (
              <View style={styles.activeFilterChip}>
                <UnitCost cost={appliedCost} size={14} active={true} />
                <TouchableOpacity
                  onPress={() => setAppliedCost(undefined)}
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
            {appliedRole && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>Role: {appliedRole}</Text>
                <TouchableOpacity
                  onPress={() => setAppliedRole(undefined)}
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

      {/* Units List */}
      {unitsList.length === 0 && !isLoading ? (
        <EmptyList
          message={filters ? 'No units found matching your filters' : 'No units found'}
        />
      ) : (
    <FlatList
          data={unitsList}
      renderItem={({item}) => (
        <GuideUnitItem
          data={item}
          onPress={() => handleItemPress(item.id)}
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
            ) : !hasMore && unitsList.length > 0 ? (
          <View style={styles.footerLoader}>
            <Text color={colors.placeholder} style={styles.footerText}>
              No more units to load
            </Text>
          </View>
        ) : null
      }
    />
      )}
    </View>
  );
};

export default UnitsTab;

