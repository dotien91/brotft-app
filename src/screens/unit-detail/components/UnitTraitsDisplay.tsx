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

  useEffect(() => {
    if (!unit || !language) return;

    try {
      const unitsData = getCachedUnits(language);
      const traitsData = getCachedTraits(language);
      if (Object.keys(unitsData).length === 0 || Object.keys(traitsData).length === 0) return;

      const unitsArray = Object.values(unitsData);
      const localizedUnit: any = unitsArray.find((u: any) =>
        u.apiName === unit.apiName || u.name === unit.name
      );

      const traitNamesToFind = localizedUnit?.traits || unit.traits;
      if (!traitNamesToFind || !Array.isArray(traitNamesToFind)) {
        setOrigins([]);
        setClasses([]);
        return;
      }

      const traitsMap = new Map();
      Object.values(traitsData).forEach((t: any) => {
        if (t.apiName) traitsMap.set(t.apiName.toLowerCase(), t);
        if (t.name) traitsMap.set(t.name.toLowerCase(), t);
      });

      const oList: TraitInfo[] = [];
      const cList: TraitInfo[] = [];

      traitNamesToFind.forEach((tName: string) => {
        const trait = traitsMap.get(tName.toLowerCase());
        if (trait) {
          const info = {
            name: trait.name || tName,
            apiName: trait.apiName || tName,
            id: trait.id || trait.apiName,
          };
          // Phân loại dựa trên type, mặc định nếu không có type thì cho vào Class
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
      console.log('Error loading traits:', e);
      setOrigins([]);
      setClasses([]);
    }
  }, [unit, language]);

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