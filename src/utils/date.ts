import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

export const formatDate = (date: string | Date, format = 'YYYY-MM-DD HH:mm:ss'): string => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'YYYY-MM-DD HH:mm:ss');
};

export const formatDateShort = (date: string | Date): string => {
  return formatDate(date, 'YYYY-MM-DD');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm:ss');
};

export const formatRelativeTime = (date: string | Date): string => {
  return dayjs(date).fromNow();
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) {
    return `${hours}小时${minutes}分${secs}秒`;
  }
  if (minutes > 0) {
    return `${minutes}分${secs}秒`;
  }
  return `${secs}秒`;
};

export const getToday = (): string => {
  return dayjs().format('YYYY-MM-DD');
};

export const getYesterday = (): string => {
  return dayjs().subtract(1, 'day').format('YYYY-MM-DD');
};

export const getWeekStart = (): string => {
  return dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD');
};

export const getWeekEnd = (): string => {
  return dayjs().endOf('week').add(1, 'day').format('YYYY-MM-DD');
};

export const getMonthStart = (): string => {
  return dayjs().startOf('month').format('YYYY-MM-DD');
};

export const getMonthEnd = (): string => {
  return dayjs().endOf('month').format('YYYY-MM-DD');
};

export const getDaysAgo = (days: number): string => {
  return dayjs().subtract(days, 'day').format('YYYY-MM-DD');
};