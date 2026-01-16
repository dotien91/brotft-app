import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  teamCard: ViewStyle;
  teamHeader: ViewStyle;
  rankBadge: ViewStyle;
  rankText: TextStyle;
  teamNameContainer: ViewStyle;
  teamName: TextStyle;
  planAndDifficultyRow: ViewStyle;
  planBadge: ViewStyle;
  planText: TextStyle;
  difficultyBadge: ViewStyle;
  difficultyText: TextStyle;
  championsRow: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    teamCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      height: 190,
    },
    teamHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      justifyContent: 'space-between',
    },
    rankBadge: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    rankText: {
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    teamNameContainer: {
      flex: 1,
    },
    teamName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    planAndDifficultyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 2,
      flexWrap: 'wrap',
      gap: 6,
    },
    planBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    planText: {
      fontSize: 11,
      fontWeight: '400',
      color: colors.text,
    },
    difficultyBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    difficultyText: {
      fontSize: 11,
      fontWeight: '400',
    },
    championsRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
  });
};

