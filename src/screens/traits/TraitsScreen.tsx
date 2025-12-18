import React, {useMemo, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  View,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import {TabView, TabBar} from 'react-native-tab-view';
import createStyles from './TraitsScreen.style';
import TraitCard from './components/trait-card/TraitCard';
import fonts from '@fonts';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {useListData} from '../../hooks/useListData';
import {getTraitsForList} from '@services/api/traitsForList';
import type {ITrait} from '@services/models/trait';
import EmptyList from '@shared-components/empty-list/EmptyList';

const profileURI =
  // eslint-disable-next-line max-len
  'https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2574&q=80';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type FilterType = 'all' | 'origin' | 'class';

interface TraitsListProps {
  filterType: FilterType;
  onItemPress: (traitId?: string) => void;
  theme: any;
  styles: any;
}

const TraitsList: React.FC<TraitsListProps> = ({
  filterType,
  onItemPress,
  theme,
  styles,
}) => {
  const {colors} = theme;

  // Convert filterType to API filter format
  const apiFilters = useMemo(() => {
    if (filterType === 'all') return undefined;
    return {type: filterType, name: null, key: null, set: null};
  }, [filterType]);

  // Prepare params for useListData
  const listParams = useMemo(() => {
    return {
      limit: 20,
      filters: apiFilters,
    };
  }, [apiFilters]);

  const {
    listData,
    isLoading,
    noData,
    onEndReach,
    refreshControl,
    renderFooterComponent,
  } = useListData<ITrait>(listParams, getTraitsForList, [], filterType);
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={styles.loadingText}>
        Loading traits...
      </Text>
    </View>
  );

  if (isLoading && listData.length === 0) {
    return renderLoading();
  }

  if (noData && listData.length === 0 && !isLoading) {
    return (
      <EmptyList
        message="No traits found"
        iconName="inbox"
        iconType={IconType.Ionicons}
        style={styles.emptyContainer}
      />
    );
  }

  return (
    <FlatList
      data={listData}
      renderItem={({item}) => (
        <TraitCard data={item} onPress={() => onItemPress(item.id)} />
      )}
      keyExtractor={item => item.id}
      contentContainerStyle={{paddingBottom: 20, paddingHorizontal: 20}}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl()}
      onEndReached={() => onEndReach({})}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooterComponent()}
    />
  );
};

const TraitsScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'all', title: 'Tất cả'},
    {key: 'origin', title: 'Tộc'},
    {key: 'class', title: 'Hệ'},
  ]);

  const handleItemPress = useCallback((traitId?: string) => {
    NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId});
  }, []);

  const renderScene = useCallback(
    ({route}: any) => {
      const filterType = route.key as FilterType;
      return (
        <TraitsList
          key={`traits-list-${filterType}`}
          filterType={filterType}
          onItemPress={handleItemPress}
          theme={theme}
          styles={styles}
        />
      );
    },
    [handleItemPress, theme, styles],
  );

  const renderTabBar = useCallback(
    (props: any) => {
      return (
        <TabBar
          {...props}
          indicatorStyle={styles.tabIndicator}
          style={styles.tabBar}
          labelStyle={styles.tabLabel}
          activeColor={colors.primary}
          inactiveColor={colors.placeholder}
          pressColor={colors.primary + '20'}
        />
      );
    },
    [colors, styles],
  );

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

  const renderWelcome = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcomeTitle} color={colors.text}>
        Traits
      </Text>
      <Text
        style={styles.welcomeSubtitle}
        fontFamily={fonts.montserrat.lightItalic}
        color={colors.placeholder}>
        Explore all traits
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.contentContainer}>
        {renderWelcome()}
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: SCREEN_WIDTH}}
          renderTabBar={renderTabBar}
          swipeEnabled={true}
          lazy={true}
          lazyPreloadDistance={0}
        />
      </View>
    </SafeAreaView>
  );
};

export default TraitsScreen;
