import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftUnit} from '@services/models/tft-unit';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitAvatarUrl} from '../../../../utils/metatft';
import createStyles from './GuideUnitItem.style';
import useStore from '@services/zustand/store';
import LocalStorage from '@services/local-storage';
import {getLocaleFromLanguage} from '@services/api/data';
import UnitCostBadge from '@screens/detail/components/UnitCostBadge';
import TraitItem from '@screens/detail/components/TraitItem';
import ThreeStars from '@shared-components/three-stars/ThreeStars';

interface GuideUnitItemProps {
  data: ITftUnit;
  onPress: () => void;
  compact?: boolean; // If true, only show avatar, name and cost (hide traits)
}

const GuideUnitItem: React.FC<GuideUnitItemProps> = ({data, onPress, compact = false}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);
  const [localizedTraits, setLocalizedTraits] = useState<Array<{name: string; apiName?: string; id?: string}>>([]);

  const {name, cost, traits, icon, squareIcon, apiName} = data;

  // Get localized name from storage
  useEffect(() => {
    if (!data || !language) {
      setLocalizedName(null);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) {
        setLocalizedName(null);
        return;
      }

      const unitsData = JSON.parse(unitsDataString);
      let localizedUnit: any = null;

      // Handle both array and object formats
      if (Array.isArray(unitsData)) {
        // If it's an array, find the unit
        localizedUnit = unitsData.find((localUnit: any) => {
          // Try to match by apiName first
          if (data.apiName && localUnit.apiName === data.apiName) {
            return true;
          }
          // Fallback to name matching (case insensitive)
          if (data.name && localUnit.name) {
            return data.name.toLowerCase() === localUnit.name.toLowerCase();
          }
          // Try characterName matching
          if (data.characterName && localUnit.characterName) {
            return data.characterName.toLowerCase() === localUnit.characterName.toLowerCase();
          }
          return false;
        });
      } else if (typeof unitsData === 'object' && unitsData !== null) {
        // If it's an object, try to find by apiName as key first
        if (data.apiName && unitsData[data.apiName]) {
          localizedUnit = unitsData[data.apiName];
        } else {
          // Otherwise, search through object values
          const unitsArray = Object.values(unitsData) as any[];
          localizedUnit = unitsArray.find((localUnit: any) => {
            // Try to match by apiName first
            if (data.apiName && localUnit.apiName === data.apiName) {
              return true;
            }
            // Fallback to name matching (case insensitive)
            if (data.name && localUnit.name) {
              return data.name.toLowerCase() === localUnit.name.toLowerCase();
            }
            // Try characterName matching
            if (data.characterName && localUnit.characterName) {
              return data.characterName.toLowerCase() === localUnit.characterName.toLowerCase();
            }
            return false;
          });
        }
      }

      if (localizedUnit && localizedUnit.name) {
        setLocalizedName(localizedUnit.name);
      } else {
        setLocalizedName(null);
      }
    } catch (error) {
      console.error('Error loading localized unit name:', error);
      setLocalizedName(null);
    }
  }, [data, language]);

  // Get localized traits from storage - use same approach as TraitsSection
  useEffect(() => {
    if (!data || !language) {
      setLocalizedTraits([]);
      return;
    }

    try {
      const locale = getLocaleFromLanguage(language);
      const unitsKey = `data_units_${locale}`;
      const unitsDataString = LocalStorage.getString(unitsKey);
      
      if (!unitsDataString) {
        setLocalizedTraits((traits || []).map(t => ({name: typeof t === 'string' ? t : String(t)})));
        return;
      }

      const unitsData = JSON.parse(unitsDataString);
      let localizedUnit: any = null;

      // Find localized unit data first
      if (Array.isArray(unitsData)) {
        localizedUnit = unitsData.find((localUnit: any) => {
          if (apiName && localUnit.apiName === apiName) {
            return true;
          }
          if (name && localUnit.name) {
            return name.toLowerCase() === localUnit.name.toLowerCase();
          }
          return false;
        });
      } else if (typeof unitsData === 'object' && unitsData !== null) {
        if (apiName && unitsData[apiName]) {
          localizedUnit = unitsData[apiName];
        } else {
          const unitsArray = Object.values(unitsData) as any[];
          localizedUnit = unitsArray.find((localUnit: any) => {
            if (apiName && localUnit.apiName === apiName) {
              return true;
            }
            if (name && localUnit.name) {
              return name.toLowerCase() === localUnit.name.toLowerCase();
            }
            return false;
          });
        }
      }

      // Get traits from localized unit data
      const unitTraits = localizedUnit?.traits || traits || [];
      const traitsArray = Array.isArray(unitTraits) ? unitTraits : [];

      if (traitsArray.length === 0) {
        setLocalizedTraits([]);
        return;
      }

      // Get trait details from local storage
      const traitsKey = `data_traits_${locale}`;
      const traitsDataString = LocalStorage.getString(traitsKey);
      
      if (!traitsDataString) {
        setLocalizedTraits(traitsArray.map(t => ({name: typeof t === 'string' ? t : String(t)})));
        return;
      }

      const traitsData = JSON.parse(traitsDataString);
      const localized: Array<{name: string; apiName?: string; id?: string}> = [];

      traitsArray.forEach((traitName: string) => {
        const traitNameStr = typeof traitName === 'string' ? traitName : String(traitName);
        let traitDetail: any = null;

        // Find trait detail from local storage - use same logic as GuideTraitItem
        if (traitsData) {
          if (Array.isArray(traitsData)) {
            traitDetail = traitsData.find((trait: any) => 
              trait.name === traitNameStr || trait.apiName === traitNameStr
            );
          } else if (typeof traitsData === 'object' && traitsData !== null) {
            traitDetail = Object.values(traitsData).find((trait: any) => 
              trait.name === traitNameStr || trait.apiName === traitNameStr
            );
          }
        }

        localized.push({
          name: traitDetail?.name || traitNameStr, // Use localized name if available
          apiName: traitDetail?.apiName || traitNameStr,
          id: traitDetail?.id,
        });
      });

      setLocalizedTraits(localized);
    } catch (error) {
      console.error('Error loading localized traits:', error);
      setLocalizedTraits((traits || []).map(t => ({name: typeof t === 'string' ? t : String(t)})));
    }
  }, [data, traits, apiName, name, language]);

  // Get TFT unit avatar URL from metatft.com
  // Size: 64x64 for hexagon display (56px hexagon needs ~64px image)
  const getTftUnitAvatarUrl = () => {
    // Try API icon fields first
    if (icon && icon.startsWith('http')) {
      return icon;
    }
    if (squareIcon && squareIcon.startsWith('http')) {
      return squareIcon;
    }
    
    // Use metatft.com for avatar
    const unitKey = apiName || name || '';
    return getUnitAvatarUrl(unitKey, 64);
  };

  const imageUri = getTftUnitAvatarUrl();

  // Use localized traits if available, otherwise fallback to original traits
  const displayTraits = localizedTraits.length > 0 
    ? localizedTraits 
    : (traits || []).map(t => ({name: typeof t === 'string' ? t : String(t)}));

  // Get unit border color based on cost
  const getUnitCostBorderColor = (cost?: number): string => {
    if (!cost) return colors.border;
    switch (cost) {
      case 1:
        return '#c0c0c0'; // Xám/Trắng
      case 2:
        return '#4ade80'; // Xanh lá
      case 3:
        return '#60a5fa'; // Xanh dương
      case 4:
        return '#a78bfa'; // Tím
      case 5:
        return '#ffd700'; // Vàng (Huyền thoại)
      case 6:
        return '#ff6b35'; // Đỏ/Cam
      default:
        return colors.border;
    }
  };

  const hexSize = compact ? 48 : 56;

  if (compact) {
    // Compact mode: vertical layout like in composition detail
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.compactHexagonWrapper}>
          <View style={styles.compactHexagonBorderWrapper}>
            <View style={styles.compactHexagonBorder}>
              <Hexagon
                size={hexSize + 4}
                backgroundColor="transparent"
                borderColor={getUnitCostBorderColor(cost)}
                borderWidth={1}
              />
            </View>
            <View style={styles.compactHexagonInner}>
              <Hexagon
                size={hexSize}
                backgroundColor={colors.card}
                borderColor={getUnitCostBorderColor(cost)}
                borderWidth={2}
                imageUri={imageUri}>
                {/* 3 Stars icon */}
                {data.need3Star && (
                  <View style={[styles.compactTier3Icon, {
                    top: -8,
                    right: 5,
                  }]}>
                    <ThreeStars size={Math.max(hexSize * 0.6, 28)} color="#fbbf24" />
                  </View>
                )}
              </Hexagon>
            </View>
          </View>
        </View>
        {/* Name below hexagon with unlock icon */}
        <View style={styles.compactNameRow}>
          <Text style={styles.compactUnitName} numberOfLines={1}>
            {localizedName || name}
          </Text>
          {data.needUnlock && (
            <Image
              source={{uri: 'https://www.metatft.com/icons/unlock.png'}}
              style={styles.compactUnlockIconNextToName}
              resizeMode="contain"
            />
          )}
        </View>
        {/* Cost below name */}
        {cost !== null && cost !== undefined && (
          <View style={styles.compactCostContainer}>
            <UnitCostBadge cost={cost} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Full mode: horizontal layout with traits
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Hexagon Avatar */}
      <View style={styles.avatarContainer}>
        <Hexagon 
          size={56} 
          backgroundColor="#252836" 
          borderColor="#3a3d4a" 
          borderWidth={2}
          imageUri={imageUri}
        />
      </View>

      {/* Unit Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.unitName} numberOfLines={1}>
            {localizedName || name}
          </Text>
          {data.needUnlock && (
            <Image
              source={{uri: 'https://www.metatft.com/icons/unlock.png'}}
              style={styles.unlockIcon}
              resizeMode="contain"
            />
          )}
        </View>
        {cost !== null && cost !== undefined && (
          <UnitCostBadge cost={cost} />
        )}
      </View>

      {/* Traits - hide in compact mode */}
      {!compact && (
        <View style={styles.traitsContainer}>
          {displayTraits.slice(0, 3).map((trait, index) => (
            <TraitItem
              key={index}
              trait={trait}
              index={index}
              variant="badge"
              badgeStyle={styles.traitItem}
              badgeIconStyle={styles.traitIcon}
              badgeTextStyle={styles.traitText}
            />
          ))}
          {displayTraits.length > 3 && (
            <Text style={styles.traitMoreText}>+{displayTraits.length - 3}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GuideUnitItem;

