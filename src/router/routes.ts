import { lazy, type ComponentType } from 'react';

const Login = lazy(() => import('@/pages/login/Login').then((m) => ({ default: m.Login })));
const Dashboard = lazy(() => import('@/pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })));
const UserList = lazy(() => import('@/pages/system/user/UserList').then((m) => ({ default: m.UserList })));
const RoleList = lazy(() => import('@/pages/system/role/RoleList').then((m) => ({ default: m.RoleList })));
const TaskList = lazy(() => import('@/pages/train/task/TaskList').then((m) => ({ default: m.TaskList })));
const GpuList = lazy(() => import('@/pages/resource/gpu/GpuList').then((m) => ({ default: m.GpuList })));
const NotFound = lazy(() => import('@/pages/404/NotFound').then((m) => ({ default: m.NotFound })));

export interface RouteItem {
  path: string;
  element: ComponentType<unknown>;
  meta: {
    title: string;
    icon?: string;
    parentTitle?: string;
    hidden?: boolean;
    permission?: string;
    requiresAuth?: boolean;
  };
  children?: RouteItem[];
}

export const routes: RouteItem[] = [
  {
    path: '/login',
    element: Login,
    meta: { title: '登录', hidden: true, requiresAuth: false },
  },
  {
    path: '/',
    element: Dashboard,
    meta: { title: '首页', icon: 'Home', requiresAuth: true },
  },
  {
    path: '/system/user',
    element: UserList,
    meta: { title: '用户管理', icon: 'User', parentTitle: '系统管理', requiresAuth: true, permission: 'user:view' },
  },
  {
    path: '/system/role',
    element: RoleList,
    meta: { title: '角色管理', icon: 'Team', parentTitle: '系统管理', requiresAuth: true, permission: 'role:view' },
  },
  {
    path: '/train/task',
    element: TaskList,
    meta: { title: '任务管理', icon: 'PlayCircle', parentTitle: '训练任务', requiresAuth: true, permission: 'task:view' },
  },
  {
    path: '/resource/gpu',
    element: GpuList,
    meta: { title: 'GPU管理', icon: 'BarChart3', parentTitle: '资源管理', requiresAuth: true, permission: 'gpu:view' },
  },
  {
    path: '/404',
    element: NotFound,
    meta: { title: '无权限', hidden: true, requiresAuth: false },
  },
  {
    path: '*',
    element: NotFound,
    meta: { title: '页面不存在', hidden: true, requiresAuth: false },
  },
];

export const menuRoutes = routes.filter((route) => !route.meta.hidden);