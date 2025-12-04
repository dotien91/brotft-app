import React, {useMemo, useState, useEffect} from 'react';
import {View, Image, ScrollView, Switch, useWindowDimensions, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './DetailScreen.style';
import Hexagon from './components/Hexagon';
import {useCompositionByCompId} from '@services/api/hooks/listQueryHooks';
import {getUnitAvatarUrl, getTraitIconUrl} from '../../utils/metatft';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import {getTftItemByApiName} from '@services/api/tft-items';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';

const TFT_IMAGE_VERSION = '14.15.1';
const CHAMPION_BASE = `https://ddragon.leagueoflegends.com/cdn/${TFT_IMAGE_VERSION}/img/tft-champion/`;
const ITEM_BASE = `https://ddragon.leagueoflegends.com/cdn/${TFT_IMAGE_VERSION}/img/tft-item/`;

const COST_COLORS: Record<number, string> = {
  1: '#a5b4fc',
  2: '#38bdf8',
  3: '#f97316',
  4: '#facc15',
  5: '#c084fc',
};

const championIcon = (fileName: string) => `${CHAMPION_BASE}${fileName}`;
const itemIcon = (fileName: string) => `${ITEM_BASE}${fileName}`;

type TeamUnitItem = {
  id?: string;
  name?: string;
  icon: string;
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
  metaDescription: string;
  isLateGame: boolean;
  boardSize: {
    rows: number;
    cols: number;
  };
  synergies: TeamSynergy[];
  units: TeamUnit[];
  bench: TeamUnit[];
  carryItems: TeamCarry[];
  notes: string[];
};


interface DetailScreenProps {
  route?: {
    params?: {
      team?: TeamComposition;
      compId?: string;
    };
  };
}

const DetailScreen: React.FC<DetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {width: windowWidth} = useWindowDimensions();
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

  // Map IComposition to TeamComposition format
  const team = useMemo<TeamComposition>(() => {
    if (compositionData) {
      return {
        id: compositionData.id,
        name: compositionData.name,
        plan: compositionData.plan,
        difficulty: compositionData.difficulty,
        tier: compositionData.tier,
        metaDescription: compositionData.metaDescription,
        isLateGame: compositionData.isLateGame,
        boardSize: compositionData.boardSize,
        synergies: compositionData.synergies || [],
        units: compositionData.units.map(unit => ({
          id: unit.championId || unit.championKey,
          name: unit.name,
          cost: unit.cost,
          star: unit.star,
          carry: unit.carry || false,
          need3Star: unit.need3Star || false,
          needUnlock: unit.needUnlock || false,
          position: unit.position,
          image: getUnitAvatarUrl(unit.championKey, 64) || unit.image || '',
          items: (unit.itemsDetails || []).map(itemDetail => ({
            icon: getItemIconUrlFromPath(itemDetail.icon, itemDetail.apiName),
            id: itemDetail.id,
            name: itemDetail.name,
          })),
        })),
        bench: [],
        carryItems: [],
        notes: compositionData.notes || [],
      };
    }

    // Fallback to params or default
    const teamFromParams =
      (routeProp?.params?.team ||
        (route?.params as any)?.team) as TeamComposition | undefined;
    return teamFromParams;
  }, [compositionData, routeProp, route]);

  const [isLateGame, setIsLateGame] = useState(team.isLateGame);

  // Update isLateGame when team changes
  useEffect(() => {
    setIsLateGame(team.isLateGame);
  }, [team.isLateGame]);

  // Get tier color
  const getRankColor = (tier?: string) => {
    if (!tier) return colors.primary;
    switch (tier) {
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

  // Calculate hex size to fit 7 hexagons in a row
  const hexSize = useMemo(() => {
    const horizontalPadding = 32; // Total padding
    const availableWidth = windowWidth - horizontalPadding;
    const calculatedSize = (availableWidth / 7.8); // 7.8 to account for spacing
    return Math.max(Math.min(calculatedSize, 70), 45); // Min 45, Max 70
  }, [windowWidth]);

  // Use board size from API (4 rows x 7 cols = 28 cells)
  // Note: API uses 1-based indexing (row: 1, col: 1 is first cell)
  // Array uses 0-based indexing, so we need to convert
  const boardRows = useMemo(() => {
    const rows = team.boardSize.rows || 4;
    const cols = team.boardSize.cols || 7;
    
    return Array.from({length: rows}).map((_, rowIndex) =>
      Array.from({length: cols}).map((_, colIndex) => {
        // Convert array index (0-based) to API position (1-based) for comparison
        // API position starts from 1,1 so we add 1 to array index
        const apiRow = rowIndex + 1;
        const apiCol = colIndex + 1;
        
        // Find unit at this position (API uses 1-based)
        const unit = team.units.find(
          champ =>
            champ.position.row === apiRow &&
            champ.position.col === apiCol,
        );
        return unit || null;
      }),
    );
  }, [team]);

  const renderBackButton = () => (
    <RNBounceable style={styles.backButton} onPress={() => NavigationService.goBack()}>
      <Icon
        name='arrow-back'
        type={IconType.Ionicons}
        color={colors.text}
        size={22}
      />
    </RNBounceable>
  );

  const renderSynergy = (synergy: TeamSynergy) => (
    <View key={synergy.id} style={styles.synergyCard}>
      <Hexagon
        size={44}
        backgroundColor={synergy.color + '20'}
        borderColor={synergy.color + '66'}
        borderWidth={2}>
        <Text style={[styles.synergyIconText, {color: synergy.color}]}>
          {synergy.abbreviation}
        </Text>
      </Hexagon>
      <Text style={styles.synergyCount}>{synergy.count}</Text>
    </View>
  );

  const renderUnit = (unit: TeamUnit) => {
    const costBadgeSize = hexSize * 0.35;
    const itemIconSize = hexSize * 0.28;
    
    return (
      <>
        {unit.carry ? (
          <View style={[
            styles.carryBadge,
            {
              width: costBadgeSize,
              height: costBadgeSize,
              borderRadius: costBadgeSize / 2,
              top: -hexSize * 0.12,
              right: -hexSize * 0.12,
            }
          ]}>
            <Text style={[styles.carryText, {fontSize: hexSize * 0.18}]}>C</Text>
          </View>
        ) : null}
        {unit.needUnlock ? (
          <View style={styles.unlockBadge}>
            <Image
              source={{uri: 'https://www.metatft.com/icons/unlock.png'}}
              style={styles.unlockIcon}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </>
    );
  };

  const renderBoard = () => (
    <View style={styles.boardWrapper}>
      <View style={styles.board}>
        {boardRows.map((row, rowIndex) => (
          <View
            key={`row-${rowIndex}`}
            style={[
              styles.boardRow,
              rowIndex % 2 !== 0 && {marginLeft: hexSize},
            ]}>
            {row.map((unit, colIndex) => (
              <View
                key={`cell-${rowIndex}-${colIndex}`}
                style={styles.hexCellContainer}>
                {unit ? (
                  <View style={styles.unitWrapper}>
                    <View style={styles.hexagonBorderWrapper}>
                      {/* Border hexagon */}
                      <View style={styles.hexagonBorder}>
                        <Hexagon
                          size={hexSize + 4}
                          backgroundColor="transparent"
                          borderColor={colors.primary}
                          borderWidth={1}
                        />
                      </View>
                      {/* Main hexagon with image */}
                      <View style={styles.hexagonInner}>
                        <Hexagon
                          size={hexSize}
                          backgroundColor="#252836"
                          borderColor={colors.border}
                          borderWidth={2}
                          imageUri={unit.image}>
                          {renderUnit(unit)}
                          {/* Items inside hexagon (absolute positioned) */}
                          {unit.items && unit.items.length > 0 && (
                            <View style={styles.unitItemsRow}>
                              {unit.items.map(item => (
                                <Image
                                  key={item.id}
                                  source={{uri: item.icon}}
                                  style={[styles.unitItemIcon, {
                                    width: Math.max(hexSize * 0.2, 12),
                                    height: Math.max(hexSize * 0.2, 12),
                                  }]}
                                />
                              ))}
                            </View>
                          )}
                        </Hexagon>
                      </View>
                      {/* 3 Stars icon */}
                      {unit.need3Star && (
                        <View style={[styles.tier3Icon, {
                          top: -8,
                          right: 5,
                        }]}>
                          <ThreeStars size={Math.max(hexSize * 0.6, 36)} color="#fbbf24" />
                          </View>
                      )}
                    </View>
                  </View>
                ) : (
                  <Hexagon
                    size={hexSize}
                    backgroundColor="#1e2130"
                    borderColor="#2a2d3a"
                    borderWidth={2}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    </View>
  );

  // Component to render item with its components
  const ItemWithComponents: React.FC<{item: TeamUnitItem}> = ({item}) => {
    const [itemDetails, setItemDetails] = useState<any>(null);

    useEffect(() => {
      if (item.apiName) {
        getTftItemByApiName(item.apiName)
          .then(data => {
            setItemDetails(data);
          })
          .catch(() => {
            // Ignore errors
          });
      }
    }, [item.apiName]);

    const components = itemDetails?.composition || [];

    return (
      <View style={styles.itemWithComponents}>
        <Image source={{uri: item.icon}} style={styles.carryItemIcon} />
        {components.length > 0 && (
          <View style={styles.itemComponentsRow}>
            {components.map((component: string, idx: number) => (
              <Image
                key={idx}
                source={{
                  uri: `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${component}.png`,
                }}
                style={styles.componentIcon}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderCarryUnits = () => {
    // Filter units that have items
    const unitsWithItems = team.units.filter(unit => unit.items && unit.items.length > 0);
    
    if (unitsWithItems.length === 0) {
      return null;
    }

    // Get traits for each unit from LocalStorage
    const getUnitTraits = (unit: TeamUnit): string[] => {
      if (!unit.championKey || !language) {
        return [];
      }

      try {
        const locale = getLocaleFromLanguage(language);
        const unitsKey = `data_units_${locale}`;
        const unitsDataString = LocalStorage.getString(unitsKey);
        
        if (!unitsDataString) {
          return [];
        }

        const unitsData = JSON.parse(unitsDataString);
        let localizedUnit: any = null;

        // Handle both array and object formats
        if (Array.isArray(unitsData)) {
          localizedUnit = unitsData.find((localUnit: any) => {
            if (unit.championKey && localUnit.apiName === unit.championKey) {
              return true;
            }
            if (unit.name && localUnit.name) {
              return unit.name.toLowerCase() === localUnit.name.toLowerCase();
            }
            return false;
          });
        } else if (typeof unitsData === 'object' && unitsData !== null) {
          if (unit.championKey && unitsData[unit.championKey]) {
            localizedUnit = unitsData[unit.championKey];
          } else {
            const unitsArray = Object.values(unitsData) as any[];
            localizedUnit = unitsArray.find((localUnit: any) => {
              if (unit.championKey && localUnit.apiName === unit.championKey) {
                return true;
              }
              if (unit.name && localUnit.name) {
                return unit.name.toLowerCase() === localUnit.name.toLowerCase();
              }
              return false;
            });
          }
        }

        if (localizedUnit && localizedUnit.traits) {
          return Array.isArray(localizedUnit.traits) ? localizedUnit.traits : [];
        }
        return [];
      } catch (error) {
        return [];
      }
    };

    return (
      <View style={styles.carryCard}>
        <Text style={styles.sectionLabel}>Tướng chủ lực</Text>
        {unitsWithItems.map((unit, unitIndex) => {
          const unitTraits = getUnitTraits(unit);
          const isLast = unitIndex === unitsWithItems.length - 1;
          return (
            <View key={unit.id} style={[styles.carryRow, isLast && styles.carryRowLast]}>
              <View style={styles.carryChampion}>
                <Image source={{uri: unit.image}} style={styles.carryAvatar} />
                <View style={styles.carryInfo}>
                  <Text style={styles.carryName}>{unit.name}</Text>
                  {unit.star && (
                    <Text style={styles.carryRole}>
                      {'★★★'}
                    </Text>
                  )}
                  {/* Show traits */}
                  {unitTraits.length > 0 && (
                    <View style={styles.traitsRow}>
                      {unitTraits.slice(0, 3).map((trait, idx) => (
                        <View key={idx} style={styles.traitBadge}>
                          <Text style={styles.traitText}>{trait}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.carryItemsRow}>
                {unit.items.map((item, itemIdx) => (
                  <ItemWithComponents key={itemIdx} item={item} />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  // Render loading state
  if (isLoading && compIdFromParams) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topHeader}>
          {renderBackButton()}
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text color={colors.placeholder} style={{marginTop: 12}}>
            Loading composition...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Render error state
  if (isError && compIdFromParams) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.topHeader}>
          {renderBackButton()}
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
          <Text h4 color={colors.danger}>
            Error loading composition
          </Text>
          <Text color={colors.placeholder} style={{marginTop: 8, textAlign: 'center'}}>
            {error?.message || 'Something went wrong'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topHeader}>
        {renderBackButton()}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Tier and Name */}
        <View style={styles.compositionHeader}>
          {team.tier && (
            <View style={[styles.tierBadge, {backgroundColor: getRankColor(team.tier)}]}>
              <Text style={[styles.tierBadgeText, {color: getContrastTextColor()}]}>
                {team.tier}
              </Text>
            </View>
          )}
          <Text h2 bold color={colors.text} style={styles.compositionName}>
            {team.name}
          </Text>
        </View>
        {!!team?.synergies && <View style={styles.synergyRow}>
          {team.synergies.map(renderSynergy)}
         </View>}

        <View style={styles.mainLayout}>
          <View style={styles.boardColumn}>
            {renderBoard()}
          </View>
        </View>

        {renderCarryUnits()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

