import React, {useMemo, useState, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideTraitItem from './components/GuideTraitItem';
import {useTftTraitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftTraitsFilters} from '@services/models/tft-trait';
import {SCREENS} from '@shared-constants';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';

const TraitsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Applied filters (used for API calls)
  const [appliedType, setAppliedType] = useState<'origin' | 'class' | undefined>(undefined);

  const handleTypeToggle = useCallback((type: 'origin' | 'class') => {
    // If clicking the same type, clear it (toggle off)
    // Otherwise, set it (toggle on)
    setAppliedType(currentType => currentType === type ? undefined : type);
  }, []);

  // Build filters object from applied filters
  const filters = useMemo<ITftTraitsFilters | undefined>(() => {
    const filterObj: ITftTraitsFilters = {};
    
    if (appliedType) {
      filterObj.type = appliedType;
    }

    // Return undefined if no filters to avoid unnecessary API calls
    if (Object.keys(filterObj).length === 0) {
      return undefined;
    }

    return filterObj;
  }, [appliedType]);

  const {
    data: allTraits,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useTftTraitsWithPagination(20, filters);

  const handleItemPress = useCallback((traitId?: string | number) => {
    NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: String(traitId)});
  }, []);

  // Ensure allTraits is always an array
  const traitsList = allTraits || [];

  const renderItem = useCallback(
    ({item}: {item: typeof traitsList[0]}) => (
      <GuideTraitItem data={item} onPress={() => handleItemPress(item.id)} />
    ),
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: typeof traitsList[0]) => String(item.id), []);

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
    if (!hasMore && traitsList.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text color={colors.placeholder} style={styles.footerText}>
            {translations.noMoreTraitsToLoad}
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, traitsList.length, styles.footerLoader, styles.footerText, colors.primary, colors.placeholder, translations.noMoreTraitsToLoad]);

  const renderLoading = useCallback(() => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ), [styles.centerContainer, colors.primary]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingTraits}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  ), [styles.centerContainer, styles.centerText, colors.danger, colors.placeholder, error, translations.errorLoadingTraits, translations.somethingWentWrong]);

  const handleOriginPress = useCallback(() => handleTypeToggle('origin'), [handleTypeToggle]);
  const handleClassPress = useCallback(() => handleTypeToggle('class'), [handleTypeToggle]);

  const originButtonStyle = useMemo(() => [
    styles.activeFilterChip,
    appliedType === 'origin' 
      ? {backgroundColor: colors.primary + '20', borderColor: colors.primary}
      : {backgroundColor: colors.background, borderColor: colors.border},
  ], [styles.activeFilterChip, appliedType, colors.primary, colors.background, colors.border]);

  const classButtonStyle = useMemo(() => [
    styles.activeFilterChip,
    appliedType === 'class' 
      ? {backgroundColor: colors.primary + '20', borderColor: colors.primary}
      : {backgroundColor: colors.background, borderColor: colors.border},
  ], [styles.activeFilterChip, appliedType, colors.primary, colors.background, colors.border]);

  const originTextStyle = useMemo(() => [
    styles.activeFilterText,
    appliedType === 'origin' 
      ? {color: colors.primary, fontWeight: '600'}
      : {color: colors.text, fontWeight: '500'},
  ], [styles.activeFilterText, appliedType, colors.primary, colors.text]);

  const classTextStyle = useMemo(() => [
    styles.activeFilterText,
    appliedType === 'class' 
      ? {color: colors.primary, fontWeight: '600'}
      : {color: colors.text, fontWeight: '500'},
  ], [styles.activeFilterText, appliedType, colors.primary, colors.text]);

  if (isLoading && traitsList.length === 0) {
    return renderLoading();
  }

  if (isError && traitsList.length === 0) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {/* Filter Buttons - Tộc/Hệ */}
      <View style={styles.activeFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersContent}>
          <TouchableOpacity
            onPress={handleOriginPress}
            style={originButtonStyle}>
            <Text style={originTextStyle}>
              {translations.origin}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClassPress}
            style={classButtonStyle}>
            <Text style={classTextStyle}>
              {translations.class}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Traits List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noTraitsFound : translations.noTraitsFound}
        />
      ) : (
        <FlatList
          data={traitsList}
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

export default TraitsTab;

