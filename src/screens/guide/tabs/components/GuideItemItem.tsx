import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import type {ITftItem} from '@services/models/tft-item';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './GuideItemItem.style';

interface GuideItemItemProps {
  data: ITftItem;
  onPress: () => void;
}

const GuideItemItem: React.FC<GuideItemItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, desc, icon, composition, unique, tags} = data;

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
    
    // Fallback to Data Dragon
    const itemKey = data.apiName || name?.toLowerCase() || '';
    return `https://ddragon.leagueoflegends.com/cdn/14.15.1/img/tft-item/${itemKey}.png`;
  };

  const imageUri = getItemImageUrl();

  // Get components to display
  const displayComponents = composition || [];

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
        {desc && (
          <Text style={styles.itemDescription} numberOfLines={2}>
            {desc}
          </Text>
        )}
        {unique && (
          <View style={styles.uniqueBadge}>
            <Text style={styles.uniqueText}>Unique</Text>
          </View>
        )}
      </View>

      {/* Components */}
      {displayComponents.length > 0 && (
        <View style={styles.componentsContainer}>
          {displayComponents.slice(0, 2).map((component, index) => {
            const componentName = typeof component === 'string' 
              ? component 
              : '';
            
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

