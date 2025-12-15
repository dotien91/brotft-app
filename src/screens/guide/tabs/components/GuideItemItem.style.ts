import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  iconContainer: ViewStyle;
  icon: ImageStyle;
  infoContainer: ViewStyle;
  itemName: TextStyle;
  itemDescription: TextStyle;
  uniqueBadge: ViewStyle;
  uniqueText: TextStyle;
  componentsContainer: ViewStyle;
  componentBadge: ViewStyle;
  componentText: TextStyle;
  componentMoreText: TextStyle;
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
    iconContainer: {
      marginRight: 12,
      width: 48,
      height: 48,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    icon: {
      width: '100%',
      height: '100%',
    },
    infoContainer: {
      flex: 1,
      marginRight: 12,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      flexShrink: 1,
    },
    itemDescription: {
      fontSize: 12,
      color: colors.placeholder,
      lineHeight: 16,
      marginBottom: 4,
    },
    uniqueBadge: {
      alignSelf: 'flex-start',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.primary + '40',
      marginTop: 4,
    },
    uniqueText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.primary,
    },
    componentsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    componentBadge: {
      backgroundColor: colors.background,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    componentText: {
      fontSize: 10,
      fontWeight: '500',
      color: colors.text,
    },
    componentMoreText: {
      fontSize: 10,
      fontWeight: '600',
      color: colors.placeholder,
    },
  });
};

