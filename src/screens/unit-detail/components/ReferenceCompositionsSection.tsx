import React, {useMemo} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import TeamCard from '@screens/home/components/team-card/TeamCard';
import {useSearchCompositionsByUnits} from '@services/api/hooks/listQueryHooks';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import type {IComposition} from '@services/models/composition';
import {translations} from '../../../shared/localization';
import createStyles from '../UnitDetailScreen.style';

interface ReferenceCompositionsSectionProps {
  unitApiName?: string;
  unitApiNameFromUnit?: string;
}

const ReferenceCompositionsSection: React.FC<ReferenceCompositionsSectionProps> = ({
  unitApiName,
  unitApiNameFromUnit,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Normalize apiName to championKey format for searching compositions
  const normalizeToChampionKey = (apiName: string): string => {
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    normalized = normalized.toLowerCase();
    return normalized;
  };

  // Get championKey for searching compositions
  const championKey = useMemo(() => {
    if (unitApiName) {
      return normalizeToChampionKey(unitApiName);
    }
    if (unitApiNameFromUnit) {
      return normalizeToChampionKey(unitApiNameFromUnit);
    }
    return null;
  }, [unitApiName, unitApiNameFromUnit]);

  // Search compositions by unit
  const searchDto = useMemo(() => {
    if (!championKey) return null;
    return {
      units: [championKey],
      searchInAllArrays: true,
    };
  }, [championKey]);

  const {
    data: referenceCompositions,
    isLoading: isLoadingCompositions,
  } = useSearchCompositionsByUnits(searchDto, 10);

  const handleCompositionPress = (comp: IComposition) => {
    NavigationService.push(SCREENS.DETAIL, {compId: comp.compId});
  };

  if (!referenceCompositions || referenceCompositions.length === 0) {
    return null;
  }

  return (
    <View style={styles.referenceCompositionsSection}>
      <Text h3 bold color={colors.text} style={styles.sectionTitle}>
        {translations.referenceCompositions}
      </Text>
      {isLoadingCompositions ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      ) : (
        <View style={styles.compositionsList}>
          {referenceCompositions.map((comp) => (
            <TeamCard
              key={comp.id}
              composition={comp}
              onPress={handleCompositionPress}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default ReferenceCompositionsSection;

