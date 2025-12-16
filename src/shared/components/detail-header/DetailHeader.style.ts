import {StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';

const createStyles = (theme: Theme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.background,
    },
  });
};

export default createStyles;

