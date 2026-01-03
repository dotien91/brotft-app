import axiosInstance from './axios';

export interface IScreenTrackingRequest {
  screenName: string;
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
  try {
    const response = await axiosInstance.post<IScreenTrackingResponse>(
      '/screen-trackings',
      {
        screenName,
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

