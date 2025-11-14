import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  listContent: ViewStyle;
  scrollContent: ViewStyle;
  centerContainer: ViewStyle;
  centerText: TextStyle;
  comingSoonTitle: TextStyle;
  footerLoader: ViewStyle;
  footerText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    listContent: {
      paddingBottom: 20,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 60,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    centerText: {
      marginTop: 16,
      fontSize: 16,
      opacity: 0.75,
      fontWeight: '500',
      letterSpacing: 0.3,
      textAlign: 'center',
    },
    comingSoonTitle: {
      fontSize: 24,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    footerLoader: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    footerText: {
      marginTop: 8,
      fontSize: 14,
    },
  });
};

