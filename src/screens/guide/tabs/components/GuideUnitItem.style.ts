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
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: '#1a1d29',
      borderBottomWidth: 1,
      borderBottomColor: '#2a2d3a',
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
      backgroundColor: 'rgba(251, 191, 36, 0.15)',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-start',
      gap: 4,
      borderWidth: 1,
      borderColor: 'rgba(251, 191, 36, 0.3)',
    },
    costText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#fbbf24',
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
      backgroundColor: colors.primary + '15',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary + '30',
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
  });
};

