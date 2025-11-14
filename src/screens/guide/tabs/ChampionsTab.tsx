import React, {useMemo} from 'react';
import {
  FlatList,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import ChampionCard from '@screens/home/components/champion-card/ChampionCard';
import {useChampionsWithPagination} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
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
    loadMore,
    refresh,
    isRefetching,
  } = useChampionsWithPagination(10);

  const handleItemPress = (championId?: string) => {
    NavigationService.push(SCREENS.CHAMPION_DETAIL, {championId});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.centerText}>
        Loading champions...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        Error loading champions
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.placeholder}>
        No champions found
      </Text>
    </View>
  );

  if (isLoading && allChampions.length === 0) {
    return renderLoading();
  }

  if (isError && allChampions.length === 0) {
    return renderError();
  }

  if (allChampions.length === 0 && !isLoading) {
    return renderEmpty();
  }

  return (
    <FlatList
      data={allChampions}
      renderItem={({item}) => (
        <ChampionCard
          data={item}
          onPress={() => handleItemPress(item.id)}
        />
      )}
      keyExtractor={item => item.id}
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
        isLoadingMore || (isLoading && allChampions.length > 0) ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text color={colors.placeholder} style={styles.footerText}>
              Loading more...
            </Text>
          </View>
        ) : !hasMore && allChampions.length > 0 ? (
          <View style={styles.footerLoader}>
            <Text color={colors.placeholder} style={styles.footerText}>
              No more champions to load
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default ChampionsTab;

