import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  avatarContainer: ViewStyle;
  infoContainer: ViewStyle;
  championName: TextStyle;
  costContainer: ViewStyle;
  costText: TextStyle;
  traitsContainer: ViewStyle;
  traitItem: ViewStyle;
  traitText: TextStyle;
  traitMoreText: TextStyle;
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
    championName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    costContainer: {
      alignSelf: 'flex-start',
    },
    costText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
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
      gap: 4,
      maxWidth: '48%',
    },
    traitText: {
      fontSize: 11,
      fontWeight: '500',
      color: colors.text,
      flexShrink: 1,
    },
    traitMoreText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.placeholder,
    },
  });
};

