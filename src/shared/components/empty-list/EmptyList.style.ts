import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  text: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      color: colors.placeholder,
      marginTop: 12,
    },
  });
};

