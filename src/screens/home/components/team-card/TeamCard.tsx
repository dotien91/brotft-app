import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import type {IComposition} from '@services/models/composition';
import UnitHexagonItem from '../unit-hexagon-item/UnitHexagonItem';
import createStyles from './TeamCard.style';

// Get rank color based on tier
const getRankColor = (rankOrTier: string, primaryColor: string): string => {
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
      return primaryColor;
  }
};

interface TeamCardProps {
  composition: IComposition;
  onPress: (composition: IComposition) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({composition, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const displayTier = composition.tier || 'S';
  const backgroundColor = getRankColor(displayTier, colors.primary);

  return (
    <RNBounceable style={styles.teamCard} onPress={() => onPress(composition)}>
      <View style={styles.teamHeader}>
        <View style={[styles.rankBadge, {backgroundColor}]}>
          <Text style={[styles.rankText, {color: '#000000'}]}>{displayTier}</Text>
        </View>
        <Text style={styles.teamName}>{composition.name}</Text>
      </View>

      <View style={styles.championsRow}>
        {composition.units.map((unit, index) => (
          <UnitHexagonItem
            key={`${unit.championId}-${index}`}
            unit={unit}
            index={index}
          />
        ))}
      </View>
    </RNBounceable>
  );
};

export default React.memo(TeamCard);

