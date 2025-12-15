import React, {useMemo, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import type {ITftTrait} from '@services/models/tft-trait';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import createStyles from './GuideTraitItem.style';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';

interface GuideTraitItemProps {
  data: ITftTrait;
  onPress: () => void;
}

const GuideTraitItem: React.FC<GuideTraitItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedDesc, setLocalizedDesc] = useState<string | null>(null);

  const {name, desc, icon, apiName, units} = data;

  // Get localized trait name and description from storage
  useEffect(() => {
    if (!name || !apiName || !language) {
      setLocalizedName(null);
      setLocalizedDesc(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);
      
      if (!traitsDataString) {
        setLocalizedName(null);
        setLocalizedDesc(null);
        return;
      }

      const traitsData = JSON.parse(traitsDataString);
      let traitDetail: any = null;

      // Find trait detail from local storage
      if (traitsData) {
        if (Array.isArray(traitsData)) {
          traitDetail = traitsData.find((trait: any) => 
            trait.name === name || trait.apiName === apiName || trait.apiName === name
          );
        } else if (typeof traitsData === 'object' && traitsData !== null) {
          traitDetail = Object.values(traitsData).find((trait: any) => 
            trait.name === name || trait.apiName === apiName || trait.apiName === name
          );
        }
      }

      if (traitDetail) {
        setLocalizedName(traitDetail.name || null);
        setLocalizedDesc(traitDetail.desc || traitDetail.description || null);
      } else {
        setLocalizedName(null);
        setLocalizedDesc(null);
      }
    } catch (error) {
      console.error('Error loading localized trait:', error);
      setLocalizedName(null);
      setLocalizedDesc(null);
    }
  }, [name, apiName, language]);

  // Get trait icon URL
  const getTraitIcon = () => {
    if (icon && icon.startsWith('http')) {
      return icon;
    }
    
    // Use metatft.com for trait icon
    return getTraitIconUrl(apiName || name, 48);
  };

  const traitIconUrl = getTraitIcon();

  // Get units count
  const unitsCount = units?.length || 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Trait Icon */}
      <View style={styles.iconContainer}>
        {traitIconUrl ? (
          <Image
            source={{uri: traitIconUrl}}
            style={styles.traitIcon}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.iconPlaceholder}>
            <Icon
              name="shield"
              type={IconType.Ionicons}
              color={colors.primary}
              size={32}
            />
          </View>
        )}
      </View>

      {/* Trait Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.traitName} numberOfLines={1}>
          {localizedName || name}
        </Text>
        {(localizedDesc || desc) && (
          <Text style={styles.traitDesc} numberOfLines={2}>
            {localizedDesc || desc}
          </Text>
        )}
        {unitsCount > 0 && (
          <View style={styles.unitsContainer}>
            <Icon
              name="people"
              type={IconType.Ionicons}
              color={colors.placeholder}
              size={12}
            />
            <Text style={styles.unitsText}>{unitsCount} units</Text>
          </View>
        )}
      </View>

   
    </TouchableOpacity>
  );
};

export default GuideTraitItem;

