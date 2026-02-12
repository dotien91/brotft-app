import React, {useMemo} from 'react';
import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import UnitHexagonItem from '../../../home/components/unit-hexagon-item/UnitHexagonItem';
import {translations} from '../../../../shared/localization';
import createStyles from './TraitUnits.style';

interface Unit {
  id?: string | number;
  apiName?: string;
  [key: string]: any;
}

interface TraitUnitsProps {
  units: Unit[];
  isLoading?: boolean;
  isError?: boolean;
}

const TraitUnits: React.FC<TraitUnitsProps> = ({
  units,
  isLoading,
  isError,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const unitsCount = units.length;

  const handleUnitPress = (unit: Unit) => {
    if (unit.apiName) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: unit.apiName});
    } else if (unit.id != null) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unit.id)});
    }
  };

  return (
    <View style={styles.section}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : isError ? (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorDescription, {color: colors.danger, opacity: 1}]}>
            {translations.errorLoadingUnits}
          </Text>
        </View>
      ) : unitsCount === 0 ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorDescription}>
            {translations.noUnitsFound}
          </Text>
        </View>
      ) : (
        <View style={styles.unitsContainer}>
          {units.map((unit) => (
            <TouchableOpacity
              key={unit.id || unit.apiName}
              style={styles.unitCell}
              onPress={() => handleUnitPress(unit)}
              activeOpacity={0.7}>
              <UnitHexagonItem unit={unit} size={48} shape="square" unlockPosition='topLeft' />
              <Text style={styles.unitName} numberOfLines={1}>
                {unit.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default TraitUnits;

