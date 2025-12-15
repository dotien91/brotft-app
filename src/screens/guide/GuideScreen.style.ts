import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  tabBar: ViewStyle;
  tab: ViewStyle;
  tabLabel: TextStyle;
  tabIndicator: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      letterSpacing: -0.5,
      color: colors.text,
      fontWeight: 'bold',
    },
    tabBar: {
      backgroundColor: colors.card,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    tab: {
      width: 'auto',
      paddingHorizontal: 16,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 0.2,
      textTransform: 'none',
    },
    tabIndicator: {
      backgroundColor: colors.primary,
      height: 3,
      borderRadius: 2,
    },
  });
};

