import axiosInstance from './axios'; // Đảm bảo đường dẫn đúng
import LocalStorage from '@services/local-storage'; // Đảm bảo đường dẫn đúng

// ==========================================
// 1. TYPES & CONSTANTS
// ==========================================

// Cấu trúc Cache lưu trên RAM
interface DataCache {
  locale: string | null;
  units: Record<string, any>;
  items: Record<string, any>;
  traits: Record<string, any>;
  augments: Record<string, any>;
}

// Biến toàn cục (Module-Level Cache)
// Tồn tại suốt vòng đời App, giúp truy xuất tức thì mà không cần đọc Disk
const MEMORY_CACHE: DataCache = {
  locale: null,
  units: {},
  items: {},
  traits: {},
  augments: {},
};

// Helper sinh Key lưu LocalStorage
const DATA_KEYS = {
  units: (locale: string) => `data_units_${locale}`,
  items: (locale: string) => `data_items_${locale}`,
  traits: (locale: string) => `data_traits_${locale}`,
  augments: (locale: string) => `data_augments_${locale}`,
} as const;

export const getLocaleFromLanguage = (language: string): string => {
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

// ==========================================
// 2. PRIVATE HELPERS
// ==========================================

const parseJson = (raw: string | undefined | null): Record<string, any> => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
};

// Hàm quan trọng: Chuyển Array -> Object để truy vấn O(1)
export const arrayToObject = <T>(array: T[], keyField: keyof T): Record<string, T> => {
  if (!Array.isArray(array) || array.length === 0) return {};
  return array.reduce((acc, item) => {
    const key = String(item[keyField]);
    if (key && key !== 'null' && key !== 'undefined') {
      acc[key] = item;
    }
    return acc;
  }, {} as Record<string, T>);
};

/**
 * Hàm nạp dữ liệu: Kiểm tra RAM -> Nếu thiếu thì đọc từ LocalStorage -> Parse JSON -> Lưu vào RAM
 * Hàm này đảm bảo MEMORY_CACHE luôn có dữ liệu (nếu đã từng tải về).
 */
const ensureCacheIsWarm = (locale: string) => {
  // 1. Nếu cache RAM đã có đúng locale và có dữ liệu -> Return ngay (Nhanh nhất)
  if (MEMORY_CACHE.locale === locale && Object.keys(MEMORY_CACHE.units).length > 0) {
    return;
  }

  // 2. Nếu chưa có hoặc đổi ngôn ngữ -> Đọc từ Disk (Chậm hơn xíu, nhưng chỉ làm 1 lần)
  // console.log(`[Cache] Loading from Disk to RAM for: ${locale}`);
  
  MEMORY_CACHE.locale = locale;
  MEMORY_CACHE.units = parseJson(LocalStorage.getString(DATA_KEYS.units(locale)));
  MEMORY_CACHE.items = parseJson(LocalStorage.getString(DATA_KEYS.items(locale)));
  MEMORY_CACHE.traits = parseJson(LocalStorage.getString(DATA_KEYS.traits(locale)));
  MEMORY_CACHE.augments = parseJson(LocalStorage.getString(DATA_KEYS.augments(locale)));
};

// ==========================================
// 3. FETCHING LOGIC
// ==========================================

export const fetchAllDataByLocale = async (language: string) => {
  const locale = getLocaleFromLanguage(language);
  const [units, items, traits, augments] = await Promise.all([
    axiosInstance.get(`/data/units/${locale}`).then(res => res.data),
    axiosInstance.get(`/data/items/${locale}`).then(res => res.data),
    axiosInstance.get(`/data/traits/${locale}`).then(res => res.data),
    axiosInstance.get(`/data/augments/${locale}`).then(res => res.data),
  ]);
  return { units, items, traits, augments };
};

// Biến giữ Promise để tránh gọi API trùng lặp khi component mount nhiều lần
let fetchingPromise: Promise<boolean> | null = null;

export const checkAndFetchDataByLocale = async (language: string): Promise<boolean> => {
  if (!language) return false;
  const locale = getLocaleFromLanguage(language);

  // B1: Nạp cache từ Disk (nếu có)
  ensureCacheIsWarm(locale);

  // B2: Kiểm tra xem đã đủ dữ liệu chưa
  const hasData = 
    Object.keys(MEMORY_CACHE.units).length > 0 &&
    Object.keys(MEMORY_CACHE.items).length > 0;

  if (hasData) {
    return true; // Đã có data, không cần fetch
  }

  // B3: Nếu chưa có, Fetch từ API
  if (fetchingPromise) return fetchingPromise; // Nếu đang fetch dở thì đợi cái cũ

  fetchingPromise = (async () => {
    try {
      console.log(`[Data] Fetching from API for: ${locale}...`);
      const rawData = await fetchAllDataByLocale(language);
      
      if (!rawData) return false;

      // TRANSFORM: Chuyển Array -> Object Map
      const unitsMap = arrayToObject(rawData.units, 'apiName');
      const itemsMap = arrayToObject(rawData.items, 'apiName');
      const traitsMap = arrayToObject(rawData.traits, 'apiName');
      const augmentsMap = arrayToObject(rawData.augments, 'apiName');

      // SAVE: Lưu xuống Disk (Persist)
      LocalStorage.set(DATA_KEYS.units(locale), JSON.stringify(unitsMap));
      LocalStorage.set(DATA_KEYS.items(locale), JSON.stringify(itemsMap));
      LocalStorage.set(DATA_KEYS.traits(locale), JSON.stringify(traitsMap));
      LocalStorage.set(DATA_KEYS.augments(locale), JSON.stringify(augmentsMap));

      // UPDATE MEMORY: Cập nhật RAM ngay lập tức (Hot Update)
      MEMORY_CACHE.locale = locale;
      MEMORY_CACHE.units = unitsMap;
      MEMORY_CACHE.items = itemsMap;
      MEMORY_CACHE.traits = traitsMap;
      MEMORY_CACHE.augments = augmentsMap;

      console.log(`[Data] Saved & Cached for ${locale}`);
      return true;
    } catch (error) {
      console.error("Error fetching data:", error);
      return false;
    } finally {
      fetchingPromise = null;
    }
  })();

  return fetchingPromise;
};

// ==========================================
// 4. PUBLIC ACCESSORS (GETTERS)
// ==========================================

export const getCachedUnits = () => {
  return MEMORY_CACHE.units;
};

export const getCachedItems = () => {
  return MEMORY_CACHE.items;
};

export const getCachedTraits = () => {
  console.log("MEMORY_CACHEMEMORY_CACHE", MEMORY_CACHE);
  return MEMORY_CACHE.traits;
};

export const getCachedAugments = () => {
  return MEMORY_CACHE.augments;
};

// ==========================================
// 5. LIFECYCLE HELPER (Fix lỗi undefined)
// ==========================================

/**
 * Hàm này dùng để gọi ở App.tsx hoặc Store khi khởi động.
 * Mục đích: Pre-load dữ liệu từ Disk lên RAM để sẵn sàng sử dụng.
 */
export const initDataCache = (language: string) => {
  if (!language) return;
  const locale = getLocaleFromLanguage(language);
  ensureCacheIsWarm(locale);
};