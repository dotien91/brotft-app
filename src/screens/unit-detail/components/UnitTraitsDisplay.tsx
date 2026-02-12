import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@react-navigation/native';
import * as NavigationService from 'react-navigation-helpers';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../utils/metatft';
import {SCREENS} from '@shared-constants';
import useStore from '@services/zustand/store';
import {getCachedUnits, getCachedTraits} from '@services/api/data';
import createStyles from '../UnitDetailScreen.style';

interface TraitInfo {
  name: string;
  apiName: string;
  id?: string;
}

interface UnitTraitsDisplayProps {
  unit: {
    apiName?: string;
    name?: string;
    traits?: string[];
  };
  fromDetailScreen?: boolean;
}

const UnitTraitsDisplay: React.FC<UnitTraitsDisplayProps> = ({unit, fromDetailScreen = false}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  
  const [origins, setOrigins] = useState<TraitInfo[]>([]);
  const [classes, setClasses] = useState<TraitInfo[]>([]);

// 1. Tối ưu hóa: Tạo Map Lookup chỉ khi language thay đổi (Cache Map)
  // Giúp tránh việc phải loop qua toàn bộ traitsData mỗi khi bấm vào unit khác.
  const traitsLookupMap = useMemo(() => {
    if (!language) return null;
    const traitsData = getCachedTraits(language);
    if (!traitsData) return null;

    const map = new Map<string, any>();
    Object.values(traitsData).forEach((t: any) => {
      // Map cả apiName và name về lowercase để tìm kiếm chính xác
      if (t.apiName) map.set(t.apiName.toLowerCase(), t);
      if (t.name) map.set(t.name.toLowerCase(), t);
      // Map thêm key nếu có (thường là traitId gốc)
      if (t.key) map.set(t.key.toLowerCase(), t);
    });
    return map;
  }, [language]);

  // 2. Effect chính: Chỉ thực hiện lookup và phân loại
  useEffect(() => {
    // Reset state nhanh nếu thiếu dữ liệu đầu vào
    if (!unit || !traitsLookupMap) {
      setOrigins([]);
      setClasses([]);
      return;
    }

    try {
      const unitsData = getCachedUnits(language);
      
      // Lookup O(1): Tìm unit trực tiếp thay vì check Object.keys
      const localizedUnit = unitsData?.[unit.apiName];
      
      // Ưu tiên traits từ localized data -> fallback về unit props
      const traitNamesToFind = localizedUnit?.traits || unit.traits;

      if (!traitNamesToFind?.length) {
        setOrigins([]);
        setClasses([]);
        return;
      }

      const oList: TraitInfo[] = [];
      const cList: TraitInfo[] = [];

      traitNamesToFind.forEach((tName: string) => {
        // Tìm trait từ Map đã cache (O(1))
        const trait = traitsLookupMap.get(tName.toLowerCase());

        if (trait) {
          const info = {
            name: trait.name || tName,
            apiName: trait.apiName || tName,
            id: trait.id || trait.apiName,
            // Có thể thêm icon nếu cần: icon: trait.icon
          };

          // Phân loại Origin vs Class
          // Kiểm tra an toàn hơn với toLowerCase()
          if (trait.type?.toLowerCase() === 'origin') {
            oList.push(info);
          } else {
            cList.push(info);
          }
        }
      });

      setOrigins(oList);
      setClasses(cList);
    } catch (e) {
      console.error('Error processing unit traits:', e);
      setOrigins([]);
      setClasses([]);
    }
  }, [unit, language, traitsLookupMap]);
  const handleTraitPress = (traitId?: string) => {
    if (traitId) {
      NavigationService.push(SCREENS.TRAIT_DETAIL, {traitId});
    }
  };

  const renderTraitGroup = (data: TraitInfo[]) => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    return <>
          {data.map((item, idx) => (
            <TouchableOpacity
              key={`${item.apiName}-${idx}`}
              style={[styles.unitTraitItem, {flexDirection: 'row', alignItems: 'center', marginRight: 8, marginBottom: 2}]}
              onPress={() => handleTraitPress(item.id)}>
              <FastImage
                source={{uri: getTraitIconUrl(item.apiName), priority: FastImage.priority.normal}}
                style={[styles.unitTraitIcon, {width: 18, height: 18, tintColor: '#ffffff'}]}
                resizeMode={FastImage.resizeMode.contain}
              />
              {fromDetailScreen && (
                <Text style={{color: theme.colors.text, marginLeft: 6, fontSize: 12}}>
                  {item.name}
                </Text>
              )}
            </TouchableOpacity>
          ))}
          </>
  };

  if (origins.length === 0 && classes.length === 0) return null;
  return (
    <View style={[styles.unitTraitsContainer, fromDetailScreen && {justifyContent: 'flex-start', alignItems: 'flex-start', flexWrap: 'wrap'}]}>
      {renderTraitGroup(origins)}
      {renderTraitGroup(classes)}
    </View>
  );
};

export default UnitTraitsDisplay;