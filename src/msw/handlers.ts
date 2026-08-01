import { http, HttpResponse } from 'msw';
import {
  mockUser,
  mockUsers,
  mockRoles,
  mockTasks,
  mockGpus,
  mockServers,
  mockGpuStatistics,
  mockTrainingLogs,
  mockTrainingMetrics,
  mockDailyGpuUsage,
} from './data';
import { TaskStatusEnum } from '@/types/train';
import { GpuStatusEnum } from '@/types/resource';

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const { username, password } = await request.json() as { username: string; password: string };
    const user = mockUsers.find((u) => u.username === username && u.roleIds.length > 0);
    if (!user || password !== '123456') {
      return HttpResponse.json({
        code: 401,
        message: '用户名或密码错误',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 200,
      message: '登录成功',
      data: {
        token: 'mock-token-' + user.id,
        user,
      },
    });
  }),

  http.get('/api/auth/info', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取用户信息成功',
      data: mockUser,
    });
  }),

  http.post('/api/auth/logout', () => {
    return HttpResponse.json({
      code: 200,
      message: '退出成功',
      data: null,
    });
  }),

  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const keyword = url.searchParams.get('keyword') || '';

    let filtered = mockUsers;
    if (keyword) {
      filtered = filtered.filter((u) => u.username.includes(keyword) || u.nickname.includes(keyword));
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filtered.slice(start, end);

    return HttpResponse.json({
      code: 200,
      message: '获取用户列表成功',
      data: { list, total, pageNum, pageSize },
    });
  }),

  http.get('/api/users/:id', ({ params }) => {
    const user = mockUsers.find((u) => u.id === params.id);
    if (user) {
      return HttpResponse.json({
        code: 200,
        message: '获取用户详情成功',
        data: user,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '用户不存在',
      data: null,
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const data = await request.json() as { username: string; nickname: string };
    const newUser = {
      ...mockUser,
      id: String(Date.now()),
      username: data.username,
      nickname: data.nickname,
      createTime: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return HttpResponse.json({
      code: 200,
      message: '创建用户成功',
      data: newUser,
    });
  }),

  http.put('/api/users/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<typeof mockUser>;
    const index = mockUsers.findIndex((u) => u.id === params.id);
    if (index !== -1) {
      mockUsers[index] = { ...mockUsers[index], ...data };
      return HttpResponse.json({
        code: 200,
        message: '更新用户成功',
        data: mockUsers[index],
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '用户不存在',
      data: null,
    });
  }),

  http.delete('/api/users/:id', ({ params }) => {
    const index = mockUsers.findIndex((u) => u.id === params.id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return HttpResponse.json({
        code: 200,
        message: '删除用户成功',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '用户不存在',
      data: null,
    });
  }),

  http.get('/api/roles', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取角色列表成功',
      data: mockRoles,
    });
  }),

  http.post('/api/roles', async ({ request }) => {
    const data = await request.json() as { name: string; code: string };
    const newRole = {
      ...mockRoles[0],
      id: String(Date.now()),
      name: data.name,
      code: data.code,
      createTime: new Date().toISOString(),
    };
    mockRoles.push(newRole);
    return HttpResponse.json({
      code: 200,
      message: '创建角色成功',
      data: newRole,
    });
  }),

  http.put('/api/roles/:id', async ({ params, request }) => {
    const data = await request.json() as Partial<typeof mockRoles[0]>;
    const index = mockRoles.findIndex((r) => r.id === params.id);
    if (index !== -1) {
      mockRoles[index] = { ...mockRoles[index], ...data };
      return HttpResponse.json({
        code: 200,
        message: '更新角色成功',
        data: mockRoles[index],
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '角色不存在',
      data: null,
    });
  }),

  http.delete('/api/roles/:id', ({ params }) => {
    const index = mockRoles.findIndex((r) => r.id === params.id);
    if (index !== -1) {
      mockRoles.splice(index, 1);
      return HttpResponse.json({
        code: 200,
        message: '删除角色成功',
        data: null,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '角色不存在',
      data: null,
    });
  }),

  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status') as TaskStatusEnum | null;
    const keyword = url.searchParams.get('keyword') || '';

    let filtered = mockTasks;
    if (status) {
      filtered = filtered.filter((t) => t.status === status);
    }
    if (keyword) {
      filtered = filtered.filter((t) => t.name.includes(keyword) || t.modelName.includes(keyword));
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filtered.slice(start, end);

    return HttpResponse.json({
      code: 200,
      message: '获取任务列表成功',
      data: { list, total, pageNum, pageSize },
    });
  }),

  http.post('/api/tasks', async ({ request }) => {
    const data = await request.json() as { name: string; modelName: string; dataset: string };
    const newTask = {
      ...mockTasks[0],
      id: String(Date.now()),
      name: data.name,
      modelName: data.modelName,
      dataset: data.dataset,
      status: TaskStatusEnum.PENDING,
      progress: 0,
      createTime: new Date().toISOString(),
      startTime: '',
      currentEpoch: 0,
      loss: 0,
      accuracy: 0,
    };
    mockTasks.push(newTask);
    return HttpResponse.json({
      code: 200,
      message: '创建任务成功',
      data: newTask,
    });
  }),

  http.post('/api/tasks/:id/start', ({ params }) => {
    const task = mockTasks.find((t) => t.id === params.id);
    if (task) {
      task.status = TaskStatusEnum.RUNNING;
      task.startTime = new Date().toISOString();
      return HttpResponse.json({
        code: 200,
        message: '任务已启动',
        data: task,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '任务不存在',
      data: null,
    });
  }),

  http.post('/api/tasks/:id/pause', ({ params }) => {
    const task = mockTasks.find((t) => t.id === params.id);
    if (task) {
      task.status = TaskStatusEnum.PAUSED;
      return HttpResponse.json({
        code: 200,
        message: '任务已暂停',
        data: task,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '任务不存在',
      data: null,
    });
  }),

  http.post('/api/tasks/:id/stop', ({ params }) => {
    const task = mockTasks.find((t) => t.id === params.id);
    if (task) {
      task.status = TaskStatusEnum.STOPPED;
      task.endTime = new Date().toISOString();
      return HttpResponse.json({
        code: 200,
        message: '任务已终止',
        data: task,
      });
    }
    return HttpResponse.json({
      code: 404,
      message: '任务不存在',
      data: null,
    });
  }),

  http.get('/api/tasks/:id/logs', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取训练日志成功',
      data: mockTrainingLogs,
    });
  }),

  http.get('/api/tasks/:id/metrics', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取训练指标成功',
      data: mockTrainingMetrics,
    });
  }),

  http.get('/api/gpus', ({ request }) => {
    const url = new URL(request.url);
    const pageNum = parseInt(url.searchParams.get('pageNum') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const status = url.searchParams.get('status') as GpuStatusEnum | null;
    const serverId = url.searchParams.get('serverId') || null;

    let filtered = mockGpus;
    if (status) {
      filtered = filtered.filter((g) => g.status === status);
    }
    if (serverId) {
      filtered = filtered.filter((g) => g.serverId === serverId);
    }

    const total = filtered.length;
    const start = (pageNum - 1) * pageSize;
    const end = start + pageSize;
    const list = filtered.slice(start, end);

    return HttpResponse.json({
      code: 200,
      message: '获取GPU列表成功',
      data: { list, total, pageNum, pageSize },
    });
  }),

  http.get('/api/gpus/statistics', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取GPU统计信息成功',
      data: mockGpuStatistics,
    });
  }),

  http.get('/api/servers', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取服务器列表成功',
      data: mockServers,
    });
  }),

  http.get('/api/gpus/usage', () => {
    return HttpResponse.json({
      code: 200,
      message: '获取GPU使用统计成功',
      data: mockDailyGpuUsage,
    });
  }),

  http.get('/api/dashboard/overview', () => {
    return HttpResponse.json({
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
    });
  }),
];