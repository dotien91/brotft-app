import React, {useMemo, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import createStyles from './RecommendedUnitsSection.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {useTftUnitByApiName} from '@services/api/hooks/listQueryHooks';
import {getUnitAvatarUrl} from '../../../utils/metatft';
import {getUnitCostBorderColor} from '../../../utils/unitCost';
import {translations} from '../../../shared/localization';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import useStore, {StoreState} from '@services/zustand/store';
import Hexagon from '@screens/detail/components/Hexagon';

interface RecommendedUnitsSectionProps {
  units: string[];
}

const RecommendedUnitsSection: React.FC<RecommendedUnitsSectionProps> = ({
  units,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state: StoreState) => state.language);

  useEffect(() => {
    if (language && translations.getLanguage() !== language) {
      translations.setLanguage(language);
    }
  }, [language]);

  if (!units || units.length === 0) {
    return null;
  }

  const handleUnitPress = (unitId?: string, unitApiName?: string) => {
    if (unitId) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(unitId)});
    } else if (unitApiName) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: String(unitApiName)});
    }
  };

  return (
    <View style={styles.container}>
      <Text h3 bold color={colors.text} style={styles.sectionTitle}>
        {translations.recommendedUnits || 'Recommended Units'}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.unitsContainer}>
        {units.map((unitApiName, index) => {
          return (
            <RecommendedUnitCard
              key={`recommended-unit-${unitApiName}-${index}`}
              unitApiName={unitApiName}
              onPress={handleUnitPress}
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

interface RecommendedUnitCardProps {
  unitApiName: string;
  onPress: (unitId?: string, unitApiName?: string) => void;
}

const RecommendedUnitCard: React.FC<RecommendedUnitCardProps> = ({
  unitApiName,
  onPress,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {
    data: unit,
    isLoading,
  } = useTftUnitByApiName(unitApiName);

  const unitAvatar = useMemo(() => {
    if (!unitApiName) return '';
    return getUnitAvatarUrl(unitApiName, 64);
  }, [unitApiName]);

  const borderColor = useMemo(() => {
    return getUnitCostBorderColor(unit?.cost, colors.highlight || '#94a3b8');
  }, [unit?.cost, colors.highlight]);

  if (isLoading || !unit) {
    return (
      <View style={styles.unitCard}>
        <View style={styles.hexagonContainer}>
          <Hexagon
            size={56}
            backgroundColor={colors.card}
            borderColor={borderColor}
            borderWidth={2}
            imageUri={unitAvatar}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.unitCard}>
      <RNBounceable
        style={styles.unitColumn}
        onPress={() => onPress(unit?.id, unit?.apiName)}>
        <View style={styles.hexagonContainer}>
          <Hexagon
            size={56}
            backgroundColor={colors.card}
            borderColor={borderColor}
            borderWidth={2}
            imageUri={unitAvatar}
          />
        </View>
      </RNBounceable>
    </View>
  );
};

export default RecommendedUnitsSection;

