import AsyncStorage from '@react-native-async-storage/async-storage';

// AsyncStorage wrapper with compatible interface
// All methods are async but can be used with await
const LocalStorage = {
  set: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.warn('LocalStorage.set failed:', error);
    }
  },
  getString: async (key: string): Promise<string | undefined> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ?? undefined;
    } catch (error) {
      console.warn('LocalStorage.getString failed:', error);
      return undefined;
    }
  },
  delete: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.warn('LocalStorage.delete failed:', error);
    }
  },
  contains: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.warn('LocalStorage.contains failed:', error);
      return false;
    }
  },
  clearAll: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.warn('LocalStorage.clearAll failed:', error);
    }
  },
};

export default LocalStorage;
