import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {IItem} from '@services/models/item';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';

interface GuideItemItemProps {
  data: IItem;
  onPress: () => void;
}

const GuideItemItem: React.FC<GuideItemItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, desc, description, icon, image, imageUrl, composition, components, componentDetails, variableMatches} = data;

  // Get item image URL
  const getItemImageUrl = () => {
    // Try icon field first (from API)
    if (icon) {
      if (icon.startsWith('http')) {
        return icon;
      }
      if (icon.startsWith('/')) {
        return `http://localhost:3000${icon}`;
      }
    }
    
    if (image?.path) {
      if (image.path.startsWith('http')) {
        return image.path;
      }
      if (image.path.startsWith('/')) {
        return `http://localhost:3000${image.path}`;
      }
    }
    
    if (imageUrl) {
      return imageUrl;
    }
    
    // Fallback to Data Dragon
    const itemKey = data.apiName || name?.toLowerCase() || '';
    return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${itemKey}.png`;
  };

  const imageUri = getItemImageUrl();

  // Get components to display - prefer composition from API
  const displayComponents = composition || components || componentDetails || [];
  
  // Clean description - remove HTML tags and parse variableMatches
  const cleanDescription = (desc?: string, variableMatches?: IItem['variableMatches']) => {
    if (!desc) return null;
    
    let cleaned = desc;
    
    // Replace variableMatches first (before removing @ references)
    if (variableMatches && variableMatches.length > 0) {
      // Replace using full_match first (most accurate)
      variableMatches.forEach((match) => {
        const fullMatch = match.full_match;
        const value = match.value;
        
        if (fullMatch && value !== undefined) {
          // Escape special regex characters in full_match
          const escapedMatch = fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedMatch, 'g');
          cleaned = cleaned.replace(regex, String(value));
        } else if (match.match && value !== undefined) {
          // Fallback: use match field to create @match@ pattern
          const pattern = `@${match.match}@`;
          const escapedPattern = pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(escapedPattern, 'g');
          cleaned = cleaned.replace(regex, String(value));
        }
      });
    }
    
    // Remove HTML tags
    cleaned = cleaned.replace(/<[^>]*>/g, '');
    // Replace <br> with newline
    cleaned = cleaned.replace(/<br\s*\/?>/gi, ' ');
    // Remove remaining @TFTUnitProperty references that weren't matched
    cleaned = cleaned.replace(/@[^@]*@/g, '');
    // Clean up whitespace
    cleaned = cleaned.trim();
    return cleaned || null;
  };
  
  const displayDescription = cleanDescription(desc || description, variableMatches);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Item Icon */}
      <View style={styles.iconContainer}>
        <Image
          source={{uri: imageUri}}
          style={styles.icon}
          resizeMode="cover"
        />
      </View>

      {/* Item Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.itemName} numberOfLines={1}>
          {name || '---'}
        </Text>
        {displayDescription && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {displayDescription}
          </Text>
        )}
      </View>

      {/* Components */}
      {displayComponents.length > 0 && (
        <View style={styles.componentsContainer}>
          {displayComponents.slice(0, 2).map((component, index) => {
            const componentName = typeof component === 'string' 
              ? component 
              : (component as IItem)?.name || '';
            
            return (
              <View key={index} style={styles.componentBadge}>
                <Text style={styles.componentText} numberOfLines={1}>
                  {componentName}
                </Text>
              </View>
            );
          })}
          {displayComponents.length > 2 && (
            <Text style={styles.componentMoreText}>+{displayComponents.length - 2}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default GuideItemItem;

