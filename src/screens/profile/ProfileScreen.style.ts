import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, TextStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  optionItem: ViewStyle;
  optionContent: ViewStyle;
  optionLeft: ViewStyle;
  optionText: TextStyle;
  toggle: ViewStyle;
  toggleActive: ViewStyle;
  toggleThumb: ViewStyle;
  toggleThumbActive: ViewStyle;
  modalOverlay: ViewStyle;
  dropdownContainer: ViewStyle;
  dropdownItem: ViewStyle;
  dropdownItemActive: ViewStyle;
  dropdownItemContent: ViewStyle;
  dropdownItemText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const { colors } = theme;
  return StyleSheet.create<Style>({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    safeArea: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 28,
      letterSpacing: -0.5,
      color: colors.text,
    },
    section: {
      marginTop: 24,
      paddingHorizontal: 20,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      letterSpacing: -0.3,
      color: colors.text,
    },
    optionItem: {
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: colors.card,
      overflow: 'hidden',
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    optionLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    optionText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.border,
      padding: 2,
      justifyContent: 'center',
    },
    toggleActive: {
      backgroundColor: colors.primary,
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: colors.white,
      alignSelf: 'flex-start',
    },
    toggleThumbActive: {
      alignSelf: 'flex-end',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.blackOverlay,
    },
    dropdownContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      minWidth: 200,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dropdownItem: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    dropdownItemActive: {
      backgroundColor: colors.highlight,
    },
    dropdownItemContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
    },
    dropdownItemText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
  });
};
