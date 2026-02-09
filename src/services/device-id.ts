import storage from './local-storage';

const DEVICE_ID_KEY = 'device_id';

const generateId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
};

export const getDeviceId = (): string => {
  try {
    let id = storage.getString(DEVICE_ID_KEY);
    if (!id) {
      id = generateId();
      storage.set(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return generateId();
  }
};
