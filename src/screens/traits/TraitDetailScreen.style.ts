import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';

interface Style {
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  headerSection: ViewStyle;
  typeIndicator: ViewStyle;
  content: ViewStyle;
  titleSection: ViewStyle;
  title: TextStyle;
  badgesRow: ViewStyle;
  typeBadge: ViewStyle;
  typeBadgeText: TextStyle;
  badge: ViewStyle;
  badgeSecondary: ViewStyle;
  badgeText: TextStyle;
  badgeTextSecondary: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  description: TextStyle;
  tierCard: ViewStyle;
  tierHeader: ViewStyle;
  tierCountBadge: ViewStyle;
  tierCountText: TextStyle;
  tierCountLabel: TextStyle;
  tierEffectContainer: ViewStyle;
  tierEffectText: TextStyle;
  championsContainer: ViewStyle;
  championBadge: ViewStyle;
  championText: TextStyle;
  championsNote: TextStyle;
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
      backgroundColor: '#1a1d29',
    },
    header: {
      width: '100%',
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: '#252836',
      borderBottomWidth: 1,
      borderBottomColor: '#2a2d3a',
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: '#1a1d29',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: '#2a2d3a',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    headerSection: {
      width: '100%',
      alignItems: 'center',
      paddingVertical: 32,
      paddingTop: 40,
    },
    typeIndicator: {
      width: 120,
      height: 120,
      borderRadius: 60,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    content: {
      padding: 24,
      paddingTop: 20,
    },
    titleSection: {
      marginBottom: 24,
      alignItems: 'center',
    },
    title: {
      fontSize: 36,
      marginBottom: 20,
      letterSpacing: -0.5,
      textAlign: 'center',
    },
    badgesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginHorizontal: -6,
    },
    typeBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 20,
      marginHorizontal: 6,
      marginBottom: 10,
      borderWidth: 2,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    typeBadgeText: {
      marginLeft: 8,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.3,
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
      marginBottom: 32,
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
    tierCard: {
      backgroundColor: '#252836',
      borderRadius: 16,
      padding: 20,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#2a2d3a',
    },
    tierHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    tierCountBadge: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 20,
      shadowColor: colors.primary,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    tierCountText: {
      color: colors.white,
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 2,
    },
    tierCountLabel: {
      color: colors.white,
      fontSize: 11,
      fontWeight: '600',
      opacity: 0.9,
    },
    tierEffectContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#1a1d29',
      padding: 16,
      borderRadius: 12,
    },
    tierEffectText: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
      lineHeight: 22,
      fontWeight: '600',
    },
    championsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
      marginBottom: 12,
    },
    championBadge: {
      backgroundColor: '#252836',
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#2a2d3a',
      marginHorizontal: 6,
      marginBottom: 10,
      minWidth: ScreenWidth * 0.4,
    },
    championContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    championCostBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    championCostText: {
      marginLeft: 4,
      fontSize: 11,
      fontWeight: '700',
      color: colors.primary,
    },
    championText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      letterSpacing: 0.3,
      flex: 1,
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
      minWidth: 80,
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

