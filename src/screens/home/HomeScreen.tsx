import React, {useMemo, useState} from 'react';
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
import {useChampions} from '@services/api/hooks/useChampions';

const profileURI =
  // eslint-disable-next-line max-len
  'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const {
    data: championsData,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching,
  } = useChampions({page, limit});

  const handleItemPress = (championId?: string) => {
    // Navigate to detail screen with champion ID if needed
    NavigationService.push(SCREENS.DETAIL, {championId});
  };

  const handleLoadMore = () => {
    if (
      championsData?.pagination &&
      page < championsData.pagination.totalPages
    ) {
      setPage(prev => prev + 1);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const renderMenuButton = () => (
    <RNBounceable>
      <Icon
        name="menu"
        type={IconType.Ionicons}
        color={colors.iconBlack}
        size={30}
      />
    </RNBounceable>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {renderMenuButton()}
      <Image
        resizeMode="cover"
        source={{uri: profileURI}}
        style={styles.profilePicImageStyle}
      />
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
        onPress={() => refetch()}>
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
    if (isLoading && !championsData) {
      return renderLoading();
    }

    if (isError) {
      return renderError();
    }

    const champions = championsData?.data || [];

    if (champions.length === 0 && !isLoading) {
      return renderEmpty();
    }

    return (
      <View style={styles.listContainer}>
        <FlatList
          data={champions}
          renderItem={({item}) => (
            <ChampionCard
              data={item}
              onPress={() => handleItemPress(item.id)}
            />
          )}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoading && championsData ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      </View>
    );
  };

  const renderWelcome = () => (
    <>
      <Text h1 bold color={colors.text}>
        Champions
      </Text>
      <Text
        fontFamily={fonts.montserrat.lightItalic}
        color={colors.placeholder}>
        {championsData?.pagination
          ? `Total: ${championsData.pagination.total} champions`
          : 'Welcome Back'}
      </Text>
    </>
  );

  const renderContent = () => (
    <View style={styles.contentContainer}>
      {renderWelcome()}
      {renderList()}
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
