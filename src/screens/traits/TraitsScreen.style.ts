import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  titleTextStyle: TextStyle;
  buttonStyle: ViewStyle;
  buttonTextStyle: TextStyle;
  header: ViewStyle;
  headerContainer: ViewStyle;
  contentContainer: ViewStyle;
  welcomeContainer: ViewStyle;
  welcomeTitle: TextStyle;
  welcomeSubtitle: TextStyle;
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
  filterContainer: ViewStyle;
  filterButton: ViewStyle;
  filterButtonActive: ViewStyle;
  filterText: TextStyle;
  filterTextActive: TextStyle;
  tabBar: ViewStyle;
  tabIndicator: ViewStyle;
  tabLabel: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: '#1a1d29',
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
    headerContainer: {
      width: '100%',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 0,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    contentContainer: {
      flex: 1,
      width: '100%',
    },
    welcomeContainer: {
      paddingVertical: 24,
      paddingHorizontal: 20,
      marginBottom: 12,
    },
    welcomeTitle: {
      fontSize: 32,
      fontWeight: '800',
      marginBottom: 6,
      letterSpacing: -0.5,
    },
    welcomeSubtitle: {
      fontSize: 15,
      opacity: 0.75,
      letterSpacing: 0.2,
      fontWeight: '500',
    },
    listContainer: {
      flex: 1,
      marginTop: 8,
    },
    profilePicImageStyle: {
      height: 48,
      width: 48,
      borderRadius: 24,
      borderWidth: 3,
      borderColor: colors.primary,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 4,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      opacity: 0.75,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
    errorContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    errorText: {
      marginTop: 20,
      fontSize: 22,
      fontWeight: '800',
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    errorDescription: {
      marginTop: 12,
      fontSize: 16,
      textAlign: 'center',
      opacity: 0.75,
      lineHeight: 24,
      letterSpacing: 0.2,
    },
    retryButton: {
      height: 52,
      paddingHorizontal: 36,
      marginTop: 32,
      borderRadius: 26,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary,
      shadowRadius: 12,
      shadowOpacity: 0.35,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      elevation: 5,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
    },
    emptyText: {
      marginTop: 16,
      fontSize: 17,
      opacity: 0.75,
      fontWeight: '500',
      letterSpacing: 0.3,
    },
    footerLoader: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      gap: 12,
    },
    filterButton: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: colors.placeholder + '20',
    },
    filterButtonActive: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      opacity: 0.7,
    },
    filterTextActive: {
      color: colors.primary,
      opacity: 1,
      fontWeight: '700',
    },
    tabBar: {
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.placeholder + '20',
      elevation: 0,
      shadowOpacity: 0,
      marginHorizontal: 20,
    },
    tabIndicator: {
      backgroundColor: colors.primary,
      height: 3,
      borderRadius: 2,
    },
    tabLabel: {
      fontSize: 14,
      fontWeight: '600',
      textTransform: 'none',
    },
  });
};

