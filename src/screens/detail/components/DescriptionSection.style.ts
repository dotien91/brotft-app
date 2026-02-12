import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  text: TextStyle;
  loading: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginTop: 16,
      marginBottom: 8,
      paddingHorizontal: 6,
    },
    text: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text, // Tự động theo theme sáng/tối
      fontWeight: '400',
      textAlign: 'left',
    },
    loading: {
        position: 'absolute',
        right: 0,
        top: 0,
    }
  });
};