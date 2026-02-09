import axiosInstance from './axios';
import LocalStorage from '@local-storage';

// Map language codes to locale codes
const getLocaleFromLanguage = (language: string): string => {
  const localeMap: Record<string, string> = {
    'en': 'en_us',
    'vi': 'vi_vn',
    'zh-CN': 'zh_cn',
    'tr-TR': 'tr_tr',
    'ja-JP': 'ja_jp',
    'es-ES': 'es_es',
  };
  return localeMap[language] || 'en_us';
};

// Get units data by locale
export const getUnitsByLocale = async (locale: string): Promise<any> => {
  const response = await axiosInstance.get(`/data/units/${locale}`);
  return response.data;
};

// Get items data by locale
export const getItemsByLocale = async (locale: string): Promise<any> => {
  const response = await axiosInstance.get(`/data/items/${locale}`);
  return response.data;
};

// Get traits data by locale
export const getTraitsByLocale = async (locale: string): Promise<any> => {
  const response = await axiosInstance.get(`/data/traits/${locale}`);
  return response.data;
};

// Get augments data by locale
export const getAugmentsByLocale = async (locale: string): Promise<any> => {
  const response = await axiosInstance.get(`/data/augments/${locale}`);
  return response.data;
};

// Helper function to get locale from language
export {getLocaleFromLanguage};

// Fetch all data by locale
export const fetchAllDataByLocale = async (language: string) => {
  const locale = getLocaleFromLanguage(language);
  try {
    const [units, items, traits, augments] = await Promise.all([
      getUnitsByLocale(locale),
      getItemsByLocale(locale),
      getTraitsByLocale(locale),
      getAugmentsByLocale(locale),
    ]);

    return {
      units,
      items,
      traits,
      augments,
    };
  } catch (error) {
    console.error("Error fetching all data by locale:", error);
    throw error;
  }
};

// Save data to storage
const saveDataToStorage = (locale: string, data: any) => {
  if (data.units) {
    LocalStorage.set(`data_units_${locale}`, JSON.stringify(data.units));
  }
  if (data.items) {
    LocalStorage.set(`data_items_${locale}`, JSON.stringify(data.items));
  }
  if (data.traits) {
    LocalStorage.set(`data_traits_${locale}`, JSON.stringify(data.traits));
  }
  if (data.augments) {
    LocalStorage.set(`data_augments_${locale}`, JSON.stringify(data.augments));
  }
};



// --- 1. Helper Function: Chuyển đổi Array sang Object (đặt cùng file) ---
// utils/dataTransform.ts

/**
 * Chuyển đổi mảng thành Object (Dictionary) để truy vấn nhanh O(1).
 * * @param array Mảng dữ liệu nguồn (VD: danh sách tướng, items)
 * @param keyField Tên trường dùng làm key duy nhất (VD: 'apiName', 'id')
 * @returns Object với key là giá trị của keyField, value là item tương ứng
 */
export const arrayToObject = <T>(array: T[], keyField: keyof T): Record<string, T> => {
  // 1. Kiểm tra an toàn đầu vào: Nếu không phải mảng hoặc mảng rỗng thì trả về object rỗng
  if (!Array.isArray(array) || array.length === 0) {
    return {};
  }

  // 2. Sử dụng reduce để biến đổi
  return array.reduce((acc, item) => {
    // Lấy giá trị key và ép kiểu về chuỗi (vì key object luôn là string)
    const key = String(item[keyField]);

    // 3. Chỉ map nếu key tồn tại và hợp lệ (tránh null/undefined biến thành chuỗi "null")
    if (key && key !== 'null' && key !== 'undefined') {
      acc[key] = item;
    }

    return acc;
  }, {} as Record<string, T>);
};
let isFetchingDataRef = false;

// --- 2. Main Function ---
export const checkAndFetchDataByLocale = async (language: string): Promise<boolean> => {
  if (isFetchingDataRef) return false;
  isFetchingDataRef = true;
  if (!language) {
    return false;
  }
  const locale = getLocaleFromLanguage(language);

  // Định nghĩa các Key lưu trong Storage
  const unitsKey = `data_units_${locale}`;
  const itemsKey = `data_items_${locale}`;
  const traitsKey = `data_traits_${locale}`;
  const augmentsKey = `data_augments_${locale}`;

  // Kiểm tra dữ liệu đã tồn tại chưa
  const hasUnits = LocalStorage.getString(unitsKey);
  const hasItems = LocalStorage.getString(itemsKey);
  const hasTraits = LocalStorage.getString(traitsKey);
  const hasAugments = LocalStorage.getString(augmentsKey);

  // Nếu tất cả dữ liệu đã có, không fetch lại (tránh gọi 2 lần khi không đổi ngôn ngữ)
  // if (hasUnits && hasItems && hasTraits && hasAugments) {
  //   return true;
  // }

  try {
    console.log(`[Data] Fetching & Transforming for locale: ${locale}...`);
    
    // 1. Fetch dữ liệu thô (Dạng Array) từ Server
    const rawData = await fetchAllDataByLocale(language);
    console.log('rawData', rawData);
    if (!rawData) return false;

    // 2. Transform: Chuyển Array -> Object (Map) để truy vấn O(1)
    // Key mặc định là 'apiName', bạn có thể đổi nếu data dùng key khác
    // const unitsMap = arrayToObject(rawData.units, 'apiName');
    // const itemsMap = arrayToObject(rawData.items, 'apiName');
    // const traitsMap = arrayToObject(rawData.traits, 'apiName');
    // const augmentsMap = arrayToObject(rawData.augments, 'apiName');

    // // 3. Save: Lưu dữ liệu đã Transform vào LocalStorage
    // // Lưu ý: Dùng JSON.stringify vì LocalStorage chỉ lưu string
    // LocalStorage.set(unitsKey, JSON.stringify(unitsMap));
    // LocalStorage.set(itemsKey, JSON.stringify(itemsMap));
    // LocalStorage.set(traitsKey, JSON.stringify(traitsMap));
    // LocalStorage.set(augmentsKey, JSON.stringify(augmentsMap));

    console.log(`[Data] Successfully saved transformed data for ${locale}`);
    return true;

  } catch (error) {
    console.error("Error fetching or transforming data:", error);
    return false;
  }
};