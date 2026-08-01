import { get } from '@/utils/request';

export interface DashboardOverview {
  statCards: Array<{
    title: string;
    value: number;
    unit: string;
    trend: number;
    icon: string;
    color: string;
  }>;
  gpuUsage: Array<{
    name: string;
    value: number;
  }>;
}

export const getDashboardOverview = (): Promise<{ data: DashboardOverview }> => {
  return get('/dashboard/overview');
};