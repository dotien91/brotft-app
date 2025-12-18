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

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Fetch compositions from API
  const {
    data: compositions,
    isLoading,
    isError,
    error,
    refresh,
    isRefetching,
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

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Image
        source={require('@assets/images/home-cover.jpg')}
        style={styles.headerImage}
        resizeMode="cover"
      />
      <View style={styles.headerOverlay}>
        <Text style={styles.welcomeText}>Welcome to TFTBuddy</Text>
      </View>
    </View>
  );

  const renderLoading = () => (
    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', flex: 1}]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text color={colors.placeholder} style={{marginTop: 12}}>
        Loading compositions...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={[styles.container, {justifyContent: 'center', alignItems: 'center', flex: 1}]}>
      <Text h4 color={colors.danger}>
        Error loading compositions
      </Text>
      <Text color={colors.placeholder} style={{marginTop: 8, marginBottom: 16}}>
        {error?.message || 'Something went wrong'}
      </Text>
      <RNBounceable
        onPress={() => refresh()}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: colors.primary,
          borderRadius: 8,
        }}>
        <Text color="#fff" style={{fontWeight: '600'}}>
          Retry
        </Text>
      </RNBounceable>
    </View>
  );

  if (isLoading && (!compositions || compositions.length === 0)) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeContent} edges={[]}>
          {renderHeader()}
          {renderLoading()}
        </SafeAreaView>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeContent} edges={[]}>
          {renderHeader()}
          {renderError()}
        </SafeAreaView>
      </View>
    );
  }

  const renderListHeader = () => (
    <View>
      {renderHeader()}
      <View style={styles.sectionTitleContainer}>
        <Text style={styles.sectionTitle}>Đội hình</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeContent} edges={[]}>
        <FlatList
          data={compositions}
          renderItem={renderTeamCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refresh}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={<EmptyList message={translations.noCompositionsFound} />}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
