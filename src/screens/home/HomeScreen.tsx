import React, { useMemo, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import { SCREENS } from '@shared-constants';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import { useTheme } from '@react-navigation/native';
import Icon from '@shared-components/icon/Icon';
import Text from '@shared-components/text-wrapper/TextWrapper';
import { useCompositionsWithPagination } from '@services/api/hooks/listQueryHooks';
import type { IComposition } from '@services/models/composition';
import EmptyList from '@shared-components/empty-list/EmptyList';
import TeamCard from './components/team-card/TeamCard';
import HomeHeaderCover from './components/home-header-cover/HomeHeaderCover';
import BannerAdItem from './components/banner-ad-item/BannerAdItem';
import { translations } from '../../shared/localization';
import { FlashList } from '@shopify/flash-list';

type ListItem =
  | { type: 'composition'; data: IComposition }
  | { type: 'ad'; id: string };

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Fetch dữ liệu với pagination
  const {
    data: compositions,
    isLoading,
    isError,
    error,
    refresh,
    isRefetching,
    isLoadingMore,
    hasMore,
    isNoData,
    loadMore,
  } = useCompositionsWithPagination(10, { active: true });

  // Chuyển đổi dữ liệu sang định dạng hỗ trợ nhiều loại item (Multi-type list)
  const listData = useMemo<ListItem[]>(() => {
    if (!compositions || compositions.length === 0) return [];

    const result: ListItem[] = [];
    compositions.forEach((comp, index) => {
      // Chèn quảng cáo định kỳ (mỗi 7 item chèn 1 ad)
      if ((index + 1) % 7 === 1) {
        result.push({ type: 'ad', id: `ad-${index}` });
      }
      result.push({ type: 'composition', data: comp });
    });

    return result;
  }, [compositions]);

  // Tối ưu v2: Giúp list quản lý bộ nhớ tái chế hiệu quả hơn
  const getItemType = useCallback((item: ListItem) => {
    return item.type;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === 'ad') {
        return <BannerAdItem />;
      }
      return <TeamCard composition={item.data} />;
    },
    [],
  );

  const keyExtractor = useCallback((item: ListItem) => {
    if (item.type === 'ad') return item.id;
    return `comp-${item.data.compId || item.data.name}`;
  }, []);

  const ListHeader = useMemo(
    () => (
      <View>
        <HomeHeaderCover />
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>
              {translations.compositionsSection}
            </Text>
            <View style={styles.filterContainer}>
              <RNBounceable
                onPress={() =>
                  NavigationService.navigate(SCREENS.HOME_ROOT, {
                    screen: SCREENS.SMART_TEAM_BUILDER,
                  })
                }
                style={styles.filterButton}
              >
                <View style={styles.hotBadge}>
                  <Icon
                    name="fire"
                    color="#ff0055" 
                    size={20}
                    weight="fill" 
                  />
                </View>
                <Text style={styles.filterButtonText}>
                  {translations.smartRecommendation ?? 'Smart Team'}
                </Text>
              </RNBounceable>
            </View>
          </View>
        </View>
      </View>
    ),
    [styles, colors.text],
  );

  const ListFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary]);

  const ListEmpty = useCallback(() => {
    if (isLoading)
      return (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 50 }}
        />
      );
    if (isNoData)
      return <EmptyList message={translations.noCompositionsFound} />;
    return null;
  }, [isLoading, isNoData, colors.primary]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text h4 color={colors.danger}>{translations.errorLoadingCompositions}</Text>
          <Text color={colors.placeholder} style={{ textAlign: 'center', marginVertical: 10 }}>
            {error?.message || translations.somethingWentWrong}
          </Text>
          <RNBounceable onPress={refresh} style={internalStyles.retryButton}>
            <Text color="#fff" bold>{translations.retry}</Text>
          </RNBounceable>
        </View>
      </SafeAreaView>
    );
  }

  return (
      <FlashList
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        
        // Tối ưu v2: Phân loại pool tái chế để tránh lag khi scroll
        getItemType={getItemType} 
        
        // Tối ưu v2: Tự động giữ vị trí scroll khi load thêm data (pagination)
        maintainVisibleContentPosition={{
          autoscrollToTopThreshold: 0,
        }}
        
        ListHeaderComponent={ListHeader}
        ListFooterComponent={ListFooter}
        ListEmptyComponent={ListEmpty}
        
        refreshing={isRefetching}
        onRefresh={refresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5} 
        showsVerticalScrollIndicator={false}
      />
  );
};

const internalStyles = StyleSheet.create({
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#ff0055',
    borderRadius: 12,
    marginTop: 10
  }
});

export default HomeScreen;