export interface ResData<T = unknown> {
  code: number;
  message: string;
  data: T;
}

export interface PageParams {
  pageNum: number;
  pageSize: number;
}

export interface PageRes<T = unknown> {
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}

export interface TableColumn<T> {
  title: string;
  dataIndex: keyof T;
  key: string;
  width?: number;
  ellipsis?: boolean;
  render?: (text: unknown, record: T, index: number) => React.ReactNode;
}

export interface MenuItem {
  id: string;
  name: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  permission?: string;
}

export type ThemeType = 'light' | 'dark';

export interface WatermarkConfig {
  text: string;
  fontSize?: number;
  color?: string;
  opacity?: number;
  rotate?: number;
}

export interface StatCard {
  title: string;
  value: number | string;
  unit?: string;
  trend?: number;
  icon: string;
  color: string;
}