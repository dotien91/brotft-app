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
import {getUnitAvatarUrl, getItemIconUrlFromPath} from '../../utils/metatft';
import ThreeStars from '@shared-components/three-stars/ThreeStars';

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
  id: string;
  name: string;
  icon: string;
};

type TeamUnit = {
  id: string;
  name: string;
  cost: number;
  star?: number;
  carry?: boolean;
  need3Star?: boolean;
  position: {
    row: number;
    col: number;
  };
  image: string;
  items?: TeamUnitItem[];
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

export const DEFAULT_TEAM: TeamComposition = {
  id: 'comp-daicogiap-yone',
  name: 'Đại Cơ Giáp Yone',
  plan: 'Lvl 7/8 Roll',
  difficulty: 'Trung bình',
  metaDescription:
    'Roll nhẹ ở cấp 7 tìm đủ dàn chắn Đại Cơ Giáp, giữ vàng lên 8 hoàn thiện đội hình với Yone chủ lực.',
  isLateGame: true,
  boardSize: {
    rows: 4,
    cols: 7,
  },
  synergies: [
    {id: 'armor', name: 'Đại Cơ Giáp', abbreviation: 'ĐC', count: 7, max: 7, color: '#facc15'},
    {id: 'pilot', name: 'Phi Công Công Nghệ', abbreviation: 'PC', count: 3, max: 3, color: '#38bdf8'},
    {id: 'guardian', name: 'Hộ Công', abbreviation: 'HC', count: 2, max: 2, color: '#f87171'},
    {id: 'rebel', name: 'Đấu Trường', abbreviation: 'ĐT', count: 2, max: 2, color: '#fb7185'},
    {id: 'fortress', name: 'Tổng Lực', abbreviation: 'TL', count: 2, max: 2, color: '#34d399'},
  ],
  units: [
    {
      id: 'garen',
      name: 'Garen',
      cost: 1,
      star: 2,
      position: {row: 0, col: 1},
      image: championIcon('TFT11_Garen.TFT_Set11.png'),
    },
    {
      id: 'riven',
      name: 'Riven',
      cost: 3,
      star: 2,
      position: {row: 0, col: 3},
      image: championIcon('TFT11_Riven.TFT_Set11.png'),
      items: [
        {id: 'bramble', name: 'Áo Choàng Gai', icon: itemIcon('TFT_Item_BrambleVest.png')},
        {id: 'dragonclaw', name: 'Vuốt Rồng', icon: itemIcon('TFT_Item_DragonsClaw.png')},
      ],
    },
    {
      id: 'mordekaiser',
      name: 'Mordekaiser',
      cost: 4,
      star: 2,
      position: {row: 0, col: 5},
      image: championIcon('TFT11_Mordekaiser.TFT_Set11.png'),
      items: [
        {id: 'redemption', name: 'Chuộc Tội', icon: itemIcon('TFT_Item_Redemption.png')},
      ],
    },
    {
      id: 'illaoi',
      name: 'Urgot',
      cost: 4,
      star: 2,
      position: {row: 1, col: 0},
      image: championIcon('TFT11_Urgot.TFT_Set11.png'),
    },
    {
      id: 'shen',
      name: 'Shen',
      cost: 2,
      star: 2,
      position: {row: 1, col: 2},
      image: championIcon('TFT11_Shen.TFT_Set11.png'),
    },
    {
      id: 'wukong',
      name: 'Wukong',
      cost: 2,
      star: 2,
      position: {row: 1, col: 4},
      image: championIcon('TFT11_Wukong.TFT_Set11.png'),
    },
    {
      id: 'irelia',
      name: 'Irelia',
      cost: 3,
      star: 2,
      position: {row: 1, col: 6},
      image: championIcon('TFT11_Irelia.TFT_Set11.png'),
    },
    {
      id: 'yone',
      name: 'Yone',
      cost: 4,
      carry: true,
      star: 2,
      position: {row: 2, col: 3},
      image: championIcon('TFT11_Yone.TFT_Set11.png'),
      items: [
        {id: 'rageblade', name: 'Cuồng Đao Guinsoo', icon: itemIcon('TFT_Item_GuinsoosRageblade.png')},
        {id: 'handofjustice', name: 'Bàn Tay Công Lý', icon: itemIcon('TFT_Item_HandOfJustice.png')},
        {id: 'deathblade', name: 'Kiếm Tử Thần', icon: itemIcon('TFT_Item_Deathblade.png')},
      ],
    },
    {
      id: 'janna',
      name: 'Janna',
      cost: 4,
      star: 2,
      position: {row: 2, col: 1},
      image: championIcon('TFT11_Janna.TFT_Set11.png'),
    },
    {
      id: 'leesin',
      name: 'Lee Sin',
      cost: 4,
      star: 1,
      position: {row: 2, col: 5},
      image: championIcon('TFT11_LeeSin.TFT_Set11.png'),
    },
    {
      id: 'ahri',
      name: 'Ahri',
      cost: 5,
      star: 1,
      position: {row: 3, col: 3},
      image: championIcon('TFT11_Ahri.TFT_Set11.png'),
    },
  ],
  bench: [
    {
      id: 'aatrox',
      name: 'Aatrox',
      cost: 4,
      star: 1,
      position: {row: 0, col: 0},
      image: championIcon('TFT11_Aatrox.TFT_Set11.png'),
    },
    {
      id: 'nasus',
      name: 'Nasus',
      cost: 2,
      star: 2,
      position: {row: 0, col: 0},
      image: championIcon('TFT11_Nasus.TFT_Set11.png'),
    },
    {
      id: 'seraphine',
      name: 'Seraphine',
      cost: 3,
      star: 1,
      position: {row: 0, col: 0},
      image: championIcon('TFT11_Seraphine.TFT_Set11.png'),
    },
  ],
  carryItems: [
    {
      championId: 'yone',
      championName: 'Yone',
      role: 'Chủ lực sát thương',
      image: championIcon('TFT11_Yone.TFT_Set11.png'),
      items: [
        {id: 'rageblade', name: 'Guinsoo', icon: itemIcon('TFT_Item_GuinsoosRageblade.png')},
        {id: 'hand', name: 'Bàn Tay', icon: itemIcon('TFT_Item_HandOfJustice.png')},
        {id: 'deathblade', name: 'Kiếm Tử Thần', icon: itemIcon('TFT_Item_Deathblade.png')},
      ],
    },
    {
      championId: 'riven',
      championName: 'Riven',
      role: 'Chống chịu chính',
      image: championIcon('TFT11_Riven.TFT_Set11.png'),
      items: [
        {id: 'bramble', name: 'Áo Choàng Gai', icon: itemIcon('TFT_Item_BrambleVest.png')},
        {id: 'dclaw', name: 'Vuốt Rồng', icon: itemIcon('TFT_Item_DragonsClaw.png')},
        {id: 'warmog', name: 'Giáp Máu', icon: itemIcon('TFT_Item_WarmogsArmor.png')},
      ],
    },
  ],
  notes: [
    'Ưu tiên roll tìm Yone 2★ và đủ 7 Đại Cơ Giáp trước khi lên cấp 8.',
    'Sau cấp 8 thêm Lee Sin để hoàn thiện Phi Công Công Nghệ, cân nhắc Ahri nếu cần sát thương phép.',
    'Trang bị chống chịu nên dồn cho Riven hoặc Mordekaiser để bảo kê tuyến sau.',
    'Nếu lobby nhiều phép, chuyển Vuốt Rồng sang Mordekaiser và lấy Khăn Giải Thuật cho Yone.',
  ],
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
    return teamFromParams || DEFAULT_TEAM;
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
    
    if (__DEV__) {
      console.log('[DetailScreen] Board rendering:', {
        boardSize: {rows, cols},
        totalCells: rows * cols,
        unitsCount: team.units.length,
        unitPositions: team.units.map(u => ({
          name: u.name,
          position: u.position, // API position (1-based)
          arrayIndex: {row: u.position.row - 1, col: u.position.col - 1}, // Array index (0-based)
        })),
      });
    }
    
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
        {unit.star ? (
          <View style={[styles.starBadge, {top: -hexSize * 0.1}]}>
            <Text style={[styles.starText, {fontSize: hexSize * 0.16}]}>
              {'★'.repeat(unit.star)}
            </Text>
          </View>
        ) : null}
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
              rowIndex % 2 !== 0 && {marginLeft: hexSize * 0.5},
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
                        </Hexagon>
                      </View>
                      {/* 3 Stars icon */}
                      {unit.need3Star && (
                        <View style={[styles.tier3Icon, {
                          top: -hexSize * 0.15,
                          right: -hexSize * 0.1,
                        }]}>
                          <ThreeStars size={Math.max(hexSize * 0.4, 24)} color="#fbbf24" />
                        </View>
                      )}
                    </View>
                    {/* Items below unit */}
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

  const renderCarryCard = () => (
    <View style={styles.carryCard}>
      <Text style={styles.sectionLabel}>Trang bị chủ lực</Text>
      {team.carryItems.map(carry => (
        <View key={carry.championId} style={styles.carryRow}>
          <View style={styles.carryChampion}>
            <Image source={{uri: carry.image}} style={styles.carryAvatar} />
            <View>
              <Text style={styles.carryName}>{carry.championName}</Text>
              <Text style={styles.carryRole}>{carry.role}</Text>
            </View>
          </View>
          <View style={styles.carryItemsRow}>
            {carry.items.map(item => (
              <Image key={item.id} source={{uri: item.icon}} style={styles.carryItemIcon} />
            ))}
          </View>
        </View>
      ))}
    </View>
  );

  const renderNotes = () => (
    <View style={styles.highlightsCard}>
      <Text style={styles.sectionLabel}>Ghi chú vận hành</Text>
      {team.notes.map(note => (
        <View key={note} style={styles.highlightItem}>
          <View style={styles.highlightBullet} />
          <Text style={styles.highlightText}>{note}</Text>
        </View>
      ))}
    </View>
  );

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
        <View style={styles.headerContent}>
          <Text h2 bold color={colors.text} style={styles.headerTitle}>
            {team.name}
          </Text>
          <Text color={colors.text} style={styles.headerPlan}>
            {team.plan}
          </Text>
          {team.tier && (
            <View style={[styles.tierBadge, {backgroundColor: getRankColor(team.tier)}]}>
              <Text style={[styles.tierBadgeText, {color: getContrastTextColor()}]}>
                {team.tier}
              </Text>
            </View>
          )}
          <View style={[styles.metaPill, styles.metaPillSecondary]}>
            <Text style={styles.metaPillText}>{team.difficulty}</Text>
          </View>
          <Text style={styles.toggleLabel}>Cuối game</Text>
          <Switch
            value={isLateGame}
            onValueChange={setIsLateGame}
            trackColor={{
              false: colors.borderColor,
              true: '#facc15' + '80',
            }}
            thumbColor={isLateGame ? '#facc15' : colors.placeholder}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.synergyRow}>
          {team.synergies.map(renderSynergy)}
        </View>

        <View style={styles.mainLayout}>
          <View style={styles.boardColumn}>
            {renderBoard()}
          </View>
        </View>

        {renderCarryCard()}
        {renderNotes()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

