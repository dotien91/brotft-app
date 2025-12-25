import React, {useMemo, useCallback, useState} from 'react';
import {FlatList, Image, View, ActivityIndicator, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';
import {
  useCompositionsWithPagination,
  useSearchCompositionsByUnits,
} from '@services/api/hooks/listQueryHooks';
import type {IComposition} from '@services/models/composition';
import EmptyList from '@shared-components/empty-list/EmptyList';
import TeamCard from './components/team-card/TeamCard';
import UnitFilterModal from './components/unit-filter-modal/UnitFilterModal';
import {translations} from '../../shared/localization';
import {getUnitAvatarUrl} from '../../utils/metatft';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [selectedUnits, setSelectedUnits] = useState<string[]>([]);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Build search DTO
  const searchDto = useMemo(() => {
    console.log('🏠 HomeScreen - Building search DTO:', {
      selectedUnits,
      selectedUnitsLength: selectedUnits.length,
    });
    if (selectedUnits.length === 0) {
      console.log('🏠 HomeScreen - No units selected, returning null');
      return null;
    }
    const dto = {
      units: selectedUnits,
      searchInAllArrays: true,
    };
    console.log('🏠 HomeScreen - Search DTO created:', JSON.stringify(dto, null, 2));
    return dto;
  }, [selectedUnits]);

  // Fetch compositions from API or search by units
  const {
    data: allCompositions,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
    refresh: refreshAll,
    isRefetching: isRefetchingAll,
  } = useCompositionsWithPagination(10);

  const {
    data: searchCompositions,
    isLoading: isLoadingSearch,
    isError: isErrorSearch,
    error: errorSearch,
    refresh: refreshSearch,
    isRefetching: isRefetchingSearch,
  } = useSearchCompositionsByUnits(searchDto, 10);

  // Use search results if filtering, otherwise use all compositions
  const compositions = searchDto ? searchCompositions : allCompositions;
  const isLoading = searchDto ? isLoadingSearch : isLoadingAll;
  const isError = searchDto ? isErrorSearch : isErrorAll;
  const error = searchDto ? errorSearch : errorAll;
  const refresh = searchDto ? refreshSearch : refreshAll;
  const isRefetching = searchDto ? isRefetchingSearch : isRefetchingAll;

  // Debug logging
  React.useEffect(() => {
    if (searchDto) {
      console.log('🏠 HomeScreen - Filter active:', {
        selectedUnits,
        searchCompositionsCount: searchCompositions?.length || 0,
        isLoadingSearch,
        isErrorSearch,
        errorSearch: errorSearch?.message,
      });
    }
  }, [searchDto, selectedUnits, searchCompositions, isLoadingSearch, isErrorSearch, errorSearch]);
  
  const handleTeamPress = useCallback((comp: IComposition) => {
    NavigationService.push(SCREENS.DETAIL, {compId: comp.compId});
  }, []);

  const handleApplyFilter = useCallback((units: string[]) => {
    setSelectedUnits(units);
  }, []);

  const handleClearFilter = useCallback(() => {
    setSelectedUnits([]);
  }, []);

  const handleRemoveUnit = useCallback((unitKey: string) => {
    setSelectedUnits(prev => prev.filter(u => u !== unitKey));
  }, []);

  const renderSelectedUnits = () => {
    if (selectedUnits.length === 0) return null;

    return (
      <View style={styles.selectedUnitsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectedUnitsScroll}>
          {selectedUnits.map((unitKey, index) => {
            const avatarUrl = getUnitAvatarUrl(unitKey, 48);
            // Capitalize first letter for display
            const displayName = unitKey.charAt(0).toUpperCase() + unitKey.slice(1);

            return (
              <RNBounceable
                key={`${unitKey}-${index}`}
                onPress={() => handleRemoveUnit(unitKey)}
                style={styles.selectedUnitChip}>
                {avatarUrl ? (
                  <Image
                    source={{uri: avatarUrl}}
                    style={styles.selectedUnitAvatar}
                  />
                ) : (
                  <View style={[styles.selectedUnitAvatar, styles.selectedUnitAvatarPlaceholder]} />
                )}
                <Text style={styles.selectedUnitName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Icon
                  name="close-circle"
                  type={IconType.Ionicons}
                  color={colors.placeholder}
                  size={16}
                  style={styles.selectedUnitRemoveIcon}
                />
              </RNBounceable>
            );
          })}
        </ScrollView>
      </View>
    );
  };

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
        <View style={styles.sectionTitleRow}>
          <Text style={styles.sectionTitle}>Đội hình</Text>
          <View style={styles.filterContainer}>
            {selectedUnits.length > 0 && (
              <RNBounceable
                onPress={handleClearFilter}
                style={styles.clearFilterButton}>
                <Icon
                  name="close-circle"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={20}
                />
                <Text style={styles.filterCountText}>{selectedUnits.length}</Text>
              </RNBounceable>
            )}
            <RNBounceable
              onPress={() => setIsFilterModalVisible(true)}
              style={[
                styles.filterButton,
                selectedUnits.length > 0 && styles.filterButtonActive,
              ]}>
              <Icon
                name="filter"
                type={IconType.Ionicons}
                color={selectedUnits.length > 0 ? colors.primary : colors.text}
                size={20}
              />
            </RNBounceable>
          </View>
        </View>
        {renderSelectedUnits()}
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
        <UnitFilterModal
          visible={isFilterModalVisible}
          onClose={() => setIsFilterModalVisible(false)}
          onApply={handleApplyFilter}
          selectedUnits={selectedUnits}
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
