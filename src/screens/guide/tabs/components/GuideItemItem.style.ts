import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  iconContainer: ViewStyle;
  icon: ImageStyle;
  infoContainer: ViewStyle;
  itemName: TextStyle;
  itemDescription: TextStyle;
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
      backgroundColor: '#1a1d29',
      borderBottomWidth: 1,
      borderBottomColor: '#2a2d3a',
    },
    iconContainer: {
      marginRight: 12,
      width: 48,
      height: 48,
      borderRadius: 8,
      overflow: 'hidden',
      backgroundColor: '#252836',
      borderWidth: 1,
      borderColor: '#2a2d3a',
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
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: 12,
      color: colors.placeholder,
      lineHeight: 16,
    },
    componentsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
    },
    componentBadge: {
      backgroundColor: '#252836',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#2a2d3a',
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

