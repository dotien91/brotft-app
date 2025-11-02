import {StyleSheet, ImageStyle, ViewStyle, TextStyle} from 'react-native';
import type {ExtendedTheme} from '@react-navigation/native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';

interface Style {
  container: ViewStyle;
  contentWrapper: ViewStyle;
  imageStyle: ImageStyle;
  descriptionTextStyle: ViewStyle;
  traitTitleText: TextStyle;
  costContainer: ViewStyle;
  setContainer: ViewStyle;
  traitsContainer: ViewStyle;
  traitsList: ViewStyle;
  traitBadge: ViewStyle;
  traitBadgeText: ViewStyle;
  traitMoreText: ViewStyle;
  contentContainer: ViewStyle;
  valueTextStyle: ViewStyle;
  originsWrapper: ViewStyle;
  originContainer: ViewStyle;
  originTextStyle: ViewStyle;
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
    imageStyle: {
      width: '100%',
      height: 240,
      backgroundColor: colors.placeholder + '40',
    },
    traitTitleText: {
      marginTop: 6,
      marginBottom: 6,
      fontSize: 13,
      fontWeight: '600',
      opacity: 0.9,
      letterSpacing: 0.3,
    },
    descriptionTextStyle: {
      marginTop: 8,
      marginBottom: 14,
      lineHeight: 22,
      opacity: 0.85,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      marginRight: 10,
      marginBottom: 8,
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
    traitsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.placeholder + '15',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      flex: 1,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.placeholder + '25',
    },
    traitsList: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      flex: 1,
      marginLeft: 8,
      gap: 6,
    },
    traitBadge: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    traitBadgeText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.primary,
      letterSpacing: 0.2,
    },
    traitMoreText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.placeholder,
      marginLeft: 4,
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
    originsWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginTop: 12,
      gap: 8,
    },
    originContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary + '30',
    },
    originTextStyle: {
      marginLeft: 6,
      fontSize: 13,
      fontWeight: '600',
      color: colors.primary,
      letterSpacing: 0.2,
    },
  });
};

