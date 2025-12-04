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

interface TeamComp {
  id: string;
  name: string;
  rank: string;
  tier?: string; // S, A, B, C, D
  champions: Array<{
    id: string;
    image: string;
    items?: Array<{icon: string}>;
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

  // Fetch compositions from API
  const {
    data: compositions,
    isLoading,
    isError,
    error,
    refresh,
    isRefetching,
  } = useCompositionsWithPagination(10);
  // Map IComposition to TeamComp format
  const teamComps = useMemo<TeamComp[]>(() => {
    if (!compositions) return [];

    return compositions.map(comp => {
      // Map units to champions
      const champions = comp.units.map(unit => ({
        id: unit.championId || unit.championKey,
        image: getUnitAvatarUrl(unit.championKey, 64) || unit.image || '',
        items: (unit.itemsDetails || []).map(itemDetail => ({
          icon: getItemIconUrlFromPath(itemDetail.icon, itemDetail.apiName),
        })),
        need3Star: unit.need3Star || false,
        needUnlock: unit.needUnlock || false,
      }));

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
  }, [compositions]);

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
    console.log('item', item?.items);
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
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderLoading()}
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {renderError()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={teamComps}
        renderItem={renderTeamCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refresh}
        ListEmptyComponent={
          <View style={{padding: 20, alignItems: 'center'}}>
            <Text color={colors.placeholder}>No compositions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
