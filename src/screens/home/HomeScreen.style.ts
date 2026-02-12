import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  safeContent: ViewStyle;
  headerContainer: ViewStyle;
  headerImage: ImageStyle;
  headerOverlay: ViewStyle;
  welcomeText: TextStyle;
  sectionTitleContainer: ViewStyle;
  sectionTitleRow: ViewStyle;
  sectionTitle: TextStyle;
  filterContainer: ViewStyle;
  filterButton: ViewStyle;
  filterButtonActive: ViewStyle;
  filterButtonText: TextStyle;
  filterButtonTextActive: TextStyle;
  clearFilterButton: ViewStyle;
  clearFilterButtonContent: ViewStyle;
  clearFilterButtonText: TextStyle;
  filterCountText: TextStyle;
  selectedUnitsContainer: ViewStyle;
  selectedUnitsScroll: ViewStyle;
  selectedUnitChip: ViewStyle;
  selectedUnitAvatarContainer: ViewStyle;
  selectedUnitRemoveIcon: ViewStyle;
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
  iconWrapper: ViewStyle;
  hotBadge: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeContent: {
      flex: 1,
    },
    headerContainer: {
      width: '100%',
      height: 240,
      position: 'relative',
      overflow: 'hidden',
      marginTop: -50, // Tràn qua Dynamic Island
      paddingTop: 50, // Đảm bảo content không bị che
    },
    headerImage: {
      width: '100%',
      height: '100%',
    },
    headerOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 40,
      paddingHorizontal: 16,
    },
    welcomeText: {
      fontSize: 24,
      fontWeight: '800',
      color: colors.white,
      textAlign: 'center',
    },
    sectionTitleContainer: {
      paddingTop: 24,
      paddingBottom: 16,
      overflow: 'visible',
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      letterSpacing: -0.2,
      flex: 1,
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 6,
    },
    filterButtonActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '15',
    },
    filterButtonTextActive: {
      color: colors.primary,
    },
    clearFilterButton: {
      marginRight: 8,
      minWidth: 46,
      height: 46,
      borderRadius: 8,
      backgroundColor: colors.primary + '15',
      borderWidth: 1,
      borderColor: colors.primary,
      overflow: 'visible',
    },
    clearFilterButtonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
      height: '100%',
    },
    clearFilterButtonText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.primary,
    },
    filterCountText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    selectedUnitsContainer: {
      marginTop: 12,
      maxHeight: 80,
      overflow: 'visible',
    },
    selectedUnitsScroll: {
      paddingHorizontal: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 8,
      gap: 8,
    },
    selectedUnitChip: {
      marginRight: 8,
      overflow: 'visible',
    },
    selectedUnitAvatarContainer: {
      position: 'relative',
      overflow: 'visible',
    },
    selectedUnitRemoveIcon: {
      position: 'absolute',
      top: -6,
      right: -6,
      zIndex: 10,
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 2,
    },
    listContent: {
      paddingBottom: 200,
      paddingHorizontal: 6,
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
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.card, // Hoặc màu nền button của bạn
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8, // Khoảng cách giữa icon và text
    },
    filterButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    // Style mới cho wrapper icon
    iconWrapper: {
      position: 'relative', // Quan trọng để icon Fire bám theo
      width: 20,
      height: 20,
    },
    // Style cho icon Fire
    hotBadge: {
      position: 'absolute',
      top: -12,    // Đẩy lên trên một chút
      right: -8,  // Đẩy sang phải một chút
      backgroundColor: colors.card, // Trùng màu nền button để tạo viền cắt
      borderRadius: 6,
      padding: 1, // Tạo khoảng cách nhỏ quanh lửa
    }
  });
};
