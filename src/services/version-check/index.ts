import {Alert, Linking} from 'react-native';
// @ts-ignore
import VersionCheck from 'react-native-version-check';
import {isAndroid} from '@freakycoder/react-native-helpers';
import {translations} from '../../shared/localization';

// App Store ID và Play Store Package Name
const APP_STORE_ID = '6757330447'; // Thay bằng App Store ID thật
const PLAY_STORE_ID = 'com.apporastudio.tftbuddy';

let isUpdateAlertVisible = false;

const showDeviceNotSupportedAlert = () => {
  if (isUpdateAlertVisible) return;
  Alert.alert(
    translations.deviceNotSupported || 'Không hỗ trợ',
    translations.deviceNotSupportedMessage || 'Không thể mở cửa hàng ứng dụng. Vui lòng cập nhật ứng dụng thủ công.',
    [
      {
        text: translations.close || 'Đóng',
        style: 'cancel',
        onPress: () => {
          isUpdateAlertVisible = false;
        },
      },
    ],
    {
      cancelable: true,
      onDismiss: () => {
        isUpdateAlertVisible = false;
      },
    },
  );
  isUpdateAlertVisible = true;
};

/**
 * Kiểm tra và yêu cầu cập nhật bắt buộc nếu version thấp
 */
export const checkAndForceUpdate = async () => {
  if (isUpdateAlertVisible) return;
  
  try {
    const currentVersion = VersionCheck.getCurrentVersion();
    if (!currentVersion) {
      console.log('Version check: Could not get current version');
      return;
    }

    const latestVersion = (await Promise.race([
      VersionCheck.getLatestVersion({
        packageName: PLAY_STORE_ID,
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000),
      ),
    ])) as string;
    
    if (!latestVersion) {
      console.log('Version check: Could not get latest version');
      return;
    }
    
    const updateInfo = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion,
    });

    if (!updateInfo || !updateInfo.isNeeded) {
      return;
    }

    const {isNeeded} = updateInfo;

    const moveToStore = async () => {
      let urlString = '';
      try {
        if (isAndroid) {
          urlString = await VersionCheck.getPlayStoreUrl({
            packageName: PLAY_STORE_ID,
          });
        } else {
          urlString = await VersionCheck.getAppStoreUrl({
            appID: APP_STORE_ID,
          });
        }
        if (!urlString) {
          showDeviceNotSupportedAlert();
          return;
        }
        Linking.openURL(urlString).catch(() => {
          showDeviceNotSupportedAlert();
        });
      } catch (e) {
        showDeviceNotSupportedAlert();
      }
    };

    Alert.alert(
      translations.updateRequired || 'Cập nhật bắt buộc',
      translations.updateRequiredMessage || 'Phiên bản hiện tại của ứng dụng đã lỗi thời. Vui lòng cập nhật lên phiên bản mới nhất để tiếp tục sử dụng.',
      [
        {
          text: translations.updateNow || 'Cập nhật ngay',
          onPress: () => {
            isUpdateAlertVisible = false;
            moveToStore();
          },
        },
      ],
      {
        cancelable: false, // Không cho phép đóng
        onDismiss: () => {
          isUpdateAlertVisible = false;
        },
      },
    );
    isUpdateAlertVisible = true;
  } catch (e) {
    // Ignore errors - không hiển thị lỗi nếu không check được version
    console.log('Version check error:', e);
  }
};

/**
 * Lấy version hiện tại
 */
export const getCurrentVersion = (): string => {
  return VersionCheck.getCurrentVersion();
};

/**
 * Lấy version mới nhất từ store
 */
export const getLatestVersion = async (): Promise<string | null> => {
  try {
    const latestVersion = await VersionCheck.getLatestVersion({
      packageName: PLAY_STORE_ID,
    });
    return latestVersion;
  } catch (e) {
    console.error('Error getting latest version:', e);
    return null;
  }
};

