import React, {useMemo, useCallback} from 'react';
import {View, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import UnitAvatar from '@shared-components/unit-avatar';
import {translations} from '../../../../shared/localization';
import createStyles from '../../HomeScreen.style';

interface SelectedUnitsFilterProps {
  selectedUnits: string[];
  allUnits?: Array<{apiName?: string}>;
  onRemoveUnit: (unitKey: string) => void;
  onClearAll: () => void;
  normalizeToChampionKey: (apiName: string) => string;
}

const SelectedUnitsFilter: React.FC<SelectedUnitsFilterProps> = React.memo(({
  selectedUnits,
  allUnits,
  onRemoveUnit,
  onClearAll,
  normalizeToChampionKey,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  if (selectedUnits.length === 0) {
    return null;
  }

  return (
    <View style={styles.selectedUnitsContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.selectedUnitsScroll}>
        <RNBounceable
          onPress={onClearAll}
          style={styles.clearFilterButton}>
          <View style={styles.clearFilterButtonContent}>
            <Icon
              name="close-circle"
              type={IconType.Ionicons}
              color={colors.primary}
              size={20}
            />
            <Text style={styles.clearFilterButtonText} numberOfLines={1}>
              {translations.clearAll}
            </Text>
          </View>
        </RNBounceable>
        {selectedUnits.map((unitKey, index) => {
          // Find unit by matching championKey
          const unit = allUnits?.find(u => {
            const championKey = normalizeToChampionKey(u.apiName || '');
            return championKey === unitKey;
          });

          const apiName = unit?.apiName || unitKey;

          return (
            <RNBounceable
              key={`${unitKey}-${index}`}
              onPress={() => onRemoveUnit(unitKey)}
              style={styles.selectedUnitChip}>
              <View style={styles.selectedUnitAvatarContainer}>
                <UnitAvatar apiName={apiName} hexSize={46} />
                <View style={styles.selectedUnitRemoveIcon}>
                  <Icon
                    name="close-circle"
                    type={IconType.Ionicons}
                    color={colors.placeholder}
                    size={20}
                  />
                </View>
              </View>
            </RNBounceable>
          );
        })}
      </ScrollView>
    </View>
  );
});

SelectedUnitsFilter.displayName = 'SelectedUnitsFilter';

export default SelectedUnitsFilter;

