import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import type {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  contentWrapper: ViewStyle;
  headerRow: ViewStyle;
  typeBadge: ViewStyle;
  typeText: TextStyle;
  descriptionTextStyle: TextStyle;
  keyContainer: ViewStyle;
  setContainer: ViewStyle;
  championsContainer: ViewStyle;
  contentContainer: ViewStyle;
  valueTextStyle: TextStyle;
  tiersContainer: ViewStyle;
  tiersTitle: TextStyle;
  tierItem: ViewStyle;
  tierCountBadge: ViewStyle;
  tierCountText: TextStyle;
  tierEffectText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginBottom: 20,
      borderRadius: 20,
      backgroundColor: colors.card,
      shadowRadius: 12,
      shadowOpacity: 0.18,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      overflow: 'hidden',
      elevation: 5,
      borderWidth: 1,
      borderColor: colors.placeholder + '10',
    },
    contentWrapper: {
      padding: 20,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    typeBadge: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
    },
    typeText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    descriptionTextStyle: {
      marginTop: 8,
      marginBottom: 14,
      lineHeight: 22,
      opacity: 0.85,
    },
    keyContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.placeholder + '15',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      marginRight: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.placeholder + '25',
    },
    setContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.placeholder + '15',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      marginRight: 10,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.placeholder + '25',
    },
    championsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.placeholder + '15',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.placeholder + '25',
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 14,
      flexWrap: 'wrap',
    },
    valueTextStyle: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: 0.2,
    },
    tiersContainer: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.placeholder + '20',
    },
    tiersTitle: {
      marginBottom: 12,
      fontSize: 16,
    },
    tierItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      paddingVertical: 8,
      paddingHorizontal: 12,
      backgroundColor: colors.background + '80',
      borderRadius: 10,
    },
    tierCountBadge: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    tierCountText: {
      color: colors.white,
      fontSize: 14,
      fontWeight: '800',
    },
    tierEffectText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
  });
};

