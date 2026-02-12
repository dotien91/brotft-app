import React, { useMemo, useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import type { IComposition } from '@services/models/composition';
import UnitHexagonItem from '../unit-hexagon-item/UnitHexagonItem'; // Đảm bảo đường dẫn đúng
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
// (Giữ nguyên bên ngoài để tránh khởi tạo lại không cần thiết)

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

// Cấu hình khoảng cách để tính toán size
const UNITS_PER_ROW = 9;
// Tổng padding ngang (ước lượng):
// Margin màn hình (16*2) + Padding trong Card (12*2) + Gap giữa các items (2*6) ~= 60-70px
const TOTAL_HORIZONTAL_PADDING = 32 + 24; 

const TeamCard: React.FC<TeamCardProps> = ({ composition }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  // 1. Lấy chiều rộng màn hình TẠI ĐÂY (trong component)
  const { width } = useWindowDimensions();

  // 2. Tính toán itemSize dựa trên màn hình
  const itemSize = useMemo(() => {
    const availableWidth = width - TOTAL_HORIZONTAL_PADDING;
    return Math.floor(availableWidth / UNITS_PER_ROW);
  }, [width]);

  // Safe access teamcode
  const teamcode = composition.teamcode || (composition as any).teamCode;

  const handlePress = useCallback(() => {
    NavigationService.push(SCREENS.DETAIL, { compId: composition.compId });
  }, [composition.compId]);

  const difficultyStyle = getDifficultyColor(composition.difficulty);

  // 3. Logic Sort: Đưa tướng có item lên đầu
  const sortedUnits = useMemo(() => {
    const units = composition.units || [];
    return [...units].sort((a, b) => {
      const aItems = a.items?.length || 0;
      const bItems = b.items?.length || 0;
      // Sắp xếp giảm dần theo số lượng item (Nhiều item -> lên đầu)
      return bItems - aItems; 
    });
  }, [composition.units]);

  return (
    <RNBounceable style={styles.teamCard} onPress={handlePress}>
      <View style={styles.teamHeader}>
        {/* TIER BADGE */}
        <TierBadge
          tier={composition.tier || 'S'}
          isOp={composition.isOp}
          size={40}
          style={styles.rankBadge}
        />

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
                <View style={[styles.difficultyBadge, { backgroundColor: difficultyStyle.bg }]}>
                  <Text style={[styles.difficultyText, { color: difficultyStyle.text }]}>
                    {getDifficultyLabel(composition.difficulty)}
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
            borderWidth={2}
            shape='square'  
            // Sử dụng index làm fallback key nếu championId trùng lặp (trường hợp hiếm)
            key={`${unit.championId}-${index}`}
            unit={unit}
            size={itemSize} // Truyền size đã tính toán xuống
            customStyleItem={{
              bottom: -4
            }}
            customStyleStar={{
              top: -8
            }}
          />
        ))}
      </View>
    </RNBounceable>
  );
};

export default React.memo(TeamCard);