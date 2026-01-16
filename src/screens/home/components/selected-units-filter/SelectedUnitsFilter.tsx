import React, {useMemo, useCallback, useState, useEffect} from 'react';
import {View, ScrollView} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import UnitAvatar from '@shared-components/unit-avatar';
import {translations} from '../../../../shared/localization';
import createStyles from '../../HomeScreen.style';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';
import type {ITftUnit} from '@services/models/tft-unit';

interface SelectedUnitsFilterProps {
  selectedUnits: string[];
  onRemoveUnit: (unitKey: string) => void;
  onClearAll: () => void;
}

const SelectedUnitsFilter: React.FC<SelectedUnitsFilterProps> = React.memo(({
  selectedUnits,
  onRemoveUnit,
  onClearAll,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  const [allUnits, setAllUnits] = useState<ITftUnit[]>([]);

  // Normalize apiName to championKey format
  const normalizeToChampionKey = useCallback((apiName: string): string => {
    let normalized = apiName.replace(/^TFT\d*_?/i, '');
    normalized = normalized.toLowerCase();
    return normalized;
  }, []);

  // Get units from LocalStorage
  useEffect(() => {
    if (!language) {
      setAllUnits([]);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);

      if (!unitsDataString) {
        setAllUnits([]);
        return;
      }

      const unitsData = JSON.parse(unitsDataString);
      let unitsArray: any[] = [];

      // Handle both array and object formats
      if (Array.isArray(unitsData)) {
        unitsArray = unitsData;
      } else if (typeof unitsData === 'object' && unitsData !== null) {
        unitsArray = Object.values(unitsData);
      }

      // Convert to ITftUnit format
      const formattedUnits: ITftUnit[] = unitsArray.map((unit: any) => ({
        id: unit.id || unit.apiName || '',
        apiName: unit.apiName || '',
        name: unit.name || '',
        enName: unit.enName || null,
        characterName: unit.characterName || null,
        cost: unit.cost ?? null,
        icon: unit.icon || null,
        squareIcon: unit.squareIcon || null,
        tileIcon: unit.tileIcon || null,
        role: unit.role || null,
        ability: unit.ability || null,
        stats: unit.stats || null,
        traits: unit.traits || [],
        tier: unit.tier || null,
        needUnlock: unit.needUnlock || false,
        createdAt: unit.createdAt || null,
        updatedAt: unit.updatedAt || null,
        deletedAt: unit.deletedAt || null,
      }));

      setAllUnits(formattedUnits);
    } catch (error) {
      console.warn('Error loading units from LocalStorage:', error);
      setAllUnits([]);
    }
  }, [language]);

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
          const unit = allUnits.find(u => {
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

