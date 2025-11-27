import React, {useMemo} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import type {ITftUnit} from '@services/models/tft-unit';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from '@screens/detail/components/Hexagon';
import {getUnitAvatarUrl, getTraitIconUrl} from '../../../../utils/metatft';
import createStyles from './GuideUnitItem.style';

interface GuideUnitItemProps {
  data: ITftUnit;
  onPress: () => void;
}

const GuideUnitItem: React.FC<GuideUnitItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, cost, traits, icon, squareIcon, apiName} = data;

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

  // Get traits to display (TFT units have traits as string array)
  const displayTraits = traits || [];

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
        <Text style={styles.unitName} numberOfLines={1}>
          {name}
        </Text>
        {cost !== null && cost !== undefined && (
          <View style={styles.costContainer}>
            <Text style={styles.costText}>${cost}</Text>
          </View>
        )}
      </View>

      {/* Traits */}
      <View style={styles.traitsContainer}>
        {displayTraits.slice(0, 3).map((trait, index) => {
          const traitName = typeof trait === 'string' ? trait : String(trait);
          const traitIconUrl = getTraitIconUrl(traitName, 14);
          
          return (
            <View key={index} style={styles.traitItem}>
              {traitIconUrl ? (
                <Image
                  source={{uri: traitIconUrl}}
                  style={styles.traitIcon}
                  resizeMode="contain"
                />
              ) : (
                <Icon
                  name="shield"
                  type={IconType.Ionicons}
                  color={colors.primary}
                  size={14}
                />
              )}
              <Text style={styles.traitText} numberOfLines={1}>
                {traitName}
              </Text>
            </View>
          );
        })}
        {displayTraits.length > 3 && (
          <Text style={styles.traitMoreText}>+{displayTraits.length - 3}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GuideUnitItem;

