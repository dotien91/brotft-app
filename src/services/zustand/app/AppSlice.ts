import {StoreSlice} from '@zustand';

export interface AppState {
  isWalkthroughAvailable: boolean;
  setWalkthrough: (value: boolean) => void;
  isDarkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
  adsSdkInitialized: boolean;
  setAdsSdkInitialized: (value: boolean) => void;
  adsSdkInitAttempted: boolean;
  setAdsSdkInitAttempted: (value: boolean) => void;
  hasTrackingPermission: boolean;
  setHasTrackingPermission: (value: boolean) => void;
}

const createAppSlice: StoreSlice<AppState> = set => ({
  isWalkthroughAvailable: true,
  setWalkthrough: (value: boolean) => set({isWalkthroughAvailable: value}),
  isDarkMode: true,
  setDarkMode: (value: boolean) => set({isDarkMode: value}),
  language: 'en',
  setLanguage: (value: string) => set({language: value}),
  adsSdkInitialized: false,
  setAdsSdkInitialized: (value: boolean) => set({adsSdkInitialized: value}),
  adsSdkInitAttempted: false,
  setAdsSdkInitAttempted: (value: boolean) => set({adsSdkInitAttempted: value}),
  hasTrackingPermission: false,
  setHasTrackingPermission: (value: boolean) => set({hasTrackingPermission: value}),
});

export default createAppSlice;
