import {StyleSheet, ViewStyle, ImageStyle, TextStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  sectionTitle: TextStyle;
  itemsContainer: ViewStyle;
  itemCard: ViewStyle;
  itemColumn: ViewStyle;
  itemIconContainer: ViewStyle;
  itemIcon: ImageStyle;
  componentsRow: ViewStyle;
  componentItem: ViewStyle;
  componentIcon: ImageStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginTop: 12,
      marginBottom: 16,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      marginBottom: 12,
      letterSpacing: -0.3,
      color: colors.text,
      fontWeight: 'bold',
    },
    itemsContainer: {
    },
    itemCard: {
      marginRight: 12,
    },
    itemColumn: {
      alignItems: 'center',
      gap: 4,
    },
    itemIconContainer: {
      width: 60,
      height: 60,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
    },
    itemIcon: {
      width: '100%',
      height: '100%',
    },
    componentsRow: {
      flexDirection: 'row',
      gap: 3,
      justifyContent: 'center',
    },
    componentItem: {
      width: 20,
      height: 20,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.border + '80',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 2,
      overflow: 'hidden',
    },
    componentIcon: {
      width: '100%',
      height: '100%',
    },
  });
};
