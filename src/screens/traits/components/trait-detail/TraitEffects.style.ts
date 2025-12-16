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
    tierCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tierHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    tierCountBadge: {
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 60,
    },
    tierCountText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.primary,
    },
    tierCountLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.6,
      marginTop: 2,
    },
    tierEffectContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
      marginLeft: 16,
    },
    tierEffectText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    variablesContainer: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    variableItem: {
      marginBottom: 8,
    },
    variableText: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.8,
    },
  });
};

export default createStyles;

