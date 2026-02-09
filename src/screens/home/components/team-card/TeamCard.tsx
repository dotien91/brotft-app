import React, {useMemo, useCallback} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import type {IComposition} from '@services/models/composition';
import UnitHexagonItem from '../unit-hexagon-item/UnitHexagonItem';
import CopyTeamcodeButton from '@shared-components/copy-teamcode-button';
import createStyles from './TeamCard.style';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import {translations} from '../../../../shared/localization';

interface TeamCardProps {
  composition: IComposition;
}

// --- HELPER FUNCTIONS (Move outside to prevent recreation) ---

const getRankColor = (rankOrTier: string, primaryColor: string): string => {
  switch (rankOrTier) {
    case 'OP': return '#ff4757';
    case 'S': return '#ff7e83';
    case 'A': return '#ffbf7f';
    case 'B': return '#ffdf80';
    case 'C': return '#feff7f';
    case 'D': return '#bffe7f';
    default: return primaryColor;
  }
};

const getDifficultyColor = (diff: string) => {
  const d = diff?.toLowerCase() || '';
  if (d.includes('easy')) return {bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80'};
  if (d.includes('medium') || d.includes('normal')) return {bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24'};
  if (d.includes('hard')) return {bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316'};
  return {bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8'};
};

const getDifficultyLabel = (diff: string): string => {
  const d = diff?.toLowerCase() || '';
  if (d.includes('easy')) return translations.difficultyEasy;
  if (d.includes('medium') || d.includes('normal')) return translations.difficultyNormal;
  if (d.includes('hard')) return translations.difficultyHard;
  return diff || '';
};

// -----------------------------------------------------------

const TeamCard: React.FC<TeamCardProps> = ({composition}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  // Safe access teamcode
  const teamcode = composition.teamcode || (composition as any).teamCode;

  const handlePress = useCallback(() => {
    NavigationService.push(SCREENS.DETAIL, {compId: composition.compId});
  }, [composition.compId]);

  const displayTier = composition.tier || 'S';
  const rankBackgroundColor = getRankColor(displayTier, colors.primary);
  
  // Tính toán màu sắc ngay trong body function vì nó rất nhẹ, không cần memo cũng được,
  // hoặc dùng useMemo nếu muốn strict.
  const difficultyStyle = getDifficultyColor(composition.difficulty);

  // LOGIC SORT: Đã ổn.
  // Quan trọng: Đảm bảo composition.units là array ổn định từ Redux/React Query
  const sortedUnits = useMemo(() => {
    const units = composition.units ?? [];
    // Slice(0) hoặc [...units] để tạo shallow copy trước khi sort (tránh mutate props)
    return [...units].sort((a, b) => {
      const aHasItems = (a.items?.length ?? 0) > 0;
      const bHasItems = (b.items?.length ?? 0) > 0;
      return bHasItems === aHasItems ? 0 : bHasItems ? 1 : -1; // Đảo lại logic: Có item lên trước (-1)
    });
  }, [composition.units]);

  return (
    <RNBounceable style={styles.teamCard} onPress={handlePress}>
      <View style={styles.teamHeader}>
        {/* 1. TIER */}
        <View style={[styles.rankBadge, {backgroundColor: rankBackgroundColor}]}>
          <Text style={styles.rankText}>{displayTier}</Text>
        </View>

        {/* 2. INFO */}
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName} numberOfLines={1}>
            {composition.name}
          </Text>
          
          {(composition.plan || composition.difficulty) && (
            <View style={styles.planAndDifficultyRow}>
              {composition.plan && (
                <View style={styles.planBadge}>
                  <Text style={styles.planText}>{composition.plan}</Text>
                </View>
              )}
              {composition.difficulty && (
                <View style={[styles.difficultyBadge, {backgroundColor: difficultyStyle.bg}]}>
                  <Text style={[styles.difficultyText, {color: difficultyStyle.text}]}>
                    {getDifficultyLabel(composition.difficulty)}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* 3. COPY BUTTON */}
        <CopyTeamcodeButton teamcode={teamcode} />
      </View>

      <View style={styles.championsRow}>
        {sortedUnits.map((unit, index) => (
          <UnitHexagonItem
            // Key combination ID + index là an toàn nhất cho list tĩnh
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