import {StyleSheet, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  webView: ViewStyle;
  loadingContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    webView: {
      flex: 1,
      backgroundColor: colors.background,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
};

