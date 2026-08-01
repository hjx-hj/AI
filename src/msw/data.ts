import { type UserInfo, type RoleInfo } from '@/types/auth';
import { type TrainingTask, TaskStatusEnum } from '@/types/train';
import { type GpuCard, GpuStatusEnum, type ServerInfo, type GpuStatistics } from '@/types/resource';

const now = () => {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
};

export const mockUser: UserInfo = {
  id: '1',
  username: 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: '',
  roleIds: ['1'],
  permissions: [
    'user:view', 'user:add', 'user:edit', 'user:delete',
    'role:view', 'role:add', 'role:edit', 'role:delete',
    'task:view', 'task:add', 'task:start', 'task:pause', 'task:stop',
    'gpu:view', 'gpu:allocate', 'export', 'fullscreen',
  ],
  status: 1,
  createTime: now(),
};

export const mockUsers: UserInfo[] = [
  mockUser,
  {
    id: '2',
    username: 'developer',
    nickname: '开发人员',
    email: 'dev@example.com',
    phone: '13800138001',
    avatar: '',
    roleIds: ['2'],
    permissions: ['task:view', 'task:add', 'gpu:view'],
    status: 1,
    createTime: now(),
  },
  {
    id: '3',
    username: 'viewer',
    nickname: '查看用户',
    email: 'viewer@example.com',
    phone: '13800138002',
    avatar: '',
    roleIds: ['3'],
    permissions: ['task:view', 'gpu:view'],
    status: 1,
    createTime: now(),
  },
];

export const mockRoles: RoleInfo[] = [
  {
    id: '1',
    name: '超级管理员',
    code: 'admin',
    description: '拥有所有权限',
    menus: ['dashboard', 'system', 'train', 'resource'],
    permissions: [
      'user:view', 'user:add', 'user:edit', 'user:delete',
      'role:view', 'role:add', 'role:edit', 'role:delete',
      'task:view', 'task:add', 'task:start', 'task:pause', 'task:stop',
      'gpu:view', 'gpu:allocate', 'export', 'fullscreen',
    ],
    status: 1,
    createTime: now(),
  },
  {
    id: '2',
    name: '开发人员',
    code: 'developer',
    description: '可以创建和查看任务',
    menus: ['dashboard', 'train'],
    permissions: ['task:view', 'task:add', 'gpu:view'],
    status: 1,
    createTime: now(),
  },
  {
    id: '3',
    name: '查看用户',
    code: 'viewer',
    description: '只能查看数据',
    menus: ['dashboard'],
    permissions: ['task:view', 'gpu:view'],
    status: 1,
    createTime: now(),
  },
];

export const mockTasks: TrainingTask[] = [
  {
    id: '1',
    name: 'ResNet50图像分类训练',
    modelName: 'ResNet50',
    dataset: 'ImageNet',
    status: TaskStatusEnum.RUNNING,
    progress: 65,
    gpuCount: 4,
    gpuIds: ['gpu-1', 'gpu-2', 'gpu-3', 'gpu-4'],
    startTime: now(),
    duration: '4小时30分',
    loss: 0.234,
    accuracy: 0.921,
    learningRate: 0.001,
    batchSize: 256,
    epochs: 100,
    currentEpoch: 65,
    createdBy: 'admin',
    createTime: now(),
  },
  {
    id: '2',
    name: 'BERT文本分类训练',
    modelName: 'BERT-base',
    dataset: 'GLUE',
    status: TaskStatusEnum.COMPLETED,
    progress: 100,
    gpuCount: 2,
    gpuIds: ['gpu-5', 'gpu-6'],
    startTime: now(),
    endTime: now(),
    duration: '8小时30分',
    loss: 0.123,
    accuracy: 0.956,
    learningRate: 0.0001,
    batchSize: 128,
    epochs: 50,
    currentEpoch: 50,
    createdBy: 'developer',
    createTime: now(),
  },
  {
    id: '3',
    name: 'YOLOv8目标检测训练',
    modelName: 'YOLOv8',
    dataset: 'COCO',
    status: TaskStatusEnum.PENDING,
    progress: 0,
    gpuCount: 8,
    gpuIds: [],
    startTime: '',
    duration: '0秒',
    loss: 0,
    accuracy: 0,
    learningRate: 0.01,
    batchSize: 64,
    epochs: 300,
    currentEpoch: 0,
    createdBy: 'admin',
    createTime: now(),
  },
  {
    id: '4',
    name: 'GPT-2文本生成训练',
    modelName: 'GPT-2',
    dataset: 'WikiText',
    status: TaskStatusEnum.PAUSED,
    progress: 45,
    gpuCount: 4,
    gpuIds: ['gpu-7', 'gpu-8', 'gpu-9', 'gpu-10'],
    startTime: now(),
    duration: '6小时20分',
    loss: 1.234,
    accuracy: 0.789,
    learningRate: 0.0005,
    batchSize: 32,
    epochs: 200,
    currentEpoch: 90,
    createdBy: 'developer',
    createTime: now(),
  },
];

export const mockServers: ServerInfo[] = [
  { id: 'server-1', name: 'GPU服务器-01', ip: '192.168.1.101', location: '机房A-01', gpuCount: 8, totalGpuMemory: 640, usedGpuMemory: 480, status: 'online' },
  { id: 'server-2', name: 'GPU服务器-02', ip: '192.168.1.102', location: '机房A-02', gpuCount: 8, totalGpuMemory: 640, usedGpuMemory: 280, status: 'online' },
  { id: 'server-3', name: 'GPU服务器-03', ip: '192.168.1.103', location: '机房B-01', gpuCount: 4, totalGpuMemory: 320, usedGpuMemory: 320, status: 'online' },
];

