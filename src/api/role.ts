import { get, post, put, del } from '@/utils/request';
import { type RoleInfo, type CreateRoleParams, type UpdateRoleParams } from '@/types/auth';

export const getRoleList = (): Promise<{ data: RoleInfo[] }> => {
  return get('/roles');
};

export const createRole = (params: CreateRoleParams): Promise<{ data: RoleInfo }> => {
  return post('/roles', params);
};

export const updateRole = (params: UpdateRoleParams): Promise<{ data: RoleInfo }> => {
  return put(`/roles/${params.id}`, params);
};

export const deleteRole = (id: string): Promise<{ data: null }> => {
  return del(`/roles/${id}`);
};