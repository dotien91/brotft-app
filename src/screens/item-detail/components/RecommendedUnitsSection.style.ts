import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  sectionTitle: TextStyle;
  unitsContainer: ViewStyle;
  unitCard: ViewStyle;
  unitColumn: ViewStyle;
  hexagonContainer: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginTop: 24,
      marginBottom: 16,
      paddingHorizontal: 16,
      paddingBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      marginBottom: 12,
      letterSpacing: -0.3,
      fontWeight: 'bold',
      color: colors.text,
    },
    unitsContainer: {
      flexDirection: 'row',
      gap: 12,
    },
    unitCard: {
      marginRight: 12,
    },
    unitColumn: {
      flexDirection: 'column',
      alignItems: 'center',
      gap: 6,
    },
    hexagonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
};

