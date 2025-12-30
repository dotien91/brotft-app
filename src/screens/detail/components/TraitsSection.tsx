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
        // First try to match by name (localized name from units)
        // Then try to match by apiName if available
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

        // If not found by name, try to find by matching with units data to get apiName
        if (!traitDetail && unitsData) {
          if (Array.isArray(unitsData)) {
            const unitWithTrait = unitsData.find((unit: any) => 
              unit.traits && Array.isArray(unit.traits) && unit.traits.includes(traitName)
            );
            if (unitWithTrait) {
              // Now find the trait detail using the trait name from unit
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
            }
          }
        }

        // Get breakpoints from effects
        let breakpoints: number[] = [];
        if (traitDetail?.effects && Array.isArray(traitDetail.effects)) {
          const allBreakpoints: number[] = [];
          traitDetail.effects.forEach((effect: any) => {
            // Collect both minUnits and maxUnits
            if (effect.minUnits !== undefined && effect.minUnits !== null) {
              allBreakpoints.push(effect.minUnits);
            }
            if (effect.maxUnits !== undefined && effect.maxUnits !== null) {
              allBreakpoints.push(effect.maxUnits);
            }
          });
          // Sort and remove duplicates
          breakpoints = allBreakpoints
            .sort((a: number, b: number) => a - b)
            .filter((value: number, index: number, self: number[]) => self.indexOf(value) === index);
        }

        // Use localized name from traitDetail if available, otherwise use traitName from units
        const localizedName = traitDetail?.name || traitName;

        return {
          name: localizedName, // Use localized name from traits data
          count: count,
          id: traitDetail?.id,
          apiName: traitDetail?.apiName || traitName,
          breakpoints: breakpoints,
        };
      })
      .filter((trait) => {
        // Chỉ hiển thị trait nếu có ít nhất 1 breakpoint đạt được
        if (!trait.breakpoints || trait.breakpoints.length === 0) {
          return false;
        }
        const count = trait.count || 0;
        const achievedBreakpoints = trait.breakpoints.filter((bp) => count >= bp);
        return achievedBreakpoints.length > 0;
      })
      .sort((a, b) => {
        // Ưu tiên sắp xếp theo breakpoint cao nhất đạt được
        const aCount = a.count || 0;
        const bCount = b.count || 0;
        
        const aMaxBreakpoint = a.breakpoints
          ? Math.max(...a.breakpoints.filter((bp) => aCount >= bp), 0)
          : 0;
        const bMaxBreakpoint = b.breakpoints
          ? Math.max(...b.breakpoints.filter((bp) => bCount >= bp), 0)
          : 0;
        
        // Sort theo breakpoint cao nhất trước, nếu bằng nhau thì sort theo count
        if (bMaxBreakpoint !== aMaxBreakpoint) {
          return bMaxBreakpoint - aMaxBreakpoint;
        }
        return bCount - aCount;
      });
    } catch (error) {
      console.error('Error getting traits from units:', error);
      return [];
    }
  }, [units, language]);

  if (!traits || traits.length === 0) return null;

  return (
    <View style={styles.traitsSection}>
      <Text style={styles.traitsSectionTitle}>{translations.traitsSection}</Text>
        {/* Left Column */}
        <View style={styles.traitsColumn}>
          {traits.map((trait, index) => (
            <TraitItem key={trait.name || index} trait={trait} index={index} />
          ))}
        </View>
    </View>
  );
};

export default TraitsSection;

