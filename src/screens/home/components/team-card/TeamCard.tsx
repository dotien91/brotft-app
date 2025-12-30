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

// Get difficulty color
const getDifficultyColor = (difficulty: string): {text: string; background: string} => {
  const difficultyLower = difficulty?.toLowerCase() || '';
  let baseColor = '#94a3b8'; // Gray (default)
  
  switch (difficultyLower) {
    case 'easy':
    case 'beginner':
      baseColor = '#4ade80'; // Green
      break;
    case 'medium':
    case 'intermediate':
      baseColor = '#fbbf24'; // Yellow/Orange
      break;
    case 'hard':
    case 'advanced':
      baseColor = '#f97316'; // Orange
      break;
    case 'expert':
    case 'very hard':
      baseColor = '#ef4444'; // Red
      break;
  }
  
  // Convert hex to rgba for background with opacity
  const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };
  
  return {
    text: baseColor,
    background: hexToRgba(baseColor, 0.2), // 20% opacity
  };
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

  const difficultyColors = getDifficultyColor(composition.difficulty);
  
  // Plan background color: black with 0.5 opacity
  const planBackgroundColor = 'rgba(0, 0, 0, 0.5)';

  return (
    <RNBounceable style={styles.teamCard} onPress={() => onPress(composition)}>
      <View style={styles.teamHeader}>
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName}>{composition.name}</Text>
          {(composition.plan || composition.difficulty) && (
            <View style={styles.planAndDifficultyRow}>
              {composition.plan && (
                <View style={[styles.planBadge, {backgroundColor: planBackgroundColor}]}>
                  <Text style={[styles.planText, {color: colors.text}]}>{composition.plan}</Text>
                </View>
              )}
              {composition.difficulty && (
                <View style={[styles.difficultyBadge, {backgroundColor: difficultyColors.background}]}>
                  <Text style={[styles.difficultyText, {color: difficultyColors.text}]}>{composition.difficulty}</Text>
                </View>
              )}
            </View>
          )}
        </View>
        <View style={[styles.rankBadge, {backgroundColor}]}>
          <Text style={[styles.rankText, {color: '#000000'}]}>{displayTier}</Text>
        </View>
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

