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

  const handleItemPress = (unitId?: string | number) => {
    NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unitId)});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingUnitsTab}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  );


  const hasActiveFilters = appliedCost !== undefined || appliedTrait || appliedRole;
  const hasTempFilters = !!(tempCost !== undefined || tempTrait || tempRole);

  // Filter sections for modal
  const filterSections = useMemo(() => [
    {
      title: translations.cost,
      type: 'single' as const,
      compact: true, // Enable compact layout for short content
      options: [1, 2, 3, 4, 5].map(cost => ({label: `${translations.cost} ${cost}`, value: cost})),
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
                  {[appliedCost, appliedTrait, appliedRole].filter(Boolean).length}
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
            {appliedRole && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{translations.role}: {appliedRole}</Text>
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

      {/* Units List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noUnitsFoundWithFilters : translations.noUnitsFoundTab}
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
              {translations.noMoreUnitsToLoad}
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

