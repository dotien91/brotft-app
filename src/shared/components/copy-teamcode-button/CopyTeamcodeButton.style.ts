import {StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {ExtendedTheme} from '@react-navigation/native';

interface Style {
  button: ViewStyle;
  buttonPlaceholder: ViewStyle;
  modalOverlay: ViewStyle;
  modalContent: ViewStyle;
  modalText: TextStyle;
}

export default (theme: ExtendedTheme) => {
  const {colors} = theme;
  return StyleSheet.create<Style>({
    // Nút copy (Style giống phương án Soft Primary trước đó)
    button: {
      width: 36,
      height: 36,
      borderRadius: 12,
      backgroundColor: colors.blackOverlay, // ~15% opacity
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonPlaceholder: {
      width: 36,
      height: 36,
    },
    
    // --- MODAL STYLES ---
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.3)', // Làm tối màn hình nền một chút
    },
    modalContent: {
      width: 160,
      backgroundColor: colors.card, // Dùng màu card của theme (sáng/tối)
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalText: {
      marginTop: 12,
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
  });
};