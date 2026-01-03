import {useEffect, useRef} from 'react';
import {trackScreen} from '@services/api/screen-tracking';

/**
 * Hook to track screen views
 * @param screenName - Name of the screen to track
 */
export const useScreenTracking = (screenName: string) => {
  const hasTracked = useRef(false);

  useEffect(() => {
    // Only track once when screen mounts/focuses
    if (!hasTracked.current && screenName) {
      hasTracked.current = true;
      trackScreen(screenName).catch(error => {
        // Silently handle errors - tracking shouldn't break the app
        console.warn('Screen tracking error:', error);
      });
    }

    // Reset tracking flag when screen name changes (e.g., navigation with params)
    return () => {
      hasTracked.current = false;
    };
  }, [screenName]);
};

