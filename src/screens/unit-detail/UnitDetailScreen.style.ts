import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  heroSection: ViewStyle;
  heroImage: ImageStyle;
  heroOverlay: ViewStyle;
  heroContent: ViewStyle;
  unitHeader: ViewStyle;
  unitAvatarContainer: ViewStyle;
  unitInfo: ViewStyle;
  unitName: TextStyle;
  unitNameRow: ViewStyle;
  unlockRow: ViewStyle;
  unlockIcon: ImageStyle;
  unlockText: TextStyle;
  traitsRow: ViewStyle;
  traitBadge: ViewStyle;
  traitIcon: ImageStyle;
  traitText: TextStyle;
  costBadgeContainer: ViewStyle;
  costBadgeText: TextStyle;
  unitStatsSection: ViewStyle;
  statsRow: ViewStyle;
  statItem: ViewStyle;
  statItemHeader: ViewStyle;
  statItemLabel: TextStyle;
  statItemValue: TextStyle;
  abilitySection: ViewStyle;
  sectionTitle: TextStyle;
  abilityCard: ViewStyle;
  abilityHeader: ViewStyle;
  abilityIconContainer: ViewStyle;
  abilityIcon: ImageStyle;
  abilityInfo: ViewStyle;
  abilityName: TextStyle;
  abilityMeta: ViewStyle;
  abilityMetaText: TextStyle;
  abilityDescription: TextStyle;
  abilityVariables: ViewStyle;
  variableItem: ViewStyle;
  variableName: TextStyle;
  variableValue: TextStyle;
  unlockSection: ViewStyle;
  unlockCard: ViewStyle;
  augmentsSection: ViewStyle;
  augmentCard: ViewStyle;
  augmentHeader: ViewStyle;
  augmentIconContainer: ViewStyle;
  augmentIcon: ImageStyle;
  augmentItemBadges: ViewStyle;
  augmentItemBadge: ImageStyle;
  augmentInfo: ViewStyle;
  augmentName: TextStyle;
  augmentStats: ViewStyle;
  augmentStat: ViewStyle;
  augmentStatText: TextStyle;
  augmentDescription: TextStyle;
  loadingContainer: ViewStyle;
  loadingText: TextStyle;
  errorContainer: ViewStyle;
  errorText: TextStyle;
  errorDescription: TextStyle;
  retryButton: ViewStyle;
  unitTraitsContainer: ViewStyle;
  unitTraitsGroup: ViewStyle;
  unitTraitItem: ViewStyle;
  unitTraitIcon: ImageStyle;
  referenceCompositionsSection: ViewStyle;
  compositionsList: ViewStyle;
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
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      paddingTop: 60,
      paddingBottom: 16,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card + 'CC',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 40,
    },
    heroSection: {
      position: 'relative',
      height: 220,
    },
    heroImage: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.blackOverlay,
    },
    heroContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 12,
    },
    unitHeader: {
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    unitAvatarContainer: {
      marginRight: 12,
      marginBottom: 4,
    },
    unitInfo: {
      flex: 1,
    },
    unitNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    unitName: {
      fontSize: 24,
      marginBottom: 4,
      letterSpacing: -0.5,
      color: colors.text,
      textShadowColor: colors.shadow,
      textShadowOffset: {width: 0, height: 2},
      textShadowRadius: 4,
    },
    unlockRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 6,
    },
    unlockIcon: {
      width: 16,
      height: 16,
    },
    unlockText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
      textShadowColor: colors.shadow,
      textShadowOffset: {width: 0, height: 1},
      textShadowRadius: 2,
    },
    traitsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 6,
    },
    traitBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#252836',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#3a3d4a',
      gap: 4,
    },
    traitIcon: {
      width: 14,
      height: 14,
    },
    traitText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.primary,
      flexShrink: 1,
    },
    costBadgeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '26',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      alignSelf: 'flex-start',
      gap: 6,
      borderWidth: 1,
      borderColor: colors.primary + '4D',
      shadowColor: colors.primary,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
    },
    costBadgeText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.primary,
      letterSpacing: 0.3,
    },
    unitStatsSection: {
      paddingBottom: 16,
      paddingTop: 16,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 8,
    },
    statItem: {
      flex: 1,
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    statItemHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    statItemLabel: {
      fontSize: 10,
      color: colors.placeholder,
    },
    statItemValue: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    abilitySection: {
    },
    sectionTitle: {
      fontSize: 18,
      marginBottom: 12,
      letterSpacing: -0.3,
      color: colors.text,
      fontWeight: 'bold',
    },
    abilityCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    abilityHeader: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    abilityIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 10,
      overflow: 'hidden',
      marginRight: 12,
      borderWidth: 2,
      borderColor: colors.highlight,
    },
    abilityIcon: {
      width: '100%',
      height: '100%',
    },
    abilityInfo: {
      flex: 1,
    },
    abilityName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    abilityMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    abilityMetaText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.placeholder,
    },
    abilityDescription: {
      fontSize: 12,
      lineHeight: 18,
      color: colors.placeholder,
      marginBottom: 10,
    },
    abilityVariables: {
      marginTop: 8,
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: colors.borderColor,
    },
    variableItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 4,
    },
    variableName: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.placeholder,
    },
    variableValue: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.text,
    },
    unlockSection: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    unlockCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginTop: 4,
    },
    augmentsSection: {
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    augmentCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    augmentHeader: {
      flexDirection: 'row',
    },
    augmentIconContainer: {
      marginRight: 12,
      position: 'relative',
      width: 50,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    augmentIcon: {
      width: 50,
      height: 50,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.highlight,
    },
    augmentItemBadges: {
      position: 'absolute',
      bottom: -4,
      left: '50%',
      transform: [{translateX: -18}], // Half of (18*2 + 2 gap) = 19, but use 18 for better centering
      flexDirection: 'row',
      gap: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    augmentItemBadge: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      overflow: 'hidden',
    },
    augmentInfo: {
      flex: 1,
    },
    augmentName: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    augmentStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 6,
    },
    augmentStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    augmentStatText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
    },
    augmentDescription: {
      fontSize: 11,
      lineHeight: 16,
      color: colors.text,
      marginBottom: 4,
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
    unitTraitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    unitTraitsGroup: {
      flexDirection: 'row',
      gap: 6,
    },
    unitTraitItem: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    unitTraitIcon: {
      width: 18,
      height: 18,
    },
    referenceCompositionsSection: {
      paddingTop: 24,
    },
    compositionsList: {
    },
  });
};

