import axiosInstance from './axios';
import {getDeviceId} from '../device-id';
import {getCurrentVersion} from '../version-check';

export interface IScreenTrackingRequest {
  screenName: string;
  deviceId: string;
  appVersion: string;
}

export interface IScreenTrackingResponse {
  success: boolean;
  message?: string;
}

/**
 * Track a screen view
 * @param screenName - Name of the screen being viewed
 */
export const trackScreen = async (
  screenName: string,
): Promise<IScreenTrackingResponse> => {
  if (__DEV__) {
    // Skip tracking in development to avoid polluting analytics
    return {
      success: true,
      message: 'Skipped tracking in development',
    };
  }
  try {
    const response = await axiosInstance.post<IScreenTrackingResponse>(
      '/screen-trackings',
      {
        screenName,
        deviceId: getDeviceId(),
        appVersion: getCurrentVersion() || '0.0.0',
      } as IScreenTrackingRequest,
    );
    return response.data;
  } catch (error: any) {
    // Silently fail tracking - don't disrupt user experience
    console.warn('Screen tracking failed:', error?.message);
    return {
      success: false,
      message: error?.message || 'Tracking failed',
    };
  }
};

