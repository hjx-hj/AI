import { get } from '@/utils/request';
import { type GpuCard, type ServerInfo, type GpuStatistics, type DailyGpuUsage, GpuStatusEnum } from '@/types/resource';
import { type PageRes } from '@/types/index';

export const getGpuList = (params: { pageNum: number; pageSize: number; status?: GpuStatusEnum; serverId?: string }): Promise<{ data: PageRes<GpuCard> }> => {
  return get('/gpus', params);
};

export const getGpuStatistics = (): Promise<{ data: GpuStatistics }> => {
  return get('/gpus/statistics');
};

export const getServerList = (): Promise<{ data: ServerInfo[] }> => {
  return get('/servers');
};

export const getGpuUsage = (): Promise<{ data: DailyGpuUsage[] }> => {
  return get('/gpus/usage');
};