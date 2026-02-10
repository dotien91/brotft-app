import {Alert, Linking} from 'react-native';
// @ts-ignore
import VersionCheck from 'react-native-version-check';
import {isAndroid} from '@freakycoder/react-native-helpers';
import {translations} from '../../shared/localization';

// App Store URL và Play Store Package Name
const APP_STORE_URL = 'https://apps.apple.com/ca/app/chessbuddy-meta-comps-for-tft/id6757330447';
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

    const moveToStore = async () => {
      let urlString = '';
      try {
        if (isAndroid) {
          urlString = await VersionCheck.getPlayStoreUrl({
            packageName: PLAY_STORE_ID,
          });
        } else {
          urlString = APP_STORE_URL;
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
      translations.updateRequired || 'Có bản cập nhật mới',
      translations.updateRequiredMessage || 'Đã có phiên bản mới với nhiều cải tiến. Bạn cập nhật để trải nghiệm tốt hơn nhé.',
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

export type CheckVersionResult = {
  needUpdate: boolean;
  storeUrl: string | null;
  currentVersion?: string;
  latestVersion?: string;
};

/**
 * Kiểm tra version và trả về kết quả (dùng cho InitView modal, không hiện Alert)
 */
export const checkVersionForModal = async (): Promise<CheckVersionResult> => {
  const defaultResult: CheckVersionResult = { needUpdate: false, storeUrl: null };
  try {
    const currentVersion = VersionCheck.getCurrentVersion();
    if (!currentVersion) return defaultResult;

    const latestVersion = (await Promise.race([
      VersionCheck.getLatestVersion({ packageName: PLAY_STORE_ID }),
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000),
      ),
    ])) as string;

    if (!latestVersion) return defaultResult;

    const updateInfo = await VersionCheck.needUpdate({
      currentVersion,
      latestVersion,
    });

    if (!updateInfo?.isNeeded) return defaultResult;

    let storeUrl: string | null = null;
    try {
      if (isAndroid) {
        storeUrl = await VersionCheck.getPlayStoreUrl({
          packageName: PLAY_STORE_ID,
        });
      } else {
        storeUrl = APP_STORE_URL;
      }
    } catch {
      // ignore
    }

    return {
      needUpdate: true,
      storeUrl,
      currentVersion,
      latestVersion,
    };
  } catch (e) {
    console.log('Version check error:', e);
    return defaultResult;
  }
};

/**
 * Lấy version hiện tại
 */
export const getCurrentVersion = (): string => {
  return VersionCheck.getCurrentVersion();
};

/**
 * Lấy URL store (App Store / Play Store) theo platform
 */
export const getStoreUrl = async (): Promise<string | null> => {
  try {
    if (isAndroid) {
      return await VersionCheck.getPlayStoreUrl({ packageName: PLAY_STORE_ID });
    }
    return APP_STORE_URL;
  } catch {
    return null;
  }
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

