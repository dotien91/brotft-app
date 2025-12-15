import React, {useMemo} from 'react';
import {FlatList, Image, View, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from '@screens/detail/components/Hexagon';
import {SCREENS} from '@shared-constants';
import {useCompositionsWithPagination} from '@services/api/hooks/listQueryHooks';
import type {IComposition} from '@services/models/composition';
import {getUnitAvatarUrl, getItemIconUrlFromPath} from '../../utils/metatft';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';

interface TeamComp {
  id: string;
  name: string;
  rank: string;
  tier?: string; // S, A, B, C, D
  champions: Array<{
    id: string;
    image: string;
    items?: Array<{id?: string; name?: string; icon: string; apiName?: string}>;
    need3Star?: boolean;
    needUnlock?: boolean;
  }>;
  items: Array<{icon: string}>;
  composition: IComposition; // Store original composition for navigation
}

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);

  // Fetch compositions from API
  const {
    data: compositions,
    isLoading,
    isError,
    error,
    refresh,
    isRefetching,
  } = useCompositionsWithPagination(10);

  // Helper function to get localized item data
  const getLocalizedItem = (itemApiName: string, itemsData: any) => {
    if (!itemApiName) {
      return {
        id: '',
        name: '',
        icon: '',
        apiName: '',
      };
    }
    
    if (!itemsData) {
      // Fallback: return item with apiName only
      return {
        id: itemApiName,
        name: itemApiName,
        icon: getItemIconUrlFromPath(null, itemApiName),
        apiName: itemApiName,
      };
    }

    let localizedItem: any = null;

    // Handle both array and object formats
    if (Array.isArray(itemsData)) {
      localizedItem = itemsData.find((localItem: any) => {
        if (localItem.apiName === itemApiName) {
          return true;
        }
        return false;
      });
    } else if (typeof itemsData === 'object' && itemsData !== null) {
      // Try to find by apiName as key first
      if (itemsData[itemApiName]) {
        localizedItem = itemsData[itemApiName];
      } else {
        // Otherwise, search through object values
        const itemsArray = Object.values(itemsData) as any[];
        localizedItem = itemsArray.find((localItem: any) => {
          return localItem.apiName === itemApiName;
        });
      }
    }

    if (localizedItem) {
      return {
        id: localizedItem.id || itemApiName,
        name: localizedItem.name || itemApiName,
        icon: getItemIconUrlFromPath(localizedItem.icon, localizedItem.apiName || itemApiName),
        apiName: localizedItem.apiName || itemApiName,
      };
    }

    // Fallback: return item with apiName only
    return {
      id: itemApiName,
      name: itemApiName,
      icon: getItemIconUrlFromPath(null, itemApiName),
      apiName: itemApiName,
    };
  };

  // Map IComposition to TeamComp format
  const teamComps = useMemo<TeamComp[]>(() => {
    if (!compositions) return [];

    // Get localized items data
    let itemsData: any = null;
    if (language) {
      try {
        const locale = getLocaleFromLanguage(language);
        const itemsKey = `data_items_${locale}`;
        const itemsDataString = LocalStorage.getString(itemsKey);
        if (itemsDataString) {
          itemsData = JSON.parse(itemsDataString);
        }
      } catch (error) {
        console.error('Error loading items data:', error);
      }
    }

    return compositions.map(comp => {
      // Map units to champions
      const champions = comp.units.map(unit => {
        // Map items from itemsDetails or items array
        let mappedItems: Array<{id?: string; name?: string; icon: string; apiName?: string}> = [];
        
        if (unit.itemsDetails && unit.itemsDetails.length > 0) {
          // Use itemsDetails if available
          mappedItems = unit.itemsDetails.map(itemDetail => {
            // Try to get localized data
            if (itemsData) {
              const localizedItem = getLocalizedItem(itemDetail.tag || itemDetail.id, itemsData);
              // If localized item has a proper name (not just apiName), use it
              if (localizedItem.name && localizedItem.name !== localizedItem.apiName) {
                return localizedItem;
              }
            }
            
            // Fallback to itemDetail
            return {
              id: itemDetail.id,
              name: itemDetail.name,
              icon: getItemIconUrlFromPath(itemDetail.icon, itemDetail.tag || itemDetail.id),
              apiName: itemDetail.tag || itemDetail.id,
            };
          });
        } else if (unit.items && unit.items.length > 0) {
          // Use items array (string[]) and map with local data
          mappedItems = unit.items.map(itemApiName => {
            return getLocalizedItem(itemApiName, itemsData);
          });
        }

        return {
        id: unit.championId || unit.championKey,
        image: getUnitAvatarUrl(unit.championKey, 64) || unit.image || '',
          items: mappedItems,
        need3Star: unit.need3Star || false,
        needUnlock: unit.needUnlock || false,
        };
      });

      // Extract all items from units (flatten and deduplicate by ID)
      const allItems = comp.units
        .flatMap(unit => unit.itemsDetails || [])
        .filter((item, index, self) => {
          // Deduplicate by item ID
          return index === self.findIndex(i => i.id === item.id);
        })
        .map(itemDetail => ({
          icon: getItemIconUrlFromPath(itemDetail.icon, itemDetail.apiName),
        }));

      // Map difficulty to rank
      const getRank = (difficulty: string): string => {
        if (difficulty === 'Dễ') return 'OP';
        if (difficulty === 'Trung bình') return 'S';
        if (difficulty === 'Khó') return 'A';
        return 'S'; // Default
      };

      // Get tier from API or fallback to rank
      const tier = comp.tier || getRank(comp.difficulty);

      return {
        id: comp.id,
        name: comp.name,
        rank: getRank(comp.difficulty),
        tier: tier,
        champions,
        items: allItems,
        composition: comp,
      };
    });
  }, [compositions, language]);

  const handleTeamPress = (team: TeamComp) => {
    // Navigate to detail screen with compId to fetch from API
    const comp = team.composition;
    NavigationService.push(SCREENS.DETAIL, {compId: comp.compId});
  };

  const getRankColor = (rankOrTier: string) => {
    switch (rankOrTier) {
      case 'OP':
        return '#ff4757';
      case 'S':
        return '#ff7e83';
      case 'A':
        return '#ffbf7f';
      case 'B':
        return '#ffdf80';
      case 'C':
        return '#feff7f';
      case 'D':
        return '#bffe7f';
      default:
        return colors.primary;
    }
  };

  // Always return black text color
  const getContrastTextColor = (): string => {
    return '#000000';
  };
  const renderTeamCard = ({item}: {item: TeamComp}) => {
    const displayTier = item.tier || item.rank;
    const backgroundColor = getRankColor(displayTier);
    const textColor = getContrastTextColor();
    return (
      <RNBounceable style={styles.teamCard} onPress={() => handleTeamPress(item)}>
        <View style={styles.teamHeader}>
          <View style={[styles.rankBadge, {backgroundColor}]}>
            <Text style={[styles.rankText, {color: textColor}]}>{displayTier}</Text>
          </View>
          <Text style={styles.teamName}>{item.name}</Text>
        </View>

      <View style={styles.championsRow}>
        {item.champions.map((champion, index) => (
          <View key={`${champion.id}-${index}`} style={styles.championContainer}>
            <View style={styles.championWrapper}>
              {/* Border hexagon */}
              <View style={styles.hexagonBorder}>
                <Hexagon
                  size={50}
                  backgroundColor="transparent"
                  borderColor={colors.primary}
                  borderWidth={1}
                />
              </View>
              {/* Main hexagon with image */}
              <View style={styles.hexagonInner}>
                <Hexagon
                  size={46}
                  backgroundColor={colors.card}
                  borderColor={colors.border}
                  borderWidth={2}
                  imageUri={champion.image}>
                  {/* Items inside hexagon (absolute positioned) */}
                  {champion.items && champion.items.length > 0 && (
                    <View style={styles.championItemsRow}>
                      {champion.items.map((itemObj, itemIndex) => (
                        <Image
                          key={`champion-${index}-item-${itemIndex}`}
                          source={{uri: itemObj.icon}}
                          style={styles.championItemIcon}
                        />
                      ))}
                    </View>
                  )}
                </Hexagon>
              </View>
              {champion.need3Star && (
                <View style={styles.tier3Icon}>
                  <ThreeStars size={36} color="#fbbf24" />
                </View>
              )}
              {champion.needUnlock && (
                <View style={styles.unlockBadge}>
                  <Image
                    source={{uri: 'https://www.metatft.com/icons/unlock.png'}}
                    style={styles.unlockIcon}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
      </RNBounceable>
    );
  };

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

  if (isLoading && teamComps.length === 0) {
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
          data={teamComps}
          renderItem={renderTeamCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshing={isRefetching}
          onRefresh={refresh}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={
            <View style={{padding: 20, alignItems: 'center'}}>
              <Text color={colors.placeholder}>No compositions found</Text>
            </View>
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
