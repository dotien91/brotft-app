import React, {useMemo} from 'react';
import {FlatList, Image, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as NavigationService from 'react-navigation-helpers';
import createStyles from './HomeScreen.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {SCREENS} from '@shared-constants';

const TFT_IMAGE_VERSION = '14.15.1';
const CHAMPION_BASE = `https://ddragon.leagueoflegends.com/cdn/${TFT_IMAGE_VERSION}/img/tft-champion/`;
const ITEM_BASE = `https://ddragon.leagueoflegends.com/cdn/${TFT_IMAGE_VERSION}/img/tft-item/`;

const championIcon = (fileName: string) => `${CHAMPION_BASE}${fileName}`;
const itemIcon = (fileName: string) => `${ITEM_BASE}${fileName}`;

interface TeamComp {
  id: string;
  name: string;
  rank: string;
  champions: Array<{
    id: string;
    image: string;
    items?: Array<{icon: string}>;
  }>;
  items: Array<{icon: string}>;
}

const TEAM_COMPS: TeamComp[] = [
  {
    id: '1',
    name: 'Học Viện Yuumi',
    rank: 'OP',
    champions: [
      {id: 'lux', image: championIcon('TFT11_Lux.TFT_Set11.png')},
      {id: 'garen', image: championIcon('TFT11_Garen.TFT_Set11.png')},
      {id: 'janna', image: championIcon('TFT11_Janna.TFT_Set11.png')},
      {id: 'yuumi', image: championIcon('TFT11_Yuumi.TFT_Set11.png')},
      {id: 'neeko', image: championIcon('TFT11_Neeko.TFT_Set11.png')},
      {id: 'nami', image: championIcon('TFT11_Nami.TFT_Set11.png')},
      {id: 'lux2', image: championIcon('TFT11_Lux.TFT_Set11.png')},
      {id: 'ahri', image: championIcon('TFT11_Ahri.TFT_Set11.png')},
      {id: 'yuumi2', image: championIcon('TFT11_Yuumi.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_ArchangelsStaff.png')},
      {icon: itemIcon('TFT_Item_JeweledGauntlet.png')},
      {icon: itemIcon('TFT_Item_RabadonsDeathcap.png')},
      {icon: itemIcon('TFT_Item_Morellonomicon.png')},
    ],
  },
  {
    id: '2',
    name: 'Học Viện Katarina',
    rank: 'S',
    champions: [
      {id: 'lux', image: championIcon('TFT11_Lux.TFT_Set11.png')},
      {id: 'garen', image: championIcon('TFT11_Garen.TFT_Set11.png')},
      {id: 'katarina', image: championIcon('TFT11_Katarina.TFT_Set11.png')},
      {id: 'yuumi', image: championIcon('TFT11_Yuumi.TFT_Set11.png')},
      {id: 'kaisa', image: championIcon('TFT11_Kaisa.TFT_Set11.png')},
      {id: 'lux2', image: championIcon('TFT11_Lux.TFT_Set11.png')},
      {id: 'janna', image: championIcon('TFT11_Janna.TFT_Set11.png')},
      {id: 'syndra', image: championIcon('TFT11_Syndra.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_HextechGunblade.png')},
      {icon: itemIcon('TFT_Item_GuardianAngel.png')},
      {icon: itemIcon('TFT_Item_InfinityEdge.png')},
      {icon: itemIcon('TFT_Item_BlueBuff.png')},
    ],
  },
  {
    id: '3',
    name: 'Đại Cơ Giáp Yone',
    rank: 'S',
    champions: [
      {id: 'garen', image: championIcon('TFT11_Garen.TFT_Set11.png')},
      {id: 'riven', image: championIcon('TFT11_Riven.TFT_Set11.png')},
      {id: 'riven2', image: championIcon('TFT11_Riven.TFT_Set11.png')},
      {id: 'nami', image: championIcon('TFT11_Nami.TFT_Set11.png')},
      {id: 'neeko', image: championIcon('TFT11_Neeko.TFT_Set11.png')},
      {id: 'mordekaiser', image: championIcon('TFT11_Mordekaiser.TFT_Set11.png')},
      {id: 'irelia', image: championIcon('TFT11_Irelia.TFT_Set11.png')},
      {id: 'yone', image: championIcon('TFT11_Yone.TFT_Set11.png')},
      {id: 'ahri', image: championIcon('TFT11_Ahri.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_GuinsoosRageblade.png')},
      {icon: itemIcon('TFT_Item_HandOfJustice.png')},
      {icon: itemIcon('TFT_Item_Deathblade.png')},
      {icon: itemIcon('TFT_Item_BrambleVest.png')},
    ],
  },
  {
    id: '4',
    name: 'Đại Cơ Giáp Akali',
    rank: 'S',
    champions: [
      {id: 'garen', image: championIcon('TFT11_Garen.TFT_Set11.png')},
      {id: 'riven', image: championIcon('TFT11_Riven.TFT_Set11.png')},
      {id: 'janna', image: championIcon('TFT11_Janna.TFT_Set11.png')},
      {id: 'nami', image: championIcon('TFT11_Nami.TFT_Set11.png')},
      {id: 'kaisa', image: championIcon('TFT11_Kaisa.TFT_Set11.png')},
      {id: 'neeko', image: championIcon('TFT11_Neeko.TFT_Set11.png')},
      {id: 'irelia', image: championIcon('TFT11_Irelia.TFT_Set11.png')},
      {id: 'akali', image: championIcon('TFT11_Akali.TFT_Set11.png')},
      {id: 'yone', image: championIcon('TFT11_Yone.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_InfinityEdge.png')},
      {icon: itemIcon('TFT_Item_JeweledGauntlet.png')},
      {icon: itemIcon('TFT_Item_GuardianAngel.png')},
      {icon: itemIcon('TFT_Item_BrambleVest.png')},
    ],
  },
  {
    id: '5',
    name: 'Chiến Hạm Malphite',
    rank: 'S',
    champions: [
      {id: 'nautilus', image: championIcon('TFT11_Nautilus.TFT_Set11.png')},
      {id: 'graves', image: championIcon('TFT11_Graves.TFT_Set11.png')},
      {id: 'katarina', image: championIcon('TFT11_Katarina.TFT_Set11.png')},
      {id: 'malphite', image: championIcon('TFT11_Malphite.TFT_Set11.png')},
      {id: 'urgot', image: championIcon('TFT11_Urgot.TFT_Set11.png')},
      {id: 'neeko', image: championIcon('TFT11_Neeko.TFT_Set11.png')},
      {id: 'janna', image: championIcon('TFT11_Janna.TFT_Set11.png')},
      {id: 'yone', image: championIcon('TFT11_Yone.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_Redemption.png')},
      {icon: itemIcon('TFT_Item_Morellonomicon.png')},
      {icon: itemIcon('TFT_Item_Sunfire.png')},
    ],
  },
  {
    id: '6',
    name: 'Hàng Nặng Malzahar',
    rank: 'S',
    champions: [
      {id: 'garen', image: championIcon('TFT11_Garen.TFT_Set11.png')},
      {id: 'ziggs', image: championIcon('TFT11_Ziggs.TFT_Set11.png')},
      {id: 'katarina', image: championIcon('TFT11_Katarina.TFT_Set11.png')},
      {id: 'malphite', image: championIcon('TFT11_Malphite.TFT_Set11.png')},
      {id: 'kaisa', image: championIcon('TFT11_Kaisa.TFT_Set11.png')},
      {id: 'neeko', image: championIcon('TFT11_Neeko.TFT_Set11.png')},
      {id: 'malzahar', image: championIcon('TFT11_Malzahar.TFT_Set11.png')},
      {id: 'yuumi', image: championIcon('TFT11_Yuumi.TFT_Set11.png')},
    ],
    items: [
      {icon: itemIcon('TFT_Item_Redemption.png')},
      {icon: itemIcon('TFT_Item_Morellonomicon.png')},
      {icon: itemIcon('TFT_Item_ArchangelsStaff.png')},
      {icon: itemIcon('TFT_Item_RabadonsDeathcap.png')},
      {icon: itemIcon('TFT_Item_BlueBuff.png')},
    ],
  },
];

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleTeamPress = (team: TeamComp) => {
    // Convert TeamComp to TeamComposition format for detail screen
    const teamData = {
      id: team.id,
      name: team.name,
      plan: 'Lvl 7/8 Roll',
      difficulty: team.rank === 'OP' ? 'Dễ' : team.rank === 'S' ? 'Trung bình' : 'Khó',
      metaDescription: `Đội hình ${team.name} - ${team.rank} tier`,
      isLateGame: true,
      boardSize: {rows: 4, cols: 7},
      synergies: [],
      units: team.champions.map((champ, index) => ({
        id: champ.id,
        name: champ.id,
        cost: Math.floor(Math.random() * 5) + 1,
        star: 2,
        position: {
          row: Math.floor(index / 7),
          col: index % 7,
        },
        image: champ.image,
        items: champ.items || [],
      })),
      bench: [],
      carryItems: [],
      notes: [`Đội hình ${team.name} mạnh ở giai đoạn cuối game`],
    };
    
    NavigationService.push(SCREENS.DETAIL, {team: teamData});
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'OP':
        return '#ff4757';
      case 'S':
        return '#5352ed';
      case 'A':
        return '#3742fa';
      default:
        return colors.primary;
    }
  };

  const renderTeamCard = ({item}: {item: TeamComp}) => (
    <RNBounceable style={styles.teamCard} onPress={() => handleTeamPress(item)}>
      <View style={styles.teamHeader}>
        <View style={[styles.rankBadge, {backgroundColor: getRankColor(item.rank)}]}>
          <Text style={styles.rankText}>{item.rank}</Text>
        </View>
        <Text style={styles.teamName}>{item.name}</Text>
      </View>

      <View style={styles.championsRow}>
        {item.champions.map((champion, index) => (
          <Image
            key={`${champion.id}-${index}`}
            source={{uri: champion.image}}
            style={styles.championAvatar}
          />
        ))}
      </View>

      <View style={styles.itemsRow}>
        {item.items.map((itemObj, index) => (
          <Image
            key={`item-${index}`}
            source={{uri: itemObj.icon}}
            style={styles.itemIcon}
          />
        ))}
      </View>
    </RNBounceable>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={TEAM_COMPS}
        renderItem={renderTeamCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
