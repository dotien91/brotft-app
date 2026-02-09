import {StyleSheet, TextStyle, ViewStyle, ImageStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  headerSection: ViewStyle;
  typeIndicator: ViewStyle;
  traitIcon: ImageStyle;
  iconPlaceholder: ViewStyle;
  titleSection: ViewStyle;
  title: TextStyle;
  enName: TextStyle;
  typeBadge: ViewStyle;
  typeBadgeText: TextStyle;
  section: ViewStyle;
  sectionTitle: TextStyle;
  description: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    container: {
      marginHorizontal: 16,
      marginBottom: 16,
      borderRadius: 20,
      backgroundColor: colors.card ?? '#252836',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.borderColor ?? '#2a2d3a',
    },
    content: {
      padding: 12,
    },
    headerSection: {
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      gap: 10,
    },
    typeIndicator: {
      width: 33,
      height: 33,
      borderRadius: 36,
      justifyContent: 'center',
      alignItems: 'center',
    },
    traitIcon: {
      width: 34,
      height: 34,
      marginRight: 4,
    },
    iconPlaceholder: {
      width: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleSection: {
      marginBottom: 8,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
      marginLeft: 8,
      textAlign: 'center',
      letterSpacing: -0.3,
    },
    enName: {
      fontSize: 14,
      color: colors.placeholder,
      opacity: 0.7,
      textAlign: 'center',
    },
    typeBadge: {
      marginTop: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
      borderWidth: 1,
      alignSelf: 'flex-start',
    },
    typeBadgeText: {
      fontSize: 12,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    section: {
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 12,
      letterSpacing: -0.3,
    },
    description: {
      fontSize: 15,
      color: colors.placeholder,
      opacity: 0.85,
    },
  });
};
