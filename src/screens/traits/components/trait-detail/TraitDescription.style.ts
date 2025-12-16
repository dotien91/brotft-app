import {StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';

const createStyles = (theme: Theme) => {
  const {colors} = theme;
  return StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    description: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      opacity: 0.8,
    },
  });
};

export default createStyles;

