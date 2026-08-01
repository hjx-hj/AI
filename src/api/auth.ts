import { get, post } from '@/utils/request';
import { type LoginParams, type LoginRes, type UserInfo } from '@/types/auth';

export const login = (params: LoginParams): Promise<{ data: LoginRes }> => {
  return post('/auth/login', params);
};

export const getUserInfo = (): Promise<{ data: UserInfo }> => {
  return get('/auth/info');
};

export const logout = (): Promise<{ data: null }> => {
  return post('/auth/logout');
};