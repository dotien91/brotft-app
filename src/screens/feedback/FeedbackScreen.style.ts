import {StyleSheet, ViewStyle, TextStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  safeArea: ViewStyle;
  scrollView: ViewStyle;
  scrollContent: ViewStyle;
  section: ViewStyle;
  label: TextStyle;
  textArea: TextStyle;
  input: TextStyle;
  inputError: ViewStyle;
  hint: TextStyle;
  errorText: TextStyle;
  submitButton: ViewStyle;
  submitButtonDisabled: ViewStyle;
  submitButtonText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
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
      padding: 20,
      paddingBottom: 40,
    },
    section: {
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    textArea: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      minHeight: 120,
      borderWidth: 1,
      borderColor: colors.border,
      textAlignVertical: 'top',
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputError: {
      borderColor: colors.danger || '#ef4444',
      borderWidth: 1.5,
    },
    hint: {
      fontSize: 12,
      color: colors.placeholder,
      marginTop: 8,
      fontStyle: 'italic',
    },
    errorText: {
      fontSize: 12,
      color: colors.danger || '#ef4444',
      marginTop: 8,
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    submitButtonDisabled: {
      opacity: 0.6,
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.white,
    },
  });
};

