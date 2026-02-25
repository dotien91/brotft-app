import {ImageStyle, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  headerContainer: ViewStyle;
  headerImage: ImageStyle;
  headerOverlay: ViewStyle;
  welcomeText: TextStyle;
  sectionTitleContainer: ViewStyle;
  sectionTitleRow: ViewStyle;
  sectionTitle: TextStyle;
  filterContainer: ViewStyle;
  filterButton: ViewStyle;
  filterButtonText: TextStyle;
  listContent: ViewStyle;
  hotBadge: ViewStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    headerContainer: {
      width: '100%',
      height: 180,
      position: 'relative',
      overflow: 'hidden',
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
    filterButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.text,
    },
    listContent: {
      paddingBottom: 200,
      paddingHorizontal: 6,
    },
    hotBadge: {
      position: 'absolute',
      top: -12,
      right: -8,
      padding: 1,
    },
  });
};