export const mockGpus: GpuCard[] = [
  { id: 'gpu-1', name: 'GPU-01', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 72, memoryUsage: 90, temperature: 78, utilization: 95, status: GpuStatusEnum.BUSY, currentTaskId: '1', currentTaskName: 'ResNet50图像分类训练' },
  { id: 'gpu-2', name: 'GPU-02', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 70, memoryUsage: 88, temperature: 75, utilization: 92, status: GpuStatusEnum.BUSY, currentTaskId: '1', currentTaskName: 'ResNet50图像分类训练' },
  { id: 'gpu-3', name: 'GPU-03', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 75, memoryUsage: 94, temperature: 80, utilization: 98, status: GpuStatusEnum.FULL, currentTaskId: '1', currentTaskName: 'ResNet50图像分类训练' },
  { id: 'gpu-4', name: 'GPU-04', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 68, memoryUsage: 85, temperature: 72, utilization: 88, status: GpuStatusEnum.BUSY, currentTaskId: '1', currentTaskName: 'ResNet50图像分类训练' },
  { id: 'gpu-5', name: 'GPU-05', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 0, memoryUsage: 0, temperature: 35, utilization: 0, status: GpuStatusEnum.IDLE },
  { id: 'gpu-6', name: 'GPU-06', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 0, memoryUsage: 0, temperature: 36, utilization: 0, status: GpuStatusEnum.IDLE },
  { id: 'gpu-7', name: 'GPU-07', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 45, memoryUsage: 56, temperature: 65, utilization: 45, status: GpuStatusEnum.BUSY, currentTaskId: '4', currentTaskName: 'GPT-2文本生成训练' },
  { id: 'gpu-8', name: 'GPU-08', model: 'NVIDIA A100', serverId: 'server-1', serverName: 'GPU服务器-01', totalMemory: 80, usedMemory: 42, memoryUsage: 53, temperature: 62, utilization: 42, status: GpuStatusEnum.BUSY, currentTaskId: '4', currentTaskName: 'GPT-2文本生成训练' },
  { id: 'gpu-9', name: 'GPU-09', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 35, memoryUsage: 44, temperature: 58, utilization: 38, status: GpuStatusEnum.BUSY, currentTaskId: '4', currentTaskName: 'GPT-2文本生成训练' },
  { id: 'gpu-10', name: 'GPU-10', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 32, memoryUsage: 40, temperature: 55, utilization: 35, status: GpuStatusEnum.BUSY, currentTaskId: '4', currentTaskName: 'GPT-2文本生成训练' },
  { id: 'gpu-11', name: 'GPU-11', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 0, memoryUsage: 0, temperature: 34, utilization: 0, status: GpuStatusEnum.IDLE },
  { id: 'gpu-12', name: 'GPU-12', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 0, memoryUsage: 0, temperature: 33, utilization: 0, status: GpuStatusEnum.IDLE },
  { id: 'gpu-13', name: 'GPU-13', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 80, memoryUsage: 100, temperature: 85, utilization: 100, status: GpuStatusEnum.FULL },
  { id: 'gpu-14', name: 'GPU-14', model: 'NVIDIA H100', serverId: 'server-2', serverName: 'GPU服务器-02', totalMemory: 80, usedMemory: 80, memoryUsage: 100, temperature: 88, utilization: 100, status: GpuStatusEnum.FULL },
  { id: 'gpu-15', name: 'GPU-15', model: 'NVIDIA RTX 4090', serverId: 'server-3', serverName: 'GPU服务器-03', totalMemory: 24, usedMemory: 24, memoryUsage: 100, temperature: 78, utilization: 100, status: GpuStatusEnum.FULL },
  { id: 'gpu-16', name: 'GPU-16', model: 'NVIDIA RTX 4090', serverId: 'server-3', serverName: 'GPU服务器-03', totalMemory: 24, usedMemory: 24, memoryUsage: 100, temperature: 80, utilization: 100, status: GpuStatusEnum.FULL },
];

export const mockGpuStatistics: GpuStatistics = {
  total: 16,
  idle: 4,
  busy: 8,
  full: 4,
  offline: 0,
  totalMemory: 1288,
  usedMemory: 787,
  utilizationRate: 61,
};

export const mockTrainingLogs = [
  { id: '1', taskId: '1', timestamp: now(), level: 'info' as const, message: 'Epoch 65/100 - Training started' },
  { id: '2', taskId: '1', timestamp: now(), level: 'info' as const, message: 'Batch 0/1000 - Loss: 0.234, Accuracy: 0.921' },
  { id: '3', taskId: '1', timestamp: now(), level: 'success' as const, message: 'Validation completed - Val Loss: 0.289, Val Accuracy: 0.902' },
  { id: '4', taskId: '1', timestamp: now(), level: 'warn' as const, message: 'Learning rate adjusted to 0.0005' },
];

export const mockTrainingMetrics = Array.from({ length: 20 }, (_, i) => ({
  time: `12:${String(i * 3).padStart(2, '0')}`,
  loss: 0.5 - i * 0.015,
  accuracy: 0.7 + i * 0.01,
  valLoss: 0.55 - i * 0.012,
  valAccuracy: 0.68 + i * 0.009,
  learningRate: 0.001 * Math.pow(0.95, i),
}));

export const mockDailyGpuUsage = Array.from({ length: 7 }, (_, i) => ({
  date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  totalUsage: 1500 + Math.random() * 500,
  avgUtilization: 50 + Math.random() * 30,
  activeGpus: 8 + Math.floor(Math.random() * 6),
}));