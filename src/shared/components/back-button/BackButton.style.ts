import {StyleSheet, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  backButton: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    backButton: {
      width: 36,
      height: 33,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

