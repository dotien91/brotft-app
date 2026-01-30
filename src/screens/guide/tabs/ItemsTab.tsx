import React, {useMemo, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideItemItem from './components/GuideItemItem';
import {useTftItemsWithPagination} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import EmptyList from '@shared-components/empty-list/EmptyList';
import {translations} from '../../../shared/localization';
import createStyles from './TabContent.style';
import BannerAdItem from '../../home/components/banner-ad-item/BannerAdItem';

interface ItemsTabProps {
  enabled?: boolean;
}

const ItemsTab: React.FC<ItemsTabProps> = ({enabled = true}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: allItems,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useTftItemsWithPagination(20, enabled);

  const itemsList = allItems || [];

  const handleItemPress = useCallback((itemId?: string | number) => {
    NavigationService.push(SCREENS.ITEM_DETAIL, {itemId: String(itemId)});
  }, []);

  // Create list items with banner ad as first item
  type ListItem = {type: 'item'; data: typeof itemsList[0]} | {type: 'ad'; id: string};
  
  const listItems = useMemo<ListItem[]>(() => {
    const result: ListItem[] = [];
    // Add banner ad as first item
    if (itemsList.length > 0) {
      result.push({type: 'ad', id: 'ad-first'});
    }
    // Add all items
    itemsList.forEach((item) => {
      result.push({type: 'item', data: item});
    });
    return result;
  }, [itemsList]);

  const renderItem = useCallback(
    ({item}: {item: ListItem}) => {
      if (item.type === 'ad') {
        return <BannerAdItem />;
      }
      return (
        <GuideItemItem
          data={item.data}
          onPress={() => handleItemPress(item.data.id)}
        />
      );
    },
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'ad') return item.id;
    return String(item.data.id);
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
    if (!hasMore && itemsList.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text color={colors.placeholder} style={styles.footerText}>
            {translations.noMoreItemsToLoad}
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, itemsList.length, styles.footerLoader, styles.footerText, colors.primary, colors.placeholder]);

  const renderLoading = useCallback(() => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ), [styles.centerContainer, colors.primary]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        {translations.errorLoadingItems}
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || translations.somethingWentWrong}
      </Text>
    </View>
  ), [styles.centerContainer, styles.centerText, colors.danger, colors.placeholder, error, translations.errorLoadingItems, translations.somethingWentWrong]);

  if (isLoading && itemsList.length === 0) {
    return renderLoading();
  }

  if (isError && itemsList.length === 0) {
    return renderError();
  }

  if (isNoData) {
    return <EmptyList message={translations.noItemsFound} />;
  }

  return (
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
  );
};

export default ItemsTab;

