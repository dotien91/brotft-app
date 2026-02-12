import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, ScrollView, useWindowDimensions, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, useRoute } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './DetailScreen.style';
import TraitsSection from './components/TraitsSection';
import AugmentsSection from './components/AugmentsSection';
import { useCompositionByCompId } from '@services/api/hooks/listQueryHooks';
import getUnitAvatar from '../../utils/unit-avatar';
import { getItemIconImageSource } from '../../utils/item-images';
import { getCachedItems } from '@services/api/data';
import useStore from '@services/zustand/store';
import { translations } from '../../shared/localization';
import BackButton from '@shared-components/back-button/BackButton';
import RNBounceable from '@freakycoder/react-native-bounceable';
import CopyTeamcodeButton from '@shared-components/copy-teamcode-button';
import TierBadge from '@shared-components/tier-badge';
import DescriptionSection from './components/DescriptionSection';
import TeamBoard from './components/TeamBoard';
import CoreChampion from './components/CoreChampion';

type TeamUnitItem = {
  id?: string;
  name?: string;
  icon: string;
  iconSource?: any; // Local image source (require())
  apiName?: string; // For fetching item details
};

type TeamUnit = {
  id: string;
  name: string;
  cost: number;
  star?: number;
  carry?: boolean;
  need3Star?: boolean;
  needUnlock?: boolean;
  position: {
    row: number;
    col: number;
  };
  image: string;
  items?: TeamUnitItem[];
  championKey?: string; // For fetching traits from LocalStorage
};

type TeamSynergy = {
  id: string;
  name: string;
  abbreviation: string;
  count: number;
  max: number;
  color: string;
};

type TeamCarry = {
  championId: string;
  championName: string;
  role: string;
  image: string;
  items: TeamUnitItem[];
};

type TeamComposition = {
  id: string;
  name: string;
  plan: string;
  difficulty: string;
  tier?: string; // S, A, B, C, D
  isOp?: boolean;
  metaDescription: string;
  isLateGame: boolean;
  boardSize: {
    rows: number;
    cols: number;
  };
  synergies: TeamSynergy[];
  units: TeamUnit[];
  earlyGame?: TeamUnit[];
  midGame?: TeamUnit[];
  bench: TeamUnit[];
  carryItems: TeamCarry[];
  coreChampion?: TeamUnit;
  augments?: Array<{
    name: string;
    tier: number;
  }>;
  notes: string[];
  teamcode?: string;
};


interface DetailScreenProps {
  route?: {
    params?: {
      team?: TeamComposition;
      compId?: string;
    };
  };
}

