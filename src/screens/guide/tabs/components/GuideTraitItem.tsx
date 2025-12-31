import React, {useMemo, useState, useEffect} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import type {ITftTrait} from '@services/models/tft-trait';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import {parseTraitDescription} from '../../../../utils/traitParser';
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
  const [localizedEffects, setLocalizedEffects] = useState<any[] | null>(null);

  const {name, desc, icon, apiName, effects} = data;

  // Get localized trait name and description from storage
  useEffect(() => {
      if (!name || !apiName || !language) {
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
        return;
      }

      try {
        const locale = getLocaleFromLanguage(language);
        const traitsKey = `data_traits_${locale}`;
        const traitsDataString = LocalStorage.getString(traitsKey);
        
        if (!traitsDataString) {
          setLocalizedName(null);
          setLocalizedDesc(null);
          setLocalizedEffects(null);
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
          setLocalizedEffects(traitDetail.effects || null);
        } else {
          setLocalizedName(null);
          setLocalizedDesc(null);
          setLocalizedEffects(null);
        }
      } catch (error) {
        console.error('Error loading localized trait:', error);
        setLocalizedName(null);
        setLocalizedDesc(null);
        setLocalizedEffects(null);
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

  // Parse description if effects are available
  const displayDescription = useMemo(() => {
    const description = localizedDesc || desc;
    const traitEffects = localizedEffects || effects;
    
    if (!description) return null;
    
    if (traitEffects && traitEffects.length > 0) {
      return parseTraitDescription(description, traitEffects);
    }
    
    return description;
  }, [localizedDesc, desc, localizedEffects, effects]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Trait Icon and Name */}
      <View style={styles.headerRow}>
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
        <View style={styles.infoContainer}>
          <Text style={styles.traitName} numberOfLines={1}>
            {localizedName || name}
          </Text>
          {displayDescription && (
            <Text style={styles.traitDesc} numberOfLines={2}>
              {displayDescription}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(GuideTraitItem, (prevProps, nextProps) => {
  // Only re-render if data.id changes, ignore onPress changes
  return prevProps.data?.id === nextProps.data?.id;
});

