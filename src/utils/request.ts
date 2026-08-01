import axios, { type AxiosInstance, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { storage } from './storage';
import { message } from 'antd';
import { mockRequest } from '@/msw/mockApi';

const USE_MOCK = true;

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

    if (USE_MOCK) {
      const fullUrl = (config.baseURL || '') + (config.url || '');
      const result = mockRequest(fullUrl, config.method?.toUpperCase() || 'GET', config.data);
      if (result) {
        config.adapter = async () => {
          return {
            data: result,
            status: 200,
            statusText: 'OK',
            headers: {},
            config,
          } as AxiosResponse;
        };
      }
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
  (error) => {
    if (error.response?.status === 401) {
      message.error('登录已过期，请重新登录');
      storage.removeToken();
      storage.removeUser();
      window.location.href = '/login';
      return Promise.reject(new Error('登录已过期'));
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
