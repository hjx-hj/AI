export enum TaskStatusEnum {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
  STOPPED = 'stopped',
}

export const TaskStatusMap: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.PENDING]: '等待中',
  [TaskStatusEnum.RUNNING]: '运行中',
  [TaskStatusEnum.PAUSED]: '已暂停',
  [TaskStatusEnum.COMPLETED]: '已完成',
  [TaskStatusEnum.FAILED]: '失败',
  [TaskStatusEnum.STOPPED]: '已终止',
};

export const TaskStatusColorMap: Record<TaskStatusEnum, string> = {
  [TaskStatusEnum.PENDING]: 'default',
  [TaskStatusEnum.RUNNING]: 'processing',
  [TaskStatusEnum.PAUSED]: 'warning',
  [TaskStatusEnum.COMPLETED]: 'success',
  [TaskStatusEnum.FAILED]: 'error',
  [TaskStatusEnum.STOPPED]: 'default',
};

export interface TrainingTask {
  id: string;
  name: string;
  modelName: string;
  dataset: string;
  status: TaskStatusEnum;
  progress: number;
  gpuCount: number;
  gpuIds: string[];
  startTime: string;
  endTime?: string;
  duration: string;
  loss: number;
  accuracy: number;
  learningRate: number;
  batchSize: number;
  epochs: number;
  currentEpoch: number;
  createdBy: string;
  createTime: string;
}

export interface CreateTaskParams {
  name: string;
  modelName: string;
  dataset: string;
  gpuIds: string[];
  learningRate: number;
  batchSize: number;
  epochs: number;
}

export interface TrainingLog {
  id: string;
  taskId: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
}

export interface TrainingMetric {
  time: string;
  loss: number;
  accuracy: number;
  valLoss: number;
  valAccuracy: number;
  learningRate: number;
}

export interface TaskListParams {
  pageNum: number;
  pageSize: number;
  status?: TaskStatusEnum;
  keyword?: string;
}