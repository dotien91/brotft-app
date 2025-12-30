import {StyleSheet, TextStyle, ViewStyle, ImageStyle, Dimensions} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  topHeader: ViewStyle;
  headerContent: ViewStyle;
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
  carryRowNew: ViewStyle;
  carryRowLast: ViewStyle;
  carryChampion: ViewStyle;
    carryChampionLeft: ViewStyle;
    carryHexagonWrapper: ViewStyle;
    carryHexagonBorder: ViewStyle;
    carryHexagonInner: ViewStyle;
    carryCostBadge: ViewStyle;
    carryCostText: TextStyle;
    carryNameBelowContainer: ViewStyle;
    carryAvatar: ImageStyle;
    carryInfo: ViewStyle;
    carryInfoRight: ViewStyle;
    carryName: TextStyle;
    carryNameBelow: TextStyle;
    carryRole: TextStyle;
  traitsRow: ViewStyle;
  traitBadge: ViewStyle;
  traitText: TextStyle;
  carryItemsRow: ViewStyle;
  itemsGrid: ViewStyle;
  itemsGridRow: ViewStyle;
  itemsGridColumn: ViewStyle;
  itemsGridItem: ViewStyle;
  itemsGridMainItem: ViewStyle;
  itemsGridMainItemIcon: ImageStyle;
  itemsGridComponentsRow: ViewStyle;
  itemsGridComponentItem: ViewStyle;
  itemsGridComponentIcon: ImageStyle;
  traitIcon: ImageStyle;
  itemWithComponents: ViewStyle;
  carryItemIcon: ImageStyle;
  itemComponentsRow: ViewStyle;
  componentIcon: ImageStyle;
  highlightsCard: ViewStyle;
  highlightItem: ViewStyle;
  highlightBullet: ViewStyle;
  highlightText: TextStyle;
  phaseTabsContainer: ViewStyle;
  phaseTab: ViewStyle;
  phaseTabActive: ViewStyle;
  phaseTabText: TextStyle;
  phaseTabTextActive: TextStyle;
  traitsSection: ViewStyle;
  traitsSectionTitle: TextStyle;
  traitsColumnsContainer: ViewStyle;
  traitsColumn: ViewStyle;
  traitCardNew: ViewStyle;
  traitCardIconContainer: ViewStyle;
  traitCardIconNew: ImageStyle;
  traitCardInfoContainer: ViewStyle;
  traitBreakpointsRow: ViewStyle;
  traitBreakpoint: TextStyle;
  augmentsSection: ViewStyle;
  augmentsColumnsContainer: ViewStyle;
  augmentsColumn: ViewStyle;
  augmentsColumnTitle: TextStyle;
  augmentItem: ViewStyle;
  augmentIcon: ImageStyle;
  augmentIconPlaceholder: ViewStyle;
  augmentInfo: ViewStyle;
  augmentName: TextStyle;
  sectionTitle: TextStyle;
  descriptionSection: ViewStyle;
  descriptionText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
      justifyContent: 'space-between',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.background,
      gap: 12,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: 12,
    },
    compositionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 16,
      paddingHorizontal: 12,
    },
    compositionName: {
      fontSize: 18,
      fontWeight: '800',
      letterSpacing: -0.5,
      flex: 1,
      color: colors.text,
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
      backgroundColor: colors.secondary,
      borderColor: colors.secondary,
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
      backgroundColor: colors.card,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    mainLayout: {
      flexDirection: 'row',
      paddingHorizontal: 8,
      justifyContent: 'center',
      marginBottom: 24,
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
      backgroundColor: colors.blackOverlay,
    },
    hexCell: {
      width: 64,
      height: 72,
      marginHorizontal: 2,
      marginVertical: 4,
      borderWidth: 2,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      transform: [{rotate: '0deg'}],
    },
    hexCellOccupied: {
      backgroundColor: colors.card,
      borderColor: colors.highlight,
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
    unlockBadge: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    unlockIcon: {
      // Size will be set dynamically in component
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
    carryRowNew: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 20,
      paddingBottom: 20,
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
    carryChampionLeft: {
      alignItems: 'center',
      marginRight: 16,
      position: 'relative',
      minWidth: 80,
    },
    carryHexagonWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
      overflow: 'visible',
    },
    carryHexagonBorder: {
      position: 'absolute',
      zIndex: 1,
    },
    carryHexagonInner: {
      position: 'relative',
      zIndex: 2,
    },
    carryCostBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      gap: 4,
      marginTop: 8,
    },
    carryCostText: {
      fontSize: 12,
      fontWeight: '700',
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
    carryInfoRight: {
      flex: 1,
    },
    carryName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    carryNameBelowContainer: {
      position: 'absolute',
      bottom: -5,
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
      zIndex: 10,
    },
    carryNameBelow: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'center',
      maxWidth: 80,
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
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary + '30',
      gap: 4,
    },
    traitIcon: {
      width: 14,
      height: 14,
    },
    traitText: {
      fontSize: 12,
      color: colors.primary,
      fontWeight: '600',
    },
    carryItemsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    itemsGrid: {
      marginTop: 12,
      flexDirection: 'row',
      gap: 8,
    },
    itemsGridRow: {
      flexDirection: 'row',
      gap: 8,
    },
    itemsGridColumn: {
      alignItems: 'center',
      gap: 4,
    },
    itemsGridItem: {
      width: 48,
      height: 48,
      borderRadius: 7,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemsGridMainItem: {
      width: 48,
      height: 48,
      borderRadius: 5,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    itemsGridMainItemIcon: {
      width: '100%',
      height: '100%',
    },
    itemsGridComponentsRow: {
      flexDirection: 'row',
      gap: 4,
      justifyContent: 'center',
    },
    itemsGridComponentItem: {
      width: 24,
      height: 24,
      borderRadius: 3,
      overflow: 'hidden',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border + '80',
    },
    itemsGridComponentIcon: {
      width: '100%',
      height: '100%',
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
    phaseTabsContainer: {
      flexDirection: 'row',
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 4,
      borderWidth: 1,
      borderColor: colors.border,
    },
    phaseTab: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    phaseTabActive: {
      backgroundColor: colors.primary,
    },
    phaseTabText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    phaseTabTextActive: {
      color: colors.white,
      fontWeight: '700',
    },
    descriptionSection: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 16,
    },
    descriptionText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
      opacity: 0.8,
    },
    traitsSection: {
      marginBottom: 20,
      paddingHorizontal: 16,
    },
    traitsSectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 12,
      textAlign: 'center',
    },
    traitsColumnsContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    traitsColumn: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    traitCardNew: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      gap: 4,
      width: (Dimensions.get('window').width - 7*8) / 4,
      paddingVertical: 8,
    },
    traitCardIcon: {
      marginBottom: 8,
    },
    traitCardIconContainer: {
    },
    traitCardIconNew: {
      width: 32,
      height: 32,
    },
    traitCardInfoContainer: {
    },
    traitBreakpointsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    traitCardNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 3,
    },
    traitBreakpoint: {
      fontSize: 14,
      fontWeight: '700',
    },
    augmentsSection: {
      marginBottom: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'left',
    },
    augmentsColumnsContainer: {
      flexDirection: 'row',
      gap: 6,
    },
    augmentsColumn: {
      gap: 6,
      marginRight: 6,
    },
    augmentsColumnTitle: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
      textAlign: 'left',
    },
    augmentItem: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 6,
      borderWidth: 1,
      borderColor: colors.borderColor,
      width: 38,
      height: 38,
    },
    augmentIcon: {
      width: 38,
      height: 38,
      borderRadius: 6,
    },
    augmentIconPlaceholder: {
      width: 38,
      height: 38,
      borderRadius: 6,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    augmentInfo: {
      flex: 1,
      gap: 2,
    },
    augmentName: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.text,
    },
  });
};
