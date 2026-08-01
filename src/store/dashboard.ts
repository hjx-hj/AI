import { create } from 'zustand';
import { type StatCard } from '@/types/index';

interface TrainingMetric {
  time: string;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
}

interface GpuUsageItem {
  name: string;
  value: number;
}

interface RecentTask {
  id: string;
  name: string;
  status: string;
  progress: number;
  createTime: string;
}

interface DashboardState {
  statCards: StatCard[];
  trainingMetrics: TrainingMetric[];
  gpuUsage: GpuUsageItem[];
  recentTasks: RecentTask[];
  setStatCards: (cards: StatCard[]) => void;
  setTrainingMetrics: (metrics: TrainingMetric[]) => void;
  setGpuUsage: (usage: GpuUsageItem[]) => void;
  setRecentTasks: (tasks: RecentTask[]) => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  statCards: [],
  trainingMetrics: [],
  gpuUsage: [],
  recentTasks: [],

  setStatCards: (cards) => set({ statCards: cards }),
  setTrainingMetrics: (metrics) => set({ trainingMetrics: metrics }),
  setGpuUsage: (usage) => set({ gpuUsage: usage }),
  setRecentTasks: (tasks) => set({ recentTasks: tasks }),
}));