const DetailScreen: React.FC<DetailScreenProps> = ({ route: routeProp }) => {
  const theme = useTheme();
  const route = useRoute();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { width: windowWidth } = useWindowDimensions();
  const language = useStore((state) => state.language);

  // Get compId from params
  const compIdFromParams =
    (routeProp?.params?.compId ||
      (route?.params as any)?.compId) as string | undefined;

  // Fetch composition from API if compId is provided
  const {
    data: compositionData,
    isLoading,
    isError,
    error,
  } = useCompositionByCompId(compIdFromParams || '', {
    enabled: !!compIdFromParams,
  });

  console.log("compositionData", compositionData);

  // Helper function to map units with items
  const mapUnitsWithItems = (units: any[], itemsData: any): TeamUnit[] => {
    return units.map(unit => {
      // Map items from itemsDetails or items array
      let mappedItems: TeamUnitItem[] = [];

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
            icon: '', // Use local image via imageSource instead
            iconSource: getItemIconImageSource(itemDetail.icon, itemDetail.tag || itemDetail.id, 48).local,
            apiName: itemDetail.tag || itemDetail.id,
          };
        });
      } else if (unit.items && unit.items.length > 0) {
        // Use items array (string[]) and map with local data
        mappedItems = unit.items.map(itemApiName => {
          return getLocalizedItem(itemApiName, itemsData);
        });
      }

      const avatar = getUnitAvatar(unit.championKey, 64);
      return {
        ...unit,
        id: unit.championId || unit.championKey,
        name: unit.name,
        cost: unit.cost,
        star: unit.star,
        carry: unit.carry || false,
        need3Star: unit.need3Star || false,
        needUnlock: unit.needUnlock || false,
        position: {
          row: (unit.position?.row || 0) + 1,
          col: (unit.position?.col || 0) + 1,
        },
        image: avatar.uri || '', // Use URL when no local image
        imageSource: avatar.local, // Add local image source
        championKey: unit.championKey,
      };
    });
  };

  // Helper function to get localized item data
  const getLocalizedItem = (itemApiName: string, itemsData: any): TeamUnitItem => {
    // Get local image source for item
    const imageSource = getItemIconImageSource(null, itemApiName, 48);

    if (!itemApiName) {
      return {
        id: '',
        name: '',
        icon: '',
        iconSource: null,
        apiName: '',
      };
    }

    if (!itemsData) {
      // Fallback: return item with apiName only
      return {
        id: itemApiName,
        name: itemApiName,
        icon: '',
        iconSource: imageSource.local,
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
      const finalApiName = localizedItem.apiName || itemApiName;
      const finalImageSource = getItemIconImageSource(localizedItem.icon, finalApiName, 48);
      return {
        id: localizedItem.id || itemApiName,
        name: localizedItem.name || itemApiName,
        icon: '',
        iconSource: finalImageSource.local,
        apiName: finalApiName,
      };
    }

    // Fallback: return item with apiName only
    const fallbackImageSource = getItemIconImageSource(null, itemApiName, 48);
    return {
      id: itemApiName,
      name: itemApiName,
      icon: '',
      iconSource: fallbackImageSource.local,
      apiName: itemApiName,
    };
  };

  // Helper function to map carryItems
  const mapCarryItems = (carryItems: any[], itemsData: any): TeamCarry[] => {
    if (!carryItems || carryItems.length === 0) return [];

    return carryItems.map(carryItem => {
      const mappedItems: TeamUnitItem[] = (carryItem.items || []).map((itemApiName: string) => {
        return getLocalizedItem(itemApiName, itemsData);
      });

      return {
        championId: carryItem.championId || carryItem.championKey,
        championName: carryItem.championName || carryItem.name,
        role: carryItem.role || 'Carry',
        image: '', // Use local image via imageSource instead
        imageSource: getUnitAvatar(carryItem.championKey, 64).local, // Add local image source
        items: mappedItems,
      };
    });
  };

  // Map IComposition to TeamComposition format
  const team = useMemo<TeamComposition>(() => {
    if (compositionData) {
      let itemsData: any = null;
      if (language) {
        try {
          itemsData = getCachedItems(language);
          if (Object.keys(itemsData).length === 0) itemsData = null;
        } catch (error) {
          console.error('Error loading items data:', error);
        }
      }

      return {
        ...compositionData,
        synergies: compositionData.synergies || [],
        units: mapUnitsWithItems(compositionData.units || [], itemsData),
        earlyGame: compositionData.earlyGame && compositionData.earlyGame.length > 0 ? mapUnitsWithItems(compositionData.earlyGame, itemsData) : undefined,
        midGame: compositionData.midGame && compositionData.midGame.length > 0 ? mapUnitsWithItems(compositionData.midGame, itemsData) : undefined,
        augments: compositionData.augments || [],
        notes: compositionData.notes || [],
      };
    }

    // Fallback to params or default
    const teamFromParams =
      (routeProp?.params?.team ||
        (route?.params as any)?.team) as TeamComposition | undefined;
    return teamFromParams;
  }, [compositionData, routeProp, route, language]);

  // Game phase state: 'early' | 'late'
  const [gamePhase, setGamePhase] = useState<'early' | 'late'>('late');

  // Reset to 'late' when team data changes (when entering detail screen)
  useEffect(() => {
    if (team) {
      setGamePhase('late');
    }
  }, [team?.id]); // Reset when composition changes

  // Get current phase units
  const currentPhaseUnits = useMemo(() => {
    if (!team) return [];
    switch (gamePhase) {
      case 'early':
        return team.earlyGame || [];
      case 'late':
      default:
        return team.units || [];
    }
  }, [team, gamePhase]);

  // Difficulty badge colors (same as TeamCard)
  const getDifficultyColor = (diff: string): { bg: string; text: string } => {
    const d = diff?.toLowerCase() || '';
    if (d.includes('easy')) return { bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' };
    if (d.includes('medium')) return { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' };
    if (d.includes('hard')) return { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316' };
    return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' };
  };

  // Render loading state
  if (isLoading && compIdFromParams) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topHeader}>
          <BackButton />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (isError && compIdFromParams) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topHeader}>
          <BackButton />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text h4 color={colors.danger}>
            {translations.errorLoadingComposition}
          </Text>
          <Text color={colors.placeholder} style={{ marginTop: 8, textAlign: 'center' }}>
            {error?.message || translations.somethingWentWrong}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <BackButton />
        <View style={styles.topHeader}>

          {/* 1. TIER (LEFT) */}
          <TierBadge
            tier={team.tier}
            isOp={team.isOp}
            size={36}
            style={styles.tierBadge}
          />

          {/* 2. INFO (MIDDLE) */}
          <View style={styles.detailHeaderInfo}>
            <Text h2 bold style={styles.compositionName} numberOfLines={1}>
              {team.name}
            </Text>
            {(team.plan || team.difficulty) && (
              <View style={styles.planAndDifficultyRow}>
                {team.plan ? (
                  <View style={styles.planBadge}>
                    <Text style={styles.planText}>{team.plan}</Text>
                  </View>
                ) : null}
                {team.difficulty ? (
                  <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(team.difficulty).bg }]}>
                    <Text style={[styles.difficultyText, { color: getDifficultyColor(team.difficulty).text }]}>
                      {team.difficulty}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}
          </View>

          {/* 3. COPY BUTTON (RIGHT) */}
          <CopyTeamcodeButton teamcode={team.teamcode} />
        </View>

        {/* Description Section */}
        {team.metaDescription && (
          <DescriptionSection
            description={team.metaDescription}
          />
        )}
        <TraitsSection units={currentPhaseUnits} />

        {/* Augments Section */}
        <AugmentsSection augments={team.augments || []} />

        {/* Game Phase Tabs */}
        {team?.earlyGame && (
          <View style={styles.phaseTabsContainer}>
            <RNBounceable
              style={[styles.phaseTab, gamePhase === 'early' && styles.phaseTabActive]}
              onPress={() => setGamePhase('early')}>
              <Text style={[styles.phaseTabText, gamePhase === 'early' && styles.phaseTabTextActive]}>
                {translations.earlyGame}
              </Text>
            </RNBounceable>
            <RNBounceable
              style={[styles.phaseTab, gamePhase === 'late' && styles.phaseTabActive]}
              onPress={() => setGamePhase('late')}>
              <Text style={[styles.phaseTabText, gamePhase === 'late' && styles.phaseTabTextActive]}>
                {translations.lateGame}
              </Text>
            </RNBounceable>
          </View>
        )}

        <View style={styles.mainLayout}>
          <View style={styles.boardColumn}>
            {/* {renderBoard()} */}
            <TeamBoard
              units={currentPhaseUnits}
              boardSize={team.boardSize}
              colors={colors}
              styles={styles}
            />
          </View>
        </View>
        <CoreChampion coreChampion={team.coreChampion} />
   
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

