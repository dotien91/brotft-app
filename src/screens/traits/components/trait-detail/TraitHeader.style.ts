import {StyleSheet} from 'react-native';
import {Theme} from '@react-navigation/native';

const createStyles = (theme: Theme) => {
  const {colors} = theme;
  return StyleSheet.create({
    headerSection: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    typeIndicator: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    traitIcon: {
      width: 64,
      height: 64,
    },
    titleSection: {
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    enName: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.6,
      marginBottom: 12,
      textAlign: 'center',
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 8,
    },
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      gap: 6,
    },
    badgeSecondary: {
      backgroundColor: colors.border + '30',
    },
    badgeTextSecondary: {
      fontSize: 12,
      color: colors.text,
      fontWeight: '500',
    },
  });
};

export default createStyles;

