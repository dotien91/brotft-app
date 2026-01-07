import axios, {AxiosRequestConfig} from 'axios';
import {API_BASE_URL} from '@shared-constants';
import {getLocales} from 'react-native-localize';
import useStore from '../zustand/store';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get language and location dynamically
const getLanguageHeader = (): string => {
  try {
    const state = useStore.getState();
    return state.language || 'en';
  } catch (error) {
    return 'en';
  }
};

const getLocationHeader = (): string => {
  try {
    const locales = getLocales();
    if (locales && locales.length > 0 && locales[0].countryCode) {
      return locales[0].countryCode.toUpperCase();
    }
  } catch (error) {
    // Ignore error
  }
  return 'US'; // Default to US
};

// Add request interceptor to include language and location headers
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (!config.headers) {
      config.headers = {};
    }

    // Add language header (x-lang or x-custom-lang)
    const language = getLanguageHeader();
    config.headers['x-lang'] = language;

    // Add location header
    const location = getLocationHeader();
    config.headers['x-location'] = location;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;

