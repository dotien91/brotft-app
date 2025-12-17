import {ImageStyle, StyleSheet, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  wrapper: ViewStyle;
  hexagonBorder: ViewStyle;
  hexagonInner: ViewStyle;
  tier3Icon: ViewStyle;
  unlockBadge: ViewStyle;
  unlockIcon: ImageStyle;
  itemsRow: ViewStyle;
  itemIcon: ImageStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      alignItems: 'center',
      marginRight: 2,
      marginBottom: 2,
    },
    wrapper: {
      position: 'relative',
      marginBottom: 2,
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
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
      top: -12,
      right: 4,
      width: 36,
      height: 36,
      zIndex: 10,
    },
    unlockBadge: {
      position: 'absolute',
      bottom: -6,
      right: -4,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 9,
    },
    unlockIcon: {
      width: 12,
      height: 12,
    },
    itemsRow: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 2,
      bottom: -28,
      width: '100%',
      zIndex: 5,
    },
    itemIcon: {
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
};

