import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  errorDescription: TextStyle;
  retryButton: ViewStyle;
  nameSection: ViewStyle;
  itemName: TextStyle;
  mainContent: ViewStyle;
  itemIconContainer: ViewStyle;
  itemIcon: ImageStyle;
  rightContent: ViewStyle;
  recipeSection: ViewStyle;
  recipeLabel: TextStyle;
  recipeRow: ViewStyle;
  componentIconContainer: ViewStyle;
  componentIcon: ImageStyle;
  plusSign: TextStyle;
  statsSection: ViewStyle;
  statItem: ViewStyle;
  statIcon: ImageStyle;
  statValue: TextStyle;
  descriptionSection: ViewStyle;
  descriptionText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: '#1a1d29',
    },
    safeArea: {
      flex: 1,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingHorizontal: 20,
      paddingTop: 60,
      paddingBottom: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(37, 40, 54, 0.8)',
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
    },
    nameSection: {
      padding: 20,
      paddingTop: 100,
      paddingBottom: 16,
    },
    itemName: {
      fontSize: 24,
      letterSpacing: -0.5,
    },
    mainContent: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 16,
    },
    itemIconContainer: {
      width: 120,
      height: 120,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#252836',
      borderWidth: 2,
      borderColor: '#3a3d4a',
    },
    itemIcon: {
      width: '100%',
      height: '100%',
    },
    rightContent: {
      flex: 1,
      gap: 16,
    },
    recipeSection: {
      gap: 8,
    },
    recipeLabel: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    recipeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    componentIconContainer: {
      width: 48,
      height: 48,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#1a1d29',
      borderWidth: 1,
      borderColor: '#2a2d3a',
    },
    componentIcon: {
      width: '100%',
      height: '100%',
    },
    plusSign: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    statsSection: {
      gap: 8,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    statIcon: {
      width: 20,
      height: 20,
    },
    statValue: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    descriptionSection: {
      padding: 20,
      paddingTop: 0,
    },
    descriptionText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
  });
};

