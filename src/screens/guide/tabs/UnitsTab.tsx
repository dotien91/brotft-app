import React, {useMemo, useState, useEffect, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
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
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';

const UnitsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Applied filters (used for API calls)
  const [appliedCost, setAppliedCost] = useState<number | undefined>(undefined);
  const [appliedTrait, setAppliedTrait] = useState<string | undefined>(undefined);
  const [appliedRole, setAppliedRole] = useState<string | undefined>(undefined);
  
  // Temp filters (for modal, before applying)
  const [tempCost, setTempCost] = useState<number | undefined>(undefined);
  const [tempTrait, setTempTrait] = useState<string | undefined>(undefined);
  const [tempRole, setTempRole] = useState<string | undefined>(undefined);
  
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

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
    setAppliedCost(undefined);
    setAppliedTrait(undefined);
    setAppliedRole(undefined);
  };

  // Build filters object from applied filters
  const filters = useMemo<ITftUnitsFilters | undefined>(() => {
    const filterObj: ITftUnitsFilters = {};
    
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
  }, [appliedCost, appliedTrait, appliedRole]);

  // Use pagination hook with filters
  const {
    data: units,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useTftUnitsWithPagination(20, filters); // Limit 20 per page

  // Ensure units is always an array
  const unitsList = units || [];

  const handleItemPress = useCallback((unitId?: string | number) => {
    NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unitId)});
  }, []);

  const renderItem = useCallback(
    ({item}: {item: typeof unitsList[0]}) => (
      <GuideUnitItem
        data={item}
        onPress={() => handleItemPress(item.id)}
      />
    ),
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: typeof unitsList[0]) => String(item.id), []);

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
    if (!hasMore && unitsList.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text color={colors.placeholder} style={styles.footerText}>
            {translations.noMoreUnitsToLoad}
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, unitsList.length, styles.footerLoader, styles.footerText, colors.primary, colors.placeholder, translations.noMoreUnitsToLoad]);

  const renderLoading = useCallback(() => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ), [styles.centerContainer, colors.primary]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingUnitsTab}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  ), [styles.centerContainer, styles.centerText, colors.danger, colors.placeholder, error, translations.errorLoadingUnitsTab, translations.somethingWentWrong]);

  const hasActiveFilters = useMemo(() => appliedCost !== undefined || appliedTrait || appliedRole, [appliedCost, appliedTrait, appliedRole]);
  const hasTempFilters = useMemo(() => !!(tempCost !== undefined || tempTrait || tempRole), [tempCost, tempTrait, tempRole]);

  const activeFiltersCount = useMemo(() => [appliedCost, appliedTrait, appliedRole].filter(Boolean).length, [appliedCost, appliedTrait, appliedRole]);

  const handleFilterModalOpen = useCallback(() => setIsFilterModalVisible(true), []);
  const handleFilterModalClose = useCallback(() => setIsFilterModalVisible(false), []);

  const handleRemoveCostFilter = useCallback(() => setAppliedCost(undefined), []);
  const handleRemoveTraitFilter = useCallback(() => setAppliedTrait(undefined), []);
  const handleRemoveRoleFilter = useCallback(() => setAppliedRole(undefined), []);

  const handleCostSelect = useCallback((value: string | number | boolean) => {
    setTempCost(tempCost === value ? undefined : (value as number));
  }, [tempCost]);

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: translations.cost,
      type: 'single' as const,
      compact: true, // Enable compact layout for short content
      options: [1, 2, 3, 4, 5].map(cost => ({label: `${translations.cost} ${cost}`, value: cost})),
      selected: tempCost,
      onSelect: handleCostSelect,
    },
  ], [tempCost, translations.cost, handleCostSelect]);

  if (isLoading && unitsList.length === 0) {
    return renderLoading();
  }

  if (isError && unitsList.length === 0) {
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
            {appliedCost !== undefined && (
              <View style={styles.activeFilterChip}>
                <UnitCost cost={appliedCost} size={14} active={true} />
                <TouchableOpacity
                  onPress={handleRemoveCostFilter}
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
            {appliedRole && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{translations.role}: {appliedRole}</Text>
                <TouchableOpacity
                  onPress={handleRemoveRoleFilter}
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
        onClose={handleFilterModalClose}
        onApply={handleApplyFilters}
        sections={filterSections}
        hasActiveFilters={hasTempFilters}
        onClearAll={handleClearAllFilters}
      />

      {/* Units List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noUnitsFoundWithFilters : translations.noUnitsFoundTab}
        />
      ) : (
        <FlatList
          data={unitsList}
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

export default UnitsTab;

