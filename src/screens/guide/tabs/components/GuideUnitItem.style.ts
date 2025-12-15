import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  avatarContainer: ViewStyle;
  infoContainer: ViewStyle;
  nameRow: ViewStyle;
  unitName: TextStyle;
  unlockIcon: ImageStyle;
  costContainer: ViewStyle;
  costText: TextStyle;
  traitsContainer: ViewStyle;
  traitItem: ViewStyle;
  traitIcon: ImageStyle;
  traitText: TextStyle;
  traitMoreText: TextStyle;
  compactContainer: ViewStyle;
  compactHexagonWrapper: ViewStyle;
  compactHexagonBorderWrapper: ViewStyle;
  compactHexagonBorder: ViewStyle;
  compactHexagonInner: ViewStyle;
  compactTier3Icon: ViewStyle;
  compactNameRow: ViewStyle;
  compactUnitName: TextStyle;
  compactUnlockIconNextToName: ImageStyle;
  compactCostContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    avatarContainer: {
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
      marginRight: 12,
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    unitName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    unlockIcon: {
      width: 14,
      height: 14,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
      gap: 4,
      borderWidth: 1,
      borderColor: colors.primary + '40',
    },
    costText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.primary,
      letterSpacing: 0.2,
    },
    traitsContainer: {
      flex: 1.5,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'flex-end',
    },
    traitItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#252836',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#3a3d4a',
      gap: 4,
      maxWidth: '48%',
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
    traitMoreText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.placeholder,
    },
    compactContainer: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingVertical: 8,
      paddingHorizontal: 4,
      width: 70,
    },
    compactHexagonWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    compactHexagonBorderWrapper: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'visible',
    },
    compactHexagonBorder: {
      position: 'absolute',
      zIndex: 1,
    },
    compactHexagonInner: {
      position: 'relative',
      zIndex: 2,
    },
    compactUnitName: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      flexShrink: 1,
    },
    compactTier3Icon: {
      position: 'absolute',
      zIndex: 10,
    },
    compactNameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      marginTop: 4,
      maxWidth: 70,
    },
    compactUnitName: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      flexShrink: 1,
    },
    compactUnlockIconNextToName: {
      width: 12,
      height: 12,
    },
    compactCostContainer: {
      marginTop: 4,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

