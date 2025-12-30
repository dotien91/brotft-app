import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import useStore from '@services/zustand/store';
import createStyles from '../DetailScreen.style';
import TraitItem from './TraitItem';
import {translations} from '../../../shared/localization';

export interface TraitData {
  name: string;
  count: number;
  id?: string;
  apiName: string;
  breakpoints: number[];
}

const TraitsSection: React.FC<{units: any[]}> = ({units}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore(state => state.language);

  const traits = useMemo<TraitData[]>(() => {
    if (!units?.length || !language) return [];

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsData = JSON.parse(LocalStorage.getString(`data_units_${locale}`) || '[]');
      const traitsData = JSON.parse(LocalStorage.getString(`data_traits_${locale}`) || '[]');

      const unitsMap = new Map();
      const rawUnits = Array.isArray(unitsData) ? unitsData : Object.values(unitsData);
      rawUnits.forEach((u: any) => u.apiName && unitsMap.set(u.apiName, u));

      const traitsMap = new Map();
      const rawTraits = Array.isArray(traitsData) ? traitsData : Object.values(traitsData);
      rawTraits.forEach((t: any) => t.apiName && traitsMap.set(t.apiName, t));

      const traitCountMap: Record<string, number> = {};
      const processedKeys = new Set<string>();

      units.forEach(unit => {
        if (!unit.championKey || processedKeys.has(unit.championKey)) return;
        const storageUnit = unitsMap.get(unit.championKey);
        if (storageUnit?.traits) {
          processedKeys.add(unit.championKey);
          storageUnit.traits.forEach((tName: string) => {
            const traitObj = traitsMap.get(tName) || 
                           Array.from(traitsMap.values()).find((t: any) => t.name === tName);
            const finalKey = traitObj?.apiName || tName;
            traitCountMap[finalKey] = (traitCountMap[finalKey] || 0) + 1;
          });
        }
      });

      return Object.entries(traitCountMap)
        .map(([apiName, count]) => {
          const detail = traitsMap.get(apiName);
          let breakpoints: number[] = [];
          if (detail?.effects) {
            const bpSet = new Set<number>();
            detail.effects.forEach((eff: any) => eff.minUnits != null && bpSet.add(Number(eff.minUnits)));
            breakpoints = Array.from(bpSet).sort((a, b) => a - b);
          }
          return {
            name: detail?.name || apiName,
            count,
            id: detail?.id,
            apiName,
            breakpoints,
          };
        })
        .filter(t => t.breakpoints.length > 0 && t.count >= t.breakpoints[0])
        .sort((a, b) => {
          const getSortScore = (trait: TraitData) => {
            const {count, breakpoints} = trait;
            const highestIdx = breakpoints.filter(bp => count >= bp).length - 1;
            const isMax = count >= breakpoints[breakpoints.length - 1];
            const isUnique = breakpoints.length === 1;

            // Score 1000 cho Unique (Cam) và Max (Vàng/Kim cương)
            if (isUnique || isMax) return 1000 + highestIdx;
            return (highestIdx + 1) * 10; 
          };

          const scoreA = getSortScore(a);
          const scoreB = getSortScore(b);

          if (scoreB !== scoreA) return scoreB - scoreA;
          return b.count - a.count;
        });
    } catch (e) {
      return [];
    }
  }, [units, language]);

  if (!traits.length) return null;

  return (
    <View style={styles.traitsSection}>
      <Text style={styles.traitsSectionTitle}>{translations.traitsSection}</Text>
      <View style={styles.traitsColumn}>
        {traits.map((trait, index) => (
          <TraitItem key={`${trait.apiName}-${index}`} trait={trait} index={index} />
        ))}
      </View>
    </View>
  );
};

export default TraitsSection;