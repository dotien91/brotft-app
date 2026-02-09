import React, {useState, useEffect, useCallback} from 'react';
import {View, ViewStyle, Text, Modal} from 'react-native';
import {useTheme} from '@react-navigation/native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import Icon, {IconType} from '@shared-components/icon/Icon';
import Clipboard from '@react-native-clipboard/clipboard';
import {translations} from '../../localization';
import createStyles from './CopyTeamcodeButton.style';

interface CopyTeamcodeButtonProps {
  teamcode?: string | null;
  style?: ViewStyle;
}

const CopyTeamcodeButton: React.FC<CopyTeamcodeButtonProps> = ({teamcode, style}) => {
  const theme = useTheme();
  const {colors} = theme;
  const styles = createStyles(theme);
  const [modalVisible, setModalVisible] = useState(false);

  // Auto hide modal after 1.5 seconds
  useEffect(() => {
    if (!modalVisible) return;
    const timer = setTimeout(() => {
      setModalVisible(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [modalVisible]);

  const handlePress = useCallback(() => {
    if (!teamcode) return;
    Clipboard.setString(teamcode);
    setModalVisible(true);
  }, [teamcode]);

  if (!teamcode) {
    // Return a placeholder of same size to keep layout consistent
    return <View style={[styles.buttonPlaceholder, style]} />;
  }

  return (
    <>
      <RNBounceable onPress={handlePress} style={[styles.button, style]}>
        <Icon 
          name="copy-outline" 
          type={IconType.Ionicons} 
          color={colors.text} 
          size={18} 
        />
      </RNBounceable>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)} // For Android back button
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Icon 
              name="checkmark-circle" 
              type={IconType.Ionicons} 
              color={colors.green} 
              size={60} 
            />
            <Text style={styles.modalText}>
              {translations.copySuccess || 'Copied Teamcode!'}
            </Text>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(CopyTeamcodeButton);