import React, {useMemo, useState, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from '@shared-components/icon/Icon';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideUnitItem from './components/GuideUnitItem';
import {useTftUnitsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {ITftUnitsFilters} from '@services/models/tft-unit';
import {SCREENS} from '@shared-constants';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';
import {getUnitCostBorderColor} from '../../../utils/unitCost';
import CostIcon from '@shared-components/cost-icon/CostIcon';
import BannerAdItem from '../../home/components/banner-ad-item/BannerAdItem';

interface UnitsTabProps {
  enabled?: boolean;
}

const UnitsTab: React.FC<UnitsTabProps> = ({enabled = true}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Applied filters (used for API calls)
  const [appliedCost, setAppliedCost] = useState<number | undefined>(undefined);
  const [appliedTrait, setAppliedTrait] = useState<string | undefined>(undefined);
  const [appliedRole, setAppliedRole] = useState<string | undefined>(undefined);

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
  } = useTftUnitsWithPagination(20, filters, enabled); // Limit 20 per page

  // Ensure units is always an array
  const unitsList = units || [];

  // Create list items with banner ad as first item
  type ListItem = {type: 'unit'; data: typeof unitsList[0]} | {type: 'ad'; id: string};
  
  const listItems = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    // Add banner ad as first item
    if (unitsList.length > 0) {
      result.push({type: 'ad', id: 'ad-first'});
    }
    // Add all units
    unitsList.forEach((unit) => {
      result.push({type: 'unit', data: unit});
    });
    return result;
  }, [unitsList]);

  const renderItem = useCallback(
    ({item}: {item: ListItem}) => {
      if (item.type === 'ad') {
        return <BannerAdItem />;
      }
      return <GuideUnitItem data={item.data} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'ad') return item.id;
    return String(item.data?.id || item.data?._id || item.data?.apiName);
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

  const handleCostToggle = useCallback((cost: number) => {
    // If clicking the same cost, clear it (toggle off)
    // Otherwise, set it (toggle on)
    setAppliedCost(currentCost => currentCost === cost ? undefined : cost);
  }, []);

  const handleRemoveTraitFilter = useCallback(() => setAppliedTrait(undefined), []);
  const handleRemoveRoleFilter = useCallback(() => setAppliedRole(undefined), []);

  // Cost options for direct display
  const costOptions = useMemo(() => [1, 2, 3, 4, 5, 7], []);

  // Style helpers for cost buttons - style like UnitCostBadge
  const getCostButtonStyle = useCallback((cost: number) => {
    const costColor = getUnitCostBorderColor(cost, colors.border || '#94a3b8');
    const isActive = appliedCost === cost;
    
    return {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      gap: 4,
      backgroundColor: costColor,
      borderColor: costColor,
      opacity: isActive ? 1 : 0.6,
    };
  }, [appliedCost, colors.border]);

  if (isLoading && unitsList.length === 0) {
    return renderLoading();
  }

  if (isError && unitsList.length === 0) {
    return renderError();
  }

  return (
    <View style={styles.container}>
      {/* Cost Filter Buttons */}
      <View style={styles.activeFiltersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeFiltersContent}>
          {costOptions.map((cost) => (
            <TouchableOpacity
              key={cost}
              onPress={() => handleCostToggle(cost)}
              style={getCostButtonStyle(cost)}>
              <CostIcon size={12} color="#ffffff" />
              <Text style={styles.costFilterText}>{cost}</Text>
            </TouchableOpacity>
          ))}
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
        </ScrollView>
      </View>

      {/* Units List */}
      {isNoData ? (
        <EmptyList
          message={filters ? translations.noUnitsFoundWithFilters : translations.noUnitsFoundTab}
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

export default UnitsTab;

