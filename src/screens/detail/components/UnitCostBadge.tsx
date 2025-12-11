import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import CostIcon from '@shared-components/cost-icon/CostIcon';
import createStyles from '../DetailScreen.style';

interface UnitCostBadgeProps {
  cost: number;
}

const UnitCostBadge: React.FC<UnitCostBadgeProps> = ({cost}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const colors = theme.colors as any;

  // Get unit border color based on cost
  const getUnitCostBorderColor = (cost?: number): string => {
    if (!cost) return colors.border;
    switch (cost) {
      case 1:
        return '#c0c0c0'; // Xám/Trắng
      case 2:
        return '#4ade80'; // Xanh lá
      case 3:
        return '#60a5fa'; // Xanh dương
      case 4:
        return '#a78bfa'; // Tím
      case 5:
        return '#ffd700'; // Vàng (Huyền thoại)
      case 6:
        return '#ff6b35'; // Đỏ/Cam
      default:
        return colors.border;
    }
  };

  const costColor = getUnitCostBorderColor(cost);

  return (
    <View
      style={[
        styles.carryCostBadge,
        {
          borderColor: costColor,
          backgroundColor: costColor,
          width: 42,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}>
      <CostIcon size={12} color="#000000" />
      <Text style={[styles.carryCostText, {color: '#000000'}]}>{cost}</Text>
    </View>
  );
};

export default UnitCostBadge;

