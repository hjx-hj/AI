export enum GpuStatusEnum {
  IDLE = 'idle',
  BUSY = 'busy',
  FULL = 'full',
  OFFLINE = 'offline',
}

export const GpuStatusMap: Record<GpuStatusEnum, string> = {
  [GpuStatusEnum.IDLE]: '空闲',
  [GpuStatusEnum.BUSY]: '占用中',
  [GpuStatusEnum.FULL]: '满载',
  [GpuStatusEnum.OFFLINE]: '离线',
};

export const GpuStatusColorMap: Record<GpuStatusEnum, string> = {
  [GpuStatusEnum.IDLE]: 'success',
  [GpuStatusEnum.BUSY]: 'processing',
  [GpuStatusEnum.FULL]: 'error',
  [GpuStatusEnum.OFFLINE]: 'default',
};

export interface GpuCard {
  id: string;
  name: string;
  model: string;
  serverId: string;
  serverName: string;
  totalMemory: number;
  usedMemory: number;
  memoryUsage: number;
  temperature: number;
  utilization: number;
  status: GpuStatusEnum;
  currentTaskId?: string;
  currentTaskName?: string;
}

export interface ServerInfo {
  id: string;
  name: string;
  ip: string;
  location: string;
  gpuCount: number;
  totalGpuMemory: number;
  usedGpuMemory: number;
  status: 'online' | 'offline';
}

export interface GpuListParams {
  pageNum: number;
  pageSize: number;
  status?: GpuStatusEnum;
  serverId?: string;
}

export interface GpuStatistics {
  total: number;
  idle: number;
  busy: number;
  full: number;
  offline: number;
  totalMemory: number;
  usedMemory: number;
  utilizationRate: number;
}

export interface DailyGpuUsage {
  date: string;
  totalUsage: number;
  avgUtilization: number;
  activeGpus: number;
}