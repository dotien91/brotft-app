import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  topHeader: ViewStyle;
  compositionHeader: ViewStyle;
  compositionName: TextStyle;
  backButton: ViewStyle;
  sourceLabel: TextStyle;
  sourceLabelVertical: TextStyle;
  verticalLabelContainer: ViewStyle;
  titleSection: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  metaRow: ViewStyle;
  metaPill: ViewStyle;
  metaPillPrimary: ViewStyle;
  metaPillSecondary: ViewStyle;
  metaPillText: TextStyle;
  tierBadge: ViewStyle;
  tierBadgeText: TextStyle;
  toggleRow: ViewStyle;
  toggleLabel: TextStyle;
  mainLayout: ViewStyle;
  layoutCard: ViewStyle;
  layoutInner: ViewStyle;
  synergyRow: ViewStyle;
  synergyColumn: ViewStyle;
  leftSidebar: ViewStyle;
  synergyCard: ViewStyle;
  synergyIcon: ViewStyle;
  synergyIconText: TextStyle;
  synergyInfo: ViewStyle;
  synergyName: TextStyle;
  synergyBar: ViewStyle;
  synergyBarFill: ViewStyle;
  synergyCount: TextStyle;
  boardColumn: ViewStyle;
  rightSidebar: ViewStyle;
  sideLabel: TextStyle;
  boardWrapper: ViewStyle;
  board: ViewStyle;
  boardRow: ViewStyle;
  boardRowOffset: ViewStyle;
  hexCell: ViewStyle;
  hexCellContainer: ViewStyle;
  hexCellOccupied: ViewStyle;
  unitWrapper: ViewStyle;
  hexagonBorderWrapper: ViewStyle;
  hexagonBorder: ViewStyle;
  hexagonInner: ViewStyle;
  tier3Icon: ViewStyle;
  unitItemsRow: ViewStyle;
  unitItemIcon: ImageStyle;
  unitRing: ViewStyle;
  unitAvatar: ImageStyle;
  starBadge: ViewStyle;
  starText: TextStyle;
  costBadge: ViewStyle;
  costText: TextStyle;
  carryBadge: ViewStyle;
  carryText: TextStyle;
  unlockBadge: ViewStyle;
  unlockIcon: ImageStyle;
  itemRow: ViewStyle;
  itemIcon: ImageStyle;
  benchRow: ViewStyle;
  benchLabel: TextStyle;
  benchList: ViewStyle;
  benchSlot: ViewStyle;
  benchAvatar: ImageStyle;
  benchName: TextStyle;
  carryCard: ViewStyle;
  sectionLabel: TextStyle;
  carryRow: ViewStyle;
  carryChampion: ViewStyle;
  carryAvatar: ImageStyle;
  carryName: TextStyle;
  carryRole: TextStyle;
  carryItemsRow: ViewStyle;
  carryItemIcon: ImageStyle;
  highlightsCard: ViewStyle;
  highlightItem: ViewStyle;
  highlightBullet: ViewStyle;
  highlightText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: '#1a1d29',
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 48,
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: '#1a1d29',
    },
    compositionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
      paddingHorizontal: 12,
    },
    compositionName: {
      fontSize: 24,
      fontWeight: '800',
      letterSpacing: -0.5,
      flex: 1,
    },
    backButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    sourceLabel: {
      fontSize: 12,
      letterSpacing: 4,
      color: colors.placeholder,
      textTransform: 'uppercase',
    },
    sourceLabelVertical: {
      fontSize: 10,
      letterSpacing: 3,
      color: colors.placeholder,
      textTransform: 'uppercase',
      transform: [{rotate: '-90deg'}],
    },
    verticalLabelContainer: {
      marginTop: 20,
      height: 60,
      width: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleSection: {
      marginTop: 12,
      marginBottom: 20,
    },
    title: {
      fontSize: 34,
      marginBottom: 10,
      letterSpacing: -0.8,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      opacity: 0.85,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
    },
    metaPill: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      borderWidth: 1,
    },
    metaPillPrimary: {
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary + '40',
    },
    metaPillSecondary: {
      backgroundColor: '#f97316',
      borderColor: '#f97316',
    },
    metaPillText: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.white,
      letterSpacing: 0.4,
    },
    tierBadge: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
    },
    tierBadgeText: {
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    toggleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      paddingVertical: 6,
    },
    toggleLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    synergyRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      paddingVertical: 12,
      gap: 12,
      backgroundColor: '#252836',
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    mainLayout: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      minHeight: 400,
      justifyContent: 'center',
    },
    layoutCard: {
      borderRadius: 28,
      backgroundColor: colors.card,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.borderColor + '60',
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 12,
      shadowOffset: {width: 0, height: 8},
      elevation: 4,
      marginBottom: 24,
    },
    layoutInner: {
      flexDirection: 'row',
    },
    leftSidebar: {
      width: 60,
      paddingRight: 8,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 40,
    },
    synergyColumn: {
      width: 80,
      paddingLeft: 12,
      paddingRight: 8,
      alignItems: 'center',
    },
    synergyCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    synergyIcon: {
      width: 44,
      height: 44,
      borderRadius: 8,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      transform: [{rotate: '0deg'}],
    },
    synergyIconText: {
      fontSize: 11,
      fontWeight: '800',
    },
    synergyInfo: {
      flex: 1,
    },
    synergyName: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    synergyBar: {
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.borderColor + '60',
      marginTop: 6,
      overflow: 'hidden',
    },
    synergyBarFill: {
      height: '100%',
      borderRadius: 3,
    },
    synergyCount: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
    },
    boardColumn: {
      flex: 1,
      paddingHorizontal: 4,
      maxWidth: 500,
    },
    rightSidebar: {
      width: 60,
      paddingLeft: 8,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 40,
    },
    sideLabel: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 2,
      color: colors.placeholder,
      marginBottom: 12,
    },
    boardWrapper: {
      paddingVertical: 8,
      marginLeft: -20,
    },
    board: {
      paddingVertical: 4,
    },
    boardRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: -10,
    },
    boardRowOffset: {
      marginLeft: '7%',
    },
    hexCellContainer: {
      marginHorizontal: 1,
      marginTop: 1,
      marginBottom: -2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unitWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    hexagonBorderWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    hexagonBorder: {
      position: 'absolute',
      zIndex: 1,
    },
    hexagonInner: {
      position: 'relative',
      zIndex: 2,
    },
    tier3Icon: {
      position: 'absolute',
      zIndex: 10,
    },
    unitItemsRow: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 2,
      bottom: -22,
      width: '100%',
      zIndex: 5,
    },
    unitItemIcon: {
      borderRadius: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    hexCell: {
      width: 64,
      height: 72,
      marginHorizontal: 2,
      marginVertical: 4,
      borderWidth: 2,
      borderColor: '#2a2d3a',
      backgroundColor: '#1e2130',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transform: [{rotate: '0deg'}],
    },
    hexCellOccupied: {
      backgroundColor: '#252836',
      borderColor: '#3a3d4a',
    },
    unitRing: {
      width: 48,
      height: 48,
      borderRadius: 24,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    unitAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
    },
    starBadge: {
      position: 'absolute',
      top: -6,
      left: -4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      backgroundColor: colors.primary,
    },
    starText: {
      fontSize: 10,
      color: colors.white,
      fontWeight: '700',
    },
    costBadge: {
      position: 'absolute',
      bottom: -8,
      left: -6,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    costText: {
      fontSize: 11,
      fontWeight: '700',
      color: colors.text,
    },
    carryBadge: {
      position: 'absolute',
      top: -8,
      right: -8,
      width: 22,
      height: 22,
      borderRadius: 11,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
      borderWidth: 1,
      borderColor: colors.white,
    },
    carryText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.white,
    },
    unlockBadge: {
      position: 'absolute',
      bottom: -8,
      right: -8,
      width: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    unlockIcon: {
      width: 14,
      height: 14,
    },
    itemRow: {
      position: 'absolute',
      bottom: -26,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    itemIcon: {
      width: 18,
      height: 18,
      borderRadius: 4,
    },
    benchRow: {
      marginTop: 32,
    },
    benchLabel: {
      fontSize: 12,
      color: colors.placeholder,
      marginBottom: 10,
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    benchList: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    benchSlot: {
      width: 78,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.borderColor + '60',
      backgroundColor: colors.card,
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    benchAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      marginBottom: 6,
    },
    benchName: {
      fontSize: 11,
      textAlign: 'center',
      color: colors.text,
    },
    carryCard: {
      borderRadius: 16,
      padding: 16,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 20,
      marginHorizontal: 16,
    },
    sectionLabel: {
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 16,
      color: colors.text,
    },
    carryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 16,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border + '40',
    },
    carryRowLast: {
      marginBottom: 0,
      paddingBottom: 0,
      borderBottomWidth: 0,
    },
    carryChampion: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    carryAvatar: {
      width: 56,
      height: 56,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.border,
      marginRight: 12,
    },
    carryInfo: {
      flex: 1,
    },
    carryName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    carryRole: {
      fontSize: 14,
      color: colors.gold,
      fontWeight: '600',
      marginBottom: 6,
    },
    traitsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 4,
    },
    traitBadge: {
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    traitText: {
      fontSize: 11,
      color: colors.primary,
      fontWeight: '600',
    },
    carryItemsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    itemWithComponents: {
      alignItems: 'center',
      gap: 4,
    },
    carryItemIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemComponentsRow: {
      flexDirection: 'row',
      gap: 3,
      justifyContent: 'center',
    },
    componentIcon: {
      width: 18,
      height: 18,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border + '60',
    },
    highlightsCard: {
      borderRadius: 24,
      padding: 20,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.borderColor + '55',
    },
    highlightItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
    },
    highlightBullet: {
      width: 6,
      height: 6,
      borderRadius: 3,
      backgroundColor: colors.primary,
      marginTop: 7,
      marginRight: 10,
    },
    highlightText: {
      flex: 1,
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
  });
};
