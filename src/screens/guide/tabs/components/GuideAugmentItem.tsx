import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftAugment} from '@services/models/tft-augment';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';
import {getAugmentIconUrlFromPath} from '../../../../utils/metatft';
import {parseAugmentDescription} from '../../../../shared/utils/parseAugmentDescription';

interface GuideAugmentItemProps {
  data: ITftAugment;
  onPress: () => void;
}

const GuideAugmentItem: React.FC<GuideAugmentItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, icon, stage, trait, unique, desc, tags, effects, variableMatches} = data;

  // Parse description with variables
  const parsedDescription = useMemo(() => {
    if (!desc) return null;
    return parseAugmentDescription(desc, effects, variableMatches);
  }, [desc, effects, variableMatches]);

  // Get augment image URL
  const getAugmentImageUrl = () => {
    // Try parsing icon path from API first (e.g., ASSETS/Maps/TFT/Icons/Augments/...)
    if (icon) {
      // If it's already a full URL, use it
      if (icon.startsWith('http')) {
        return icon;
      }
      
      // Try to parse icon path and get MetaTFT URL
      const metatftUrl = getAugmentIconUrlFromPath(icon);
      if (metatftUrl) {
        return metatftUrl;
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
        {/* Title and Tags */}
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 4, flexWrap: 'wrap'}}>
          <Text style={styles.itemName} numberOfLines={1}>
            {name || '---'}
          </Text>
          {(stage || trait || unique || (tags && tags.length > 0)) && (
            <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 8, flexWrap: 'wrap', gap: 6}}>
              {stage && (
                <View style={[styles.componentBadge, {backgroundColor: colors.card, borderColor: colors.border}]}>
                  <Text style={[styles.componentText, {color: colors.placeholder, fontSize: 11}]}>
                    {stage}
                  </Text>
                </View>
              )}
              {trait && (
                <View style={[styles.componentBadge, {backgroundColor: colors.primary + '20', borderColor: colors.primary + '40'}]}>
                  <Text style={[styles.componentText, {color: colors.primary, fontSize: 11}]}>
                    {trait}
                  </Text>
                </View>
              )}
              {unique && (
                <View style={[styles.componentBadge, {backgroundColor: colors.primary + '20', borderColor: colors.primary + '40'}]}>
                  <Text style={[styles.componentText, {color: colors.primary, fontSize: 11}]}>
                    Unique
                  </Text>
                </View>
              )}
              {tags && tags.length > 0 && tags.map((tag, index) => (
                <View 
                  key={index}
                  style={[styles.componentBadge, {backgroundColor: colors.card, borderColor: colors.border}]}>
                  <Text style={[styles.componentText, {color: colors.text, fontSize: 11}]}>
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        
        {/* Description */}
        {parsedDescription && (
          <Text style={styles.itemDescription}>
            {parsedDescription}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default GuideAugmentItem;

