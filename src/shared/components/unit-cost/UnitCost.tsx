import React from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import GoldIcon from '@shared-components/gold-icon/GoldIcon';

interface UnitCostProps {
  cost: number;
  size?: number;
  active?: boolean;
}

const UnitCost: React.FC<UnitCostProps> = ({cost, size = 16, active = false}) => {
  const iconColor = active ? 'rgba(251, 191, 36, 0.6)' : '#fbbf24';
  const textColor = active ? 'rgba(251, 191, 36, 0.6)' : '#fbbf24';
  const backgroundColor = active 
    ? 'rgba(251, 191, 36, 0.1)' 
    : 'rgba(251, 191, 36, 0.15)';
  const borderColor = active 
    ? 'rgba(251, 191, 36, 0.2)' 
    : 'rgba(251, 191, 36, 0.3)';
  const opacity = active ? 0.6 : 1;

  return (
    <View 
      style={[
        styles.costContainer,
        {
          backgroundColor,
          borderColor,
          opacity,
        },
      ]}>
      <GoldIcon size={size} color={iconColor} />
      <Text style={[styles.costText, {color: textColor}]}>{cost}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  costContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 4,
    borderWidth: 1,
  },
  costText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default UnitCost;

