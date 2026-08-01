import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { storage } from './storage';
import { message } from 'antd';
import { mockResponse } from '@/msw/fallback';

const USE_FALLBACK = import.meta.env.PROD;

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

request.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, message: msg } = response.data as { code: number; message: string; data: unknown };
    if (code === 200) {
      return response;
    }
    message.error(msg || '请求失败');
    return Promise.reject(new Error(msg || '请求失败'));
  },
  async (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
      storage.removeToken();
      storage.removeUser();
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期'));
    }

    // 生产环境 fallback：请求失败时用 mock 数据兜底
    if (USE_FALLBACK && error.config) {
      const { url, method, data } = error.config;
      const result = mockResponse(url, method?.toUpperCase() || 'GET', data);
      if (result) {
        if (result.code !== 200) {
          message.error(result.message);
          return Promise.reject(new Error(result.message));
        }
        return { data: result } as AxiosResponse;
      }
    }

    message.error(error.response?.data?.message || error.message || '网络错误');
    return Promise.reject(error);
  },
);

export const get = <T = unknown>(url: string, params?: unknown): Promise<{ data: T }> => {
  return request.get(url, { params }).then((res) => ({ data: res.data.data }));
};

export const post = <T = unknown>(url: string, data?: unknown): Promise<{ data: T }> => {
  return request.post(url, data).then((res) => ({ data: res.data.data }));
};

export const put = <T = unknown>(url: string, data?: unknown): Promise<{ data: T }> => {
  return request.put(url, data).then((res) => ({ data: res.data.data }));
};

export const del = <T = unknown>(url: string, params?: unknown): Promise<{ data: T }> => {
  return request.delete(url, { params }).then((res) => ({ data: res.data.data }));
};

export default request;