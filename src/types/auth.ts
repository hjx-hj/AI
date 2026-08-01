export enum PermissionEnum {
  USER_VIEW = 'user:view',
  USER_ADD = 'user:add',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  ROLE_VIEW = 'role:view',
  ROLE_ADD = 'role:add',
  ROLE_EDIT = 'role:edit',
  ROLE_DELETE = 'role:delete',
  TASK_VIEW = 'task:view',
  TASK_ADD = 'task:add',
  TASK_START = 'task:start',
  TASK_PAUSE = 'task:pause',
  TASK_STOP = 'task:stop',
  GPU_VIEW = 'gpu:view',
  GPU_ALLOCATE = 'gpu:allocate',
  EXPORT = 'export',
  FULLSCREEN = 'fullscreen',
}

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  email: string;
  phone: string;
  avatar: string;
  roleIds: string[];
  permissions: string[];
  status: number;
  createTime: string;
}

export interface LoginParams {
  username: string;
  password: string;
  remember?: boolean;
}

export interface LoginRes {
  token: string;
  user: UserInfo;
}

export interface RoleInfo {
  id: string;
  name: string;
  code: string;
  description: string;
  menus: string[];
  permissions: string[];
  status: number;
  createTime: string;
}

export interface CreateUserParams {
  username: string;
  password: string;
  nickname: string;
  email: string;
  phone: string;
  roleIds: string[];
  status: number;
}

export interface UpdateUserParams extends Partial<CreateUserParams> {
  id: string;
}

export interface CreateRoleParams {
  name: string;
  code: string;
  description: string;
  menus: string[];
  permissions: string[];
  status: number;
}

export interface UpdateRoleParams extends Partial<CreateRoleParams> {
  id: string;
}