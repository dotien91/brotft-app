import axiosInstance from './axios';
import LocalStorage from '@local-storage';

// Map language codes to locale codes
const getLocaleFromLanguage = (language: string): string => {
  const localeMap: Record<string, string> = {
    'en': 'en_us',
    'vi': 'vi_vn',
    'zh-CN': 'zh_cn',
    'tr-TR': 'tr_tr',
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

// Check and fetch data by locale (common function for App and Settings)
export const checkAndFetchDataByLocale = async (language: string): Promise<boolean> => {
  if (!language) {
    return false;
  }

  const locale = getLocaleFromLanguage(language);

  // Check if data exists in storage
  const unitsKey = `data_units_${locale}`;
  const itemsKey = `data_items_${locale}`;
  const traitsKey = `data_traits_${locale}`;
  const augmentsKey = `data_augments_${locale}`;

  const hasUnits = LocalStorage.getString(unitsKey);
  const hasItems = LocalStorage.getString(itemsKey);
  const hasTraits = LocalStorage.getString(traitsKey);
  const hasAugments = LocalStorage.getString(augmentsKey);

  // If all data exists, return early
  if (hasUnits && hasItems && hasTraits && hasAugments) {

    return true;
  }


  // If any data is missing, fetch all data
  try {
    const data = await fetchAllDataByLocale(language);
    saveDataToStorage(locale, data);
    return true;
  } catch (error) {
    return false;
  }
};

