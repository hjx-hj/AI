import { get, post, put, del } from '@/utils/request';
import { type UserInfo, type CreateUserParams, type UpdateUserParams } from '@/types/auth';
import { type PageRes } from '@/types/index';

export const getUserList = (params: { pageNum: number; pageSize: number; keyword?: string }): Promise<{ data: PageRes<UserInfo> }> => {
  return get('/users', params);
};

export const getUserById = (id: string): Promise<{ data: UserInfo }> => {
  return get(`/users/${id}`);
};

export const createUser = (params: CreateUserParams): Promise<{ data: UserInfo }> => {
  return post('/users', params);
};

export const updateUser = (params: UpdateUserParams): Promise<{ data: UserInfo }> => {
  return put(`/users/${params.id}`, params);
};

export const deleteUser = (id: string): Promise<{ data: null }> => {
  return del(`/users/${id}`);
};