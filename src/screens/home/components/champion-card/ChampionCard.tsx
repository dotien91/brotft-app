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

  const {name, description, cost, set, traits, imageUrl} = data;

  const renderHeader = () => (
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

  const renderTraits = () => {
    if (!traits || traits.length === 0) return null;
    return (
      <View style={styles.traitsContainer}>
        <Icon
          name="users"
          type={IconType.FontAwesome}
          color={colors.text}
        />
        <Text style={styles.valueTextStyle} numberOfLines={1}>
          {traits.join(', ')}
        </Text>
      </View>
    );
  };

  const renderImage = () => {
    if (!imageUrl) return null;
    return (
      <Image
        source={{uri: imageUrl}}
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
          {renderTraits()}
        </View>
      </View>
    </RNBounceable>
  );
};

export default ChampionCard;

