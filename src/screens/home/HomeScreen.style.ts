import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  listContent: ViewStyle;
  teamCard: ViewStyle;
  teamHeader: ViewStyle;
  rankBadge: ViewStyle;
  rankText: TextStyle;
  teamName: TextStyle;
  championsRow: ViewStyle;
  championAvatar: ImageStyle;
  itemsRow: ViewStyle;
  itemIcon: ImageStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      padding: 16,
      paddingBottom: 32,
    },
    teamCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    teamHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    rankBadge: {
      width: 36,
      height: 36,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    rankText: {
      fontSize: 14,
      fontWeight: '800',
      color: colors.white,
      letterSpacing: 0.5,
    },
    teamName: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      flex: 1,
    },
    championsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      flexWrap: 'wrap',
    },
    championAvatar: {
      width: 40,
      height: 40,
      borderRadius: 10,
      marginRight: 4,
      marginBottom: 4,
      borderWidth: 2,
      borderColor: '#3a3d4a',
    },
    itemsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    itemIcon: {
      width: 24,
      height: 24,
      borderRadius: 6,
      marginRight: 4,
      marginBottom: 4,
    },
  });
};
