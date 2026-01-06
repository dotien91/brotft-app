import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  header: ViewStyle;
  headerTitle: TextStyle;
  headerSpacer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      flex: 1,
      textAlign: 'center',
      marginHorizontal: 12,
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.3,
      color: colors.text,
    },
    headerSpacer: {
      width: 44,
    },
  });
};
