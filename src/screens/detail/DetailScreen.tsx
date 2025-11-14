import React, {useMemo, useState} from 'react';
import {View, Image, ScrollView, Switch, useWindowDimensions} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import RNBounceable from '@freakycoder/react-native-bounceable';
import * as NavigationService from 'react-navigation-helpers';
import {useTheme, useRoute} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './DetailScreen.style';
import Hexagon from './components/Hexagon';

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
    };
  };
}

const DetailScreen: React.FC<DetailScreenProps> = ({route: routeProp}) => {
  const theme = useTheme();
  const route = useRoute();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const {width: windowWidth} = useWindowDimensions();

  const teamFromParams =
    (routeProp?.params?.team ||
      (route?.params as any)?.team) as TeamComposition | undefined;

  const team = teamFromParams || DEFAULT_TEAM;
  const [isLateGame, setIsLateGame] = useState(team.isLateGame);

  // Calculate hex size to fit 7 hexagons in a row
  const hexSize = useMemo(() => {
    const horizontalPadding = 32; // Total padding
    const availableWidth = windowWidth - horizontalPadding;
    const calculatedSize = (availableWidth / 7.8); // 7.8 to account for spacing
    return Math.max(Math.min(calculatedSize, 70), 45); // Min 45, Max 70
  }, [windowWidth]);

  const boardRows = useMemo(() => {
    return Array.from({length: team.boardSize.rows}).map((_, rowIndex) =>
      Array.from({length: team.boardSize.cols}).map((_, colIndex) => {
        return (
          team.units.find(
            champ =>
              champ.position.row === rowIndex &&
              champ.position.col === colIndex,
          ) || null
        );
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
    const avatarSize = hexSize * 0.7;
    const costBadgeSize = hexSize * 0.35;
    const itemIconSize = hexSize * 0.28;
    
    return (
      <>
        <View
          style={[
            styles.unitRing,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
              borderColor: COST_COLORS[unit.cost] || colors.primary,
            },
          ]}>
          <Image 
            source={{uri: unit.image}} 
            style={{
              width: avatarSize - 6,
              height: avatarSize - 6,
              borderRadius: (avatarSize - 6) / 2,
            }} 
          />
        </View>
        {unit.star ? (
          <View style={[styles.starBadge, {top: -hexSize * 0.1}]}>
            <Text style={[styles.starText, {fontSize: hexSize * 0.16}]}>
              {'★'.repeat(unit.star)}
            </Text>
          </View>
        ) : null}
        <View style={[
          styles.costBadge,
          {
            width: costBadgeSize,
            height: costBadgeSize,
            borderRadius: costBadgeSize / 2,
            bottom: -hexSize * 0.12,
          }
        ]}>
          <Text style={[styles.costText, {fontSize: hexSize * 0.18}]}>{unit.cost}</Text>
        </View>
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
        {unit.items && unit.items.length > 0 ? (
          <View style={[styles.itemRow, {bottom: -hexSize * 0.4}]}>
            {unit.items.map(item => (
              <Image 
                key={item.id} 
                source={{uri: item.icon}} 
                style={{
                  width: itemIconSize,
                  height: itemIconSize,
                  borderRadius: 4,
                  marginHorizontal: 2,
                }} 
              />
            ))}
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
                <Hexagon
                  size={hexSize}
                  backgroundColor={unit ? '#252836' : '#1e2130'}
                  borderColor={unit ? '#3a3d4a' : '#2a2d3a'}
                  borderWidth={2}>
                  {unit ? renderUnit(unit) : null}
                </Hexagon>
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

