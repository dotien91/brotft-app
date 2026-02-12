import {StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';

const createStyles = (theme: Theme) => {
  const {colors} = theme;
  return StyleSheet.create({
    section: {
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    unitsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
      overflow: 'hidden',
    },
    unitCell: {
      alignItems: 'center',
      width: 56,
      marginBottom: 4,
    },
    unitName: {
      fontSize: 11,
      color: colors.text,
      marginTop: 4,
      textAlign: 'center',
    },
    loadingContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorContainer: {
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    errorDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.6,
      textAlign: 'center',
    },
  });
};

export default createStyles;

