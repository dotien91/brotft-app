import {StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';

const createStyles = (theme: Theme) => {
  const {colors} = theme;
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginTop: 16,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.6,
      textAlign: 'center',
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    retryButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};

export default createStyles;

