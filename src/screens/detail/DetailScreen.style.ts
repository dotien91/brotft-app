import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';

interface Style {
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  heroImage: ImageStyle;
  content: ViewStyle;
  titleSection: ViewStyle;
  title: TextStyle;
  badgesRow: ViewStyle;
  badge: ViewStyle;
  badgeSecondary: ViewStyle;
  badgeText: TextStyle;
  badgeTextSecondary: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  description: TextStyle;
  traitsContainer: ViewStyle;
  traitBadge: ViewStyle;
  traitText: TextStyle;
  infoRow: ViewStyle;
  infoLabel: TextStyle;
  infoValue: TextStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  errorDescription: TextStyle;
  retryButton: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
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
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    heroImage: {
      width: '100%',
      height: 380,
      backgroundColor: colors.placeholder + '40',
    },
    content: {
      padding: 24,
      paddingTop: 20,
    },
    titleSection: {
      marginBottom: 24,
    },
    title: {
      fontSize: 36,
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    badgesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginHorizontal: 6,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    badgeSecondary: {
      backgroundColor: colors.placeholder + '15',
      borderColor: colors.placeholder + '25',
    },
    badgeText: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: '700',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    badgeTextSecondary: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.3,
    },
    section: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 22,
      marginBottom: 16,
      letterSpacing: -0.3,
    },
    description: {
      fontSize: 17,
      lineHeight: 26,
      opacity: 0.85,
      letterSpacing: 0.2,
    },
    traitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
    },
    traitBadge: {
      backgroundColor: colors.primary + '12',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: colors.primary + '25',
      marginHorizontal: 6,
      marginBottom: 10,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 1,
    },
    traitText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: 0.3,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 8,
      paddingHorizontal: 4,
    },
    infoLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
      marginRight: 12,
      minWidth: 60,
      letterSpacing: 0.2,
    },
    infoValue: {
      fontSize: 15,
      color: colors.placeholder,
      flex: 1,
      fontWeight: '500',
      letterSpacing: 0.2,
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
  });
};
