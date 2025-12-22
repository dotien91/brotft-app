import React, {useMemo, useState} from 'react';
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

  const handleTypeToggle = (type: 'origin' | 'class') => {
    // If clicking the same type, clear it (toggle off)
    // Otherwise, set it (toggle on)
    setAppliedType(appliedType === type ? undefined : type);
  };

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

  const handleItemPress = (traitId?: string | number) => {
    NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId: String(traitId)});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingTraits}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  );


  // Ensure allTraits is always an array
  const traitsList = allTraits || [];

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
            onPress={() => handleTypeToggle('origin')}
            style={[
              styles.activeFilterChip,
              appliedType === 'origin' 
                ? {backgroundColor: colors.primary + '20', borderColor: colors.primary}
                : {backgroundColor: colors.background, borderColor: colors.border},
            ]}>
            <Text style={[
              styles.activeFilterText,
              appliedType === 'origin' 
                ? {color: colors.primary, fontWeight: '600'}
                : {color: colors.text, fontWeight: '500'},
            ]}>
              {translations.origin}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTypeToggle('class')}
            style={[
              styles.activeFilterChip,
              appliedType === 'class' 
                ? {backgroundColor: colors.primary + '20', borderColor: colors.primary}
                : {backgroundColor: colors.background, borderColor: colors.border},
            ]}>
            <Text style={[
              styles.activeFilterText,
              appliedType === 'class' 
                ? {color: colors.primary, fontWeight: '600'}
                : {color: colors.text, fontWeight: '500'},
            ]}>
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
      renderItem={({item}) => (
        <GuideTraitItem data={item} onPress={() => handleItemPress(item.id)} />
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
        ) : !hasMore && traitsList.length > 0 ? (
          <View style={styles.footerLoader}>
            <Text color={colors.placeholder} style={styles.footerText}>
              {translations.noMoreTraitsToLoad}
            </Text>
          </View>
        ) : null
      }
    />
      )}
    </View>
  );
};

export default TraitsTab;

