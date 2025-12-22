import React, {useMemo, useCallback} from 'react';
import {FlatList, Image, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {useCompositionsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {IComposition} from '@services/models/composition';
import EmptyList from '@shared-components/empty-list/EmptyList';
import TeamCard from './components/team-card/TeamCard';
import {translations} from '../../shared/localization';

const ITEM_HEIGHT = 120; // Giả sử card của bạn cao 120px, hãy điều chỉnh cho đúng

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

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
  } = useCompositionsWithPagination(10);

  const handleTeamPress = useCallback((comp: IComposition) => {
    NavigationService.push(SCREENS.DETAIL, {compId: comp.compId});
  }, []);

  const renderTeamCard = useCallback(
    ({item}: {item: IComposition}) => (
      <TeamCard composition={item} onPress={handleTeamPress} />
    ),
    [handleTeamPress],
  );

  // Memoize Header để tránh re-render không cần thiết
  const ListHeader = useMemo(() => (
    <View>
      <View style={styles.headerContainer}>
        <Image
          source={require('@assets/images/home-cover.jpg')}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.welcomeText}>{translations.welcomeToTftBuddy}</Text>
        </View>
      </View>
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Đội hình</Text>
      </View>
    </View>
  ), [styles]);

  const ListFooter = useCallback(() => {
    if (!isLoadingMore) return null;
    return (
      <View style={{paddingVertical: 20, alignItems: 'center'}}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }, [isLoadingMore, colors.primary]);

  const ListEmpty = useCallback(() => {
    if (isLoading) return <ActivityIndicator size="large" color={colors.primary} style={{marginTop: 50}} />;
    if (isNoData) return <EmptyList message={translations.noCompositionsFound} />;
    return null;
  }, [isLoading, isNoData, colors.primary]);

  // Handler load more tối ưu
  const handleLoadMore = useCallback(() => {
    if (hasMore && !isLoadingMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoadingMore, isLoading, loadMore]);

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        {ListHeader}
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text h4 color={colors.danger}>{translations.errorLoadingCompositions}</Text>
          <Text color={colors.placeholder} style={{marginTop: 8, marginBottom: 16}}>
            {error?.message || translations.somethingWentWrong}
          </Text>
          <RNBounceable
            onPress={refresh}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              backgroundColor: colors.primary,
              borderRadius: 8,
            }}>
            <Text color="#fff" style={{fontWeight: '600'}}>{translations.retry}</Text>
          </RNBounceable>
        </View>
      </SafeAreaView>
    );
  }

  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={['top']}>
        <FlatList
          data={compositions}
          renderItem={renderTeamCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          // Performance props
          initialNumToRender={7}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true} // Giải phóng bộ nhớ cho item ngoài màn hình
          // Components
          ListHeaderComponent={ListHeader}
          ListFooterComponent={ListFooter}
          ListEmptyComponent={ListEmpty}
          // Actions
          refreshing={isRefetching}
          onRefresh={refresh}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          getItemLayout={getItemLayout}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;