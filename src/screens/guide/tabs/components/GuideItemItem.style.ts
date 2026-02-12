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
  recipeSection: ViewStyle;
  recipeLabel: TextStyle;
  recipeRow: ViewStyle;
  componentIconWrap: ViewStyle;
  componentIcon: ImageStyle;
  recipePlus: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      marginBottom: 12,
      
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
    recipeSection: {
      marginTop: 6,
      gap: 4,
    },
    recipeLabel: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.placeholder,
    },
    recipeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    componentIconWrap: {
      width: 22,
      height: 22,
      borderRadius: 4,
      overflow: 'hidden',
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.borderColor,
    },
    componentIcon: {
      width: '100%',
      height: '100%',
    },
    recipePlus: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.placeholder,
    },
  });
};

