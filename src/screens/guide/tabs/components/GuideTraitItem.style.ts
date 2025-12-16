import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  headerRow: ViewStyle;
  iconContainer: ViewStyle;
  traitIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  infoContainer: ViewStyle;
  traitName: TextStyle;
  unitsCount: TextStyle;
  traitDesc: TextStyle;
  unitsContainer: ViewStyle;
  unitsText: TextStyle;
  unitsLoadingContainer: ViewStyle;
  moreUnitsContainer: ViewStyle;
  moreUnitsText: TextStyle;
  effectsBadge: ViewStyle;
  effectsText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    iconContainer: {
      width: 56,
      height: 56,
      marginRight: 12,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#252836',
      borderWidth: 2,
      borderColor: '#3a3d4a',
      alignItems: 'center',
      justifyContent: 'center',
    },
    traitIcon: {
      width: '100%',
      height: '100%',
    },
    iconPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    infoContainer: {
      flex: 1,
      marginRight: 12,
    },
    traitName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    traitDesc: {
      fontSize: 12,
      color: colors.placeholder,
      marginBottom: 4,
      lineHeight: 16,
    },
    unitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 8,
    },
    unitsLoadingContainer: {
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    moreUnitsContainer: {
      width: 70,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    moreUnitsText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.placeholder,
    },
    unitsText: {
      fontSize: 11,
      color: colors.placeholder,
    },
    effectsBadge: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    effectsText: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.white,
    },
  });
};

