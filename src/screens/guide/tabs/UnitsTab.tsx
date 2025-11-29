import React, {useMemo, useState, useEffect} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideUnitItem from './components/GuideUnitItem';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnitsFilters} from '@services/models/tft-unit';
import {SCREENS} from '@shared-constants';
import createStyles from './TabContent.style';

const UnitsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCost, setSelectedCost] = useState<number | undefined>(undefined);
  const [selectedTrait, setSelectedTrait] = useState<string | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters = useMemo<ITftUnitsFilters | undefined>(() => {
    const filterObj: ITftUnitsFilters = {};
    
    if (debouncedSearchQuery.trim()) {
      filterObj.name = debouncedSearchQuery.trim();
    }
    if (selectedCost !== undefined) {
      filterObj.cost = selectedCost;
    }
    if (selectedTrait) {
      filterObj.trait = selectedTrait;
    }
    if (selectedRole) {
      filterObj.role = selectedRole;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
  }, [debouncedSearchQuery, selectedCost, selectedTrait, selectedRole]);

  // Use pagination hook with filters
  const {
    data: units,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    isRefetching,
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

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.placeholder}>
        {filters ? 'No units found matching your filters' : 'No units found'}
      </Text>
    </View>
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCost(undefined);
    setSelectedTrait(undefined);
    setSelectedRole(undefined);
  };

  const hasActiveFilters = selectedCost !== undefined || selectedTrait || selectedRole || searchQuery.trim();

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
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}>
        {/* Cost Filter */}
        {[1, 2, 3, 4, 5].map(cost => (
          <TouchableOpacity
            key={cost}
            onPress={() => setSelectedCost(selectedCost === cost ? undefined : cost)}
            style={[
              styles.filterChip,
              selectedCost === cost && styles.filterChipActive,
            ]}>
            <Text
              style={[
                styles.filterChipText,
                selectedCost === cost && styles.filterChipTextActive,
              ]}>
              {cost}⭐
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={clearFilters}
            style={[styles.filterChip, styles.filterChipClear]}>
            <Icon
              name="close"
              type={IconType.Ionicons}
              color={colors.text}
              size={16}
            />
            <Text style={styles.filterChipText}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Units List */}
      {unitsList.length === 0 && !isLoading ? (
        renderEmpty()
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
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={
            isLoadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text color={colors.placeholder} style={styles.footerText}>
                  Loading more...
                </Text>
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

