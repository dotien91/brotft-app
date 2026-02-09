import React, {useMemo, useEffect, useState} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import * as NavigationService from 'react-navigation-helpers';
import {SCREENS} from '@shared-constants';
import {useTheme} from '@react-navigation/native';
import type {ITftUnit} from '@services/models/tft-unit';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitAvatarUrl} from '../../../../utils/metatft';
import getUnitAvatar from '../../../../utils/unit-avatar';
import {getUnitCostBorderColor as getUnitCostBorderColorUtil} from '../../../../utils/unitCost';
import createStyles from './GuideUnitItem.style';
import useStore from '@services/zustand/store';
import {getCachedUnits} from '@services/api/data';
import UnitCostBadge from '@screens/detail/components/UnitCostBadge';
import ThreeStars from '@shared-components/three-stars/ThreeStars';
import UnitTraitsDisplay from '@screens/unit-detail/components/UnitTraitsDisplay';

interface GuideUnitItemProps {
  data: ITftUnit;
  onPress?: () => void;
  compact?: boolean; // If true, only show avatar, name and cost (hide traits)
}

const GuideUnitItem: React.FC<GuideUnitItemProps> = ({data, compact = false, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const language = useStore((state) => state.language);
  const [localizedName, setLocalizedName] = useState<string | null>(null);

  

  const {name, cost, icon, squareIcon, apiName} = data;

  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Prefer apiName when available, fallback to id
    if (apiName) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitApiName: String(apiName)});
    } else if (data?.id) {
      NavigationService.push(SCREENS.UNIT_DETAIL, {unitId: String(data.id)});
    }
  };
  // Get localized name from storage
  useEffect(() => {
    if (!data || !language) {
      setLocalizedName(null);
      return;
    }

    try {
      const unitsData = getCachedUnits(language);
      const localizedUnit =
        (data.apiName && unitsData[data.apiName]) ||
        Object.values(unitsData).find(
          (localUnit: any) =>
            (data.apiName && localUnit.apiName === data.apiName) ||
            (data.name && localUnit.name && data.name.toLowerCase() === localUnit.name.toLowerCase()) ||
            (data.characterName && localUnit.characterName && data.characterName.toLowerCase() === localUnit.characterName.toLowerCase())
        );

      if (localizedUnit?.name) {
        setLocalizedName(localizedUnit.name);
      } else {
        setLocalizedName(null);
      }
    } catch (error) {
      console.error('Error loading localized unit name:', error);
      setLocalizedName(null);
    }
  }, [data, language]);

  // Get TFT unit avatar image source (local first, then URL)
  // Size: 64x64 for hexagon display (56px hexagon needs ~64px image)
  const getTftUnitAvatarSource = () => {
    // Try API icon fields first
    if (icon && icon.startsWith('http')) {
      return {local: null, uri: icon};
    }
    if (squareIcon && squareIcon.startsWith('http')) {
      return {local: null, uri: squareIcon};
    }
    
    // Use local image first, then fallback to metatft.com
    const unitKey = apiName || name || '';
    return getUnitAvatar(unitKey, 64);
  };

  const imageSource = getTftUnitAvatarSource();
  const imageUri = imageSource.local ? undefined : imageSource.uri;

  // Get unit border color based on cost
  const getUnitCostBorderColor = (cost?: number | null): string => {
    return getUnitCostBorderColorUtil(cost, colors.border || '#94a3b8');
  };

  const hexSize = compact ? 48 : 56;

  if (compact) {
    // Compact mode: vertical layout like in composition detail
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={handlePress} activeOpacity={0.7}>
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
                borderColor={getUnitCostBorderColor(cost)}
                borderWidth={2}
                imageUri={imageUri}
                imageSource={imageSource.local}>
                {/* 3 Stars icon */}
                {((data as any).need3Star || (cost <= 3 && (data as any).carry)) && (
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
        {/* Unlock icon - absolute top right */}
        {data.needUnlock && (
          <View style={styles.compactUnlockIconAbsolute}>
            <Image
              source={require('@assets/icons/unlock.png')}
              style={styles.compactUnlockIconNextToName}
              resizeMode="contain"
            />
          </View>
        )}
        {/* Name below hexagon */}
        <View style={styles.compactNameRow}>
          <Text style={styles.compactUnitName} numberOfLines={1}>
            {localizedName || name}
          </Text>
        </View>
 
      </TouchableOpacity>
    );
  }

  // Full mode: horizontal layout with traits
  const borderColor = getUnitCostBorderColor(cost);
  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
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
              borderColor={borderColor}
              borderWidth={2}
              imageUri={imageUri}
              imageSource={imageSource.local}
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

