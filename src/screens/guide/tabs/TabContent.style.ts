import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  searchContainer: ViewStyle;
  searchInput: TextStyle;
  searchIcon: ViewStyle;
  clearButton: ViewStyle;
  filtersContainer: ViewStyle;
  filtersContent: ViewStyle;
  filterChipClear: ViewStyle;
  filterChipClearText: TextStyle;
  listContent: ViewStyle;
  scrollContent: ViewStyle;
  centerContainer: ViewStyle;
  centerText: TextStyle;
  comingSoonTitle: TextStyle;
  footerLoader: ViewStyle;
  footerText: TextStyle;
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
      backgroundColor: colors.card,
      marginHorizontal: 16,
      marginTop: 12,
      marginBottom: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
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
  });
};

