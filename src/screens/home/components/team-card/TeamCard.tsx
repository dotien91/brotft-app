import React, { useMemo, useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import type { IComposition } from '@services/models/composition';
import UnitHexagonItem from '../unit-hexagon-item/UnitHexagonItem'; 
import CopyTeamcodeButton from '@shared-components/copy-teamcode-button';
import createStyles from './TeamCard.style';
import * as NavigationService from 'react-navigation-helpers';
import { SCREENS } from '@shared-constants';
import { translations } from '../../../../shared/localization';
import TierBadge from '@shared-components/tier-badge';

interface TeamCardProps {
  composition: IComposition;
}

// --- HELPER FUNCTIONS ---
const getDifficultyColor = (diff?: string) => {
  const d = diff?.toLowerCase() || '';
  if (d.includes('easy')) return { bg: 'rgba(74, 222, 128, 0.2)', text: '#4ade80' };
  if (d.includes('medium') || d.includes('normal')) return { bg: 'rgba(251, 191, 36, 0.2)', text: '#fbbf24' };
  if (d.includes('hard')) return { bg: 'rgba(249, 115, 22, 0.2)', text: '#f97316' };
  return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8' };
};

const getDifficultyLabel = (diff?: string): string => {
  const d = diff?.toLowerCase() || '';
  if (d.includes('easy')) return translations.difficultyEasy;
  if (d.includes('medium') || d.includes('normal')) return translations.difficultyNormal;
  if (d.includes('hard')) return translations.difficultyHard;
  return diff || '';
};

// --- CONSTANTS ---
const UNITS_PER_ROW = 9;
const TOTAL_HORIZONTAL_PADDING = 32 + 38; 

// Đưa các style tĩnh ra ngoài để tránh tạo object rác (GC memory leak) trong vòng lặp map
const STATIC_UNIT_STYLES = {
  container: { marginBottom: 3 },
  itemConfig: { bottom: -4 },
  starConfig: { top: -8 },
};

const TeamCard: React.FC<TeamCardProps> = ({ composition }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const { width } = useWindowDimensions();

  // Tính toán itemSize
  const itemSize = useMemo(() => {
    return (width - TOTAL_HORIZONTAL_PADDING) / UNITS_PER_ROW;
  }, [width]);

  // Lấy data an toàn
  const teamcode = composition.teamcode || (composition as any).teamCode;

  // Xử lý navigate
  const handlePress = useCallback(() => {
    NavigationService.push(SCREENS.DETAIL, { compId: composition.compId });
  }, [composition.compId]);

  // Caching màu sắc và text độ khó
  const { diffBg, diffText, diffLabel } = useMemo(() => {
    const colorConfig = getDifficultyColor(composition.difficulty);
    return {
      diffBg: colorConfig.bg,
      diffText: colorConfig.text,
      diffLabel: getDifficultyLabel(composition.difficulty)
    };
  }, [composition.difficulty]);

  // Sort: Đưa tướng có item lên đầu
  const sortedUnits = useMemo(() => {
    const units = composition.units || [];
    // Tối ưu nhẹ: Không cần spread operator nếu không can thiệp sâu, 
    // nhưng array.sort mutate array gốc nên việc tạo shallow copy bằng [...units] của bạn là ĐÚNG.
    return [...units].sort((a, b) => {
      const aItems = a.items?.length || 0;
      const bItems = b.items?.length || 0;
      return bItems - aItems; 
    });
  }, [composition.units]);

  return (
    <RNBounceable style={styles.teamCard} onPress={handlePress}>
      <View style={styles.teamHeader}>
        {/* TIER BADGE */}
        {composition.active && (
          <TierBadge
            tier={composition.tier || 'S'}
            isOp={composition.isOp}
            size={40}
            style={styles.rankBadge}
          />
        )}

        {/* INFO */}
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
                <View style={[styles.difficultyBadge, { backgroundColor: diffBg }]}>
                  <Text style={[styles.difficultyText, { color: diffText }]}>
                    {diffLabel}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* COPY BUTTON */}
        <CopyTeamcodeButton teamcode={teamcode} />
      </View>

      {/* CHAMPIONS ROW */}
      <View style={styles.championsRow}>
        {sortedUnits.map((unit, index) => (
          <UnitHexagonItem
            key={`${unit.championId}-${index}`}
            style={STATIC_UNIT_STYLES.container}
            borderWidth={1.5}
            shape="square"  
            unit={unit}
            size={itemSize} 
            customStyleItem={STATIC_UNIT_STYLES.itemConfig}
            customStyleStar={STATIC_UNIT_STYLES.starConfig}
            unlockPosition="topLeft"
          />
        ))}
      </View>
    </RNBounceable>
  );
};

// TỐI ƯU CỐT LÕI: Chỉ re-render nếu compId thay đổi (hoặc active thay đổi)
export default React.memo(TeamCard, (prevProps, nextProps) => {
  return prevProps.composition.compId === nextProps.composition.compId &&
         prevProps.composition.active === nextProps.composition.active;
});