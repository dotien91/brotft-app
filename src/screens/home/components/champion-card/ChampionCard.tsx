import React, {useMemo} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View, Image} from 'react-native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './ChampionCard.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import type {IChampion} from '@services/models/champion';
import Text from '@shared-components/text-wrapper/TextWrapper';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IChampionCardProps {
  style?: CustomStyleProp;
  data: IChampion;
  onPress: () => void;
}

const ChampionCard: React.FC<IChampionCardProps> = ({
  style,
  data,
  onPress,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, description, cost, set, imageUrl, image} = data;

  const renderHeader = () => {
    return (
      <>
        <Text h4 bold color={colors.text}>
          {name}
        </Text>
        {description && (
          <Text
            h5
            color={colors.placeholder}
            style={styles.descriptionTextStyle}>
            {description}
          </Text>
        )}
      </>
    );
  };

  const renderCost = () => (
    <View style={styles.costContainer}>
      <Icon
        name="diamond"
        type={IconType.FontAwesome}
        color={colors.primary}
      />
      <Text style={styles.valueTextStyle}>{cost}</Text>
    </View>
  );

  const renderSet = () => {
    if (!set) return null;
    return (
      <View style={styles.setContainer}>
        <Icon
          name="tag"
          type={IconType.FontAwesome}
          color={colors.text}
        />
        <Text style={styles.valueTextStyle}>{set}</Text>
      </View>
    );
  };


  const renderImage = () => {
    // Use image.path if available, otherwise fallback to imageUrl
    const imageSource = image?.path || imageUrl;
    if (!imageSource) return null;
    
    // If image.path is relative, may need to prepend base URL
    const imageUri = image?.path?.startsWith('http') 
      ? image.path 
      : image?.path?.startsWith('/') 
        ? `http://localhost:3000${image.path}`
        : imageUrl || imageSource;
    
    return (
      <Image
        source={{uri: imageUri}}
        style={styles.imageStyle}
        resizeMode="cover"
      />
    );
  };

  return (
    <RNBounceable style={[styles.container, style]} onPress={onPress}>
      {renderImage()}
      <View style={styles.contentWrapper}>
        {renderHeader()}
        <View style={styles.contentContainer}>
          {renderCost()}
          {renderSet()}
        </View>
      </View>
    </RNBounceable>
  );
};

export default ChampionCard;

