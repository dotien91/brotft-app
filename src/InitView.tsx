import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { checkVersionForModal } from './services/version-check';
import { translations } from './shared/localization';
import { useTheme } from '@react-navigation/native';

const DELAY_CHECK_MS = 1500;
const APP_STORE_URL = 'https://apps.apple.com/us/app/TFTBuddy-meta-comps-for-tft/id6757330447';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.apporastudio.tftbuddy';

const InitView: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (__DEV__) return;
    const timer = setTimeout(() => {
      checkVersion();
    }, DELAY_CHECK_MS);
    return () => clearTimeout(timer);
  }, []);

  const checkVersion = async () => {
    setChecking(true);
    try {
      const result = await checkVersionForModal();
      if (result.needUpdate) {
        setShowUpdateModal(true);
      }
    } catch (e) {
      console.log('InitView version check error:', e);
    } finally {
      setChecking(false);
    }
  };

  const handleUpdatePress = () => {
    const url = Platform.OS === 'ios' ? APP_STORE_URL : PLAY_STORE_URL;
    Linking.openURL(url).catch(() => setShowUpdateModal(false));
  };

  return (
    <>
      {checking && (
        <View style={styles.checkingOverlay} pointerEvents="none">
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      <Modal
        visible={showUpdateModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          // Không cho đóng bằng nút back (Android) – vẫn giữ modal
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.title, { color: colors.text }]}>
              {translations.updateRequired || 'Có bản cập nhật mới'}
            </Text>
            <Text style={[styles.message, { color: colors.placeholder }]}>
              {translations.updateRequiredMessage ||
                'Đã có phiên bản mới với nhiều cải tiến. Bạn cập nhật để trải nghiệm tốt hơn nhé.'}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleUpdatePress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>
                {translations.updateNow || 'Cập nhật ngay'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  checkingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalBox: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    minWidth: 160,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default InitView;
