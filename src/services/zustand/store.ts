import create, {StoreApi} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createAppSlice, {AppState} from '@services/zustand/app/AppSlice';
import createUserSlice, {UserState} from '@services/zustand/user/UserSlice';
import {createJSONStorage, persist, StateStorage} from 'zustand/middleware';

export type StoreState = AppState & UserState;
export type StoreSlice<T> = (
  set: StoreApi<StoreState>['setState'],
  get: StoreApi<StoreState>['getState'],
) => T;

const ZustandAsyncStorage: StateStorage = {
  setItem: async (name: string, value: string) => {
    try {
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      console.warn('ZustandAsyncStorage.setItem failed:', error);
    }
  },
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      return value ?? null;
    } catch (error) {
      console.warn('ZustandAsyncStorage.getItem failed:', error);
      return null;
    }
  },
  removeItem: async (name: string) => {
    try {
      await AsyncStorage.removeItem(name);
    } catch (error) {
      console.warn('ZustandAsyncStorage.removeItem failed:', error);
    }
  },
};

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...createAppSlice(set, get),
      ...createUserSlice(set, get),
    }),
    {
      name: 'store',
      storage: createJSONStorage(() => ZustandAsyncStorage),
    },
  ),
);

export default useStore;
