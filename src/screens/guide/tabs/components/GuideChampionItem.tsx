import React, {useMemo} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import type {IChampion} from '@services/models/champion';
import type {ITrait} from '@services/models/trait';
import Text from '@shared-components/text-wrapper/TextWrapper';
import Hexagon from '@screens/detail/components/Hexagon';
import createStyles from './GuideChampionItem.style';

interface GuideChampionItemProps {
  data: IChampion;
  onPress: () => void;
}

const GuideChampionItem: React.FC<GuideChampionItemProps> = ({data, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, cost, traitDetails, traits, image, imageUrl} = data;

  // Get champion image URL from metatft.com
  const getChampionImageUrl = () => {
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
    
    // Use metatft.com for avatar (48x48)
    const championKey = data.key || name?.toLowerCase() || '';
    const formattedKey = championKey.startsWith('tft') ? championKey : `tft15_${championKey.toLowerCase()}`;
    return `https://cdn.metatft.com/cdn-cgi/image/width=48,height=48,format=auto/https://cdn.metatft.com/file/metatft/champions/${formattedKey}.png`;
  };

  const imageUri = getChampionImageUrl();

  // Get traits to display
  const displayTraits = traitDetails && traitDetails.length > 0
    ? traitDetails
    : traits || [];

  const isTraitObject = (trait: string | ITrait): trait is ITrait => {
    return typeof trait === 'object' && trait !== null && 'name' in trait;
  };

  const getTraitName = (trait: string | ITrait): string => {
    if (typeof trait === 'string') return trait;
    if (isTraitObject(trait)) return trait.name;
    return String(trait);
  };

  // Get trait icon based on type or default
  const getTraitIcon = (trait: string | ITrait) => {
    if (isTraitObject(trait)) {
      if (trait.type === 'origin') {
        return 'star';
      }
      if (trait.type === 'class') {
        return 'shield';
      }
    }
    return 'shield';
  };

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

      {/* Champion Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.championName} numberOfLines={1}>
          {name}
        </Text>
        <View style={styles.costContainer}>
          <Text style={styles.costText}>${cost}</Text>
        </View>
      </View>

      {/* Traits */}
      <View style={styles.traitsContainer}>
        {displayTraits.slice(0, 3).map((trait, index) => {
          const traitName = isTraitObject(trait) ? trait.name : getTraitName(trait);
          const iconName = getTraitIcon(trait);
          
          return (
            <View key={isTraitObject(trait) ? trait.id : index} style={styles.traitItem}>
              <Icon
                name={iconName}
                type={IconType.Ionicons}
                color={colors.primary}
                size={14}
              />
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

export default GuideChampionItem;

