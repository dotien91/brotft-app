import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import CostIcon from '@shared-components/cost-icon/CostIcon';
import { getUnitCostBorderColor } from '../../../utils/unitCost';
import { translations } from '../../../shared/localization';

const COST_OPTIONS = [1, 2, 3, 4, 5];

export type CostFilterValue = number | 'all';

interface CostFilterProps {
  selectedCost: CostFilterValue;
  onCostChange: (cost: CostFilterValue) => void;
}

const CostFilter: React.FC<CostFilterProps> = ({ selectedCost, onCostChange }) => {
  const theme = useTheme();
  const { colors } = theme;

  const getCostButtonStyle = useCallback(
    (cost: CostFilterValue) => {
      if (cost === 'all') {
        return {
          flexDirection: 'row' as const,
          alignItems: 'center' as const,
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
          borderWidth: 1,
          gap: 4,
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: selectedCost === 'all' ? 1 : 0.6,
        };
      }
      const costColor = getUnitCostBorderColor(cost, colors.border || '#94a3b8');
      const isActive = selectedCost === cost;
      return {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        gap: 4,
        backgroundColor: costColor,
        borderColor: costColor,
        opacity: isActive ? 1 : 0.6,
      };
    },
    [selectedCost, colors.background, colors.border],
  );

  const allLabel = useMemo(
    () => (translations as { all?: string }).all ?? 'All',
    [],
  );

  return (
    <View style={[styles.container, { marginHorizontal: 16 }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          key="all"
          onPress={() => onCostChange('all')}
          style={getCostButtonStyle('all')}>
          <Text style={[styles.costFilterText, { color: colors.text }]}>{allLabel}</Text>
        </TouchableOpacity>
        {COST_OPTIONS.map((cost) => (
          <TouchableOpacity
            key={cost}
            onPress={() => onCostChange(selectedCost === cost ? 'all' : cost)}
            style={getCostButtonStyle(cost)}>
            <CostIcon size={12} color="#ffffff" />
            <Text style={styles.costFilterText}>{cost}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    marginTop: 10,
    maxHeight: 50,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  costFilterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default CostFilter;
