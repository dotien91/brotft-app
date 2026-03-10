import { useEffect } from 'react';
import {
  useStallionUpdate,
  restart,
} from 'react-native-stallion';

export function useOTAUpdate() {
  const { newReleaseBundle, isRestartRequired } = useStallionUpdate();

  const isMandatory = !!newReleaseBundle?.isMandatory;

  // Xử lý khi tải xong: Nếu là bản cập nhật bắt buộc, tự động restart ngay lập tức
  useEffect(() => {
    if (isRestartRequired && isMandatory) {
      restart();
    }
  }, [isRestartRequired, isMandatory]);
}