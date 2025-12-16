import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {translations} from '../../../../shared/localization';
import createStyles from './TraitEffects.style';

interface TraitEffectsProps {
  effects?: any[] | null;
}

const TraitEffects: React.FC<TraitEffectsProps> = ({effects}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (!effects || effects.length === 0) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {translations.traitEffects}
      </Text>
      {effects.map((effect, index) => (
        <View key={index} style={styles.tierCard}>
          <View style={styles.tierHeader}>
            <View style={styles.tierCountBadge}>
              <Text style={styles.tierCountText}>
                {effect.minUnits || 0}
                {effect.maxUnits ? `-${effect.maxUnits}` : '+'}
              </Text>
              <Text style={styles.tierCountLabel}>
                {translations.units.toLowerCase()}
              </Text>
            </View>
            <View style={styles.tierEffectContainer}>
              <Icon
                name="flash"
                type={IconType.Ionicons}
                color={colors.primary}
                size={20}
              />
              <Text style={styles.tierEffectText}>
                Style: {effect.style || 'N/A'}
              </Text>
            </View>
          </View>
          {effect.variableMatches && effect.variableMatches.length > 0 && (
            <View style={styles.variablesContainer}>
              {effect.variableMatches.map((match: any, matchIndex: number) => (
                <View key={matchIndex} style={styles.variableItem}>
                  <Text style={styles.variableText}>
                    {match.match || match.type}: {match.value || 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default TraitEffects;

