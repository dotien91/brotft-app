import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  titleTextStyle: TextStyle;
  buttonStyle: ViewStyle;
  buttonTextStyle: TextStyle;
  header: ViewStyle;
  contentContainer: ViewStyle;
  listContainer: ViewStyle;
  profilePicImageStyle: ImageStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  errorDescription: TextStyle;
  retryButton: ViewStyle;
  emptyContainer: ViewStyle;
  emptyText: TextStyle;
  footerLoader: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    titleTextStyle: {
      fontSize: 32,
    },
    buttonStyle: {
      height: 45,
      width: ScreenWidth * 0.9,
      marginTop: 32,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      shadowRadius: 5,
      shadowOpacity: 0.7,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },
    buttonTextStyle: {
      color: colors.white,
      fontWeight: '700',
    },
    header: {
      width: ScreenWidth * 0.9,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    contentContainer: {
      flex: 1,
      marginTop: 16,
    },
    listContainer: {
      marginTop: 8,
    },
    profilePicImageStyle: {
      height: 50,
      width: 50,
      borderRadius: 30,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      marginTop: 8,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    errorText: {
      marginTop: 8,
      fontWeight: '700',
    },
    errorDescription: {
      marginTop: 4,
      textAlign: 'center',
    },
    retryButton: {
      height: 45,
      paddingHorizontal: 24,
      marginTop: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      shadowRadius: 5,
      shadowOpacity: 0.7,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 3,
      },
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyText: {
      marginTop: 8,
    },
    footerLoader: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};
