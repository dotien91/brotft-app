import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  searchContainer: ViewStyle;
  searchInput: TextStyle;
  searchIcon: ViewStyle;
  clearButton: ViewStyle;
  filterButton: ViewStyle;
  filterBadge: ViewStyle;
  filterBadgeText: TextStyle;
  filtersContainer: ViewStyle;
  filtersContent: ViewStyle;
  filterChipClear: ViewStyle;
  filterChipClearText: TextStyle;
  activeFiltersContainer: ViewStyle;
  activeFiltersContent: ViewStyle;
  activeFilterChip: ViewStyle;
  activeFilterText: TextStyle;
  activeFilterClose: ViewStyle;
  clearAllButton: ViewStyle;
  clearAllText: TextStyle;
  allText: TextStyle;
  listContent: ViewStyle;
  scrollContent: ViewStyle;
  centerContainer: ViewStyle;
  centerText: TextStyle;
  comingSoonTitle: TextStyle;
  footerLoader: ViewStyle;
  footerText: TextStyle;
  costFilterText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingVertical: 4,
      marginLeft: 8,
    },
    searchIcon: {
      marginRight: 4,
    },
    clearButton: {
      padding: 4,
      marginLeft: 8,
    },
    filterButton: {
      padding: 4,
      position: 'relative',
      borderRadius: 8,
      paddingHorizontal: 8,
    },
    filterBadge: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: colors.primary,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    filterBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.white,
    },
    activeFiltersContainer: {
      marginHorizontal: 16,
      marginBottom: 8,
      marginTop: 10,
      maxHeight: 50,
    },
    activeFiltersContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingVertical: 4,
    },
    activeFilterChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.primary + '40',
      gap: 6,
    },
    activeFilterText: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
    },
    activeFilterClose: {
      padding: 2,
    },
    clearAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderColor: colors.border,
    },
    clearAllText: {
      fontSize: 13,
      color: colors.text,
      fontWeight: '600',
    },
    allText: {
      fontSize: 14,
      color: colors.placeholder,
      fontWeight: '500',
    },
    filtersContainer: {
      marginBottom: 8,
      marginHorizontal: 16,
      paddingVertical: 4,
    },
    filtersContent: {
      paddingHorizontal: 16,
      gap: 8,
      alignItems: 'center',
    },
    filterChipClear: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 26,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: colors.notification,
      borderWidth: 1,
      borderColor: colors.notification,
      gap: 4,
    },
    filterChipClearText: {
      fontSize: 14,
      color: colors.text,
      fontWeight: '500',
    },
    listContent: {
      paddingBottom: 20,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      paddingVertical: 60,
    },
    centerContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 40,
      paddingVertical: 60,
    },
    centerText: {
      marginTop: 16,
      fontSize: 16,
      opacity: 0.75,
      fontWeight: '500',
      letterSpacing: 0.3,
      textAlign: 'center',
    },
    comingSoonTitle: {
      fontSize: 24,
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    footerLoader: {
      paddingVertical: 24,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
    },
    footerText: {
      marginTop: 8,
      fontSize: 14,
    },
    costFilterText: {
      fontSize: 12,
      fontWeight: '700',
      color: '#ffffff',
      letterSpacing: 0.2,
    },
  });
};

