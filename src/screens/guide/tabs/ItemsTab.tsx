import React, {useMemo} from 'react';
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
import createStyles from './TabContent.style';

const ItemsTab: React.FC = () => {
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
  } = useTftItemsWithPagination(20);

  const handleItemPress = (itemId?: string | number) => {
    NavigationService.push(SCREENS.ITEM_DETAIL, {itemId: String(itemId)});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        Error loading items
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );

  if (isLoading && allItems.length === 0) {
    return renderLoading();
  }

  if (isError && allItems.length === 0) {
    return renderError();
  }

  if (isNoData) {
    return <EmptyList message="No items found" />;
  }

  return (
    <FlatList
      data={allItems}
      renderItem={({item}) => (
        <GuideItemItem
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
        isLoadingMore || (isLoading && allItems.length > 0) ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : !hasMore && allItems.length > 0 ? (
          <View style={styles.footerLoader}>
            <Text color={colors.placeholder} style={styles.footerText}>
              No more items to load
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default ItemsTab;

