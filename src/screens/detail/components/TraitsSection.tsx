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
  traits?: string[]; 
}

interface TraitsSectionProps {
  units: TeamUnit[];
}

const TraitsSection: React.FC<TraitsSectionProps> = ({units}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore(state => state.language);

  const traits = useMemo<TraitData[]>(() => {
    // 1. Kiểm tra đầu vào cơ bản
    if (!units?.length || !language) return [];

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsDataRaw = LocalStorage.getString(`data_units_${locale}`);
      const traitsDataRaw = LocalStorage.getString(`data_traits_${locale}`);
      
      if (!unitsDataRaw || !traitsDataRaw) return [];

      const unitsData = JSON.parse(unitsDataRaw);
      const traitsData = JSON.parse(traitsDataRaw);

      // 2. Tạo Map từ LocalStorage để truy xuất nhanh O(1)
      const unitsMapFromStorage = new Map();
      const rawUnitsList = Array.isArray(unitsData) ? unitsData : Object.values(unitsData);
      rawUnitsList.forEach((u: any) => {
        if (u.apiName) unitsMapFromStorage.set(u.apiName, u);
      });

      const traitsMapFromStorage = new Map();
      const rawTraitsList = Array.isArray(traitsData) ? traitsData : Object.values(traitsData);
      rawTraitsList.forEach((t: any) => {
        if (t.apiName) traitsMapFromStorage.set(t.apiName, t);
      });

      // 3. Tính toán count
      const traitCountMap: Record<string, number> = {};
      const processedChampionKeys = new Set<string>();

      units.forEach(unit => {
        const key = unit.championKey;
        if (!key || processedChampionKeys.has(key)) return;

        // Quan trọng: Lấy traits từ Storage vì traits trong props bị rỗng
        const storageUnit = unitsMapFromStorage.get(key);
        
        if (storageUnit && Array.isArray(storageUnit.traits)) {
          processedChampionKeys.add(key);
          storageUnit.traits.forEach((tName: string) => {
            // Chuẩn hóa tên trait qua apiName để tránh lệch tên
            // Tìm trait object tương ứng trong storage
            let finalTraitKey = tName;
            
            // Nếu tName là nickname, cố gắng tìm apiName chuẩn
            for (const [apiName, detail] of traitsMapFromStorage) {
              if (detail.apiName === tName || detail.name === tName) {
                finalTraitKey = apiName;
                break;
              }
            }
            
            if (finalTraitKey) {
              traitCountMap[finalTraitKey] = (traitCountMap[finalTraitKey] || 0) + 1;
            }
          });
        }
      });

      // 4. Chuyển đổi sang format TraitData và lấy Breakpoints
      return Object.entries(traitCountMap)
        .map(([apiName, count]) => {
          const detail = traitsMapFromStorage.get(apiName);
          
          let breakpoints: number[] = [];
          if (detail?.effects && Array.isArray(detail.effects)) {
            const bpSet = new Set<number>();
            detail.effects.forEach((eff: any) => {
              if (eff.minUnits !== undefined && eff.minUnits !== null) {
                bpSet.add(Number(eff.minUnits));
              }
            });
            breakpoints = Array.from(bpSet).sort((a, b) => a - b);
          }

          return {
            name: detail?.name || apiName,
            count: count,
            id: detail?.id,
            apiName: apiName,
            breakpoints: breakpoints,
          };
        })
        // 5. Lọc: Chỉ hiện những hệ tộc đã kích hoạt ít nhất mốc 1
        .filter(trait => {
          if (trait.breakpoints.length === 0) return false;
          const minBreakpoint = Math.min(...trait.breakpoints);
          return trait.count >= minBreakpoint;
        })
        // 6. Sắp xếp: Ưu tiên mốc cao nhất -> số lượng tướng
        .sort((a, b) => {
          const aMaxBP = Math.max(...a.breakpoints.filter(bp => a.count >= bp), 0);
          const bMaxBP = Math.max(...b.breakpoints.filter(bp => b.count >= bp), 0);

          if (bMaxBP !== aMaxBP) return bMaxBP - aMaxBP;
          return b.count - a.count;
        });

    } catch (error) {
      console.error('[TraitsSection] Error processing data:', error);
      return [];
    }
  }, [units, language]);

  // Không hiển thị gì nếu không có trait nào đạt mốc
  if (traits.length === 0) return null;
console.log('traits=====222', traits?.[0]);
  return (
    <View style={styles.traitsSection}>
      <Text style={styles.traitsSectionTitle}>
        {translations.traitsSection || 'Active Traits'}
      </Text>
      <View style={styles.traitsColumn}>
        {traits.map((trait, index) => (
          <TraitItem 
            key={`${trait.apiName}-${index}`} 
            trait={trait} 
            index={index} 
          />
        ))}
      </View>
    </View>
  );
};

export default TraitsSection;