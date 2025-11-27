import React, {useMemo} from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import type {ITftTrait} from '@services/models/tft-trait';
import Text from '@shared-components/text-wrapper/TextWrapper';
import {getTraitIconUrl} from '../../../../utils/metatft';
import createStyles from './GuideTraitItem.style';

interface GuideTraitItemProps {
  data: ITftTrait;
  onPress: () => void;
}

const GuideTraitItem: React.FC<GuideTraitItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, desc, icon, apiName, units} = data;

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
          {name}
        </Text>
        {desc && (
          <Text style={styles.traitDesc} numberOfLines={2}>
            {desc}
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

