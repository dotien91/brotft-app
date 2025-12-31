import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import CostIcon from '@shared-components/cost-icon/CostIcon';
import {getUnitCostBorderColor} from '../../../utils/unitCost';
import createStyles from '../DetailScreen.style';

interface UnitCostBadgeProps {
  cost: number;
}

const UnitCostBadge: React.FC<UnitCostBadgeProps> = ({cost, fromDetailScreen = false}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const colors = theme.colors as any;

  const costColor = getUnitCostBorderColor(cost, colors.border || '#94a3b8');
  const textColor = '#ffffff'; // White text for all costs

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
      <CostIcon size={12} color={textColor} />
      <Text style={[styles.carryCostText, {color: textColor}]}>{cost}</Text>
    </View>
  );
};

export default UnitCostBadge;

