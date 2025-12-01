import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftAugment} from '@services/models/tft-augment';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';
import {API_BASE_URL} from '@shared-constants';

interface GuideAugmentItemProps {
  data: ITftAugment;
  onPress: () => void;
}

const GuideAugmentItem: React.FC<GuideAugmentItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, icon, stage, trait, unique} = data;

  // Get augment image URL
  const getAugmentImageUrl = () => {
    // Try icon field first (from API)
    if (icon) {
      if (icon.startsWith('http')) {
        return icon;
      }
      if (icon.startsWith('/')) {
        return `${API_BASE_URL}${icon}`;
      }
    }
    
    // Fallback - could use a default augment icon
    return null;
  };

  const imageUri = getAugmentImageUrl();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Augment Icon */}
      <View style={styles.iconContainer}>
        {imageUri ? (
          <Image
            source={{uri: imageUri}}
            style={styles.icon}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.icon, {backgroundColor: colors.primary + '20', alignItems: 'center', justifyContent: 'center'}]}>
            <Text style={{color: colors.primary, fontSize: 20}}>★</Text>
          </View>
        )}
      </View>

      {/* Augment Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {name || '---'}
        </Text>
        {(stage || trait || unique) && (
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap'}}>
            {stage && (
              <Text style={{fontSize: 11, color: colors.placeholder, marginRight: 6}}>
                {stage}
              </Text>
            )}
            {trait && (
              <Text style={{fontSize: 11, color: colors.primary, marginRight: 6}}>
                {trait}
              </Text>
            )}
            {unique && (
              <Text style={{fontSize: 11, color: colors.primary}}>
                Unique
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GuideAugmentItem;

