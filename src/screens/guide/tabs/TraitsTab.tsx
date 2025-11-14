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
import TraitCard from '@screens/traits/components/trait-card/TraitCard';
import {useTraitsWithPagination} from '@services/api/hooks/listQueryHooks';
import {SCREENS} from '@shared-constants';
import createStyles from './TabContent.style';

const TraitsTab: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: allTraits,
    isLoading,
    isError,
    error,
    isLoadingMore,
    hasMore,
    loadMore,
    refresh,
    isRefetching,
  } = useTraitsWithPagination(20);

  const handleItemPress = (traitId?: string) => {
    NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId});
  };

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.centerText}>
        Loading traits...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.danger}>
        Error loading traits
      </Text>
      <Text color={colors.placeholder} style={styles.centerText}>
        {error?.message || 'Something went wrong'}
      </Text>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.centerContainer}>
      <Text h4 color={colors.placeholder}>
        No traits found
      </Text>
    </View>
  );

  if (isLoading && allTraits.length === 0) {
    return renderLoading();
  }

  if (isError && allTraits.length === 0) {
    return renderError();
  }

  if (allTraits.length === 0 && !isLoading) {
    return renderEmpty();
  }

  return (
    <FlatList
      data={allTraits}
      renderItem={({item}) => (
        <TraitCard data={item} onPress={() => handleItemPress(item.id)} />
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
        isLoadingMore || (isLoading && allTraits.length > 0) ? (
          <View style={styles.footerLoader}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text color={colors.placeholder} style={styles.footerText}>
              Loading more...
            </Text>
          </View>
        ) : !hasMore && allTraits.length > 0 ? (
          <View style={styles.footerLoader}>
            <Text color={colors.placeholder} style={styles.footerText}>
              No more traits to load
            </Text>
          </View>
        ) : null
      }
    />
  );
};

export default TraitsTab;

