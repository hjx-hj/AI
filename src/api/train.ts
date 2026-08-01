import { get, post } from '@/utils/request';
import { type TrainingTask, type CreateTaskParams, type TrainingLog, type TrainingMetric, TaskStatusEnum } from '@/types/train';
import { type PageRes } from '@/types/index';

export const getTaskList = (params: { pageNum: number; pageSize: number; status?: TaskStatusEnum; keyword?: string }): Promise<{ data: PageRes<TrainingTask> }> => {
  return get('/tasks', params);
};

export const createTask = (params: CreateTaskParams): Promise<{ data: TrainingTask }> => {
  return post('/tasks', params);
};

export const startTask = (id: string): Promise<{ data: TrainingTask }> => {
  return post(`/tasks/${id}/start`);
};

export const pauseTask = (id: string): Promise<{ data: TrainingTask }> => {
  return post(`/tasks/${id}/pause`);
};

export const stopTask = (id: string): Promise<{ data: TrainingTask }> => {
  return post(`/tasks/${id}/stop`);
};

export const getTaskLogs = (id: string): Promise<{ data: TrainingLog[] }> => {
  return get(`/tasks/${id}/logs`);
};

export const getTaskMetrics = (id: string): Promise<{ data: TrainingMetric[] }> => {
  return get(`/tasks/${id}/metrics`);
};