import React, {useMemo} from 'react';
import {View} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getCachedUnits, getCachedTraits} from '@services/api/data';
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
      const unitsData = getCachedUnits(language);
      const traitsData = getCachedTraits(language);

      const unitsMap = new Map();
      Object.values(unitsData).forEach((u: any) => u.apiName && unitsMap.set(u.apiName, u));

      const traitsMap = new Map();
      Object.values(traitsData).forEach((t: any) => t.apiName && traitsMap.set(t.apiName, t));

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
      <Text style={styles.sectionTitle}>{translations.traitsSection}</Text>
      <View style={styles.traitsColumn}>
        {traits.map((trait, index) => (
          <TraitItem key={`${trait.apiName}-${index}`} trait={trait} index={index} />
        ))}
      </View>
    </View>
  );
};

export default TraitsSection;