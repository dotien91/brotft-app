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
  championContainer: ViewStyle;
  championWrapper: ViewStyle;
  hexagonBorder: ViewStyle;
  hexagonInner: ViewStyle;
  championAvatar: ImageStyle;
  tier3Icon: ImageStyle;
  unlockBadge: ViewStyle;
  unlockIcon: ImageStyle;
  championItemsRow: ViewStyle;
  championItemIcon: ImageStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    listContent: {
      paddingHorizontal: 12,
    },
    teamCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 8,
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
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    },
    championContainer: {
      alignItems: 'center',
      marginRight: 2,
      marginBottom: 2,
      // minHeight: 70, // Đảm bảo chiều cao tối thiểu để thẳng hàng
    },
    championWrapper: {
      position: 'relative',
      marginBottom: 2,
      overflow: 'visible',
      alignItems: 'center',
      justifyContent: 'center',
    },
    hexagonBorder: {
      position: 'absolute',
      zIndex: 1,
    },
    hexagonInner: {
      position: 'relative',
      zIndex: 2,
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
    tier3Icon: {
      position: 'absolute',
      top: -12,
      right: 4,
      width: 36,
      height: 36,
      zIndex: 10,
    },
    unlockBadge: {
      position: 'absolute',
      bottom: -6,
      right: -4,
      width: 18,
      height: 18,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 9,
    },
    unlockIcon: {
      width: 12,
      height: 12,
    },
    championItemsRow: {
      position: 'absolute',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 2,
      bottom: -28,
      width: '100%',
      zIndex: 5,
    },
    championItemIcon: {
      width: 12,
      height: 12,
      borderRadius: 3,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
  });
};
