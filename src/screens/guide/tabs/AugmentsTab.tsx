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
import GuideAugmentItem from './components/GuideAugmentItem';
import {useTftAugmentsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftAugmentsFilters} from '@services/models/tft-augment';
import {SCREENS} from '@shared-constants';
import createStyles from './TabContent.style';

const AugmentsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState<string | undefined>(undefined);
  const [selectedTrait, setSelectedTrait] = useState<string | undefined>(undefined);
  const [selectedUnique, setSelectedUnique] = useState<boolean | undefined>(undefined);
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build filters object
  const filters = useMemo<ITftAugmentsFilters | undefined>(() => {
    const filterObj: ITftAugmentsFilters = {};
    
    if (debouncedSearchQuery.trim()) {
      filterObj.name = debouncedSearchQuery.trim();
    }
    if (selectedStage) {
      filterObj.stage = selectedStage;
    }
    if (selectedTrait) {
      filterObj.trait = selectedTrait;
    }
    if (selectedUnique !== undefined) {
      filterObj.unique = selectedUnique;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
  }, [debouncedSearchQuery, selectedStage, selectedTrait, selectedUnique]);

  // Use pagination hook with filters and sort
  const {
    data: augments,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    isRefetching,
  } = useTftAugmentsWithPagination(20, filters); // Limit 20 per page

  // Apply sort to augments data
  const sortedAugments = useMemo(() => {
    if (!augments || augments.length === 0) return [];
    
    const sorted = [...augments].sort((a, b) => {
      let aValue: any;
      let bValue: any;
      
      if (sortBy === 'name') {
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
      } else if (sortBy === 'createdAt') {
        aValue = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        bValue = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
    
    return sorted;
  }, [augments, sortBy, sortOrder]);

  const handleItemPress = (augmentId?: string | number) => {
    // TODO: Navigate to augment detail screen when available
    // NavigationService.push(SCREENS.AUGMENT_DETAIL, {augmentId: String(augmentId)});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.centerText}>
        Loading augments...
      </Text>
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

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.placeholder}>
        {filters ? 'No augments found matching your filters' : 'No augments found'}
      </Text>
    </View>
  );

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedStage(undefined);
    setSelectedTrait(undefined);
    setSelectedUnique(undefined);
  };

  const hasActiveFilters = selectedStage || selectedTrait || selectedUnique !== undefined || searchQuery.trim();

  // Common stages
  const stages = ['2-1', '2-2', '3-1', '3-2', '4-1', '4-2'];

  // Ensure augments is always an array
  const augmentsList = sortedAugments || [];

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
      </View>

      {/* Filter Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}>
        {/* Stage Filter */}
        {stages.map(stage => (
          <TouchableOpacity
            key={stage}
            onPress={() => setSelectedStage(selectedStage === stage ? undefined : stage)}
            style={[
              styles.filterChip,
              selectedStage === stage && {backgroundColor: colors.primary + '20', borderColor: colors.primary},
            ]}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.filterChipText,
                selectedStage === stage && {color: colors.primary, fontWeight: '700'},
              ]}>
              {stage}
            </Text>
          </TouchableOpacity>
        ))}
        
        {/* Unique Filter */}
        <TouchableOpacity
          onPress={() => setSelectedUnique(selectedUnique === true ? undefined : true)}
          style={[
            styles.filterChip,
            selectedUnique === true && {backgroundColor: colors.primary + '20', borderColor: colors.primary},
          ]}
          activeOpacity={0.7}>
          <Text
            style={[
              styles.filterChipText,
              selectedUnique === true && {color: colors.primary, fontWeight: '700'},
            ]}>
            Unique
          </Text>
        </TouchableOpacity>
        
        {/* Sort Toggle */}
        <TouchableOpacity
          onPress={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          style={styles.filterChip}
          activeOpacity={0.7}>
          <Icon
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
            type={IconType.Ionicons}
            color={colors.primary}
            size={16}
          />
          <Text style={[styles.filterChipText, {marginLeft: 4, color: colors.primary}]}>
            {sortBy === 'name' ? 'Name' : 'Date'}
          </Text>
        </TouchableOpacity>
        
        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <TouchableOpacity
            onPress={clearFilters}
            style={styles.filterChipClear}>
            <Icon
              name="close"
              type={IconType.Ionicons}
              color={colors.text}
              size={16}
            />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Augments List */}
      {augmentsList.length === 0 && !isLoading ? (
        renderEmpty()
      ) : (
        <FlatList
          data={augmentsList}
          renderItem={({item}) => (
            <GuideAugmentItem
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

