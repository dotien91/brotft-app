import React, {useMemo} from 'react';
import type {StyleProp, ViewStyle} from 'react-native';
import {View} from 'react-native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import createStyles from './TraitCard.style';
import RNBounceable from '@freakycoder/react-native-bounceable';
import {useTheme} from '@react-navigation/native';
import type {ITrait} from '@services/models/trait';
import Text from '@shared-components/text-wrapper/TextWrapper';

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ITraitCardProps {
  style?: CustomStyleProp;
  data: ITrait;
  onPress: () => void;
}

const TraitCard: React.FC<ITraitCardProps> = ({
  style,
  data,
  onPress,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  const {name, description, type, key, tiers, set, champions} = data;

  const renderHeader = () => (
    <>
      <View style={styles.headerRow}>
        <Text h4 bold color={colors.text}>
          {name}
        </Text>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                type === 'origin'
                  ? colors.primary + '20'
                  : colors.danger + '20',
              borderColor:
                type === 'origin'
                  ? colors.primary + '40'
                  : colors.danger + '40',
            },
          ]}>
          <Text
            style={[
              styles.typeText,
              {
                color:
                  type === 'origin' ? colors.primary : colors.danger,
              },
            ]}>
            {type === 'origin' ? 'Tộc' : 'Hệ'}
          </Text>
        </View>
      </View>
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

  const renderKey = () => (
    <View style={styles.keyContainer}>
      <Icon
        name="key"
        type={IconType.Ionicons}
        color={colors.text}
        size={16}
      />
      <Text style={styles.valueTextStyle}>{key}</Text>
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
          size={16}
        />
        <Text style={styles.valueTextStyle}>{set}</Text>
      </View>
    );
  };

  const renderChampionsCount = () => (
    <View style={styles.championsContainer}>
      <Icon
        name="people"
        type={IconType.Ionicons}
        color={colors.text}
        size={16}
      />
      <Text style={styles.valueTextStyle}>
        {champions?.length || 0} champions
      </Text>
    </View>
  );

  const renderTiers = () => {
    if (!tiers || tiers.length === 0) return null;
    return (
      <View style={styles.tiersContainer}>
        <Text h5 bold color={colors.text} style={styles.tiersTitle}>
          Cấp độ:
        </Text>
        {tiers.map((tier, index) => (
          <View key={index} style={styles.tierItem}>
            <View style={styles.tierCountBadge}>
              <Text style={styles.tierCountText}>{tier.count}</Text>
            </View>
            <Text style={styles.tierEffectText}>{tier.effect}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <RNBounceable style={[styles.container, style]} onPress={onPress}>
      <View style={styles.contentWrapper}>
        {renderHeader()}
        <View style={styles.contentContainer}>
          {renderKey()}
          {renderSet()}
          {renderChampionsCount()}
        </View>
        {renderTiers()}
      </View>
    </RNBounceable>
  );
};

export default TraitCard;


