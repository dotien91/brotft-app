import {StyleSheet, ImageStyle, ViewStyle} from 'react-native';
import type {ExtendedTheme} from '@react-navigation/native';
import {ScreenWidth} from '@freakycoder/react-native-helpers';

interface Style {
  container: ViewStyle;
  contentWrapper: ViewStyle;
  imageStyle: ImageStyle;
  descriptionTextStyle: ViewStyle;
  costContainer: ViewStyle;
  setContainer: ViewStyle;
  traitsContainer: ViewStyle;
  contentContainer: ViewStyle;
  valueTextStyle: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      shadowRadius: 5,
      shadowOpacity: 0.1,
      shadowColor: colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      overflow: 'hidden',
    },
    contentWrapper: {
      padding: 16,
    },
    imageStyle: {
      width: ScreenWidth * 0.9,
      height: 200,
      backgroundColor: colors.placeholder,
    },
    descriptionTextStyle: {
      marginTop: 4,
      marginBottom: 8,
    },
    costContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    setContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    traitsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    contentContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    valueTextStyle: {
      marginLeft: 4,
      fontSize: 14,
      color: colors.text,
    },
  });
};

