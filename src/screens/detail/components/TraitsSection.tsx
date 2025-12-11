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

interface TeamUnit {
  championKey?: string;
  name?: string;
}

interface TraitsSectionProps {
  units: TeamUnit[];
}

const TraitsSection: React.FC<TraitsSectionProps> = ({units}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore(state => state.language);

  // Get traits from units
  const traits = useMemo<TraitData[]>(() => {
    if (!units || units.length === 0 || !language) return [];
    
    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) return [];
      
      const unitsData = JSON.parse(unitsDataString);
      const traitCountMap: Record<string, number> = {};

      // Get all traits from units
      units.forEach(unit => {
        if (!unit.championKey) return;
        
        let localizedUnit: any = null;

        // Handle both array and object formats
        if (Array.isArray(unitsData)) {
          localizedUnit = unitsData.find((localUnit: any) => {
            if (unit.championKey && localUnit.apiName === unit.championKey) {
              return true;
            }
            if (unit.name && localUnit.name) {
              return unit.name.toLowerCase() === localUnit.name.toLowerCase();
            }
            return false;
          });
        } else if (typeof unitsData === 'object' && unitsData !== null) {
          if (unit.championKey && unitsData[unit.championKey]) {
            localizedUnit = unitsData[unit.championKey];
          } else {
            const unitsArray = Object.values(unitsData) as any[];
            localizedUnit = unitsArray.find((localUnit: any) => {
              if (unit.championKey && localUnit.apiName === unit.championKey) {
                return true;
              }
              if (unit.name && localUnit.name) {
                return unit.name.toLowerCase() === localUnit.name.toLowerCase();
              }
              return false;
            });
          }
        }

        if (localizedUnit && localizedUnit.traits) {
          const traits = Array.isArray(localizedUnit.traits) ? localizedUnit.traits : [];
          traits.forEach((trait: string) => {
            if (trait) {
              traitCountMap[trait] = (traitCountMap[trait] || 0) + 1;
            }
          });
        }
      });

      // Convert to array and get trait details from local storage
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);
      let traitsData: any = null;
      if (traitsDataString) {
        traitsData = JSON.parse(traitsDataString);
      }

      return Object.entries(traitCountMap).map(([traitName, count]) => {
        let traitDetail: any = null;
        
        // Find trait detail from local storage
        if (traitsData) {
          if (Array.isArray(traitsData)) {
            traitDetail = traitsData.find((trait: any) => 
              trait.name === traitName || trait.apiName === traitName
            );
          } else if (typeof traitsData === 'object' && traitsData !== null) {
            traitDetail = Object.values(traitsData).find((trait: any) => 
              trait.name === traitName || trait.apiName === traitName
            );
          }
        }

        // Get breakpoints from effects
        let breakpoints: number[] = [];
        if (traitDetail?.effects && Array.isArray(traitDetail.effects)) {
          breakpoints = traitDetail.effects
            .map((effect: any) => effect.minUnits || effect.maxUnits)
            .filter((bp: any) => bp !== undefined && bp !== null)
            .sort((a: number, b: number) => a - b)
            .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index); // Remove duplicates
        }

        return {
          name: traitName,
          count: count,
          id: traitDetail?.id,
          apiName: traitDetail?.apiName || traitName,
          breakpoints: breakpoints,
        };
      }).sort((a, b) => b.count - a.count); // Sort by count descending
    } catch (error) {
      console.error('Error getting traits from units:', error);
      return [];
    }
  }, [units, language]);

  if (!traits || traits.length === 0) return null;

  // Split traits into 2 columns
  const midPoint = Math.ceil(traits.length / 2);
  const leftColumn = traits.slice(0, midPoint);
  const rightColumn = traits.slice(midPoint);

  return (
    <View style={styles.traitsSection}>
      <Text style={styles.traitsSectionTitle}>{translations.traitsSection}</Text>
      <View style={styles.traitsColumnsContainer}>
        {/* Left Column */}
        <View style={styles.traitsColumn}>
          {leftColumn.map((trait, index) => (
            <TraitItem key={trait.name || index} trait={trait} index={index} />
          ))}
        </View>
        
        {/* Right Column */}
        <View style={styles.traitsColumn}>
          {rightColumn.map((trait, index) => (
            <TraitItem key={trait.name || index + midPoint} trait={trait} index={index + midPoint} />
          ))}
        </View>
      </View>
    </View>
  );
};

export default TraitsSection;

