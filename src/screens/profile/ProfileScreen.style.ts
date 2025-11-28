import { ExtendedTheme } from "@react-navigation/native";
import { ViewStyle, TextStyle, StyleSheet } from "react-native";

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  header: ViewStyle;
  title: TextStyle;
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
      backgroundColor: '#1a1d29',
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
      paddingTop: 20,
      paddingBottom: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    section: {
      marginTop: 8,
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
    },
    optionItem: {
      marginBottom: 12,
      borderRadius: 12,
      backgroundColor: '#252836',
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
    },
    toggle: {
      width: 50,
      height: 28,
      borderRadius: 14,
      backgroundColor: '#3a3d4a',
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
      backgroundColor: '#fff',
      alignSelf: 'flex-start',
    },
    toggleThumbActive: {
      alignSelf: 'flex-end',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    dropdownContainer: {
      backgroundColor: '#252836',
      borderRadius: 12,
      minWidth: 200,
      maxWidth: 300,
      overflow: 'hidden',
    },
    dropdownItem: {
      borderBottomWidth: 1,
      borderBottomColor: '#2a2d3a',
    },
    dropdownItemActive: {
      backgroundColor: '#3a3d4a',
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
    },
  });
};
