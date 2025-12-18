import React, {useMemo} from 'react';
import {View, ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import Text from '@shared-components/text-wrapper/TextWrapper';
import createStyles from './EmptyList.style';

interface EmptyListProps {
  message: string;
  iconName?: string;
  iconType?: IconType;
  iconSize?: number;
  style?: ViewStyle;
  textStyle?: ViewStyle;
}

const EmptyList: React.FC<EmptyListProps> = ({
  message,
  iconName = 'information-circle-outline',
  iconType = IconType.MaterialIcons,
  iconSize = 48,
  style,
  textStyle,
}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.container, style]}>
      {/* <Icon
        name={iconName}
        type={iconType}
        color={colors.placeholder}
        size={iconSize}
      /> */}
      <Text h4 color={colors.placeholder} style={[styles.text, textStyle]}>
        {message}
      </Text>
    </View>
  );
};

export default EmptyList;

