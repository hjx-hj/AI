import { mockUser, mockUsers, mockRoles, mockTasks, mockGpus, mockServers, mockGpuStatistics, mockDailyGpuUsage } from './data';
import { TaskStatusEnum } from '@/types/train';
import { GpuStatusEnum } from '@/types/resource';

export const mockResponse = (url: string, method: string, data?: unknown) => {
  const path = url.replace('/api', '');
  const body = data as Record<string, unknown> | undefined;

  // 登录
  if (method === 'POST' && path === '/auth/login') {
    const { username, password } = (body as { username: string; password: string }) || {};
    const user = mockUsers.find((u) => u.username === username && u.roleIds.length > 0);
    if (!user || password !== '123456') {
      return { code: 401, message: '用户名或密码错误', data: null };
    }
    return { code: 200, message: '登录成功', data: { token: 'mock-token-' + user.id, user } };
  }

  // 获取用户信息
  if (method === 'GET' && path === '/auth/info') {
    return { code: 200, message: '获取用户信息成功', data: mockUser };
  }

  // 退出登录
  if (method === 'POST' && path === '/auth/logout') {
    return { code: 200, message: '退出成功', data: null };
  }

  // 用户列表
  if (method === 'GET' && path === '/users') {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const pageNum = parseInt(params.get('pageNum') || '1');
    const pageSize = parseInt(params.get('pageSize') || '10');
    const keyword = params.get('keyword') || '';
    let filtered = mockUsers;
    if (keyword) {
      filtered = filtered.filter((u) => u.username.includes(keyword) || u.nickname.includes(keyword));
    }
    const total = filtered.length;
    const list = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return { code: 200, message: '获取用户列表成功', data: { list, total, pageNum, pageSize } };
  }

  // 仪表盘
  if (method === 'GET' && path === '/dashboard/overview') {
    return {
      code: 200,
      message: '获取仪表盘概览成功',
      data: {
        statCards: [
          { title: '总训练任务', value: 128, unit: '个', trend: 12.5, icon: 'TaskSquare', color: '#1890ff' },
          { title: '运行中任务', value: 24, unit: '个', trend: 5.2, icon: 'PlayCircle', color: '#52c41a' },
          { title: 'GPU总数', value: 64, unit: '张', trend: 0, icon: 'Monitor', color: '#722ed1' },
          { title: 'GPU利用率', value: 68, unit: '%', trend: -2.3, icon: 'BarChart3', color: '#fa8c16' },
        ],
        gpuUsage: [
          { name: 'GPU-01', value: 95 },
          { name: 'GPU-02', value: 88 },
          { name: 'GPU-03', value: 92 },
          { name: 'GPU-04', value: 75 },
          { name: 'GPU-05', value: 60 },
        ],
      },
    };
  }

  // 角色列表
  if (method === 'GET' && path === '/roles') {
    return { code: 200, message: '获取角色列表成功', data: mockRoles };
  }

  // 任务列表
  if (method === 'GET' && path === '/tasks') {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const pageNum = parseInt(params.get('pageNum') || '1');
    const pageSize = parseInt(params.get('pageSize') || '10');
    const status = params.get('status') as TaskStatusEnum | null;
    const keyword = params.get('keyword') || '';
    let filtered = mockTasks;
    if (status) filtered = filtered.filter((t) => t.status === status);
    if (keyword) filtered = filtered.filter((t) => t.name.includes(keyword) || t.modelName.includes(keyword));
    const total = filtered.length;
    const list = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return { code: 200, message: '获取任务列表成功', data: { list, total, pageNum, pageSize } };
  }

  // GPU 列表
  if (method === 'GET' && path === '/gpus') {
    const params = new URLSearchParams(url.split('?')[1] || '');
    const pageNum = parseInt(params.get('pageNum') || '1');
    const pageSize = parseInt(params.get('pageSize') || '10');
    const status = params.get('status') as GpuStatusEnum | null;
    let filtered = mockGpus;
    if (status) filtered = filtered.filter((g) => g.status === status);
    const total = filtered.length;
    const list = filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize);
    return { code: 200, message: '获取GPU列表成功', data: { list, total, pageNum, pageSize } };
  }

  // GPU 统计
  if (method === 'GET' && path === '/gpus/statistics') {
    return { code: 200, message: '获取GPU统计信息成功', data: mockGpuStatistics };
  }

  // GPU 使用
  if (method === 'GET' && path === '/gpus/usage') {
    return { code: 200, message: '获取GPU使用统计成功', data: mockDailyGpuUsage };
  }

  // 服务器列表
  if (method === 'GET' && path === '/servers') {
    return { code: 200, message: '获取服务器列表成功', data: mockServers };
  }

  return null;
};
