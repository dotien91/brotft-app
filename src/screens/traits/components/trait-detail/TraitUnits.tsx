import React, {useMemo} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import GuideUnitItem from '../../../guide/tabs/components/GuideUnitItem';
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

  const handleUnitPress = (unitId: string | number) => {
    const unit = units.find(u => String(u.id) === String(unitId));
    if (unit) {
      if (unit.apiName) {
        NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: unit.apiName});
      } else if (unit.id) {
        NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unit.id)});
      }
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
            <GuideUnitItem
              key={unit.id || unit.apiName}
              data={unit}
              onPress={() => handleUnitPress(unit.id)}
              compact={true}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default TraitUnits;

