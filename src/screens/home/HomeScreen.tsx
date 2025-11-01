import React, {useMemo} from 'react';
import {
  FlatList,
  Image,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import ChampionCard from './components/champion-card/ChampionCard';
import fonts from '@fonts';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {useChampionsWithPagination} from '@services/api/hooks/listQueryHooks';

const profileURI =
  // eslint-disable-next-line max-len
  'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80';

const HomeScreen: React.FC = () => {
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
    NavigationService.push(SCREENS.DETAIL, {championId});
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const renderMenuButton = () => (
    <RNBounceable>
      <Icon
        name="menuq"
        type={IconType.Ionicons}
        color={colors.iconBlack}
        size={30}
      />
    </RNBounceable>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        {renderMenuButton()}
        <Image
          resizeMode="cover"
          source={{uri: profileURI}}
          style={styles.profilePicImageStyle}
        />
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading champions...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Icon
        name="alert-circle"
        type={IconType.Ionicons}
        color={colors.danger}
        size={48}
      />
      <Text h4 color={colors.danger} style={styles.errorText}>
        Error loading champions
      </Text>
      <Text color={colors.placeholder} style={styles.errorDescription}>
        {error?.message || 'Something went wrong'}
      </Text>
      <RNBounceable
        style={styles.retryButton}
        onPress={() => refresh()}>
        <Text color={colors.white} bold>
          Retry
        </Text>
      </RNBounceable>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="inbox"
        type={IconType.Ionicons}
        color={colors.placeholder}
        size={48}
      />
      <Text h4 color={colors.placeholder} style={styles.emptyText}>
        No champions found
      </Text>
    </View>
  );

  const renderList = () => {
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
        contentContainerStyle={{paddingBottom: 20}}
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
              <Text
                color={colors.placeholder}
                style={{marginTop: 8, fontSize: 14}}>
                Loading more...
              </Text>
            </View>
          ) : !hasMore && allChampions.length > 0 ? (
            <View style={styles.footerLoader}>
              <Text color={colors.placeholder} style={{fontSize: 14}}>
                No more champions to load
              </Text>
            </View>
          ) : null
        }
      />
    );
  };

  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle} color={colors.text}>
        Champions
      </Text>
      <Text
        style={styles.welcomeSubtitle}
        fontFamily={fonts.montserrat.lightItalic}
        color={colors.placeholder}>
        {allChampions.length > 0
          ? `${allChampions.length} champions loaded`
          : 'Explore all champions'}
      </Text>
    </View>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {renderWelcome()}
      <View style={styles.listContainer}>{renderList()}</View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

export default HomeScreen;
