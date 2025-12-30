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
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import UnitTraitsDisplay from '@screens/unit-detail/components/UnitTraitsDisplay';

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

  const {name, cost, icon, squareIcon, apiName} = data;
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

  // Get unit border color based on cost
  const getUnitCostBorderColor = (cost?: number | null): string => {
    if (!cost || cost === null) return colors.border;
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
                {(data as any).need3Star && (
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
              source={require('@assets/icons/unlock.png')}
              style={styles.compactUnlockIconNextToName}
              resizeMode="contain"
            />
          )}
        </View>
        {/* Cost below name */}
        {cost !== null && cost !== undefined && (
          <View style={styles.compactCostContainer}>
            <UnitCostBadge cost={cost as number} />
          </View>
        )}
      </TouchableOpacity>
    );
  }

  // Full mode: horizontal layout with traits
  const borderColor = getUnitCostBorderColor(cost);
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Hexagon Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.hexagonWrapper}>
          {/* Border hexagon */}
          <View style={styles.hexagonBorder}>
            <Hexagon
              size={60}
              backgroundColor="transparent"
              borderColor={borderColor}
              borderWidth={1}
            />
          </View>
          {/* Main hexagon with image */}
          <View style={styles.hexagonInner}>
            <Hexagon 
              size={56} 
              backgroundColor={colors.card}
              borderColor={borderColor}
              borderWidth={2}
              imageUri={imageUri}
            />
          </View>
        </View>
      </View>

      {/* Unit Info */}
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.unitName} numberOfLines={1}>
            {localizedName || name}
          </Text>
          {data.needUnlock && (
            <Image
              source={require('@assets/icons/unlock.png')}
              style={styles.unlockIcon}
              resizeMode="contain"
            />
          )}
        </View>
        {cost !== null && cost !== undefined && (
          <UnitCostBadge cost={cost as number} />
        )}
      </View>

      {/* Traits on the right */}
      <View style={styles.traitsContainer}>
        <UnitTraitsDisplay unit={data} />
      </View>

    </TouchableOpacity>
  );
};

export default React.memo(GuideUnitItem, (prevProps, nextProps) => {
  // Only re-render if data.id or compact changes, ignore onPress changes
  return prevProps.data?.id === nextProps.data?.id && prevProps.compact === nextProps.compact;
});

