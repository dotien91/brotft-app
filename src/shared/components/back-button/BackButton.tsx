import React from 'react';
import {ViewStyle} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Icon, {IconType} from 'react-native-dynamic-vector-icons';
import * as NavigationService from 'react-navigation-helpers';
import RNBounceable from '@freakycoder/react-native-bounceable';
import createStyles from './BackButton.style';

interface BackButtonProps {
  style?: ViewStyle;
  onPress?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({style, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      NavigationService.goBack();
    }
  };

  return (
    <RNBounceable style={[styles.backButton, style]} onPress={handlePress}>
      <Icon
        name="arrow-back"
        type={IconType.Ionicons}
        color={colors.text}
        size={24}
      />
    </RNBounceable>
  );
};

export default BackButton;

