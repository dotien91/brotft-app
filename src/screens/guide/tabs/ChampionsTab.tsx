import React, {useMemo, useCallback} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GuideChampionItem from './components/GuideChampionItem';
import {useChampionsWithPagination} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import EmptyList from '@shared-components/empty-list/EmptyList';
import createStyles from './TabContent.style';

const ChampionsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: allChampions,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useChampionsWithPagination(10);

  const championsList = allChampions || [];

  const handleItemPress = useCallback((championId?: string) => {
    NavigationService.push(SCREENS.CHAMPION_DETAIL, {championId});
  }, []);

  const renderItem = useCallback(
    ({item}: {item: typeof championsList[0]}) => (
      <GuideChampionItem
        data={item}
        onPress={() => handleItemPress(item.id)}
      />
    ),
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: typeof championsList[0]) => item.id, []);

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
    if (!hasMore && championsList.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <Text color={colors.placeholder} style={styles.footerText}>
            No more champions to load
          </Text>
        </View>
      );
    }
    return null;
  }, [isLoadingMore, hasMore, championsList.length, styles.footerLoader, styles.footerText, colors.primary, colors.placeholder]);

  const renderLoading = useCallback(() => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ), [styles.centerContainer, colors.primary]);

  const renderError = useCallback(() => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        Error loading champions
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  ), [styles.centerContainer, styles.centerText, colors.danger, colors.placeholder, error]);

  if (isLoading && championsList.length === 0) {
    return renderLoading();
  }

  if (isError && championsList.length === 0) {
    return renderError();
  }

  if (isNoData) {
    return <EmptyList message="No champions found" />;
  }

  return (
    <FlatList
      data={championsList}
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

export default ChampionsTab;

